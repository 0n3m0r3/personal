import { classNames } from "@/utils/classNames";

export default function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={classNames(
        "text-center font-sans text-2xl font-bold uppercase tracking-wide text-ink md:text-[45px] md:leading-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}
