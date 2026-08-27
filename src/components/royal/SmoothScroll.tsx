import * as React from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    // Allow native 120Hz hardware-accelerated smooth scrolling on mobile touch screens
    if (isTouchDevice) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    document.documentElement.classList.add("lenis");

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      document.documentElement.classList.remove("lenis");
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

