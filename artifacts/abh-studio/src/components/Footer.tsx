import { motion } from "framer-motion";
import { Link } from "wouter";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-background border-t border-white/[0.05]" id="contact-end">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(79,140,255,0.08) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 px-6 lg:px-16 xl:px-24 pt-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16 border-b border-white/[0.05] pb-16">
          <div className="max-w-sm">
            <p className="text-xs tracking-[0.3em] text-primary/60 uppercase font-semibold mb-4">Ready to build?</p>
            <h3 className="text-3xl lg:text-4xl font-display font-bold tracking-tighter text-white mb-6 leading-tight">
              Let's build something you're actually proud of.
            </h3>
            <a
              href="mailto:contact@abhstudio.in"
              className="group inline-flex items-center gap-3 text-primary text-lg font-semibold hover:text-white transition-colors duration-300"
              data-testid="footer-email-link"
            >
              contact@abhstudio.in
              <span className="w-6 h-6 rounded-full border border-primary/30 group-hover:border-white/30 flex items-center justify-center text-xs transition-colors duration-300">→</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-16">
            <div>
              <p className="text-xs tracking-[0.25em] text-white/25 uppercase font-semibold mb-5">Navigate</p>
              <ul className="flex flex-col gap-3">
                {["Services", "Process", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-white/50 hover:text-white text-sm font-medium transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] text-white/25 uppercase font-semibold mb-5">Contact</p>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="mailto:contact@abhstudio.in"
                    className="text-white/50 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    contact@abhstudio.in
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919685743434?text=Hi%20ABH%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/50 hover:text-[#25d366] text-sm font-medium transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className="shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.997l6.305-1.654A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.002-1.368l-.358-.214-3.724.977.993-3.634-.234-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                    </svg>
                    WhatsApp us
                  </a>
                </li>
                <li>
                  <span className="text-white/20 text-sm">Based in India · Worldwide</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="font-display font-bold tracking-tighter leading-none text-transparent select-none"
              style={{
                fontSize: "clamp(5rem, 20vw, 18rem)",
                WebkitTextStroke: "1px rgba(255,255,255,0.06)",
              }}
            >
              ABH
            </div>
            <div
              className="font-display font-bold tracking-tighter leading-none text-white select-none"
              style={{ fontSize: "clamp(5rem, 20vw, 18rem)", opacity: 0.04 }}
            >
              STUDIO
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <p className="font-mono">© {year} ABH Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
