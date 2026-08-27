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

  // Finger touch / pointer gesture handlers for sliding gallery left & right
  // Finger touch swipe handlers for sliding gallery left & right on mobile
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - endX;
    const diffY = touchStartY.current - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
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

          {/* Hero Client Overview */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left Side: Category, Title, Description, Social Buttons, We Provide, & Metrics */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div>
                <span className="rounded-full bg-electric/15 px-3 py-1 font-display text-xs font-bold text-electric">
                  {project.category}
                </span>
                <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl lg:text-4xl tracking-tight text-foreground">
                  {project.name}
                </h1>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">
                  {project.fullDescription}
                </p>
              </div>

              {/* 3 Icons Column by Column (Facebook, Insta, Website) */}
              <div className="flex flex-col gap-2.5 max-w-xs">
                {project.links.facebook && (
                  <a
                    href={project.links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-xl bg-blue-600 border border-blue-500/50 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.01]"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Facebook className="h-4 w-4 fill-white text-blue-600" />
                      Facebook
                    </span>
                    <span className="text-[10px] opacity-80">→</span>
                  </a>
                )}
                {project.links.instagram && (
                  <a
                    href={project.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 border border-pink-400/30 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:opacity-95 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-[1.01]"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Instagram className="h-4 w-4 text-white" />
                      Instagram
                    </span>
                    <span className="text-[10px] opacity-80">→</span>
                  </a>
                )}
                {project.links.website && (
                  <a
                    href={project.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-xl bg-cyan-600 border border-cyan-500/50 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01]"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-white" />
                      Website
                    </span>
                    <span className="text-[10px] opacity-80">→</span>
                  </a>
                )}
              </div>

              {/* 'We Provide' Section (Clean styling, no blur bg, blue points) */}
              <div className="pt-1">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground uppercase flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  We Provide
                </h3>
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {project.servicesProvided.map((service, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-500">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/15 text-blue-500 text-[9px] font-bold">
                        ✓
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>


            </div>

            {/* Right Side: 500x500px Hero Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl w-full max-w-[500px] aspect-square">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  width={500}
                  height={500}
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
          </div>

          {/* Visual Showcase Section */}
          <section className="mt-16 sm:mt-24">
            <div className="flex flex-col items-center justify-center text-center gap-6 border-b border-border/60 pb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-electric uppercase">
                  <Sparkles className="h-4 w-4" />
                  VISUAL SHOWCASE
                </div>
                <h3 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                  CREATIVES & REELS GALLERY
                </h3>
              </div>

              {/* Centered & Enlarged Tabs Switcher */}
              <div className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/80 p-1.5 backdrop-blur-xl shadow-xl">
                <button
                  onClick={() => setActiveTab("creatives")}
                  className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ${
                    activeTab === "creatives"
                      ? "bg-foreground text-background shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  Creatives ({project.creatives.length})
                </button>
                <button
                  onClick={() => setActiveTab("reels")}
                  className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ${
                    activeTab === "reels"
                      ? "bg-foreground text-background shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Film className="h-4 w-4" />
                  Reels ({project.reels.length})
                </button>
              </div>
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
                  <div 
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="relative flex w-full max-w-5xl items-center justify-center px-4 perspective-[1200px] select-none touch-pan-y"
                  >
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
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                />

                                {/* Fullscreen Expand Button */}
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
                                  alt=""
                                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                />

                                {/* Play Button in Center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 p-1 backdrop-blur-md transition-transform duration-300 hover:scale-110">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-black shadow-lg">
                                      <Play className="h-6 w-6 fill-current translate-x-0.5" />
                                    </div>
                                  </div>
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
                  alt=""
                  className="max-h-[82vh] w-auto rounded-xl object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative aspect-[9/16] h-[82vh] max-h-[700px] w-auto overflow-hidden rounded-xl bg-black">
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
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
