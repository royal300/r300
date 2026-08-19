import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";

const tiers = [
  {
    name: "STARTER",
    line: "Build Your Presence",
    for: "For businesses establishing their digital foundation.",
    items: [
      "Social media strategy",
      "Creative content",
      "Basic campaign management",
      "Monthly performance report",
      "Brand consultation",
    ],
    cta: "Start Strong →",
    ctaHover: "Start Strong ↗",
    featured: false,
  },
  {
    name: "GROWTH",
    line: "Accelerate Your Business",
    for: "For businesses ready to generate consistent attention and leads.",
    items: [
      "Complete social media management",
      "Paid advertising",
      "Campaign strategy",
      "Premium creatives",
      "Website optimization",
      "Monthly analytics",
      "Growth consultation",
    ],
    cta: "Accelerate Growth →",
    ctaHover: "Accelerate Growth ↗",
    featured: true,
  },
  {
    name: "SCALE",
    line: "Build a Growth Engine",
    for: "For businesses looking for an integrated digital growth partner.",
    items: [
      "Full digital marketing",
      "Performance campaigns",
      "Advanced analytics",
      "Website & landing pages",
      "AI automation",
      "Conversion optimization",
      "Strategic consulting",
    ],
    cta: "Let's Build →",
    ctaHover: "Let's Build ↗",
    featured: false,
  },
];

export function Pricing() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="pricing" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="PRICING"
          title="CHOOSE THE LEVEL OF"
          highlight="GROWTH YOU NEED."
          copy="Flexible solutions designed around your current stage, marketing goals and growth ambitions."
          align="center"
          className="mx-auto text-center"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              data-reveal
              className={`reveal relative flex flex-col rounded-[1.9rem] p-8 transition-[transform,box-shadow] duration-700 [transition-timing-function:var(--ease-royal)] hover:-translate-y-2 ${
                t.featured
                  ? "glass border-electric/35 shadow-[0_50px_90px_-60px_color-mix(in_oklab,var(--electric)_80%,transparent)] lg:-mt-4 lg:mb-4"
                  : "border border-border bg-card"
              }`}
              style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-[linear-gradient(100deg,var(--primary),var(--electric))] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary-foreground">
                  MOST POPULAR
                </span>
              )}
              <p className="font-display text-xs font-bold tracking-[0.26em] text-muted-foreground">
                {t.name}
              </p>
              <h3 className="mt-5 text-2xl font-bold leading-tight">{t.line}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t.for}</p>

              <div className="my-7 hairline" />

              <p className="font-display text-3xl font-medium tracking-[0.01em]">Custom Proposal</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Scoped to your goals — Discuss Your Goals →
              </p>

              <ul className="mt-7 flex-1 space-y-3">
                {t.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                    <span className="text-muted-foreground">{it}</span>
                  </li>
                ))}
              </ul>

              <MagneticButton
                hoverLabel={t.ctaHover}
                variant={t.featured ? "primary" : "ghost"}
                className="mt-9 w-full"
                href="#contact"
              >
                {t.cta}
              </MagneticButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
