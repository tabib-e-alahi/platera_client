"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Star, MapPin, ShoppingBag, ChefHat, Clock,
  SlidersHorizontal, Search, UtensilsCrossed, X, Flame
} from "lucide-react";
import { getRestaurantById } from "@/services/restaurant.service";
import type { Meal } from "@/services/restaurant.service";
import AddToCartButton from "@/components/shared/AddToCartButton";
import "./restaurant-detail.css";

const DIETARY_OPTIONS = [
  { value: "", label: "All" },
  { value: "VEGAN", label: "Vegan" },
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "HALAL", label: "Halal" },
  { value: "GLUTEN_FREE", label: "Gluten Free" },
  { value: "DAIRY_FREE", label: "Dairy Free" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const BADGE_LABEL: Record<string, string> = {
  RESTAURANT: "Restaurant", HOME_KITCHEN: "Home Kitchen",
  SHOP: "Shop", STREET_FOOD: "Street Food",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="rd__review-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
<<<<<<< HEAD
          fill={s <= Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={s <= Math.round(rating) ? 0 : 1.5}
          className={s <= Math.round(rating) ? "rd__review-star--filled" : "rd__review-star--empty"}
=======
          fill={s <= rating ? "currentColor" : "none"}
          className={s <= rating ? "rd__review-star--filled" : "rd__review-star--empty"}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        />
      ))}
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const now = new Date();
  const discountActive =
    meal.discountPrice &&
    (!meal.discountStartDate || new Date(meal.discountStartDate) <= now) &&
    (!meal.discountEndDate || new Date(meal.discountEndDate) >= now);

  const displayPrice = discountActive ? meal.discountPrice! : meal.basePrice;
  const savings = discountActive
    ? Math.round(((meal.basePrice - meal.discountPrice!) / meal.basePrice) * 100)
    : 0;

  return (
    <div className="mc">
      <div className="mc__img-wrap">
        {meal.mainImageURL ? (
          <img src={meal.mainImageURL} alt={meal.name} className="mc__img" loading="lazy" />
        ) : (
          <div className="mc__img-placeholder"><UtensilsCrossed size={32} /></div>
        )}
        {meal.isBestseller && <span className="mc__bestseller">★ Bestseller</span>}
      </div>

      <div className="mc__body">
        <div>
          {meal.subcategory && <div className="mc__subcategory">{meal.subcategory}</div>}
          <h3 className="mc__name">{meal.name}</h3>
          {/* <p className="mc__desc">{meal.shortDescription}</p> */}
          {meal.dietaryPreferences?.length > 0 && (
            <div className="mc__dietary" style={{ marginTop: "0.4rem" }}>
              {meal.dietaryPreferences.slice(0, 3).map((d) => (
                <span className="mc__diet-tag" key={d}>{d.replace("_", " ")}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mc__footer">
          <div>
            <div className="mc__price-wrap">
              <span className="mc__price">৳{displayPrice}</span>
              {discountActive && (
                <>
                  <span className="mc__price-original">৳{meal.basePrice}</span>
                  <span className="mc__price-discount">{savings}% off</span>
                </>
              )}
            </div>
            <div className="mc__prep">
              <Clock size={11} />
              {meal.preparationTimeMinutes} min prep
            </div>
          </div>
          <AddToCartButton mealId={meal.id} />
        </div>
      </div>
    </div>
  );
}

interface Review {
  id: string;
  rating: number;
<<<<<<< HEAD
  feedback?: string | null;
  createdAt: string;
  user?: { name?: string; image?: string | null };
=======
  comment?: string;
  createdAt: string;
  customer?: { user?: { name?: string; image?: string } };
>>>>>>> dc5656236feee959b1e0e891718009336b905842
}

interface UniqueCategory { id: string; name: string; }

interface RestaurantData {
  restaurant: {
    id: string;
    businessName: string;
    businessCategory: string;
    bio?: string;
    imageURL?: string;
    businessMainGateURL?: string;
    city: string;
    street?: string;
    totalOrdersCompleted: number;
    avgRating: number;
    reviewCount: number;
    reviews: Review[];
  };
  meals: Meal[];
  meta: {
    uniqueSubcategories: string[];
    uniqueCategories: UniqueCategory[];
    totalMeals: number;
  };
}

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [dietary, setDietary] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (filters: Record<string, string>) => {
    try {
      const res = await getRestaurantById(id, filters as any);
<<<<<<< HEAD
=======
      console.log("Id--------:", res);
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      if (res?.success) setData(res.data);
    } catch { /* silent */ }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const filters: Record<string, string> = { sortBy };
      if (search) filters.search = search;
      if (categoryId) filters.categoryId = categoryId;
      if (subcategory) filters.subcategory = subcategory;
      if (dietary) filters.dietary = dietary;
      fetchData(filters);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, categoryId, subcategory, dietary, sortBy, fetchData]);

  const clearFilters = () => {
    setSearch(""); setCategoryId(""); setSubcategory(""); setDietary(""); setSortBy("newest");
  };
  const hasFilters = search || categoryId || subcategory || dietary || sortBy !== "newest";

  const r = data?.restaurant;

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--cream))" }}>
      {/* Hero */}
      <div className="rd__hero">
        {r?.imageURL || r?.businessMainGateURL ? (
          <img
            src={r.imageURL ?? r.businessMainGateURL}
            alt={r?.businessName}
            className="rd__hero-img"
          />
        ) : (
          <div className="rd__hero-placeholder"><UtensilsCrossed size={96} /></div>
        )}
        <div className="rd__hero-overlay" />
      </div>

      <div className="rd__body">
        {/* Back */}
        <Link href="/restaurants" className="rd__back">
          <ArrowLeft size={14} /> All Restaurants
        </Link>

        {/* Info card */}
        <div className="rd__info-card">
          {loading && !r ? (
            <div className="rd__skeleton">
              {[100, 55, 75, 40].map((w, i) => (
                <div key={i} className="rd__skeleton-bar" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : r ? (
            <>
              <div className="rd__info-left">
                <div className="rd__badge-row">
                  <span className="rd__badge rd__badge--type">{BADGE_LABEL[r.businessCategory] ?? r.businessCategory}</span>
<<<<<<< HEAD
                  <span className="rd__badge rd__badge--city"><MapPin size={10} style={{
                    display: "inline",
                  }} /> {r.city}</span>
=======
                  <span className="rd__badge rd__badge--city"><MapPin size={10} style={{ 
                    display: "inline", }} /> {r.city}</span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                </div>
                <h1 className="rd__name">{r.businessName}</h1>
                {r.bio && <p className="rd__bio">{r.bio}</p>}
                <div className="rd__stats">
                  {r.avgRating > 0 && (
                    <div className="rd__stat">
                      <Star size={14} className="rd__stat-icon" fill="currentColor" />
                      <span className="rd__stat-value">{r.avgRating}</span>
                      <span>({r.reviewCount} reviews)</span>
                    </div>
                  )}
                  <div className="rd__stat">
                    <ShoppingBag size={14} className="rd__stat-icon" />
                    <span className="rd__stat-value">{data?.meta.totalMeals}</span>
                    <span>meals</span>
                  </div>
                  <div className="rd__stat">
                    <Flame size={14} className="rd__stat-icon" />
                    <span className="rd__stat-value">{r.totalOrdersCompleted}</span>
                    <span>orders completed</span>
                  </div>
                  {r.street && (
                    <div className="rd__stat">
                      <MapPin size={14} className="rd__stat-icon" />
                      <span>{r.street}, {r.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {r.avgRating > 0 && (
                <div className="rd__rating-box">
                  <div className="rd__rating-num">{r.avgRating}</div>
                  <div className="rd__rating-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= Math.round(r.avgRating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <div className="rd__rating-count">{r.reviewCount} ratings</div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Content */}
        <div className="rd__content">
          {/* Filter panel */}
          <aside>
            <button
              className="rd__mobile-filter-btn"
              onClick={() => setFilterOpen((v) => !v)}
            >
              <SlidersHorizontal size={15} />
              {filterOpen ? "Hide Filters" : "Show Filters"}
              {hasFilters && " •"}
            </button>

            <div className={`rd__filter-panel ${!filterOpen ? "rd__filter-panel--hidden" : ""}`} id="desktop-filter">
              <div className="rd__filter-title">Filter Meals</div>

              {/* Search */}
              <div className="rd__filter-group">
                <label className="rd__filter-label">Search</label>
                <div style={{ position: "relative" }}>
                  <Search size={12} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))", pointerEvents: "none" }} />
                  <input
                    className="rd__filter-input"
                    style={{ paddingLeft: "2rem" }}
                    placeholder="Search meals…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              {data?.meta.uniqueCategories && data.meta.uniqueCategories.length > 1 && (
                <div className="rd__filter-group">
                  <label className="rd__filter-label">Category</label>
                  <div className="rd__cat-chips">
                    <button
                      className={`rd__cat-chip ${!categoryId ? "rd__cat-chip--active" : ""}`}
                      onClick={() => setCategoryId("")}
                    >All</button>
                    {data.meta.uniqueCategories.map((c) => (
                      <button
                        key={c.id}
                        className={`rd__cat-chip ${categoryId === c.id ? "rd__cat-chip--active" : ""}`}
                        onClick={() => setCategoryId(categoryId === c.id ? "" : c.id)}
                      >{c.name}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategory */}
              {data?.meta.uniqueSubcategories && data.meta.uniqueSubcategories.length > 0 && (
                <div className="rd__filter-group">
                  <label className="rd__filter-label">Sub-Category</label>
                  <div className="rd__cat-chips">
                    <button className={`rd__cat-chip ${!subcategory ? "rd__cat-chip--active" : ""}`} onClick={() => setSubcategory("")}>All</button>
                    {data.meta.uniqueSubcategories.map((s) => s && (
                      <button
                        key={s}
                        className={`rd__cat-chip ${subcategory === s ? "rd__cat-chip--active" : ""}`}
                        onClick={() => setSubcategory(subcategory === s ? "" : s)}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary */}
              <div className="rd__filter-group">
                <label className="rd__filter-label">Dietary</label>
                <select className="rd__filter-select" value={dietary} onChange={(e) => setDietary(e.target.value)}>
                  {DIETARY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              {hasFilters && (
                <button className="rd__clear-btn" onClick={clearFilters}>
                  <X size={12} style={{ display: "inline", marginRight: "0.3rem" }} />Clear filters
                </button>
              )}
            </div>

            {/* Always show filter panel on desktop */}
            <style>{`@media (min-width: 1025px) { .rd__filter-panel--hidden { display: block !important; } }`}</style>
          </aside>

          {/* Meals */}
          <div className="rd__meals">
            <div className="rd__meals-toolbar">
              <p className="rd__meals-count">
                <strong>{data?.meals.length ?? 0}</strong> meal{data?.meals.length !== 1 ? "s" : ""} available
              </p>
              <select className="rd__sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mc" style={{ opacity: 0.5 }}>
                  <div style={{ borderRadius: "0.85rem", background: "hsl(var(--muted))", aspectRatio: "1" }} />
                  <div className="rd__skeleton" style={{ flex: 1 }}>
                    {[80, 55, 70, 40].map((w, j) => (
                      <div key={j} className="rd__skeleton-bar" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              ))
            ) : data?.meals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "hsl(var(--muted-foreground))" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>🍽️</div>
                <h3 style={{ fontFamily: "var(--font-heading)", color: "hsl(var(--wine-deep))", marginBottom: "0.5rem" }}>No meals found</h3>
                <p>Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {data?.meals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
              </div>
            )}

            {/* Reviews */}
            {r && r.reviews && r.reviews.length > 0 && (
              <div className="rd__reviews">
<<<<<<< HEAD
                {/* Section header */}
                <div className="rd__reviews-header">
                  <div>
                    <h2 className="rd__reviews-title">What customers say</h2>
                    <p className="rd__reviews-sub">
                      {r.reviewCount} review{r.reviewCount !== 1 ? "s" : ""} · {r.avgRating} avg rating
                    </p>
                  </div>
                  {/* Mini aggregate strip */}
                  <div className="rd__reviews-agg">
                    <span className="rd__reviews-agg-num">{r.avgRating}</span>
                    <div>
                      <StarRow rating={r.avgRating} />
                      <span className="rd__reviews-agg-label">out of 5</span>
                    </div>
                  </div>
                </div>

                {/* Review cards */}
                <div className="rd__review-grid">
                  {r.reviews.map((rv, idx) => {
                    const name = rv.user?.name ?? "Customer";
                    const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
                    const hasImage = !!rv.user?.image;
                    const ratingLabel =
                      rv.rating >= 4.5 ? "Excellent"
                        : rv.rating >= 3.5 ? "Great"
                          : rv.rating >= 2.5 ? "Okay"
                            : "Poor";

                    return (
                      <div key={rv.id} className="rd__review-card" style={{ animationDelay: `${idx * 60}ms` }}>
                        {/* Rating band at top */}
                        <div className="rd__review-band">
                          <StarRow rating={rv.rating} />
                          <span className="rd__review-rating-label">{ratingLabel}</span>
                          <span className="rd__review-rating-num">{rv.rating.toFixed(1)}</span>
                        </div>

                        {/* Quote / feedback */}
                        {rv.feedback ? (
                          <blockquote className="rd__review-feedback">
                            "{rv.feedback}"
                          </blockquote>
                        ) : (
                          <p className="rd__review-no-text">No written review.</p>
                        )}

                        {/* Footer: avatar + name + date */}
                        <div className="rd__review-footer">
                          <div className="rd__review-avatar">
                            {hasImage ? (
                              <img src={rv.user!.image!} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="rd__review-meta">
                            <div className="rd__review-name">{name}</div>
                            <div className="rd__review-date">
                              {new Date(rv.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

=======
                <h2 className="rd__reviews-title">Customer Reviews</h2>
                <div className="rd__review-grid">
                  {r.reviews.map((rv) => (
                    <div key={rv.id} className="rd__review-card">
                      <div className="rd__review-header">
                        <div className="rd__review-avatar">
                          {rv.customer?.user?.image ? (
                            <img src={rv.customer.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            (rv.customer?.user?.name?.[0] ?? "?").toUpperCase()
                          )}
                        </div>
                        <div className="rd__review-meta">
                          <div className="rd__review-name">{rv.customer?.user?.name ?? "Customer"}</div>
                          <div className="rd__review-date">
                            {new Date(rv.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <StarRow rating={rv.rating} />
                      {rv.comment && <p className="rd__review-text">{rv.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          </div>
        </div>
      </div>
    </div>
  );
}
