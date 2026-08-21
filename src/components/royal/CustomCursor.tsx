import * as React from "react";

type Mode = "default" | "button" | "view" | "image";

export function CustomCursor() {
  const dot = React.useRef<HTMLDivElement>(null);
  const ring = React.useRef<HTMLDivElement>(null);
  const glow = React.useRef<HTMLDivElement>(null);

  const [mode, setMode] = React.useState<Mode>("default");
  const [enabled, setEnabled] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

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
    let gx = x;
    let gy = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const next = (target?.getAttribute("data-cursor") as Mode) ?? "default";
      setMode((m) => (m === next ? m : next));
    };

    const onDown = () => setIsMouseDown(true);
    const onUp = () => setIsMouseDown(false);

    const loop = () => {
      // Smooth lerp physics
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;

      // Slower ambient aura glow lerp
      gx += (x - gx) * 0.08;
      gy += (y - gy) * 0.08;

      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (glow.current) glow.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, []);

  if (!enabled) return null;

  const baseSize = mode === "view" ? 92 : mode === "image" ? 72 : mode === "button" ? 56 : 38;
  const size = isMouseDown ? baseSize * 0.82 : baseSize;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Drifting Bluish Aura Glow */}
      <div
        ref={glow}
        className="absolute left-0 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-40 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--electric) 40%, transparent) 0%, color-mix(in oklab, var(--violet) 25%, transparent) 50%, transparent 80%)",
        }}
      />

      {/* Outer Trailing Glowing Blue Ring */}
      <div
        ref={ring}
        className="absolute left-0 top-0 grid place-items-center rounded-full text-xs font-bold tracking-[0.2em] text-white backdrop-blur-[2px] transition-[width,height,background-color,border-color,box-shadow,opacity] duration-500 [transition-timing-function:var(--ease-royal)]"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          backgroundColor:
            mode === "default"
              ? "rgba(0, 195, 255, 0.08)"
              : "rgba(0, 195, 255, 0.22)",
          borderColor:
            mode === "default"
              ? "rgba(0, 210, 255, 0.45)"
              : "rgba(0, 230, 255, 0.85)",
          borderWidth: "1.5px",
          borderStyle: "solid",
          boxShadow:
            mode === "default"
              ? "0 0 20px rgba(0, 200, 255, 0.25), inset 0 0 15px rgba(0, 200, 255, 0.15)"
              : "0 0 35px rgba(0, 220, 255, 0.55), inset 0 0 25px rgba(0, 220, 255, 0.3)",
        }}
      >
        {mode === "view" && (
          <span className="drop-shadow-[0_2px_8px_rgba(0,220,255,0.8)] font-display text-[11px]">
            VIEW ↗
          </span>
        )}
      </div>

      {/* Core Glowing Electric Blue Dot */}
      <div
        ref={dot}
        className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity,background-color] duration-300"
        style={{
          marginLeft: -1.5,
          marginTop: -1.5,
          background: "radial-gradient(circle, #ffffff 0%, var(--electric) 60%, #0066ff 100%)",
          boxShadow: "0 0 12px #00f0ff, 0 0 24px rgba(0, 180, 255, 0.8)",
          opacity: mode === "default" ? 1 : 0.4,
          transform: isMouseDown ? "scale(1.5)" : "scale(1)",
        }}
      />
    </div>
  );
}
