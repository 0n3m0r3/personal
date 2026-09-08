import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ContactPills from "../Ui/ContactPills";
import CopyEmail from "./CopyEmail";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-ink text-white">
      <div className="page-gutter pb-10 pt-32 md:pt-40">
        <div className="flex justify-center">
          <ContactPills horizontal className="[&>a]:sm:max-w-none [&>a]:sm:flex-1" />
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
          <nav className="grid grid-cols-2 gap-x-12 gap-y-4 font-sans text-lg font-bold capitalize md:text-[25px]">
            <Link href="/" className="hover:text-orange">
              {t("nav.home")}
            </Link>
            <span>{t("nav.linkedin")}</span>
            <Link href="/services" className="hover:text-orange">
              {t("nav.work")}
            </Link>
            <span>{t("nav.instagram")}</span>
            <a href="#about" className="hover:text-orange">
              {t("nav.me")}
            </a>
            <span>{t("nav.twitter")}</span>
          </nav>

          <div className="flex flex-col items-stretch gap-4 rounded-card bg-white px-5 py-6 text-center md:flex-row md:items-center md:justify-between md:px-9 md:py-8 md:text-left">
            <p className="font-sans text-base font-bold text-primary md:text-[25px] md:leading-tight">
              {t("footer.cta")}
            </p>
            <CopyEmail />
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-center font-sans text-sm font-medium md:text-xl">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
