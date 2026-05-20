import { useEffect, useState, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScrollProgress } from "@/components/ScrollProgress";

const Services = lazy(() => import("@/components/Services").then(m => ({ default: m.Services })));
const HorizontalShowcase = lazy(() => import("@/components/HorizontalShowcase").then(m => ({ default: m.HorizontalShowcase })));
const Why = lazy(() => import("@/components/Why").then(m => ({ default: m.Why })));
const Process = lazy(() => import("@/components/Process").then(m => ({ default: m.Process })));
const Stats = lazy(() => import("@/components/Stats").then(m => ({ default: m.Stats })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import("@/components/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const PrivacyPolicy = lazy(() => import("@/pages/privacy"));
const TermsOfService = lazy(() => import("@/pages/terms"));

const WA_NUMBER = "919685743434";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hi%20ABH%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20project.`;

function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-5 z-50 flex items-center justify-center w-13 h-13 rounded-full shadow-lg transition-all duration-300 ease-out ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
      }`}
      style={{
        width: 52,
        height: 52,
        background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
        boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
      }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: "rgba(37,211,102,0.3)", animationDuration: "2s" }}
      />
      {/* WhatsApp icon */}
      <svg viewBox="0 0 24 24" fill="white" width="26" height="26" className="relative z-10">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.997l6.305-1.654A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.002-1.368l-.358-.214-3.724.977.993-3.634-.234-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
      </svg>
    </a>
  );
}

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight * 0.7;
      const pastHero = window.scrollY > heroHeight;
      const contact = document.getElementById("contact");
      const contactTop = contact?.getBoundingClientRect().top ?? Infinity;
      const inContact = contactTop < window.innerHeight * 0.75;
      setVisible(pastHero && !inContact);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        onClick={() => document.getElementById("contact-fields")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="flex items-center gap-2 rounded-full py-2.5 px-5 font-display font-semibold text-sm tracking-tight active:scale-95 transition-transform whitespace-nowrap"
        style={{
          background: "rgba(124,58,237,0.15)",
          border: "1px solid rgba(124,58,237,0.45)",
          color: "#c4b5fd",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(124,58,237,0.2)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#a78bfa" }}
        />
        Let's talk
        <span className="text-xs opacity-70">→</span>
      </button>
    </div>
  );
}

function useIsPointerDevice() {
  const [isPointer, setIsPointer] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(pointer: fine)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const handler = (e: MediaQueryListEvent) => setIsPointer(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isPointer;
}

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/30 selection:text-white">
      <Navigation />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Services />
          <HorizontalShowcase />
          <Why />
          <Process />
          <Stats />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const isPointer = useIsPointerDevice();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen onDone={() => setLoaded(true)} />
        {loaded && <ScrollProgress />}
        {isPointer && <CustomCursor />}
        {loaded && <StickyMobileCTA />}
        <WhatsAppButton />
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          {loaded && <Router />}
        </WouterRouter>
        <Toaster theme="dark" richColors position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
