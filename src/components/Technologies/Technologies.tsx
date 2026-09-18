import { useTranslations } from "next-intl";
import { TECHNOLOGIES } from "@/lib/technology";
import SectionTitle from "../Ui/SectionTitle";
import Carousel from "../Ui/Carousel";
export default function Technologies() {
  const t = useTranslations("tech");
  return (
    <section className="tech-section">
      <SectionTitle>{t("title")}</SectionTitle>
      <Carousel label={t("title")} variant="tech">
        {TECHNOLOGIES.map(([id, name]) => (
          <div key={id} className="tech-card">
            <img
              src={`/technology/${id}.svg`}
              alt=""
              width={90}
              height={90}
              loading="lazy"
              draggable={false}
            />
            <span>{name}</span>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
