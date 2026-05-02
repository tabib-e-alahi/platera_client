"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Flame, Clock, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { getTopDishes } from "@/services/public.service";
import "./top-dishes.css";
import AddToCartButton from "@/components/shared/AddToCartButton";


export type TTopDish = {
  id: string;
  name: string;
  shortDescription: string;
  mainImageURL: string;
  basePrice: number;
  discountPrice?: number | null;
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  isBestseller: boolean;
  isFeatured: boolean;
  preparationTimeMinutes: number;
  deliveryFee: number;
  subcategory?: string | null;
  tags: string[];
  orderCount: number;
  avgRating: number;
  reviewCount: number;
  category: { id: string; name: string; slug: string };
  provider: {
    id: string;
    businessName: string;
    city: string;
    imageURL?: string | null;
  };
};


function isDiscountActive(dish: TTopDish): boolean {
  if (!dish.discountPrice) return false;
  const now = Date.now();
  const start = dish.discountStartDate ? new Date(dish.discountStartDate).getTime() : 0;
  const end = dish.discountEndDate ? new Date(dish.discountEndDate).getTime() : Infinity;
  return now >= start && now <= end;
}

function effectivePrice(dish: TTopDish): number {
  return isDiscountActive(dish) && dish.discountPrice ? dish.discountPrice : dish.basePrice;
}


function DishCardSkeleton() {
  return (
    <div className="rest-card rest-card--skeleton">
      <div className="rest-card__image-wrap rest-card__image-wrap--sk" />
      <div className="rest-card__body">
        <div className="rest-card__sk-line rest-card__sk-line--sm" />
        <div className="rest-card__sk-line rest-card__sk-line--lg" />
        <div className="rest-card__sk-line rest-card__sk-line--md" />
      </div>
    </div>
  );
}


function DishCard({ dish, rank }: { dish: TTopDish; rank: number }) {
  const price = effectivePrice(dish);
  const hasDiscount = isDiscountActive(dish);
  const badge = dish.isBestseller ? "bestseller" : dish.isFeatured ? "featured" : null;

  return (
    <div
      className="rest-card"
      style={{ textDecoration: "none", display: "block", color: "inherit" }}
    >
      {/* Image */}
      <div className="rest-card__image-wrap">
        {dish.mainImageURL ? (
          <img
            src={dish.mainImageURL}
            alt={dish.name}
            className="rest-card__image"
            loading="lazy"
            width={800}
            height={500}
          />
        ) : (
          <div className="rest-card__image-placeholder">
            <UtensilsCrossed size={52} />
          </div>
        )}

        <div className="rest-card__image-overlay" />

        {/* Rank badge — mirrors #1 Top Rated from featured restaurants */}
        <div className="rest-card__badges">
          {badge === "bestseller" ? (
            <span className="rest-card__badge rest-card__badge--featured">
              ★ Bestseller
            </span>
          ) : badge === "featured" ? (
            <span className="rest-card__badge rest-card__badge--featured">
              ✦ Featured
            </span>
          ) : (
            <span className="rest-card__badge rest-card__badge--featured">
              #{rank} Top Dish
            </span>
          )}

          {hasDiscount && (
            <span className="rest-card__badge rest-card__badge--discount">
              {Math.round(((dish.basePrice - price) / dish.basePrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Rating pill — identical to featured restaurants */}
        {dish.avgRating > 0 && (
          <div className="rest-card__rating">
            <Star
              size={11}
              className="rest-card__rating-star"
              fill="currentColor"
            />
            <span className="rest-card__rating-value">
              {dish.avgRating.toFixed(1)}
            </span>
            <span className="rest-card__rating-count">
              ({dish.reviewCount})
            </span>
          </div>
        )}

        {/* Cuisine tags — subcategory or category */}
        <div className="rest-card__cuisine-row">
          {dish.subcategory && (
            <span className="rest-card__cuisine-tag">{dish.subcategory}</span>
          )}
          <span className="rest-card__cuisine-tag">{dish.category.name}</span>
        </div>
      </div>

      {/* Body */}
      <div className="rest-card__body">
        <div className="rest-card__header">
          <h3 className="rest-card__name">{dish.name}</h3>
          {/* Price where the city/location sits in restaurant cards */}
          <div className="rest-card__dish-price">
            {hasDiscount && (
              <span className="rest-card__dish-price-original">৳{dish.basePrice}</span>
            )}
            <span className="rest-card__dish-price-current">৳{price}</span>
          </div>
        </div>

        <div className="rest-card__meta">
          <span className="rest-card__meta-item">
            <ShoppingBag size={13} className="rest-card__meta-icon" />
            {dish.orderCount} orders
          </span>
          <span className="rest-card__meta-item">
            <Clock size={13} className="rest-card__meta-icon" />
            {dish.preparationTimeMinutes} min
          </span>
          {dish.deliveryFee > 0 && (
            <span className="rest-card__meta-item">
              <Flame size={13} className="rest-card__meta-icon" />
              ৳{dish.deliveryFee} delivery
            </span>
          )}
        </div>

        {dish.shortDescription && (
          <p className="rest-card__desc line-clamp-1">{dish.shortDescription}</p>
        )}

        <div className="rest-card__footer">
          <span className="rest-card__delivery">
            {dish.provider.businessName} · {dish.provider.city}
          </span>
          <span className="">
            <AddToCartButton mealId={dish.id}></AddToCartButton>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TopDishes() {
  const [dishes, setDishes] = useState<TTopDish[]>([]);
  const [filtered, setFiltered] = useState<TTopDish[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [active, setActive] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getTopDishes();
        const data: TTopDish[] = res?.data ?? [];
        setDishes(data);
        setFiltered(data);

        // Build category tabs from actual data
        const cats = Array.from(
          new Set(data.map((d) => d.category.name))
        );
        setCategories(["All", ...cats]);
      } catch {
        // silently fail — section just won't show
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleTabChange = (cat: string) => {
    setActive(cat);
    setFiltered(
      cat === "All"
        ? dishes
        : dishes.filter((d) => d.category.name === cat)
    );
  };

  // Don't render section at all if no data and not loading
  if (!isLoading && dishes.length === 0) return null;

  return (
    <section className="menu" id="menu">
      <div className="menu__container">
        {/* Header */}
        <div className="menu__header">
          <div className="menu__subtitle">
            <span className="menu__subtitle-line" />
            Curated for You
            <span className="menu__subtitle-line" />
          </div>
          <h2 className="menu__title">
            Our <em>Signature</em> Collection
          </h2>
          <p className="menu__description">
            Handpicked bestsellers and featured dishes from our top-rated
            providers — loved by thousands of customers.
          </p>
        </div>

        {/* Category tabs */}
        {!isLoading && categories.length > 2 && (
          <div className="menu__tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`menu__tab${active === cat ? " menu__tab--active" : ""}`}
                onClick={() => handleTabChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="restaurants__grid">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <DishCardSkeleton key={i} />)
            : filtered.map((dish, i) => (
                <DishCard key={dish.id} dish={dish} rank={i + 1} />
              ))}
        </div>

        {/* CTA */}
        {!isLoading && (
          <div className="menu__cta">
            <Link href="/restaurants" className="menu__cta-btn">
              Browse All Restaurants
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
