"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";

export default function CopyEmail() {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-btn bg-ink px-5 py-3 font-sans text-sm font-bold text-white md:px-7 md:py-4 md:text-lg"
    >
      <span className="relative inline-block h-5 w-4">
        <span className="absolute left-0 top-0 h-4 w-3.5 rounded-[3px] border-2 border-orange" />
        <span className="absolute left-1 top-1 h-4 w-3.5 rounded-[2px] bg-orange" />
      </span>
      {copied ? t("copied") : t("copyEmail")}
    </button>
  );
}
