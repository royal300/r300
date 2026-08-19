import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const clients = [
  "HAPPY VALLEY PARK",
  "ROYAL ENFIELD",
  "SPECTRUM CAFE",
  "A BANIK JEWELLERS",
  "NORTHSIDE RETAIL",
  "AURUM PROPERTIES",
  "VELA HOSPITALITY",
  "URBAN THREADS",
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

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((c, i) => (
            <div
              key={c}
              data-reveal
              className="reveal group grid min-h-28 place-items-center bg-background px-5 py-8 transition-colors duration-500 hover:bg-secondary/60"
              style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
            >
              <span className="text-center font-display text-[13px] font-bold tracking-[0.12em] text-muted-foreground/60 transition-colors duration-500 group-hover:text-foreground">
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
