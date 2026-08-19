const columns = [
  {
    title: "Explore",
    links: [
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "Clients", href: "#clients" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Digital Marketing", href: "#services" },
      { label: "Branding", href: "#services" },
      { label: "Web Development", href: "#services" },
      { label: "Social Media", href: "#services" },
      { label: "AI & Automation", href: "#services" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "#contact" },
      { label: "LinkedIn", href: "#contact" },
      { label: "WhatsApp", href: "#contact" },
      { label: "Email", href: "#contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-12 lg:py-14">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-display text-[clamp(2.4rem,7vw,4.5rem)] font-bold leading-none tracking-[-0.06em]">
              ROYAL<span className="grad-text">300</span>
            </p>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              Digital experiences. Creative growth. Business impact.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground">
                  {c.title.toUpperCase()}
                </p>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        data-cursor="button"
                        className="text-sm text-foreground/80 transition-colors duration-300 hover:text-electric"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ROYAL300. All rights reserved.</p>
          <p>Built for businesses that want to grow.</p>
        </div>
      </div>
    </footer>
  );
}
