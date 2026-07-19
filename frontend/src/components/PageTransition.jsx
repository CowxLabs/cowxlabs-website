import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function PageTransition({ children }) {
  const loc = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); }, [loc.pathname]);
  return (
    <div key={loc.pathname} className="page-transition">
      {children}
    </div>
  );
}
