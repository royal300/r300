import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  copy,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  copy?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow && (
        <p
          data-reveal
          className="reveal text-[11px] font-semibold tracking-[0.28em] text-muted-foreground"
        >
          {eyebrow}
        </p>
      )}
      <h2
        data-reveal
        className="reveal mt-4 text-[clamp(1.85rem,4vw,3.35rem)] font-bold leading-[1.02]"
        style={{ ["--reveal-delay" as string]: "80ms" }}
      >
        {title} {highlight && <span className="grad-text">{highlight}</span>}
      </h2>
      {copy && (
        <p
          data-reveal
          className="reveal mt-6 text-base leading-relaxed text-muted-foreground"
          style={{ ["--reveal-delay" as string]: "160ms" }}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
