// src/app/(commonLayouts)/_components/Home/HowItWorks.tsx
import Link from "next/link";
import "./how-it-works.css";

const STEPS = [
  {
    icon: "🔍",
    title: "Discover",
    description:
      "Browse hundreds of curated local restaurants and home kitchens near you, sorted by cuisine, rating, and delivery time.",
  },
  {
    icon: "🛒",
    title: "Order",
    description:
      "Select your favourite dishes, customise your order, and checkout securely in seconds — no fuss, no hassle.",
  },
  {
    icon: "😋",
    title: "Enjoy",
    description:
      "Fresh food delivered to your door. Fast, reliable, and made with real ingredients by people who love to cook.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how">
      <div className="container">
        {/* Header */}
        <div className="how__header">
          <div className="how__eyebrow">
            <span className="how__eyebrow-dot" />
            Simple Process
          </div>
          <h2 className="how__title">
            Taste the difference —<br />
            <em>in three steps</em>
          </h2>
          <p className="how__subtitle">
            From craving to doorstep in minutes. Discover local kitchens, order
            with ease, and enjoy food made with care.
          </p>
        </div>

        {/* Steps grid with connectors */}
        <div className="how__grid">
          {STEPS.map((step, index) => (
            <>
              <div key={step.title} className="how__step">
                <div className="how__step-icon-wrap">
                  <div className="how__step-glow" />
                  <div className="how__step-icon">
                    <span className="how__step-emoji">{step.icon}</span>
                    <span className="how__step-number">{index + 1}</span>
                  </div>
                </div>
                <h3 className="how__step-title">{step.title}</h3>
                <p className="how__step-desc">{step.description}</p>
              </div>

              {/* Connector arrow between steps */}
              {index < STEPS.length - 1 && (
                <div key={`connector-${index}`} className="how__connector">
                  <div className="how__connector-line" />
                </div>
              )}
            </>
          ))}
        </div>

        {/* CTA */}
        <div className="how__cta">
          <Link href="/restaurants" className="how__cta-btn">
            Start Ordering Now
            <span className="how__cta-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}