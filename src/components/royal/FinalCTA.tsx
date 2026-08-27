import { usePointer, useReveal } from "@/hooks/use-reveal";
import { MagneticButton } from "./MagneticButton";

export function FinalCTA() {
  const ref = useReveal<HTMLDivElement>();
  const p = usePointer();

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
        <div
          className="relative h-[34rem] w-[34rem] rounded-full opacity-70 sm:h-[42rem] sm:w-[42rem]"
          style={{
            transform: `translate3d(${p.x * -18}px, ${p.y * -14}px, 0)`,
            transition: "transform 600ms var(--ease-royal)",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklab,var(--electric)_18%,transparent),transparent_62%)] blur-xl" />
          <div
            className="absolute inset-6 rounded-full border border-electric/20"
            style={{ animation: "royal-spin 42s linear infinite" }}
          />
          <div className="absolute inset-16 rounded-full border border-violet/15" />
          <div className="absolute inset-28 rounded-full border border-border" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="float-slow absolute h-1.5 w-1.5 rounded-full bg-electric/50"
              style={{
                left: `${18 + i * 13}%`,
                top: `${28 + (i % 3) * 20}%`,
                animationDelay: `${i * 700}ms`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="shell text-center">
        <h2
          data-reveal
          className="reveal text-[clamp(2rem,5.4vw,4.4rem)] font-medium leading-[1.04] tracking-[0.01em]"
        >
          YOUR NEXT CUSTOMER IS ALREADY ONLINE.
          <br />
          <span className="grad-text">LET'S MAKE SURE THEY FIND YOU.</span>
        </h2>
        <p
          data-reveal
          className="reveal mx-auto mt-7 max-w-xl text-base text-muted-foreground sm:text-lg"
          style={{ ["--reveal-delay" as string]: "140ms" }}
        >
          Tell us where your business is today. We'll help you identify where it can go next.
        </p>
        {/* Contact Info Cards */}
        <div
          data-reveal
          className="reveal mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3 text-left"
          style={{ ["--reveal-delay" as string]: "180ms" }}
        >
          <a
            href="mailto:royal300ad@gmail.com"
            className="flex flex-col gap-1 rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur transition-all hover:border-electric/60 hover:scale-[1.02]"
          >
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Email</span>
            <span className="text-xs font-bold text-foreground truncate">royal300ad@gmail.com</span>
          </a>

          <a
            href="https://wa.me/918617201731"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur transition-all hover:border-electric/60 hover:scale-[1.02]"
          >
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Mobile / WhatsApp</span>
            <span className="text-xs font-bold text-foreground">8617201731</span>
          </a>

          <a
            href="https://royal300.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur transition-all hover:border-electric/60 hover:scale-[1.02]"
          >
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Website</span>
            <span className="text-xs font-bold text-foreground">royal300.com</span>
          </a>
        </div>

        <div
          data-reveal
          className="reveal mt-10 flex flex-wrap justify-center gap-4"
          style={{ ["--reveal-delay" as string]: "240ms" }}
        >
          <MagneticButton
            hoverLabel="Chat on WhatsApp ↗"
            href="https://wa.me/918617201731"
          >
            Chat on WhatsApp →
          </MagneticButton>
          <MagneticButton variant="ghost" href="#work">
            View Our Work
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
