"use client";

import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LocaleSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const locales = [
    { code: "pt", name: "PT" },
    { code: "en", name: "EN" },
    { code: "es", name: "ES" },
  ];

  const changeLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
    setIsOpen(false);
  };

  const selectedLocale = locales.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
      >
        {selectedLocale?.name}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-zinc-800 ring-1 ring-white ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLocale(l.code)}
                disabled={l.code === locale}
                className={`${
                  l.code === locale
                    ? "font-bold text-white"
                    : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                } block w-full text-left px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                role="menuitem"
              >
                {l.code.toUpperCase()} - {l.name === "PT" ? "Português" : l.name === "EN" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
