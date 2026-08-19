import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const points = [
  {
    title: "Business First",
    copy: "We begin with your business objectives, not random marketing trends.",
  },
  {
    title: "Creative That Converts",
    copy: "Every visual decision has a purpose — attention, trust or action.",
  },
  {
    title: "Data Meets Creativity",
    copy: "We combine performance data with creative thinking.",
  },
  {
    title: "Technology Driven",
    copy: "We use modern technology, AI and automation to improve efficiency.",
  },
  {
    title: "One Growth Partner",
    copy: "Strategy, creative, development and marketing under one roof.",
  },
  {
    title: "Built for Long-Term Growth",
    copy: "We focus on building sustainable digital assets instead of temporary campaigns.",
  },
];

export function WhyRoyal300() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading eyebrow="WHY US" title="WHY BUSINESSES CHOOSE" highlight="ROYAL300." />

        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <div
              key={p.title}
              data-reveal
              className="reveal group relative bg-background p-8 transition-colors duration-700 hover:bg-secondary/50"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <span className="font-display text-xs font-bold tracking-[0.24em] text-electric">
                0{i + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold leading-tight">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              <span className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--electric),var(--violet))] transition-transform duration-700 [transition-timing-function:var(--ease-royal)] group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
