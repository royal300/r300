import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import { ProjectData } from "@/data/projectsData";
import { useProjects } from "@/hooks/use-projects";

/* Mobile Sticky Stacking Parallax Card */
function ParallaxMobileCard({ p, index }: { p: ProjectData; index: number }) {
  const stickyTop = 80 + index * 16;

  return (
    <div
      className="sticky mb-6 last:mb-0 transition-all duration-500"
      style={{ top: `${stickyTop}px` }}
    >
      <Link
        to="/projects/$slug"
        params={{ slug: p.slug }}
        className="block text-left no-underline group"
      >
        <article className="relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-card/95 p-4 sm:p-5 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-electric/50 flex flex-col gap-3.5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 shadow-md">
            <img
              src={p.heroImage}
              alt={p.name}
              loading="lazy"
              width={600}
              height={450}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-electric/20 px-2.5 py-0.5 font-display text-[10px] font-bold text-electric backdrop-blur-md border border-electric/30">
              PROJECT {p.no}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="font-display text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-electric transition-colors line-clamp-2">
              {p.name}
            </h3>

            <div className="relative overflow-hidden inline-flex items-center justify-between rounded-full bg-[linear-gradient(100deg,var(--primary),var(--electric)_55%,var(--violet))] px-4 py-2.5 text-xs font-bold text-white shadow-md">
              <span>View Project</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

/* PC Desktop Parallax Stacking Card */
function ParallaxDesktopCard({ p, index }: { p: ProjectData; index: number }) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on mouse move
  const onMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(0)`;
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  // Calculate sticky offset for stacking cards effect
  const stickyTop = 90 + index * 24;

  return (
    <div
      className="sticky mb-10 last:mb-0 transition-all duration-500 will-change-transform"
      style={{ top: `${stickyTop}px` }}
    >
      <Link
        to="/projects/$slug"
        params={{ slug: p.slug }}
        className="block text-left no-underline group"
      >
        <article
          ref={cardRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-card/95 p-7 lg:p-9 backdrop-blur-2xl shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-electric/50 hover:shadow-[0_40px_80px_-20px_rgba(43,89,255,0.25)] grid grid-cols-12 gap-8 items-center"
        >
          {/* Subtle glowing corner */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-40" />

          {/* Left Column: Info & Details */}
          <div className="col-span-7 flex flex-col justify-between h-full py-1">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-electric/15 px-3.5 py-1 font-display text-xs font-bold text-electric border border-electric/30 backdrop-blur-md">
                  PROJECT {p.no}
                </span>
                <span className="font-display text-xs uppercase tracking-wider text-muted-foreground">
                  {p.category}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl lg:text-3xl font-bold tracking-tight text-foreground group-hover:text-electric transition-colors">
                {p.name}
              </h3>

              <p className="mt-3 text-sm lg:text-base text-muted-foreground leading-relaxed">
                {p.copy}
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <div className="relative overflow-hidden inline-flex items-center gap-3 rounded-full bg-[linear-gradient(100deg,var(--primary),var(--electric)_55%,var(--violet))] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                <span>View Full Case Study</span>
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Image */}
          <div className="col-span-5 relative overflow-hidden rounded-2xl border border-border/60 aspect-[4/3] shadow-xl">
            <img
              src={p.heroImage}
              alt={p.name}
              loading="lazy"
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </article>
      </Link>
    </div>
  );
}

export function Projects() {
  const ref = useReveal<HTMLDivElement>();
  const { projects } = useProjects();

  return (
    <section id="work" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="OUR WORK"
          title="SOME OF OUR"
          highlight="BEST PROJECTS."
          copy="A curated selection of projects where strategy, creativity and execution came together to deliver real, measurable results for our clients."
        />

        {/* Desktop PC View: Parallax Stacking Cards */}
        <div className="mt-12 hidden lg:block relative pb-20">
          {projects.map((p, i) => (
            <ParallaxDesktopCard key={p.slug || p.no} p={p} index={i} />
          ))}
        </div>

        {/* Mobile View: Parallax Stacking Cards */}
        <div className="mt-10 lg:hidden relative pb-12">
          {projects.map((p, i) => (
            <ParallaxMobileCard key={p.slug || p.no} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
