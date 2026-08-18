import * as React from "react";

type Mode = "default" | "button" | "view" | "image";

export function CustomCursor() {
  const dot = React.useRef<HTMLDivElement>(null);
  const ring = React.useRef<HTMLDivElement>(null);
  const [mode, setMode] = React.useState<Mode>("default");
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-desktop");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const next = (target?.getAttribute("data-cursor") as Mode) ?? "default";
      setMode((m) => (m === next ? m : next));
    };

    const loop = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, []);

  if (!enabled) return null;

  const size = mode === "view" ? 86 : mode === "image" ? 64 : mode === "button" ? 52 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
        style={{ marginLeft: -3, marginTop: -3, opacity: mode === "default" ? 1 : 0 }}
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-foreground/25 text-[10px] font-semibold tracking-[0.2em] text-foreground transition-[width,height,background-color,border-color] duration-500 [transition-timing-function:var(--ease-royal)]"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          backgroundColor:
            mode === "default"
              ? "transparent"
              : "color-mix(in oklab, var(--electric) 14%, transparent)",
          borderColor:
            mode === "default"
              ? "color-mix(in oklab, var(--foreground) 22%, transparent)"
              : "color-mix(in oklab, var(--electric) 55%, transparent)",
        }}
      >
        {mode === "view" ? "VIEW" : ""}
      </div>
    </div>
  );
}
