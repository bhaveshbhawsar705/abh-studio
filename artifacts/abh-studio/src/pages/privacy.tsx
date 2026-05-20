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

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy — ABH Studio";
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
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-white mb-4">Privacy Policy</h1>
          <p className="text-white/30 text-sm font-mono">Last updated: May 2025</p>
        </div>

        <div
          className="relative p-6 mb-12 text-sm text-white/50 font-light leading-relaxed"
          style={{ border: "1px solid rgba(79,140,255,0.15)", background: "rgba(79,140,255,0.04)" }}
        >
          ABH Studio ("we", "us", "our") is committed to protecting your personal information. This policy explains what we collect, why we collect it, and how we handle it.
        </div>

        <Section title="1. Who We Are">
          <p>ABH Studio is a digital agency based in India providing web development, social media management, and digital marketing services to clients worldwide. Our contact email is <a href="mailto:contact@abhstudio.in" className="text-blue-400/80 hover:text-blue-400 transition-colors">contact@abhstudio.in</a>.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information you voluntarily provide through our contact form:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>Your name</li>
            <li>Email address or phone number (whichever you choose to share)</li>
            <li>Project type and details you describe in your message</li>
          </ul>
          <p className="mt-3">We do not collect any information automatically beyond standard web server logs (IP address, browser type, pages visited), which are used solely for security and performance monitoring.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information you submit only to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>Respond to your enquiry or project request</li>
            <li>Communicate about a potential or ongoing engagement</li>
            <li>Send you relevant updates if you have explicitly requested them</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes. Ever.</p>
        </Section>

        <Section title="4. Data Storage & Security">
          <p>Contact form submissions are transmitted via encrypted email (TLS) directly to our team inbox. We do not store form submissions in a database. Emails are retained only as long as necessary for business correspondence and then deleted.</p>
          <p className="mt-3">We take reasonable technical precautions to protect your data, but no method of transmission over the internet is 100% secure.</p>
        </Section>

        <Section title="5. Your Rights (India — DPDP Act 2023)">
          <p>Under India's Digital Personal Data Protection Act 2023, you have the right to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct any inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:contact@abhstudio.in" className="text-blue-400/80 hover:text-blue-400 transition-colors">contact@abhstudio.in</a> and we will respond within 72 hours.</p>
        </Section>

        <Section title="6. International Users (GDPR)">
          <p>If you are located in the European Economic Area, you have additional rights under GDPR including the right to data portability and to lodge a complaint with your local supervisory authority. Our lawful basis for processing your data is your consent, given when you submit our contact form.</p>
        </Section>

        <Section title="7. Cookies">
          <p>This website does not use tracking cookies or analytics cookies. No third-party advertising pixels or trackers are loaded on this site.</p>
        </Section>

        <Section title="8. Third-Party Links">
          <p>Our website may contain links to external sites (e.g. WhatsApp). We are not responsible for the privacy practices of those sites and recommend reviewing their privacy policies separately.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this policy from time to time. The "last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance.</p>
        </Section>

        <Section title="10. Contact">
          <p>Questions about this policy? Reach us at <a href="mailto:contact@abhstudio.in" className="text-blue-400/80 hover:text-blue-400 transition-colors">contact@abhstudio.in</a> or via <a href="https://wa.me/919685743434" target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-400 transition-colors">WhatsApp</a>.</p>
        </Section>
      </div>
    </div>
  );
}
