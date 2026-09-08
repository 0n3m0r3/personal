import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { classNames } from "@/utils/classNames";

type Variant = "primary" | "accent";

interface ButtonProps {
  message: string;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  arrowSrc?: string;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary",
  accent:
    "bg-orange text-white hover:bg-[#e8683f] focus-visible:ring-orange",
};

function Arrow({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={classNames(
        "relative inline-flex size-5 -rotate-[135deg] overflow-visible",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full object-contain" />
    </span>
  );
}

export default function Button({
  message,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className,
  arrowSrc = "/figma/arrow.svg",
}: ButtonProps) {
  const t = useTranslations();
  const classes = classNames(
    "inline-flex items-center justify-center gap-2 rounded-btn px-6 py-4 font-sans text-sm font-bold leading-none shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:px-8 md:py-5 md:text-lg",
    variantClass[variant],
    className
  );

  const content = (
    <>
      <span>{t(message)}</span>
      <Arrow
        src={arrowSrc}
        className={variant === "accent" ? "brightness-0 invert" : undefined}
      />
    </>
  );

  if (href) {
    if (href.startsWith("/") && !href.startsWith("/resume") && !href.includes(".")) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
