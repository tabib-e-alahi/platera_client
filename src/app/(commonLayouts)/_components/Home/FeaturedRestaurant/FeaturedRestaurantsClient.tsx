"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  MapPin,
  Flame,
  UtensilsCrossed,
  ShoppingBag,
} from "lucide-react";
import type { Restaurant } from "@/services/restaurant.service";

const BADGE_LABEL: Record<string, string> = {
  RESTAURANT: "Restaurant",
  HOME_KITCHEN: "Home Kitchen",
  SHOP: "Shop",
  STREET_FOOD: "Street Food",
};

type Props = {
  restaurants: Restaurant[];
};

export default function FeaturedRestaurantsClient({ restaurants }: Props) {
  const [activeType, setActiveType] = useState("All");

  const types = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          restaurants.map(
            (r) => BADGE_LABEL[r.businessCategory] ?? r.businessCategory
          )
        )
      ),
    ],
    [restaurants]
  );

  const filtered =
    activeType === "All"
      ? restaurants
      : restaurants.filter(
          (r) =>
            (BADGE_LABEL[r.businessCategory] ?? r.businessCategory) === activeType
        );

  if (!restaurants.length) {
    return (
      <div className="restaurants__grid">
        <div className="rest-card" style={{ pointerEvents: "none" }}>
          <div className="rest-card__body">
            <h3 className="rest-card__name">No featured restaurants found</h3>
            <p className="rest-card__desc">
              Featured restaurants are not available right now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {types.length > 2 && (
        <div className="restaurants__tabs">
          {types.map((t) => (
            <button
              key={t}
              className={`restaurants__tab ${
                activeType === t ? "restaurants__tab--active" : ""
              }`}
              onClick={() => setActiveType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="restaurants__grid">
        {filtered.map((r) => (
          <div 
            key={r.id}
            className="rest-card"
            style={{
              textDecoration: "none",
              display: "block",
              color: "inherit",
            }}
          >
            <div className="rest-card__image-wrap">
              {r.imageURL ? (
                <img
                  src={r.imageURL}
                  alt={r.businessName}
                  className="rest-card__image"
                  loading="lazy"
                  width={800}
                  height={500}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, hsl(var(--wine-deep)/0.08), hsl(var(--gold)/0.06))",
                    color: "hsl(var(--gold)/0.4)",
                  }}
                >
                  <UtensilsCrossed size={56} />
                </div>
              )}

              <div className="rest-card__image-overlay" />

              <div className="rest-card__badges">
                <span className="rest-card__badge rest-card__badge--featured">
                  #{restaurants.indexOf(r) + 1} Top Rated
                </span>
              </div>

              {r.avgRating > 0 && (
                <div className="rest-card__rating">
                  <Star
                    size={11}
                    className="rest-card__rating-star"
                    fill="currentColor"
                  />
                  <span className="rest-card__rating-value">{r.avgRating}</span>
                  <span className="rest-card__rating-count">
                    ({r.reviewCount})
                  </span>
                </div>
              )}

              {r.subcategories && r.subcategories.length > 0 && (
                <div className="rest-card__cuisine-row">
                  {(r.subcategories as string[]).slice(0, 3).map(
                    (s) =>
                      s && (
                        <span className="rest-card__cuisine-tag" key={s}>
                          {s}
                        </span>
                      )
                  )}
                </div>
              )}
            </div>

            <div className="rest-card__body">
              <div className="rest-card__header">
                <h3 className="rest-card__name">{r.businessName}</h3>

                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "hsl(var(--muted-foreground))",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <MapPin size={10} />
                  {r.city}
                </span>
              </div>

              <div className="rest-card__meta">
                <span className="rest-card__meta-item">
                  <ShoppingBag size={13} className="rest-card__meta-icon" />
                  {r.mealCount} meals
                </span>

                <span className="rest-card__meta-item">
                  <Flame size={13} className="rest-card__meta-icon" />
                  {r.totalOrdersCompleted} orders
                </span>
              </div>

              {r.bio && <p className="rest-card__desc">{r.bio}</p>}

              <div className="rest-card__footer">
                <span className="rest-card__delivery">
                  {BADGE_LABEL[r.businessCategory] ?? r.businessCategory}
                </span>

                <Link  href={`/restaurants/${r.id}`} className="rest-card__btn">
                  View Menu <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}