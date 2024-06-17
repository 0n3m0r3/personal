"use client";
import { Fragment, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

import { classNames } from "../../utils/classNames";

import FrenchFlag from "../../../public/assests/country/fr/france.png";
import EnglishFlag from "../../../public/assests/country/en/united-kingdom.png";
import GermanFlag from "../../../public/assests/country/de/germany.png";

const languages = [
  { id: "fr", short: "FR", name: "Français", flag: FrenchFlag },
  { id: "en", short: "EN", name: "English", flag: EnglishFlag },
  { id: "de", short: "DE", name: "Deutsch", flag: GermanFlag },
];

export default function Select() {
  const lang = languages[0];
  const [selected, setSelected] = useState(lang);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }: { open: boolean }) => (
        <>
          <div className="relative">
            <ListboxButton className="flex w-full cursor-default rounded-md bg-primary-dark py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="flex items-center border-white border-solid border rounded-full">
                <img
                  src={selected.flag.src}
                  alt={selected.name}
                  className="h-6 w-6 rounded-full"
                />
              </span>
              <span className="truncate hidden md:block px-2 text-white">{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {languages.map((language) => (
                  <ListboxOption
                    key={language.id}
                    className={({ focus }: { focus: boolean }) =>
                      classNames(
                        focus ? "bg-indigo-600 text-white" : "",
                        !focus ? "text-gray-900" : "",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={lang}
                  >
                    {({
                      selected,
                      focus,
                    }: {
                      selected: boolean;
                      focus: boolean;
                    }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {language.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              focus ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
