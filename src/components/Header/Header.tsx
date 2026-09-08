import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Select from "./Select";

export default function Header() {
  const t = useTranslations("common");
  return (
    <header className="page-gutter flex items-center justify-between py-4 md:py-8">
      <Link href="/" className="flex items-center gap-3 md:gap-5">
        <Image
          src="/assests/logo/logo_desktop.png"
          alt=""
          width={91}
          height={91}
          className="h-12 w-12 object-contain md:h-[91px] md:w-[91px]"
          priority
        />
        <span className="font-sans text-lg font-extrabold leading-tight text-primary md:text-[37px]">
          {t("name")}!
        </span>
      </Link>
      <Select />
    </header>
  );
}
