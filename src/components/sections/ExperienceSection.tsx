"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TitleFX, TextFX } from "@/components/ui/typography";

type TimelineItem = {
  company: string;
  period: string;
  role: string;
  description: string;
};

const ExperienceCard = ({ item, index }: { item: TimelineItem; index: number }) => {
  // Animação: mobile entra de baixo, desktop alterna esquerda/direita
  const isRight = index % 2 !== 0;
  const cardVariants = {
    hidden: { opacity: 0, y: 20, x: 0 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <motion.div
      className="relative mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={cardVariants}
    >
      {/* Conector horizontal (desktop apenas) */}
      <div
        className={`absolute top-5 h-0.5 w-4 bg-cyan-400 hidden md:block ${
          isRight ? "left-full" : "right-full"
        }`}
      />

      {/* Ponto na linha central (desktop apenas) */}
      <div
        className={`absolute top-3.5 h-5 w-5 rounded-full bg-cyan-400 border-4 border-zinc-800 hidden md:block
        ${isRight ? "-left-2.5" : "-right-2.5"}`}
      />

      <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-800 shadow-md">
        <TextFX
          as="p"
          text={item.period}
          className="text-sm font-semibold text-cyan-400 mb-1"
          hoverClassName="hover:scale-115"
          mode="boomerang"
        />
        <TitleFX
          as="h3"
          text={item.role}
          className="text-xl font-bold text-white"
          hoverClassName="hover:scale-200 hover:text-emerald-300"
          mode="boomerang"
        />
        <TextFX
          as="h4"
          text={item.company}
          className="text-lg font-medium text-zinc-300 mb-3"
          hoverClassName="hover:scale-125 hover:text-zinc-200"
          mode="boomerang"
        />
        <TextFX
          as="p"
          text={item.description}
          className="text-zinc-400 text-base"
          hoverClassName="hover:text-zinc-200"
          mode="boomerang"
        />
      </div>
    </motion.div>
  );
};

export default function ExperienceSection() {
  const t = useTranslations("Experience");
  const timelineData = t.raw("timeline") as TimelineItem[];

  return (
    <section id="experience" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <TitleFX
          as="h2"
          text={t("title")}
          className="text-3xl font-bold tracking-tighter sm:text-5xl text-lime-300 mb-16 text-center"
          hoverClassName="hover:scale-125 hover:text-emerald-300"
          mode="boomerang"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Linha vertical central: só no desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 -ml-px bg-zinc-700" />

          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`relative w-full md:w-1/2
                ${index % 2 === 0
                  ? "md:pr-8 md:text-right md:ml-auto"
                  : "md:pl-8"
                }`}
            >
              <ExperienceCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
