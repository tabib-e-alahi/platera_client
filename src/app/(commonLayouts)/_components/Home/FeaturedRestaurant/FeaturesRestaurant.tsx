"use client"

import { useState } from "react";
import { ArrowRight, Star, MapPin, Clock, Truck } from "lucide-react";

import "./featuredRestaurants.css";

const categories = ["All", "Fine Dining", "Casual", "Seafood", "Asian"];

type Badge = "featured" | "new" | "open";

interface Restaurant {
  name: string;
  category: string;
  cuisine: string[];
  description: string;
  rating: number;
  reviews: number;
  priceLevel: number;
  delivery: string;
  distance: string;
  badge: Badge | null;
  image: string;
}

const restaurants: Restaurant[] = [
  {
    name: "Sakura Omakase",
    category: "Asian",
    cuisine: ["Japanese", "Sushi"],
    description:
      "An intimate omakase experience with seasonal fish flown in daily from Tokyo's Tsukiji market.",
    rating: 4.9,
    reviews: 342,
    priceLevel: 4,
    delivery: "25–35 min",
    distance: "1.2 mi",
    badge: "featured",
    image: "rest-sushi.jpg",
  },
  {
    name: "Trattoria Bella Vita",
    category: "Casual",
    cuisine: ["Italian", "Pizza"],
    description:
      "Rustic Italian classics made with imported ingredients and wood-fired oven magic since 1998.",
    rating: 4.7,
    reviews: 891,
    priceLevel: 2,
    delivery: "20–30 min",
    distance: "0.8 mi",
    badge: null,
    image: "rest-italian.jpg",
  },
  {
    name: "Le Château Noir",
    category: "Fine Dining",
    cuisine: ["French", "Wine Bar"],
    description:
      "Michelin-starred French cuisine with an award-winning wine cellar and seasonal tasting menus.",
    rating: 4.8,
    reviews: 215,
    priceLevel: 4,
    delivery: "35–45 min",
    distance: "2.1 mi",
    badge: "featured",
    image: "rest-french.jpg",
  },
  {
    name: "Masala Royal",
    category: "Fine Dining",
    cuisine: ["Indian", "Tandoor"],
    description:
      "Elevated Indian fine dining with rare spice blends, tandoor specialties, and royal thali platters.",
    rating: 4.6,
    reviews: 478,
    priceLevel: 3,
    delivery: "30–40 min",
    distance: "1.5 mi",
    badge: "new",
    image: "rest-indian.jpg",
  },
  {
    name: "El Fuego Cantina",
    category: "Casual",
    cuisine: ["Mexican", "Street Food"],
    description:
      "Vibrant street-style tacos, handmade tortillas, and craft margaritas in a lively atmosphere.",
    rating: 4.5,
    reviews: 1203,
    priceLevel: 1,
    delivery: "15–25 min",
    distance: "0.4 mi",
    badge: "open",
    image: "rest-mexican.jpg",
  },
  {
    name: "The Butcher's Table",
    category: "Fine Dining",
    cuisine: ["Steakhouse", "Grill"],
    description:
      "Dry-aged prime cuts, craft whiskey selection, and classic sides in a sophisticated setting.",
    rating: 4.8,
    reviews: 567,
    priceLevel: 3,
    delivery: "30–40 min",
    distance: "1.8 mi",
    badge: null,
    image: "rest-steakhouse.jpg",
  },
];

const PriceLevel = ({ level }: { level: number }) => (
  <span className="rest-card__price-level">
    {"$".repeat(level)}
    <span className="rest-card__price-level-dim">{"$".repeat(4 - level)}</span>
  </span>
);

const FeaturedRestaurants = () => {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? restaurants
      : restaurants.filter((r) => r.category === active);

  return (
    <section className="restaurants" id="restaurants">
      <div className="restaurants__container">
        <div className="restaurants__header">
          <div className="restaurants__subtitle">
            <span className="restaurants__subtitle-line" />
            Handpicked for You
            <span className="restaurants__subtitle-line" />
          </div>
          <h2 className="restaurants__title">
            Featured <em>Restaurants</em>
          </h2>
          <p className="restaurants__description">
            Explore the best dining experiences in your city — from cozy trattorias
            to Michelin-starred gems, all curated by Platera.
          </p>
        </div>

        <div className="restaurants__tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`restaurants__tab ${active === cat ? "restaurants__tab--active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="restaurants__grid">
          {filtered.map((r) => (
            <div className="rest-card" key={r.name}>
              {/* Image */}
              <div className="rest-card__image-wrap">
                <img
                  src={r.image}
                  alt={r.name}
                  className="rest-card__image"
                  loading="lazy"
                  width={800}
                  height={500}
                />
                <div className="rest-card__image-overlay" />

                {/* Badges */}
                {r.badge && (
                  <div className="rest-card__badges">
                    <span className={`rest-card__badge rest-card__badge--${r.badge}`}>
                      {r.badge === "featured"
                        ? "★ Featured"
                        : r.badge === "new"
                          ? "New"
                          : "Open Now"}
                    </span>
                  </div>
                )}

                {/* Rating */}
                <div className="rest-card__rating">
                  <Star
                    size={11}
                    className="rest-card__rating-star"
                    fill="currentColor"
                  />
                  <span className="rest-card__rating-value">{r.rating}</span>
                  <span className="rest-card__rating-count">
                    ({r.reviews.toLocaleString()})
                  </span>
                </div>

                {/* Cuisine tags */}
                <div className="rest-card__cuisine-row">
                  {r.cuisine.map((c) => (
                    <span className="rest-card__cuisine-tag" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="rest-card__body">
                <div className="rest-card__header">
                  <h3 className="rest-card__name">{r.name}</h3>
                  <PriceLevel level={r.priceLevel} />
                </div>

                <div className="rest-card__meta">
                  <span className="rest-card__meta-item">
                    <MapPin size={13} className="rest-card__meta-icon" />
                    {r.distance}
                  </span>
                  <span className="rest-card__meta-item">
                    <Clock size={13} className="rest-card__meta-icon" />
                    {r.delivery}
                  </span>
                </div>

                <p className="rest-card__desc">{r.description}</p>

                <div className="rest-card__footer">
                  <span className="rest-card__delivery">
                    <Truck size={14} />
                    Free Delivery
                  </span>
                  <button className="rest-card__btn">
                    View Menu
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="restaurants__cta">
          <button className="restaurants__cta-btn">
            Explore All Restaurants
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
