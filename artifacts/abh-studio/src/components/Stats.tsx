import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function ArcRing({ percent, color, size = 140 }: { percent: number; color: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView({ current: ref.current ? ref.current.closest("svg") as SVGElement : null }, { once: true });
  const [dash, setDash] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const target = (percent / 100) * circumference;
    let frame = 0;
    const total = 90;
    const animate = () => {
      frame++;
      const ease = 1 - Math.pow(1 - frame / total, 3);
      setDash(target * ease);
      if (frame < total) requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timeout);
  }, [isInView, percent, circumference]);

  return (
    <svg width={size} height={size} className="absolute inset-0 m-auto -rotate-90" aria-hidden>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2"
      />
      <circle
        ref={ref}
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - dash}
        style={{ transition: "none", filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

const stats = [
  { target: 50, suffix: "+", label: "Digital flagships launched", percent: 50, color: "#4f8cff" },
  { target: 98, suffix: "%", label: "Client retention rate", percent: 98, color: "#a78bfa" },
  { target: 1,  suffix: "s", prefix: "<", label: "Average load time", percent: 99, color: "#22d3ee" },
  { target: 4,  suffix: "Y", label: "Years of craft", percent: 80, color: "#34d399" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.05]">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(79,140,255,0.04) 0%, transparent 70%)" }} />

      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`group relative flex flex-col items-center justify-center py-16 lg:py-24 px-6 text-center border-white/[0.05] cursor-default
              ${idx < 3 ? "border-r" : ""} ${idx < 2 ? "border-b lg:border-b-0" : ""}`}
          >
            {/* Hover fill */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle at 50% 50%, ${s.color}08 0%, transparent 70%)` }}
            />

            {/* Arc ring container */}
            <div className="relative w-[140px] h-[140px] mb-4 flex items-center justify-center">
              <ArcRing percent={s.percent} color={s.color} size={140} />

              {/* Number */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  className="font-display font-bold tracking-tighter leading-none"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: s.color }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CountUp target={s.target} suffix={s.suffix} prefix={s.prefix} />
                </motion.div>
              </div>
            </div>

            <p className="text-xs tracking-[0.2em] text-white/30 uppercase font-semibold group-hover:text-white/50 transition-colors duration-300 max-w-[140px]">
              {s.label}
            </p>

            {/* Bottom accent line */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "40%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.12 + 0.4 }}
              style={{ backgroundColor: s.color, opacity: 0.4 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
