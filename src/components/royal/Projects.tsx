import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import { projectsData, ProjectData } from "@/data/projectsData";

function ProjectCard({ p, i }: { p: ProjectData; i: number }) {
  const ref = React.useRef<HTMLDivElement>(null);

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
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      className="block text-left no-underline"
    >
      <article
        ref={ref}
        data-reveal
        data-cursor="view"
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="reveal group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card transition-[transform,box-shadow] duration-700 [transition-timing-function:var(--ease-royal)] hover:shadow-[0_50px_90px_-60px_color-mix(in_oklab,var(--primary)_70%,transparent)] hover:border-electric/50 cursor-pointer h-full flex flex-col justify-between"
        style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={p.heroImage}
            alt={p.name}
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
              {p.metrics.slice(0, 3).map((m, mi) => (
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

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-medium leading-tight tracking-[0.02em] group-hover:text-electric transition-colors">
                {p.name}
              </h3>
              <span className="text-base text-muted-foreground transition-transform duration-500 [transition-timing-function:var(--ease-royal)] group-hover:rotate-45 group-hover:text-electric">
                →
              </span>
            </div>
            <p className="mt-2 text-[11px] font-semibold tracking-wide text-electric">
              {p.category}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {p.copy}
            </p>
          </div>
          <p className="mt-5 font-display text-xl font-medium tracking-[0.01em]">
            {p.metrics[0]}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function Projects() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="work" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="OUR WORK"
          title="SOME OF OUR"
          highlight="BEST PROJECTS."
          copy="A curated selection of projects where strategy, creativity and execution came together to deliver real, measurable results for our clients."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projectsData.map((p, i) => (
            <ProjectCard key={p.no} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
