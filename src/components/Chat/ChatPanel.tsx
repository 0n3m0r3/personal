"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  StopIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { readSession, saveSession, clearSession } from "@/lib/chat/session.mjs";
type Message = { role: "user" | "assistant"; content: string };
export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("chat");
  const locale = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const [initial] = useState(() => {
    try {
      return readSession(window.sessionStorage, locale);
    } catch {
      return { messages: [], draft: "", history: undefined };
    }
  });
  const historyToken = useRef<string | undefined>(initial.history);
  const completed = useRef<Message[]>(initial.messages);
  const draft = useRef(initial.draft);
  function persist() {
    try {
      saveSession(window.sessionStorage, locale, {
        messages: completed.current,
        history: historyToken.current,
        draft: draft.current,
      });
    } catch {}
  }
  function reset() {
    cancelGeneration.current?.();
    historyToken.current = undefined;
    completed.current = [];
    draft.current = "";
    setMessages([]);
    setQuestion("");
    setFailure("");
    try {
      clearSession(window.sessionStorage, locale);
    } catch {}
    dialog.current?.querySelector("textarea")?.focus();
  }
  const abort = useRef<AbortController | null>(null);
  const cancelGeneration = useRef<(() => void) | null>(null);
  const [messages, setMessages] = useState<Message[]>(initial.messages);
  const [question, setQuestion] = useState<string>(initial.draft);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    document.dispatchEvent(
      new CustomEvent("portfolio:modal", { detail: true }),
    );
    dialog.current?.querySelector("textarea")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      abort.current?.abort();
      abort.current = null;
      cancelGeneration.current = null;
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
      document.dispatchEvent(
        new CustomEvent("portfolio:modal", { detail: false }),
      );
    };
  }, []);
  useEffect(() => {
    const el = transcript.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || loading) return;
    const history = messages.slice(-12);
    const user: Message = { role: "user", content: question.trim() };
    const payload = [...history, user];
    draft.current = user.content;
    persist();
    setMessages([...payload, { role: "assistant", content: "" }]);
    setQuestion("");
    setLoading(true);
    setFailure("");
    const controller = new AbortController();
    abort.current = controller;
    cancelGeneration.current = () => {
      controller.abort();
      abort.current = null;
      cancelGeneration.current = null;
      setMessages(history);
      setQuestion((current) => current || user.content);
      setFailure(t("stopped"));
      setLoading(false);
    };
    let answer = "";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          question: user.content,
          history: historyToken.current,
        }),
        signal: controller.signal,
      });
      controller.signal.throwIfAborted();
      if (!response.ok || !response.body) {
        const failure = await response.json().catch(() => ({}));
        if (failure.error === "expired") {
          historyToken.current = undefined;
          completed.current = [];
          persist();
        }
        throw new Error(
          response.status === 429
            ? "busy"
            : failure.error === "expired"
              ? "expired"
              : "unavailable",
        );
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let complete = false;
      let nextHistory: string | undefined;
      try {
        while (true) {
          const { done, value } = await reader.read();
          controller.signal.throwIfAborted();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let newline;
          while ((newline = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newline);
            buffer = buffer.slice(newline + 1);
            if (!line) continue;
            const event = JSON.parse(line);
            if (event.error) throw new Error(event.error);
            if (event.done && typeof event.history === "string") {
              complete = true;
              nextHistory = event.history;
            }
            if (event.text && abort.current === controller) {
              answer += event.text;
              setMessages([...payload, { role: "assistant", content: answer }]);
            }
          }
        }
        if (!complete) throw new Error("unavailable");
        historyToken.current = nextHistory;
        completed.current = [
          ...payload,
          { role: "assistant", content: answer },
        ];
        draft.current = "";
        persist();
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
    } catch (cause) {
      if (abort.current !== controller) return;
      setFailure(
        cause instanceof Error && cause.name === "AbortError"
          ? t("stopped")
          : t(
              cause instanceof Error && cause.message === "busy"
                ? "busy"
                : cause instanceof Error && cause.message === "expired"
                  ? "expired"
                  : "error",
            ),
      );
      // An interrupted answer must not become trusted conversational history.
      setMessages(
        cause instanceof Error && cause.message === "expired"
          ? []
          : payload.slice(0, -1),
      );
      setQuestion((current) => current || user.content);
    } finally {
      if (abort.current === controller) {
        setLoading(false);
        abort.current = null;
        cancelGeneration.current = null;
      }
    }
  }
  return (
    <dialog
      ref={dialog}
      className="chat-dialog"
      aria-labelledby="chat-title"
      aria-describedby="chat-notice"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            onClose();
        }
      }}
    >
      <div className="chat-shell">
        <header className="chat-header">
          <div className="chat-identity">
            <span className="chat-avatar" aria-hidden="true">
              <span className="chat-robot" />
            </span>
            <h2 id="chat-title">{t("title")}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={t("close")}>
            <XMarkIcon aria-hidden="true" />
          </button>
        </header>
        <p id="chat-notice" className="chat-notice">
          <ShieldCheckIcon aria-hidden="true" />
          <span>{t("notice")}</span>
        </p>
        <div
          ref={transcript}
          className="chat-messages"
          role="log"
          aria-live={loading ? "off" : "polite"}
          aria-busy={loading}
          aria-label={t("conversation")}
        >
          <p className="chat-message">{t("welcome")}</p>
          {messages.map((message, index) => (
            <p
              className={`chat-message chat-message--${message.role}`}
              key={index}
            >
              <strong>
                {t(message.role === "user" ? "you" : "assistant")}
              </strong>
              {message.content || t("thinking")}
            </p>
          ))}
        </div>
        {failure && (
          <p className="chat-error" role="alert">
            {failure}
          </p>
        )}
        <form className="chat-form" onSubmit={send}>
          <label className="sr-only" htmlFor="chat-question">
            {t("question")}
          </label>
          <textarea
            id="chat-question"
            autoFocus
            value={question}
            maxLength={1500}
            readOnly={loading}
            placeholder={t("placeholder")}
            onChange={(event) => {
              setQuestion(event.target.value);
              if (!loading) {
                draft.current = event.target.value;
                persist();
              }
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                if (!loading) event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          {loading ? (
            <button
              key="stop"
              type="button"
              onClick={() => cancelGeneration.current?.()}
            >
              <StopIcon aria-hidden="true" />
              <span className="sr-only">{t("stop")}</span>
            </button>
          ) : (
            <button key="send" type="submit" disabled={!question.trim()}>
              <PaperAirplaneIcon aria-hidden="true" />
              <span className="sr-only">{t("send")}</span>
            </button>
          )}
        </form>
        <div className="chat-session-tools">
          <button type="button" className="chat-reset" onClick={reset}>
            <ArrowPathIcon aria-hidden="true" />
            {t("reset")}
          </button>
        </div>
        <p className="chat-privacy">{t("privacy")}</p>
      </div>
    </dialog>
  );
}
