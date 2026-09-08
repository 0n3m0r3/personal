"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { classNames } from "../../utils/classNames";

import { setLanguage } from "@/lib/features/languageSlice";

interface Language {
  id: string;
  short: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { id: "fr", short: "FR", name: "french", flag: "/assests/country/fr/france.png" },
  { id: "en", short: "EN", name: "english", flag: "/assests/country/en/united-kingdom.png" },
  { id: "de", short: "DE", name: "german", flag: "/assests/country/de/germany.png" },
];

export default function Select() {
  const t = useTranslations("languageSelector");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const localeFromPath = pathname.split("/")[1];

  const [selected, setSelected] = useState<Language>(
    languages.find((l) => l.id === localeFromPath) || languages[0]
  );

  const handleLanguageChange = (newLang: Language) => {
    setSelected(newLang);
    dispatch(setLanguage(newLang.id));
    const segments = pathname.split("/");
    segments[1] = newLang.id;
    router.push(segments.join("/"));
  };

  return (
    <Listbox value={selected} onChange={handleLanguageChange}>
      {({ open }: { open: boolean }) => (
        <div className="relative z-40 font-sans">
          <Listbox.Button className="flex h-11 w-auto cursor-pointer items-center rounded-btn bg-primary-dark py-1.5 pl-3 pr-9 text-left text-white shadow-sm hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:h-[70px] md:min-w-[200px] md:px-5">
            <span className="flex items-center overflow-hidden rounded-full border border-white">
              <img
                src={selected.flag}
                alt=""
                className="h-6 w-6 rounded-full object-cover md:h-[30px] md:w-[30px]"
              />
            </span>
            <span className="hidden truncate px-3 font-sans text-base font-medium md:block">
              {t(selected.name)}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 md:pr-4">
              <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-full min-w-[10rem] overflow-auto rounded-md bg-white py-1 font-sans text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {languages.map((language) => (
                <Listbox.Option
                  key={language.id}
                  className={({ active }: { active: boolean }) =>
                    classNames(
                      active ? "bg-primary-dark text-white" : "text-ink",
                      "relative cursor-pointer select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={language}
                >
                  {({
                    selected: isSelected,
                    active,
                  }: {
                    selected: boolean;
                    active: boolean;
                  }) => (
                    <div className="flex items-center">
                      <span className="flex items-center overflow-hidden rounded-full border border-white">
                        <img
                          src={language.flag}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      </span>
                      <span
                        className={classNames(
                          isSelected ? "font-semibold" : "font-normal",
                          "ml-2 truncate"
                        )}
                      >
                        {t(language.name)}
                      </span>
                      {isSelected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-primary",
                            "absolute inset-y-0 right-0 flex items-center pr-3"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
