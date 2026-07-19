import { Link } from 'react-router-dom';
import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Tilt from '../components/Tilt.jsx';
import Spotlight from '../components/Spotlight.jsx';
import { ArrowUpRight, Globe, Smartphone, Cloud, Bitcoin, Cpu, ArrowRight, ExternalLink, Github } from 'lucide-react';

const CATS = [
  { id: 'all', label: 'All work' },
  { id: 'web', label: 'Web Apps' },
  { id: 'desktop', label: 'Desktop Apps' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'security', label: 'Security & Privacy' }
];

const ICONS = { web: Globe, desktop: Cpu, crypto: Bitcoin, security: Cloud };

const PROJECTS = [
  {
    name: 'VoidTorrent', client: 'James Cowx', cat: 'web', icon: 'web',
    summary: 'Privacy-first torrent client with built-in VPN kill switch, darknet/I2P support and granular bandwidth controls.',
    tags: ['Next.js', 'TypeScript', 'Rust', 'WebTorrent', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [{ value: 'I2P', label: 'darknet support' }, { value: 'AES', label: 'peer encryption' }],
    siteUrl: 'https://jamescowx.github.io/voidtorrent/',
    sourceUrl: 'https://github.com/jamescowx/voidtorrent',
    caseStudy: {
      challenge: 'Most mainstream torrent clients trade privacy for convenience — no kill switch, no darknet routing, and opaque peer encryption. Power users needed a client that treated anonymity as a first-class feature without sacrificing a clean, cross-platform UI.',
      approach: 'Built a modern client on Next.js + TypeScript with a Rust core for the networking layer. Integrated a VPN kill switch that severs all traffic if the tunnel drops, added encrypted P2P connections, and wired in I2P/darknet routing alongside automatic tracker discovery and sequential downloading.',
      outcome: 'Delivered a performant, anonymity-first client with comprehensive bandwidth controls and a polished UI. VoidTorrent ships as a complete product highlighting deep full-stack and systems-level engineering.'
    }
  },
  {
    name: 'CowxCrypto', client: 'James Cowx', cat: 'crypto', icon: 'crypto',
    summary: 'Real-time crypto market intelligence with live prices, buy/sell signal detection and whale trade tracking.',
    tags: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [{ value: 'Live', label: 'BTC/ETH pricing' }, { value: 'Real-time', label: 'whale tracking' }],
    siteUrl: 'https://cowxcrypto.onrender.com/',
    sourceUrl: 'https://github.com/JamesCowx/CowxCrypto',
    caseStudy: {
      challenge: 'Crypto traders were drowning in noisy dashboards and slow, unreliable price feeds. They needed fast, signal-rich market intelligence that cut through the clutter.',
      approach: 'Engineered a Node.js + TypeScript data pipeline feeding a React dashboard, backed by PostgreSQL and Redis for low-latency caching. Built market-cap and dominance views, top gainers/losers, trending coins, plus algorithmic buy/sell signal detection and whale-trade monitoring.',
      outcome: 'Shipped a real-time market intelligence platform that gives traders the signals they need without the noise — demonstrating end-to-end product thinking from data ingestion to UX.'
    }
  },
  {
    name: 'CowxWallet', client: 'James Cowx', cat: 'crypto', icon: 'crypto',
    summary: 'Self-custody crypto wallet with multi-chain support, transaction history and real-time portfolio valuation.',
    tags: ['Next.js', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [{ value: 'Multi', label: 'chain support' }, { value: 'Real-time', label: 'portfolio value' }],
    siteUrl: 'https://cowxwallet.vercel.app/',
    sourceUrl: 'https://cowxwallet.vercel.app/',
    caseStudy: {
      challenge: 'Self-custody is intimidating. Existing wallets were either too technical or too opaque about what was happening with users’ assets. The goal was to make secure self-custody approachable without compromising control.',
      approach: 'Designed and built a Next.js + React wallet supporting multiple blockchain networks, with a clear transaction history and live portfolio valuations. Focused relentlessly on security and usability so that first-time users could manage digital assets confidently.',
      outcome: 'CowxWallet makes self-custody accessible while keeping users fully in control of their keys — a strong example of security-conscious product design.'
    }
  },
  {
    name: 'CowxCode', client: 'James Cowx', cat: 'desktop', icon: 'desktop',
    summary: 'Open-source, provider-agnostic AI coding agent with a polished Electron desktop app for Windows.',
    tags: ['JavaScript', 'TypeScript', 'Electron', 'Node.js', 'Python', 'CSS'],
    metrics: [{ value: 'Local', label: 'AI agent' }, { value: 'OSS', label: 'provider-agnostic' }],
    siteUrl: 'https://jamescowx.github.io/cowxcode/',
    sourceUrl: 'https://github.com/JamesCowx/cowxcode',
    caseStudy: {
      challenge: 'Developers wanted a sharp local AI coding assistant without vendor lock-in, but most tools were cloud-only or tied to a single provider. Windows users in particular lacked a polished native option.',
      approach: 'Built CowxCode as an open-source agent that runs locally and is provider-agnostic — supporting OpenAI, Anthropic, Google, Ollama and more. Architected a modular core agent engine behind a black/grey/red themed Electron desktop app, paired with a marketing site.',
      outcome: 'Shipped a capable, locally-run coding agent that developers can trust and extend. It showcases systems architecture, desktop app engineering, and a real open-source release process.'
    }
  },
  {
    name: 'CowxPass', client: 'James Cowx', cat: 'security', icon: 'security',
    summary: 'Zero-knowledge password manager with AES-256-GCM encryption, cross-device sync and dark web breach monitoring.',
    tags: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [{ value: 'AES-256', label: 'GCM encryption' }, { value: 'Zero', label: 'knowledge architecture' }],
    siteUrl: 'https://cowxpass-u48k.onrender.com/',
    sourceUrl: 'https://github.com/JamesCowx/cowxpass',
    caseStudy: {
      challenge: 'Password managers are only as trustworthy as their encryption model. Users needed serious security — zero-knowledge by design — without the bloat and lock-in of legacy providers.',
      approach: 'Built CowxPass so every password is encrypted with AES-256-GCM before it leaves the device; a zero-knowledge architecture means even the server cannot read user data. Added cloud sync, one-click autofill, a cryptographically random password generator, secure notes, and dark web breach monitoring.',
      outcome: 'Delivered a clean, genuinely secure password manager that proves deep security engineering — encryption, sync, and threat monitoring — can be built simply and transparently.'
    }
  }
];

export default function Work() {
  const [cat, setCat] = useState('all');
  const [active, setActive] = useState(null);
  const shown = cat === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === cat);
  const activeProject = active ? PROJECTS.find((p) => p.name === active) : null;

  return (
    <div className="page">
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Our work</span>
            <h1>Products James has <span className="text-gradient">shipped</span></h1>
            <p>Real, production products built end-to-end by James Cowx — spanning privacy tooling, crypto, AI, and security.</p>
          </div>
        </Reveal>

        <div className="work-tabs">
          {CATS.map((c) => (
            <button key={c.id} className={`tab ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          {shown.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <Reveal key={p.name} delay={Math.min(i + 1, 4)}>
                <Tilt max={7}>
                  <Spotlight>
                    <div className="project">
                      <div className="project-top">
                        <div className="project-ic"><Icon size={20} /></div>
                        <span className="project-cat">{CATS.find((c) => c.id === p.cat).label}</span>
                      </div>
                      <h3>{p.name}</h3>
                      <p className="project-sum">{p.summary}</p>
                      <div className="proj-tags">
                        {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                      </div>
                      <div className="project-metrics">
                        {p.metrics.map((m) => (
                          <div className="metric" key={m.label}>
                            <div className="metric-v">{m.value}</div>
                            <div className="metric-l">{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <button className="project-link" onClick={() => setActive(p.name)}>
                        Read case study <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </Spotlight>
                </Tilt>
              </Reveal>
            );
          })}
        </div>

        {activeProject && (
          <div className="modal-overlay" onClick={() => setActive(null)}>
            <div className="modal case-study" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setActive(null)} aria-label="Close">×</button>
              <div className="cs-head">
                <div>
                  <span className="eyebrow">{CATS.find((c) => c.id === activeProject.cat).label}</span>
                  <h2>{activeProject.name}</h2>
                  <p>{activeProject.summary}</p>
                </div>
              </div>
              <div className="cs-tags">
                {activeProject.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="cs-body">
                <div className="cs-block">
                  <h4>The challenge</h4>
                  <p>{activeProject.caseStudy.challenge}</p>
                </div>
                <div className="cs-block">
                  <h4>The approach</h4>
                  <p>{activeProject.caseStudy.approach}</p>
                </div>
                <div className="cs-block">
                  <h4>The outcome</h4>
                  <p>{activeProject.caseStudy.outcome}</p>
                </div>
              </div>
              <div className="cs-links">
                {activeProject.siteUrl && (
                  <a href={activeProject.siteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    Live site <ExternalLink size={14} />
                  </a>
                )}
                {activeProject.sourceUrl && (
                  <a href={activeProject.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Github size={14} /> Source
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <Reveal>
          <div className="cta-wrap" style={{ padding: '64px 0 0' }}>
            <div className="cta">
              <h2>Your project could be next</h2>
              <p>Cowx Labs takes on a small number of new engagements each quarter. Let's see if we're a fit.</p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">Start a project <ArrowRight size={18} /></Link>
                <Link to="/pricing" className="btn btn-outline btn-lg">View pricing</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
