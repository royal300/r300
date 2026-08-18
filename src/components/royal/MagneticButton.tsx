import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  hoverLabel?: string;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
};

export function MagneticButton({
  children,
  hoverLabel,
  variant = "primary",
  href = "#contact",
  className,
}: Props) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = React.useState(false);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
  };

  const reset = () => {
    setHover(false);
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="button"
      onPointerMove={onMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={reset}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-[transform,box-shadow,background-color] duration-500 [transition-timing-function:var(--ease-royal)]",
        variant === "primary"
          ? "text-primary-foreground shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--electric)_60%,transparent)]"
          : "border border-border/80 bg-card/60 text-foreground backdrop-blur-md hover:border-electric/40",
        className,
      )}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,var(--primary),var(--electric)_55%,var(--violet))] transition-transform duration-700 [transition-timing-function:var(--ease-royal)] group-hover:scale-110"
        />
      )}
      <span className="relative">{hover && hoverLabel ? hoverLabel : children}</span>
    </a>
  );
}
