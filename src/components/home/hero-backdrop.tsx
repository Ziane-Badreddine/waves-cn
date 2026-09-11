// Decorative animated equalizer behind the hero.
// Heights are deterministic (seeded) so server and client markup match.

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const COUNT = 96;
const rand = seeded(7);
const bars = Array.from({ length: COUNT }, (_, i) => {
  // Bell-shaped envelope so the middle is taller than the edges.
  const t = i / (COUNT - 1);
  const envelope = Math.exp(-((t - 0.5) ** 2) / 0.06);
  const height = 14 + rand() * 46 * envelope + envelope * 30;
  return {
    height,
    duration: 2 + rand() * 2.2,
    delay: -rand() * 4,
  };
});

export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[9rem] -z-10 flex h-64 items-center justify-center gap-[5px] px-6 opacity-[0.16] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)] dark:opacity-[0.22] md:top-[12rem] md:h-80"
    >
      {bars.map((b, i) => (
        <span
          key={i}
          className="hero-bar w-[3px] shrink-0 rounded-full bg-foreground"
          style={
            {
              height: `${b.height}%`,
              "--bar-duration": `${b.duration}s`,
              "--bar-delay": `${b.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
