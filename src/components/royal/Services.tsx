import { Camera, Globe, MessageSquare, SearchCheck, Server, Share2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

const services = [
  {
    no: "01",
    icon: Share2,
    title: "Social Media Marketing",
    line: "Reach the people who matter.",
    copy: "Strategic social media marketing, paid advertising and campaign management focused on awareness, engagement, leads and conversions.",
  },
  {
    no: "02",
    icon: Globe,
    title: "Web Development",
    line: "Turn visitors into customers.",
    copy: "High-performance websites and landing pages designed around user experience, trust and conversion.",
  },
  {
    no: "03",
    icon: SearchCheck,
    title: "SEO & GMB",
    line: "Dominate search results & local maps.",
    copy: "Search engine optimization and Google My Business profile management to drive organic high-intent traffic.",
  },
  {
    no: "04",
    icon: MessageSquare,
    title: "WhatsApp Automation",
    line: "Automate leads & customer chats.",
    copy: "AI-powered WhatsApp workflows, auto-responders, broadcast campaigns, and automated lead nurturing.",
  },
  {
    no: "05",
    icon: Server,
    title: "Server & Hosting",
    line: "Secure, lightning-fast infrastructure.",
    copy: "Reliable cloud server setup, SSL encryption, database management, and 99.9% uptime hosting support.",
  },
  {
    no: "06",
    icon: Camera,
    title: "Professional Shooting",
    line: "High-quality visual content production.",
    copy: "Professional video shoots, product photography, reel production, and brand ad filmmaking.",
  },
];

export function Services() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="services" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="WHAT WE DO"
          title="OUR "
          highlight="SERVICES."
          copy="From social media to server infrastructure — we cover every digital touchpoint your business needs to grow, compete and win online."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.no}
              data-reveal
              data-cursor="button"
              className="reveal group glass relative overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-20px_rgba(168,85,247,0.3)] border border-white/15 bg-card/80"
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            >
              <div className="flex items-start justify-between">
                {/* Circular warm purple-amber gradient icon badge as shown in screenshot */}
                <span
                  className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,#818cf8_0%,#c084fc_45%,#fbbf24_100%)] text-slate-950 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
                  aria-hidden
                >
                  <s.icon size={20} strokeWidth={1.75} className="text-slate-900" />
                </span>
                <span className="text-base text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-400">
                  ↗
                </span>
              </div>
              <span className="mt-5 block font-display text-xs font-extrabold tracking-[0.2em] text-muted-foreground">
                {s.no}
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold leading-tight text-foreground">{s.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
