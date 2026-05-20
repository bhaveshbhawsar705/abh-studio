import { useState, useEffect, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_HEIGHT = 64;

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ id: string; x: number; y: number } | null>(null);
  const rippleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", id: "services" },
    { name: "Process", id: "process" },
    { name: "Contact", id: "contact" },
  ];

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    smoothScrollTo(id);
    setActiveLink(id);

    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ id, x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (rippleTimer.current) clearTimeout(rippleTimer.current);
    rippleTimer.current = setTimeout(() => {
      setRipple(null);
      setActiveLink(null);
    }, 700);
  }

  function handleMobileNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTimeout(() => smoothScrollTo(id), 80);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-white/5 py-4" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="text-2xl font-display font-bold tracking-tighter text-white"
        >
          ABH<span className="text-primary">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;
            return (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 overflow-hidden py-1 px-1 select-none"
              >
                {/* Underline slide */}
                <motion.span
                  className="absolute bottom-0 left-0 h-px w-full origin-left"
                  style={{ backgroundColor: "var(--color-primary, #4f8cff)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Click ripple */}
                <AnimatePresence>
                  {ripple?.id === link.id && (
                    <motion.span
                      key="ripple"
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        transform: "translate(-50%, -50%)",
                        background: "rgba(79,140,255,0.35)",
                      }}
                      initial={{ width: 0, height: 0, opacity: 1 }}
                      animate={{ width: 80, height: 80, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Text with scale pop */}
                <motion.span
                  className="relative z-10"
                  animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {link.name}
                </motion.span>
              </a>
            );
          })}

          <Button
            className="rounded-full font-semibold px-6 tracking-wide"
            onClick={() => document.getElementById("contact-fields")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Start a Project
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full z-[60] flex flex-col"
            style={{
              backgroundColor: "#02020a",
              height: "100dvh",
              minHeight: "100vh",
            }}
          >
            {/* Subtle decorative gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(79,140,255,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 30% at 80% 100%, rgba(124,58,237,0.07) 0%, transparent 70%)",
              }}
            />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <span className="text-2xl font-display font-bold tracking-tighter text-white">
                ABH<span className="text-primary">.</span>
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Nav links */}
            <div className="relative z-10 flex flex-col flex-1 px-6 pt-8 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => handleMobileNavClick(e, link.id)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center justify-between py-5 border-b border-white/[0.06]"
                >
                  <span className="text-3xl font-display font-bold tracking-tighter text-white/80 group-active:text-white transition-colors">
                    {link.name}
                  </span>
                  <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/25 group-active:text-white group-active:border-white/30 transition-colors text-sm">
                    →
                  </span>
                </motion.a>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="relative z-10 px-6 pb-8 pt-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                className="w-full rounded-2xl py-6 text-base font-bold tracking-tight"
                onClick={() => { setMobileMenuOpen(false); setTimeout(() => document.getElementById("contact-fields")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }}
              >
                Start a Project →
              </Button>
              <p className="mt-3 text-center text-[11px] text-white/20">
                No commitment · Free discovery call
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
