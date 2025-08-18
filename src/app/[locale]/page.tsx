"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // Importe o Link do next-intl

export default function Home() {
  const t = useTranslations("Hero");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-6 text-center text-white">
      {/* Container para o conteúdo do Hero */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Título e Subtítulo */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300 md:text-xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Botões de Call to Action (CTA) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/#projects" // Link de âncora para uma futura seção
            className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-zinc-900 shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            {t("cta.projects")}
          </Link>
          <Link
            href="/#contact" // Link de âncora para uma futura seção
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-transparent px-8 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            {t("cta.contact")}
          </Link>
        </div>
      </div>
    </main>
  );
}

