import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";
import { useProjects } from "@/hooks/use-projects";

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

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-hidden">
          {clientLogos.map((logoPath, i) => (
            <div
              key={i}
              data-reveal
              className="reveal group flex items-center justify-center bg-[#0e131f]/80 border border-white/10 rounded-2xl p-6 min-h-[140px] transition-all duration-500 hover:bg-white/10 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10"
              style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}
            >
              <img
                src={logoPath}
                alt={`Client Partner ${i + 1}`}
                className="max-h-24 w-auto max-w-[85%] object-contain opacity-85 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 drop-shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

