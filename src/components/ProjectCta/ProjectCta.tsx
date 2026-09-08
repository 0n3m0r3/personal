import { useTranslations } from "next-intl";
import Button from "../Ui/Button";
import Blobs from "../Ui/Blobs";

export default function ProjectCta() {
  const t = useTranslations("project");
  return (
    <section className="page-gutter relative z-10 -mb-24 md:-mb-32">
      <div className="relative overflow-hidden rounded-card bg-cream px-6 py-12 text-center shadow-sm md:px-16 md:py-16">
        <Blobs />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/project-pattern.svg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="relative z-10">
          <h2 className="font-sans text-2xl font-bold uppercase leading-tight text-primary md:text-[40px]">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base font-medium text-muted md:text-xl">
            {t("body")}
          </p>
          <div className="mt-8 flex justify-center">
            <Button message="common.start" href="#contact" variant="accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
