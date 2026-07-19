import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from './Logo.jsx';
import Background from './Background.jsx';
import PageTransition from './PageTransition.jsx';
import CursorGlow from './CursorGlow.jsx';
import BackToTop from './BackToTop.jsx';
import { Menu, X, Twitter, Github, Linkedin, Send, MapPin } from 'lucide-react';

export default function PublicLayout() {
  const { user } = useAuth();
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const nav = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/work', label: 'Work' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <div className="site">
      <Background />
      <CursorGlow />
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="brand">
            <Logo size={32} />
          </Link>
          <nav className="nav-links">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className={loc.pathname === n.to ? 'active' : ''}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="nav-cta">
            {user ? (
              <Link to={`/${user.role}`} className="btn btn-primary btn-sm">Dashboard</Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}
            <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="nav-mobile">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className={loc.pathname === n.to ? 'active' : ''}>{n.label}</Link>
            ))}
            <Link to="/login" className="btn btn-primary btn-block">Login</Link>
          </div>
        )}
      </header>

      <main className="main">
        <PageTransition><Outlet /></PageTransition>
      </main>

      <BackToTop />

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo size={28} animated />
            <p className="footer-tag">Software solutions engineered for performance — and built to last.</p>
            <div className="footer-social">
              <a href="https://x.com/jamescowx" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><Twitter size={16} /></a>
              <a href="https://github.com/JamesCowx" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={16} /></a>
              <a href="https://www.linkedin.com/in/jamescowx" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
            </div>
            <div className="footer-proud">
              <MapPin size={12} /> Proudly Canadian
            </div>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/work">Work</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/services">All services</Link>
            <Link to="/services">Cloud & DevOps</Link>
            <Link to="/services">AI & Automation</Link>
            <Link to="/contact">Get a quote</Link>
          </div>
          <div className="footer-news">
            <h4>Get our quarterly tech brief</h4>
            <p>Engineering tips and case studies. No spam, unsubscribe anytime.</p>
            <Newsletter />
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-meta">© {new Date().getFullYear()} Cowx Labs Software Solutions. All rights reserved.</div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/xwvgorba';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: 'New newsletter signup' })
      });
      if (res.ok) {
        setDone(true);
        setEmail('');
        setTimeout(() => setDone(false), 4000);
      } else {
        setError('Could not subscribe. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form className="news-form" onSubmit={submit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        aria-label="Email"
      />
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        <Send size={15} />
      </button>
      {done && <span className="news-ok">Subscribed ✓</span>}
      {error && <span className="news-err">{error}</span>}
    </form>
  );
}
