"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
export default function DetailModal({
  title,
  label,
  children,
  className = "",
}: {
  title: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const t = useTranslations("common");
  useEffect(() => {
    if (!open) return;
    const el = dialog.current!;
    const previous = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    document.dispatchEvent(
      new CustomEvent("portfolio:modal", { detail: true }),
    );
    return () => {
      el.close();
      trigger.current?.focus({ preventScroll: true });
      document.body.style.overflow = previous;
      document.dispatchEvent(
        new CustomEvent("portfolio:modal", { detail: false }),
      );
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`detail-trigger ${className}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {label}
        <PlusIcon aria-hidden="true" />
      </button>
      {open && (
        <dialog
          ref={dialog}
          className="detail-dialog"
          aria-labelledby={id}
          onCancel={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              const r = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < r.left ||
                event.clientX > r.right ||
                event.clientY < r.top ||
                event.clientY > r.bottom
              )
                setOpen(false);
            }
          }}
        >
          <div className="detail-header">
            <h2 id={id}>{title}</h2>
            <button
              type="button"
              autoFocus
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              <XMarkIcon aria-hidden="true" />
            </button>
          </div>
          <div className="detail-body">{children}</div>
        </dialog>
      )}
    </>
  );
}
