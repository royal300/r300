import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import { useEffect, useRef } from "react";

const clientLogos = [
  "/client_logos/1.png",
  "/client_logos/2.png",
  "/client_logos/3.png",
  "/client_logos/4.png",
  "/client_logos/5.png",
  "/client_logos/6.png",
  "/client_logos/7.png",
  "/client_logos/8.png",
  "/client_logos/9.png",
  "/client_logos/10.png",
  "/client_logos/11.png",
  "/client_logos/12.png",
  "/client_logos/13.png",
];

/* ─── Mobile: 5 column grid ──────────────────────────────────────────────────────── */
function MobileGrid() {
  return (
    <div className="mt-14 grid grid-cols-5 gap-2">
      {clientLogos.map((logoPath, i) => (
        <div
          key={i}
          className="reveal flex items-center justify-center bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-2"
        >
          <img
            src={logoPath}
            alt={`Client Partner ${i + 1}`}
            className="max-h-16 w-auto max-w-[80%] object-contain opacity-90"
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Desktop: grid ──────────────────────────────────────────────────────── */
function DesktopGrid() {
  return (
    <div className="mt-14 hidden md:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 overflow-hidden">
      {clientLogos.map((logoPath, i) => (
        <div
          key={i}
          data-reveal
          className="reveal group flex items-center justify-center bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-6 min-h-[160px] transition-all duration-500 hover:bg-white/15 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
          style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}
        >
          <img
            src={logoPath}
            alt={`Client Partner ${i + 1}`}
            className="max-h-28 sm:max-h-32 w-auto max-w-[90%] object-contain opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-2.5 group-hover:rotate-[-3deg] group-hover:scale-110 drop-shadow-xl"
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export function Clients() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="clients" ref={ref} className="relative py-16 lg:py-22">
      <div className="shell">
        <SectionHeading
          eyebrow="CLIENTS"
          title="TRUSTED TO BUILD"
          highlight="DIGITAL PRESENCE."
          copy="We work with businesses across retail, hospitality, lifestyle, real estate, automotive and local commerce — helping them compete more effectively in an increasingly digital marketplace."
        />

        {/* Mobile: 5 column grid */}
        <MobileGrid />

        {/* Desktop grid */}
        <DesktopGrid />
      </div>
    </section>
  );
}
