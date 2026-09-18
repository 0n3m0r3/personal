import { useTranslations } from "next-intl";
import Button from "../Ui/Button";
export default function Collaboration() {
  const t = useTranslations("collaboration");
  return (
    <section className="page-gutter collaboration-section">
      <div>
        <p>{t("text")}</p>
        <div>
          <Button
            message="common.seeProjects"
            href="#projects"
            variant="accent"
          />
        </div>
      </div>
    </section>
  );
}
