import { useEffect } from "react";
import { Link } from "wouter";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/[0.06] pb-10 mb-10 last:border-0 last:pb-0 last:mb-0">
      <h2 className="text-lg font-display font-bold tracking-tight text-white mb-4">{title}</h2>
      <div className="space-y-3 text-white/50 text-sm font-light leading-relaxed">{children}</div>
    </div>
  );
}

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service — ABH Studio";
    return () => { document.title = "ABH STUDIO — Web Development & Digital Agency"; };
  }, []);

  return (
    <div className="bg-[#02020a] min-h-screen text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24 lg:py-32">

        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-white/30 hover:text-white/60 transition-colors mb-16 uppercase">
          ← Back to ABH Studio
        </Link>

        <div className="mb-16">
          <p className="text-xs font-mono tracking-[0.3em] text-blue-400/60 uppercase mb-4">Legal</p>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-white mb-4">Terms of Service</h1>
          <p className="text-white/30 text-sm font-mono">Last updated: May 2025</p>
        </div>

        <div
          className="relative p-6 mb-12 text-sm text-white/50 font-light leading-relaxed"
          style={{ border: "1px solid rgba(79,140,255,0.15)", background: "rgba(79,140,255,0.04)" }}
        >
          By accessing this website or engaging ABH Studio for services, you agree to these terms. Please read them carefully. If you do not agree, do not use this site or our services.
        </div>

        <Section title="1. About ABH Studio">
          <p>ABH Studio is a digital agency based in India offering web development, social media management, and digital marketing services. References to "we", "us", or "our" mean ABH Studio. "You" or "client" refers to any individual or entity that engages our services or uses this website.</p>
        </Section>

        <Section title="2. Services">
          <p>We provide custom digital services scoped and agreed upon in writing before work begins. The specific deliverables, timelines, and pricing for each engagement are defined in a separate project agreement, proposal, or invoice exchanged between you and ABH Studio.</p>
          <p className="mt-3">We reserve the right to decline any project at our discretion, including projects that conflict with our values or capacity.</p>
        </Section>

        <Section title="3. Payments">
          <p>Payment terms are agreed per project. Unless stated otherwise:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>A deposit (typically 50%) is required before work begins</li>
            <li>The remaining balance is due before final delivery or go-live</li>
            <li>Late payments may result in work being paused until cleared</li>
          </ul>
          <p className="mt-3">All prices are in Indian Rupees (INR) unless explicitly stated otherwise. We are not currently GST-registered; if this changes, it will be reflected in updated invoices.</p>
        </Section>

        <Section title="4. Intellectual Property">
          <p>Upon receipt of full payment, you own all deliverables created specifically for your project (design files, code, content). ABH Studio retains the right to display the work in our portfolio unless you request otherwise in writing before the project begins.</p>
          <p className="mt-3">We retain ownership of any proprietary frameworks, tools, or methodologies used in delivering the work — you receive a licence to use the final output, not the underlying tools.</p>
          <p className="mt-3">Third-party assets (fonts, stock imagery, plugins) are subject to their own licences, which we will communicate to you as part of the project handover.</p>
        </Section>

        <Section title="5. Client Responsibilities">
          <p>You agree to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>Provide accurate briefs, content, and feedback in a timely manner</li>
            <li>Ensure you have the rights to any content or assets you provide to us</li>
            <li>Not use our deliverables for any unlawful, harmful, or deceptive purpose</li>
            <li>Keep login credentials and access details secure</li>
          </ul>
        </Section>

        <Section title="6. Revisions & Scope">
          <p>Each project includes a defined number of revision rounds as agreed upfront. Requests that fall outside the agreed scope will be scoped and quoted separately. We will always notify you before proceeding with out-of-scope work.</p>
        </Section>

        <Section title="7. Warranties & Liability">
          <p>We deliver our work with professional care and skill. However, we do not guarantee specific business outcomes (traffic, revenue, rankings) as these depend on many factors outside our control.</p>
          <p className="mt-3">To the maximum extent permitted by law, ABH Studio's total liability for any claim arising from our services is limited to the amount you paid us for the specific project in question.</p>
          <p className="mt-3">We are not liable for losses arising from third-party platforms, hosting outages, client-side changes, or circumstances beyond our reasonable control.</p>
        </Section>

        <Section title="8. Termination">
          <p>Either party may terminate an engagement with 14 days written notice. In the event of termination:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>You pay for all work completed up to the termination date</li>
            <li>Deposits are non-refundable once work has begun</li>
            <li>We will deliver all completed work in a handover package</li>
          </ul>
        </Section>

        <Section title="9. Governing Law">
          <p>These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in India.</p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>We may update these terms at any time. The "last updated" date above reflects the current version. Continued use of our services after changes constitutes acceptance.</p>
        </Section>

        <Section title="11. Contact">
          <p>Questions about these terms? Email us at <a href="mailto:contact@abhstudio.in" className="text-blue-400/80 hover:text-blue-400 transition-colors">contact@abhstudio.in</a> or reach out via <a href="https://wa.me/919685743434" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-400 transition-colors">WhatsApp</a>.</p>
        </Section>
      </div>
    </div>
  );
}
