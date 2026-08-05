import { Link } from 'react-router-dom';
import api from '../api.js';
import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import { Code2, Cloud, BarChart3, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ICON_MAP = { code: Code2, cloud: Cloud, chart: BarChart3, compass: Cpu, shield: ShieldCheck };

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => { api.get('/services').then((r) => setServices(r.data)).catch(() => {}); }, []);

  return (
    <>
      <Helmet>
        <title>Software Development Services — Web, Cloud, AI & DevOps | Cowx Labs</title>
        <meta name="description" content="End-to-end software services: custom web & mobile apps, cloud migration, AI automation, data engineering, and DevOps consulting. Based in Vancouver, BC." />
        <link rel="canonical" href="https://www.cowxlabs.com/services" />
      </Helmet>
      <div className="page">
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Services</span>
            <h1>Our <span className="text-gradient">capabilities</span></h1>
            <p>End-to-end software solutions, from first sketch to production — and beyond.</p>
          </div>
        </Reveal>

        <div className="grid grid-2">
          {services.map((s, i) => {
            const Icon = ICON_MAP[s.icon] || Code2;
            return (
              <Reveal key={s.id} delay={Math.min(i + 1, 4)}>
                <div className="svc-row">
                  <div className="ic"><Icon size={22} /></div>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                  <ArrowRight size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="cta-wrap" style={{ padding: '64px 0 0' }}>
            <div className="cta">
              <h2>Need a custom solution?</h2>
              <p>Let's scope it together and map a path to production.</p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">Request a quote <ArrowRight size={18} /></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
    </>
  );
}
