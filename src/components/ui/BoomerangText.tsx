"use client";

import clsx from "clsx";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ComponentType, JSX, ReactNode } from "react";
import { useTextChunks } from "./useTextChunks";
import { useSupportsHover } from "./useSupportsHover";

export type BoomerangTextProps = {
  text: string;
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  className?: string;
  tokenClassName?: string;
  split?: "char" | "word";
  distance?: number;
  hoverClassName?: string;
  activeClassName?: string;
  tapClassName?: string;
  tapDurationMs?: number;
};

type TokenProps = {
  value: string;
  distance: number;
  className?: string;
  hoverClassName: string;
  activeClassName: string;
  tapClassName: string;
  tapDurationMs: number;
  supportsHover: boolean;
  disabled: boolean;
};

function Token({
  value,
  distance,
  className,
  hoverClassName,
  activeClassName,
  tapClassName,
  tapDurationMs,
  supportsHover,
  disabled,
}: TokenProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const controls = useAnimationControls();
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startActive = (forceTimeout = false) => {
    clearTimer();
    setIsActive(true);
    if (!supportsHover || forceTimeout) {
      timeoutRef.current = window.setTimeout(() => {
        setIsActive(false);
        timeoutRef.current = null;
      }, tapDurationMs);
    }
  };

  const endActive = () => {
    clearTimer();
    setIsActive(false);
  };

  useEffect(
    () => () => {
      clearTimer();
    },
    []
  );

  const handlePointerDown = async (
    event: React.PointerEvent<HTMLSpanElement>
  ) => {
    if (disabled) {
      startActive(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    startActive(false);

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;

    const magnitude = distance * (0.85 + Math.random() * 0.3);
    const outX = dx * magnitude;
    const outY = dy * magnitude;
    const rotation = (Math.random() * 2 - 1) * 24;

    controls.stop();
    controls.set({ x: 0, y: 0, rotate: 0, scale: 1 });

    await controls.start({
      x: [0, outX, 0],
      y: [0, outY, 0],
      rotate: [0, rotation, 0],
      scale: [1, 1.12, 1],
      transition: {
        duration: 1,
        times: [0, 0.55, 1],
        ease: ["easeOut", [0.22, 0.61, 0.36, 1]],
      },
    });

    if (supportsHover) {
      endActive();
    }
  };

  const highlightClass = supportsHover ? hoverClassName : "";
  const activeClass = isActive
    ? supportsHover
      ? activeClassName
      : tapClassName || activeClassName
    : "";

  return (
    <motion.span
      ref={ref}
      onPointerDown={handlePointerDown}
      animate={controls}
      className={clsx(
        "inline-block cursor-default select-none will-change-transform transform-gpu transition-colors duration-200",
        className,
        highlightClass,
        activeClass
      )}
      style={{ transformOrigin: "center bottom" }}
    >
      {value}
    </motion.span>
  );
}

export default function BoomerangText({
  text,
  as: Tag = "span",
  className = "",
  tokenClassName = "",
  split = "char",
  distance = 400,
  hoverClassName = "hover:scale-125 hover:text-emerald-300 hover:-translate-y-0.5",
  activeClassName = "scale-125 text-emerald-300 -translate-y-0.5",
  tapClassName = "scale-125 text-emerald-300 -translate-y-0.5",
  tapDurationMs = 260,
}: BoomerangTextProps) {
  const supportsHover = useSupportsHover();
  const chunks = useTextChunks(text, split);
  const [boomerangEnabled, setBoomerangEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setBoomerangEnabled(!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const TagComponent = Tag as ComponentType<{
    className?: string;
    children?: ReactNode;
    "aria-label"?: string;
  }>;

  return (
    <TagComponent
      className={clsx("select-none break-keep", className)}
      aria-label={text}
    >
      {chunks.map((chunk) => {
        if (chunk.type === "space") {
          return <span key={chunk.id}>{chunk.value}</span>;
        }

        if (chunk.chars) {
          return (
            <span
              key={`group-${chunk.id}`}
              className="inline-block whitespace-nowrap"
            >
              {chunk.chars.map((char) => (
                <Token
                  key={char.id}
                  value={char.value}
                  distance={distance}
                  className={tokenClassName}
                  hoverClassName={hoverClassName}
                  activeClassName={activeClassName}
                  tapClassName={tapClassName}
                  tapDurationMs={tapDurationMs}
                  supportsHover={supportsHover}
                  disabled={!boomerangEnabled}
                />
              ))}
            </span>
          );
        }

        return (
          <Token
            key={chunk.id}
            value={chunk.value}
            distance={distance}
            className={tokenClassName}
            hoverClassName={hoverClassName}
            activeClassName={activeClassName}
            tapClassName={tapClassName}
            tapDurationMs={tapDurationMs}
            supportsHover={supportsHover}
            disabled={!boomerangEnabled}
          />
        );
      })}
    </TagComponent>
  );
}
