"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import clsx from "clsx";

type Props = {
  text: string;
  as?: keyof JSX.IntrinsicElements | React.ElementType; // "h1","h2","p", etc.
  className?: string;                   // classes do container
  tokenClassName?: string;              // classes de cada token
  split?: "char" | "word";              // padrão: char (títulos)
  distance?: number;                    // distância “arremesso” em px (default 240)
};

function Token({
  children,
  distance = 240,
  className,
}: {
  children: string;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const controls = useAnimationControls();

  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    // distância + leve aleatoriedade pra ficar orgânico
    const d = distance * (0.85 + Math.random() * 0.3);
    const outX = dx * d;
    const outY = dy * d;
    const rot = (Math.random() * 2 - 1) * 24; // -24..24 graus

    controls.stop();
    controls.set({ x: 0, y: 0, rotate: 0 });

    controls.start({
      x: [0, outX, 0],
      y: [0, outY, 0],
      rotate: [0, rot, 0],
      transition: {
        duration: 0.95,
        times: [0, 0.6, 1],
        ease: ["easeOut", [0.22, 0.61, 0.36, 1]], // saída rápida, volta macia
      },
    });
  };

  return (
    <motion.span
      ref={ref}
      onPointerDown={onPointerDown}
      animate={controls}
      className={clsx(
        "inline-block select-none cursor-default will-change-transform transform-gpu transition-colors duration-200",
        className
      )}
      style={{ transformOrigin: "center bottom" }}
    >
      {children}
    </motion.span>
  );
}

export default function BoomerangText({
  text,
  as: Tag = "span",
  className = "",
  tokenClassName = "hover:scale-125 hover:text-emerald-300",
  split = "char",
  distance = 400,
}: Props) {
  const TagComponent = Tag as React.ComponentType<{ className?: string; "aria-label"?: string; children?: React.ReactNode }>;
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    // respeita prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const tokens =
    split === "word" ? text.split(/(\s+)/) : Array.from(text); // preserva espaços

  return (
    <TagComponent className={className} aria-label={text}>
      {tokens.map((tok, i) => {
        const isSpace = /\s+/.test(tok);
        if (isSpace) return <span key={`sp-${i}`}>{tok}</span>;

        if (!enabled) {
          // fallback sem animação
          return (
            <span key={`t-${i}`} className={clsx("inline-block", tokenClassName)}>
              {tok}
            </span>
          );
        }

        return (
          <Token key={`t-${i}`} distance={distance} className={tokenClassName}>
            {tok}
          </Token>
        );
      })}
    </TagComponent>
  );
}
