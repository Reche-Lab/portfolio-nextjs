"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL = 14;     // quantidade de segmentos (1 cabeça + 13 cauda)
const FOLLOW = 0.22;  // quanto a cauda “persegue” o segmento anterior (0.15–0.35)

function isFormEl(el: EventTarget | null) {
  const e = el as HTMLElement | null;
  if (!e) return false;
  return (
    e.tagName === "INPUT" ||
    e.tagName === "TEXTAREA" ||
    e.tagName === "SELECT" ||
    e.isContentEditable
  );
}
function isClickable(el: EventTarget | null) {
  const e = el as HTMLElement | null;
  if (!e) return false;
  return (
    e.tagName === "A" ||
    e.tagName === "BUTTON" ||
    e.getAttribute("role") === "button" ||
    e.classList.contains("cursor-pointer")
  );
}

export default function FancyCursorComet() {
  const headRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const pos = useRef(Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 })));
  const raf = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(true);

  // respeita prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setEnabled(!mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      // cabeça: presa no mouse imediatamente
      pos.current[0].x = e.clientX;
      pos.current[0].y = e.clientY;

      const overForm = isFormEl(e.target);
      const overClickable = isClickable(e.target);

      // esconder cursor nativo exceto em formulários
      document.documentElement.classList.toggle("cursor-none", !overForm);

      const head = headRef.current;
      if (head) {
        head.style.opacity = overForm ? "0" : "1";
        head.dataset.variant = overClickable ? "link" : "default";
        head.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    const onDown = () => headRef.current?.setAttribute("data-active", "true");
    const onUp = () => headRef.current?.setAttribute("data-active", "false");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const tick = () => {
      // cada segmento segue o anterior (efeito cometa)
      for (let i = 1; i < TRAIL; i++) {
        const p = pos.current[i];
        const prev = pos.current[i - 1];
        p.x += (prev.x - p.x) * FOLLOW;
        p.y += (prev.y - p.y) * FOLLOW;

        const seg = trailsRef.current[i - 1];
        if (seg) {
          const t = i / TRAIL;               // 0→1 ao longo da cauda
          const size = 18 * (1 - t) + 4;     // decresce tamanho
          const alpha = 0.35 * (1 - t);      // decresce opacidade

          seg.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
          seg.style.width = `${size}px`;
          seg.style.height = `${size * 0.9}px`;
          seg.style.opacity = `${alpha}`;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [enabled]);

  // desativa em dispositivos touch/coarse
  const isTouch =
    typeof window !== "undefined" &&
    matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (!enabled || isTouch) return null;

  return (
    <>
      {/* cabeça do cursor (presa ao mouse) */}
      <div
        ref={headRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[opacity,transform,width,height,box-shadow] duration-75"
        style={{
          width: 18,
          height: 18,
          background: "rgba(255,255,255,0.9)",
          mixBlendMode: "difference",
          boxShadow: "0 0 24px rgba(255,255,255,0.5)",
          filter: "blur(0.2px)",
        }}
        data-variant="default"
        data-active="false"
      />
      {/* cauda (segmentos) */}
      {Array.from({ length: TRAIL - 1 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.5)",
            mixBlendMode: "difference",
            boxShadow: "0 0 20px rgba(255,255,255,0.25)",
            filter: "blur(2px)",
          }}
        />
      ))}
    </>
  );
}
