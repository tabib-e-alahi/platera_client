"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import {
  Plus, ToggleLeft, ToggleRight, Search, UtensilsCrossed,
  ShoppingBag, Eye, EyeOff, ChefHat
} from "lucide-react"
import { toast } from "sonner"
import { getMyMeals, getCategories, toggleMealAvailability } from "@/services/provider.service"

interface IMeal {
  id: string
  name: string
  shortDescription: string
  mainImageURL: string
  basePrice: number
  discountPrice: number | null
  isAvailable: boolean
  isBestseller?: boolean
  isFeatured?: boolean
  category: { id: string; name: string }
  subcategory: string | null
}
interface ICategory { id: string; name: string }

export default function MenuPage() {
  const [meals, setMeals] = useState<IMeal[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 12

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [availFilter, setAvailFilter] = useState<boolean | undefined>(undefined)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalPages = Math.ceil(total / limit)
  const available = meals.filter(m => m.isAvailable).length
  const unavailable = meals.filter(m => !m.isAvailable).length

  const fetchMeals = useCallback(async (opts?: { pg?: number; s?: string; cat?: string; avail?: boolean | undefined }) => {
    try {
      setIsLoading(true)
      const res = await getMyMeals({
        page: opts?.pg ?? page,
        limit,
        search: (opts?.s ?? search) || undefined,
        categoryId: (opts?.cat ?? selectedCategory) || undefined,
        isAvailable: "avail" in (opts ?? {}) ? opts!.avail : availFilter,
      })
      setMeals(res?.data?.meals ?? [])
      setTotal(res?.data?.pagination?.total ?? 0)
    } catch { toast.error("Failed to load meals.") }
    finally { setIsLoading(false) }
  }, [page, search, selectedCategory, availFilter])

  useEffect(() => {
    getCategories().then(res => setCategories(res?.data ?? [])).catch(() => {})
  }, [])

  useEffect(() => { fetchMeals() }, [page, selectedCategory, availFilter])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchMeals({ pg: 1, s: val })
    }, 380)
  }

  const handleToggle = async (e: React.MouseEvent, meal: IMeal) => {
    e.preventDefault(); e.stopPropagation()
    try {
      await toggleMealAvailability(meal.id)
      setMeals(prev => prev.map(m => m.id === meal.id ? { ...m, isAvailable: !m.isAvailable } : m))
      toast.success(`${meal.name} marked as ${!meal.isAvailable ? "available" : "unavailable"}.`)
    } catch { toast.error("Failed to update availability.") }
  }

  const disc = (m: IMeal) => {
    if (!m.discountPrice) return null
    return Math.round(((m.basePrice - m.discountPrice) / m.basePrice) * 100)
  }

  return (
    <div className="menu-page">
      {/* Header */}
      <div className="menu-header">
        <div className="menu-header__left">
          <div className="menu-eyebrow">
            <span className="menu-eyebrow-line" />
            Provider Dashboard
            <span className="menu-eyebrow-line" />
          </div>
          <h1 className="menu-title">My Menu</h1>
          <p className="menu-count"><strong>{total}</strong> meal{total !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/provider-dashboard/add-meal" className="menu-add-btn">
          <Plus size={16} /> Add Meal
        </Link>
      </div>

      {/* Stats */}
      <div className="menu-stats">
        {[
          { icon: <UtensilsCrossed size={18} />, cls: "gold", value: total, label: "Total Meals" },
          { icon: <Eye size={18} />, cls: "green", value: available, label: "Available" },
          { icon: <EyeOff size={18} />, cls: "red", value: unavailable, label: "Unavailable" },
          { icon: <ChefHat size={18} />, cls: "wine", value: categories.length, label: "Categories" },
        ].map(({ icon, cls, value, label }) => (
          <div className="menu-stat-card" key={label}>
            <div className={`menu-stat-icon menu-stat-icon--${cls}`}>{icon}</div>
            <div className="menu-stat-info">
              <div className="menu-stat-value">{value}</div>
              <div className="menu-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <div className="menu-search-wrap">
          <Search size={14} className="menu-search-icon" />
          <input
            className="menu-search"
            placeholder="Search meals…"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="menu-filter-divider" />

        <div className="menu-filter-chips">
          <button
            className={`menu-chip ${selectedCategory === "" ? "menu-chip--active" : ""}`}
            onClick={() => { setSelectedCategory(""); setPage(1) }}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`menu-chip ${selectedCategory === cat.id ? "menu-chip--active" : ""}`}
              onClick={() => { setSelectedCategory(cat.id); setPage(1) }}
            >{cat.name}</button>
          ))}
        </div>

        <div className="menu-avail-filter">
          {[
            { label: "All", val: undefined },
            { label: "Available", val: true, dot: "green" },
            { label: "Unavailable", val: false, dot: "red" },
          ].map(({ label, val, dot }) => (
            <button
              key={label}
              className={`menu-avail-btn ${availFilter === val ? "menu-avail-btn--active" : ""}`}
              onClick={() => { setAvailFilter(val); setPage(1) }}
            >
              {dot && <span className={`menu-avail-dot menu-avail-dot--${dot}`} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="menu-skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="menu-skeleton-card" key={i}>
              <div className="menu-skeleton-img" />
              <div className="menu-skeleton-body">
                <div className="menu-skeleton-line" style={{ width: "70%" }} />
                <div className="menu-skeleton-line" style={{ width: "45%" }} />
                <div className="menu-skeleton-line" style={{ width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div className="menu-grid">
          <div className="menu-empty">
            <div className="menu-empty-icon"><UtensilsCrossed size={32} /></div>
            <p className="menu-empty-text">No meals found</p>
            <p className="menu-empty-hint">Try a different filter, or add your first meal.</p>
          </div>
        </div>
      ) : (
        <div className="menu-grid">
          {meals.map(meal => {
            const savings = disc(meal)
            return (
              <Link key={meal.id} href={`/provider-dashboard/menu/${meal.id}`} className="meal-card">
                <div className="meal-card__image">
                  {meal.mainImageURL
                    ? <img src={meal.mainImageURL} alt={meal.name} loading="lazy" />
                    : <div className="meal-card__image-placeholder"><UtensilsCrossed size={36} /></div>
                  }
                  <div className="meal-card__overlay" />

                  {/* badges */}
                  <div className="meal-card__badges">
                    {meal.isBestseller && <span className="meal-card__badge meal-card__badge--bestseller">★ Bestseller</span>}
                    {meal.isFeatured && <span className="meal-card__badge meal-card__badge--featured">Featured</span>}
                  </div>

                  {!meal.isAvailable && (
                    <div className="meal-card__unavailable-badge">
                      <span className="meal-card__unavailable-pill">Unavailable</span>
                    </div>
                  )}
                </div>

                <div className="meal-card__info">
                  <div className="meal-card__meta">
                    {meal.category.name}{meal.subcategory && ` · ${meal.subcategory}`}
                  </div>
                  <h3 className="meal-card__name">{meal.name}</h3>
                  <p className="meal-card__desc">{meal.shortDescription}</p>

                  <div className="meal-card__footer">
                    <div className="meal-card__price">
                      <span className="meal-card__price-current">
                        ৳{meal.discountPrice ?? meal.basePrice}
                      </span>
                      {meal.discountPrice && (
                        <span className="meal-card__price-original">৳{meal.basePrice}</span>
                      )}
                      {savings && <span className="meal-card__price-tag">{savings}% off</span>}
                    </div>

                    <button
                      className={`meal-card__toggle ${meal.isAvailable ? "meal-card__toggle--on" : "meal-card__toggle--off"}`}
                      onClick={e => handleToggle(e, meal)}
                    >
                      {meal.isAvailable ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {meal.isAvailable ? "Live" : "Off"}
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="menu-pagination">
          <button className="menu-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | "…")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…")
              acc.push(p); return acc
            }, [])
            .map((p, i) =>
              p === "…"
                ? <span key={`d${i}`} style={{ fontSize: "0.82rem", color: "hsl(var(--muted-foreground))", padding: "0 0.2rem" }}>…</span>
                : <button key={p} className={`menu-page-btn ${page === p ? "menu-page-btn--active" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
            )}
          <button className="menu-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>→</button>
        </div>
      )}
    </div>
  )
}
