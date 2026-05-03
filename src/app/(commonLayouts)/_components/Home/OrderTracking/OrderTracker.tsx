// src/app/(commonLayouts)/_components/Home/OrderTracker/OrderTracker.tsx
import "./order-tracker.css";

const PILLS = [
  { icon: "📍", label: "Live GPS tracking" },
  { icon: "🔔", label: "Push notifications" },
  { icon: "⏱️", label: "Accurate ETA" },
  { icon: "💬", label: "Chat with rider" },
];

type TrackStepStatus = "done" | "active" | "pending";

interface TrackStep {
  icon: string;
  label: string;
  time: string;
  status: TrackStepStatus;
}

const TRACK_STEPS: TrackStep[] = [
  { icon: "✓", label: "Order Confirmed",    time: "2:14 PM",                status: "done"    },
  { icon: "✓", label: "Kitchen is Cooking", time: "2:17 PM",                status: "done"    },
  { icon: "🛵", label: "Out for Delivery",  time: "On the way · 12 min left", status: "active" },
  { icon: "🏠", label: "Delivered",         time: "~2:38 PM",               status: "pending" },
];

export default function OrderTracker() {
  return (
    <section className="order-tracker">
      <div className="container">
        <div className="order-tracker__inner">

          {/* ── Left: copy ── */}
          <div className="order-tracker__content">
            <div className="order-tracker__eyebrow">
              <span className="order-tracker__eyebrow-dot" />
              Real-Time Tracking
            </div>

            <h2 className="order-tracker__title">
              Your order,<br />
              <em>every step</em> of the way
            </h2>

            <p className="order-tracker__desc">
              Watch your meal come to life in real time — from the kitchen fire
              to your front door. Zero guesswork, total transparency.
            </p>

            <div className="order-tracker__pills">
              {PILLS.map((pill) => (
                <div key={pill.label} className="order-tracker__pill">
                  <span className="order-tracker__pill-icon">{pill.icon}</span>
                  {pill.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: tracker card ── */}
          <div className="order-tracker__card">
            <div className="order-tracker__card-header">
              <span className="order-tracker__order-id"># PLT-2847-K</span>
              <span className="order-tracker__eta">
                <span className="order-tracker__eta-dot" />
                ETA: 12 min
              </span>
            </div>

            <div className="tracker-steps">
              {TRACK_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={`tracker-step tracker-step--${step.status}`}
                >
                  {/* Vertical connector line drawn via CSS ::after */}
                  <div className="tracker-step__dot">{step.icon}</div>
                  <div className="tracker-step__info">
                    <div className="tracker-step__label">{step.label}</div>
                    <div className="tracker-step__time">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}