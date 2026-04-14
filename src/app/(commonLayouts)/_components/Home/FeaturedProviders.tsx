// src/components/home/FeaturedProviders.tsx
import Link from "next/link";
import { Star, Clock, MapPin } from "lucide-react";
import "./featured-providers.css";

const MOCK_PROVIDERS = [
  {
    id: "1",
    businessName: "Burger House BD",
    businessCategory: "RESTAURANT",
    city: "Rangpur",
    imageURL: null,
    rating: 4.8,
    reviewCount: 320,
    deliveryTime: "20-30",
    distance: "1.2 km",
    isSponsored: true,
    tags: ["Fast Food", "Burgers"],
  },
  {
    id: "2",
    businessName: "Mama's Kitchen",
    businessCategory: "HOME_KITCHEN",
    city: "Rangpur",
    imageURL: null,
    rating: 4.9,
    reviewCount: 180,
    deliveryTime: "30-45",
    distance: "2.5 km",
    isSponsored: false,
    tags: ["Home Food", "Rice & Curry"],
  },
  {
    id: "3",
    businessName: "Street Bites",
    businessCategory: "STREET_FOOD",
    city: "Rangpur",
    imageURL: null,
    rating: 4.6,
    reviewCount: 95,
    deliveryTime: "15-25",
    distance: "0.8 km",
    isSponsored: false,
    tags: ["Street Food", "Snacks"],
  },
  {
    id: "4",
    businessName: "Spice Garden",
    businessCategory: "RESTAURANT",
    city: "Rangpur",
    imageURL: null,
    rating: 4.7,
    reviewCount: 210,
    deliveryTime: "25-35",
    distance: "3.1 km",
    isSponsored: false,
    tags: ["Biriyani", "Rice & Curry"],
  },
];

const CATEGORY_EMOJI: Record<string, string> = {
  RESTAURANT: "🍽️",
  HOME_KITCHEN: "🏠",
  STREET_FOOD: "🛺",
  SHOP: "🛒",
};

export default function FeaturedProviders() {
  return (
    <section className="featured">
      <div className="container">
        <div className="featured__header">
          <div>
            <h2 className="featured__title">
              Featured Restaurants
            </h2>
            <p className="featured__subtitle">
              Handpicked top-rated providers near you
            </p>
          </div>
          <Link href="/providers" className="featured__view-all">
            View all →
          </Link>
        </div>

        <div className="featured__grid">
          {MOCK_PROVIDERS.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="provider-card"
            >
              {/* image */}
              <div className="provider-card__image">
                <div className="provider-card__image-placeholder">
                  <span>
                    {CATEGORY_EMOJI[provider.businessCategory]}
                  </span>
                </div>

                {/* rating badge */}
                <div className="provider-card__rating">
                  <Star size={12} fill="currentColor" />
                  <span>{provider.rating}</span>
                </div>

                {/* sponsored */}
                {provider.isSponsored && (
                  <div className="provider-card__sponsored">
                    Sponsored
                  </div>
                )}
              </div>

              {/* info */}
              <div className="provider-card__info">
                <h3 className="provider-card__name">
                  {provider.businessName}
                </h3>

                <div className="provider-card__tags">
                  {provider.tags.map((tag) => (
                    <span
                      key={tag}
                      className="provider-card__tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="provider-card__meta">
                  <span className="provider-card__meta-item">
                    <Clock size={13} />
                    {provider.deliveryTime} min
                  </span>
                  <span className="provider-card__meta-dot" />
                  <span className="provider-card__meta-item">
                    <MapPin size={13} />
                    {provider.distance}
                  </span>
                  <span className="provider-card__meta-dot" />
                  <span className="provider-card__meta-item">
                    {provider.reviewCount} reviews
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}