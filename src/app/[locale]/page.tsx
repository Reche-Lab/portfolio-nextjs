"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Background3D from "@/components/core/Background3D";
import InteractiveBackground from "@/components/core/InteractiveBackground";
// import InfoCard from "@/components/ui/InfoCard";
import { useState } from "react";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import FancyCursor from "@/components/ui/FancyCursor";
import { TitleFX, TextFX } from "@/components/ui/typography";



export default function Home() {
  const t = useTranslations("Hero");
  const [currentObject] = useState(2);
  
  return (
    <div className="creative-cursor">
      <FancyCursor />
      <div className="grid h-screen w-screen place-items-center">
        <div className="col-start-1 row-start-1 h-full w-full">
          <InteractiveBackground />
        </div>

        <div className="col-start-1 row-start-1 h-full w-full relative overflow-hidden">
          <div className={`absolute inset-0 ${currentObject === 3 ? '-translate-y-[14%]' : ''}`}>
            <Background3D 
              currentObject={currentObject} 
              // onObjectHover={setIsObjectHovered}
            />
          </div>
        </div>
        {/* <InfoCard
          objectKey={objectKeys[currentObject]}
          isHovered={isObjectHovered}
        /> */}

        {/* Camada 2: O Conteúdo */}
        {/* Ocupa a MESMA célula, ficando por cima */}
        <div className="relative col-start-1 row-start-1 flex flex-col items-center space-y-6 p-6 text-center text-white">
          <div className="space-y-4">
            <TitleFX
              as="h1"
              text={t("title")}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-lime-300"
              hoverClassName="hover:scale-125 hover:text-emerald-300 hover:-translate-y-0.5"
            />
            <TextFX
              as="p"
              text={t("subtitle")}
              className="max-w-4xl text-lg text-zinc-500 md:text-xl mx-auto"
              hoverClassName="hover:scale-110 hover:text-zinc-200"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/#projects"
              className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-8 py-3 text-base 
                font-medium text-zinc-900 shadow-sm transition-transform hover:scale-110 hover:font-bold focus:outline-none 
                focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {t("cta.projects")}
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md border border-yellow-400 
                bg-transparent px-8 py-3 text-base font-medium text-yellow-400 transition-colors 
                transition-transform hover:scale-90 hover:font-bold focus:outline-none focus:ring-2 
                focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {t("cta.contact")}
            </Link>
          </div>
        </div>
      </div>
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
