
import "./loading.css";

export default function LoadingPage() {
  return (
    <div className="ld-root">
      {/* Grain overlay */}
      <div className="ld-grain" />

      {/* Ambient orbs */}
      <div className="ld-orb ld-orb-1" />
      <div className="ld-orb ld-orb-2" />

      <div className="ld-center">
        {/* Wordmark */}
        <div className="ld-brand">
          <span className="ld-brand-food">Food</span>
          <em className="ld-brand-hub">Hub</em>
        </div>

        {/* Animated plate / ring */}
        <div className="ld-plate-wrap">
          <div className="ld-ring ld-ring-outer" />
          <div className="ld-ring ld-ring-mid" />
          <div className="ld-plate">
            <span className="ld-plate-emoji">🍱</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="ld-bar-track">
          <div className="ld-bar-fill" />
        </div>

        {/* Label */}
        <p className="ld-label">Preparing something delicious…</p>
      </div>
    </div>
  );
}