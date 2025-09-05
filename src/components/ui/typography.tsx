import HoverText from "@/components/ui/HoverText";

export function TitleFX({
  text,
  as = "h1",
  className = "",
  hoverClassName = "hover:scale-125 hover:text-emerald-300 hover:-translate-y-0.5",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  hoverClassName?: string;
}) {
  return (
    <HoverText
      as={as}
      text={text}
      split="char"         // títulos por LETRA
      className={className}
      hoverClassName={hoverClassName}
    />
  );
}

export function TextFX({
  text,
  as = "p",
  className = "",
  hoverClassName = "hover:scale-110 hover:text-zinc-200",
}: {
  text: string;
  as?: "p" | "span" | "div" | "h4";
  className?: string;
  hoverClassName?: string;
}) {
  return (
    <HoverText
      as={as}
      text={text}
      split="word"         // textos por PALAVRA
      className={className}
      hoverClassName={hoverClassName}
    />
  );
}
