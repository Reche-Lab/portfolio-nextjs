"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Ícone de Informação (um SVG simples)
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
 );

type InfoCardProps = {
  objectKey: "icosahedron" | "prism" | "globe" | "hologram";
};

export default function InfoCard({ objectKey }: InfoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Info");

  // Mapeia a chave do objeto para a chave da tradução
  const infoText = t(objectKey);
  const techText = t("tech");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 left-6 z-20 rounded-full p-3 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={t("title")}
      >
        <InfoIcon />
      </button>
    );
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-md w-full rounded-lg bg-zinc-900 border border-zinc-700 p-6 m-4 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">{t("title")}</h3>
        <div className="space-y-4 text-zinc-300">
          <p>{infoText}</p>
          <hr className="border-zinc-700" />
          <p dangerouslySetInnerHTML={{ __html: techText }} />
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
   );
}
