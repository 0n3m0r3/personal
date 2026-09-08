import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "../Ui/Button";
import Blobs from "../Ui/Blobs";
import ResumeBadge from "./ResumeBadge";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="page-gutter pb-6 md:pb-10">
      <div className="relative overflow-hidden rounded-panel bg-cream">
        <Blobs />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/hero-pattern.svg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/star.svg"
          alt=""
          className="pointer-events-none absolute left-[42%] top-6 hidden w-28 md:block lg:left-[40%] lg:w-40"
        />

        <div className="relative z-10 grid items-center gap-6 px-5 py-8 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="flex items-center gap-2 font-sans text-xl font-semibold text-ink md:text-[40px] md:leading-tight">
              {t("hello")}
              <span aria-hidden className="text-2xl md:text-4xl">
                👋
              </span>
            </p>
            <h1 className="mt-3 max-w-xl font-sans text-3xl font-bold leading-tight text-ink md:mt-4 md:text-[70px] md:leading-[1.05]">
              {t("welcome")}
            </h1>
            <div className="mt-6 hidden md:block">
              <Button message="common.connect" href="#contact" />
            </div>
            <div className="mt-6 md:hidden">
              <ResumeBadge />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] md:max-w-none">
            <div className="relative aspect-[634/765] overflow-hidden rounded-[20px] bg-[#c4c4c4] md:rounded-[30px]">
              <Image
                src="/hero_pic_desktop.png"
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute bottom-4 left-0 hidden -translate-x-[45%] md:block lg:bottom-8">
              <ResumeBadge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
