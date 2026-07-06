import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SPOTS_REMAINING = 2;
const BOOKING_MONTH = "July";
const TOTAL_SLOTS = 4;

function useSpotsCounter(target: number, delay = 1600) {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      let c = 0;
      const id = setInterval(() => {
        c++;
        setCount(c);
        if (c >= target) clearInterval(id);
      }, 280);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);
  return { count, loaded };
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

function useScramble(text: string, startDelay = 0.6) {
  const CHARS = SCRAMBLE_CHARS;
  const [output, setOutput] = useState(() =>
    text.replace(/[^\s]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  useEffect(() => {
    const t = setTimeout(() => {
      let frame = 0;
      const interval = setInterval(() => {
        setOutput(
          text
            .split("")
            .map((char, idx) => {
              if (char === " " || char === "\n") return char;
              if (frame > idx * 2 + 12) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        frame++;
        if (frame > text.length * 2 + 20) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, startDelay * 1000);
    return () => clearTimeout(t);
  }, [text]);

  return output;
}

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    if (!isMobile) window.addEventListener("mousemove", onMouse);

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number };
    const count = isMobile ? 20 : 50;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId: number;
    let lastTime = 0;
    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < 33) return; // cap at ~30 fps
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          p.vx -= (dx / dist) * 0.04;
          p.vy -= (dy / dist) * 0.04;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,160,255,${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79,140,255,${0.12 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (!isMobile) window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-70" />;
}

export function Hero() {
  const line1 = useScramble("WE BUILD", 0.3);
  const line2 = useScramble("DIGITAL", 0.7);
  const line3 = useScramble("REALITIES.", 1.1);
  const { count, loaded } = useSpotsCounter(SPOTS_REMAINING);

  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "25%"]
  );

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 40, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 20 });
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    const h = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 60);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 60);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [rawX, rawY]);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-24 pb-0">
      {/* Parallax background layer — extends beyond section edges so it never shows gaps */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ y: bgY, top: "-20%", bottom: "-20%", willChange: "transform" }}
      >
        <ParticleCanvas />

        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(79,140,255,0.18) 0%, transparent 70%)",
            top: "20%", left: "40%",
            x: springX, y: springY,
            willChange: "transform",
          }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
      </motion.div>

      <div className="relative z-10 w-full px-6 lg:px-16 xl:px-24">

        {/* ── Spots available badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4 mb-10"
          data-testid="hero-badge"
        >
          {/* Urgency pill */}
          <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-sm overflow-hidden"
            style={{ borderColor: "rgba(251,146,60,0.35)", background: "rgba(251,146,60,0.06)" }}
          >
            {/* Animated glow sweep */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.12), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
            {/* Pulsing dot */}
            <div className="relative shrink-0">
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
              <span className="relative w-2 h-2 rounded-full bg-amber-400 block" />
            </div>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase relative z-10"
              style={{ color: "rgb(251,146,60)" }}>
              <AnimatePresence mode="wait">
                {!loaded ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-mono text-white/25">
                    — spots left in {BOOKING_MONTH}
                  </motion.span>
                ) : (
                  <motion.span key="loaded" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    {count} spot{count !== 1 ? "s" : ""} left in {BOOKING_MONTH}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </div>

          {/* Capacity bar */}
          <AnimatePresence>
            {loaded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                      className="h-1 w-5 rounded-full origin-left"
                      style={{
                        backgroundColor: i < (TOTAL_SLOTS - SPOTS_REMAINING)
                          ? "rgba(251,146,60,0.9)"
                          : "rgba(255,255,255,0.12)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-white/25 tracking-widest">
                  {TOTAL_SLOTS - SPOTS_REMAINING}/{TOTAL_SLOTS} filled
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-[13vw] md:text-[11vw] font-display font-bold tracking-tighter leading-[0.9] text-white"
          >
            {line1}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="text-[13vw] md:text-[11vw] font-display font-bold tracking-tighter leading-[0.9] text-transparent"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)" }}
          >
            {line2}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.29 }}
            className="text-[13vw] md:text-[11vw] font-display font-bold tracking-tighter leading-[0.9] text-white"
          >
            {line3}
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="text-base md:text-lg text-white/50 max-w-sm font-light leading-relaxed"
          >
            We're a small team. We build fast websites, run sharp social media, and make brands look like they belong at the top.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#process"
              data-testid="hero-cta-work"
              className="group flex items-center gap-3 px-7 py-4 bg-primary text-white font-bold text-sm tracking-wider uppercase hover:bg-primary/90 transition-all duration-300 rounded-none"
            >
              View Our Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              data-testid="hero-cta-contact"
              className="flex items-center gap-3 px-7 py-4 border border-white/15 text-white/70 font-bold text-sm tracking-wider uppercase hover:border-white/40 hover:text-white transition-all duration-300 rounded-none"
            >
              Start a Project
            </a>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mt-16 w-full overflow-hidden border-t border-white/[0.06] py-5">
        <div className="marquee-track flex whitespace-nowrap will-change-transform">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-xs tracking-[0.3em] text-white/20 uppercase font-semibold pr-12">
              Web Development
              <span className="text-primary/40">—</span>
              Social Media Management
              <span className="text-primary/40">—</span>
              Digital Marketing
              <span className="text-primary/40">—</span>
              UI/UX Design
              <span className="text-primary/40">—</span>
              Performance Engineering
              <span className="text-primary/40">—</span>
              Brand Strategy
              <span className="text-primary/40">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
