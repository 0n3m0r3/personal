import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CONTACT } from "@/lib/contact";
import ContactPills from "../Ui/ContactPills";
import CopyEmail from "./CopyEmail";
export default function Footer() {
  const t = useTranslations();
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-contacts page-gutter">
        <ContactPills horizontal />
      </div>
      <div className="footer-divider">
        <div className="footer-main page-gutter">
          <nav aria-label={t("nav.footer")}>
            <Link href="/">{t("nav.home")}</Link>
            <Link href="/#work">{t("nav.work")}</Link>
            <Link href="/#about">{t("nav.me")}</Link>
            <Link href="/#projects">{t("nav.projects")}</Link>
            <Link href="/services">{t("nav.services")}</Link>
            <a
              href={CONTACT.resumeHref}
              download
              hrefLang="fr"
              type="application/pdf"
            >
              {t("common.resume")}
              <span className="footer-format">{t("common.resumeFormat")}</span>
            </a>
          </nav>
          <div className="footer-email">
            <p>{t("footer.cta")}</p>
            <CopyEmail />
          </div>
        </div>
      </div>
      <p className="footer-copyright">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
