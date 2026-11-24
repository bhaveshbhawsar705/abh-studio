import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { WordReveal } from "@/components/WordReveal";

const services = [
  {
    num: "01",
    title: "Web Development",
    sub: "Primary discipline",
    description:
      "We build websites that are fast, clean, and built to last. No bloat, no shortcuts, no excuses. Just code that works the way it's supposed to.",
    tags: ["React / Next.js", "WebGL & 3D", "E-commerce", "Performance < 1s"],
    color: "#4f8cff",
    shape: (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect x="20" y="20" width="160" height="160" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <rect x="40" y="40" width="120" height="10" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="40" y="60" width="80" height="8" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="40" y="78" width="100" height="8" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="40" y="110" width="120" height="50" rx="3" fill="currentColor" opacity="0.12" />
        <circle cx="160" cy="40" r="10" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Social Media Management",
    sub: "Brand amplification",
    description:
      "Content that actually gets engagement. We plan, create, and post consistently so you don't have to think about it.",
    tags: ["Content Strategy", "Community Growth", "Visual Identity", "Analytics"],
    color: "#a78bfa",
    shape: (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
        <circle cx="100" cy="55" r="12" fill="currentColor" opacity="0.5" />
        <circle cx="140" cy="125" r="12" fill="currentColor" opacity="0.35" />
        <circle cx="60" cy="125" r="12" fill="currentColor" opacity="0.35" />
        <line x1="100" y1="67" x2="130" y2="118" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <line x1="100" y1="67" x2="70" y2="118" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Digital Marketing",
    sub: "Growth engineering",
    description:
      "Ad campaigns that make money, not just impressions. We track what works, cut what doesn't, and keep the numbers moving.",
    tags: ["Paid Ads", "SEO", "CRO", "Email Automation"],
    color: "#34d399",
    shape: (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <polyline points="20,160 60,110 90,130 130,70 180,40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        <circle cx="60" cy="110" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="90" cy="130" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="130" cy="70" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="180" cy="40" r="7" fill="currentColor" opacity="0.8" />
        <rect x="20" y="162" width="160" height="2" rx="1" fill="currentColor" opacity="0.15" />
      </svg>
    ),
  },
];

export function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseY = useMotionValue(0);
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  function handleMouseMove(e: React.MouseEvent, idx: number) {
    const row = e.currentTarget.getBoundingClientRect();
    mouseY.set(e.clientY - row.top - row.height / 2);
    setHovered(idx);
  }

  function handleMobileTap(idx: number) {
    setExpanded(prev => prev === idx ? null : idx);
  }

  return (
    <section id="services" className="pt-20 pb-24 relative bg-background scroll-mt-16" ref={containerRef}>
      <div className="w-full px-6 lg:px-16 xl:px-24 mb-14">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-semibold font-mono">
            What we do
          </span>
        </motion.div>

        {/* Heading + tagline — stacked, no floating corners */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-none"
            >
              CORE{" "}
              <span className="text-white/20">DISCIPLINES</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/40 text-sm leading-relaxed font-light max-w-sm"
          >
            We don't do everything. We master the things that move the needle.
          </motion.p>
        </div>
      </div>

      <div className="w-full border-t border-white/[0.06]">
        {services.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            onMouseMove={(e) => handleMouseMove(e, idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleMobileTap(idx)}
            className="relative border-b border-white/[0.06] cursor-pointer group overflow-hidden"
            data-testid={`service-row-${idx}`}
          >
            {/* Full-width color wash — paints left to right on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none origin-left"
              animate={{ scaleX: hovered === idx ? 1 : 0, opacity: hovered === idx ? 1 : 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: `linear-gradient(90deg, ${s.color}10 0%, ${s.color}04 60%, transparent 100%)` }}
            />

            {/* Massive ghost number — scales up on hover */}
            <motion.span
              className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-bold tracking-tighter leading-none pointer-events-none select-none hidden lg:block"
              animate={{
                opacity: hovered === idx ? 0.07 : 0.025,
                scale: hovered === idx ? 1.15 : 1,
                color: hovered === idx ? s.color : "#ffffff",
              }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: "clamp(6rem, 14vw, 14rem)" }}
            >
              {s.num}
            </motion.span>

            {/* Floating shape that drifts with cursor Y */}
            <AnimatePresence>
              {hovered === idx && (
                <motion.div
                  key="shape"
                  className="absolute right-[18%] top-1/2 pointer-events-none hidden lg:block"
                  initial={{ opacity: 0, scale: 0.7, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ y: springY, translateY: "-50%", color: s.color, width: 100, height: 100 }}
                >
                  {s.shape}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom reveal line */}
            <motion.div
              className="absolute bottom-0 left-0 h-[1px] pointer-events-none"
              animate={{ width: hovered === idx ? "100%" : "0%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundColor: s.color, opacity: 0.5 }}
            />

            <div className="relative z-10 flex items-start lg:items-center gap-6 lg:gap-12 px-6 lg:px-16 xl:px-24 py-8 lg:py-10">
              <motion.span
                className="text-5xl lg:text-7xl font-display font-bold leading-none shrink-0 transition-all duration-300"
                animate={{ color: hovered === idx ? s.color : "rgba(255,255,255,0.07)" }}
              >
                {s.num}
              </motion.span>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 mb-3">
                  <h3 className="text-2xl lg:text-4xl font-display font-bold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <motion.span
                    animate={{ color: hovered === idx ? s.color : "rgba(79,140,255,0.5)" }}
                    className="text-xs tracking-widest uppercase font-semibold"
                  >
                    {s.sub}
                  </motion.span>
                </div>

                <AnimatePresence>
                  {(hovered === idx || expanded === idx) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/50 text-sm leading-relaxed mb-4 max-w-2xl font-light pt-1">
                        {s.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {s.tags.map((tag, ti) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ti * 0.05, duration: 0.25 }}
                            className="text-xs px-3 py-1 border tracking-wider uppercase font-medium"
                            style={{ borderColor: `${s.color}30`, color: s.color }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Mobile tap hint */}
                <div className="lg:hidden flex items-center gap-1.5 mt-3 mb-1">
                  <motion.span
                    animate={{ rotate: expanded === idx ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/20 text-lg leading-none"
                    style={{ color: expanded === idx ? s.color : undefined }}
                  >
                    +
                  </motion.span>
                  <span className="text-[10px] tracking-widest uppercase font-mono text-white/20">
                    {expanded === idx ? "Close" : "Details"}
                  </span>
                </div>
              </div>

              <motion.div
                animate={{ opacity: hovered === idx ? 1 : 0, x: hovered === idx ? 0 : 10 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 hidden lg:flex w-12 h-12 rounded-full border items-center justify-center"
                style={{ borderColor: hovered === idx ? `${s.color}50` : "transparent", color: s.color }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
