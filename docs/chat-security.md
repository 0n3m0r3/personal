# Chatbot: architecture and public exposure boundary

## Active runtime
Browser -> Next.js POST /api/chat -> loopback Ollama -> existing qwen3:8b.
The model is Louka's assistant, never Louka himself.
For unknown facts it acknowledges the missing knowledge and suggests contacting
Louka directly, without describing omissions in the CV. It must not estimate
age, availability or rates. This is prompt guidance, not a deterministic guarantee. Its server-side prompt contains
public CV-derived portfolio data. It is not fine-tuned and uses no vector database.
It receives the question and up to three completed exchanges. Replies stream as
plain text escaped by React, with no HTML/Markdown execution.

No tools, filesystem/browser access, outgoing messages or code execution are
available. Credentials are used only by the server's HTTP adapter, never placed
in the prompt or browser. The server chooses model, endpoint and generation settings.
Ollama accepts loopback endpoints only; redirects are rejected.

## Session persistence
Completed exchanges, the signed history token and current draft are saved in
sessionStorage, separately per tab and language. They survive dialog closure and
page reload. They expire after eight hours of inactivity; the browser normally
clears them when the tab session ends, although browser session restoration can
retain them. The dialog exposes an explicit clear button.
At most twelve displayed messages / 18,000 characters plus a 1,500-character
draft are stored. An interrupted reply is never saved as completed history;
the pending question is restored as a draft. Corrupt/oversized/expired data is
discarded; blocked storage falls back to the open dialog's memory.
There is no login, database, localStorage or application message logging.
The server never trusts a browser transcript: only its HMAC-signed history is
accepted. Storage is not encrypted and is accessible to same-origin scripts.

## Enforced server controls
- Production defaults to disabled; development defaults to local mode.
- Local production-build preview explicitly uses PORTFOLIO_CHAT_MODE=local.
- Public mode requires PORTFOLIO_CHAT_MODE=public, an exact HTTPS
  CHAT_PUBLIC_ORIGIN and a CHAT_HISTORY_SECRET of at least 32 random characters.
  No public configuration or credential was provisioned in this task.
- Origin is mandatory and cross-site Fetch Metadata rejected. This protects
  browsers; direct HTTP clients can forge these headers.
- One concurrent request, eight admissions per sliding minute and sixty per
  sliding hour, shared by all visitors in one process. Invalid bodies also
  consume admission budget. Client X-Forwarded-For is not trusted.
- JSON only, 16 KB body and five-second body-read timeout; question <=1,500
  characters. Unknown keys, including model/tools/messages, are rejected.
- HMAC-SHA256 history is bound to language and expires after eight hours.
  Only completed exchanges are signed: at most six messages, 4,000 characters
  and a bounded encoded size. Tokens are signed, not encrypted or authentication;
  they can be replayed until expiry. Local process restart rotates its secret.
- Output <=320 tokens / 6,000 characters; generation <=90 seconds; temperature
  0.2. Ollama context is 8,192 tokens. Closing/stopping aborts the upstream request.
- Provider failures or incomplete streams are errors, never canned successes.

## Optional OpenRouter adapter — inactive
No account, key, model or monetary budget was chosen. CHAT_PROVIDER defaults to
ollama. Remote use requires CHAT_PROVIDER=openrouter, OPENROUTER_API_KEY,
OPENROUTER_MODEL and CHAT_MAX_MONTHLY_USD. Only a fixed vendor/model slug is accepted;
no auto-router, preset, visitor-selected model, tool or plugin.
Before every generation, the server requests the key's metadata from the fixed
https://openrouter.ai/api/v1/key endpoint and refuses to proceed unless:
- credit limit is finite, positive, resets monthly and is <= the configured budget;
- remaining credit is positive and BYOK usage is included in that limit;
- it is not a management/provisioning key.
Failure to verify the cap means no question/CV is sent. The dedicated key's limit
is enforced by OpenRouter rather than an in-memory spend estimate. Keep it exclusive
to this application and do not alter its cap outside the intended budget.

The fixed chat endpoint receives a server-pinned model, max_completion_tokens=320,
no fallback/retry, require_parameters=true, data_collection=deny, zdr=true and
max_price={prompt:1, completion:2, request:0}: at most $1/M input tokens, $2/M output
tokens, no per-request fee. Models/providers incompatible with these filters fail
closed. SSE input and event sizes are bounded; error/tool-call/incomplete streams fail.
The adapter is tested with mocks only. Real key metadata, chosen model compatibility,
billing behavior and account retention settings must be verified before activation.
Provider-side caps are the intended spending control; this is not an independent
guarantee against provider accounting delays or billing errors. Aborting can still
bill a full bounded completion when the underlying provider cannot cancel.
Privacy routing filters do not certify the account's own logging/retention settings.
Before remote use, update the visitor privacy notice to disclose the selected
processor and verify its data policies.

## Before enabling public access
In-memory quotas reset on restart and multiply across workers; an attacker could
exhaust the shared quota. Public hosting needs request/body/connection limits and
per-client quotas at a trusted reverse proxy; use a shared store across multiple
processes. Keep Ollama private if selected. Add aggregate abuse/error monitoring,
without recording conversations by default. Review framework dependencies and
hosting security configuration before deployment. No deployment was performed.

The prompt asks for CV-grounded answers and rejects unrelated requests. This is
not a security boundary: prompt injection, factual extrapolation and hallucinations
remain possible. A local test correctly preserved identity/context but extrapolated
cloud providers for a project; the prompt now explicitly prohibits transferring
general skills to a project's facts. No claim of perfect scope adherence is made.
No tools/secrets in model context limits consequences; hard quotas, output and
provider credit limits address resource and cost abuse.

## Verification and sources
node --test tests/chat.test.mjs covers input/media/UTF-8 validation, byte/time
limits, production gate, origins, quotas, signed-history integrity/expiry,
session persistence/trim/corruption/storage failure, remote configuration, fail-closed
key budgets, bounded adapter requests and SSE parsing/errors. Browser observations
are in design-validation.md.

- [Ollama chat API](https://docs.ollama.com/api/chat)
- [OpenRouter current key metadata](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key)
- [OpenRouter key credit limits](https://openrouter.ai/docs/api_reference/authentication)
- [Provider routing and price/privacy filters](https://openrouter.ai/docs/guides/routing/provider-selection)
- [Streaming and cancellation](https://openrouter.ai/docs/api_reference/streaming)
- [OWASP prompt injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
