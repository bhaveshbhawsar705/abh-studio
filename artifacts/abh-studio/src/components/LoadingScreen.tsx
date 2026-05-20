import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

function ScrambleText({ text }: { text: string }) {
  const [output, setOutput] = useState(
    () => text.replace(/[^\s]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      setOutput(
        text.split("").map((char, idx) => {
          if (char === " ") return char;
          if (frame > idx * 2 + 10) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      frame++;
      if (frame > text.length * 2 + 18) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);

  return <>{output}</>;
}

interface LoadingScreenProps {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    const startTime = Date.now();
    const MIN_DURATION = 2000;

    let fake = 0;
    const ticker = setInterval(() => {
      fake += Math.random() * 4 + 1.5;
      if (fake >= 88) { fake = 88; clearInterval(ticker); }
      setProgress(Math.min(fake, 88));
    }, 35);

    const finish = () => {
      if (doneRef.current) return;
      const remaining = Math.max(0, MIN_DURATION - (Date.now() - startTime));
      setTimeout(() => {
        doneRef.current = true;
        clearInterval(ticker);
        setProgress(100);
        setTimeout(() => setVisible(false), 400);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      setTimeout(finish, 3000);
    }

    return () => { clearInterval(ticker); window.removeEventListener("load", finish); };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          exit={{ y: "-100%", transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#070710" }}
        >
          {/* Static CSS grid — no JS, no re-render cost */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(79,140,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(79,140,255,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />

          {/* Orbs — pure CSS animation, no framer-motion, no blur re-renders */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                top: "15%", left: "30%",
                width: 500, height: 500,
                background: "radial-gradient(circle, rgba(79,140,255,0.13) 0%, transparent 65%)",
                transform: "translate(-50%, -50%)",
                filter: "blur(40px)",
                animationDuration: "3s",
              }}
            />
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                top: "75%", right: "8%",
                width: 320, height: 320,
                background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 65%)",
                filter: "blur(35px)",
                animationDuration: "4s",
                animationDelay: "1s",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center w-full px-8">
            {/* Status label */}
            <div className="flex items-center gap-2 mb-10">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "rgb(79,140,255)", animationDuration: "1.5s" }}
              />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: "rgb(79,140,255)" }}>
                Initializing
              </span>
            </div>

            {/* Main wordmark */}
            <div className="flex items-end gap-5 mb-14 select-none">
              <span
                className="font-bold leading-none text-white"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(4rem, 14vw, 11rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.9,
                }}
              >
                <ScrambleText text="ABH" />
              </span>
              <span
                className="font-bold leading-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(4rem, 14vw, 11rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.9,
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.22)",
                }}
              >
                <ScrambleText text="STUDIO" />
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Loading Experience
                </span>
                <span className="text-[10px] font-mono font-semibold tabular-nums" style={{ color: "rgba(79,140,255,0.7)" }}>
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="w-full h-px relative overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: "linear-gradient(90deg, rgba(79,140,255,0.7), rgba(139,92,246,0.9), rgba(79,140,255,1))" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-y-0 w-24"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)", left: 0 }}
                  animate={{ x: ["-96px", `${Math.max(progress * 4, 20)}px`] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear", repeatDelay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Footer tag */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: "rgba(255,255,255,0.12)" }}>
              ABH Studio — Digital Agency
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
