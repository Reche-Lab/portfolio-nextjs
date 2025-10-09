"use client";

import { useMemo } from "react";

export type TextChunk =
  | {
      type: "space";
      id: string;
      value: string;
    }
  | {
      type: "word";
      id: string;
      value: string;
      chars?: Array<{
        id: string;
        value: string;
      }>;
    };

/**
 * Normaliza a divisão do texto respeitando espaços e agrupamentos por palavra.
 * Mantém assinaturas determinísticas para que animações possam identificar cada pedaço.
 */
export function useTextChunks(text: string, split: "word" | "char") {
  return useMemo<TextChunk[]>(() => {
    const tokens = text.split(/(\s+)/);
    let wordIndex = 0;

    return tokens.map((token, tokenIndex) => {
      const isSpace = /\s+/.test(token);
      if (isSpace) {
        return {
          type: "space" as const,
          id: `space-${tokenIndex}`,
          value: token,
        };
      }

      const chunkBase = {
        type: "word" as const,
        id: `word-${wordIndex}`,
        value: token,
      };

      if (split === "char") {
        const chars = Array.from(token).map((char, charIndex) => ({
          id: `char-${wordIndex}-${charIndex}`,
          value: char,
        }));
        wordIndex += 1;
        return {
          ...chunkBase,
          chars,
        };
      }

      wordIndex += 1;
      return chunkBase;
    });
  }, [split, text]);
}
