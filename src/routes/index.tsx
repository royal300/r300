import { createFileRoute } from "@tanstack/react-router";

import { AmbientBackground } from "@/components/royal/AmbientBackground";
import { CustomCursor } from "@/components/royal/CustomCursor";
import { Navbar } from "@/components/royal/Navbar";
import { Hero } from "@/components/royal/Hero";

import { Projects } from "@/components/royal/Projects";
import { Results } from "@/components/royal/Results";
import { Clients } from "@/components/royal/Clients";
import { WhyRoyal300 } from "@/components/royal/WhyRoyal300";
import { Pricing } from "@/components/royal/Pricing";
import { FinalCTA } from "@/components/royal/FinalCTA";
import { Footer } from "@/components/royal/Footer";

const title = "ROYAL300 — Digital Marketing Agency for Business Growth";
const description =
  "ROYAL300 builds digital identities, performance campaigns and conversion-focused websites that turn online attention into measurable business growth.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <AmbientBackground />
      <CustomCursor />
      <Navbar />
      <Hero />

      <Projects />
      <Clients />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
