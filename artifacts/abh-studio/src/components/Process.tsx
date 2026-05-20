import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discovery",
    verb: "We listen.",
    color: "#4f8cff",
    bg: "rgba(79,140,255,0.07)",
    border: "rgba(79,140,255,0.18)",
    description:
      "Most agencies jump straight into Figma. We start by understanding who you're actually building for, what they want, and what's been stopping them. No pixel gets touched until we're clear on that.",
    deliverables: ["Brand audit", "Competitor mapping", "User personas", "Goal framework"],
    duration: "Day 1–2",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="2.5" />
        <line x1="30.5" y1="30.5" x2="40" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="22" r="4" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Strategy",
    verb: "We think.",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.07)",
    border: "rgba(167,139,250,0.18)",
    description:
      "Here's where we figure out the structure. How pages connect, what goes where, what tech stack makes sense. This is what separates a site that just looks good from one that actually works.",
    deliverables: ["Sitemap", "Wireframes", "Content plan", "Tech stack selection"],
    duration: "Day 2–3",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="16" y1="10" x2="16" y2="18" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="14" y1="26" x2="28" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="32" x2="22" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Design",
    verb: "We craft.",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.07)",
    border: "rgba(34,211,238,0.18)",
    description:
      "We obsess over spacing, motion, and the small details most people miss. Everything is intentional. Everything is consistent. It works on a phone, a 4K screen, and everywhere in between.",
    deliverables: ["Full UI design", "Motion spec", "Design system", "Prototype"],
    duration: "Day 3–7",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M24 8 L38 22 L24 36 L10 22 Z" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="22" r="5" fill="currentColor" opacity="0.35" />
        <path d="M18 8 Q24 14 30 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Build",
    verb: "We ship.",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.07)",
    border: "rgba(251,146,60,0.18)",
    description:
      "We write clean code, not clever code. React, Next.js, or whatever the project calls for. Performance is built in from the start, not patched in at the end. What you get is yours to own, maintain, and grow.",
    deliverables: ["Production-ready code", "CMS integration", "Performance audit", "Cross-device QA"],
    duration: "Day 7–12",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <polyline points="8,30 18,20 26,28 40,12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="6" y="34" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
        <circle cx="40" cy="12" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Launch",
    verb: "We grow.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.07)",
    border: "rgba(52,211,153,0.18)",
    description:
      "We don't hand you the keys and disappear. We stay on for 30 days post-launch, watch the data, fix what needs fixing, and make sure the launch actually sticks.",
    deliverables: ["Deployment", "Analytics setup", "Training handoff", "30-day support"],
    duration: "Day 12–14",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M24 6 L24 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 16 L24 6 L34 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 42 Q24 36 38 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
];

const bottomStats = [
  { value: "14", label: "days max to launch", idx: 0 },
  { value: "7", label: "days for rush projects", idx: 1 },
  { value: "∞", label: "revisions during design", idx: 2 },
  { value: "30", label: "days post-launch support", idx: 3 },
];

const CARD_DIRECTIONS = [
  { x: -80, y: 40, rotate: -8 },
  { x: 80, y: -40, rotate: 6 },
  { x: -60, y: -50, rotate: -5 },
  { x: 60, y: 50, rotate: 7 },
];

function SplitTitle({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex flex-wrap overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          initial={{ y: 120, opacity: 0, rotateX: -90, skewX: -20 }}
          animate={{ y: 0, opacity: 1, rotateX: 0, skewX: 0 }}
          transition={{
            delay: i * 0.045,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 200,
            damping: 18,
          }}
          style={{
            display: "inline-block",
            color: char === " " ? "transparent" : color,
            transformOrigin: "bottom center",
            perspective: 800,
          }}
          className="font-display font-bold tracking-tighter"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

function PulseRings({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: color }}
          initial={{ width: 10, height: 10, opacity: 0.8 }}
          animate={{ width: 60, height: 60, opacity: 0 }}
          transition={{
            duration: 1.2,
            delay: i * 0.35,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function MobileProcess() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section id="process" className="pt-14 pb-12 px-5 scroll-mt-16 lg:hidden">
      {/* Header */}
      <p className="text-[10px] tracking-[0.3em] text-primary/60 uppercase font-semibold mb-2">
        How we work
      </p>
      <h2 className="text-[2.4rem] font-display font-bold tracking-tighter leading-none mb-8">
        OUR <span className="text-white/15">PROCESS</span>
      </h2>

      {/* Accordion */}
      <div className="flex flex-col border-t border-white/[0.07]">
        {steps.map((step, idx) => {
          const isOpen = expanded === idx;
          return (
            <div key={idx} className="border-b border-white/[0.07]">
              {/* Row header */}
              <button
                className="w-full flex items-center gap-3 py-4 text-left"
                onClick={() => setExpanded(isOpen ? null : idx)}
              >
                {/* Step badge */}
                <motion.div
                  animate={{
                    backgroundColor: isOpen ? step.color : "rgba(255,255,255,0.04)",
                    borderColor: isOpen ? step.color : "rgba(255,255,255,0.08)",
                    boxShadow: isOpen ? `0 0 12px ${step.color}55` : "none",
                  }}
                  transition={{ duration: 0.22 }}
                  className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0 relative"
                >
                  {isOpen && <PulseRings color={step.color} />}
                  <span
                    className="text-[9px] font-mono font-bold relative z-10"
                    style={{ color: isOpen ? "#0a0a12" : "rgba(255,255,255,0.25)" }}
                  >
                    {step.number}
                  </span>
                </motion.div>

                {/* Title + duration */}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[15px] font-display font-bold tracking-tight leading-tight"
                    style={{ color: isOpen ? step.color : "rgba(255,255,255,0.88)" }}
                  >
                    {step.title}
                  </span>
                  <span className="ml-2 text-[10px] font-mono text-white/22">{step.duration}</span>
                </div>

                {/* Toggle icon */}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-white/25 text-xl leading-none pr-0.5"
                >
                  +
                </motion.span>
              </button>

              {/* Expanded body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-11 pb-5 space-y-4">
                      {/* Description card */}
                      <div
                        className="rounded-xl border p-4 relative overflow-hidden"
                        style={{ background: step.bg, borderColor: step.border }}
                      >
                        <div
                          className="absolute -right-2 -top-2 w-16 h-16 opacity-10 pointer-events-none"
                          style={{ color: step.color }}
                        >
                          {step.icon}
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed font-light relative z-10">
                          {step.description}
                        </p>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <p className="text-[10px] tracking-[0.22em] text-white/20 uppercase font-semibold mb-2.5">
                          Deliverables
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {step.deliverables.map((d, i) => (
                            <motion.div
                              key={d}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.25 }}
                              className="flex items-center gap-2 py-2 px-2.5 rounded-lg border border-white/[0.06] bg-white/[0.025]"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: step.color, boxShadow: `0 0 5px ${step.color}` }}
                              />
                              <span className="text-[11px] text-white/55 font-medium leading-tight">{d}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="mt-8 grid grid-cols-4 gap-3">
        {bottomStats.map((stat) => (
          <div key={stat.idx} className="flex flex-col gap-0.5">
            <span
              className="text-2xl font-display font-bold tracking-tighter"
              style={{ color: steps[stat.idx].color }}
            >
              {stat.value}
            </span>
            <span className="text-[8px] text-white/22 uppercase tracking-widest font-medium leading-tight">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => document.getElementById("contact-fields")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="mt-8 flex items-center justify-center gap-3 w-full rounded-2xl py-4 px-6 font-display font-bold text-base tracking-tight transition-opacity active:opacity-75"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
          boxShadow: "0 0 32px rgba(124,58,237,0.35)",
        }}
      >
        <span>Book a free discovery call</span>
        <span className="text-lg">→</span>
      </button>
      <p className="mt-2.5 text-center text-[11px] text-white/25">
        No commitment · Usually replies within 24 hours
      </p>
    </section>
  );
}

export function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const stepProgress = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 1, 2, 3, 4, 4]
  );

  useMotionValueEvent(stepProgress, "change", (latest) => {
    const next = Math.min(Math.round(latest), steps.length - 1);
    setActiveStep(next);
  });

  const step = steps[activeStep];

  return (
    <>
      <MobileProcess />
      <section
        id="process"
        ref={containerRef}
        className="relative scroll-mt-16 hidden lg:block"
        style={{ height: `${steps.length * 60 + 60}vh` }}
      >
      {/* Sticky shell — sits below the fixed nav, fills remaining viewport */}
      <div
        className="sticky overflow-hidden flex flex-col"
        style={{ top: "64px", height: "calc(100vh - 64px)" }}
      >

        {/* ── Full-screen color explosion ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeStep}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: `radial-gradient(ellipse 80% 70% at 65% 50%, ${step.color}18 0%, transparent 65%)`,
            }}
          />
        </AnimatePresence>

        {/* ── Scan-line flash ── */}
        <AnimatePresence>
          <motion.div
            key={`scan-${activeStep}`}
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ scaleY: 0, opacity: 0.6 }}
            animate={{ scaleY: [0, 1, 0], opacity: [0.5, 0.15, 0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              background: `linear-gradient(to bottom, transparent 0%, ${step.color}30 50%, transparent 100%)`,
              transformOrigin: "top",
            }}
          />
        </AnimatePresence>

        {/* ── Giant ghost step number (decorative, clipped by overflow-hidden) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`ghost-${activeStep}`}
            className="absolute pointer-events-none select-none z-0"
            style={{
              right: "-2%",
              top: "50%",
              translateY: "-50%",
              fontSize: "clamp(12rem, 30vw, 26rem)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: `2px ${step.color}`,
              opacity: 0.06,
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
            initial={{ x: 200, rotate: 20, scale: 1.3, opacity: 0 }}
            animate={{ x: 0, rotate: 0, scale: 1, opacity: 0.06 }}
            exit={{ x: -200, rotate: -15, scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            {step.number}
          </motion.div>
        </AnimatePresence>

        {/* ── Scroll hint ── */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-30"
          animate={{ opacity: activeStep === 0 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/20">Scroll to advance</span>
          <motion.div
            className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/*
          ── Content: 3-row flex column that fills h-screen exactly ──
          Row 1 (shrink-0): header label + title
          Row 2 (flex-1 min-h-0): sidebar + detail panel
          Row 3 (shrink-0): stats strip
        */}
        <div className="relative z-10 flex flex-col h-full px-6 lg:px-16 xl:px-24 pt-8 pb-5 gap-4">

          {/* Row 1 — Header (fixed height) */}
          <div className="shrink-0">
            <p className="text-[10px] tracking-[0.3em] text-primary/60 uppercase font-semibold mb-2">How we work</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter leading-none">
                OUR <span className="text-white/20">PROCESS</span>
              </h2>
              <p className="text-white/35 max-w-xs text-xs leading-relaxed hidden md:block">
                7 to 14 days from brief to launch. Every step intentional.
              </p>
            </div>
          </div>

          {/* Row 2 — Main split (fills remaining space) */}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 lg:gap-12">

            {/* Left — step indicators */}
            <div className="relative flex flex-col lg:w-[260px] shrink-0 justify-center">
              <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-white/[0.05] hidden lg:block overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full origin-top"
                  style={{ height: lineHeight, backgroundColor: step.color, opacity: 0.7 }}
                  transition={{ type: "spring", stiffness: 60, damping: 20 }}
                />
              </div>

              {steps.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 180, damping: 20, delay: idx * 0.07 }}
                  className="relative flex items-center gap-4 py-2.5 select-none"
                >
                  <div className="relative shrink-0 z-10 w-9 h-9">
                    {activeStep === idx && <PulseRings color={s.color} />}
                    <motion.div
                      animate={{
                        backgroundColor: activeStep === idx ? s.color : "transparent",
                        borderColor: activeStep === idx ? s.color : "rgba(255,255,255,0.1)",
                        scale: activeStep === idx ? 1.15 : 1,
                        boxShadow: activeStep === idx ? `0 0 18px ${s.color}60` : "none",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center relative z-10"
                    >
                      <motion.span
                        animate={{ color: activeStep === idx ? "#0a0a12" : "rgba(255,255,255,0.25)" }}
                        className="text-[9px] font-mono font-bold"
                      >
                        {activeStep > idx ? "✓" : s.number}
                      </motion.span>
                    </motion.div>
                  </div>

                  <div className="flex flex-col gap-0 flex-1">
                    <motion.span
                      animate={{
                        color: activeStep === idx ? "#ffffff" : "rgba(255,255,255,0.28)",
                        x: activeStep === idx ? 4 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="text-sm font-display font-bold tracking-tight leading-none"
                    >
                      {s.title}
                    </motion.span>
                    <span className="text-[10px] text-white/20 font-mono mt-0.5">{s.duration}</span>
                  </div>

                  <motion.div
                    animate={{ scaleX: activeStep === idx ? 1 : 0, opacity: activeStep === idx ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full origin-right"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Right — 3D flip detail panel */}
            <div className="flex-1 min-h-0 overflow-hidden" style={{ perspective: "1200px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, rotateY: -25, x: 80, scale: 0.92 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 20, x: -60, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18, mass: 0.8 }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
                  className="flex flex-col h-full"
                >
                  {/* Card header */}
                  <motion.div
                    className="rounded-xl border p-4 lg:p-5 mb-3 relative overflow-hidden shrink-0"
                    style={{ background: step.bg, borderColor: step.border }}
                    animate={{ boxShadow: `0 0 50px ${step.color}18, inset 0 0 20px ${step.color}06` }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute -right-4 -top-4 w-32 h-32"
                      style={{ color: step.color, opacity: 0.07 }}
                      initial={{ rotate: -30, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    >
                      {step.icon}
                    </motion.div>

                    <div className="relative z-10 flex items-center gap-4">
                      <motion.div
                        className="w-10 h-10 shrink-0"
                        style={{ color: step.color }}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      >
                        {step.icon}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <motion.span
                            className="text-[9px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded"
                            style={{ color: step.color, backgroundColor: `${step.color}25` }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.08 }}
                          >
                            {step.number}
                          </motion.span>
                          <span className="text-[10px] text-white/20 font-mono">{step.duration}</span>
                        </div>
                        <div className="overflow-hidden" style={{ lineHeight: 1 }}>
                          <div className="text-2xl lg:text-4xl font-display font-bold tracking-tighter leading-none">
                            <SplitTitle text={step.title} color={step.color} />
                          </div>
                        </div>
                        <p className="text-white/30 text-xs font-light italic mt-1">{step.verb}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-white/50 text-xs lg:text-sm leading-relaxed mb-3 font-light shrink-0"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {step.description}
                  </motion.p>

                  {/* Deliverables */}
                  <div className="shrink-0">
                    <motion.p
                      className="text-[10px] tracking-[0.25em] text-white/20 uppercase font-semibold mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.18 }}
                    >
                      What you get
                    </motion.p>
                    <div className="grid grid-cols-2 gap-2">
                      {step.deliverables.map((d, i) => {
                        const dir = CARD_DIRECTIONS[i % CARD_DIRECTIONS.length];
                        return (
                          <motion.div
                            key={d}
                            initial={{ opacity: 0, x: dir.x, y: dir.y, rotate: dir.rotate, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 + i * 0.07 }}
                            className="flex items-center gap-2.5 py-2 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] relative overflow-hidden group"
                          >
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `linear-gradient(135deg, ${step.color}12 0%, transparent 70%)` }}
                            />
                            <motion.span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: step.color, boxShadow: `0 0 6px ${step.color}` }}
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <span className="text-xs text-white/55 font-medium relative z-10">{d}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.div
                    className="mt-4 shrink-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-3 text-xs font-semibold transition-all duration-300"
                      style={{ color: step.color }}
                    >
                      <span>Start with a free discovery call</span>
                      <motion.span
                        whileHover={{ x: 5, y: -5, scale: 1.2 }}
                        className="w-7 h-7 rounded-full border flex items-center justify-center text-xs"
                        style={{ borderColor: `${step.color}50`, boxShadow: `0 0 12px ${step.color}30` }}
                      >
                        →
                      </motion.span>
                    </a>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Row 3 — Stats strip (fixed height) */}
          <div className="shrink-0 pt-3 border-t border-white/[0.05] flex flex-wrap gap-6 lg:gap-12">
            {bottomStats.map((stat, i) => (
              <div key={stat.idx} className="flex flex-col gap-0.5">
                <motion.span
                  className="text-2xl lg:text-3xl font-display font-bold tracking-tighter"
                  style={{ color: steps[stat.idx].color }}
                  animate={{ textShadow: [`0 0 16px ${steps[stat.idx].color}30`, `0 0 32px ${steps[stat.idx].color}60`, `0 0 16px ${steps[stat.idx].color}30`] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-[9px] text-white/25 uppercase tracking-widest font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
