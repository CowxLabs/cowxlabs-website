import { Link } from 'react-router-dom';
import api from '../api.js';
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { Helmet } from 'react-helmet-async';
import CountUp from '../components/CountUp.jsx';
import Magnetic from '../components/Magnetic.jsx';
import Tilt from '../components/Tilt.jsx';
import Spotlight from '../components/Spotlight.jsx';
import RotatingWords from '../components/RotatingWords.jsx';
import Logo from '../components/Logo.jsx';
import {
  Code2, Cloud, ShieldCheck, BarChart3, Cpu, GitBranch, ArrowRight,
  CheckCircle2, Zap, Database, Lock, Search, PenTool, Rocket, Gauge, Star
} from 'lucide-react';

const FEATURES = [
  { icon: Code2, title: 'Custom Software', desc: 'Web, mobile and desktop apps engineered around your exact workflows — no compromises.' },
  { icon: Cloud, title: 'Cloud Infrastructure', desc: 'Scalable, resilient cloud architecture on AWS, GCP and Azure with zero-downtime deploys.' },
  { icon: ShieldCheck, title: 'Security First', desc: 'Threat modeling, encryption and audits baked into every layer of your stack.' },
  { icon: BarChart3, title: 'Data & Analytics', desc: 'Turn raw data into dashboards and pipelines that drive real decisions.' },
  { icon: Cpu, title: 'AI & Automation', desc: 'Intelligent features and workflow automation that save your team hours every week.' },
  { icon: GitBranch, title: 'DevOps & CI/CD', desc: 'Fast, reliable delivery with automated testing, monitoring and rollbacks.' }
];

const STEPS = [
  { icon: Search, title: 'Discover', desc: 'Workshops, audits and a roadmap so we solve the right problem first.' },
  { icon: PenTool, title: 'Design', desc: 'UX, architecture and clickable prototypes validated with your team.' },
  { icon: Code2, title: 'Build', desc: 'Agile sprints with weekly demos and shippable increments.' },
  { icon: Rocket, title: 'Launch & Operate', desc: 'Zero-downtime deploy, monitoring and continuous improvement.' }
];

const TECH = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'Tailwind'];

export default function Home() {
  const [services, setServices] = useState([]);
  useEffect(() => { api.get('/services').then((r) => setServices(r.data)).catch(() => {}); }, []);

  return (
    <>
      <Helmet>
        <title>Cowx Labs — Custom Software Development & Cloud Engineering | Vancouver, BC</title>
        <meta name="description" content="Cowx Labs builds custom software, cloud infrastructure & AI solutions. Vancouver-based engineering studio delivering enterprise-grade apps, DevOps, and digital transformation." />
        <link rel="canonical" href="https://www.cowxlabs.com" />
      </Helmet>
      <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-ring r1" aria-hidden="true" />
        <div className="hero-ring r2" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-pill fadeUp">
            <span className="dot" /> Software solutions, end to end
            <span className="pill-sep" />
            <span className="pill-live"><span className="live-dot" /> Accepting projects</span>
          </div>
          <h1 className="fadeUp fadeUp-d1">
            We build software that<br /><span className="accent">powers your <RotatingWords words={['business.', 'team.', 'users.', 'future.']} /></span>
          </h1>
          <p className="lead fadeUp fadeUp-d2">
            From web apps to cloud infrastructure, we deliver reliable, scalable
            solutions engineered for performance — and built to last.
          </p>
          <div className="hero-actions fadeUp fadeUp-d3">
            <Magnetic><Link to="/contact" className="btn btn-primary btn-lg btn-glow">Start a project <ArrowRight size={18} /></Link></Magnetic>
            <Link to="/work" className="btn btn-outline btn-lg btn-glass">See our work</Link>
          </div>
          <div className="hero-trust fadeUp fadeUp-d4">
            <div className="ht-item"><Star size={14} fill="currentColor" /> 5.0 client rating</div>
            <div className="ht-item"><CheckCircle2 size={14} /> 120+ projects shipped</div>
            <div className="ht-item"><Zap size={14} /> Avg. 2-week kickoff</div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual glass-panel">
            <div className="hero-visual-bar">
              <i /><i /><i />
              <span className="hv-title">cowxlabs · production</span>
              <span className="hv-status"><span className="live-dot" /> live</span>
            </div>
            <div className="hero-visual-body">
              <div className="hv-card float-card fc1">
                <div className="ic"><Zap size={18} /></div>
                <h4>Deploy pipeline</h4>
                <p>Automated builds shipping to production in minutes.</p>
                <div className="hv-bar"><span style={{ width: '92%' }} /></div>
                <div className="hv-meta">v2.4.1 · 14s ago</div>
              </div>
              <div className="hv-card float-card fc2">
                <div className="ic"><Database size={18} /></div>
                <h4>Data layer</h4>
                <p>Replicated, encrypted, always available storage.</p>
                <div className="hv-bar"><span style={{ width: '78%' }} /></div>
                <div className="hv-meta">3 regions · healthy</div>
              </div>
              <div className="hv-card float-card fc3">
                <div className="ic"><Lock size={18} /></div>
                <h4>Security</h4>
                <p>Zero-trust access with full audit trails.</p>
                <div className="hv-bar"><span style={{ width: '100%' }} /></div>
                <div className="hv-meta">0 incidents · 30d</div>
              </div>
            </div>
            <div className="hv-feed">
              <span className="feed-item"><span className="fi-dot ok" /> deploy succeeded</span>
              <span className="feed-item"><span className="fi-dot" /> latency 42ms</span>
              <span className="feed-item"><span className="fi-dot ok" /> tests 148/148</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">What we do</span>
            <h2>Engineering for teams that need more than off-the-shelf</h2>
            <p>Full-service product development — strategy, design, build and operate, under one roof.</p>
          </div>
        </Reveal>
        <div className="grid grid-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={Math.min(i + 1, 5)}>
                <Tilt max={7}>
                  <Spotlight>
                    <div className="feature">
                      <div className="feature-icon"><Icon size={24} /></div>
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                      <span className="feature-link">Learn more <ArrowRight size={14} /></span>
                    </div>
                  </Spotlight>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-band">
        <div className="stat-grid">
          <Reveal><div className="stat">
            <div className="stat-value"><CountUp end={120} suffix="+" /></div>
            <div className="stat-label">Projects delivered</div>
          </div></Reveal>
          <Reveal delay={1}><div className="stat">
            <div className="stat-value"><CountUp end={40} suffix="+" /></div>
            <div className="stat-label">Clients served</div>
          </div></Reveal>
          <Reveal delay={2}><div className="stat">
            <div className="stat-value"><CountUp end={99.9} suffix="%" decimals={1} /></div>
            <div className="stat-label">Uptime target</div>
          </div></Reveal>
          <Reveal delay={3}><div className="stat">
            <div className="stat-value"><CountUp end={15} suffix="yr" /></div>
            <div className="stat-label">Combined experience</div>
          </div></Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">How we work</span>
            <h2>From idea to production, without the chaos</h2>
            <p>A clear, repeatable process that keeps you informed at every step.</p>
          </div>
        </Reveal>
        <div className="process">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={Math.min(i + 1, 4)}>
                <div className="process-step">
                  <div className="ps-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ps-ic"><Icon size={22} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Tech we trust</span>
            <h2>Built on a modern, proven stack</h2>
            <p>We pick tools for reliability and velocity — not hype.</p>
          </div>
        </Reveal>
        <div className="tech-grid">
          {TECH.map((t, i) => (
            <Reveal key={t} delay={Math.min(i + 1, 6)}>
              <div className="tech-badge">{t}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Services</span>
            <h2>A complete toolkit for modern software</h2>
            <p>Pick a single engagement or let us run the whole roadmap.</p>
          </div>
        </Reveal>
        <div className="grid" style={{ gap: 14 }}>
          {services.slice(0, 4).map((s, i) => {
            const IconMap = { code: Code2, cloud: Cloud, chart: BarChart3, compass: Cpu, shield: ShieldCheck };
            const Icon = IconMap[s.icon] || Code2;
            return (
              <Reveal key={s.id} delay={Math.min(i + 1, 4)}>
                <div className="svc-row">
                  <div className="ic"><Icon size={22} /></div>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--muted)' }} />
                </div>
              </Reveal>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/services" className="btn btn-outline btn-lg">View all services <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* ESTIMATOR */}
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Project estimator</span>
            <h2>Get a rough budget in 10 seconds</h2>
            <p>No email required — just a ballpark so you can plan.</p>
          </div>
        </Reveal>
        <Estimator />
      </section>

      {/* CTA */}
      <section className="cta-wrap">
        <Reveal>
          <div className="cta">
            <span className="eyebrow" style={{ display: 'inline-block', marginBottom: 16 }}><CheckCircle2 size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} /> Let's build</span>
            <h2>Ready to build something great?</h2>
            <p>Tell us about your project and we'll get back within one business day.</p>
            <div className="hero-actions">
              <Magnetic><Link to="/contact" className="btn btn-primary btn-lg">Get in touch <ArrowRight size={18} /></Link></Magnetic>
              <Link to="/about" className="btn btn-outline btn-lg">About us</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
    </>
  );
}

function Estimator() {
  const [type, setType] = useState('web');
  const [features, setFeatures] = useState(8);
  const [design, setDesign] = useState(true);
  const [speed, setSpeed] = useState('balanced');

  const base = { web: 9000, mobile: 14000, ai: 20000, cloud: 7000 }[type];
  const speedMult = { relaxed: 0.85, balanced: 1, fast: 1.3 }[speed];
  const raw = (base + features * 1400 + (design ? 4500 : 0)) * speedMult;
  const low = Math.round((raw * 0.85) / 500) * 500;
  const high = Math.round((raw * 1.3) / 500) * 500;
  const weeks = Math.max(3, Math.round(4 + features * 0.7 + (speed === 'fast' ? -2 : speed === 'relaxed' ? 3 : 0)));

  const TypeOpts = [['web', 'Web app'], ['mobile', 'Mobile'], ['ai', 'AI / Data'], ['cloud', 'Cloud']];
  const SpeedOpts = [['relaxed', 'Relaxed'], ['balanced', 'Balanced'], ['fast', 'Fast']];

  return (
    <div className="estimator">
      <div className="est-controls">
        <div className="est-field">
          <label>Project type</label>
          <div className="est-seg">
            {TypeOpts.map((o) => (
              <button key={o[0]} className={type === o[0] ? 'on' : ''} onClick={() => setType(o[0])}>{o[1]}</button>
            ))}
          </div>
        </div>
        <div className="est-field">
          <label>Scope — about <strong>{features}</strong> features</label>
          <input type="range" min="3" max="20" value={features} onChange={(e) => setFeatures(+e.target.value)} />
          <div className="est-scale"><span>Small</span><span>Large</span></div>
        </div>
        <div className="est-field">
          <label>Timeline</label>
          <div className="est-seg">
            {SpeedOpts.map((o) => (
              <button key={o[0]} className={speed === o[0] ? 'on' : ''} onClick={() => setSpeed(o[0])}>{o[1]}</button>
            ))}
          </div>
        </div>
        <div className="est-field est-toggle-row">
          <label className="switch">
            <input type="checkbox" checked={design} onChange={(e) => setDesign(e.target.checked)} />
            <span className="switch-track"><span className="switch-knob" /></span>
            Include UX &amp; design
          </label>
        </div>
      </div>
      <div className="est-output">
        <div className="est-range">
          <span className="est-from">${low.toLocaleString()}</span>
          <span className="est-dash">–</span>
          <span className="est-to">${high.toLocaleString()}</span>
        </div>
        <div className="est-sub">estimated project investment</div>
        <div className="est-weeks"><Gauge size={16} /> ~{weeks} weeks to launch</div>
        <Magnetic>
          <Link to="/contact" className="btn btn-primary btn-lg btn-block">Get a precise quote <ArrowRight size={16} /></Link>
        </Magnetic>
        <p className="est-note">Indicative only. Final scope and price confirmed after a discovery call.</p>
      </div>
    </div>
  );
}
