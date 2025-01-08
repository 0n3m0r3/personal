import { useTranslations } from "next-intl";

interface ButtonProps {
  message: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  messageColor?: string;
  iconColor?: string;
  backgroundColor?: string;
}

export default function Button({
  message, // complete translation path
  icon,
  iconPosition,
  messageColor,
  iconColor,
  backgroundColor,
}: ButtonProps) {
  const t = useTranslations();
  return (
    <button
      className={`flex items-center justify-center px-4 md:px-6 py-4 md:py-6 border border-transparent rounded-[10px] shadow-sm text-sm md:text-lg font-medium font-sans text-white bg-[#242F65] hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${backgroundColor}`}
    >
      {icon && iconPosition === "left" && (
        <span className={`mr-2 ${iconColor}`}>{icon}</span>
      )}
      <span className={messageColor}>{t(message)}</span>
      {icon && iconPosition === "right" && (
        <span className={`ml-2 ${iconColor}`}>{icon}</span>
      )}
    </button>
  );
}
