import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

const links = [
  { label: "Portfolio", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-4 sm:pt-6">
      <nav
        className={cn(
          "shell glass flex items-center justify-between rounded-full transition-all duration-700 [transition-timing-function:var(--ease-royal)]",
          scrolled ? "px-5 py-2.5 backdrop-saturate-150 sm:px-6" : "px-5 py-4 sm:px-8",
        )}
        style={{
          background: scrolled
            ? "color-mix(in oklab, white 88%, transparent)"
            : "color-mix(in oklab, white 58%, transparent)",
        }}
      >
        <a
          href="#top"
          data-cursor="button"
          className="inline-flex items-center"
        >
          <img src="/logo.jpg" alt="ROYAL300 Logo" className="h-9 sm:h-10 w-auto rounded-xl object-contain shadow-sm" />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                data-cursor="button"
                className="relative text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <MagneticButton
            hoverLabel="Chat on WhatsApp ↗"
            className="hidden sm:inline-flex"
            href="https://wa.me/918617201731"
          >
            Chat on WhatsApp →
          </MagneticButton>
          <button
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/70 bg-card/70 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="shell glass mt-3 animate-fade-in rounded-3xl p-5 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-display text-lg tracking-[0.04em] transition-colors hover:bg-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-[linear-gradient(100deg,var(--primary),var(--electric))] px-6 py-3.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Let's Grow →
          </a>
        </div>
      )}
    </header>
  );
}
