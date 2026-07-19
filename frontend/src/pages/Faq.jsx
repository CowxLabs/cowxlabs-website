import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Faq from '../components/Faq.jsx';
import Magnetic from '../components/Magnetic.jsx';
import { ArrowRight, MessageCircle, HelpCircle } from 'lucide-react';

const GROUPS = [
  {
    title: 'Working with us',
    items: [
      { q: 'What kind of company is Cowx Labs?', a: 'We are a software solutions company. We design, build and operate web, mobile, cloud and AI products for teams that need more than off-the-shelf tooling.' },
      { q: 'How do engagements start?', a: 'With a discovery call and a short scoping workshop. For retainers we match a team; for fixed projects we deliver a written quote.' },
      { q: 'Where are you based?', a: 'We are remote-first and work with clients worldwide across Americas, Europe and APAC time zones.' },
      { q: 'Do you sign NDAs?', a: 'Yes, always — before any conversation about your product or data.' }
    ]
  },
  {
    title: 'Process & delivery',
    items: [
      { q: 'How often do we get updates?', a: 'Weekly for Starter, biweekly for Growth, with live demos and a shared roadmap. Enterprise gets a dedicated success manager.' },
      { q: 'What methodologies do you use?', a: 'Agile, in small shipped increments. We favor working software over heavy documentation, but keep things transparent.' },
      { q: 'Can you work with our existing team?', a: 'Yes. We frequently embed alongside in-house engineers and follow your existing tooling and standards.' },
      { q: 'What happens after launch?', a: 'We monitor, support and iterate. Most clients stay on a lighter retainer for ongoing improvements.' }
    ]
  },
  {
    title: 'Tech & security',
    items: [
      { q: 'Which stacks do you build on?', a: 'React/Next, Node, Python, TypeScript on the front and API side; Postgres, Redis, and cloud-native infra on AWS, GCP or Azure.' },
      { q: 'How do you handle security?', a: 'Threat modeling, encryption in transit and at rest, zero-trust access and regular audits are baked into delivery.' },
      { q: 'Do you support compliance needs?', a: 'Yes — SOC 2 and GDPR workflows, audit trails and data-residency controls are available on Enterprise plans.' },
      { q: 'Who owns the code and infra?', a: 'You do, fully. We hand over repositories, infrastructure-as-code and documentation.' }
    ]
  }
];

export default function FaqPage() {
  return (
    <div className="page">
      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h1>Answers to <span className="text-gradient">common questions</span></h1>
            <p>Everything you might want to know before starting a project with us.</p>
          </div>
        </Reveal>

        {GROUPS.map((g) => (
          <Reveal key={g.title}>
            <div className="faq-group">
              <h2 className="faq-group-title"><HelpCircle size={18} /> {g.title}</h2>
              <Faq items={g.items} />
            </div>
          </Reveal>
        ))}

        <Reveal>
          <div className="cta-wrap" style={{ padding: '64px 0 0' }}>
            <div className="cta">
              <h2>Still have a question?</h2>
              <p>Reach out and a real engineer will get back to you within one business day.</p>
              <div className="hero-actions">
                <Magnetic><Link to="/contact" className="btn btn-primary btn-lg">Contact us <ArrowRight size={18} /></Link></Magnetic>
                <Link to="/pricing" className="btn btn-outline btn-lg">See pricing <MessageCircle size={16} /></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
