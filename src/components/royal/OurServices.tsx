import {
  Share2,
  Globe,
  SearchCheck,
  MessageCircle,
  Server,
  Camera,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const services = [
  {
    no: "01",
    icon: Share2,
    title: "Social Media Marketing",
    line: "Make your brand impossible to ignore.",
    copy: "Strategic content creation, community management and paid social campaigns that build audiences, drive engagement and convert attention into real business growth.",
    gradient: "from-pink-500/20 to-purple-500/10",
    accent: "#e879f9",
  },
  {
    no: "02",
    icon: Globe,
    title: "Web Development",
    line: "Websites that work harder for you.",
    copy: "Fast, conversion-focused websites and landing pages built for performance, trust and user experience — from simple business sites to fully custom platforms.",
    gradient: "from-blue-500/20 to-cyan-500/10",
    accent: "#38bdf8",
  },
  {
    no: "03",
    icon: SearchCheck,
    title: "SEO & GMB",
    line: "Get found. Stay on top.",
    copy: "On-page SEO, local search optimisation and Google My Business management that put your business in front of the right people at exactly the right moment.",
    gradient: "from-green-500/20 to-emerald-500/10",
    accent: "#34d399",
  },
  {
    no: "04",
    icon: MessageCircle,
    title: "WhatsApp Automation",
    line: "Sell and support — on autopilot.",
    copy: "Intelligent WhatsApp chatbots and automated workflows that handle inquiries, qualify leads and nurture customers 24/7 without lifting a finger.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    accent: "#25D366",
  },
  {
    no: "05",
    icon: Server,
    title: "Server & Hosting",
    line: "Rock-solid infrastructure. Zero headaches.",
    copy: "Managed VPS hosting, server configuration, SSL setup and ongoing maintenance — so your digital presence stays fast, secure and online around the clock.",
    gradient: "from-orange-500/20 to-amber-500/10",
    accent: "#fb923c",
  },
  {
    no: "06",
    icon: Camera,
    title: "Professional Shooting",
    line: "Visuals that make people stop scrolling.",
    copy: "Product photography, brand shoots and video content that capture your business's personality and give your marketing the visual quality it deserves.",
    gradient: "from-rose-500/20 to-pink-500/10",
    accent: "#fb7185",
  },
];

export function OurServices() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="our-services" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="WHAT WE DO"
          title="OUR"
          highlight="SERVICES."
          copy="From social media to server infrastructure — we cover every digital touchpoint your business needs to grow, compete and win online."
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.no}
              data-reveal
              data-cursor="button"
              className="reveal group relative overflow-hidden rounded-lg border border-transparent bg-[var(--accent)] p-4 transition-all duration-700 [transition-timing-function:var(--ease-royal)] hover:-translate-y-1 hover:border-accent hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)]"
              style={{
                background: `${s.accent}`,
                ["--reveal-delay" as string]: `${i * 60}ms`,
              }}
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-70 rounded-lg"
                style={{
                  background: `radial-gradient(100% 60% at 50% 0%, ${s.accent}20, transparent 60%)`,
                }}
              />

              <div className="flex items-center justify-between">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl border transition-transform duration-500 [transition-timing-function:var(--ease-royal)] group-hover:-translate-y-0.5 group-hover:rotate-[3deg]"
                  style={{
                    borderColor: `${s.accent}`,
                    background: `${s.accent}`,
                    color: `#fff`,
                  }}
                >
                  <s.icon size={18} strokeWidth={1.4} />
                </span>

                <span
                  className="hidden sm:block text-white transition-all duration-300"
                >
                  ↗
                </span>
              </div>

              <span className="mt-2 block font-display text-xs font-bold tracking-[0.2em] text-white">
                {s.no}
              </span>
              <h3 className="mt-1 text-lg font-semibold leading-none text-white">
                {s.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
