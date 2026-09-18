import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import Button from "../Ui/Button";
export default function ProjectCta() {
  const t = useTranslations("project");
  return (
    <section className="page-gutter project-cta">
      <div>
        <h2>{t("title")}</h2>
        <p>{t("body")}</p>
        <div>
          <Button
            message="common.start"
            href={`mailto:${CONTACT.email}`}
            variant="accent"
          />
        </div>
      </div>
    </section>
  );
}
