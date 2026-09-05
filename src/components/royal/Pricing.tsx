import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";

/* ── Digital Marketing tiers ─────────────────────────────────────────────── */
const dmTiers = [
  {
    name: "STARTER",
    line: "Build Your Presence",
    for: "For businesses establishing their digital foundation.",
    items: [
      "Social media strategy",
      "Creative content design",
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
      "Paid advertising (Meta / Google)",
      "Campaign strategy & creatives",
      "Premium visual content",
      "Website optimisation",
      "Monthly analytics report",
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
      "Full digital marketing suite",
      "Performance campaigns (ROI-focused)",
      "Advanced analytics & reporting",
      "Website & landing pages",
      "AI & WhatsApp automation",
      "Conversion optimisation",
      "Strategic consulting",
    ],
    cta: "Let's Build →",
    ctaHover: "Let's Build ↗",
    featured: false,
  },
];

/* ── Web Development tiers ───────────────────────────────────────────────── */
const webTiers = [
  {
    name: "ESSENTIAL",
    line: "Your Business Online",
    for: "For startups and small businesses needing a solid web presence.",
    items: [
      "Up to 5-page website",
      "Mobile-responsive design",
      "Contact form & Google Maps",
      "Basic SEO setup",
      "1-month post-launch support",
    ],
    cta: "Get Online →",
    ctaHover: "Get Online ↗",
    featured: false,
  },
  {
    name: "PROFESSIONAL",
    line: "A Site That Converts",
    for: "For growing businesses that need more features and performance.",
    items: [
      "Up to 15-page custom website",
      "Custom UI/UX design",
      "CMS integration",
      "Advanced SEO & speed optimisation",
      "WhatsApp / chat integration",
      "Google Analytics setup",
      "3-month post-launch support",
    ],
    cta: "Build My Site →",
    ctaHover: "Build My Site ↗",
    featured: true,
  },
  {
    name: "ENTERPRISE",
    line: "Full-Scale Web Platform",
    for: "For businesses needing a powerful, custom-built digital platform.",
    items: [
      "Unlimited pages & custom features",
      "E-commerce / booking systems",
      "API & third-party integrations",
      "Server setup & managed hosting",
      "Performance & security audits",
      "Priority support & maintenance",
      "Dedicated project manager",
    ],
    cta: "Let's Build →",
    ctaHover: "Let's Build ↗",
    featured: false,
  },
];

/* ── Toggle ──────────────────────────────────────────────────────────────── */
type Category = "dm" | "web";

function Toggle({
  value,
  onChange,
}: {
  value: Category;
  onChange: (v: Category) => void;
}) {
  return (
    <div
      className="relative mx-auto mt-10 flex w-fit rounded-full border border-transparent bg-white/20 p-1"
      role="tablist"
    >
      {/* sliding pill */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-full bg-[linear-gradient(100deg,var(--primary),var(--electric))] transition-all duration-400 ease-in-out"
        style={{
          width: "calc(50% - 4px)",
          left: value === "dm" ? "4px" : "calc(50%)",
        }}
      />
      <button
        role="tab"
        aria-selected={value === "dm"}
        onClick={() => onChange("dm")}
        className="relative z-10 min-w-[160px] rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300"
        style={{ color: value === "dm" ? "#fff" : "#1e293b" }}
      >
        Digital Marketing
      </button>
      <button
        role="tab"
        aria-selected={value === "web"}
        onClick={() => onChange("web")}
        className="relative z-10 min-w-[160px] rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300"
        style={{ color: value === "web" ? "#fff" : "#1e293b" }}
      >
        Web Development
      </button>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export function Pricing() {
  const ref = useReveal<HTMLDivElement>();
  const [category, setCategory] = useState<Category>("dm");

  const tiers = category === "dm" ? dmTiers : webTiers;

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

        {/* Toggle */}
        <Toggle value={category} onChange={setCategory} />

        {/* Cards */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-[1.9rem] p-8 transition-[transform,box-shadow] duration-700 [transition-timing-function:var(--ease-royal)] hover:-translate-y-2 ${
                t.featured
                  ? "glass border-electric/35 shadow-[0_50px_90px_-60px_color-mix(in_oklab,var(--electric)_80%,transparent)] lg:-mt-4 lg:mb-4"
                  : "border border-border bg-card"
              }`}
              style={{
                animationDelay: `${i * 120}ms`,
                animation: "fadeUp 0.6s both",
              }}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-[linear-gradient(100deg,var(--primary),var(--electric))] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary-foreground">
                  MOST POPULAR
                </span>
              )}
              <p className="font-display text-xs font-bold tracking-[0.26em] text-muted-foreground">
                {t.name}
              </p>
              <h3 className="mt-5 text-2xl font-medium leading-tight">
                {t.line}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{t.for}</p>

              <div className="my-7 hairline" />

              <p className="font-display text-3xl font-medium tracking-[0.01em]">
                Custom Proposal
              </p>
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

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
