"use client";
import {
  Children,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export default function Carousel({
  children,
  label,
  variant,
}: {
  children: ReactNode;
  label: string;
  variant: "experience" | "skills" | "tech" | "projects";
}) {
  const t = useTranslations("carousel");
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const conditions = useRef({
    visible: false,
    desktop: false,
    hover: false,
    focus: false,
    modal: false,
    dragging: false,
    reduced: true,
    paused: false,
  });
  const auto = useMemo(
    () =>
      AutoScroll({
        speed: variant === "tech" ? 1.2 : 0.65,
        breakpoints: {
          "(max-width: 899px), (pointer: coarse)": { speed: 0.45 },
        },
        startDelay: 0,
        playOnInit: false,
        stopOnInteraction: true,
        stopOnFocusIn: false,
      }),
    [variant],
  );
  const [viewport, api] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      duration: 40,
      skipSnaps: true,
    },
    [auto],
  );
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const [desktopMotion, setDesktopMotion] = useState(false);
  const slides = Children.toArray(children);
  const sync = useCallback(() => {
    const c = conditions.current;
    if (
      (variant === "tech" || (c.desktop && c.visible)) &&
      (variant === "tech" || !c.hover) &&
      (variant === "tech" || !c.focus) &&
      !c.modal &&
      !c.dragging &&
      !c.reduced &&
      !c.paused &&
      !document.hidden
    ) {
      if (!auto.isPlaying()) auto.play();
    } else auto.stop();
  }, [auto, variant]);
  useEffect(() => {
    if (!api) return;
    const el = root.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia(
      "(min-width: 900px) and (hover: hover) and (pointer: fine)",
    );
    const update = () => {
      setPage(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    const reinitialize = () => {
      update();
      sync();
    };
    const motion = () => {
      conditions.current.reduced = media.matches;
      conditions.current.desktop = desktop.matches;
      setDesktopMotion(desktop.matches && !media.matches);
      sync();
    };
    const down = () => {
      conditions.current.dragging = true;
      sync();
    };
    const up = () => {
      conditions.current.dragging = false;
      sync();
    };
    const settle = () => {
      sync();
    };
    const modal = (event: Event) => {
      conditions.current.modal = (event as CustomEvent<boolean>).detail;
      sync();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        conditions.current.visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    api
      .on("select", update)
      .on("reInit", reinitialize)
      .on("pointerDown", down)
      .on("pointerUp", up)
      .on("settle", settle);
    media.addEventListener("change", motion);
    desktop.addEventListener("change", motion);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("portfolio:modal", modal);
    update();
    motion();
    return () => {
      observer.disconnect();
      auto.stop();
      api
        .off("select", update)
        .off("reInit", reinitialize)
        .off("pointerDown", down)
        .off("pointerUp", up)
        .off("settle", settle);
      media.removeEventListener("change", motion);
      desktop.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("portfolio:modal", modal);
    };
  }, [api, auto, sync, variant]);
  function go(index: number) {
    auto.stop();
    api?.scrollTo(index, conditions.current.reduced);
  }
  return (
    <div
      ref={root}
      className={`carousel carousel--${variant}`}
      role="region"
      aria-roledescription={t("description")}
      aria-label={label}
      onMouseEnter={() => {
        conditions.current.hover = true;
        sync();
      }}
      onMouseLeave={() => {
        conditions.current.hover = false;
        sync();
      }}
      onPointerDownCapture={() => {
        conditions.current.focus = false;
        sync();
      }}
      onKeyDownCapture={() => {
        conditions.current.focus = true;
        sync();
      }}
      onFocusCapture={(event) => {
        conditions.current.focus = (event.target as HTMLElement).matches(
          ":focus-visible",
        );
        sync();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          conditions.current.focus = false;
          sync();
        }
      }}
    >
      <div
        id={id}
        ref={viewport}
        className="carousel-viewport"
        tabIndex={0}
        aria-label={t("instructions")}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            go(
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? count - 1
                  : page + (event.key === "ArrowRight" ? 1 : -1),
            );
          }
        }}
      >
        <div className="carousel-track">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="carousel-slide"
              role="group"
              aria-roledescription={t("slide")}
              aria-label={t("position", {
                current: index + 1,
                total: slides.length,
              })}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {variant !== "tech" && count > 1 && (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            aria-label={t("previous")}
            aria-controls={id}
            onClick={() => go(page - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12H4m6-6-6 6 6 6" />
            </svg>
          </button>
          <div className="carousel-dots">
            {Array.from({ length: count }, (_, index) => (
              <button
                type="button"
                key={index}
                aria-label={t("go", { number: index + 1 })}
                aria-current={index === page ? "true" : undefined}
                aria-controls={id}
                onClick={() => go(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="carousel-arrow"
            aria-label={t("next")}
            aria-controls={id}
            onClick={() => go(page + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </button>
          {desktopMotion && (
            <button
              type="button"
              className="carousel-pause"
              aria-label={t(paused ? "play" : "pause")}
              aria-pressed={paused}
              onClick={() => {
                const next = !paused;
                setPaused(next);
                conditions.current.paused = next;
                sync();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {paused ? (
                  <path d="m9 5 10 7-10 7Z" />
                ) : (
                  <path d="M9 5v14M15 5v14" />
                )}
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
