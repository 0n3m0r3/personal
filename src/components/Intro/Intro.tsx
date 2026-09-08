import { useTranslations } from "next-intl";
import Button from "../Ui/Button";

export default function Intro() {
  const t = useTranslations("intro");
  return (
    <section className="page-gutter py-10 md:py-16">
      <p className="mx-auto max-w-5xl text-center font-sans text-base font-semibold leading-relaxed text-ink md:text-[45px] md:font-semibold md:leading-[1.2]">
        {t("description")}
      </p>
      <div className="mt-8 flex justify-center md:mt-12">
        <Button message="common.connect" href="#contact" />
      </div>
    </section>
  );
}
