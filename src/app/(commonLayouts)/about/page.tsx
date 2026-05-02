// src/app/(commonLayouts)/about/page.tsx
import type { Metadata } from "next";
import "./about.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Platera — Our Story & Mission",
  description:
    "Learn how Platera connects Bangladesh's best home kitchens and restaurants with food lovers near them.",
};

const TEAM = [
  { name: "Tabib E Alahi",    role: "Co-Founder & CEO",          initials: "TEA", color: "wine" },
  { name: "Tabib E Alahi",    role: "Co-Founder & CEO",          initials: "TEA", color: "wine" },
  { name: "Tabib E Alahi",    role: "Co-Founder & CEO",          initials: "TEA", color: "wine" },
  { name: "Tabib E Alahi",    role: "Co-Founder & CEO",          initials: "TEA", color: "wine" },
];

const MILESTONES = [
  { year: "2024", title: "The idea", body: "Frustrated by poor food delivery apps, two friends decided to build something better for Bangladesh." },
  { year: "2025 Q1", title: "First 50 providers", body: "Launched in Dhaka with 50 hand-picked home kitchens. Sold out within the first weekend." },
  { year: "2025 Q3", title: "Full platform launch", body: "Online payments via SSLCommerz, real-time order tracking, and provider dashboards went live." },
  { year: "2026", title: "Going national", body: "Expanding to Chittagong, Sylhet, and Rajshahi. 500+ verified providers and counting." },
];

const VALUES = [
  { icon: "🌱", title: "Community first",    body: "We exist to grow local food businesses, not extract from them. 75 cents of every taka goes straight to the provider." },
  { icon: "🔍", title: "Radical transparency", body: "No hidden fees, no paid rankings. What you see is what you get — honest reviews, honest prices." },
  { icon: "🛡",  title: "Safety & trust",    body: "Every provider is verified with NID, kitchen photos, and business documents before they can sell a single meal." },
  { icon: "⚡", title: "Speed & reliability", body: "We obsess over delivery time. Our same-city model ensures food arrives hot, not just on time." },
];

export default function AboutPage() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="about-hero__bg" />
        <div className="about-hero__inner">
          <span className="about-hero__eyebrow">Our Story</span>
          <h1 className="about-hero__title">
            We built Platera because<br />
            <em>good food deserves better tech</em>
          </h1>
          <p className="about-hero__body">
            Bangladesh has some of the world's most extraordinary home cooks, family recipes,
            and street food traditions. We're here to connect those stories with the people who
            love to eat — simply, fairly, and fast.
          </p>
          <div className="about-hero__actions">
            <Link href="/restaurants" className="about-hero__btn-primary">Explore restaurants</Link>
            <Link href="/register-provider" className="about-hero__btn-ghost">Become a provider</Link>
          </div>
        </div>

        {/* Floating stat chips */}
        <div className="about-hero__chip about-hero__chip--1">
          <strong>500+</strong> verified providers
        </div>
        <div className="about-hero__chip about-hero__chip--2">
          <strong>4.8★</strong> average rating
        </div>
        <div className="about-hero__chip about-hero__chip--3">
          <strong>50K+</strong> orders delivered
        </div>
      </section>

      <section className="about-mission">
        <div className="about-mission__inner">
          <div className="about-mission__text">
            <span className="about-section__eyebrow">Our Mission</span>
            <h2 className="about-section__title">
              Make great local food<br />
              accessible to everyone
            </h2>
            <p className="about-mission__body">
              The best food in Bangladesh doesn't always come from a five-star restaurant.
              It comes from a grandmother's kitchen in Mirpur, a tehari stall in Old Dhaka,
              a home cook in Sylhet who learned her recipes over decades.
            </p>
            <p className="about-mission__body">
              Platera gives these hidden gems a professional storefront, reliable payments,
              and access to thousands of customers — without any upfront cost or technical
              complexity.
            </p>
            <div className="about-mission__stat-row">
              <div className="about-mission__stat">
                <span className="about-mission__stat-value">75%</span>
                <span className="about-mission__stat-label">goes to the provider</span>
              </div>
              <div className="about-mission__divider" />
              <div className="about-mission__stat">
                <span className="about-mission__stat-value">48h</span>
                <span className="about-mission__stat-label">to go live</span>
              </div>
              <div className="about-mission__divider" />
              <div className="about-mission__stat">
                <span className="about-mission__stat-value">0</span>
                <span className="about-mission__stat-label">upfront fees</span>
              </div>
            </div>
          </div>
          <div className="about-mission__visual">
            <div className="about-mission__img-stack">
              <div className="about-mission__img-card about-mission__img-card--back">
                <div className="about-mission__img-placeholder">🍛</div>
              </div>
              <div className="about-mission__img-card about-mission__img-card--front">
                <div className="about-mission__img-placeholder">🏪</div>
                <div className="about-mission__img-label">
                  <strong>Home Kitchen BD</strong>
                  <span>Dhaka · Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values__inner">
          <div className="about-values__header">
            <span className="about-section__eyebrow">What we stand for</span>
            <h2 className="about-section__title">Our values</h2>
          </div>
          <div className="about-values__grid">
            {VALUES.map((v, i) => (
              <div className="about-value-card" key={v.title} style={{ "--i": i } as React.CSSProperties}>
                <span className="about-value-card__icon">{v.icon}</span>
                <h3 className="about-value-card__title">{v.title}</h3>
                <p className="about-value-card__body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-timeline">
        <div className="about-timeline__inner">
          <div className="about-timeline__header">
            <span className="about-section__eyebrow">How we got here</span>
            <h2 className="about-section__title">Our journey</h2>
          </div>
          <div className="about-timeline__track">
            {MILESTONES.map((m, i) => (
              <div
                className={`about-timeline__item${i % 2 === 0 ? " about-timeline__item--left" : " about-timeline__item--right"}`}
                key={m.year}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="about-timeline__node">
                  <span className="about-timeline__year">{m.year}</span>
                  <div className="about-timeline__dot" />
                </div>
                <div className="about-timeline__card">
                  <h3 className="about-timeline__card-title">{m.title}</h3>
                  <p className="about-timeline__card-body">{m.body}</p>
                </div>
              </div>
            ))}
            <div className="about-timeline__line" />
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="about-team__inner">
          <div className="about-team__header">
            <span className="about-section__eyebrow">The people behind Platera</span>
            <h2 className="about-section__title">Meet the team</h2>
            <p className="about-team__subtitle">
              A small, passionate team from Dhaka building technology for Bangladesh's food culture.
            </p>
          </div>
          <div className="about-team__grid">
            {TEAM.map((m, i) => (
              <div className="about-team-card" key={m.name} style={{ "--i": i } as React.CSSProperties}>
                <div className={`about-team-card__avatar about-team-card__avatar--${m.color}`}>
                  {m.initials}
                </div>
                <h3 className="about-team-card__name">{m.name}</h3>
                <p className="about-team-card__role">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="about-cta__title">
            Ready to discover<br />
            <em>extraordinary food?</em>
          </h2>
          <p className="about-cta__body">
            Join 50,000+ food lovers who order from Platera every month.
          </p>
          <div className="about-cta__actions">
            <Link href="/restaurants" className="about-cta__btn-primary">Order now</Link>
            <Link href="/contact" className="about-cta__btn-ghost">Get in touch</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
