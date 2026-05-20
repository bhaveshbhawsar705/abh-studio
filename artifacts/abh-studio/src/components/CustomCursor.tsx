import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement;
      const cursor = window.getComputedStyle(el).cursor;
      setIsPointer(cursor === "pointer" || cursor === "text");
    };
    const hide = () => setIsHidden(true);
    const show = () => setIsHidden(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseenter", show);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseenter", show);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: isPointer ? 1.8 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.08 }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-white" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: pos.x - 3, y: pos.y - 3, opacity: isHidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 800, damping: 30, mass: 0.02 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>
    </>
  );
}
