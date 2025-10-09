import HoverText from "@/components/ui/HoverText";
import BoomerangText, {
  type BoomerangTextProps,
} from "@/components/ui/BoomerangText";

type BoomerangOverrides = Pick<
  BoomerangTextProps,
  "distance" | "activeClassName" | "tapClassName" | "tapDurationMs" | "tokenClassName"
>;

export function TitleFX({
  text,
  as = "h1",
  className = "",
  hoverClassName = "hover:scale-125 hover:text-emerald-300 hover:-translate-y-0.5",
  mode = "hover",
  boomerangOptions,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  hoverClassName?: string;
  mode?: "hover" | "boomerang";
  boomerangOptions?: BoomerangOverrides;
}) {
  if (mode === "boomerang") {
    return (
      <BoomerangText
        as={as}
        text={text}
        split="char"
        className={className}
        hoverClassName={hoverClassName}
        {...boomerangOptions}
      />
    );
  }

  return (
    <HoverText
      as={as}
      text={text}
      split="char"         // títulos por LETRA
      className={className}
      hoverClassName={hoverClassName}
      tapClassName="scale-200 text-emerald-300 -translate-y-0.5" // mobile
    />
  );
}

export function TextFX({
  text,
  as = "p",
  className = "",
  hoverClassName = "hover:scale-110 hover:text-zinc-200",
  mode = "hover",
  boomerangOptions,
}: {
  text: string;
  as?: "p" | "span" | "div" | "h4";
  className?: string;
  hoverClassName?: string;
  mode?: "hover" | "boomerang";
  boomerangOptions?: BoomerangOverrides;
}) {
  if (mode === "boomerang") {
    return (
      <BoomerangText
        as={as}
        text={text}
        split="word"
        className={className}
        hoverClassName={hoverClassName}
        {...boomerangOptions}
      />
    );
  }

  return (
    <HoverText
      as={as}
      text={text}
      split="word"         // textos por PALAVRA
      className={className}
      hoverClassName={hoverClassName}
      tapClassName="scale-200 text-zinc-200"
    />
  );
}
