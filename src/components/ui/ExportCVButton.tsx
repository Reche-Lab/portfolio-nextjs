"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { DownloadCloud, ChevronDown } from "lucide-react";

const FILES = {
  en: "/cv/cv-bruno-reche-en.pdf",
  pt: "/cv/cv-bruno-reche-pt.pdf",
  es: "/cv/cv-bruno-reche-es.pdf",
} as const;

const LABELS = {
  en: {
    main: "Export Resume",
    en: "English (EN)",
    pt: "Português (PT)",
    es: "Español (ES)",
  },
  pt: {
    main: "Exportar Currículo",
    en: "Inglês (EN)",
    pt: "Português (PT)",
    es: "Espanhol (ES)",
  },
  es: {
    main: "Exportar Currículum",
    en: "Inglés (EN)",
    pt: "Portugués (PT)",
    es: "Español (ES)",
  },
} as const;

export default function ExportCVButton() {
  const locale = (useLocale() as "en" | "pt" | "es") ?? "pt";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentHref = FILES[locale] ?? FILES.pt;
  const L = LABELS[locale] ?? LABELS.pt;

  // Fecha dropdown ao clicar fora / esc pressionado
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative inline-flex items-stretch rounded-xl shadow-md shadow-zinc-900/30 ring-1 ring-zinc-700/70 mr-4">
      {/* Botão principal: baixa no locale atual */}
      <a
        href={currentHref}
        download
        className="
          inline-flex items-center gap-2 rounded-l-xl
          bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900
          transition-all hover:scale-[1.02] hover:bg-yellow-400 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-yellow-300
        "
        title={L.main}
      >
        <DownloadCloud className="h-5 w-5" aria-hidden />
        <span>{L.main}</span>
      </a>

      {/* Botão da setinha (abre menu) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="
          inline-flex items-center justify-center rounded-r-xl
          bg-yellow-500/95 px-2 text-zinc-900 transition-all
          hover:scale-[1.02] hover:bg-yellow-400 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-yellow-300
        "
        title={L.main}
      >
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown com as 3 opções */}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="
            absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden
            rounded-xl border border-zinc-700 bg-zinc-800/95
            shadow-xl backdrop-blur-md
          "
        >
          <ul className="py-1">
            <li>
              <a
                role="menuitem"
                href={FILES.en}
                download
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700/70"
                onClick={() => setOpen(false)}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                {L.en}
              </a>
            </li>
            <li>
              <a
                role="menuitem"
                href={FILES.pt}
                download
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700/70"
                onClick={() => setOpen(false)}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                {L.pt}
              </a>
            </li>
            <li>
              <a
                role="menuitem"
                href={FILES.es}
                download
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700/70"
                onClick={() => setOpen(false)}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-fuchsia-400" />
                {L.es}
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
