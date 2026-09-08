import Image from "next/image";
import { useTranslations } from "next-intl";
import Blobs from "../Ui/Blobs";
import ContactPills from "../Ui/ContactPills";

export default function About() {
  const t = useTranslations("about");
  return (
    <section id="about" className="page-gutter scroll-mt-8 py-6 md:py-10">
      <div className="relative overflow-hidden rounded-panel bg-cream">
        <Blobs />
        <div className="relative z-10 grid items-center gap-10 px-5 py-10 md:grid-cols-2 md:gap-8 md:px-12 md:py-16 lg:px-16">
          <div>
            <h2 className="font-sans text-2xl font-bold text-ink md:text-[45px] md:leading-tight">
              {t("title")}
            </h2>
            <p className="mt-4 font-sans text-lg font-bold text-orange md:text-2xl">
              {t("alternance")}
            </p>
            <p className="mt-2 font-sans text-sm font-bold text-ink md:text-lg">
              {t("rhythm")}
            </p>
            <p className="mt-6 max-w-xl font-sans text-sm font-bold leading-relaxed text-ink md:text-lg">
              {t("description")}
            </p>
            <ContactPills className="mt-8" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/about-ring-1.svg"
              alt=""
              className="absolute inset-0 size-full object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/about-ring-2.svg"
              alt=""
              className="absolute inset-[6%] size-[88%] object-contain"
            />
            <div className="absolute inset-[20%] left-[24%] overflow-hidden rounded-full bg-[#c4c4c4]">
              <Image
                src="/hero_pic.png"
                alt=""
                fill
                sizes="400px"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute left-1 top-[32%] z-10 flex flex-col gap-3 md:left-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/social-1.svg" alt="" className="size-10 md:size-[53px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/social-2.svg" alt="" className="size-10 md:size-[53px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/social-3.svg" alt="" className="size-10 md:size-[53px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
