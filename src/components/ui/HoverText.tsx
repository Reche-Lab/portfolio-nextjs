"use client";

import React, { useEffect, useMemo, useState } from "react";

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
  const [supportsHover, setSupportsHover] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    // Detecta se o dispositivo suporta hover
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setSupportsHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Para split="word", preserva espaços.
  // Para split="char", vamos agrupar por palavra e depois explodir em chars
  const parts = useMemo(() => text.split(/(\s+)/), [text]);

  // Handler de tap no mobile
  const handleTap = (idx: number) => {
    if (supportsHover) return; // no desktop, não usamos tap
    setActiveIdx(idx);
    window.setTimeout(() => setActiveIdx(null), tapDurationMs);
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
        parts.map((tok, i) => {
          const isSpace = /\s+/.test(tok);
          if (isSpace) return <span key={`sp-${i}`}>{tok}</span>;
          const idx = i; // índice por token
          const interactiveClass = supportsHover
            ? hoverClassName
            : activeIdx === idx
            ? tapClassName
            : "";

          return (
            <span
              key={`w-${i}`}
              className={`
                inline-block cursor-default
                transition-transform duration-200 ease-out
                will-change-transform transform-gpu
                ${interactiveClass}
              `}
              style={{ transformOrigin: "center bottom" }}
              onTouchStart={() => handleTap(idx)}
            >
              {tok}
            </span>
          );
        })
      : // ====== MODO "CHAR" COM AGRUPAMENTO POR PALAVRA ======
        parts.map((tok, i) => {
          const isSpace = /\s+/.test(tok);
          if (isSpace) return <span key={`sp-${i}`}>{tok}</span>;

          // Agrupa as letras desta palavra em um "word wrapper"
          const chars = Array.from(tok);
          return (
            <span
              key={`gw-${i}`}
              className="inline-block whitespace-nowrap" // <-- evita quebra dentro da palavra
            >
              {chars.map((ch, j) => {
                const idx = Number(`${i}${j}`); // índice único por caractere
                const interactiveClass = supportsHover
                  ? hoverClassName
                  : activeIdx === idx
                  ? tapClassName
                  : "";

                return (
                  <span
                    key={`c-${i}-${j}`}
                    className={`
                      inline-block cursor-default
                      transition-transform duration-150 ease-out
                      will-change-transform transform-gpu
                      ${interactiveClass}
                    `}
                    style={{ transformOrigin: "center bottom" }}
                    onTouchStart={() => handleTap(idx)}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          );
        })
  );
}
