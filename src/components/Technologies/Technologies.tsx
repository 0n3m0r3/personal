import { useTranslations } from "next-intl";
import SectionTitle from "../Ui/SectionTitle";

const LOGOS = [
  { src: "/figma/tech-jetbrains.png", alt: "JetBrains" },
  { src: "/figma/tech-next.svg", alt: "Next.js" },
  { src: "/figma/tech-react.svg", alt: "React" },
  { src: "/figma/tech-vscode.png", alt: "VS Code" },
  { src: "/figma/tech-docker.png", alt: "Docker" },
  { src: "/figma/tech-node.png", alt: "Node.js" },
];

export default function Technologies() {
  const t = useTranslations("tech");
  return (
    <section className="page-gutter py-10 md:py-16">
      <SectionTitle>{t("title")}</SectionTitle>
      <div className="mt-10 flex gap-4 overflow-x-auto pb-4 md:mt-14 md:grid md:grid-cols-6 md:overflow-visible md:pb-0">
        {LOGOS.map((logo) => (
          <div
            key={logo.alt}
            className="flex h-[180px] w-[160px] shrink-0 items-center justify-center rounded-card border border-primary bg-[#fafafa] px-4 md:h-[234px] md:w-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-[120px] w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-3" aria-hidden>
        {LOGOS.map((logo, index) => (
          <span
            key={logo.alt}
            className={
              index === 1
                ? "size-3.5 rounded-full bg-orange"
                : "size-2.5 rounded-full bg-primary-dark"
            }
          />
        ))}
      </div>
    </section>
  );
}
