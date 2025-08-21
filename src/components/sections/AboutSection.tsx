"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

// ============================================================================
// COMPONENTE REUTILIZÁVEL: SkillBadge
// ============================================================================

const SkillBadge = ({ name }: { name: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    // Se já estiver animando, não faz nada para evitar spam de cliques
    if (isClicked) return;

    setIsClicked(true);
    // Remove o estado de clique após a animação para que possa ser acionado novamente
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-full bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200
        cursor-pointer transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20
        focus:outline-none focus:ring-2 focus:ring-cyan-400
        ${isClicked ? 'animate-shake bg-cyan-500 text-zinc-900 font-bold' : ''}
      `}
    >
      {name}
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: AboutSection
// ============================================================================

export default function AboutSection() {
  const t = useTranslations("About");
  
  // Busca os dados estruturados diretamente do arquivo de tradução
  const educationData = t.raw("education");
  const skillsData = t.raw("skills");

  return (
    <section id="about" className="w-full py-20 lg:py-32 bg-zinc-800">
      <div className="container mx-auto px-4 md:px-6 space-y-16">
        
        {/* 1. Bloco de Introdução */}
        <div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-3xl text-zinc-300 md:text-xl/relaxed">
            {t("introduction")}
          </p>
        </div>

        {/* 2. Bloco de Formação */}
        <div>
          <h3 className="text-2xl font-bold text-white">{t("educationTitle")}</h3>
          <div className="mt-6 space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {Array.isArray(educationData) && educationData.map((edu: any, index: number) => (
              <div key={index} className="border-l-2 border-cyan-400 pl-4">
                <h4 className="text-lg font-semibold text-zinc-100">{edu.degree}</h4>
                <p className="text-md text-zinc-300">{edu.institution}</p>
                <p className="text-sm text-zinc-400">{edu.period}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bloco de Habilidades */}
        <div>
          <h3 className="text-2xl font-bold text-white">{t("skillsTitle")}</h3>
          <div className="mt-6 space-y-8">
            {/* Mapeia dinamicamente cada categoria de habilidade (languages, cloud, etc.) */}
            {Object.keys(skillsData).map((categoryKey) => {
              const category = skillsData[categoryKey as keyof typeof skillsData];
              return (
                <div key={category.title}>
                  <h4 className="font-semibold text-zinc-200 mb-4">{category.title}</h4>
                  <div className="flex flex-wrap gap-3">
                    {Array.isArray(category.items) && category.items.map((skill: string) => (
                      <SkillBadge key={skill} name={skill} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
