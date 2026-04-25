"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search, MapPin, Star, UtensilsCrossed, ShoppingBag,
  ChefHat, ArrowRight, SlidersHorizontal, X
} from "lucide-react";
// import { getRestaurants, getCategories, type Restaurant } from "./utils";
import { BANGLADESH_DISTRICTS } from "@/constants/bangladeshDistricts";
import "./restaurants.css";
import { getRestaurants, Restaurant } from "@/services/restaurant.service";
import { getCategories } from "./utils";

const BUSINESS_CATEGORIES = [
  { value: "", label: "All Types" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "HOME_KITCHEN", label: "Home Kitchen" },
  { value: "SHOP", label: "Shop" },
  { value: "STREET_FOOD", label: "Street Food" },
];

const badgeClass: Record<string, string> = {
  RESTAURANT: "rc__badge--restaurant",
  HOME_KITCHEN: "rc__badge--home_kitchen",
  SHOP: "rc__badge--shop",
  STREET_FOOD: "rc__badge--street_food",
};
const badgeLabel: Record<string, string> = {
  RESTAURANT: "Restaurant",
  HOME_KITCHEN: "Home Kitchen",
  SHOP: "Shop",
  STREET_FOOD: "Street Food",
};

function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link href={`/restaurants/${r.id}`} className="rc">
      <div className="rc__img-wrap">
        {r.imageURL ? (
          <img src={r.imageURL} alt={r.businessName} className="rc__img" loading="lazy" />
        ) : (
          <div className="rc__img-placeholder">
            <UtensilsCrossed size={48} />
          </div>
        )}
        <div className="rc__img-overlay" />
        <div className="rc__badges">
          <span className={`rc__badge ${badgeClass[r.businessCategory] ?? "rc__badge--restaurant"}`}>
            {badgeLabel[r.businessCategory] ?? r.businessCategory}
          </span>
        </div>
        {r.avgRating > 0 && (
          <div className="rc__rating">
            <Star size={11} fill="currentColor" />
            <span>{r.avgRating}</span>
            <span className="rc__rating-count">({r.reviewCount})</span>
          </div>
        )}
      </div>

      <div className="rc__body">
        <div className="rc__header">
          <h3 className="rc__name">{r.businessName}</h3>
          <span className="rc__city">
            <MapPin size={11} />
            {r.city}
          </span>
        </div>
        {r.bio && <p className="rc__desc">{r.bio}</p>}
        {r.subcategories.length > 0 && (
          <div className="rc__tags">
            {(r.subcategories as string[]).slice(0, 4).map((s) => (
              <span className="rc__tag" key={s}>{s}</span>
            ))}
            {r.subcategories.length > 4 && (
              <span className="rc__tag">+{r.subcategories.length - 4} more</span>
            )}
          </div>
        )}
        <div className="rc__footer">
          <div className="rc__meta">
            <span className="rc__meta-item">
              <ShoppingBag size={12} />
              {r.mealCount} meals
            </span>
            <span className="rc__meta-item">
              <ChefHat size={12} />
              {r.totalOrdersCompleted} orders
            </span>
          </div>
          <span className="rc__view-btn">
            View Menu <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="rp__skeleton-grid">
      {Array.from({ length: 9 }).map((_, i) => (
        <div className="rp__skeleton-card" key={i}>
          <div className="rp__skeleton-img" />
          <div className="rp__skeleton-body">
            <div className="rp__skeleton-line" />
            <div className="rp__skeleton-line rp__skeleton-line--short" />
            <div className="rp__skeleton-line rp__skeleton-line--xs" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface Category { id: string; name: string; slug: string; }

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRestaurants = useCallback(async (filters: Record<string, string | number>) => {
    setLoading(true);
    try {
      const res = await getRestaurants(filters);
      if (res?.success) {
        setRestaurants(res?.data?.data ?? []);
        setTotal(res.data?.meta?.total ?? 0);
        setTotalPages(res.data?.meta?.totalPages ?? 1);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  // Debounced fetch on filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const filters: Record<string, string | number> = { page, limit: 12 };
      if (search) filters.search = search;
      if (city) filters.city = city;
      if (categoryId) filters.categoryId = categoryId;
      if (subcategory) filters.subcategory = subcategory;
      if (businessCategory) filters.businessCategory = businessCategory;
      fetchRestaurants(filters);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, city, categoryId, subcategory, businessCategory, page, fetchRestaurants]);

  // Load categories
  useEffect(() => {
    getCategories().then((res) => {
      if (res?.success) setCategories(res.data ?? []);
    });
  }, []);

  const clearFilters = () => {
    setSearch(""); setCity(""); setCategoryId(""); setSubcategory(""); setBusinessCategory(""); setPage(1);
  };
  const hasFilters = search || city || categoryId || subcategory || businessCategory;

  const FilterPanel = () => (
    <>
      <div className="rp__filter-group" id="search-group">
        <label className="rp__filter-label">Search</label>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))", pointerEvents: "none" }} />
          <input
            className="rp__filter-input"
            style={{ paddingLeft: "2.2rem" }}
            placeholder="Search restaurants…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="rp__filter-group">
        <label className="rp__filter-label">City / District</label>
        <select className="rp__filter-select" value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}>
          <option value="">All Cities</option>
          {BANGLADESH_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="rp__filter-group">
        <label className="rp__filter-label">Food Category</label>
        <select className="rp__filter-select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="rp__filter-group">
        <label className="rp__filter-label">Sub-Category</label>
        <input
          className="rp__filter-input"
          placeholder="e.g. Burger, Pizza, Biryani…"
          value={subcategory}
          onChange={(e) => { setSubcategory(e.target.value); setPage(1); }}
        />
      </div>

      <div className="rp__filter-group">
        <label className="rp__filter-label">Business Type</label>
        <div className="rp__type-chips">
          {BUSINESS_CATEGORIES.map((bc) => (
            <button
              key={bc.value}
              className={`rp__type-chip ${businessCategory === bc.value ? "rp__type-chip--active" : ""}`}
              onClick={() => { setBusinessCategory(bc.value); setPage(1); }}
            >
              {bc.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button className="rp__clear-btn" onClick={clearFilters}>
          <X size={13} style={{ display: "inline", marginRight: "0.35rem" }} />
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <div className="rp">
      {/* Hero */}
      <div className="rp__hero">
        <div className="rp__hero-label">
          <span className="rp__hero-label-line" />
          Explore Platera
          <span className="rp__hero-label-line" />
        </div>
        <h1 className="rp__hero-title">
          All <em>Restaurants</em>
        </h1>
        <p className="rp__hero-desc">
          Discover home kitchens, restaurants and street food near you — fresh, local, delivered fast.
        </p>
      </div>

      <div className="rp__body">
        {/* Sidebar */}
        <aside className="rp__sidebar">
          <div className="rp__sidebar-title">
            <SlidersHorizontal size={16} />
            Filters
          </div>
          <FilterPanel />
        </aside>

        {/* Main */}
        <main className="rp__main">
          {/* Mobile search */}
          <div className="rp__mobile-search">
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))", pointerEvents: "none" }} />
              <input
                className="rp__filter-input"
                style={{ paddingLeft: "2.3rem" }}
                placeholder="Search restaurants…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div className="rp__toolbar">
            <p className="rp__count">
              {loading ? "Loading…" : <><strong>{total}</strong> restaurant{total !== 1 ? "s" : ""} found</>}
            </p>
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : restaurants.length === 0 ? (
            <div className="rp__grid">
              <div className="rp__empty">
                <div className="rp__empty-icon">🍽️</div>
                <h3>No restaurants found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rp__grid">
                {restaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
              </div>

              {totalPages > 1 && (
                <div className="rp__pagination">
                  <button className="rp__page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                    return (
                      <button key={p} className={`rp__page-btn ${page === p ? "rp__page-btn--active" : ""}`} onClick={() => setPage(p)}>
                        {p}
                      </button>
                    );
                  })}
                  <button className="rp__page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
