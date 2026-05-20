import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SPOTS_REMAINING = 2;
const BOOKING_MONTH = "June";
const TOTAL_SLOTS = 4;

function useSpotsCounter(target: number, delay = 1800) {
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactMethod: z.enum(["email", "phone"]),
  email: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters"),
}).superRefine((data, ctx) => {
  if (data.contactMethod === "email") {
    if (!data.email || !z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid email address", path: ["email"] });
    }
  } else {
    if (!data.phone || data.phone.replace(/\D/g, "").length < 7) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid phone number", path: ["phone"] });
    }
  }
});

type FormValues = z.infer<typeof formSchema>;

function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let lastTime = 0;
    const SCALE = 0.25; // draw at ¼ resolution — 16× fewer pixels
    const FPS = 10;     // noise doesn't need 60fps
    const INTERVAL = 1000 / FPS;
    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;
      if (!canvas || !ctx) return;
      const w = Math.max(1, Math.ceil(canvas.offsetWidth * SCALE));
      const h = Math.max(1, Math.ceil(canvas.offsetHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      const imageData = ctx.createImageData(w, h);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 10;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function GridLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[0]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(79,140,255,0.04)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function FloatingOrb({ x, y, size, color, blur, delay }: { x: string; y: string; size: number; color: string; blur: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: x, top: y, width: size, height: size,
        background: color, filter: `blur(${blur}px)`,
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function GlowInput({ label, placeholder, error, className, ...props }: React.ComponentProps<typeof Input> & { label: string; error?: string }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative group">
      <label className={`absolute left-0 transition-all duration-300 pointer-events-none z-10 font-mono text-xs tracking-[0.25em] uppercase ${
        focused || hasValue ? "-top-5 text-[10px] text-blue-400/80" : "top-3 text-white/25"
      }`}>
        {label}
      </label>

      <div className={`relative border-b transition-all duration-500 ${focused ? "border-blue-400" : "border-white/10"}`}>
        <Input
          placeholder={focused ? "" : ""}
          className={`${className} bg-transparent border-0 border-none shadow-none ring-0 focus-visible:ring-0 h-11 rounded-none text-white placeholder:text-white/0 font-light text-sm px-0 pb-2`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); }}
          onChange={(e) => { setHasValue(!!e.target.value); if (props.onChange) props.onChange(e); }}
          {...props}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 pointer-events-none"
          animate={{ width: focused ? "100%" : "0%", opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {focused && (
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] w-12 bg-white/60 rounded-full blur-sm pointer-events-none"
            animate={{ x: ["0%", "calc(100vw - 48px)", "0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400/80 text-[10px] mt-1 font-mono">
          ✗ {error}
        </motion.p>
      )}
    </div>
  );
}

function GlowTextarea({ label, error, className, ...props }: React.ComponentProps<typeof Textarea> & { label: string; error?: string }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative group">
      <label className={`absolute left-0 transition-all duration-300 pointer-events-none z-10 font-mono text-xs tracking-[0.25em] uppercase ${
        focused || hasValue ? "-top-5 text-[10px] text-blue-400/80" : "top-3 text-white/25"
      }`}>
        {label}
      </label>

      <div className={`relative border-b transition-all duration-500 mt-1 ${focused ? "border-blue-400" : "border-white/10"}`}>
        <Textarea
          className={`${className} bg-transparent border-0 shadow-none ring-0 focus-visible:ring-0 min-h-[100px] resize-none rounded-none text-white placeholder:text-white/0 font-light text-sm px-0 pb-2`}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); }}
          onChange={(e) => { setHasValue(!!e.target.value); if (props.onChange) props.onChange(e); }}
          {...props}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 pointer-events-none"
          animate={{ width: focused ? "100%" : "0%", opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400/80 text-[10px] mt-1 font-mono">
          ✗ {error}
        </motion.p>
      )}
    </div>
  );
}

function LaunchButton({ isSubmitting, sent }: { isSubmitting: boolean; sent: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  function spawnParticles() {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 50,
      y: 50,
      angle: (i / 20) * 360,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);
  }

  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={isSubmitting || sent}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={spawnParticles}
      className="relative w-full h-14 overflow-hidden group disabled:cursor-not-allowed"
      style={{ background: "transparent" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ background: hovered
          ? "linear-gradient(135deg, #3b5bff 0%, #7c3aed 50%, #3b5bff 100%)"
          : "linear-gradient(135deg, #1e3aff 0%, #5b21b6 50%, #1e3aff 100%)"
        }}
        transition={{ duration: 0.4 }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: hovered ? "100% 100%" : "0% 0%" }}
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
        transition={{ duration: 0.6 }}
      />

      {hovered && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      <motion.div
        className="absolute inset-0 rounded-none"
        animate={{ boxShadow: hovered
          ? "0 0 30px rgba(59,91,255,0.5), 0 0 60px rgba(59,91,255,0.2), inset 0 0 20px rgba(255,255,255,0.05)"
          : "0 0 0px rgba(59,91,255,0)"
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 flex items-center justify-center gap-3 h-full">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.span key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
              <span className="text-green-300">✓</span> Message Sent
            </motion.span>
          ) : isSubmitting ? (
            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white">
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Transmitting...
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-3">
              <motion.span animate={{ x: hovered ? [0, 4, 0] : 0 }} transition={{ duration: 0.5, repeat: hovered ? Infinity : 0 }}>
                ⟶
              </motion.span>
              Initiate Contact
              <motion.span animate={{ x: hovered ? [0, 4, 0] : 0 }} transition={{ duration: 0.5, repeat: hovered ? Infinity : 0, delay: 0.1 }}>
                ⟶
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-white pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * 80,
            y: Math.sin((p.angle * Math.PI) / 180) * 80,
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </button>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="h-px bg-gradient-to-r from-blue-400/60 to-transparent"
        initial={{ width: 0 }}
        whileInView={{ width: 40 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
      <span className="text-[10px] font-mono tracking-[0.4em] text-blue-400/70 uppercase">{text}</span>
    </div>
  );
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { count, loaded } = useSpotsCounter(SPOTS_REMAINING);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const orb1X = useTransform(smoothX, [0, 1], [-40, 40]);
  const orb1Y = useTransform(smoothY, [0, 1], [-30, 30]);
  const orb2X = useTransform(smoothX, [0, 1], [30, -30]);
  const orb2Y = useTransform(smoothY, [0, 1], [20, -20]);
  const ghostX = useTransform(smoothX, [0, 1], [-20, 20]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", contactMethod: "email", email: "", phone: "", projectType: "", message: "" },
  });

  const contactMethod = form.watch("contactMethod");

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Something went wrong");
      toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
      setSent(true);
      form.reset();
    } catch {
      toast.error("Failed to send", { description: "Please email us at contact@abhstudio.in" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#02020a] overflow-hidden flex flex-col justify-center py-24 border-t border-white/[0.04] scroll-mt-16"
    >
      <GridLines />
      <NoiseCanvas />

      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute pointer-events-none z-[2]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloatingOrb x="-15%" y="10%" size={700} color="radial-gradient(circle, rgba(59,91,255,0.12) 0%, transparent 70%)" blur={60} delay={0} />
      </motion.div>
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute pointer-events-none z-[2]"
      >
        <FloatingOrb x="60%" y="50%" size={500} color="radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)" blur={50} delay={2} />
      </motion.div>
      <FloatingOrb x="80%" y="-10%" size={300} color="radial-gradient(circle, rgba(59,200,255,0.08) 0%, transparent 70%)" blur={40} delay={1} />

      <motion.div
        style={{ x: ghostX }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3] select-none overflow-hidden"
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-[18vw] font-black font-display tracking-tighter leading-none text-white/[0.018] whitespace-nowrap"
          style={{ WebkitTextStroke: "1px rgba(79,140,255,0.06)" }}
        >
          CONTACT
        </motion.span>
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 h-full w-px pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(59,91,255,0.2), transparent)" }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full w-px pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.2), transparent)" }}
        animate={{ opacity: [0.8, 0.3, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div id="contact-form" className="relative z-10 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto w-full scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          {/* ── Spots urgency banner ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="relative inline-flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 px-5 py-3.5 rounded-xl border overflow-hidden"
              style={{ borderColor: "rgba(251,146,60,0.3)", background: "rgba(251,146,60,0.05)" }}
            >
              {/* Sweep glow */}
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(251,146,60,0.08) 50%, transparent 100%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              />

              {/* Left: dot + label */}
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-50" style={{ animationDuration: "1.8s" }} />
                  <span className="relative w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgb(251,146,60)" }}>
                  {BOOKING_MONTH} Availability
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-4 bg-white/10" />

              {/* Spots count */}
              <div className="flex items-center gap-3 relative z-10">
                <AnimatePresence mode="wait">
                  {!loaded ? (
                    <motion.span key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-mono text-white/20">
                      Checking availability…
                    </motion.span>
                  ) : (
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="text-sm font-semibold text-white/80">
                      <span className="text-amber-400 font-black text-base tabular-nums">{count}</span>
                      {" "}of {TOTAL_SLOTS} spots remaining this month
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Capacity blocks */}
                <AnimatePresence>
                  {loaded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex gap-1"
                    >
                      {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.45 + i * 0.07, type: "spring", stiffness: 400, damping: 22 }}
                          className="w-4 h-4 rounded-sm origin-bottom"
                          style={{
                            backgroundColor: i < (TOTAL_SLOTS - SPOTS_REMAINING)
                              ? "rgba(251,146,60,0.85)"
                              : "rgba(255,255,255,0.08)",
                            boxShadow: i < (TOTAL_SLOTS - SPOTS_REMAINING)
                              ? "0 0 6px rgba(251,146,60,0.5)"
                              : "none",
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <SectionLabel text="Transmission channel open" />
          <div className="mt-6 flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none">
              <span className="text-white">LET'S</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #4f8cff 0%, #a78bfa 50%, #60cdff 100%)" }}
              >
                CREATE.
              </span>
            </h2>
            <div className="flex flex-col gap-3 md:text-right max-w-xs">
              <div className="flex items-center gap-2 md:justify-end">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-mono text-emerald-400/80 tracking-widest uppercase">Signal Active</span>
              </div>
              <p className="text-sm text-white/35 font-light leading-relaxed">
                Have a project in mind? Tell us what you're building. We'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </motion.div>

        <span id="contact-fields" className="block" style={{ scrollMarginTop: "80px" }} />
        {/* Mobile-only info strip */}
        <div className="flex lg:hidden items-center gap-3 mb-8 flex-wrap">
          <a
            href="mailto:contact@abhstudio.in"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-blue-400 transition-colors"
            style={{ border: "1px solid rgba(79,140,255,0.18)", background: "rgba(79,140,255,0.05)" }}
          >
            <span className="text-base">✉</span>
            contact@abhstudio.in
          </a>
          <a
            href="https://wa.me/919685743434?text=Hi%20ABH%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ border: "1px solid rgba(37,211,102,0.3)", background: "rgba(37,211,102,0.07)", color: "#25d366" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.997l6.305-1.654A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.002-1.368l-.358-.214-3.724.977.993-3.634-.234-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            WhatsApp
          </a>
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/40"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-base">◎</span>
            Remote — Worldwide
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex lg:col-span-2 flex-col space-y-10"
          >
            <div className="space-y-6">
              {[
                {
                  icon: "✉",
                  label: "Direct Line",
                  value: "contact@abhstudio.in",
                  href: "mailto:contact@abhstudio.in",
                  color: "rgba(79,140,255,0.15)",
                  borderColor: "rgba(79,140,255,0.2)",
                },
                {
                  icon: "◎",
                  label: "Location",
                  value: "Remote — Worldwide",
                  href: null,
                  color: "rgba(124,58,237,0.12)",
                  borderColor: "rgba(124,58,237,0.2)",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  whileHover={{ x: 6 }}
                  className="group flex items-center gap-4 cursor-default"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center text-lg flex-shrink-0 border transition-all duration-300 group-hover:scale-110"
                    style={{ background: item.color, borderColor: item.borderColor }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.3em] text-white/25 uppercase mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} data-testid="contact-email" className="text-sm font-medium text-white/80 hover:text-blue-400 transition-colors duration-300">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-white/80">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden"
              style={{ border: "1px solid rgba(59,91,255,0.15)", background: "rgba(59,91,255,0.04)" }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(59,91,255,0.8), transparent)" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="p-6 space-y-3">
                <p className="text-[10px] font-mono tracking-[0.3em] text-blue-400/60 uppercase">Typical Response</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">24</span>
                  <span className="text-sm text-white/40 font-mono">hrs</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(to right, #3b5bff, #7c3aed)" }}
                    animate={{ width: ["0%", "75%"] }}
                    transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="text-[11px] text-white/30">Faster than your competitor even starts</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-3 relative"
          >
            <div className="relative" style={{
              background: "linear-gradient(135deg, rgba(59,91,255,0.04) 0%, rgba(124,58,237,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-blue-400/40" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-violet-400/40" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-violet-400/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-blue-400/40" />

              <motion.div
                className="absolute top-0 left-6 right-6 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(59,91,255,0.4), rgba(124,58,237,0.4), transparent)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="p-5 sm:p-8 md:p-10">
                <div className="flex items-center gap-2 mb-8">
                  <motion.div className="w-2 h-2 rounded-full bg-red-400/70" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <motion.div className="w-2 h-2 rounded-full bg-yellow-400/70" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-green-400/70" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                  <span className="text-[10px] font-mono text-white/20 ml-2 tracking-widest">NEW_PROJECT.init</span>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <GlowInput label="Name" error={fieldState.error?.message} data-testid="input-name" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Contact method toggle + field */}
                      <div className="space-y-3">
                        {/* Toggle pill */}
                        <div className="relative inline-flex rounded-full p-0.5 gap-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {(["email", "phone"] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => form.setValue("contactMethod", method, { shouldValidate: false })}
                              className="relative z-10 px-4 py-1 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 rounded-full"
                              style={{ color: contactMethod === method ? "#fff" : "rgba(255,255,255,0.3)" }}
                            >
                              {contactMethod === method && (
                                <motion.div
                                  layoutId="contact-method-pill"
                                  className="absolute inset-0 rounded-full"
                                  style={{ background: "linear-gradient(135deg, rgba(59,91,255,0.7) 0%, rgba(124,58,237,0.7) 100%)" }}
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              <span className="relative z-10">{method}</span>
                            </button>
                          ))}
                        </div>

                        {/* Animated field swap — pt-6 gives floating label room to rise without hitting the toggle */}
                        <div className="relative pt-6">
                          <AnimatePresence mode="wait" initial={false}>
                            {contactMethod === "email" ? (
                              <motion.div
                                key="email"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field, fieldState }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <GlowInput label="Email address" error={fieldState.error?.message} type="email" data-testid="input-email" {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="phone"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <FormField
                                  control={form.control}
                                  name="phone"
                                  render={({ field, fieldState }) => (
                                    <FormItem className="space-y-0">
                                      <FormControl>
                                        <GlowInput label="Phone number" error={fieldState.error?.message} type="tel" data-testid="input-phone" {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-0">
                          <label className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 block mb-3">Service</label>
                          <div className="relative border-b border-white/10">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger
                                  className="bg-transparent border-0 shadow-none ring-0 focus:ring-0 h-11 rounded-none text-white/70 px-0 text-sm font-light"
                                  data-testid="select-project-type"
                                >
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#080812] border border-white/10 rounded-none backdrop-blur-xl">
                                {["Web Development", "Social Media Management", "Digital Marketing", "Full Digital Package"].map((s, i) => (
                                  <SelectItem key={i} value={s.toLowerCase().replace(/ /g, "-")} className="text-white/70 hover:text-white font-light text-sm">
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {fieldState.error && (
                            <p className="text-red-400/80 text-[10px] mt-1 font-mono">✗ {fieldState.error.message}</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <GlowTextarea label="Project Details" error={fieldState.error?.message} data-testid="textarea-message" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <LaunchButton isSubmitting={isSubmitting} sent={sent} />
                      <p className="text-center text-[10px] font-mono text-white/20 mt-3 tracking-widest">
                        END-TO-END ENCRYPTED · NO SPAM · EVER
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
