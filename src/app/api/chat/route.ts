import { readChatBody } from "@/lib/chat/validation.mjs";
import {
  acceptsOrigin,
  chatConfig,
  createBudget,
  openHistory,
  sealHistory,
} from "@/lib/chat/security.mjs";
import { openProvider } from "@/lib/chat/provider.mjs";
import { systemPrompt } from "@/lib/chat/context";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const budget = createBudget();
function error(code: string, status: number) {
  return Response.json(
    { error: code },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": "60" } : {}),
      },
    },
  );
}
export async function POST(request: Request) {
  let config;
  try {
    config = chatConfig();
  } catch {
    return error("unavailable", 503);
  }
  if (!acceptsOrigin(request, config)) return error("invalid_origin", 403);
  const release = budget.acquire();
  if (!release) return error("busy", 429);
  let input, messages;
  try {
    input = await readChatBody(request);
    messages = [
      ...openHistory(input.history, input.locale, config.secret),
      { role: "user", content: input.question },
    ];
  } catch (cause) {
    release();
    return error(
      cause instanceof Error && cause.message === "invalid_history"
        ? "expired"
        : "invalid_request",
      400,
    );
  }
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 90000);
  const onAbort = () => abort.abort();
  request.signal.addEventListener("abort", onAbort, { once: true });
  if (request.signal.aborted) abort.abort();
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(timer);
    request.signal.removeEventListener("abort", onAbort);
    release();
  };
  try {
    const source = await openProvider(
      config,
      [{ role: "system", content: systemPrompt(input.locale) }, ...messages],
      abort.signal,
    );
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let answer = "";
        try {
          for await (const chunk of source) {
            abort.signal.throwIfAborted();
            answer += chunk;
            if (answer.length > 6000) throw new Error("response_too_large");
            controller.enqueue(
              encoder.encode(JSON.stringify({ text: chunk }) + "\n"),
            );
          }
          abort.signal.throwIfAborted();
          if (!answer.trim()) throw new Error("empty_response");
          const history = sealHistory(
            input.locale,
            [...messages, { role: "assistant", content: answer }],
            config.secret,
          );
          controller.enqueue(
            encoder.encode(JSON.stringify({ done: true, history }) + "\n"),
          );
          controller.close();
        } catch {
          abort.abort();
          try {
            controller.enqueue(encoder.encode('{"error":"unavailable"}\n'));
            controller.close();
          } catch {
            /* disconnected visitor */
          }
        } finally {
          cleanup();
        }
      },
      cancel() {
        abort.abort();
        cleanup();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    abort.abort();
    cleanup();
    return error("unavailable", 503);
  }
}
