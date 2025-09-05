import React from "react";

type Props = {
  text: string;
  as?: React.ElementType; // "h1", "p", "span", etc.
  className?: string;               // classes do container (tamanho, peso, cor base)
  split?: "word" | "char";          // como dividir o texto
  hoverClassName?: string;          // classes aplicadas a cada token no hover
};

export default function HoverText({
  text,
  as: Tag = "span",
  className = "",
  split = "word",
  hoverClassName = "hover:scale-110 hover:text-amber-300 hover:-translate-y-0.5",
}: Props) {
  // divide preservando espaços quando for por palavra
  const tokens =
    split === "word"
      ? text.split(/(\s+)/) // ["Hello", " ", "world", ...]
      : Array.from(text);   // lida bem com acentos/emoji

  return React.createElement(
    Tag,
    { className: `${className} select-none`, 'aria-label': text },
    tokens.map((tok, i) => {
      const isSpace = /\s+/.test(tok);
      if (isSpace) return <span key={`sp-${i}`}>{tok}</span>;
      return (
        <span
          key={`t-${i}`}
          className={`
            inline-block cursor-default
            transition-transform duration-200 ease-out
            will-change-transform transform-gpu
            ${hoverClassName}
          `}
          style={{ transformOrigin: "center bottom" }}
        >
          {tok}
        </span>
      );
    })
  );
}
