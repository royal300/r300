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
      className="block text-left no-underline h-full"
    >
      <article
        ref={ref}
        data-reveal
        data-cursor="view"
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="reveal group relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] border border-border/70 bg-card transition-[transform,box-shadow] duration-700 [transition-timing-function:var(--ease-royal)] hover:shadow-[0_40px_80px_-40px_color-mix(in_oklab,var(--primary)_70%,transparent)] hover:border-electric/50 cursor-pointer h-full flex flex-col justify-between"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-95" />
        </div>

        <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between gap-3">
          <h3 className="font-display text-sm sm:text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-electric transition-colors line-clamp-2">
            {p.name}
          </h3>

          <div className="inline-flex items-center justify-between rounded-full bg-electric/15 border border-electric/30 px-3.5 py-2 text-xs font-bold text-electric transition-all duration-300 group-hover:bg-electric group-hover:text-white group-hover:shadow-md">
            <span>View Project</span>
            <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
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

        <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {projectsData.map((p, i) => (
            <ProjectCard key={p.no} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
