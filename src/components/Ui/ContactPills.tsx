import { CONTACT } from "@/lib/contact";
import { classNames } from "@/utils/classNames";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.97 3.22 9.18 7.69 10.66.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 .1.77 2.65 2.7 1.89.1-.75.39-1.26.71-1.55-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.11 1.15a10.8 10.8 0 0 1 5.66 0c2.16-1.45 3.11-1.15 3.11-1.15.61 1.54.23 2.68.11 2.96.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54 4.46-1.49 7.67-5.7 7.67-10.66C23.25 5.48 18.27.5 12 .5z" />
    </svg>
  );
}

function Pill({
  href,
  label,
  icon,
  iconClass,
  className,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconClass: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={classNames(
        "flex min-w-0 items-stretch overflow-hidden rounded-btn",
        className
      )}
    >
      <span
        className={classNames(
          "flex size-[52px] shrink-0 items-center justify-center md:size-[59px]",
          iconClass
        )}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 items-center bg-primary px-3 font-sans text-sm font-bold text-white md:px-4 md:text-lg">
        <span className="truncate sm:overflow-visible sm:whitespace-nowrap">{label}</span>
      </span>
    </a>
  );
}

export default function ContactPills({
  className,
  horizontal = false,
}: {
  className?: string;
  horizontal?: boolean;
}) {
  return (
    <div
      className={classNames(
        "flex w-full gap-[14px]",
        horizontal
          ? "max-w-none flex-col sm:flex-row sm:flex-wrap sm:justify-center"
          : "max-w-[401px] flex-col",
        className
      )}
    >
      <Pill
        href={CONTACT.phoneHref}
        label={CONTACT.phoneDisplay}
        icon={<PhoneIcon />}
        iconClass="bg-[#F3E8FF] text-[#A855F7]"
      />
      <Pill
        href={`mailto:${CONTACT.email}`}
        label={CONTACT.email}
        icon={<MailIcon />}
        iconClass="bg-[#DCFCE7] text-[#16A34A]"
      />
      <Pill
        href={CONTACT.githubUrl}
        label={CONTACT.githubLabel}
        icon={<GithubIcon />}
        iconClass="bg-[#FEF3C7] text-[#CA8A04]"
      />
    </div>
  );
}
