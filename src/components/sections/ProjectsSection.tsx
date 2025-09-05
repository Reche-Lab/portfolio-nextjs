"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { TitleFX, TextFX } from "@/components/ui/typography";

// Tipos
type Project = {
  title: string;
  description: string;
  stack: string[];
  url: string;
  // opcional: image?: string; // se quiser screenshot futuramente
};

const TechBadge = ({ label }: { label: string }) => {
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
      {label}
    </div>
  );
};

// Card de Projeto (Motion)
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800/80 shadow-md"
    >
      {/* Header visual (placeholder elegante; troque por imagem se quiser) */}
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-emerald-400/20 to-fuchsia-500/20 blur-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.25),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,0,255,0.18),transparent_45%)]" />
      </div>

      {/* Corpo */}
      <div className="flex flex-col gap-4 p-6">
        <TitleFX
          as="h3"
          text={project.title}
          className="text-xl font-bold text-white"
          hoverClassName="hover:scale-175 hover:text-emerald-300"
        />
        <TextFX
          as="p"
          text={project.description}
          className="text-zinc-300"
          hoverClassName="hover:scale-105 hover:text-zinc-200 hover:font-bold"
        />

        <div className="mt-1 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <TechBadge key={s} label={s} />
          ))}
        </div>

        <div className="mt-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-yellow-500/80 
                bg-transparent px-4 py-2 text-sm font-medium text-yellow-400 transition-all hover:-translate-y-0.5 
                hover:bg-yellow-400 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
          >
            Ver ao vivo
          </a>
        </div>
      </div>

      {/* Glow sutil no hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10 blur" />
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const t = useTranslations("Projects"); // use para título/subtítulo se criar as chaves no i18n

  // === Adicione novos projetos AQUI ===
  const projects = t.raw("projectsList") as Project[];

  return (
    <section id="projects" className="w-full py-20 lg:py-32 bg-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Cabeçalho da seção */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <TitleFX
            as="h2"
            text={t("title", { default: "Projetos em Destaque" })}
            className="text-3xl font-bold tracking-tighter sm:text-5xl text-lime-300"
            hoverClassName="hover:scale-125 hover:text-emerald-300"
          />
          <TitleFX
            as="h3"
            text={t("subtitle", {
              default: "Uma seleção de trabalhos reais — preparada para crescer.",
            })}
            className="mt-3 text-zinc-300 md:text-xl"
            hoverClassName="hover:scale-200 hover:text-yellow-200 hover:font-bold"
          />
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.url} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
