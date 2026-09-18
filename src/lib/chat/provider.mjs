import { readOllamaText } from "./validation.mjs";

export function providerConfig(env = process.env) {
  const provider = env.CHAT_PROVIDER || "ollama";
  if (provider === "ollama")
    return { provider, model: env.OLLAMA_MODEL || "qwen3:8b" };
  const monthlyBudget = Number(env.CHAT_MAX_MONTHLY_USD);
  if (
    provider !== "openrouter" ||
    !env.OPENROUTER_API_KEY ||
    !/^[a-z0-9][a-z0-9._-]*\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(
      env.OPENROUTER_MODEL || "",
    ) ||
    env.OPENROUTER_MODEL?.startsWith("openrouter/") ||
    !Number.isFinite(monthlyBudget) ||
    monthlyBudget <= 0
  )
    throw new Error("invalid_provider_config");
  return {
    provider,
    model: env.OPENROUTER_MODEL,
    apiKey: env.OPENROUTER_API_KEY,
    monthlyBudget,
  };
}

export function validateKeyBudget(data, maximum) {
  if (
    !data ||
    !Number.isFinite(data.limit) ||
    data.limit <= 0 ||
    data.limit > maximum ||
    data.limit_reset !== "monthly" ||
    !Number.isFinite(data.limit_remaining) ||
    data.limit_remaining <= 0 ||
    data.include_byok_in_limit !== true ||
    data.is_management_key ||
    data.is_provisioning_key
  )
    throw new Error("provider_budget_unavailable");
}

async function limitedJson(response) {
  if (!response.ok || !response.body) throw new Error("provider_unavailable");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let text = "",
    size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 65536) throw new Error("provider_error");
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

/** The only remote destination is fixed here, never supplied by a visitor. No retries or model fallback. */
export async function openProvider(config, messages, signal, fetcher = fetch) {
  if (config.provider === "ollama") {
    const response = await fetcher(new URL("/api/chat", config.base), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        stream: true,
        think: false,
        messages,
        options: { temperature: 0.2, num_predict: 320, num_ctx: 8192 },
      }),
      signal,
      cache: "no-store",
      redirect: "error",
    });
    if (!response.ok || !response.body) throw new Error("provider_unavailable");
    return readOllamaText(response.body);
  }
  if (config.provider !== "openrouter") throw new Error("invalid_provider");
  const headers = {
    Authorization: "Bearer " + config.apiKey,
    "Content-Type": "application/json",
  };
  // Provider-enforced monthly cap survives restarts and multiple application instances.
  // Refuse unlimited, exhausted, mismatched or unverifiable keys before sending any CV/question.
  const key = await limitedJson(
    await fetcher("https://openrouter.ai/api/v1/key", {
      headers,
      signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
      cache: "no-store",
      redirect: "error",
    }),
  );
  validateKeyBudget(key.data, config.monthlyBudget);
  const response = await fetcher(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers,
      signal,
      cache: "no-store",
      redirect: "error",
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: true,
        max_completion_tokens: 320,
        temperature: 0.2,
        provider: {
          allow_fallbacks: false,
          require_parameters: true,
          data_collection: "deny",
          zdr: true,
          max_price: { prompt: 1, completion: 2, request: 0 },
        },
      }),
    },
  );
  if (!response.ok || !response.body) throw new Error("provider_unavailable");
  return readOpenRouterText(response.body);
}

/** SSE framing handles comments, multiline data and split UTF-8/CRLF. Missing DONE is an error. */
export async function* readOpenRouterText(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let buffer = "",
    data = [],
    finished = false,
    size = 0;
  function parse() {
    const payload = data.join("\n");
    data = [];
    if (!payload) return "";
    if (payload === "[DONE]") {
      finished = true;
      return "";
    }
    const event = JSON.parse(payload);
    if (
      event.error ||
      event.choices?.some(
        (choice) =>
          choice.delta?.tool_calls ||
          choice.delta?.function_call ||
          choice.finish_reason === "error",
      )
    )
      throw new Error("provider_error");
    return typeof event.choices?.[0]?.delta?.content === "string"
      ? event.choices[0].delta.content
      : "";
  }
  try {
    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1048576) throw new Error("provider_error");
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 65536) throw new Error("provider_error");
      let newline;
      while (!finished && (newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (!line) {
          const text = parse();
          if (text) yield text;
        } else if (line.startsWith("data:"))
          data.push(line.slice(5).replace(/^ /, ""));
        if (data.reduce((sum, part) => sum + part.length, 0) > 65536)
          throw new Error("provider_error");
      }
    }
    if (!finished) throw new Error("provider_error");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
