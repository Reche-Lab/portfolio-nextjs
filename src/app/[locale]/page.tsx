"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Background3D from "@/components/core/Background3D";
import InteractiveBackground from "@/components/core/InteractiveBackground";
// import InfoCard from "@/components/ui/InfoCard";
import { useState } from "react";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ContactSection from "@/components/sections/ContactSection";
import FancyCursor from "@/components/ui/FancyCursor";


export default function Home() {
  const t = useTranslations("Hero");
  const [currentObject] = useState(3);
  
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-lime-400">
              {t("title")}
            </h1>
            <p className="max-w-8xl text-lg text-zinc-500 md:text-xl">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/#projects"
              className="inline-flex items-center justify-center rounded-md bg-yellow-500 px-8 py-3 text-base font-medium text-zinc-900 shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {t("cta.projects")}
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md border border-yellow-500 bg-transparent px-8 py-3 text-base font-medium text-yellow-500 transition-colors hover:bg-zinc-800 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {t("cta.contact")}
            </Link>
          </div>
        </div>
      </div>
      <AboutSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}
