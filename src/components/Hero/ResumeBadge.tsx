import { CONTACT } from "@/lib/contact";
import { useTranslations } from "next-intl";
export default function ResumeBadge() {
  const t = useTranslations("common");
  return (
    <a
      className="resume-badge"
      href={CONTACT.resumeHref}
      download
      hrefLang="fr"
      type="application/pdf"
    >
      <svg
        className="resume-lettering"
        viewBox="0 0 235 235"
        aria-hidden="true"
      >
        <defs>
          <path id="resume-circle" d="M117.5,24 a93.5,93.5 0 1,1 -0.01,0" />
        </defs>
        <text>
          <textPath
            href="#resume-circle"
            textLength="575"
            lengthAdjust="spacing"
          >
            {t("resume")} · {t("resumeFormat")} ·
          </textPath>
        </text>
      </svg>
      <span className="resume-center">
        {t("resumeShort")}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M5 19 19 5M5 5h14v14" />
        </svg>
      </span>
      <span className="sr-only">
        {" "}
        · {t("resume")} · {t("resumeFormat")}
      </span>
    </a>
  );
}
