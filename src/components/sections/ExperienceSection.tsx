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
  const cardVariants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const side = index % 2 === 0 ? "left" : "right";

  return (
    <motion.div
      className="relative mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={cardVariants}
    >
      {/* Conector horizontal até a linha central */}
      <div
        className={`absolute top-5 h-0.5 w-4 bg-cyan-400 ${
          side === "left" ? "right-full" : "left-full"
        }`}
      />

      {/* Ponto na linha central */}
      <div
        className={`absolute top-3.5 h-5 w-5 rounded-full bg-cyan-400 border-4 border-zinc-800
        ${side === "left" ? "-right-2.5" : "-left-2.5"}`}
      />

      <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-800 shadow-md">
        <TextFX
          as="p"
          text={item.period}
          className="text-sm font-semibold text-cyan-400 mb-1"
          hoverClassName="hover:scale-115"
        />
        <TitleFX
          as="h3"
          text={item.role}
          className="text-xl font-bold text-white"
          hoverClassName="hover:scale-200 hover:text-emerald-300"
        />
        <TextFX
          as="h4"
          text={item.company}
          className="text-lg font-medium text-zinc-300 mb-3"
          hoverClassName="hover:scale-125 hover:text-zinc-200"
        />
        <TextFX
          as="p"
          text={item.description}
          className="text-zinc-400 text-base"
          hoverClassName="hover:text-zinc-200"
        />
      </div>
    </motion.div>
  );
};

export default function ExperienceSection() {
  const t = useTranslations("Experience");
  const timelineData = t.raw("timeline") as TimelineItem[];

  return (
    <section id="projects" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <TitleFX
          as="h2"
          text={t("title")}
          className="text-3xl font-bold tracking-tighter sm:text-5xl text-lime-300 mb-16 text-center"
          hoverClassName="hover:scale-125 hover:text-emerald-300"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Linha vertical central */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -ml-px bg-zinc-700" />

          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`relative w-1/2 ${
                index % 2 === 0 ? "pr-8 text-right ml-auto" : "pl-8"
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
