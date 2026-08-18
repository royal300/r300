import { usePointer, useReveal } from "@/hooks/use-reveal";
import { MagneticButton } from "./MagneticButton";

const metrics = [
  { value: "+184%", label: "Reach", pos: "left-0 top-6", depth: 26, delay: "0ms" },
  { value: "3.2×", label: "Engagement", pos: "right-2 top-24", depth: 40, delay: "160ms" },
  { value: "+67%", label: "Leads", pos: "left-6 bottom-24", depth: 34, delay: "320ms" },
  {
    value: "42K+",
    label: "Campaign Impressions",
    pos: "right-6 bottom-4",
    depth: 18,
    delay: "480ms",
  },
];

export function Hero() {
  const ref = useReveal<HTMLDivElement>();
  const p = usePointer();

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-16 sm:pt-44 lg:pt-52 lg:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--electric)_18%,transparent),transparent_62%)] blur-2xl" />
        <div className="absolute -right-32 top-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--violet)_14%,transparent),transparent_65%)] blur-2xl" />
        <div
          className="absolute inset-x-0 bottom-0 h-72 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklab, var(--electric) 45%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--electric) 45%, transparent) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            transform: "perspective(700px) rotateX(62deg)",
            maskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
      </div>

      <div ref={ref} className="shell grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <p
            data-reveal
            className="reveal inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-muted-foreground backdrop-blur"
          >
            DIGITAL GROWTH STUDIO
          </p>

          <h1
            data-reveal
            className="reveal mt-7 text-[clamp(2.4rem,6.2vw,4.9rem)] font-bold leading-[0.95]"
            style={{ ["--reveal-delay" as string]: "80ms" }}
          >
            WE DON'T JUST MARKET BRANDS.
            <br />
            <span className="grad-text">WE BUILD THEIR GROWTH.</span>
          </h1>

          <p
            data-reveal
            className="reveal mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ ["--reveal-delay" as string]: "200ms" }}
          >
            ROYAL300 helps ambitious businesses build powerful digital identities, attract the right
            audience, generate meaningful leads, and turn online attention into measurable business
            growth.
          </p>

          <div
            data-reveal
            className="reveal mt-9 flex flex-wrap items-center gap-3"
            style={{ ["--reveal-delay" as string]: "300ms" }}
          >
            <MagneticButton hoverLabel="Start Growing ↗" href="#contact">
              Start Growing →
            </MagneticButton>
            <MagneticButton variant="ghost" href="#work">
              Explore Our Work
            </MagneticButton>
          </div>

          <p
            data-reveal
            className="reveal mt-10 text-xs font-semibold tracking-[0.3em] text-muted-foreground"
            style={{ ["--reveal-delay" as string]: "400ms" }}
          >
            STRATEGY • CREATIVITY • TECHNOLOGY • GROWTH
          </p>
        </div>

        <div
          data-reveal
          className="reveal relative mx-auto h-[26rem] w-full max-w-lg sm:h-[32rem] lg:h-[34rem]"
          style={{ ["--reveal-delay" as string]: "260ms", perspective: "1200px" }}
        >
          <div
            className="relative h-full w-full transition-transform duration-500 [transition-timing-function:var(--ease-royal)]"
            style={{
              transform: `rotateY(${p.x * -5}deg) rotateX(${p.y * 4}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="glass absolute left-1/2 top-1/2 h-64 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] sm:h-72 sm:w-80"
              style={{ transform: "translate(-50%,-50%) translateZ(0px)" }}
            >
              <div className="flex h-full flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[0.24em] text-muted-foreground">
                    GROWTH SYSTEM
                  </span>
                  <span className="h-2 w-2 rounded-full bg-electric" />
                </div>
                <svg viewBox="0 0 220 90" className="w-full">
                  <defs>
                    <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--electric)" />
                      <stop offset="100%" stopColor="var(--violet)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M4 82 C 46 76, 62 50, 92 46 S 150 40, 216 8"
                    fill="none"
                    stroke="url(#heroLine)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {[4, 92, 216].map((cx, i) => (
                    <circle key={cx} cx={cx} cy={[82, 46, 8][i]} r="4" fill="var(--electric)" />
                  ))}
                </svg>
                <div className="grid grid-cols-3 gap-2">
                  {["Reach", "Leads", "Revenue"].map((k) => (
                    <div key={k} className="rounded-xl bg-secondary/80 px-2 py-2 text-center">
                      <span className="text-[10px] font-semibold tracking-wide text-muted-foreground">
                        {k}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {metrics.map((m) => (
              <div
                key={m.label}
                className={`glass float-slow absolute ${m.pos} w-[9.5rem] rounded-2xl p-4`}
                style={{
                  animationDelay: m.delay,
                  transform: `translate3d(${p.x * -m.depth}px, ${p.y * -m.depth}px, ${m.depth}px)`,
                }}
              >
                <p className="font-display text-2xl font-bold tracking-tight">{m.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{m.label}</p>
              </div>
            ))}

            <div
              className="float-slow absolute left-4 top-1/2 h-16 w-16 rounded-2xl border border-electric/30 bg-[linear-gradient(140deg,color-mix(in_oklab,var(--electric)_22%,transparent),transparent)]"
              style={{ animation: "royal-spin 26s linear infinite" }}
            />
            <div className="float-slow absolute right-8 top-8 h-10 w-10 rotate-45 rounded-lg border border-violet/30 bg-violet/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
