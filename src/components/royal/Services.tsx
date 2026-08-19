import { Bot, Gem, LineChart, MonitorSmartphone, Share2, Target } from "lucide-react";

import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const services = [
  {
    no: "01",
    icon: Gem,
    title: "Brand & Creative",
    line: "Build a brand people remember.",
    copy: "Brand identity, creative direction, social media design, campaign creatives and visual systems designed to make businesses look credible and memorable.",
  },
  {
    no: "02",
    icon: Target,
    title: "Digital Marketing",
    line: "Reach the people who matter.",
    copy: "Strategic social media marketing, paid advertising and campaign management focused on awareness, engagement, leads and conversions.",
  },
  {
    no: "03",
    icon: MonitorSmartphone,
    title: "Website & Digital Experience",
    line: "Turn visitors into customers.",
    copy: "High-performance websites and landing pages designed around user experience, trust and conversion.",
  },
  {
    no: "04",
    icon: LineChart,
    title: "Growth Strategy",
    line: "Turn marketing into a measurable system.",
    copy: "Data-driven strategy, audience research, campaign optimization and performance insights that help businesses make smarter marketing decisions.",
  },
  {
    no: "05",
    icon: Share2,
    title: "Social Media Management",
    line: "Stay relevant. Stay visible. Stay remembered.",
    copy: "Content strategy, creative production, publishing and audience engagement that maintain a consistent digital presence.",
  },
  {
    no: "06",
    icon: Bot,
    title: "AI & Automation",
    line: "Work smarter. Scale faster.",
    copy: "AI-powered workflows, automation, intelligent customer experiences and data-driven systems that reduce repetitive work and unlock new opportunities.",
  },
];

export function Services() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="services" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="SERVICES"
          title="WE TURN DIGITAL PRESENCE INTO"
          highlight="BUSINESS VALUE."
          copy="From brand positioning to performance campaigns, we combine creativity, technology and data to create digital systems that help businesses get noticed, trusted and chosen."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.no}
              data-reveal
              data-cursor="button"
              className="reveal group glass relative overflow-hidden rounded-[1.75rem] p-7 transition-[transform,box-shadow] duration-700 [transition-timing-function:var(--ease-royal)] hover:-translate-y-2 hover:shadow-[0_40px_80px_-50px_color-mix(in_oklab,var(--electric)_60%,transparent)]"
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 80% at 80% 0%, color-mix(in oklab, var(--electric) 12%, transparent), transparent 70%)",
                }}
              />
              <div className="flex items-start justify-between">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-electric/25 bg-[linear-gradient(140deg,color-mix(in_oklab,var(--electric)_16%,transparent),transparent)] text-electric transition-transform duration-700 [transition-timing-function:var(--ease-royal)] group-hover:-translate-y-1 group-hover:rotate-[6deg]"
                  aria-hidden
                >
                  <s.icon size={22} strokeWidth={1.6} />
                </span>
                <span className="text-lg text-muted-foreground transition-transform duration-500 [transition-timing-function:var(--ease-royal)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground">
                  ↗
                </span>
              </div>
              <span className="mt-6 block font-display text-xs font-bold tracking-[0.24em] text-muted-foreground">
                {s.no}
              </span>
              <h3 className="mt-2 text-2xl font-bold leading-tight">{s.title}</h3>
              <p className="mt-3 font-display text-sm font-medium text-electric">{s.line}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
