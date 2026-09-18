import { useTranslations } from "next-intl";
import SectionTitle from "../Ui/SectionTitle";
import Carousel from "../Ui/Carousel";
import DetailModal from "../Ui/DetailModal";
import TechnologyTiles from "../Ui/TechnologyTiles";
type Job = {
  company: string;
  role: string;
  dates: string;
  points: string[];
  stack: string[];
};
export default function Experience() {
  const t = useTranslations("experience");
  return (
    <section id="work" className="experience-section">
      <div className="page-gutter">
        <SectionTitle>{t("title")}</SectionTitle>
        <Carousel label={t("title")} variant="experience">
          {(t.raw("jobs") as Job[]).map((job, index) => (
            <article
              key={job.company + job.role}
              className={`experience-card ${index % 2 === 0 ? "experience-card--dark" : ""}`}
            >
              <h3>{job.company}</h3>
              <p className="experience-role">{job.role}</p>
              <p className="experience-dates">{job.dates}</p>
              <p className="experience-summary">{job.points[0]}</p>
              <DetailModal
                title={`${job.company} · ${job.role}`}
                label={t("details")}
              >
                <p className="detail-meta">{job.dates}</p>
                <ul className="detail-list">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <TechnologyTiles labels={job.stack} />
              </DetailModal>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
