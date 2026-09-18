import Image from "next/image";
import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import ContactPills, { GithubIcon, MailIcon } from "../Ui/ContactPills";
export default function About() {
  const t = useTranslations("about");
  return (
    <section id="about" className="about-section">
      <div className="page-gutter about-layout">
        <div className="about-copy">
          <h2>{t("title")}</h2>
          <p className="about-role">{t("role")}</p>
          <p className="about-location">{t("location")}</p>
          <p className="about-description">{t("description")}</p>
          <ul className="about-languages" aria-label={t("languagesTitle")}>
            {(t.raw("languages") as string[]).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <ContactPills />
        </div>
        <div className="about-portrait">
          <span className="about-ring" aria-hidden="true" />
          <span className="about-ring-inner" aria-hidden="true" />
          <span className="about-ring-third" aria-hidden="true" />
          <div className="about-photo">
            <Image
              src="/portrait-linkedin.jpg"
              alt=""
              fill
              sizes="(min-width: 900px) 320px, 65vw"
              className="object-cover"
            />
          </div>
          <div className="about-socials">
            <a
              href={CONTACT.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn · Louka Altdorf Reynes"
            >
              <span aria-hidden="true">in</span>
            </a>
            <a
              href={CONTACT.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub · Louka Altdorf Reynes"
            >
              <GithubIcon />
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              aria-label="E-mail · Louka Altdorf Reynes"
            >
              <MailIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
