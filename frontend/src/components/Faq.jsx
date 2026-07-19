import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Faq({ items, columns = 1 }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list" style={columns === 2 ? { gridTemplateColumns: '1fr 1fr' } : undefined}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq-item ${isOpen ? 'open' : ''}`} key={i}>
            <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              <span>{it.q}</span>
              <ChevronDown size={18} className="faq-chev" />
            </button>
            <div className="faq-a" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
              <div className="faq-a-inner"><p>{it.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
