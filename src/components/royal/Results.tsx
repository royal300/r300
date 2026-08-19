import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const results = [
  { value: 50, suffix: "+", label: "Businesses & Projects" },
  { value: 1, suffix: "M+", label: "Digital Impressions" },
  { value: 300, suffix: "+", label: "Creative Assets Delivered" },
  { value: 3, suffix: "×", label: "Average Campaign Growth Potential" },
  { value: 95, suffix: "%", label: "Client Satisfaction" },
];

function Counter({ value, suffix, label }: (typeof results)[number]) {
  const { ref, display } = useCountUp(value, 2000);
  return (
    <div
      data-reveal
      className="reveal border-t border-border pt-6 transition-colors duration-500 hover:border-electric/50"
    >
      <p className="font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-none tracking-[-0.05em]">
        <span ref={ref}>{Math.round(display)}</span>
        <span className="grad-text">{suffix}</span>
      </p>
      <p className="mt-4 max-w-[14rem] text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function Results() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="relative overflow-hidden py-16 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="float-slow absolute left-1/3 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--electric)_12%,transparent),transparent_65%)] blur-2xl" />
        <div className="float-slow absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--violet)_12%,transparent),transparent_65%)] blur-2xl" />
      </div>

      <div className="shell">
        <SectionHeading eyebrow="RESULTS" title="THE NUMBERS BEHIND" highlight="THE WORK." />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <Counter key={r.label} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
