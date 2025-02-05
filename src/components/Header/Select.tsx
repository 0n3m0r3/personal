"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { classNames } from "../../utils/classNames";

import FrenchFlag from "../../../public/assests/country/fr/france.png";
import EnglishFlag from "../../../public/assests/country/en/united-kingdom.png";
import GermanFlag from "../../../public/assests/country/de/germany.png";
import { setLanguage } from "@/lib/features/languageSlice";

interface Language {
  id: string;
  short: string;
  name: string;
  flag: {
    src: string;
  };
}

const languages: Language[] = [
  { id: "fr", short: "FR", name: "french", flag: FrenchFlag },
  { id: "en", short: "EN", name: "english", flag: EnglishFlag },
  { id: "de", short: "DE", name: "german", flag: GermanFlag },
];

export default function Select() {
  const t = useTranslations("languageSelector");
  const pathname = usePathname();
  const router = useRouter();

  // Redux
  const dispatch = useDispatch();
  const reduxLang = useSelector((state: any) => state.language.currentLanguage);

  const localeFromPath = pathname.split("/")[1];

  // Local state for the selected language
  const [selected, setSelected] = useState<Language>(
    languages.find((l) => l.id === localeFromPath) || languages[0]
  );

  // Handler for when user selects a new language
  const handleLanguageChange = (newLang: Language) => {
    setSelected(newLang);
    dispatch(setLanguage(newLang.id)); // update Redux store

    // Replace the current first segment with the new locale and navigate
    // e.g. "/en/some-page" -> "/fr/some-page"
    const segments = pathname.split("/");
    segments[1] = newLang.id;
    const newPath = segments.join("/");

    // Navigate to the new locale path
    router.push(newPath);
  };

  return (
    <Listbox value={selected} onChange={handleLanguageChange}>
      {({ open }: { open: boolean }) => (
        <>
          <div className="relative z-40 font-sans">
            <Listbox.Button className="flex w-full cursor-default rounded-md bg-primary-dark py-1.5 md:py-4 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 hover:cursor-pointer px-8">
              <span className="flex items-center border-white border-solid border rounded-full">
                <img
                  src={selected.flag.src}
                  alt={t(selected.name)}
                  className="h-6 w-6 rounded-full"
                />
              </span>
              <span className="truncate hidden md:block px-2 text-white font-sans">
                {t(selected.name)}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 font-sans text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {languages.map((language) => (
                  <Listbox.Option
                    key={language.id}
                    className={({ active }: { active: boolean }) =>
                      classNames(
                        active ? "bg-primary-dark text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={language}
                  >
                    {({
                      selected,
                      active,
                    }: {
                      selected: boolean;
                      active: boolean;
                    }) => (
                      <div className="flex justify-center items-center">
                        <span className="flex items-center border-white border-solid border rounded-full">
                          <img
                            src={language.flag.src}
                            alt={t(selected ? language.name : "")}
                            className="h-6 w-6 rounded-full"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "hidden md:block truncate ml-2"
                          )}
                        >
                          {t(language.name)}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-green-400" : "text-white",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
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
        </>
      )}
    </Listbox>
  );
}
