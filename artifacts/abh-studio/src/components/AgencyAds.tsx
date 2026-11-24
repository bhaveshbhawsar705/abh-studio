import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Clock, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  Server,
  Terminal,
  Activity,
  Lock
} from "lucide-react";

const pillars = [
  {
    num: "01",
    title: "100% Asset Autonomy",
    subtitle: "Direct Partner Access — No Shady Logins",
    description:
      "We never ask you to use remote desktops (RDPs), VPS, or shady proxy logins. The ad account is assigned directly into your existing Meta Business Manager as a Partner Asset. You maintain 100% ownership of your Facebook Page, Custom Audiences, Pixel data, and CAPI server-side integrations.",
    icon: Lock,
    accent: "#4f8cff",
    badge: "Zero Security Risk"
  },
  {
    num: "02",
    title: "Zero Daily Spend Caps",
    subtitle: "Unrestricted Scale from Day 1",
    description:
      "Standard self-serve accounts handicap you with $50-$250/day limits that take months to lift. Our aged enterprise agency accounts have zero artificial daily spend ceilings. Scale from $500/day to $25,000+/day without hitting a brick wall.",
    icon: Zap,
    accent: "#f59e0b",
    badge: "Unlimited Scale"
  },
  {
    num: "03",
    title: "Flexible Postpaid Billing",
    subtitle: "Own Card Billing + 18% GST Bypass Options",
    description:
      "Attach your own credit card directly for postpaid threshold billing with zero prepayment or escrow risks. Choose between USD or INR currency billing rails, enabling Indian brands to legally bypass the 18% GST tax burden on Meta ad spend.",
    icon: CreditCard,
    accent: "#10b981",
    badge: "Zero Prepayment Risk"
  },
  {
    num: "04",
    title: "2-Hour Replacement SLA",
    subtitle: "Dedicated Enterprise Desk & Rapid Swaps",
    description:
      "Meta's bots make mistakes. If an account ever gets hit with an algorithmic false flag, our direct agency rep connection and dedicated technical desk provisions a fresh pre-warmed replacement within 2 hours. Your campaigns and pixel stay alive.",
    icon: Clock,
    accent: "#a78bfa",
    badge: "Guaranteed Uptime"
  },
  {
    num: "05",
    title: "Risk-Free 7-Day Pilot",
    subtitle: "Test Stability Before You Commit",
    description:
      "Prove our infrastructure on your own terms. Try our agency accounts for 7 days paying only your actual ad spend. If the stability, speed, and spend headroom don't exceed your expectations, walk away with zero lock-in contracts.",
    icon: ShieldCheck,
    accent: "#38bdf8",
    badge: "100% Risk Free"
  }
];

const comparisonData = [
  {
    feature: "Daily Spend Limit",
    standard: "Capped at $50 - $250 / day for weeks",
    enterprise: "Unrestricted Headroom from Day 1 ($50k+/day ready)",
    highlight: true
  },
  {
    feature: "Access Model",
    standard: "Fragile personal profile / risky RDP logins",
    enterprise: "100% Partner Asset directly inside YOUR BM",
    highlight: true
  },
  {
    feature: "Account Stability",
    standard: "Random algorithmic bans after 24–48 hours",
    enterprise: "Whitelisted Agency Tier with direct Meta Rep line",
    highlight: true
  },
  {
    feature: "Tax & Currency Options",
    standard: "Mandatory 18% GST on local cards",
    enterprise: "USD & INR options to legally optimize 18% GST",
    highlight: false
  },
  {
    feature: "Disruption Recovery",
    standard: "Bot appeals that take 2–4 weeks (or dead ends)",
    enterprise: "Guaranteed 2-Hour replacement SLA by our tech desk",
    highlight: true
  },
  {
    feature: "Pixel & Asset Ownership",
    standard: "Lost permanently when profile is banned",
    enterprise: "100% retained inside your original Business Manager",
    highlight: false
  }
];

export function AgencyAds() {
  const [activePillar, setActivePillar] = useState(0);

  function scrollToContact(projectType = "agency-ads") {
    const el = document.getElementById("contact");
    if (!el) return;
    const nav = document.querySelector("header");
    const navHeight = nav ? nav.getBoundingClientRect().height : 68;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - navHeight - 14,
      behavior: "smooth",
    });
  }

  return (
    <section id="ads" className="relative py-28 bg-[#030308] border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      {/* Background ambient glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none opacity-20 blur-[130px] rounded-full"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, #4f8cff 60%, transparent 100%)" }}
      />
      <div 
        className="absolute bottom-10 right-10 w-[500px] h-[300px] pointer-events-none opacity-15 blur-[120px] rounded-full"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 80%)" }}
      />

      <div className="w-full px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="text-xs tracking-[0.3em] text-amber-400/90 uppercase font-mono font-semibold">
              Discipline 04 • Ad Infrastructure
            </span>
            <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono">
              Whitelisted Meta Assets
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tighter text-white max-w-4xl leading-[1.08] mb-6"
          >
            HIGH-SPEND INFRASTRUCTURE.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              ZERO SPEND CAPS. ZERO DOWNTIME.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-white/60 max-w-2xl font-light leading-relaxed"
          >
            For high-growth D2C brands, e-commerce stores, and performance media buyers. We provision aged, whitelisted <strong className="text-white font-medium">Enterprise Meta Business Manager Accounts</strong> directly into your BM as a Partner Asset — giving you uncapped daily spend headroom, 100% asset autonomy, and uninterrupted momentum.
          </motion.p>
        </div>

        {/* Live Infrastructure Spec Card (Cyber Telemetry Preview) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl"
        >
          {/* Top telemetry bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">INFRASTRUCTURE STATUS</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-display font-semibold text-white">ENTERPRISE TIER 1 • ACTIVE PROVISIONING</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70">
                <span className="text-white/40 mr-1.5">DISPATCH SPEED:</span>
                <span className="text-amber-400 font-semibold">&lt; 60 MINS</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70">
                <span className="text-white/40 mr-1.5">REPLACEMENT SLA:</span>
                <span className="text-emerald-400 font-semibold">2 HOURS</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-xs text-white/40 font-mono uppercase block mb-1">Daily Spend Limit</span>
              <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">UNLIMITED</span>
              <span className="text-[11px] text-amber-400/90 font-mono block mt-1">No $50/day caps</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-xs text-white/40 font-mono uppercase block mb-1">Asset Ownership</span>
              <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">100% YOURS</span>
              <span className="text-[11px] text-emerald-400/90 font-mono block mt-1">Direct Partner BM Share</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-xs text-white/40 font-mono uppercase block mb-1">Card Billing</span>
              <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">POSTPAID</span>
              <span className="text-[11px] text-sky-400/90 font-mono block mt-1">Zero prepayment risk</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-xs text-white/40 font-mono uppercase block mb-1">Test Pilot</span>
              <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">7 DAYS</span>
              <span className="text-[11px] text-purple-400/90 font-mono block mt-1">Ad spend only • 0 lock-in</span>
            </div>
          </div>

          {/* Live System Log Snippet */}
          <div className="rounded-xl bg-[#080812] border border-white/[0.08] p-4 font-mono text-xs text-white/70 overflow-x-auto">
            <div className="flex items-center gap-2 mb-2 text-white/30 text-[11px] pb-2 border-b border-white/[0.05]">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>LIVE INFRASTRUCTURE DISPATCH TELEMETRY</span>
            </div>
            <div className="space-y-1.5 text-white/60">
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-white/40">[DISPATCH]</span>
                <span>Enterprise Agency Business Manager assigned to Partner ID</span>
                <span className="text-white/30 ml-auto hidden sm:inline">LATENCY: 42ms</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-white/40">[SECURITY]</span>
                <span>Direct Partner Asset linking — No RDP / Remote Desktop required</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-white/40">[CAPI SYNC]</span>
                <span>Client Pixel, Custom Conversions &amp; Event Deduplication verified</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-400">⚡</span>
                <span className="text-white/40">[SPEND_STATUS]</span>
                <span className="text-amber-300 font-semibold">Tier-1 Whitelist active • Uncapped daily headroom enabled</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* 5 Technical Standards / Value Pillars */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 mb-2 font-semibold">Architectural Rigor</p>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Enterprise Standards &amp; Guarantees
              </h3>
            </div>
            <p className="text-sm text-white/50 max-w-md font-light">
              Built for performance media buyers, agencies, and high-growth e-commerce brands who demand institutional-grade reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] p-7 transition-all duration-300 hover:border-amber-500/40 relative group flex flex-col justify-between"
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono text-white/30 font-semibold">
                        {pillar.num}
                      </span>
                      <span 
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full border bg-white/[0.03]"
                        style={{ borderColor: `${pillar.accent}30`, color: pillar.accent }}
                      >
                        {pillar.badge}
                      </span>
                    </div>

                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        backgroundColor: `${pillar.accent}12`, 
                        borderColor: `${pillar.accent}35`,
                        color: pillar.accent 
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="text-xl font-display font-bold text-white tracking-tight mb-1.5">
                      {pillar.title}
                    </h4>
                    <p className="text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
                      {pillar.subtitle}
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.05] flex items-center text-xs font-mono text-white/40 group-hover:text-amber-400 transition-colors">
                    <span>ENTERPRISE SPECIFIED</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              );
            })}

            {/* 6th Card: Fast Provisioning Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-7 relative flex flex-col justify-between group overflow-hidden"
            >
              <div 
                className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"
              />
              <div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 uppercase tracking-wider font-semibold inline-block mb-4">
                  Immediate Deployment
                </span>
                <h4 className="text-2xl font-display font-bold text-white tracking-tight mb-2">
                  Ready to test your 7-Day Pilot?
                </h4>
                <p className="text-sm text-white/70 leading-relaxed font-light mb-6">
                  Get your first whitelisted Agency Account provisioned into your Meta Business Manager within 60 minutes.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => scrollToContact("agency-ads")}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                >
                  Request Account Setup
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] font-mono text-white/40">
                  Pay only actual ad spend during 7-day test
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Self-Serve vs. ABH Enterprise Infrastructure Comparison Table */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40 font-semibold block mb-2">
              Architectural Showdown
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
              Self-Serve Accounts vs. ABH Enterprise
            </h3>
            <p className="text-sm text-white/50 font-light">
              Why high-volume media buyers migrate their entire ad infrastructure to our whitelisted agency seats.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.01]">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-white/40 w-1/3">
                    Evaluation Metric
                  </th>
                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-red-400/80 w-1/3">
                    Standard Self-Serve Accounts
                  </th>
                  <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-amber-400 w-1/3 bg-amber-500/[0.04]">
                    ABH Enterprise Infrastructure
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-sm">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-display font-semibold text-white/90">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-white/50 font-light flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
                      <span>{row.standard}</span>
                    </td>
                    <td className="py-4 px-6 text-white font-medium bg-amber-500/[0.03]">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className={row.highlight ? "text-amber-200" : "text-white/90"}>
                          {row.enterprise}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Bottom Banner / Onboarding Flow */}
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.03] to-purple-500/[0.05] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono text-amber-400 tracking-[0.25em] uppercase font-semibold block mb-3">
              ZERO RISK ONBOARDING
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight mb-4">
              Stop letting ad bans hold your business hostage.
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-light mb-8 leading-relaxed">
              We connect your Meta Business Manager to aged, whitelisted agency ad accounts with zero spend caps and 100% asset autonomy. Run your 7-day test pilot today.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => scrollToContact("agency-ads")}
                className="py-3.5 px-7 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-sm tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.98]"
              >
                Claim 7-Day Pilot Account
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href="https://wa.me/919893023434?text=Hi%20ABH%20Studio%2C%20I%20want%20to%20apply%20for%20an%20Enterprise%20Meta%20Agency%20Ad%20Account."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-display font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                Direct WhatsApp Desk
                <span className="text-emerald-400 text-xs">● Fast Response</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
