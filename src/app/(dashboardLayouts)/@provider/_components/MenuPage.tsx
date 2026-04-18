
"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { toast } from "sonner"
import {
  getMyMeals,
  getCategories,
  toggleMealAvailability,
} from "@/services/provider.service"

interface IMeal {
  id: string
  name: string
  shortDescription: string
  mainImageURL: string
  basePrice: number
  discountPrice: number | null
  isAvailable: boolean
  category: { id: string; name: string }
  subcategory: string | null
}

interface ICategory { id: string; name: string }

export default function MenuPage() {
  const router = useRouter()

  const [meals, setMeals] = useState<IMeal[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 12

  // filters
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [availFilter, setAvailFilter] = useState<boolean | undefined>(undefined)

  const totalPages = Math.ceil(total / limit)

  const fetchMeals = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getMyMeals({
        page,
        limit,
        search: search || undefined,
        categoryId: selectedCategory || undefined,
        isAvailable: availFilter,
      })
      setMeals(res?.data?.meals ?? [])
      setTotal(res?.data?.pagination?.total ?? 0)
    } catch {
      toast.error("Failed to load meals.")
    } finally {
      setIsLoading(false)
    }
  }, [page, search, selectedCategory, availFilter])

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res?.data ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      fetchMeals()
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleToggle = async (
    e: React.MouseEvent,
    meal: IMeal
  ) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await toggleMealAvailability(meal.id)
      setMeals((prev) =>
        prev.map((m) =>
          m.id === meal.id
            ? { ...m, isAvailable: !m.isAvailable }
            : m
        )
      )
      toast.success(
        `${meal.name} marked as ${
          !meal.isAvailable ? "available" : "unavailable"
        }.`
      )
    } catch {
      toast.error("Failed to update availability.")
    }
  }

  return (
    <div className="menu-page">

      <div className="menu-header">
        <div>
          <h1 className="menu-title">My menu</h1>
          <p className="menu-count">
            {total} meal{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/provider-dashboard/add-meal"
          className="menu-add-btn"
        >
          <Plus size={16} />
          Add meal
        </Link>
      </div>

      {/* filters */}
      <div className="menu-filters">
        <input
          className="menu-search"
          placeholder="Search meals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="menu-filter-chips">
          <button
            className={`menu-chip ${
              selectedCategory === "" ? "menu-chip--active" : ""
            }`}
            onClick={() => {
              setSelectedCategory("")
              setPage(1)
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`menu-chip ${
                selectedCategory === cat.id
                  ? "menu-chip--active"
                  : ""
              }`}
              onClick={() => {
                setSelectedCategory(cat.id)
                setPage(1)
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="menu-avail-filter">
          {[
            { label: "All", val: undefined },
            { label: "Available", val: true },
            { label: "Unavailable", val: false },
          ].map(({ label, val }) => (
            <button
              key={label}
              className={`menu-avail-btn ${
                availFilter === val ? "menu-avail-btn--active" : ""
              }`}
              onClick={() => {
                setAvailFilter(val)
                setPage(1)
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      {isLoading ? (
        <div
          style={{
            color: "hsl(20 10% 55%)",
            fontSize: 14,
            padding: "40px 0",
          }}
        >
          Loading meals…
        </div>
      ) : meals.length === 0 ? (
        <div className="menu-empty">
          <span className="menu-empty-icon">🍽️</span>
          <p className="menu-empty-text">No meals found</p>
          <p className="menu-empty-hint">
            Try a different filter or add your first meal.
          </p>
        </div>
      ) : (
        <div className="menu-grid">
          {meals.map((meal) => (
            <Link
              key={meal.id}
              href={`/provider-dashboard/menu/${meal.id}`}
              className="meal-card"
            >
              <div className="meal-card__image">
                {meal.mainImageURL ? (
                  <img
                    src={meal.mainImageURL}
                    alt={meal.name}
                  />
                ) : (
                  <div className="meal-card__image-placeholder">
                    🍴
                  </div>
                )}
                {!meal.isAvailable && (
                  <div className="meal-card__unavailable">
                    Unavailable
                  </div>
                )}
              </div>

              <div className="meal-card__info">
                <h3 className="meal-card__name">{meal.name}</h3>
                <p className="meal-card__category">
                  {meal.category.name}
                  {meal.subcategory && ` · ${meal.subcategory}`}
                </p>

                <div className="meal-card__footer">
                  <div className="meal-card__price">
                    <span className="meal-card__price-current">
                      ৳
                      {meal.discountPrice ?? meal.basePrice}
                    </span>
                    {meal.discountPrice && (
                      <span className="meal-card__price-original">
                        ৳{meal.basePrice}
                      </span>
                    )}
                  </div>

                  <button
                    className="meal-card__toggle"
                    onClick={(e) => handleToggle(e, meal)}
                  >
                    {meal.isAvailable ? (
                      <ToggleRight size={14} />
                    ) : (
                      <ToggleLeft size={14} />
                    )}
                    {meal.isAvailable ? "On" : "Off"}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="menu-pagination">
          <button
            className="menu-page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) {
                acc.push("...")
              }
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  style={{
                    fontSize: 13,
                    color: "hsl(20 10% 55%)",
                  }}
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`menu-page-btn ${
                    page === p ? "menu-page-btn--active" : ""
                  }`}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </button>
              )
            )}

          <button
            className="menu-page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}