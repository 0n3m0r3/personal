export const MAX_BODY_BYTES = 16000;
export function validateChat(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some(
      (key) => !["locale", "question", "history"].includes(key),
    ) ||
    !["fr", "en", "de"].includes(value.locale) ||
    typeof value.question !== "string" ||
    !value.question.trim() ||
    value.question.trim().length > 1500 ||
    (value.history !== undefined &&
      (typeof value.history !== "string" || value.history.length > 12000))
  )
    throw new Error("invalid_request");
  return {
    locale: value.locale,
    question: value.question.trim(),
    ...(value.history ? { history: value.history } : {}),
  };
}
/** Bound bytes AND read time, including chunked or dishonest Content-Length requests. */
export async function readChatBody(request, timeoutMs = 5000) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
      "application/json" ||
    !request.body
  )
    throw new Error("invalid_request");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let length = 0,
    body = "",
    timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, timeoutMs);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new Error("request_timeout");
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) throw new Error("request_too_large");
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return validateChat(JSON.parse(body));
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
/** Ollama streams NDJSON; network chunks do not necessarily align with JSON lines. */
export async function* readOllamaText(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;
  function parse(line) {
    const event = JSON.parse(line);
    if (event.error) throw new Error("provider_error");
    if (event.done === true) finished = true;
    return typeof event.message?.content === "string"
      ? event.message.content
      : "";
  }
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 65536) throw new Error("provider_error");
      let newline;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) {
          const text = parse(line);
          if (text) yield text;
        }
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) {
      const text = parse(buffer);
      if (text) yield text;
    }
    if (!finished) throw new Error("provider_error");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
