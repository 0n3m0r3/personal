"use client";

import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { classNames } from "@/utils/classNames";

type Skill = { title: string; body: string };
type Formation = { title: string; meta: string };

export default function Skills() {
  const t = useTranslations("skills");
  const [tab, setTab] = useState<"knowHow" | "education">("knowHow");
  const items = t.raw("items") as Skill[];
  const formations = t.raw("formations") as Formation[];

  return (
    <section className="page-gutter py-8 md:py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:justify-center">
        {(["knowHow", "education"] as const).map((key) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={classNames(
                "h-14 flex-1 rounded-card border border-soft-border px-6 font-sans text-lg font-semibold md:h-[70px] md:max-w-[408px] md:text-[22px]",
                active
                  ? "bg-primary-dark text-white"
                  : "bg-white text-primary-dark"
              )}
            >
              {t(key)}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2">
        {tab === "knowHow"
          ? items.map((item, index) => (
              <Disclosure key={item.title} defaultOpen={index === 0}>
                {({ open }) => (
                  <div
                    className={classNames(
                      "rounded-card border border-soft-border px-5 py-6 md:px-8 md:py-8",
                      open ? "bg-primary-dark text-white" : "bg-white text-ink"
                    )}
                  >
                    <Disclosure.Button className="flex w-full items-start gap-4 text-left">
                      <span
                        className={classNames(
                          "flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] md:size-[70px]",
                          open ? "bg-skill-icon" : "bg-skill-icon"
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/figma/skill-icon.png"
                          alt=""
                          className="size-8 object-contain md:size-[42px]"
                        />
                      </span>
                      <span className="flex min-w-0 flex-1 items-start justify-between gap-3">
                        <span className="font-sans text-lg font-semibold leading-snug md:text-[26px] md:leading-[1.15]">
                          {item.title}
                        </span>
                        <span
                          className={classNames(
                            "mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border md:size-16",
                            open
                              ? "border-white/30 text-white"
                              : "border-soft-border text-ink"
                          )}
                        >
                          <svg
                            viewBox="0 0 14 15"
                            className="size-3.5"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M1 7.5h12M8.5 1.5 13 7.5l-4.5 6"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="mt-4 pl-[68px] font-sans text-sm leading-relaxed md:pl-[86px] md:text-base">
                      {item.body}
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            ))
          : formations.map((item) => (
              <article
                key={item.title}
                className="rounded-card border border-soft-border bg-primary-dark px-6 py-8 text-white md:col-span-2 md:px-10"
              >
                <h3 className="font-sans text-xl font-semibold md:text-[30px]">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-base text-orange md:text-lg">
                  {item.meta}
                </p>
              </article>
            ))}
      </div>
    </section>
  );
}
