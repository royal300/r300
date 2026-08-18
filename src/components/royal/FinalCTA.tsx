import { usePointer, useReveal } from "@/hooks/use-reveal";
import { MagneticButton } from "./MagneticButton";

export function FinalCTA() {
  const ref = useReveal<HTMLDivElement>();
  const p = usePointer();

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden py-28 lg:py-40">
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
          className="reveal text-[clamp(2rem,5.4vw,4.4rem)] font-bold leading-[0.98]"
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
        <div
          data-reveal
          className="reveal mt-10 flex flex-wrap justify-center gap-3"
          style={{ ["--reveal-delay" as string]: "240ms" }}
        >
          <MagneticButton hoverLabel="Start a Conversation ↗" href="#contact">
            Start a Conversation →
          </MagneticButton>
          <MagneticButton variant="ghost" href="#work">
            View Our Work
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
