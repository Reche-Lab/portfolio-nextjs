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

// Ícone de Fechar (X)
const CloseIcon = () => (
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
 );

type InfoCardProps = {
  objectKey: "icosahedron" | "prism" | "globe" | "black-dragon";
  isHovered: boolean;
  // A prop `position` foi removida
};

export default function InfoCard({ objectKey, isHovered }: InfoCardProps) {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const t = useTranslations("Info");

  const infoText = t(objectKey);
  const techText = t("tech");

  return (
    <>
      {/* 
        Botão "i" em uma posição fixa.
        Ele fica sutil por padrão e se destaca no hover do objeto 3D.
      */}
      <button
        onClick={() => setIsCardOpen(true)}
        className={`fixed bottom-6 left-6 z-20 rounded-full p-3 text-zinc-400 backdrop-blur-sm transition-all duration-300 ease-in-out
          hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white
          ${isHovered ? "scale-110 opacity-100" : "scale-100 opacity-50"}`}
        aria-label={t("title")}
      >
        <InfoIcon />
      </button>

      {/* O código do Modal/Card permanece exatamente o mesmo */}
      <div
        className={`fixed inset-0 z-30 flex items-center justify-center transition-opacity duration-300 ease-in-out
          ${isCardOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-70"
          onClick={() => setIsCardOpen(false)}
        />
        <div
          className={`relative max-w-md w-full rounded-lg bg-zinc-900 border border-zinc-700 p-6 m-4 shadow-lg transition-all duration-300 ease-in-out
            ${isCardOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
        >
          <h3 className="text-xl font-bold text-white mb-4">{t("title")}</h3>
          <div className="space-y-4 text-zinc-300">
            <p>{infoText}</p>
            <hr className="border-zinc-700" />
            <p dangerouslySetInnerHTML={{ __html: techText }} />
          </div>
          <button
            onClick={() => setIsCardOpen(false)}
            className="absolute top-3 right-3 rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </>
  );
}
