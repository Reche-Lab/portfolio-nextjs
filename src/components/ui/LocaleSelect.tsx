"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LocaleSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // Ref para detectar clique fora
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const locales = [
    { code: "pt", name: "PT" },
    { code: "en", name: "EN" },
    { code: "es", name: "ES" },
  ];

  const changeLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
    setIsOpen(false);
    // retorna foco ao botão (acessibilidade)
    buttonRef.current?.focus();
  };

  const selectedLocale = locales.find((l) => l.code === locale);

  // Fecha no clique fora / toque fora / Esc
  useEffect(() => {
    if (!isOpen) return;

    const onDocPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!rootRef.current || !target) return;
      if (!rootRef.current.contains(target)) setIsOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Fecha se a rota/locale mudar
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, locale]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="locale-menu"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white"
        title="Change language"
      >
        {selectedLocale?.name}
      </button>

      {isOpen && (
        <div
          id="locale-menu"
          role="menu"
          aria-orientation="vertical"
          className="
            absolute right-0 mt-2 w-40 z-50
            rounded-md bg-zinc-800 shadow-lg
            ring-1 ring-white ring-opacity-5
            border border-zinc-700/60
            focus:outline-none
          "
        >
          <div className="py-1 divide-y divide-zinc-700/50" role="none">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLocale(l.code)}
                disabled={l.code === locale}
                role="menuitem"
                className={`block w-full text-left px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  l.code === locale
                    ? "font-bold text-white"
                    : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {l.code.toUpperCase()} —{" "}
                {l.name === "PT" ? "Português" : l.name === "EN" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
