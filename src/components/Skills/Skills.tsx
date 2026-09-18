"use client";
import { useRef, useState } from "react";
import { FolderOpenIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import Carousel from "../Ui/Carousel";
import Education from "./Education";
import DetailModal from "../Ui/DetailModal";
import SkillIcon from "../Ui/SkillIcon";
import TechnologyTiles from "../Ui/TechnologyTiles";
import { SKILL_TECH } from "@/lib/technology";
type Skill = {
  title: string;
  body: string;
  summary: string;
  examples: { title: string; body: string }[];
  tags: string[];
};
type Formation = { title: string; meta: string };
export default function Skills() {
  const t = useTranslations("skills");
  const common = useTranslations("common");
  const [tab, setTab] = useState<"knowHow" | "education">("knowHow");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <section id="skills" className="skills-section">
      <div className="skills-tabs" role="tablist" aria-label={t("label")}>
        {(["knowHow", "education"] as const).map((key, index) => (
          <button
            ref={(el) => {
              tabs.current[index] = el;
            }}
            type="button"
            key={key}
            id={`tab-${key}`}
            role="tab"
            aria-selected={tab === key}
            aria-controls="skills-panel"
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(event) => {
              if (
                ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 1
                      : 1 - index;
                setTab(next === 0 ? "knowHow" : "education");
                tabs.current[next]?.focus();
              }
            }}
          >
            {t(key)}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="skills-panel" aria-labelledby={`tab-${tab}`}>
        {tab === "knowHow" ? (
          <Carousel label={t(tab)} variant="skills">
            {(t.raw("items") as Skill[]).map((item, index) => (
              <article className="skill-card" key={item.title}>
                <SkillIcon index={index} />
                <h3>{item.title}</h3>
                {SKILL_TECH[index].length ? (
                  <TechnologyTiles ids={SKILL_TECH[index]} />
                ) : (
                  <TechnologyTiles labels={item.tags} />
                )}
                <p>{item.summary}</p>
                <DetailModal
                  title={item.title}
                  label={common("explore")}
                  className="card-link"
                >
                  <p>{item.body}</p>
                  <h3>{t("inPractice")}</h3>
                  {item.examples.map((example) => (
                    <div className="detail-example" key={example.title}>
                      <h4>
                        <FolderOpenIcon aria-hidden="true" />
                        {example.title}
                      </h4>
                      <p>{example.body}</p>
                    </div>
                  ))}
                  <TechnologyTiles labels={item.tags} />
                </DetailModal>
              </article>
            ))}
          </Carousel>
        ) : (
          <Education formations={t.raw("formations") as Formation[]} />
        )}
      </div>
    </section>
  );
}
