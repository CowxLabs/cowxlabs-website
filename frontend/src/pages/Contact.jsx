import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { Mail, MapPin, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgnwawq';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('Thanks! We received your message and will reply within one business day.');
        setForm({ name: '', email: '', company: '', message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.errors?.map((x) => x.message).join(', ') || 'Something went wrong sending your message.');
      }
    } catch {
      setError('Network error — please try again or email hello@cowxlabs.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Contact</span>
            <h1>Let's talk about <span className="text-gradient">your project</span></h1>
            <p>Tell us what you're building and we'll get back to you quickly.</p>
          </div>
        </Reveal>

        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <Reveal delay={1}>
            <form className="form auth-card" style={{ boxShadow: 'none', padding: 32, animation: 'none' }} onSubmit={submit}>
              <label className="field"><span>Name</span>
                <input value={form.name} onChange={update('name')} required placeholder="Jane Doe" />
              </label>
              <label className="field"><span>Email</span>
                <input type="email" value={form.email} onChange={update('email')} required placeholder="jane@company.com" />
              </label>
              <label className="field"><span>Company</span>
                <input value={form.company} onChange={update('company')} placeholder="Acme Inc." />
              </label>
              <label className="field"><span>Message</span>
                <textarea rows="5" value={form.message} onChange={update('message')} required placeholder="What can we build for you?" />
              </label>
              <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send message'} <Send size={16} />
              </button>
              {status && <div className="alert alert-ok"><CheckCircle2 size={16} /> {status}</div>}
              {error && <div className="alert alert-err">{error}</div>}
            </form>
          </Reveal>

          <Reveal delay={2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="feature">
                <div className="feature-icon"><Mail size={20} /></div>
                <h3>Email</h3>
                <p style={{ margin: 0 }}>hello@cowxlabs.com</p>
              </div>
              <div className="feature">
                <div className="feature-icon"><MapPin size={20} /></div>
                <h3>Office</h3>
                <p style={{ margin: 0 }}>Remote-first. Meeting worldwide.</p>
              </div>
              <div className="feature">
                <div className="feature-icon"><Clock size={20} /></div>
                <h3>Response time</h3>
                <p style={{ margin: 0 }}>Within one business day, guaranteed.</p>
              </div>
              <Link to="/services" className="btn btn-outline btn-lg" style={{ marginTop: 4 }}>
                Browse services <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
