const particles = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 1.35) % 16,
  duration: 16 + (i % 5) * 4,
  size: i % 3 === 0 ? 3 : 2,
  violet: i % 4 === 0,
}));

const beams = [12, 34, 58, 79, 92];

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* drifting light blobs */}
      <div
        className="absolute -left-40 top-[-10%] h-[46rem] w-[46rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--electric) 26%, transparent), transparent 65%)",
          animation: "royal-drift 34s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-52 top-1/3 h-[40rem] w-[40rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--violet) 24%, transparent), transparent 66%)",
          animation: "royal-drift 44s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[-18%] left-1/3 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 18%, transparent), transparent 68%)",
          animation: "royal-drift 52s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />

      {/* panning technical grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--electric) 55%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--electric) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          animation: "royal-grid-pan 18s linear infinite",
          maskImage:
            "radial-gradient(ellipse at 50% 20%, black, transparent 78%)",
        }}
      />

      {/* vertical scanning beams */}
      {beams.map((left, i) => (
        <span
          key={left}
          className="absolute top-0 h-[40vh] w-px"
          style={{
            left: `${left}%`,
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--electric) 60%, transparent), transparent)",
            animation: `royal-beam ${11 + i * 3}s linear infinite`,
            animationDelay: `${i * 2.6}s`,
          }}
        />
      ))}

      {/* rising particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-5vh] rounded-full"
          style={{
            left: `${p.left}%`,
            height: p.size,
            width: p.size,
            background: p.violet
              ? "color-mix(in oklab, var(--violet) 70%, transparent)"
              : "color-mix(in oklab, var(--electric) 70%, transparent)",
            animation: `royal-rise ${p.duration}s linear infinite`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}

      {/* slow orbital rings */}
      <div
        className="absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/10"
        style={{ animation: "royal-orbit 90s linear infinite" }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-electric/50" />
      </div>
      <div
        className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet/10"
        style={{ animation: "royal-orbit 60s linear infinite reverse" }}
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-violet/50" />
      </div>

      {/* soft pulse rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute left-[18%] top-[62%] h-40 w-40 rounded-full border border-electric/20"
          style={{
            animation: "royal-pulse-ring 9s ease-out infinite",
            animationDelay: `${i * 3}s`,
          }}
        />
      ))}

      {/* vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 40%, color-mix(in oklab, var(--foreground) 12%, transparent))",
        }}
      />
    </div>
  );
}
