import * as React from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import happyValley from "@/assets/project-happy-valley.jpg";
import enfield from "@/assets/project-enfield.jpg";
import cafe from "@/assets/project-cafe.jpg";
import jewellers from "@/assets/project-jewellers.jpg";
import fashion from "@/assets/project-fashion.jpg";

const projects = [
  {
    no: "01",
    name: "HAPPY VALLEY PARK",
    category: "Digital Marketing • Social Media • Campaign Creative",
    copy: "Built a more engaging digital presence for a leisure destination through campaign-driven creative, promotional communication and audience-focused social content.",
    metrics: ["+58% Reach", "+41% Engagement", "2.4× Campaign Interaction"],
    image: happyValley,
    alt: "Water park with turquoise pools and slides",
  },
  {
    no: "02",
    name: "ROYAL ENFIELD",
    category: "Campaign Creative • Social Media",
    copy: "Created high-impact visual communication designed to strengthen product visibility, generate attention and connect the brand with its local audience.",
    metrics: ["+72% Content Reach", "+36% Engagement", "3.1× Creative Interaction"],
    image: enfield,
    alt: "Premium classic motorcycle in studio lighting",
  },
  {
    no: "03",
    name: "SPECTRUM CAFE",
    category: "Branding • Social Media • Promotional Marketing",
    copy: "Developed a visually consistent digital identity and promotional communication system designed to increase local visibility and drive customers toward the cafe.",
    metrics: ["+64% Reach", "+47% Engagement", "+29% Promotional Response"],
    image: cafe,
    alt: "Speciality coffee on a marble table in a bright cafe",
  },
  {
    no: "04",
    name: "A BANIK JEWELLERS",
    category: "Brand Identity • Digital Experience • Marketing",
    copy: "Created a premium digital presence designed to communicate craftsmanship, trust and product quality while strengthening the jewellery brand's online positioning.",
    metrics: ["+81% Visual Engagement", "+43% Audience Growth", "2.7× Campaign Interaction"],
    image: jewellers,
    alt: "Gold and diamond jewellery on white silk",
  },
  {
    no: "05",
    name: "FASHION / RETAIL BRAND",
    category: "Creative Marketing • Social Media",
    copy: "Designed campaign communication that transformed products into visually compelling stories and helped create a stronger digital connection with the target audience.",
    metrics: ["+54% Reach", "+38% Engagement", "2.2× Content Interaction"],
    image: fashion,
    alt: "Fashion editorial campaign photograph",
  },
];

function ProjectCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const ref = React.useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-10px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px)";
  };

  return (
    <article
      ref={ref}
      data-reveal
      data-cursor="view"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="reveal group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card transition-[transform,box-shadow] duration-700 [transition-timing-function:var(--ease-royal)] hover:shadow-[0_50px_90px_-60px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
      style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={p.image}
          alt={p.alt}
          loading="lazy"
          width={1024}
          height={1280}
          className="h-full w-full object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-royal)] group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--primary)_78%,transparent),transparent_58%)] opacity-70 transition-opacity duration-700 group-hover:opacity-95" />
        <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 font-display text-[10px] font-bold tracking-[0.2em] backdrop-blur">
          {p.no}
        </span>
        <div className="absolute inset-x-4 bottom-4">
          <div className="flex flex-wrap gap-1.5">
            {p.metrics.map((m, mi) => (
              <span
                key={m}
                className="translate-y-3 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-700 [transition-timing-function:var(--ease-royal)] group-hover:translate-y-0 group-hover:opacity-100"
                style={{ transitionDelay: `${mi * 90}ms` }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-tight tracking-[0.02em]">{p.name}</h3>
          <span className="text-base text-muted-foreground transition-transform duration-500 [transition-timing-function:var(--ease-royal)] group-hover:rotate-45 group-hover:text-electric">
            →
          </span>
        </div>
        <p className="mt-2 text-[11px] font-semibold tracking-wide text-electric">{p.category}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
        <p className="mt-5 font-display text-xl font-medium tracking-[0.01em]">{p.metrics[0]}</p>
      </div>
    </article>
  );
}

export function Projects() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="work" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="SELECTED WORK"
          title="WORK THAT MOVES"
          highlight="BUSINESS FORWARD."
          copy="Every project starts with a business challenge. Our job is to transform that challenge into a digital experience that attracts attention, builds trust and drives action."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p, i) => (
            <ProjectCard key={p.no} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
