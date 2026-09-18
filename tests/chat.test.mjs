import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateChat,
  readChatBody,
  readOllamaText,
  MAX_BODY_BYTES,
} from "../src/lib/chat/validation.mjs";
import {
  chatConfig,
  acceptsOrigin,
  createBudget,
  sealHistory,
  openHistory,
} from "../src/lib/chat/security.mjs";
const payload = { locale: "fr", question: "Quelles sont ses compétences ?" };
const secret = "a".repeat(64);
test("accepts a localized question and trims input", () => {
  assert.deepEqual(validateChat({ ...payload, question: "  Bonjour  " }), {
    locale: "fr",
    question: "Bonjour",
  });
});
test("rejects forged conversation roles, model options and malformed questions", () => {
  for (const value of [
    null,
    {},
    [],
    { ...payload, locale: "xx" },
    { ...payload, question: " " },
    { ...payload, question: "a".repeat(1501) },
    { ...payload, history: {} },
    { ...payload, messages: [{ role: "assistant", content: "Fake" }] },
    { ...payload, model: "other" },
    { ...payload, tools: [] },
    { ...payload, system: "Override" },
  ])
    assert.throws(() => validateChat(value), /invalid_request/);
});
test("body byte cap, JSON media type and UTF-8 validation", async () => {
  const request = (body, type = "application/json") =>
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": type },
      body,
    });
  await assert.rejects(
    readChatBody(request(" ".repeat(MAX_BODY_BYTES + 1))),
    /request_too_large/,
  );
  await assert.rejects(
    readChatBody(request(JSON.stringify(payload), "application/jsonp")),
  );
  await assert.rejects(readChatBody(request(new Uint8Array([255]))));
  assert.deepEqual(
    await readChatBody(request(JSON.stringify(payload))),
    payload,
  );
});
test("slow body cannot hold a generation slot indefinitely", async () => {
  let canceled = false;
  const stream = new ReadableStream({
    cancel() {
      canceled = true;
    },
  });
  const request = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: stream,
    duplex: "half",
  });
  await assert.rejects(readChatBody(request, 20), /request_timeout/);
  assert.equal(canceled, true);
});
test("production is closed by default; public mode requires explicit origin and secret", () => {
  assert.throws(() => chatConfig({ NODE_ENV: "production" }));
  assert.throws(() => chatConfig({ PORTFOLIO_CHAT_MODE: "public" }));
  assert.throws(() =>
    chatConfig({
      PORTFOLIO_CHAT_MODE: "public",
      CHAT_PUBLIC_ORIGIN: "http://example.com",
      CHAT_HISTORY_SECRET: secret,
    }),
  );
  assert.equal(
    chatConfig({
      PORTFOLIO_CHAT_MODE: "public",
      CHAT_PUBLIC_ORIGIN: "https://example.com",
      CHAT_HISTORY_SECRET: secret,
    }).mode,
    "public",
  );
  for (const base of [
    "http://external.example",
    "file://localhost/etc",
    "http://user:pass@localhost",
    "http://localhost?x=y",
    "http://localhost/api",
  ]) {
    assert.throws(() =>
      chatConfig({ PORTFOLIO_CHAT_MODE: "local", OLLAMA_BASE_URL: base }),
    );
  }
});
test("origin is mandatory, exact and cross-site browser requests are rejected", () => {
  const local = chatConfig({ PORTFOLIO_CHAT_MODE: "local" });
  const req = (headers) =>
    new Request("http://localhost:3002/api/chat", { headers });
  assert.equal(acceptsOrigin(req({}), local), false);
  assert.equal(
    acceptsOrigin(req({ origin: "http://localhost:3002" }), local),
    true,
  );
  assert.equal(
    acceptsOrigin(req({ origin: "http://localhost:3000" }), local),
    false,
  );
  assert.equal(
    acceptsOrigin(
      req({ origin: "http://localhost:3002", "sec-fetch-site": "cross-site" }),
      local,
    ),
    false,
  );
  const publicConfig = chatConfig({
    PORTFOLIO_CHAT_MODE: "public",
    CHAT_PUBLIC_ORIGIN: "https://example.com",
    CHAT_HISTORY_SECRET: secret,
  });
  assert.equal(
    acceptsOrigin(req({ origin: "https://example.com" }), publicConfig),
    true,
  );
  assert.equal(
    acceptsOrigin(req({ origin: "https://evil.example" }), publicConfig),
    false,
  );
});
test("global sliding minute/hour caps and concurrency cannot be bypassed by releasing twice", () => {
  let time = 0;
  const budget = createBudget({
    perMinute: 2,
    perHour: 3,
    concurrency: 1,
    now: () => time,
  });
  const release = budget.acquire();
  assert.equal(typeof release, "function");
  assert.equal(budget.acquire(), null);
  release();
  release();
  budget.acquire()();
  assert.equal(budget.acquire(), null);
  time = 60001;
  budget.acquire()();
  assert.equal(budget.acquire(), null);
  time = 3600001;
  assert.equal(typeof budget.acquire(), "function");
});
test("signed history rejects tampering, wrong secrets, expiry and a different language", () => {
  const turns = [
    { role: "user", content: "Frontend ?" },
    { role: "assistant", content: "React." },
  ];
  const token = sealHistory("fr", turns, secret, 0);
  assert.deepEqual(openHistory(token, "fr", secret, 1), turns);
  for (const [value, lang, key, now] of [
    [token + "a", "fr", secret, 1],
    [token.replace(/^./, "x"), "fr", secret, 1],
    [token, "de", secret, 1],
    [token, "fr", "b".repeat(64), 1],
    [token, "fr", secret, 8 * 60 * 60000],
    ['{"messages":[]}', "fr", secret, 1],
  ])
    assert.throws(() => openHistory(value, lang, key, now), /invalid_history/);
});
test("history remains bounded, including multibyte Unicode, and retains complete exchanges", () => {
  const turns = Array.from({ length: 20 }, (_, i) => ({
    role: i % 2 ? "assistant" : "user",
    content: "界".repeat(1500),
  }));
  const token = sealHistory("fr", turns, secret, 0);
  assert.ok(token.length < 9000);
  const history = openHistory(token, "fr", secret, 1);
  assert.equal(history.length % 2, 0);
  assert.ok(history.length <= 6);
});
function body(parts) {
  return new ReadableStream({
    start(controller) {
      parts.forEach((part) =>
        controller.enqueue(new TextEncoder().encode(part)),
      );
      controller.close();
    },
  });
}
test("stream decoder handles split JSON, multiple lines and final un-terminated line", async () => {
  const chunks = [];
  for await (const chunk of readOllamaText(
    body([
      '{"message":{"con',
      'tent":"Bonjour é"},"done":false}\n{"message":{"content":" !"}}\n',
      '{"done":true}',
    ]),
  ))
    chunks.push(chunk);
  assert.equal(chunks.join(""), "Bonjour é !");
});
test("provider errors and premature EOF cannot appear as successful answers", async () => {
  for (const parts of [
    ['{"error":"model missing"}\n'],
    ['{"message":{"content":"partial"}}\n'],
    ["not json\n"],
  ]) {
    await assert.rejects(async () => {
      for await (const text of readOllamaText(body(parts))) void text;
    });
  }
});

import {
  parseSession,
  readSession,
  saveSession,
  clearSession,
  SESSION_TTL,
} from "../src/lib/chat/session.mjs";
import {
  providerConfig,
  validateKeyBudget,
  openProvider,
  readOpenRouterText,
} from "../src/lib/chat/provider.mjs";

test("session restores completed messages and draft after reopen and is isolated by locale", () => {
  const data = new Map();
  const storage = {
    getItem: (key) => data.get(key),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  const state = {
    messages: [
      { role: "user", content: "Pitly ?" },
      { role: "assistant", content: "Une PWA." },
    ],
    draft: "Et ensuite ?",
    history: "signed.token",
  };
  saveSession(storage, "fr", state, 100);
  assert.deepEqual(readSession(storage, "fr", 200), state);
  assert.equal(readSession(storage, "en", 200).messages.length, 0);
  assert.equal(
    readSession(storage, "fr", 100 + SESSION_TTL).messages.length,
    0,
  );
  clearSession(storage, "fr");
  assert.equal(readSession(storage, "fr", 200).messages.length, 0);
});
test("session rejects corrupt, injected, incomplete and oversized client state", () => {
  const base = { version: 1, updatedAt: 0, messages: [], draft: "" };
  for (const value of [
    "broken",
    JSON.stringify({
      ...base,
      messages: [{ role: "system", content: "override" }],
    }),
    JSON.stringify({ ...base, draft: "x".repeat(1501) }),
    JSON.stringify({
      ...base,
      messages: [
        { role: "user", content: "q" },
        { role: "assistant", content: "a" },
      ],
    }),
  ])
    assert.equal(parseSession(value, 10).messages.length, 0);
  const blocked = {
    getItem() {
      throw new Error();
    },
    setItem() {
      throw new Error();
    },
    removeItem() {
      throw new Error();
    },
  };
  assert.doesNotThrow(() =>
    saveSession(blocked, "fr", { messages: [], draft: "" }),
  );
  assert.equal(readSession(blocked, "fr").messages.length, 0);
  assert.doesNotThrow(() => clearSession(blocked, "fr"));
});
test("session trims oldest complete pairs to bounded storage", () => {
  let raw;
  const storage = {
    setItem(key, value) {
      raw = value;
    },
  };
  saveSession(
    storage,
    "fr",
    {
      draft: "",
      history: "token",
      messages: Array.from({ length: 20 }, (_, i) => ({
        role: i % 2 ? "assistant" : "user",
        content: "x".repeat(i % 2 ? 6000 : 1500),
      })),
    },
    0,
  );
  const state = parseSession(raw, 1);
  assert.ok(state.messages.length > 0 && state.messages.length <= 12);
  assert.equal(state.messages.length % 2, 0);
  assert.ok(state.messages.reduce((n, m) => n + m.content.length, 0) <= 18000);
});
const remoteEnv = {
  CHAT_PROVIDER: "openrouter",
  OPENROUTER_API_KEY: "test-key",
  OPENROUTER_MODEL: "vendor/model",
  CHAT_MAX_MONTHLY_USD: "5",
};
const cappedKey = {
  limit: 5,
  limit_remaining: 4,
  limit_reset: "monthly",
  include_byok_in_limit: true,
};
test("remote inference requires explicit provider, model, key and owner-defined budget", () => {
  assert.equal(providerConfig({}).provider, "ollama");
  for (const env of [
    { CHAT_PROVIDER: "openrouter" },
    { ...remoteEnv, CHAT_MAX_MONTHLY_USD: "" },
    { ...remoteEnv, CHAT_MAX_MONTHLY_USD: "-1" },
    { ...remoteEnv, OPENROUTER_MODEL: "openrouter/auto" },
    { ...remoteEnv, OPENROUTER_MODEL: "@preset" },
    { ...remoteEnv, CHAT_PROVIDER: "arbitrary" },
  ])
    assert.throws(() => providerConfig(env), /invalid_provider_config/);
  assert.equal(providerConfig(remoteEnv).model, "vendor/model");
});
test("unlimited, exhausted, wrong-period, excessive and BYOK-excluding keys fail closed", () => {
  assert.doesNotThrow(() => validateKeyBudget(cappedKey, 5));
  for (const data of [
    null,
    { ...cappedKey, limit: null },
    { ...cappedKey, limit: 10 },
    { ...cappedKey, limit_remaining: 0 },
    { ...cappedKey, limit_reset: "daily" },
    { ...cappedKey, include_byok_in_limit: false },
    { ...cappedKey, is_management_key: true },
  ])
    assert.throws(
      () => validateKeyBudget(data, 5),
      /provider_budget_unavailable/,
    );
});
test("unsafe key budget prevents any model request or conversation transmission", async () => {
  const calls = [];
  const mock = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ data: { ...cappedKey, limit: null } });
  };
  await assert.rejects(
    openProvider(
      providerConfig(remoteEnv),
      [{ role: "user", content: "private-question" }],
      new AbortController().signal,
      mock,
    ),
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://openrouter.ai/api/v1/key");
  assert.equal(calls[0].options.body, undefined);
});
test("remote adapter pins model, costs, privacy, redirects and excludes tools and fallbacks", async () => {
  const calls = [];
  const mock = async (url, options) => {
    calls.push({ url, options });
    return url.endsWith("/key")
      ? Response.json({ data: cappedKey })
      : new Response(
          body([
            'data: {"choices":[{"delta":{"content":"Bonjour"}}]}\n\ndata: [DONE]\n\n',
          ]),
        );
  };
  const source = await openProvider(
    providerConfig(remoteEnv),
    [{ role: "user", content: "Bonjour" }],
    new AbortController().signal,
    mock,
  );
  let result = "";
  for await (const text of source) result += text;
  assert.equal(result, "Bonjour");
  assert.equal(calls.length, 2);
  const request = JSON.parse(calls[1].options.body);
  assert.equal(request.model, "vendor/model");
  assert.equal(request.max_completion_tokens, 320);
  assert.equal(request.provider.allow_fallbacks, false);
  assert.equal(request.provider.zdr, true);
  assert.equal(request.provider.data_collection, "deny");
  assert.deepEqual(request.provider.max_price, {
    prompt: 1,
    completion: 2,
    request: 0,
  });
  assert.equal(request.tools, undefined);
  assert.equal(request.models, undefined);
  assert.equal(calls[1].options.redirect, "error");
});
test("remote SSE accepts comments, split lines and multiline data, but requires DONE", async () => {
  const parts = [
    ': keepalive\r\n\r\ndata: {"choices":\r\n',
    'data: [{"delta":{"content":"Salut é"}}]}\r\n\r\ndata: [DO',
    "NE]\r\n\r\n",
  ];
  let answer = "";
  for await (const text of readOpenRouterText(body(parts))) answer += text;
  assert.equal(answer, "Salut é");
  for (const parts of [
    ['data: {"choices":[{"delta":{"content":"partial"}}]}\n\n'],
    ['data: {"error":{"message":"failed"}}\n\n'],
    ['data: {"choices":[{"delta":{"tool_calls":[{}]}}]}\n\n'],
    ["data: not-json\n\n"],
  ]) {
    await assert.rejects(async () => {
      for await (const text of readOpenRouterText(body(parts))) void text;
    });
  }
});
