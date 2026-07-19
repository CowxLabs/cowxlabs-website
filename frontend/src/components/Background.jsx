export default function Background() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />
      <div className="bg-aurora">
        <span className="aurora a1" />
        <span className="aurora a2" />
        <span className="aurora a3" />
      </div>
      <div className="bg-beams">
        <span className="beam b1" />
        <span className="beam b2" />
      </div>
      <div className="bg-grid" />
      <div className="bg-stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="star" style={{
            left: `${(i * 17 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            animationDelay: `${(i % 8) * 0.4}s`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`
          }} />
        ))}
      </div>
      <div className="bg-grain" />
      <div className="bg-vignette" />
    </div>
  );
}
