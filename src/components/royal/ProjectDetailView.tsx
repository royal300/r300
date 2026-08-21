import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Globe,
  Instagram,
  Facebook,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  X,
  Sparkles,
  Film,
  Image as ImageIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ProjectData, CreativeItem, ReelItem } from "@/data/projectsData";
import { AmbientBackground } from "./AmbientBackground";
import { CustomCursor } from "./CustomCursor";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface Props {
  project: ProjectData;
}

export function ProjectDetailView({ project }: Props) {
  const [activeTab, setActiveTab] = React.useState<"creatives" | "reels">("creatives");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  // Carousel active index
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  // Fullscreen modal state
  const [modalItem, setModalItem] = React.useState<{
    type: "creative" | "reel";
    item: CreativeItem | ReelItem;
  } | null>(null);

  // Sound state for video player modal
  const [isMuted, setIsMuted] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Filter items based on selected category
  const filteredCreatives = React.useMemo(() => {
    if (selectedCategory === "All") return project.creatives;
    return project.creatives.filter((c) => c.category === selectedCategory);
  }, [project.creatives, selectedCategory]);

  const filteredReels = React.useMemo(() => {
    if (selectedCategory === "All") return project.reels;
    return project.reels.filter((r) => r.category === selectedCategory);
  }, [project.reels, selectedCategory]);

  const currentListLength = activeTab === "creatives" ? filteredCreatives.length : filteredReels.length;

  // Reset carousel index when tab or category changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [activeTab, selectedCategory]);

  const handlePrev = () => {
    if (currentListLength === 0) return;
    setActiveIndex((prev) => (prev === 0 ? currentListLength - 1 : prev - 1));
  };

  const handleNext = () => {
    if (currentListLength === 0) return;
    setActiveIndex((prev) => (prev === currentListLength - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-electric/20">
      <AmbientBackground />
      <CustomCursor />
      <Navbar />

      <main className="relative pt-28 pb-20 lg:pt-36 lg:pb-32">
        <div className="shell">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-xs font-semibold tracking-wider text-muted-foreground backdrop-blur-md transition-all duration-300 hover:border-electric hover:text-foreground hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO ALL PROJECTS
          </Link>

          {/* Top Quick Links (Website, Instagram, Facebook) */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
                {project.name}
              </h1>
            </div>

            {/* Colorful Link Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {project.links.website && (
                <a
                  href={project.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 backdrop-blur transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Globe className="h-4 w-4 text-cyan-400 group-hover:text-white" />
                  Website
                </a>
              )}
              {project.links.instagram && (
                <a
                  href={project.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-semibold text-pink-300 backdrop-blur transition-all duration-300 hover:border-pink-400 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-amber-500 hover:text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                >
                  <Instagram className="h-4 w-4 text-pink-400 group-hover:text-white" />
                  Instagram
                </a>
              )}
              {project.links.facebook && (
                <a
                  href={project.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 backdrop-blur transition-all duration-300 hover:border-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  <Facebook className="h-4 w-4 text-blue-400 group-hover:text-white" />
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* Hero Overview */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-widest text-electric uppercase">
                {project.category}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {project.copy}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.fullDescription}
              </p>

              {/* Metrics Grid */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/60 bg-card/60 p-3.5 text-center backdrop-blur-md"
                  >
                    <p className="font-display text-lg font-bold text-foreground sm:text-xl">
                      {m}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Featured Hero Image */}
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl lg:col-span-5 aspect-[4/3] lg:aspect-[4/5]">
              <img
                src={project.heroImage}
                alt={project.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-electric backdrop-blur">
                  {project.client}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Section */}
          <section className="mt-16 sm:mt-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-electric uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  VISUAL SHOWCASE
                </div>
                <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                  CREATIVES & REELS GALLERY
                </h3>
              </div>

              {/* Tabs Switcher */}
              <div className="inline-flex rounded-full border border-border/80 bg-card/80 p-1 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("creatives")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
                    activeTab === "creatives"
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Creatives ({project.creatives.length})
                </button>
                <button
                  onClick={() => setActiveTab("reels")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
                    activeTab === "reels"
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Film className="h-3.5 w-3.5" />
                  Reels ({project.reels.length})
                </button>
              </div>
            </div>

            {/* Pill Filters Bar (Inspired by Reference Design) */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {project.categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? "border border-foreground bg-foreground text-background shadow-lg scale-105"
                        : "border border-border/80 bg-card/40 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* 3D Coverflow Carousel Gallery */}
            <div className="relative mt-10 overflow-hidden py-8">
              {currentListLength === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
                  No items found in this category.
                </div>
              ) : (
                <div className="relative flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
                  {/* Left & Right Nav Buttons */}
                  <button
                    onClick={handlePrev}
                    aria-label="Previous item"
                    className="absolute left-2 sm:left-6 z-30 rounded-full border border-border/80 bg-background/90 p-3 text-foreground backdrop-blur-md shadow-xl transition-transform hover:scale-110 hover:border-electric"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next item"
                    className="absolute right-2 sm:right-6 z-30 rounded-full border border-border/80 bg-background/90 p-3 text-foreground backdrop-blur-md shadow-xl transition-transform hover:scale-110 hover:border-electric"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* 3D Carousel Cards Container */}
                  <div className="relative flex w-full max-w-5xl items-center justify-center px-4 perspective-[1200px]">
                    {activeTab === "creatives"
                      ? filteredCreatives.map((item, idx) => {
                          // Offset relative to activeIndex
                          let offset = idx - activeIndex;
                          if (offset > Math.floor(currentListLength / 2)) {
                            offset -= currentListLength;
                          } else if (offset < -Math.floor(currentListLength / 2)) {
                            offset += currentListLength;
                          }

                          const isCenter = offset === 0;
                          const absOffset = Math.abs(offset);

                          if (absOffset > 2) return null; // hide far cards

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (isCenter) {
                                  setModalItem({ type: "creative", item });
                                } else {
                                  setActiveIndex(idx);
                                }
                              }}
                              className={`absolute cursor-pointer rounded-2xl border transition-all duration-700 ease-out select-none ${
                                isCenter
                                  ? "z-20 border-border/90 bg-card shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] scale-100 sm:scale-105"
                                  : "z-10 border-border/40 bg-card/60 opacity-60 backdrop-blur-sm shadow-xl"
                              }`}
                              style={{
                                transform: `translateX(${offset * (window.innerWidth < 640 ? 140 : 260)}px) scale(${
                                  1 - absOffset * 0.15
                                }) rotateY(${offset * -15}deg)`,
                                width: window.innerWidth < 640 ? "240px" : "340px",
                                height: window.innerWidth < 640 ? "340px" : "460px",
                              }}
                            >
                              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                                {/* Category Badge */}
                                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
                                  {item.category}
                                </span>

                                {/* Fullscreen Expand Button (bottom right like reference image) */}
                                {isCenter && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalItem({ type: "creative", item });
                                    }}
                                    className="absolute bottom-3 right-3 z-30 rounded-xl bg-black/70 p-2.5 text-white backdrop-blur transition-transform hover:scale-110"
                                    aria-label="Expand image"
                                  >
                                    <Maximize2 className="h-4 w-4" />
                                  </button>
                                )}

                                {/* Card Details */}
                                <div className="absolute bottom-3 left-3 right-12 text-left">
                                  <h4 className="font-display text-base font-bold text-white sm:text-lg">
                                    {item.title}
                                  </h4>
                                  <p className="line-clamp-2 text-xs text-white/80">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : filteredReels.map((item, idx) => {
                          let offset = idx - activeIndex;
                          if (offset > Math.floor(currentListLength / 2)) {
                            offset -= currentListLength;
                          } else if (offset < -Math.floor(currentListLength / 2)) {
                            offset += currentListLength;
                          }

                          const isCenter = offset === 0;
                          const absOffset = Math.abs(offset);

                          if (absOffset > 2) return null;

                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (isCenter) {
                                  setModalItem({ type: "reel", item });
                                } else {
                                  setActiveIndex(idx);
                                }
                              }}
                              className={`absolute cursor-pointer rounded-2xl border transition-all duration-700 ease-out select-none ${
                                isCenter
                                  ? "z-20 border-border/90 bg-card shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] scale-100 sm:scale-105"
                                  : "z-10 border-border/40 bg-card/60 opacity-60 backdrop-blur-sm shadow-xl"
                              }`}
                              style={{
                                transform: `translateX(${offset * (window.innerWidth < 640 ? 140 : 250)}px) scale(${
                                  1 - absOffset * 0.15
                                }) rotateY(${offset * -15}deg)`,
                                width: window.innerWidth < 640 ? "220px" : "300px",
                                height: window.innerWidth < 640 ? "360px" : "480px",
                              }}
                            >
                              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
                                <img
                                  src={item.poster}
                                  alt={item.title}
                                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {/* Play Button in Center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 p-1 backdrop-blur-md transition-transform duration-300 hover:scale-110">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-black shadow-lg">
                                      <Play className="h-6 w-6 fill-current translate-x-0.5" />
                                    </div>
                                  </div>
                                </div>

                                {/* Top Badges */}
                                <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                                    {item.duration}
                                  </span>
                                  <span className="rounded-full bg-electric/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                                    {item.views} Views
                                  </span>
                                </div>

                                {/* Expand Button */}
                                {isCenter && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalItem({ type: "reel", item });
                                    }}
                                    className="absolute bottom-3 right-3 z-30 rounded-xl bg-black/70 p-2.5 text-white backdrop-blur transition-transform hover:scale-110"
                                    aria-label="Play Reel"
                                  >
                                    <Maximize2 className="h-4 w-4" />
                                  </button>
                                )}

                                {/* Reel Details */}
                                <div className="absolute bottom-3 left-3 right-12 text-left">
                                  <h4 className="font-display text-sm font-bold text-white sm:text-base">
                                    {item.title}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Fullscreen Lightbox / Video Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl transition-opacity animate-in fade-in"
          onClick={() => setModalItem(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-card p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalItem(null)}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/70 p-2.5 text-white backdrop-blur transition-transform hover:scale-110 hover:bg-black"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {modalItem.type === "creative" ? (
              <div className="flex flex-col items-center">
                <img
                  src={(modalItem.item as CreativeItem).image}
                  alt={(modalItem.item as CreativeItem).title}
                  className="max-h-[75vh] w-auto rounded-xl object-contain"
                />
                <div className="mt-4 p-2 text-center">
                  <h3 className="font-display text-xl font-bold">
                    {(modalItem.item as CreativeItem).title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {(modalItem.item as CreativeItem).description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative aspect-[9/16] h-[75vh] max-h-[650px] w-auto overflow-hidden rounded-xl bg-black">
                  <video
                    ref={videoRef}
                    src={(modalItem.item as ReelItem).videoUrl}
                    poster={(modalItem.item as ReelItem).poster}
                    controls
                    autoPlay
                    loop
                    muted={isMuted}
                    className="h-full w-full object-cover"
                  />
                  {/* Mute Toggle Overlay */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute left-4 top-4 z-40 rounded-full bg-black/60 p-2.5 text-white backdrop-blur"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <h3 className="font-display text-lg font-bold">
                    {(modalItem.item as ReelItem).title}
                  </h3>
                  <p className="text-xs text-electric font-semibold">
                    {(modalItem.item as ReelItem).views} Views • {(modalItem.item as ReelItem).duration}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
