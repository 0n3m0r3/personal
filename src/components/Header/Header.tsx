"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Select from "./Select";

export default function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const update = () => setCompact(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header className="site-header-space" id="top">
      <div className={`site-header-bar ${compact ? "is-compact" : ""}`}>
        <div className="page-gutter site-header">
          <Link
            href={pathname === "/" ? "#top" : "/"}
            className="brand"
            aria-label={
              pathname === "/" ? t("name") + "! · " + t("backToTop") : undefined
            }
          >
            <Image
              src="/assests/logo/logo_desktop.png"
              alt=""
              width={91}
              height={91}
              className="brand-logo"
              priority
            />
            <span className="brand-name">{t("name")}!</span>
          </Link>
          <Select />
        </div>
      </div>
    </header>
  );
}
