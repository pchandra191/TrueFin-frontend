import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../utilities/utilities";
import { DashboardPreview } from "./DashboardPreview";

const workflow = [
  { icon: "bar_chart", step: "01", title: "Lender Admin Panel", target: "Operations Heads", desc: "Manage workflows, monitor overall NPA %, and view top-level financial analytics in real-time." },
  { icon: "group", step: "02", title: "Loan Officer Dashboard", target: "Field Agents", desc: "Log borrower interactions, track assigned lists, and upload KYC documents seamlessly from the field." },
  { icon: "smartphone", step: "03", title: "Borrower Portal", target: "End-Consumers", desc: "Simplified mobile interface to track EMIs, view remaining balances, and make payments via OTP verification." },
];

const audiences = [
  { icon: "account_balance", title: "Regional Micro-NBFCs", desc: "Managing portfolios under ₹50 Cr. Lightweight, affordable, and perfectly scaled for emerging lenders." },
  { icon: "public", title: "Microfinance Institutions (MFI)", desc: "Handling deep rural and semi-urban outreach. Works on low bandwidth with offline-first field agent tools." },
  { icon: "layers", title: "Fintech Lenders & P2P Platforms", desc: "Clean alternative data dashboards. Seamless API integrations for digital-first lending operations." },
];

const security = [
  { icon: "lock", title: "Bank-Grade Data Isolation", desc: "Every tenant operates in a logically isolated environment with dedicated encryption keys and access controls." },
  { icon: "cloud", title: "Seamless API Integrations", desc: "Connect with your existing core banking systems, Aadhaar, CKYC, and payment gateways through secure RESTful APIs." },
  { icon: "storage", title: "Private Infrastructure Options", desc: "Deploy on your own cloud instances or on-premise servers with full control over data residency." },
];

export const LandingPage = memo(function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="tf-landing">
      <nav className="tf-nav">
        <div className="tf-container tf-nav-inner">
          <Link className="tf-brand" to="/" aria-label="TrueFin home">
            <img className="tf-brand-logo" src="/favicon-32x32.png" alt="" />
            <span>TrueFin</span>
          </Link>
          <div className="tf-nav-links">
            <Link to="/platform">Platform</Link>
            <Link to="/why-truefin">Why TrueFin</Link>
            <Link to="/security">Security</Link>
          </div>
          <div className="tf-nav-actions">
            <button className="tf-button tf-button-ghost" onClick={() => navigate("/admin")}>Sign In</button>
            <button className="tf-button tf-button-primary tf-nav-cta" onClick={() => navigate("/contact")}>Book a Demo <Icon name="arrow_forward" /></button>
          </div>
        </div>
      </nav>

      <main>
        <section className="tf-hero">
          <div className="tf-container tf-hero-grid">
            <div className="tf-hero-copy">
              <div className="tf-eyebrow">
                <Icon name="auto_awesome" filled /> Built for modern lending teams
              </div>
              <h1>The Smart Loan Tracking &amp; Management Infrastructure for <span>Modern  Lenders.</span></h1>
              <p>Move away from chaotic spreadsheets. Centralize your borrower tracking, collection insights, and loan management on a single, secure, and intuitive dashboard built for agile NBFCs and financial providers.</p>
              <div className="tf-hero-actions">
                <button className="tf-button tf-button-primary tf-button-large" onClick={() => navigate("#demo")}>Book a Free Demo</button>
                <button className="tf-button tf-button-secondary tf-button-large" onClick={() => navigate("/admin")}>Sign In</button>
              </div>
              <div className="tf-trust-row">
                <span><Icon name="security" filled /> Bank-grade security</span>
                <span><Icon name="insights" filled /> Real-time insights</span>
                <span><Icon name="cloud" filled /> Private deployment ready</span>
              </div>
            </div>

            <div className="tf-dashboard-wrap" aria-label="TrueFin dashboard preview">
              <DashboardPreview />
            </div>
          </div>
          <div className="tf-container tf-stats">
            <div><strong>₹500Cr+</strong><span>Portfolio managed</span></div>
            <div><strong>50K+</strong><span>Active borrowers</span></div>
            <div><strong>99.9%</strong><span>Uptime SLA</span></div>
            <div><strong>10x</strong><span>Faster reporting</span></div>
          </div>
        </section>

        <section className="tf-section tf-workflow" id="workflow">
          <div className="tf-container">
            <header className="tf-section-header">
              <span className="tf-section-tag">One connected platform</span>
              <h2>Three-tier architecture for <span>complete control</span></h2>
              <p>Designed for every stakeholder in your lending lifecycle, from head office to the borrower.</p>
            </header>
            <div className="tf-workflow-grid">
              {workflow.map((item) => (
                <article className="tf-glass-card tf-workflow-card" key={item.step}>
                  <div className="tf-card-topline">
                    <span className="tf-icon-box"><Icon name={item.icon} /></span>
                    <span>{item.step}</span>
                  </div>
                  <p className="tf-card-kicker">For {item.target}</p>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="tf-card-link">Explore capabilities <Icon name="arrow_forward" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tf-section tf-why" id="why-truefin">
          <div className="tf-container">
            <div className="tf-split-heading">
              <header className="tf-section-header tf-section-header-left">
                <span className="tf-section-tag tf-section-tag-light">Why TrueFin</span>
                <h2>Stop fighting <span>spreadsheet chaos.</span></h2>
              </header>
              <p>Replace fragmented Excel-based processes with one reliable operating layer your entire lending team can trust.</p>
            </div>
            <div className="tf-comparison-grid">
              <article className="tf-comparison-card tf-comparison-old">
                <div className="tf-comparison-title">
                  <span><Icon name="warning" filled /></span>
                  <div>
                    <small>The Excel way</small>
                    <h3>Manual. Fragmented. Reactive.</h3>
                  </div>
                </div>
                <ul>
                  {["Manual data entry errors costing lakhs annually", "Delayed ledger syncs with 2-3 day lag", "No real-time visibility into missed EMIs", "Version conflicts and file corruption risks", "Difficult to generate audit-ready reports"].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="tf-comparison-card tf-comparison-new">
                <div className="tf-comparison-title">
                  <span><Icon name="auto_awesome" filled /></span>
                  <div>
                    <small>The TrueFin way</small>
                    <h3>Connected. Visible. In control.</h3>
                  </div>
                </div>
                <ul>
                  {["Eliminate manual data entry errors", "Real-time automatic repayment history updates", "Instant overview of missed EMIs and high-risk profiles", "Centralized, always-updated single source of truth", "One-click compliance and audit reports"].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="tf-highlight-grid">
              <div>
                <span className="tf-icon-box"><Icon name="storage" /></span>
                <strong>Zero Data Loss</strong>
                <p>Automatic daily backups on bank-grade infrastructure.</p>
              </div>
              <div>
                <span className="tf-icon-box"><Icon name="insights" /></span>
                <strong>10x Faster Reporting</strong>
                <p>Generate portfolio reports in minutes, not hours.</p>
              </div>
              <div>
                <span className="tf-icon-box"><Icon name="verified_user" /></span>
                <strong>Audit Ready</strong>
                <p>Comprehensive logs built for regulatory requirements.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tf-section tf-audience">
          <div className="tf-container">
            <header className="tf-section-header">
              <h2>Designed around the realities of <span>modern lending.</span></h2>
              <p>Flexible enough for growing portfolios, powerful enough for sophisticated financial operations.</p>
            </header>
            <div className="tf-audience-grid">
              {audiences.map((item) => (
                <article className="tf-audience-card" key={item.title}>
                  <span className="tf-icon-box"><Icon name={item.icon} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tf-section tf-security" id="security">
          <div className="tf-container tf-security-grid">
            <div className="tf-security-copy">
              <span className="tf-section-tag tf-section-tag-light">Trust by design</span>
              <h2>Enterprise-grade security, without the enterprise complexity.</h2>
              <p>TrueFin is built to meet the rigorous standards banks and regulated financial institutions demand.</p>
              <div className="tf-security-proof">
                <Icon name="verified_user" filled />
                <span>
                  <strong>Secure by default</strong>
                  <small>Encryption, isolation, and full audit trails across the platform.</small>
                </span>
              </div>
            </div>
            <div className="tf-security-list">
              {security.map((item) => (
                <article key={item.title}>
                  <span className="tf-icon-box"><Icon name={item.icon} /></span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tf-cta" id="demo">
          <div className="tf-container">
            <div className="tf-cta-panel">
              <span className="tf-cta-glow" />
              <div>
                <span className="tf-section-tag tf-section-tag-light">Ready to modernize lending?</span>
                <h2>Turn operational complexity into a competitive advantage.</h2>
                <p>See how TrueFin can bring clarity, speed, and confidence to your lending operations.</p>
              </div>
              <Link className="tf-button tf-button-white tf-button-large" to="/contact">Book a Free Demo <Icon name="arrow_forward" /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="tf-footer">
        <div className="tf-container">
          <div className="tf-footer-grid">
            <div className="tf-footer-brand">
              <Link className="tf-brand" to="/">
                <img className="tf-brand-logo" src="/favicon-32x32.png" alt="" />
                <span>TrueFin</span>
              </Link>
              <p>The smart loan tracking infrastructure for modern  lenders.</p>
            </div>
            <div>
              <h4>Product</h4>
              <Link to="/platform">Platform</Link>
              <Link to="/why-truefin">Why TrueFin</Link>
              <Link to="/security">Security</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/support">Support</Link>
            </div>
            <div>
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/compliance">Compliance</Link>
            </div>
          </div>
          <div className="tf-footer-bottom">
            <span>© 2026 TrueFin Technology. All rights reserved.</span>
            <span>Built for  lenders.</span>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default LandingPage;
