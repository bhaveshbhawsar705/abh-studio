import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from "framer-motion";

export function MagneticCTA() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 180, damping: 18, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 18, mass: 0.5 });

  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => {
      const vh = window.innerHeight;
      const contactSection = document.getElementById("contact");
      const contactTop = contactSection?.getBoundingClientRect().top ?? Infinity;
      const inContact = contactTop < vh * 0.6;
      setVisible(y > vh * 0.6 && !inContact);
    });
  }, [scrollY]);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const MAGNETIC_RADIUS = 120;
    const PULL_STRENGTH = 0.35;

    function onMouseMove(e: MouseEvent) {
      const rect = btn!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < MAGNETIC_RADIUS) {
        mouseX.set(dx * PULL_STRENGTH);
        mouseY.set(dy * PULL_STRENGTH);
        setIsHovered(true);
      } else {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
      }
    }

    function onMouseLeave() {
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="magnetic-cta"
          className="fixed bottom-8 right-8 z-[9990] pointer-events-none"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.a
            ref={buttonRef}
            href="#contact"
            className="pointer-events-auto relative flex items-center justify-center w-[110px] h-[110px] rounded-full select-none"
            style={{ x: springX, y: springY }}
            animate={{ scale: isHovered ? 1.12 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Outermost pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(79,140,255,0.25)" }}
              animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Mid pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(79,140,255,0.18)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />

            {/* Glow base */}
            <motion.span
              className="absolute inset-0 rounded-full"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "radial-gradient(circle, rgba(79,140,255,0.25) 0%, rgba(79,140,255,0.08) 60%, transparent 100%)",
                filter: "blur(4px)",
              }}
            />

            {/* Main circle */}
            <motion.span
              className="absolute inset-0 rounded-full border flex items-center justify-center"
              animate={{
                borderColor: isHovered ? "rgba(79,140,255,0.8)" : "rgba(79,140,255,0.35)",
                backgroundColor: isHovered ? "rgba(79,140,255,0.15)" : "rgba(79,140,255,0.07)",
                boxShadow: isHovered
                  ? "0 0 30px rgba(79,140,255,0.4), inset 0 0 20px rgba(79,140,255,0.1)"
                  : "0 0 18px rgba(79,140,255,0.2)",
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Rotating text ring */}
            <motion.svg
              viewBox="0 0 110 110"
              className="absolute inset-0 w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path
                  id="cta-circle"
                  d="M 55 55 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0"
                />
              </defs>
              <text
                fontSize="8.5"
                letterSpacing="3.2"
                fill="rgba(79,140,255,0.65)"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight="600"
              >
                <textPath href="#cta-circle">
                  START A PROJECT · LET'S TALK · ABH STUDIO ·{" "}
                </textPath>
              </text>
            </motion.svg>

            {/* Center arrow icon */}
            <motion.span
              className="relative z-10 flex items-center justify-center"
              animate={{
                x: isHovered ? 2 : 0,
                y: isHovered ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(79,140,255,0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </motion.span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
