// src/components/home/HowItWorks.tsx
import "./how-it-works.css";

const STEPS = [
  {
    icon: "🔍",
    title: "Discover",
    description:
      "Browse hundreds of local restaurants and home kitchens near you.",
  },
  {
    icon: "🛒",
    title: "Order",
    description:
      "Select your favourite dishes and place your order in seconds.",
  },
  {
    icon: "😋",
    title: "Enjoy",
    description:
      "Fresh food delivered to your door. Fast, reliable, delicious.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how">
      <div className="container">
        <div className="how__header">
          <h2 className="how__title">How It Works</h2>
          <p className="how__subtitle">
            Getting your favourite food has never been easier
          </p>
        </div>

        <div className="how__grid">
          {STEPS.map((step, index) => (
            <div key={step.title} className="how__step">
              <div className="how__step-icon">{step.icon}</div>
              <div className="how__step-number">{index + 1}</div>
              <h3 className="how__step-title">{step.title}</h3>
              <p className="how__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}