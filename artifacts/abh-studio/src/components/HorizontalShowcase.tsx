import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const panels = [
  {
    num: "01",
    label: "Performance",
    headline: "SUB-SECOND LOAD.",
    sub: "Slow sites lose customers. We build fast, always have.",
    color: "#4f8cff",
  },
  {
    num: "02",
    label: "Aesthetics",
    headline: "CINEMA-GRADE DESIGN.",
    sub: "Sites that look so good people save the URL to show their friends.",
    color: "#a78bfa",
  },
  {
    num: "03",
    label: "Execution",
    headline: "14 DAYS TO SHIP.",
    sub: "Two weeks from kickoff to launch. Tight, yes. But we've done it dozens of times.",
    color: "#22d3ee",
  },
  {
    num: "04",
    label: "Growth",
    headline: "RESULTS THAT SCALE.",
    sub: "We build things that hold up. Traffic spikes, new features, two years down the line.",
    color: "#34d399",
  },
];

const TOTAL = panels.length;
const W = 1 / TOTAL;

// Each card gets its own component so all hooks are at top-level
function RevealCard({
  panel,
  i,
  scrollYProgress,
}: {
  panel: (typeof panels)[number];
  i: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const s = i * W;           // segment start
  const e = s + W;           // segment end
  const m = s + W * 0.35;   // mid (fully in)

  const fadeEnd = i < TOTAL - 1 ? e : 1;
  const fadeEndOpacity = i < TOTAL - 1 ? 0 : 1;

  const opacity = useTransform(
    scrollYProgress,
    [s, m, Math.max(m + 0.001, e - W * 0.1), fadeEnd],
    [0, 1, 1, fadeEndOpacity]
  );
  const textY = useTransform(scrollYProgress, [s, m, e], [56, 0, -28]);
  const numScale = useTransform(scrollYProgress, [s, m], [2.2, 1]);
  const numOpacity = useTransform(
    scrollYProgress,
    [s, s + W * 0.35, m, Math.max(m + 0.001, e - W * 0.1), fadeEnd],
    [0, 0, 0.07, 0.07, i < TOTAL - 1 ? 0 : 0.07]
  );
  const barScale = useTransform(scrollYProgress, [m, Math.min(m + W * 0.3, e)], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ opacity, zIndex: i }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 65% 50%, ${panel.color}12 0%, transparent 60%)`,
        }}
      />

      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(16rem, 38vw, 34rem)",
          color: "transparent",
          WebkitTextStroke: `2px ${panel.color}`,
          opacity: numOpacity,
          scale: numScale,
          transformOrigin: "right center",
        }}
      >
        {panel.num}
      </motion.div>

      <motion.div
        className="relative z-10 w-full px-8 lg:px-20 xl:px-32"
        style={{ y: textY }}
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            className="h-px origin-left"
            style={{ backgroundColor: panel.color, width: 48, scaleX: barScale }}
          />
          <span
            className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase"
            style={{ color: panel.color }}
          >
            {panel.num} — {panel.label}
          </span>
        </div>

        <h3
          className="font-display font-black tracking-tighter leading-[0.88] text-white mb-8"
          style={{ fontSize: "clamp(3rem, 8.5vw, 9rem)" }}
        >
          {panel.headline}
        </h3>

        <p
          className="text-base lg:text-xl leading-relaxed font-light max-w-xl"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {panel.sub}
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
        style={{ backgroundColor: panel.color, scaleX: barScale }}
      />
    </motion.div>
  );
}

function ProgressPip({
  panel,
  i,
  scrollYProgress,
}: {
  panel: (typeof panels)[number];
  i: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const s = i * W;
  const e = s + W;

  const opacity = useTransform(
    scrollYProgress,
    [s, s + W * 0.3, Math.max(s + W * 0.31, e - W * 0.1), e],
    [0.2, 1, 1, 0.2]
  );
  const scaleX = useTransform(scrollYProgress, [s, s + W * 0.3], [0.5, 1]);

  return (
    <motion.div
      className="h-[2px] rounded-full origin-left"
      style={{
        backgroundColor: panel.color,
        opacity,
        scaleX,
        width: 44,
      }}
    />
  );
}

export function HorizontalShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const bgGrid = (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hgrid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hgrid)" />
    </svg>
  );

  return (
    <>
      {/* Mobile */}
      <section className="lg:hidden py-16 relative overflow-hidden">
        {bgGrid}
        <div className="relative z-10 px-6">
          <motion.p
            className="text-xs tracking-[0.35em] uppercase font-semibold mb-12"
            style={{ color: "rgba(79,140,255,0.6)" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What we deliver
          </motion.p>
          <div className="flex flex-col gap-14">
            {panels.map((panel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ backgroundColor: panel.color }} />
                  <span
                    className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase"
                    style={{ color: panel.color }}
                  >
                    {panel.num} — {panel.label}
                  </span>
                </div>
                <h3
                  className="font-display font-black tracking-tighter leading-[0.9] text-white mb-4"
                  style={{ fontSize: "clamp(2.2rem, 9vw, 3.5rem)" }}
                >
                  {panel.headline}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  {panel.sub}
                </p>
                <div className="mt-6 h-px" style={{ backgroundColor: `${panel.color}25` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop */}
      <section
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ height: `${TOTAL * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {bgGrid}

          <div className="absolute top-10 left-0 right-0 z-50 px-20 xl:px-32 flex items-center justify-between pointer-events-none">
            <p
              className="text-xs tracking-[0.35em] uppercase font-semibold"
              style={{ color: "rgba(79,140,255,0.5)" }}
            >
              What we deliver
            </p>
            <p className="text-xs tracking-[0.25em] uppercase font-mono text-white/10">
              {TOTAL} pillars
            </p>
          </div>

          <div className="relative w-full h-full">
            {panels.map((panel, i) => (
              <RevealCard
                key={i}
                panel={panel}
                i={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-50 px-20 xl:px-32 flex gap-3 items-center">
            {panels.map((p, i) => (
              <ProgressPip
                key={i}
                panel={p}
                i={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
