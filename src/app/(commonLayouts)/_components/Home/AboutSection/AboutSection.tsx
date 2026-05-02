import { Leaf, Award, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import "./aboutSection.css";
import Link from "next/link";

const features = [
  { icon: ShieldCheck, label: "Verified Partners", desc: "Every restaurant vetted" },
  { icon: Award, label: "Curated Selection", desc: "Only the best make it" },
  { icon: Truck, label: "Fast Delivery", desc: "Under 30 min average" },
  { icon: Leaf, label: "Fresh & Local", desc: "Farm-to-table focused" },
];

const AboutSection = () => {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__image-col">
          <img
            src="about-restaurant.jpg"
            alt="Restaurant interior with warm ambient lighting"
            className="about__image"
            loading="lazy"
            width={960}
            height={800}
          />
          <div className="about__image-overlay" />
        </div>

        <div className="about__content-col">
          <div className="about__content">
            <div className="about__subtitle">
              <span className="about__subtitle-line" />
              Why Platera
            </div>

            <h2 className="about__title">
              Your Gateway to <em>Extraordinary</em> Dining
            </h2>

            <p className="about__text">
              Platera connects food lovers with the finest restaurants in their
              city. We hand-pick every partner, ensuring quality, authenticity,
              and unforgettable experiences — whether you dine in, take out, or
              order delivery.
            </p>

            <div className="about__features">
              {features.map((f) => (
                <div className="about__feature" key={f.label}>
                  <div className="about__feature-icon">
                    <f.icon size={18} />
                  </div>
                  <div className="about__feature-text">
                    <span className="about__feature-label">{f.label}</span>
                    <span className="about__feature-desc">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link href={"/about"} className="about__btn">
              Learn More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
