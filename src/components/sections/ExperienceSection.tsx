"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Definindo o tipo para um item da linha do tempo para usar com TypeScript
type TimelineItem = {
  company: string;
  period: string;
  role: string;
  description: string;
};

// Componente para um único card de experiência
const ExperienceCard = ({ item, index }: { item: TimelineItem; index: number }) => {
  // Animação de entrada: fade in e slide in da direção correta
  const cardVariants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="relative mb-8"
      initial="hidden"
      whileInView="visible" // Anima quando o elemento entra na viewport
      viewport={{ once: true, amount: 0.3 }} // Anima uma vez, quando 30% do card estiver visível
      variants={cardVariants}
    >
      {/* Linha de conexão com o eixo central */}
      <div className={`absolute top-5 h-0.5 w-4 bg-cyan-400 ${index % 2 === 0 ? 'right-full' : 'left-full'}`}></div>
      
      {/* Ponto no eixo central */}
      <div className="absolute top-3.5 -ml-2.5 h-5 w-5 rounded-full bg-cyan-400 border-4 border-zinc-800"></div>

      <div className="p-6 rounded-lg border border-zinc-700 bg-zinc-800 shadow-md">
        <p className="text-sm font-semibold text-cyan-400 mb-1">{item.period}</p>
        <h3 className="text-xl font-bold text-white">{item.role}</h3>
        <h4 className="text-lg font-medium text-zinc-300 mb-3">{item.company}</h4>
        <p className="text-zinc-400 text-base">{item.description}</p>
      </div>
    </motion.div>
  );
};

export default function ExperienceSection() {
  const t = useTranslations("Experience");
  const timelineData: TimelineItem[] = t.raw("timeline");

  return (
    <section id="projects" className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-16 text-center">
          {t("title")}
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          {/* A linha vertical central da timeline */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -ml-px bg-zinc-700"></div>

          {timelineData.map((item, index) => (
            <div key={index} className={`relative w-1/2 ${index % 2 === 0 ? 'pr-8 text-right ml-auto' : 'pl-8'}`}>
              <ExperienceCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
