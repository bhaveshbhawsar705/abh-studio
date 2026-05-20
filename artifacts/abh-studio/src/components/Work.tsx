import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/images/project-1.png";
import project2 from "@/assets/images/project-2.png";
import project3 from "@/assets/images/project-3.png";
import project4 from "@/assets/images/project-4.png";

const projects = [
  { title: "Aura Fintech", industry: "Finance", services: "Web App · UI/UX", year: "2024", image: project2, color: "rgba(79,140,255,0.15)" },
  { title: "Vanguard Studio", industry: "Architecture", services: "Portfolio · 3D WebGL", year: "2024", image: project1, color: "rgba(139,92,246,0.15)" },
  { title: "Lumina", industry: "Web3", services: "Landing Page · Branding", year: "2023", image: project3, color: "rgba(34,211,238,0.12)" },
  { title: "Nova Fashion", industry: "E-commerce", services: "Storefront · Headless CMS", year: "2023", image: project4, color: "rgba(251,146,60,0.12)" },
];

export function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-300vw"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="work">
      <div className="w-full px-6 lg:px-16 xl:px-24 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter">
            SELECTED <span className="text-white/20">WORKS</span>
          </h2>
          <a
            href="#contact"
            className="group flex items-center gap-2 text-sm font-semibold text-primary tracking-wider uppercase hover:text-white transition-colors"
          >
            Start your project <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Desktop: horizontal scroll */}
      <div ref={containerRef} className="relative hidden lg:block" style={{ height: "350vh", position: "relative" }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          <div className="relative flex-1 overflow-hidden">
            <motion.div
              style={{ x, width: "400vw" }}
              className="absolute top-0 left-0 h-full flex"
            >
              {projects.map((p, idx) => (
                <div
                  key={idx}
                  className="w-[100vw] h-full px-6 lg:px-16 py-8 flex items-center gap-8"
                  data-testid={`project-card-${idx}`}
                >
                  <div className="group relative w-[55%] h-[70%] overflow-hidden shrink-0 cursor-pointer">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
                      style={{ background: p.color }}
                    />
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/10 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                        <ArrowUpRight className="w-7 h-7 text-background" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[70%] py-4">
                    <div>
                      <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-semibold block mb-4">
                        {String(idx + 1).padStart(2, "0")} / {projects.length}
                      </span>
                      <h3 className="text-5xl xl:text-6xl font-display font-bold tracking-tighter mb-3 text-white leading-none">
                        {p.title}
                      </h3>
                      <p className="text-white/40 text-lg font-light">{p.services}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-3 py-1.5 border border-white/10 text-white/50 tracking-widest uppercase font-medium">
                        {p.industry}
                      </span>
                      <span className="text-xs text-white/25 font-mono">{p.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="px-6 lg:px-16 py-5 border-t border-white/[0.05] flex items-center gap-6 shrink-0">
            <span className="text-xs text-white/25 tracking-widest uppercase font-mono">Scroll to explore</span>
            <div className="flex-1 h-[1px] bg-white/[0.06] relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 h-full bg-primary" style={{ width: progressWidth }} />
            </div>
            <span className="text-xs text-white/25 font-mono">{projects.length} projects</span>
          </div>
        </div>
      </div>

      {/* Mobile: vertical grid */}
      <div className="lg:hidden px-6 py-8 grid grid-cols-1 gap-8">
        {projects.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden aspect-[4/3] mb-4">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-background/40">
                <ArrowUpRight className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-display font-bold mb-1">{p.title}</h3>
                <p className="text-white/40 text-sm">{p.services}</p>
              </div>
              <span className="text-xs px-2 py-1 border border-white/10 text-white/40">{p.industry}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
