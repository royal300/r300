import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

/* ── Web Development tiers ───────────────────────────────────────────────── */
const webTiers = [
  {
    num: "01",
    name: "Basic",
    line: "Simple Website with Good UI",
    price: "₹ 29,999",
    period: "",
    items: [
      "Custom Domain",
      "Free Domain For 1 Year",
      "Free SSL Certificate",
      "Unlimited Bandwidth",
      "10 GB Storage Space",
      "24/7 Customer Care",
    ],
    featured: false,
  },
  {
    num: "02",
    name: "Standard",
    line: "Creative Design, Dynamic Website",
    price: "₹ 69,999",
    period: "",
    items: [
      "Basic E-Commerce Website",
      "Custom Domain For 1 Year",
      "Free Hosting For 1 Year",
      "Unlimited Bandwidth",
      "50 GB Storage Space",
      "250 Product Listing",
      "Secure Online Payments",
      "Customer Accounts",
      "Customized Reports",
      "24/7 Customer Care",
    ],
    featured: true,
  },
  {
    num: "03",
    name: "Premium",
    line: "Dynamic Ecommerce Website",
    price: "₹ 1,14,999",
    period: "",
    items: [
      "Advance E-Commerce Website",
      "Android App With Playstore Publish",
      "Secure Online Payments",
      "Customer Accounts",
      "Free Domain For 1 Year",
      "Unlimited Bandwidth",
      "Unlimited Storage Space",
      "Customized Reports",
      "Priority Customer Care",
      "Unlimited Product Listing",
      "Multiple Currencies",
      "Sell On Social Channels",
      "Product Review",
      "24/7 Customer Care",
      "Extra Charges For Additional Requirements",
    ],
    featured: false,
  },
];

/* ── Social Media Marketing tiers ─────────────────────────────────────────── */
const smmTiers = [
  {
    num: "01",
    name: "Basic",
    line: "Essential Social Media Management",
    price: "₹ 14,499",
    period: "/ Month",
    items: [
      "Facebook & Instagram Management",
      "4-5 Post / Week",
      "3-4 Short Video / Week",
      "2 Long Video / Month",
      "Social Media Engagement",
      "Relevant Hashtag",
      "Paid Ad Additional",
    ],
    featured: false,
  },
  {
    num: "02",
    name: "Standard",
    line: "Growth Social Media & Video Strategy",
    price: "₹ 19,499",
    period: "/ Month",
    items: [
      "Facebook, Instagram, Youtube Management",
      "5-8 Post / Week",
      "4-6 Short Video / Week",
      "3 (5 To 10 Minutes) Long Video / Month",
      "Social Media Engagement",
      "Relevant Hashtag",
      "Social Site Optimization",
      "Free Creative",
      "Paid Ad Additional",
    ],
    featured: true,
  },
  {
    num: "03",
    name: "Premium",
    line: "Full Scale Multi-Channel Dominance",
    price: "₹ 25,499",
    period: "/ Month",
    items: [
      "Facebook, Instagram, Youtube Management",
      "50 Post / Week",
      "70 Short Video / Week",
      "6 Long Video / Month",
      "Social Media Engagement",
      "Relevant Hashtag",
      "Social Site Optimization",
      "Youtube Content Writing",
      "Follow Campaign Build",
      "Free Creative",
      "Paid Ad Additional",
    ],
    featured: false,
  },
];

type Category = "web" | "smm";

function Toggle({ value, onChange }: { value: Category; onChange: (v: Category) => void }) {
  return (
    <div
      className="relative mx-auto mt-10 flex w-fit items-center rounded-full border border-purple-300/40 bg-white p-1.5 shadow-xl"
      role="tablist"
    >
      <button
        role="tab"
        aria-selected={value === "web"}
        onClick={() => onChange("web")}
        className={`relative z-10 rounded-full px-6 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 ${
          value === "web"
            ? "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
            : "text-black hover:text-purple-900 bg-transparent"
        }`}
      >
        Web Development
      </button>
      <button
        role="tab"
        aria-selected={value === "smm"}
        onClick={() => onChange("smm")}
        className={`relative z-10 rounded-full px-6 py-2.5 text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 ${
          value === "smm"
            ? "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
            : "text-black hover:text-purple-900 bg-transparent"
        }`}
      >
        Social Media Marketing
      </button>
    </div>
  );
}

export function Pricing() {
  const ref = useReveal<HTMLDivElement>();
  const [category, setCategory] = useState<Category>("web");

  const tiers = category === "web" ? webTiers : smmTiers;

  return (
    <section id="pricing" ref={ref} className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="PRICING"
          title={"CHOOSE THE LEVEL OF "}
          highlight="GROWTH YOU NEED."
          copy="Flexible, transparent pricing tailored to elevate your web presence and social reach."
          align="center"
          className="mx-auto text-center"
        />

        {/* Category Selector Toggle */}
        <Toggle value={category} onChange={setCategory} />

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                t.featured
                  ? "bg-[#0e091b]/95 border-2 border-purple-500/80 shadow-[0_0_60px_-15px_rgba(168,85,247,0.35)]"
                  : "bg-[#0a0714]/85 border border-purple-900/30 hover:border-purple-500/40"
              }`}
              style={{
                animationDelay: `${i * 120}ms`,
                animation: "fadeUp 0.6s both",
              }}
            >
              <div>
                {/* Header Row: Card Number + MOST POPULAR Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-purple-300/60">
                    {t.num}
                  </span>
                  {t.featured && (
                    <span className="rounded-sm bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-purple-500/30">
                      MOST POPULAR
                    </span>
                  )}
                </div>

                {/* Plan Title & Subtitle */}
                <h3 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white">
                  {t.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-purple-200/70 min-h-[40px]">
                  {t.line}
                </p>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {t.price}
                  </span>
                  {t.period && (
                    <span className="text-sm font-semibold text-purple-400">
                      {t.period}
                    </span>
                  )}
                </div>

                <div className="my-6 border-t border-purple-500/20" />

                {/* Features Header */}
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300/60">
                  INCLUDES
                </p>

                {/* Features List */}
                <ul className="mt-4 space-y-3">
                  {t.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                      <span className="font-bold text-purple-400 select-none">+</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-8 pt-4 border-t border-purple-500/20">
                <a
                  href="https://wa.me/918617201731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-between w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                    t.featured
                      ? "text-purple-300 hover:text-white"
                      : "text-gray-300 hover:text-purple-300"
                  }`}
                >
                  <span>START A CONVERSATION</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
