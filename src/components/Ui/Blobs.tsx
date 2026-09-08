import { classNames } from "@/utils/classNames";

export default function Blobs({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div className="absolute -left-10 -top-16 h-72 w-72 rounded-full bg-lime opacity-50 blur-[80px] md:h-96 md:w-96" />
      <div className="absolute -bottom-16 -right-10 h-72 w-72 rounded-full bg-blush opacity-50 blur-[80px] md:h-[500px] md:w-[500px]" />
    </div>
  );
}
