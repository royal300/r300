import * as React from "react";

type Mode = "default" | "button" | "view" | "image";

export function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);

  const [mode, setMode] = React.useState<Mode>("default");
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  React.useEffect(() => {
    // Enable custom cursor for screen widths >= 768px
    const checkDesktop = () => {
      const isLargeScreen = window.innerWidth >= 768;
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      return isLargeScreen || hasFinePointer;
    };

    if (!checkDesktop()) {
      setIsDesktop(false);
      return;
    }

    setIsDesktop(true);
    document.documentElement.classList.add("cursor-none-desktop");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let glowX = -100;
    let glowY = -100;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check hovered element cursor mode
      const target = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, [role='button']"
      );
      if (target) {
        const customMode = target.getAttribute("data-cursor") as Mode | null;
        if (customMode) {
          setMode(customMode);
        } else if (target.tagName === "A" || target.tagName === "BUTTON" || target.getAttribute("role") === "button") {
          setMode("button");
        } else {
          setMode("default");
        }
      } else {
        setMode("default");
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    const renderLoop = () => {
      // Smooth lerp easing for ring & aura
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, [isVisible]);

  if (!isDesktop) return null;

  const ringSize = mode === "view" ? 88 : mode === "image" ? 70 : mode === "button" ? 54 : 36;
  const currentSize = isMouseDown ? ringSize * 0.8 : ringSize;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[999999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Bluish Ambient Aura Glow */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--electric) 45%, transparent) 0%, color-mix(in oklab, var(--violet) 30%, transparent) 55%, transparent 80%)",
        }}
      />

      {/* Trailing Bluish Glowing Outer Ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 grid place-items-center rounded-full text-xs font-bold tracking-widest text-white backdrop-blur-[2px] transition-[width,height,background-color,border-color,box-shadow] duration-300 ease-out"
        style={{
          width: currentSize,
          height: currentSize,
          marginLeft: -currentSize / 2,
          marginTop: -currentSize / 2,
          backgroundColor:
            mode === "default"
              ? "rgba(0, 180, 255, 0.08)"
              : "rgba(0, 195, 255, 0.25)",
          borderColor:
            mode === "default"
              ? "rgba(0, 210, 255, 0.55)"
              : "rgba(0, 240, 255, 0.95)",
          borderWidth: "1.5px",
          borderStyle: "solid",
          boxShadow:
            mode === "default"
              ? "0 0 20px rgba(0, 200, 255, 0.3), inset 0 0 12px rgba(0, 200, 255, 0.15)"
              : "0 0 35px rgba(0, 230, 255, 0.65), inset 0 0 20px rgba(0, 230, 255, 0.35)",
        }}
      >
        {mode === "view" && (
          <span className="drop-shadow-[0_2px_8px_rgba(0,220,255,0.9)] font-display text-[11px] font-bold text-white">
            VIEW ↗
          </span>
        )}
      </div>

      {/* Center Electric Blue Neon Dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200"
        style={{
          marginLeft: -1.5,
          marginTop: -1.5,
          background: "radial-gradient(circle, #ffffff 0%, #00e1ff 55%, #0055ff 100%)",
          boxShadow: "0 0 14px #00f0ff, 0 0 28px rgba(0, 180, 255, 0.85)",
          opacity: mode === "default" ? 1 : 0.4,
          transform: isMouseDown ? "scale(1.4)" : "scale(1)",
        }}
      />
    </div>
  );
}
