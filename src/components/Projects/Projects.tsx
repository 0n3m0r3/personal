import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import DetailModal from "../Ui/DetailModal";
import SkillIcon from "../Ui/SkillIcon";
import Carousel from "../Ui/Carousel";
import SectionTitle from "../Ui/SectionTitle";
import TechnologyIcon from "../Ui/TechnologyIcon";

type Project = {
  name: string;
  category: string;
  body: string;
  tags: string[];
};

export default function Projects() {
  const t = useTranslations("projects");
  const projects = t.raw("items") as Project[];

  return (
    <section id="projects" className="page-gutter projects-section">
      <SectionTitle>{t("title")}</SectionTitle>
      <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed text-muted md:text-xl">
        {t("intro")}
      </p>
      <Carousel label={t("title")} variant="projects">
        {projects.map((project, index) => (
          <article
            key={project.name}
            className="project-card flex min-w-0 flex-col rounded-card border border-soft-border bg-cream p-6 md:p-8"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold text-muted">
                {project.category}
              </p>
            </div>
            <h3 className="mt-5 break-words text-2xl font-bold leading-tight text-primary-dark">
              {project.name}
            </h3>
            <p className="mb-6 mt-4 text-base leading-relaxed text-muted">
              {project.body}
            </p>
            <ul
              className="mt-auto flex flex-wrap gap-2"
              aria-label={project.name}
            >
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="project-tag rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary"
                >
                  <TechnologyIcon label={tag} />
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </Carousel>
      <aside className="fieldwork">
        <SkillIcon index={5} />
        <div>
          <h3>{t("moreTitle")}</h3>
          <p>{t("fieldSummary")}</p>
        </div>
        <DetailModal title={t("moreTitle")} label={t("discover")}>
          <p>{t("more")}</p>
          <a
            href={CONTACT.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-external"
          >
            {t("github")}
          </a>
        </DetailModal>
      </aside>
    </section>
  );
}
