"use client";

import { useEffect, useState } from "react";

/**
 * Detecta suporte a hover em tempo real (útil para diferenciar desktop de touch).
 */
export function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setSupportsHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return supportsHover;
}
