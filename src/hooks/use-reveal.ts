import * as React from "react";

/** Adds the `revealed` class when the element scrolls into view (once). */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = [el, ...Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"))];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return ref;
}

/** Counts up to `value` once the element is in view. */
export function useCountUp(value: number, duration = 1800) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return { ref, display };
}

/** Normalized pointer position (-1..1) for mouse-reactive depth. */
export function usePointer() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setPos({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        }),
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return pos;
}
