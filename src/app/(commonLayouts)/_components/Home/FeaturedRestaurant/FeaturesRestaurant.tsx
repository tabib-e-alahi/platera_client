import { ArrowRight } from "lucide-react";
import Link from "next/link";
import "./featuredRestaurants.css";
import { getFeaturedRestaurants } from "@/services/restaurant.service";
import FeaturedRestaurantsClient from "./FeaturedRestaurantsClient";


export const revalidate = false;

export default async function FeaturedRestaurants() {
  let restaurants = [];

  try {
    const res = await getFeaturedRestaurants();
    if (res?.success) {
      restaurants = res.data ?? [];
    }
  } catch {
    restaurants = [];
  }

  return (
    <section className="restaurants" id="restaurants">
      <div className="restaurants__container">
        <div className="restaurants__header">
          <div className="restaurants__subtitle">
            <span className="restaurants__subtitle-line" />
            Top Picks This Week
            <span className="restaurants__subtitle-line" />
          </div>

          <h2 className="restaurants__title">
            Featured <em>Restaurants</em>
          </h2>

          <p className="restaurants__description">
            Our most loved restaurants — ranked by orders, rated by customers, ready to deliver.
          </p>
        </div>

        <FeaturedRestaurantsClient restaurants={restaurants} />

        <div className="restaurants__cta">
          <Link
            href="/restaurants"
            className="restaurants__cta-btn"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Explore All Restaurants
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}