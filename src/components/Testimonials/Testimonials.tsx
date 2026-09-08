"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionTitle from "../Ui/SectionTitle";

type Item = {
  name: string;
  tags: string[];
  quoteBefore: string;
  quoteHighlight: string;
  quoteAfter: string;
};

const TAG_CLASS = [
  "bg-tag-green-bg text-tag-green",
  "bg-tag-cyan-bg text-tag-cyan",
];

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Item[];
  const [index, setIndex] = useState(0);
  const item = items[index];

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <section className="page-gutter py-10 md:py-16">
      <SectionTitle className="normal-case">{t("title")}</SectionTitle>
      <div className="relative mt-10 flex items-center gap-4 md:mt-14 md:gap-10">
        <button
          type="button"
          onClick={prev}
          className="hidden shrink-0 text-ink md:flex"
          aria-label="Previous"
        >
          <svg viewBox="0 0 17 34" className="h-8 w-4" fill="none" aria-hidden>
            <path d="M16 1 2 17l14 16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          <div className="relative size-[140px] shrink-0 overflow-hidden rounded-full md:size-[228px]">
            <Image
              src="/figma/testimonial.jpg"
              alt=""
              fill
              sizes="228px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl font-semibold text-ink md:text-[25px]">
                  {item.name}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className={`rounded-[5px] px-3 py-1.5 font-sans text-[13px] font-medium ${TAG_CLASS[i] ?? TAG_CLASS[0]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/quote.svg"
                alt=""
                className="hidden h-10 w-10 md:block"
              />
            </div>
            <p className="mt-5 font-serif text-lg italic leading-relaxed text-muted md:text-[25px] md:leading-[1.45]">
              “{item.quoteBefore}
              <span className="font-bold not-italic text-orange">
                {item.quoteHighlight}
              </span>
              {item.quoteAfter}”
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="hidden shrink-0 text-ink md:flex"
          aria-label="Next"
        >
          <svg viewBox="0 0 17 34" className="h-8 w-4" fill="none" aria-hidden>
            <path d="M1 1l14 16L1 33" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <div className="mt-8 flex justify-center gap-8 md:hidden">
        <button type="button" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 17 34" className="h-7 w-3.5" fill="none">
            <path d="M16 1 2 17l14 16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button type="button" onClick={next} aria-label="Next">
          <svg viewBox="0 0 17 34" className="h-7 w-3.5" fill="none">
            <path d="M1 1l14 16L1 33" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      <div className="mt-8 h-px w-full bg-soft-border" />
    </section>
  );
}
