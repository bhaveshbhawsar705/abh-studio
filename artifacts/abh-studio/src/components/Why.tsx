import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from "framer-motion";

function useTilt(strength = 10) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * strength);
    rotateY.set(x * strength);
  }

  function onMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return { rotateX: springX, rotateY: springY, onMouseMove, onMouseLeave };
}

function CountUp({ to, from = 0, duration = 1800 }: { to: number; from?: number; duration?: number }) {
  const [val, setVal] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(from + (to - from) * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, from, duration]);

  return <span ref={ref}>{val}</span>;
}

function AnimatedGraph() {
  const ref = useRef<SVGPolylineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (inView) setTimeout(() => setDrawn(true), 200);
  }, [inView]);

  const points = "0,70 40,55 80,62 120,30 160,40 200,10 240,22 280,5";

  return (
    <div ref={containerRef} className="w-full h-20 overflow-hidden">
      <svg viewBox="0 0 280 80" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="graph-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <clipPath id="graph-clip">
            <motion.rect
              x="0" y="0" height="80"
              initial={{ width: 0 }}
              animate={{ width: drawn ? 280 : 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>
        </defs>
        <polygon
          points={`0,70 ${points.split(" ").map(p => p).join(" ")} 280,70`}
          fill="url(#graph-fill)"
          clipPath="url(#graph-clip)"
        />
        <polyline
          ref={ref}
          points={points}
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#graph-clip)"
          style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.7))" }}
        />
        {drawn && (
          <motion.circle
            cx="280" cy="5" r="4"
            fill="#34d399"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
            style={{ filter: "drop-shadow(0 0 8px rgba(52,211,153,1))" }}
          />
        )}
      </svg>
    </div>
  );
}

function PulseRings({ color }: { color: string }) {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: `${color}40`, inset: i * 14 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center border-2"
        style={{ borderColor: color, background: `${color}15`, boxShadow: `0 0 20px ${color}40` }}
        animate={{ boxShadow: [`0 0 20px ${color}30`, `0 0 40px ${color}60`, `0 0 20px ${color}30`] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </motion.div>
    </div>
  );
}

function ShiftingGradient() {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
      animate={{
        background: [
          "radial-gradient(ellipse at 20% 30%, rgba(167,139,250,0.3) 0%, transparent 60%)",
          "radial-gradient(ellipse at 80% 70%, rgba(167,139,250,0.3) 0%, transparent 60%)",
          "radial-gradient(ellipse at 50% 10%, rgba(167,139,250,0.3) 0%, transparent 60%)",
          "radial-gradient(ellipse at 20% 30%, rgba(167,139,250,0.3) 0%, transparent 60%)",
        ],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const cardBase =
  "relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 flex flex-col cursor-default";

export function Why() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const speed = useTilt(8);
  const aesthetics = useTilt(8);
  const execution = useTilt(8);
  const quote = useTilt(6);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  return (
    <section className="relative py-28 overflow-hidden bg-background" ref={sectionRef}>
      {/* Scroll-driven ghost marquee */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <motion.div
          className="flex whitespace-nowrap font-display font-bold tracking-tighter text-white/[0.022] leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 22rem)", x: marqueeX }}
        >
          CRAFT · PRECISION · VELOCITY · CRAFT · PRECISION · VELOCITY ·&nbsp;
          CRAFT · PRECISION · VELOCITY · CRAFT · PRECISION · VELOCITY ·
        </motion.div>
      </div>

      <div className="relative z-10 px-6 lg:px-16 xl:px-24">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-semibold">Why ABH</span>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">

          {/* ── Card 1: Built for Speed (2/3 width, tall) ── */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="md:col-span-2"
            style={{ perspective: 800 }}
          >
            <motion.div
              className={cardBase}
              style={{ rotateX: speed.rotateX, rotateY: speed.rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={speed.onMouseMove}
              onMouseLeave={speed.onMouseLeave}
            >
              {/* Background glow */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.1) 0%, transparent 60%)" }} />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{ color: "#34d399", backgroundColor: "rgba(52,211,153,0.12)" }}>01</span>
                  <p className="text-xs tracking-[0.25em] uppercase font-semibold mt-2"
                    style={{ color: "rgba(52,211,153,0.6)" }}>Performance</p>
                </div>
                <motion.div
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border"
                  style={{ color: "#34d399", borderColor: "rgba(52,211,153,0.3)", backgroundColor: "rgba(52,211,153,0.06)" }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  LIVE METRICS
                </motion.div>
              </div>

              <div className="flex items-end gap-4 mb-2">
                <span className="font-display font-bold tracking-tighter leading-none"
                  style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "#34d399", textShadow: "0 0 40px rgba(52,211,153,0.4)" }}>
                  &lt; <CountUp to={1} duration={1200} />s
                </span>
                <div className="pb-3">
                  <p className="text-xs tracking-[0.2em] uppercase text-white/25 font-semibold">avg load time</p>
                  <p className="text-xs text-white/20 font-light">across all projects</p>
                </div>
              </div>

              <AnimatedGraph />

              <div className="mt-6 pt-5 border-t border-white/[0.05]">
                <h3 className="text-2xl font-display font-bold tracking-tight text-white mb-2">Built for Speed</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light max-w-lg">
                  Slow websites cost you customers. Ours don't. Every project ships with sub-second loads and clean Core Web Vitals. Not as a bonus. Just as standard.
                </p>
              </div>

              <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl origin-left"
                style={{ backgroundColor: "#34d399", opacity: 0.5 }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
            </motion.div>
          </motion.div>

          {/* ── Card 2: Cinematic Aesthetics (1/3 width) ── */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ perspective: 800 }}
          >
            <motion.div
              className={`${cardBase} min-h-[320px] md:h-full justify-between`}
              style={{ rotateX: aesthetics.rotateX, rotateY: aesthetics.rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={aesthetics.onMouseMove}
              onMouseLeave={aesthetics.onMouseLeave}
            >
              <ShiftingGradient />

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded"
                  style={{ color: "#a78bfa", backgroundColor: "rgba(167,139,250,0.12)" }}>02</span>
                <p className="text-xs tracking-[0.25em] uppercase font-semibold mt-2"
                  style={{ color: "rgba(167,139,250,0.6)" }}>Aesthetics</p>
              </div>

              <div className="my-6 flex flex-col items-start gap-1">
                <span className="font-display font-bold tracking-tighter leading-none text-white"
                  style={{ fontSize: "clamp(3.5rem, 8vw, 5rem)" }}>
                  100<span style={{ color: "#a78bfa" }}>%</span>
                </span>
                <span className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "rgba(167,139,250,0.5)" }}>
                  Custom built
                </span>
              </div>

              {/* Animated color palette swatches */}
              <div className="flex gap-2 mb-6">
                {["#a78bfa", "#4f8cff", "#22d3ee", "#34d399", "#fb923c"].map((c, i) => (
                  <motion.div
                    key={c}
                    className="flex-1 h-8 rounded-md"
                    style={{ backgroundColor: c }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>

              <div className="mt-auto pt-5 border-t border-white/[0.05]">
                <h3 className="text-xl font-display font-bold tracking-tight text-white mb-2">Cinematic Aesthetics</h3>
                <p className="text-white/40 text-xs leading-relaxed font-light">
                  Functional is the floor. We build sites that make people stop and look twice.
                </p>
              </div>

              <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl origin-left"
                style={{ backgroundColor: "#a78bfa", opacity: 0.5 }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} />
            </motion.div>
          </motion.div>

          {/* ── Card 3: Quote (1/3 width) ── */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ perspective: 800 }}
          >
            <motion.div
              className={`${cardBase} justify-center items-start min-h-[280px]`}
              style={{
                rotateX: quote.rotateX, rotateY: quote.rotateY, transformStyle: "preserve-3d",
                background: "rgba(79,140,255,0.04)", borderColor: "rgba(79,140,255,0.12)"
              }}
              onMouseMove={quote.onMouseMove}
              onMouseLeave={quote.onMouseLeave}
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute -bottom-8 -right-8 font-display font-bold leading-none select-none"
                  style={{
                    fontSize: "8rem",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(79,140,255,0.1)",
                  }}
                >
                  ABH
                </motion.div>
              </div>

              <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded mb-6"
                style={{ color: "#4f8cff", backgroundColor: "rgba(79,140,255,0.1)" }}>
                MANIFESTO
              </span>

              <div className="space-y-1">
                {["NO", "COMPROMISES.", "NO", "SHORTCUTS."].map((word, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.p
                      className="font-display font-bold tracking-tighter leading-tight"
                      style={{
                        fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                        color: i % 2 === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
                        WebkitTextStroke: i % 2 !== 0 ? "1px rgba(79,140,255,0.4)" : undefined,
                      }}
                      initial={{ y: "100%" }}
                      whileInView={{ y: "0%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {word}
                    </motion.p>
                  </div>
                ))}
              </div>

              <motion.div
                className="flex items-center gap-3 mt-8"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <span className="w-10 h-[1px]" style={{ backgroundColor: "#4f8cff" }} />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "rgba(79,140,255,0.6)" }}>
                  Our standard
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Card 4: Bulletproof Execution (2/3 width) ── */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="md:col-span-2"
            style={{ perspective: 800 }}
          >
            <motion.div
              className={`${cardBase} min-h-[300px]`}
              style={{ rotateX: execution.rotateX, rotateY: execution.rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={execution.onMouseMove}
              onMouseLeave={execution.onMouseLeave}
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 10% 80%, rgba(34,211,238,0.08) 0%, transparent 55%)" }} />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded"
                      style={{ color: "#22d3ee", backgroundColor: "rgba(34,211,238,0.12)" }}>03</span>
                    <p className="text-xs tracking-[0.25em] uppercase font-semibold"
                      style={{ color: "rgba(34,211,238,0.6)" }}>Execution</p>
                  </div>

                  <h3 className="text-2xl font-display font-bold tracking-tight text-white mb-3">Bulletproof Execution</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light max-w-md mb-6">
                    We test everything before it ships. Across devices, browsers, and edge cases. So nothing breaks after you go live.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {["Zero Technical Debt", "Cross-device QA", "Enterprise Security", "Scalable Architecture"].map((tag, i) => (
                      <motion.span
                        key={tag}
                        className="text-xs px-3 py-1 border tracking-wider uppercase font-medium rounded-full"
                        style={{ borderColor: "rgba(34,211,238,0.2)", color: "rgba(34,211,238,0.7)" }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 shrink-0">
                  <PulseRings color="#22d3ee" />
                  <div className="text-center">
                    <p className="font-display font-bold tracking-tighter leading-none"
                      style={{ fontSize: "3.5rem", color: "#22d3ee", textShadow: "0 0 30px rgba(34,211,238,0.4)" }}>
                      <CountUp to={14} duration={1500} />
                    </p>
                    <p className="text-xs tracking-[0.25em] uppercase font-semibold mt-1"
                      style={{ color: "rgba(34,211,238,0.5)" }}>days to launch</p>
                  </div>
                </div>
              </div>

              <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl origin-left"
                style={{ backgroundColor: "#22d3ee", opacity: 0.5 }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
