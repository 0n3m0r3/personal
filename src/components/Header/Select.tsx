"use client";
import Image from "next/image";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
const languages = [
  { id: "fr", name: "french", flag: "/assests/country/fr/france.png" },
  { id: "en", name: "english", flag: "/assests/country/en/united-kingdom.png" },
  { id: "de", name: "german", flag: "/assests/country/de/germany.png" },
];
export default function Select() {
  const t = useTranslations("languageSelector");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const current = languages.find((language) => language.id === locale)!;
  return (
    <Listbox
      value={locale}
      onChange={(value) => {
        const segments = pathname.split("/");
        segments[1] = value;
        router.replace(segments.join("/") + window.location.search, {
          scroll: false,
        });
      }}
    >
      <div className="language-select">
        <ListboxButton
          className="language-button"
          aria-label={t(current.name) + " · " + t("label")}
        >
          <Image src={current.flag} alt="" width={30} height={30} />
          <span>{t(current.name)}</span>
          <svg
            viewBox="0 0 16 10"
            width="16"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m1 1 7 7 7-7" />
          </svg>
        </ListboxButton>
        <ListboxOptions className="language-options">
          {languages.map((language) => (
            <ListboxOption
              className="language-option"
              key={language.id}
              value={language.id}
            >
              <Image src={language.flag} alt="" width={26} height={26} />
              <span>{t(language.name)}</span>
              <span aria-hidden="true" className="language-check">
                {locale === language.id ? "✓" : ""}
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
