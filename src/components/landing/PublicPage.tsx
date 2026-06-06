import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../seo";

type PageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  highlights: { title: string; text: string }[];
};

const pages: Record<string, PageContent> = {
  platform: {
    eyebrow: "TrueFin Platform",
    title: "One lending platform. Every team in sync.",
    intro: "Bring operations, field teams, borrower servicing, collections, and portfolio reporting into one secure source of truth.",
    highlights: [
      { title: "Portfolio Command Center", text: "Monitor repayment performance, NPA movement, disbursements, and portfolio health in real time." },
      { title: "Field Operations", text: "Give loan officers focused worklists, borrower histories, and frictionless collection tracking." },
      { title: "Borrower Experience", text: "Offer borrowers a clear mobile experience for EMI schedules, balances, and repayment history." },
    ],
  },
  "why-truefin": {
    eyebrow: "Why TrueFin",
    title: "Move beyond spreadsheets without adding complexity.",
    intro: "TrueFin replaces fragmented manual workflows with a reliable operating layer designed for growing  lenders.",
    highlights: [
      { title: "Immediate Visibility", text: "See missed EMIs, collection trends, and high-risk profiles without waiting for manual reports." },
      { title: "Operational Confidence", text: "Eliminate version conflicts and keep every team working from accurate, current information." },
      { title: "Faster Decisions", text: "Turn portfolio data into clear, actionable insights for leadership and field teams." },
    ],
  },
  security: {
    eyebrow: "Security & Compliance",
    title: "Trust is engineered into every layer.",
    intro: "Protect sensitive lending data with secure access controls, logical isolation, resilient infrastructure, and comprehensive audit trails.",
    highlights: [
      { title: "Data Isolation", text: "Keep every organization's data logically separated with controlled access and dedicated security policies." },
      { title: "Audit Readiness", text: "Maintain clear activity histories and reporting records for governance and regulatory requirements." },
      { title: "Deployment Control", text: "Choose managed cloud, private cloud, or on-premise infrastructure based on your data residency needs." },
    ],
  },
  about: {
    eyebrow: "About TrueFin",
    title: "Building clearer, faster lending operations.",
    intro: "TrueFin is focused on helping  financial institutions modernize borrower management and collections without losing operational control.",
    highlights: [
      { title: "Our Mission", text: "Make reliable financial operations technology accessible to every ambitious lending institution." },
      { title: "Our Approach", text: "Pair intuitive software with the workflows and realities of  lending teams." },
      { title: "Our Standard", text: "Build every feature around clarity, security, and measurable operational value." },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's modernize your lending operations.",
    intro: "Tell us about your portfolio, workflows, and growth goals. Our team will help you explore the right TrueFin setup.",
    highlights: [
      { title: "Product Demo", text: "See the complete lender, field officer, and borrower experience tailored to your use case." },
      { title: "Implementation Planning", text: "Discuss migration, deployment, integrations, and rollout requirements with our team." },
      { title: "General Enquiries", text: "Reach the TrueFin team at contact@truefin.in for product and partnership enquiries." },
    ],
  },
  support: {
    eyebrow: "Support",
    title: "Reliable support for critical financial operations.",
    intro: "Get guidance for platform access, borrower workflows, reporting, integrations, and operational questions.",
    highlights: [
      { title: "Platform Support", text: "Get help with account access, workflows, configuration, and product functionality." },
      { title: "Integration Support", text: "Work through API, payment gateway, and core system integration questions." },
      { title: "Priority Assistance", text: "Contact support@truefin.in for technical and operational support requests." },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro: "TrueFin is committed to handling personal and financial information responsibly, transparently, and securely.",
    highlights: [
      { title: "Data Collection", text: "We collect only the information required to provide, secure, and improve TrueFin services." },
      { title: "Data Protection", text: "We use access controls, encryption, monitoring, and operational safeguards to protect information." },
      { title: "Data Rights", text: "Organizations retain control over their data according to applicable agreements and regulations." },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    intro: "These terms establish the responsible use, availability, and service expectations for the TrueFin platform.",
    highlights: [
      { title: "Authorized Use", text: "The platform must be used only by authorized users for lawful financial operations." },
      { title: "Service Availability", text: "TrueFin works to provide reliable access, maintenance communication, and operational continuity." },
      { title: "Account Responsibility", text: "Customers are responsible for protecting credentials and managing authorized user access." },
    ],
  },
  compliance: {
    eyebrow: "Compliance",
    title: "Designed for accountable financial operations.",
    intro: "TrueFin provides the controls, records, and deployment flexibility needed to support regulated lending workflows.",
    highlights: [
      { title: "Comprehensive Logs", text: "Maintain traceable user and operational activity across critical platform workflows." },
      { title: "Controlled Access", text: "Apply role-based permissions to limit access according to team responsibilities." },
      { title: "Data Residency", text: "Support infrastructure choices aligned with organizational and regulatory requirements." },
    ],
  },
};

export const PublicPage = memo(function PublicPage({ page = "platform" }: { page?: string }) {
  const content = pages[page] || pages.platform;
  const { setSEO } = useSEO();

  useEffect(() => {
    setSEO({ title: content.title, description: content.intro, noindex: false });
  }, [content, setSEO]);

  return (
    <div className="tf-landing tf-public-page">
      <nav className="tf-nav">
        <div className="tf-container tf-nav-inner">
          <Link className="tf-brand" to="/"><img className="tf-brand-logo" src="/logo.webp" alt="" /><span>TrueFin</span></Link>
          <div className="tf-nav-links"><Link to="/platform">Platform</Link><Link to="/why-truefin">Why TrueFin</Link><Link to="/security">Security</Link></div>
          <div className="tf-nav-actions"><Link className="tf-button tf-button-ghost" to="/admin">Sign In</Link><Link className="tf-button tf-button-primary tf-nav-cta" to="/contact">Book a Demo</Link></div>
        </div>
      </nav>
      <main>
        <section className="tf-public-hero"><div className="tf-container"><span className="tf-section-tag">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p><div className="tf-public-actions"><Link className="tf-button tf-button-primary tf-button-large" to="/contact">Talk to our team</Link><Link className="tf-button tf-button-secondary tf-button-large" to="/">Back to home</Link></div></div></section>
        <section className="tf-section tf-public-content"><div className="tf-container"><div className="tf-public-grid">{content.highlights.map((item, index) => <article className="tf-glass-card" key={item.title}><span className="tf-public-number">0{index + 1}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></div></section>
        <section className="tf-cta"><div className="tf-container"><div className="tf-cta-panel"><span className="tf-cta-glow" /><div><span className="tf-section-tag tf-section-tag-light">TrueFin</span><h2>Ready for a clearer lending operation?</h2><p>See how the platform fits your team, portfolio, and growth plans.</p></div><Link className="tf-button tf-button-white tf-button-large" to="/contact">Book a Free Demo</Link></div></div></section>
      </main>
      <footer className="tf-footer"><div className="tf-container"><div className="tf-footer-grid"><div className="tf-footer-brand"><Link className="tf-brand" to="/"><img className="tf-brand-logo" src="/logo.webp" alt="" /><span>TrueFin</span></Link><p>The smart loan tracking infrastructure for modern  lenders.</p></div><div><h4>Product</h4><Link to="/platform">Platform</Link><Link to="/why-truefin">Why TrueFin</Link><Link to="/security">Security</Link></div><div><h4>Company</h4><Link to="/about">About Us</Link><Link to="/contact">Contact</Link><Link to="/support">Support</Link></div><div><h4>Legal</h4><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link><Link to="/compliance">Compliance</Link></div></div><div className="tf-footer-bottom"><span>© 2026 TrueFin Technology. All rights reserved.</span><span>Built for  lenders.</span></div></div></footer>
    </div>
  );
});

export default PublicPage;
