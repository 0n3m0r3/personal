"use client";
import { useEffect } from "react";
export default function ScrollReveal() {
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const nodes = document.querySelectorAll(
      "main .section-title, .about-copy, .about-portrait, .collaboration-section, .project-cta",
    );
    let observer: IntersectionObserver | undefined;
    const reset = () => {
      observer?.disconnect();
      nodes.forEach((el) => el.classList.remove("reveal-ready", "is-visible"));
    };
    const update = () => {
      reset();
      if (!media.matches) return;
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.1 },
      );
      nodes.forEach((el) => {
        if (el.getBoundingClientRect().top > innerHeight) {
          el.classList.add("reveal-ready");
          observer?.observe(el);
        }
      });
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      reset();
    };
  }, []);
  return null;
}
