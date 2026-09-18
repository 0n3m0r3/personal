"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });
export default function ChatLauncher() {
  const locale = useLocale();
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="chat-launcher"
        aria-label={t("open")}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className="chat-robot" aria-hidden="true" />
      </button>
      {open && <ChatPanel key={locale} onClose={() => setOpen(false)} />}
    </>
  );
}
