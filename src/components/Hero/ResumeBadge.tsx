import Image from "next/image";
import { CONTACT } from "@/lib/contact";
import { useTranslations } from "next-intl";

export default function ResumeBadge({ className = "" }: { className?: string }) {
  const t = useTranslations("common");
  return (
    <a
      href={CONTACT.resumeHref}
      download
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      aria-label={t("resume")}
    >
      <span className="relative block size-[140px] md:size-[200px] lg:size-[235px]">
        <Image
          src="/download.png"
          alt=""
          fill
          sizes="235px"
          className="object-contain"
        />
      </span>
    </a>
  );
}
