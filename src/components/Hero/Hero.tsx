import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "../Ui/Button";
import ResumeBadge from "./ResumeBadge";
import ChatLauncher from "../Chat/ChatLauncher";

export default function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="hero">
      <div className="hero-background" aria-hidden="true" />
      <img
        className="hero-star"
        src="/figma/star.svg"
        alt=""
        width={150}
        height={150}
      />
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-hello">
            <span>{t("hello")}</span>{" "}
            <Image
              src="/figma/wave-figma.png"
              alt=""
              width={48}
              height={48}
              className="hero-wave"
            />
          </p>
          <h1>{t("welcome")}</h1>
          <div className="hero-contact">
            <Button message="common.connect" href="#contact" />
          </div>
          <ResumeBadge />
        </div>
        <div className="hero-photo">
          <Image
            src="/portrait-linkedin.jpg"
            alt="Louka Altdorf Reynes"
            fill
            priority
            sizes="(min-width: 1920px) 634px, (min-width: 900px) 33vw, (min-width: 600px) 560px, 95vw"
            className="object-cover"
          />
        </div>
      </div>
      {(process.env.PORTFOLIO_CHAT_MODE === "local" ||
        process.env.PORTFOLIO_CHAT_MODE === "public" ||
        (process.env.NODE_ENV === "development" && !process.env.PORTFOLIO_CHAT_MODE)) && <ChatLauncher />}
    </section>
  );
}
