import { useEffect, useState } from 'react';

export default function RotatingWords({ words, className = '' }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setI((p) => (p + 1) % words.length);
        setVisible(true);
      }, 320);
    }, 2600);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <span className={className} style={{ display: 'inline-block' }}>
      <span
        style={{
          display: 'inline-block',
          transition: 'opacity 0.32s var(--ease), transform 0.32s var(--ease), filter 0.32s var(--ease)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-12px)',
          filter: visible ? 'blur(0)' : 'blur(6px)'
        }}
      >
        {words[i]}
      </span>
    </span>
  );
}
