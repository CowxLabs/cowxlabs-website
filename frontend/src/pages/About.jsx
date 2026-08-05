import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import Magnetic from '../components/Magnetic.jsx';
import { Helmet } from 'react-helmet-async';
import { Target, Users2, Rocket, Heart, ArrowRight, CheckCircle2, Zap, ExternalLink, MapPin } from 'lucide-react';

const VALUES = [
  { icon: Target, title: 'Outcomes over output', desc: 'We measure success by the business results we create, not lines of code shipped.' },
  { icon: Users2, title: 'Partnership', desc: 'We embed with your team, share context openly, and treat your goals as our own.' },
  { icon: Rocket, title: 'Ship fast, iterate', desc: 'Small releases, real feedback, continuous improvement — no big-bang launches.' },
  { icon: Heart, title: 'Craft', desc: 'Clean architecture and thoughtful UX in everything we touch.' }
];

const METRICS = [
  { end: 120, suffix: '+', label: 'Projects delivered' },
  { end: 40, suffix: '+', label: 'Clients served' },
  { end: 99.9, suffix: '%', decimals: 1, label: 'Uptime target' },
  { end: 15, suffix: 'yr', label: 'Combined experience' }
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Cowx Labs — Vancouver Software Engineering Studio</title>
        <meta name="description" content="Founded in Vancouver, BC. Cowx Labs delivers custom software with 120+ projects shipped. Meet James Cowx and learn how we build software that lasts." />
        <link rel="canonical" href="https://www.cowxlabs.com/about" />
      </Helmet>
      <div className="page">
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">About us</span>
            <h1>We're <span className="text-gradient">Cowx Labs</span></h1>
            <p>A software solutions company helping ambitious teams ship reliable, scalable products — faster.</p>
          </div>
        </Reveal>

        <div className="grid grid-2">
          <Reveal delay={1}>
            <div className="feature" style={{ height: '100%' }}>
              <div className="feature-icon"><Target size={24} /></div>
              <h3>Our mission</h3>
              <p>Cowx Labs turns complex business problems into clean, dependable software. We partner with companies of all sizes to design, build, and operate the systems they rely on every single day.</p>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="feature" style={{ height: '100%' }}>
              <div className="feature-icon"><Zap size={24} /></div>
              <h3>How we work</h3>
              <ul className="bullets">
                <li>Discovery workshops to map requirements</li>
                <li>Transparent delivery with regular demos</li>
                <li>Modern, maintainable architecture</li>
                <li>Ongoing support and monitoring</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="stats-band" style={{ marginTop: 40, borderRadius: 'var(--radius)' }}>
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', padding: '48px 24px' }}>
            {METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i}>
                <div className="stat">
                  <div className="stat-value"><CountUp end={m.end} suffix={m.suffix} decimals={m.decimals || 0} /></div>
                  <div className="stat-label">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="section-head" style={{ marginTop: 80, marginBottom: 40 }}>
            <span className="eyebrow">Values</span>
            <h2>What we believe</h2>
          </div>
        </Reveal>
        <div className="grid grid-2">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={Math.min(i + 1, 4)}>
                <div className="feature">
                  <div className="feature-icon"><Icon size={22} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="section-head" style={{ marginTop: 80, marginBottom: 40 }}>
            <span className="eyebrow">Leadership</span>
            <h2>Meet the team</h2>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="feature" style={{ textAlign: 'center', padding: 40, maxWidth: 560, margin: '0 auto' }}>
            <div className="feature-icon" style={{ margin: '0 auto 18px', width: 64, height: 64, borderRadius: '50%' }}>
              <Users2 size={28} />
            </div>
            <h3 style={{ fontSize: 22 }}>James Cowx</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Lead Developer</p>
            <p style={{ maxWidth: 420, margin: '0 auto 18px' }}>
              Building software that matters. James leads the technical vision and delivery at Cowx Labs,
              turning complex problems into clean, dependable systems.
            </p>
            <a href="https://www.JamesCowx.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              jamescowx.com <ExternalLink size={14} />
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="cta-wrap" style={{ padding: '64px 0 0' }}>
            <div className="cta">
              <h2>Work with us</h2>
              <p>We're always happy to talk through a new idea or challenge.</p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">Contact the team <ArrowRight size={18} /></Link>
                <Link to="/services" className="btn btn-outline btn-lg">Our services</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
    </>
  );
}
