"use client";

import React, { useState } from "react";
import { useTextChunks } from "./useTextChunks";
import { useSupportsHover } from "./useSupportsHover";

type Props = {
  text: string;
  as?: React.ElementType;            // "h1", "p", "span", etc.
  className?: string;                // classes do container
  split?: "word" | "char";           // como dividir o texto
  hoverClassName?: string;           // classes para DESKTOP (hover)
  tapClassName?: string;             // classes para MOBILE (tap)
  tapDurationMs?: number;            // duração do "bump" no mobile
};

export default function HoverText({
  text,
  as: Tag = "span",
  className = "",
  split = "word",
  hoverClassName = "hover:scale-110 hover:text-amber-300 hover:-translate-y-0.5",
  tapClassName = "scale-110 text-amber-300 -translate-y-0.5",
  tapDurationMs = 220,
}: Props) {
  const supportsHover = useSupportsHover();
  const [activeId, setActiveId] = useState<string | null>(null);
  const chunks = useTextChunks(text, split);

  // Para split="word", preserva espaços.
  // Para split="char", vamos agrupar por palavra e depois explodir em chars
  // Handler de tap no mobile
  const handleTap = (idx: number) => {
    if (supportsHover) return; // no desktop, não usamos tap
    const chunk = chunks[idx];
    if (!chunk || chunk.type === "space") return;
    setActiveId(chunk.id);
    window.setTimeout(() => setActiveId(null), tapDurationMs);
  };

  // Container com utilitários para não quebrar dentro de palavras
  // - break-keep => word-break: keep-all (Tailwind)
  // - [data-mobile="true"] pode ajudar em CSS condicional se quiser
  return React.createElement(
    Tag,
    {
      className: `${className} select-none break-keep`,
      "aria-label": text,
      "data-mobile": (!supportsHover).toString(),
    },
    split === "word"
      ? // ====== MODO "WORD" ======
        chunks.map((chunk, i) => {
          if (chunk.type === "space") {
            return <span key={chunk.id}>{chunk.value}</span>;
          }
          const idx = i; // índice por token (para mobile)
          const interactiveClass = supportsHover
            ? hoverClassName
            : activeId === chunk.id
            ? tapClassName
            : "";

          return (
            <span
              key={chunk.id}
              className={`
                inline-block cursor-default
                transition-transform duration-200 ease-out
                will-change-transform transform-gpu
                ${interactiveClass}
              `}
              style={{ transformOrigin: "center bottom" }}
              onTouchStart={() => handleTap(idx)}
            >
              {chunk.value}
            </span>
          );
        })
      : // ====== MODO "CHAR" COM AGRUPAMENTO POR PALAVRA ======
        chunks.map((chunk) => {
          if (chunk.type === "space") {
            return <span key={chunk.id}>{chunk.value}</span>;
          }

          const chars = chunk.chars ?? [{ id: chunk.id, value: chunk.value }];
          return (
            <span
              key={`group-${chunk.id}`}
              className="inline-block whitespace-nowrap" // <-- evita quebra dentro da palavra
            >
              {chars.map((ch) => {
                const interactiveClass = supportsHover
                  ? hoverClassName
                  : activeId === ch.id
                  ? tapClassName
                  : "";

                return (
                  <span
                    key={ch.id}
                    className={`
                      inline-block cursor-default
                      transition-transform duration-150 ease-out
                      will-change-transform transform-gpu
                      ${interactiveClass}
                    `}
                    style={{ transformOrigin: "center bottom" }}
                    onTouchStart={() => {
                      if (supportsHover) return;
                      setActiveId(ch.id);
                      window.setTimeout(() => setActiveId(null), tapDurationMs);
                    }}
                  >
                    {ch.value}
                  </span>
                );
              })}
            </span>
          );
        })
  );
}
