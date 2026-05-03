// src/app/(commonLayouts)/_components/Home/ChefSpotlight/ChefSpotlight.tsx
import Link from "next/link";
import "./chef-spotlight.css";

interface Chef {
  initial: string;
  gradientFrom: string;
  gradientTo: string;
  cuisine: string;
  name: string;
  bio: string;
  rating: string;
  orders: string;
  years: string;
}

const CHEFS: Chef[] = [
  {
    initial: "R",
    gradientFrom: "hsl(350 40% 35%)",
    gradientTo: "hsl(350 35% 25%)",
    cuisine: "Bengali · Home Kitchen",
    name: "Rabeya Begum",
    bio: "30 years of slow-cooked curries and family recipes passed down through generations. Her hilsha fish in mustard is legendary in Dhaka.",
    rating: "4.9",
    orders: "1.2k",
    years: "6 yrs",
  },
  {
    initial: "K",
    gradientFrom: "hsl(38 70% 45%)",
    gradientTo: "hsl(38 60% 35%)",
    cuisine: "Street Food · Fusion",
    name: "Karim Hossain",
    bio: "From Baitul Mukarram's night market to Platera — Karim's fuchka and chotpoti have a cult following that orders every Friday.",
    rating: "4.8",
    orders: "870",
    years: "3 yrs",
  },
  {
    initial: "N",
    gradientFrom: "hsl(20 60% 35%)",
    gradientTo: "hsl(20 50% 25%)",
    cuisine: "Mughlai · Biryani",
    name: "Nasrin Akter",
    bio: "A hotel-trained chef who left the kitchen to start her own venture. Her kacchi biryani is slow-cooked for 5 hours — worth every minute.",
    rating: "5.0",
    orders: "2.4k",
    years: "4 yrs",
  },
];

export default function ChefSpotlight() {
  return (
    <section className="chef-spotlight">
      <div className="container">

        {/* Header */}
        <div className="chef-spotlight__header">
          <div className="chef-spotlight__eyebrow">
            <span className="chef-spotlight__eyebrow-dot" />
            Meet the Makers
          </div>
          <h2 className="chef-spotlight__title">
            The <em>hands</em> behind your meal
          </h2>
          <p className="chef-spotlight__subtitle">
            Every dish on Platera comes from a real person — a home cook, a
            trained chef, or a street food veteran. Get to know them.
          </p>
        </div>

        {/* Chef cards */}
        <div className="chef-spotlight__grid">
          {CHEFS.map((chef) => (
            <div key={chef.name} className="chef-card">
              {/* Top accent line (CSS hover) */}
              <div className="chef-card__accent" />

              {/* Avatar */}
              <div className="chef-card__avatar-wrap">
                <div
                  className="chef-card__avatar-placeholder"
                  style={{
                    background: `linear-gradient(135deg, ${chef.gradientFrom}, ${chef.gradientTo})`,
                  }}
                >
                  {chef.initial}
                </div>
                <div className="chef-card__badge">★</div>
              </div>

              {/* Meta */}
              <div className="chef-card__cuisine">{chef.cuisine}</div>
              <h3 className="chef-card__name">{chef.name}</h3>
              <p className="chef-card__bio">{chef.bio}</p>

              {/* Stats */}
              <div className="chef-card__stats">
                <div className="chef-card__stat">
                  <span className="chef-card__stat-value">{chef.rating}</span>
                  <span className="chef-card__stat-label">Rating</span>
                </div>
                <div className="chef-card__stat">
                  <span className="chef-card__stat-value">{chef.orders}</span>
                  <span className="chef-card__stat-label">Orders</span>
                </div>
                <div className="chef-card__stat">
                  <span className="chef-card__stat-value">{chef.years}</span>
                  <span className="chef-card__stat-label">On Platera</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="chef-spotlight__cta">
          <Link href="/restaurants" className="chef-spotlight__cta-link">
            Browse all providers →
          </Link>
        </div>

      </div>
    </section>
  );
}