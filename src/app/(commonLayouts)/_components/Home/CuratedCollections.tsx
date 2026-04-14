// src/components/home/CuratedCollections.tsx
import Link from "next/link";
import "./curated.css";

const COLLECTIONS = [
  {
    title: "Best for Dinner",
    subtitle: "Premium meals for your evening",
    emoji: "🌙",
    href: "/meals?tag=dinner",
    bg: "#1a1a2e",
  },
  {
    title: "Late Night Cravings",
    subtitle: "Open past midnight",
    emoji: "🌃",
    href: "/meals?tag=late-night",
    bg: "#16213e",
  },
  {
    title: "Healthy Picks",
    subtitle: "Fresh and nutritious choices",
    emoji: "🥗",
    href: "/meals?dietaryPreferences=HEALTHY",
    bg: "#0f3460",
  },
];

export default function CuratedCollections() {
  return (
    <section className="curated">
      <div className="container">
        <div className="curated__grid">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="curated__card"
              style={{ background: col.bg }}
            >
              <div className="curated__emoji">{col.emoji}</div>
              <div className="curated__text">
                <h3 className="curated__title">{col.title}</h3>
                <p className="curated__subtitle">{col.subtitle}</p>
              </div>
              <div className="curated__arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}