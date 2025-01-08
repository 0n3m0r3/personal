import { useTranslations } from "next-intl";
import Button from "../Ui/Button";

export default function Presentation() {
  const t = useTranslations("presentation");
  return (
    <div className="md:my-16 md:max-w-screen-md md:mx-auto">
      <h3 className="text-base font-medium md:text-3xl text-[#2A2C32] font-sans text-center m-4">
        {t("description")}
      </h3>
      <div className="flex justify-center">
        <a href="/resume_en.pdf" download>
          <Button message="presentation.button" />
        </a>
      </div>
    </div>
  );
}
