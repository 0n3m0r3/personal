const PREFIX = "portfolio-chat:v1:";
export const SESSION_TTL = 8 * 60 * 60 * 1000;
const empty = () => ({ messages: [], draft: "", history: undefined });
export function parseSession(raw, now = Date.now()) {
  try {
    if (!raw || raw.length > 100000) return empty();
    const data = JSON.parse(raw);
    if (
      data.version !== 1 ||
      !Number.isFinite(data.updatedAt) ||
      data.updatedAt > now ||
      now - data.updatedAt >= SESSION_TTL ||
      !Array.isArray(data.messages) ||
      data.messages.length > 12 ||
      data.messages.length % 2 ||
      typeof data.draft !== "string" ||
      data.draft.length > 1500 ||
      (data.history !== undefined &&
        (typeof data.history !== "string" || data.history.length > 12000))
    )
      return empty();
    let size = 0;
    for (const [i, message] of data.messages.entries()) {
      if (
        message?.role !== (i % 2 ? "assistant" : "user") ||
        typeof message.content !== "string" ||
        !message.content.trim() ||
        message.content.length > (i % 2 ? 6000 : 1500)
      )
        return empty();
      size += message.content.length;
    }
    if (size > 18000 || (data.messages.length && !data.history)) return empty();
    return {
      messages: data.messages.map(({ role, content }) => ({ role, content })),
      draft: data.draft,
      history: data.history,
    };
  } catch {
    return empty();
  }
}
export function readSession(storage, locale, now = Date.now()) {
  try {
    return parseSession(storage.getItem(PREFIX + locale), now);
  } catch {
    return empty();
  }
}
export function saveSession(storage, locale, state, now = Date.now()) {
  let messages = state.messages.slice(-12);
  while (messages.reduce((sum, m) => sum + m.content.length, 0) > 18000)
    messages = messages.slice(2);
  const value = {
    version: 1,
    updatedAt: now,
    messages,
    history: state.history,
    draft: state.draft.slice(0, 1500),
  };
  try {
    storage.setItem(PREFIX + locale, JSON.stringify(value));
  } catch {
    /* memory-only fallback when storage is blocked */
  }
}
export function clearSession(storage, locale) {
  try {
    storage.removeItem(PREFIX + locale);
  } catch {
    /* storage may be unavailable */
  }
}
