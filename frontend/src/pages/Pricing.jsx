import { Link } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Magnetic from '../components/Magnetic.jsx';
import Faq from '../components/Faq.jsx';
import { Check, ArrowRight, Sparkles, Zap, Building2, Star, HelpCircle } from 'lucide-react';

const PLANS = [
  {
    name: 'Project', icon: Zap, tagline: 'For founders validating an idea',
    monthly: 2500, popular: false,
    features: [
      'Led end-to-end by James (sole engineer)',
      'Up to 2 active workstreams',
      'Web app or MVP build',
      'Weekly demos & reporting',
      'Cloud hosting setup',
      'Email support'
    ]
  },
  {
    name: 'Retainer', icon: Sparkles, tagline: 'For ongoing work with one engineer',
    monthly: 6500, popular: true,
    features: [
      'James as your dedicated engineer',
      'Unlimited prioritized workstreams',
      'Web, mobile & API',
      'Biweekly demos & roadmap',
      'CI/CD + monitoring',
      'Security & performance audits',
      'Priority support (24h)'
    ]
  },
  {
    name: 'Enterprise', icon: Building2, tagline: 'For orgs with complex needs',
    monthly: null, popular: false,
    features: [
      'James, with vetted specialist partners',
      'Architecture & integrations',
      'Senior advisory & code review',
      'SLA & compliance (SOC2 / GDPR)',
      'On-call & 24/7 support options',
      'Custom contracts & invoicing'
    ]
  }
];

const FAQ = [
  { q: 'How is pricing structured?', a: 'Engagements are monthly retainers so we can flex scope up or down as needed. Larger or fixed-scope work can be quoted as a custom project with its own contract and invoicing.' },
  { q: 'What does the free month mean?', a: 'Choosing annual billing gives you two months free — effectively pay for ten months and get twelve of dedicated engineering.' },
  { q: 'Can I change plans later?', a: 'Yes. You can upgrade, downgrade, or pause at the end of any billing cycle with no penalty.' },
  { q: 'Do you work fixed-scope / fixed-price?', a: 'Absolutely. For well-defined projects we provide a fixed quote after a short discovery call.' },
  { q: 'Who actually does the work?', a: 'Cowx Labs is a one-person studio led by James Cowx, a senior full-stack engineer. For specialized needs he brings in vetted partners under his direction.' },
  { q: 'Who owns the code?', a: 'You do. 100% of the source, infrastructure config and documentation is handed over and owned by you.' },
  { q: 'How fast can we start?', a: 'Typically within 1–2 weeks of a kickoff call, depending on current availability since all work is handled by a single engineer.' }
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const priceFor = (m) => {
    if (m == null) return 'Custom';
    const v = annual ? Math.round((m * 10) / 12) : m;
    return '$' + v.toLocaleString();
  };

  return (
    <div className="page">
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h1>Simple, <span className="text-gradient">transparent</span> pricing</h1>
            <p>Work directly with a senior engineer on a flexible retainer — or scope a fixed project. No hidden fees, cancel anytime.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="billing-toggle">
            <span className={!annual ? 'active' : ''}>Monthly</span>
            <button className={`toggle ${annual ? 'on' : ''}`} onClick={() => setAnnual(!annual)} aria-label="Toggle billing">
              <span className="toggle-knob" />
            </button>
            <span className={annual ? 'active' : ''}>Annual <em className="save-pill">2 months free</em></span>
          </div>
        </Reveal>

        <div className="pricing-grid">
          {PLANS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.name} delay={Math.min(i + 1, 3)}>
                <div className={`plan ${p.popular ? 'popular' : ''}`}>
                  {p.popular && <div className="plan-flag"><Star size={12} fill="currentColor" /> Most popular</div>}
                  <div className="plan-top">
                    <div className="plan-ic"><Icon size={22} /></div>
                    <div>
                      <h3>{p.name}</h3>
                      <p className="plan-tag">{p.tagline}</p>
                    </div>
                  </div>
                  <div className="plan-price">
                    <span className="amount">{priceFor(p.monthly)}</span>
                    {p.monthly != null && <span className="per">/mo{annual ? ' · billed yearly' : ''}</span>}
                  </div>
                  <Magnetic>
                    <Link to="/contact" className={`btn btn-lg btn-block ${p.popular ? 'btn-primary' : 'btn-outline'}`}>
                      {p.monthly == null ? 'Talk to sales' : 'Start with ' + p.name} <ArrowRight size={16} />
                    </Link>
                  </Magnetic>
                  <ul className="plan-features">
                    {p.features.map((f) => (
                      <li key={f}><Check size={16} className="ck" /> {f}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="cta-wrap" style={{ padding: '64px 0 0' }}>
            <div className="cta">
              <h2>Not sure which plan fits?</h2>
              <p>Tell us about your project and we'll recommend the right engagement model for your needs.</p>
              <div className="hero-actions">
                <Magnetic><Link to="/contact" className="btn btn-primary btn-lg">Get a free quote <ArrowRight size={18} /></Link></Magnetic>
                <Link to="/work" className="btn btn-outline btn-lg">See our work</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Pricing questions, answered</h2>
          </div>
        </Reveal>
        <Faq items={FAQ} />
      </section>
    </div>
  );
}
