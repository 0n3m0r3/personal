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
        "section-title",
        className
      )}
    >
      {children}
    </h2>
  );
}
