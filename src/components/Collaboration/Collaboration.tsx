import { useTranslations } from "next-intl";
import Button from "../Ui/Button";
import Blobs from "../Ui/Blobs";

export default function Collaboration() {
  const t = useTranslations("collaboration");
  return (
    <section className="page-gutter py-10 md:py-16">
      <div className="relative overflow-hidden rounded-card bg-primary-dark px-6 py-12 text-center md:px-16 md:py-16">
        <Blobs className="opacity-30" />
        <p className="relative z-10 mx-auto max-w-4xl font-sans text-2xl font-bold leading-snug text-white md:text-[45px] md:leading-[1.2]">
          {t("text")}
        </p>
        <div className="relative z-10 mt-8 flex justify-center">
          <Button
            message="common.learnMore"
            href="#about"
            variant="accent"
            arrowSrc="/figma/arrow-orange.svg"
          />
        </div>
      </div>
    </section>
  );
}
