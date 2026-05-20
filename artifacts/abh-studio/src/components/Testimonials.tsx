import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WordReveal } from "@/components/WordReveal";

const testimonials = [
  {
    quote: "We had a rough idea of what we wanted. ABH took it and built something genuinely impressive. Our whole team was stunned at the result.",
    author: "Priya Menon",
    role: "Founder, Keeva Skincare",
    initials: "PM",
    color: "#4f8cff",
  },
  {
    quote: "The site loads in under a second and looks like it costs five times what we paid. Honestly, exactly what we asked for.",
    author: "James Okafor",
    role: "Co-founder, Roam Supply Co.",
    initials: "JO",
    color: "#a78bfa",
  },
  {
    quote: "They got the brief on the first call and didn't need us to babysit the project. That alone is worth the price.",
    author: "Nadia Hussain",
    role: "Head of Brand, Halfday Club",
    initials: "NH",
    color: "#22d3ee",
  },
  {
    quote: "Worked with bigger agencies before. Never got this level of care or this kind of speed. ABH treats your project like it's their own.",
    author: "Tom Ashby",
    role: "Owner, Marble & Oak",
    initials: "TA",
    color: "#34d399",
  },
  {
    quote: "Conversion rate went up 40% in the first month after launch. That's not a coincidence.",
    author: "Sara Lindqvist",
    role: "Marketing Lead, Driftline Coffee",
    initials: "SL",
    color: "#fb923c",
  },
];

function Card({ t }: { t: typeof testimonials[0] }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width - 0.5;
    const y = (e.clientY - card.top) / card.height - 0.5;
    setTilt({ rotateX: -y * 10, rotateY: x * 10 });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="shrink-0 w-[320px] lg:w-[400px] p-7 border border-white/[0.06] bg-white/[0.015] mx-4 cursor-default relative overflow-hidden group"
    >
      {/* Color accent top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`, opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${t.color}10 0%, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-display font-bold border"
            style={{ backgroundColor: `${t.color}15`, borderColor: `${t.color}30`, color: t.color }}
          >
            {t.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.author}</p>
            <p className="text-xs font-medium" style={{ color: `${t.color}90` }}>{t.role}</p>
          </div>
        </div>
        <p className="text-white/55 leading-relaxed text-[15px] font-light italic">
          "{t.quote}"
        </p>
      </div>
    </motion.div>
  );
}

function MobileTestimonials() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hinted = useRef(false);

  // Swipe hint: nudge right then snap back after a short delay
  useEffect(() => {
    if (hinted.current) return;
    const container = scrollRef.current;
    if (!container) return;
    const timer = setTimeout(() => {
      hinted.current = true;
      container.scrollTo({ left: 48, behavior: "smooth" });
      setTimeout(() => container.scrollTo({ left: 0, behavior: "smooth" }), 520);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  function scrollTo(index: number) {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (!card) return;
    const offset = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
    setActive(index);
  }

  function onScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActive(closest);
  }

  return (
    <div className="relative">
      {/* Scrollable snap row */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex overflow-x-auto gap-4 px-6 pb-2"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            style={{ scrollSnapAlign: "center", flexShrink: 0, width: "calc(100vw - 64px)" }}
          >
            <div
              className="relative overflow-hidden h-full"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(${
                  t.color === "#4f8cff" ? "79,140,255" :
                  t.color === "#a78bfa" ? "167,139,250" :
                  t.color === "#22d3ee" ? "34,211,238" :
                  t.color === "#34d399" ? "52,211,153" : "251,146,60"
                },0.04) 100%)`,
              }}
            >
              {/* Color accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }}
              />
              {/* Quote mark */}
              <div
                className="absolute top-4 right-5 text-6xl font-display font-black leading-none select-none pointer-events-none"
                style={{ color: `${t.color}14` }}
              >
                "
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-display font-bold border shrink-0"
                    style={{ backgroundColor: `${t.color}18`, borderColor: `${t.color}35`, color: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.author}</p>
                    <p className="text-xs font-medium" style={{ color: `${t.color}90` }}>{t.role}</p>
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed text-[15px] font-light italic">
                  "{t.quote}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {testimonials.map((t, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="transition-all duration-300"
            style={{
              width: active === i ? 20 : 6,
              height: 6,
              borderRadius: 9999,
              background: active === i ? t.color : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials];
  const doubledReverse = [...testimonials].reverse().concat([...testimonials].reverse());

  return (
    <section className="pt-16 pb-32 md:py-32 relative bg-background overflow-x-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(79,140,255,0.05) 0%, transparent 60%)" }}
      />

      <div className="px-6 lg:px-16 xl:px-24 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">
            CLIENT VERDICT
          </h2>
          <p className="text-white/40 text-sm max-w-sm font-light">
            Don't take our word for it. Here's what the people we've worked with have to say.
          </p>
        </motion.div>
      </div>

      {/* Mobile: snap-scroll carousel */}
      <div className="md:hidden">
        <MobileTestimonials />
      </div>

      {/* Desktop: dual auto-scroll marquee rows — unchanged */}
      <div className="hidden md:block">
        {/* Row 1 — left to right */}
        <div className="relative mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, hsl(var(--background)), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(-90deg, hsl(var(--background)), transparent)" }} />
          <div className="overflow-hidden">
            <div className="flex testimonials-track" style={{ width: `${doubled.length * 432}px` }}>
              {doubled.map((t, i) => <Card key={`a-${i}`} t={t} />)}
            </div>
          </div>
        </div>

        {/* Row 2 — right to left (reverse) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, hsl(var(--background)), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(-90deg, hsl(var(--background)), transparent)" }} />
          <div className="overflow-hidden">
            <div className="flex testimonials-track-reverse" style={{ width: `${doubledReverse.length * 432}px` }}>
              {doubledReverse.map((t, i) => <Card key={`b-${i}`} t={t} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
