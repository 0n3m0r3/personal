import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { providerConfig } from "./provider.mjs";

const localSecret = randomBytes(32).toString("hex");
const loopback = (host) => ["localhost", "127.0.0.1", "[::1]"].includes(host);

export function chatConfig(env = process.env) {
  const mode =
    env.PORTFOLIO_CHAT_MODE ||
    (env.NODE_ENV === "development" ? "local" : "off");
  if (!["local", "public"].includes(mode)) throw new Error("disabled");
  const base = new URL(env.OLLAMA_BASE_URL || "http://127.0.0.1:11434");
  if (
    !loopback(base.hostname) ||
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    base.pathname !== "/"
  )
    throw new Error("invalid_provider");
  let origin;
  if (mode === "public") {
    const url = new URL(env.CHAT_PUBLIC_ORIGIN || "");
    if (
      url.protocol !== "https:" ||
      url.origin !== env.CHAT_PUBLIC_ORIGIN ||
      !env.CHAT_HISTORY_SECRET ||
      env.CHAT_HISTORY_SECRET.length < 32
    )
      throw new Error("invalid_public_config");
    origin = url.origin;
  }
  return {
    mode,
    origin,
    base,
    secret: env.CHAT_HISTORY_SECRET || localSecret,
    ...providerConfig(env),
  };
}

export function acceptsOrigin(request, config) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    !["same-origin", null].includes(request.headers.get("sec-fetch-site"))
  )
    return false;
  try {
    const url = new URL(origin);
    return config.mode === "public"
      ? origin === config.origin
      : loopback(url.hostname) && origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/** Fixed memory footprint; global per-process caps deliberately do not trust forwarded IP headers. */
export function createBudget({
  perMinute = 8,
  perHour = 60,
  concurrency = 1,
  now = Date.now,
} = {}) {
  let timestamps = [],
    active = 0;
  return {
    acquire() {
      const time = now();
      timestamps = timestamps.filter((at) => at > time - 3600000);
      if (
        active >= concurrency ||
        timestamps.length >= perHour ||
        timestamps.filter((at) => at > time - 60000).length >= perMinute
      )
        return null;
      timestamps.push(time);
      active++;
      let released = false;
      return () => {
        if (!released) {
          released = true;
          active--;
        }
      };
    },
  };
}
const mac = (value, secret) =>
  createHmac("sha256", secret).update(value).digest();

/** Signed, not encrypted. Only server-issued completed exchanges become model history. */
export function sealHistory(locale, messages, secret, now = Date.now()) {
  let turns = messages
    .slice(-6)
    .map(({ role, content }) => ({ role, content: content.slice(0, 1500) }));
  while (turns.reduce((sum, turn) => sum + turn.content.length, 0) > 4000)
    turns = turns.slice(2);
  const encode = () =>
    Buffer.from(
      JSON.stringify({
        v: 1,
        locale,
        expires: now + 8 * 60 * 60000,
        messages: turns,
      }),
    ).toString("base64url");
  let value = encode();
  while (value.length > 8800 && turns.length) {
    turns = turns.slice(2);
    value = encode();
  }
  return value + "." + mac(value, secret).toString("base64url");
}
export function openHistory(token, locale, secret, now = Date.now()) {
  if (!token) return [];
  try {
    if (typeof token !== "string" || token.length > 12000) throw new Error();
    const parts = token.split(".");
    if (
      parts.length !== 2 ||
      !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part))
    )
      throw new Error();
    const signature = Buffer.from(parts[1], "base64url");
    const expected = mac(parts[0], secret);
    if (
      signature.length !== expected.length ||
      !timingSafeEqual(signature, expected)
    )
      throw new Error();
    const data = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8"),
    );
    if (
      data.v !== 1 ||
      data.locale !== locale ||
      !Number.isFinite(data.expires) ||
      data.expires <= now ||
      !Array.isArray(data.messages) ||
      data.messages.length > 6 ||
      data.messages.length % 2
    )
      throw new Error();
    let total = 0;
    for (const [i, message] of data.messages.entries()) {
      if (
        message.role !== (i % 2 ? "assistant" : "user") ||
        typeof message.content !== "string" ||
        !message.content.trim() ||
        message.content.length > 1500
      )
        throw new Error();
      total += message.content.length;
    }
    if (total > 4000) throw new Error();
    return data.messages;
  } catch {
    throw new Error("invalid_history");
  }
}
