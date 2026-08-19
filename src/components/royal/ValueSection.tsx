import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const before = [
  "Low visibility",
  "Inconsistent branding",
  "Weak digital presence",
  "Unqualified traffic",
  "Manual processes",
];

const after = [
  "Strong brand positioning",
  "Consistent digital identity",
  "Targeted audience reach",
  "Conversion-focused campaigns",
  "Data-driven decisions",
  "Automated workflows",
];

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <div>
      <p className="font-display text-3xl font-medium tracking-[0.01em] sm:text-4xl">
        <span ref={ref}>{Math.round(display)}</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function ValueSection() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="THE VALUE"
          title="YOUR BUSINESS DESERVES MORE THAN JUST"
          highlight="'LIKES'."
        />

        <div className="relative mt-16 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1.15fr]">
          <div
            data-reveal
            className="reveal rounded-[1.75rem] border border-border bg-secondary/50 p-8"
          >
            <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">
              BEFORE
            </p>
            <ul className="mt-7 space-y-4">
              {before.map((b) => (
                <li key={b} className="flex items-center gap-3 text-muted-foreground">
                  <span className="h-px w-6 bg-border" />
                  <span className="text-[15px] line-through decoration-border">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <svg width="72" height="220" viewBox="0 0 72 220" className="overflow-visible">
              <defs>
                <linearGradient id="connect" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--border)" />
                  <stop offset="100%" stopColor="var(--electric)" />
                </linearGradient>
              </defs>
              {[40, 110, 180].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y} C 36 ${y}, 36 110, 72 110`}
                  fill="none"
                  stroke="url(#connect)"
                  strokeWidth="1.5"
                />
              ))}
              <circle cx="70" cy="110" r="5" fill="var(--electric)" />
            </svg>
          </div>

          <div
            data-reveal
            className="reveal glass rounded-[1.75rem] p-8"
            style={{ ["--reveal-delay" as string]: "180ms" }}
          >
            <p className="text-[11px] font-semibold tracking-[0.28em] text-electric">
              WITH ROYAL300
            </p>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {after.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[linear-gradient(120deg,var(--electric),var(--violet))] text-[9px] text-primary-foreground">
                    ✓
                  </span>
                  <span className="text-[15px] font-medium">{a}</span>
                </li>
              ))}
            </ul>
            <div className="my-8 hairline" />
            <div className="grid grid-cols-3 gap-4">
              <Stat value={3} suffix="×" label="Visibility potential" />
              <Stat value={67} suffix="%" label="More qualified leads" />
              <Stat value={40} suffix="%" label="Less manual work" />
            </div>
          </div>
        </div>

        <p
          data-reveal
          className="reveal mx-auto mt-16 max-w-3xl text-center font-display text-xl leading-snug tracking-[0.02em] sm:text-2xl"
        >
          We measure success by the value we create for your business — not simply by how good a
          campaign looks.
        </p>
      </div>
    </section>
  );
}
