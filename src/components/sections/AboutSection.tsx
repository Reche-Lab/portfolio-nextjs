"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { TitleFX, TextFX } from "@/components/ui/typography";

// ============================================================================
// TIPOS (opcional, só para ajudar o TS)
// ============================================================================
type EducationItem = { degree: string; institution: string; period: string };
type SkillsCategory = { title: string; items: string[] };
type SkillsMap = Record<string, SkillsCategory>;

// ============================================================================
// COMPONENTE REUTILIZÁVEL: SkillBadge
// ============================================================================
const SkillBadge = ({ name }: { name: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-full bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200
        cursor-pointer transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20
        focus:outline-none focus:ring-2 focus:ring-cyan-400
        ${isClicked ? "animate-shake bg-cyan-500 text-zinc-900 font-bold" : ""}
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

  const educationData = t.raw("education") as unknown as EducationItem[];
  const skillsData = t.raw("skills") as unknown as SkillsMap;

  return (
    <section id="about" className="w-full py-20 lg:py-32 bg-zinc-800">
      <div className="container mx-auto px-4 md:px-6 space-y-16">
        {/* 1) Introdução */}
        <div>
          <TitleFX
            as="h2"
            text={t("title")}
            className="text-3xl font-bold tracking-tighter sm:text-5xl text-lime-300"
            hoverClassName="hover:scale-150 hover:text-emerald-300"
          />
          <TextFX
            as="p"
            text={t("introduction")}
            className="mt-4 max-w-3xl text-zinc-300 md:text-xl/relaxed"
            hoverClassName="hover:scale-[1.1] hover:text-yellow-500"
          />
        </div>

        {/* 2) Formação */}
        <div>
          <TitleFX
            as="h3"
            text={t("educationTitle")}
            className="text-2xl font-bold text-cyan-300"
            hoverClassName="hover:scale-200 hover:text-emerald-300"
          />
          <div className="mt-6 space-y-6">
            {Array.isArray(educationData) &&
              educationData.map((edu, index) => (
                <div key={index} className="border-l-2 border-cyan-400 pl-4">
                  <TextFX
                    as="p"
                    text={edu.degree}
                    className="text-lg font-semibold text-zinc-100"
                    hoverClassName="hover:scale-110 hover:text-cyan-500"
                  />
                  <TextFX
                    as="p"
                    text={edu.institution}
                    className="text-md text-zinc-300"
                    hoverClassName="hover:scale-[1.25] hover:text-cyan-200"
                  />
                  <TextFX
                    as="p"
                    text={edu.period}
                    className="text-sm text-zinc-400"
                    hoverClassName="hover:text-zinc-300"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* 3) Habilidades */}
        <div>
          <TitleFX
            as="h3"
            text={t("skillsTitle")}
            className="text-2xl font-bold text-cyan-300"
            hoverClassName="hover:scale-200 hover:text-emerald-300"
          />
          <div className="mt-6 space-y-8">
            {skillsData &&
              Object.keys(skillsData).map((key) => {
                const category = skillsData[key];
                return (
                  <div key={category.title}>
                    <TextFX
                      as="h4"
                      text={category.title}
                      className="font-semibold text-zinc-200 mb-4"
                      hoverClassName="hover:scale-110 hover:text-lime-500"
                    />
                    <div className="flex flex-wrap gap-3">
                      {Array.isArray(category.items) &&
                        category.items.map((skill) => (
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
