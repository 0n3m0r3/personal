import { useTranslations } from "next-intl";
import SectionTitle from "../Ui/SectionTitle";
import { classNames } from "@/utils/classNames";

type Job = {
  company: string;
  role: string;
  dates: string;
  points: string[];
};

export default function Experience() {
  const t = useTranslations("experience");
  const jobs = t.raw("jobs") as Job[];

  return (
    <section id="work" className="page-gutter scroll-mt-8 py-12 md:py-20">
      <SectionTitle>{t("title")}</SectionTitle>
      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
        {jobs.map((job, index) => {
          const dark = index === 0;
          return (
            <article
              key={job.company}
              className={classNames(
                "rounded-card border border-soft-border px-6 py-8 md:px-9 md:py-10",
                dark ? "bg-primary-dark text-white" : "bg-white text-ink"
              )}
            >
              <h3 className="font-sans text-2xl font-semibold md:text-[30px]">
                {job.company}
              </h3>
              <p className="mt-2 font-sans text-lg font-semibold md:text-xl">
                {job.role}
              </p>
              <p
                className={classNames(
                  "mt-2 font-sans text-base font-semibold md:text-lg",
                  dark ? "text-orange" : "text-muted"
                )}
              >
                {job.dates}
              </p>
              <ul className="mt-5 space-y-2 font-serif text-base font-semibold md:text-lg">
                {job.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      className={classNames(
                        "mt-1.5 size-2.5 shrink-0 rounded-full",
                        dark ? "bg-orange" : "bg-primary"
                      )}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
