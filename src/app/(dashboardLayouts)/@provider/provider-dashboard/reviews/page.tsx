"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getProviderReviews, TProviderReviewsResponse, TReview } from "@/services/review.service";
import "./provider-reviews.css";


const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const STAR_FILTERS = [
  { label: "All",  value: undefined },
  { label: "5★",   value: 5 },
  { label: "4★",   value: 4 },
  { label: "3★",   value: 3 },
  { label: "2★",   value: 2 },
  { label: "1★",   value: 1 },
] as const;

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="prev2-stars">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= Math.floor(rating);
        const half   = !filled && s - rating < 1 && s - rating > 0;
        return (
          <svg
            key={s}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            className={`prev2-star${filled ? " prev2-star--on" : half ? " prev2-star--half" : ""}`}
          >
            <defs>
              {half && (
                <linearGradient id={`half-${s}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="hsl(38 70% 52%)" />
                  <stop offset="50%" stopColor="hsl(30 15% 88%)" />
                </linearGradient>
              )}
            </defs>
            <path
              fill={half ? `url(#half-${s})` : "currentColor"}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      })}
    </span>
  );
}


function RatingBar({ star, count, total, active, onClick }: {
  star: number; count: number; total: number;
  active: boolean; onClick: () => void;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <button className={`prev2-bar${active ? " prev2-bar--active" : ""}`} onClick={onClick}>
      <span className="prev2-bar__label">{star}</span>
      <svg className="prev2-bar__star-icon" width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="prev2-bar__track">
        <div className="prev2-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="prev2-bar__count">{count}</span>
    </button>
  );
}

/* ─── Avatar ───────────────────────────────────────────────────────────────── */
function Avatar({ name, image }: { name: string; image?: string | null }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (image) return <img src={image} alt={name} className="prev2-avatar" />;
  return <div className="prev2-avatar prev2-avatar--init">{initials}</div>;
}

/* ─── ReviewCard ───────────────────────────────────────────────────────────── */
function ReviewCard({ review, index }: { review: TReview; index: number }) {
  return (
    <div className="prev2-card" style={{ animationDelay: `${index * 55}ms` }}>
      {/* Left accent strip coloured by rating */}
      <div
        className="prev2-card__strip"
        style={{
          background:
            review.rating >= 4.5 ? "hsl(38 70% 52%)"
            : review.rating >= 3  ? "hsl(200 60% 52%)"
            : "hsl(0 65% 55%)",
        }}
      />

      <div className="prev2-card__body">
        {/* Top row */}
        <div className="prev2-card__top">
          <Avatar name={review.user.name} image={review.user.image} />

          <div className="prev2-card__meta">
            <p className="prev2-card__name">{review.user.name}</p>
            <div className="prev2-card__star-row">
              <StarRow rating={review.rating} size={13} />
              <span className="prev2-card__rating-num">{review.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="prev2-card__right">
            <p className="prev2-card__date">{fmt(review.createdAt)}</p>
            {review.order && (
              <p className="prev2-card__order">#{review.order.orderNumber}</p>
            )}
          </div>
        </div>

        {/* Meal badge */}
        <div className="prev2-card__meal">
          <span className="prev2-card__meal-dot" />
          {review.meal.name}
        </div>

        {/* Feedback */}
        {review.feedback && (
          <blockquote className="prev2-card__quote">
            {review.feedback}
          </blockquote>
        )}
      </div>
    </div>
  );
}

/* ─── HeroStats ────────────────────────────────────────────────────────────── */
function HeroStats({
  stats,
  total,
  activeFilter,
  onFilterChange,
}: {
  stats: TProviderReviewsResponse["stats"];
  total: number;
  activeFilter: number | undefined;
  onFilterChange: (v: number | undefined) => void;
}) {
  const avg = stats.averageRating;

  // Determine sentiment label
  const sentiment =
    avg >= 4.5 ? "Excellent"
    : avg >= 4   ? "Great"
    : avg >= 3   ? "Good"
    : avg >= 2   ? "Fair"
    : "Needs work";

  return (
    <div className="prev2-hero">
      {/* Left — big number */}
      <div className="prev2-hero__score">
        <p className="prev2-hero__eyebrow">Overall rating</p>
        <div className="prev2-hero__avg-row">
          <span className="prev2-hero__avg">{avg > 0 ? avg.toFixed(1) : "—"}</span>
          <span className="prev2-hero__max">/5</span>
        </div>
        <StarRow rating={avg} size={18} />
        <div className="prev2-hero__tags">
          <span className="prev2-hero__sentiment">{sentiment}</span>
          <span className="prev2-hero__count">
            {total.toLocaleString()} review{total !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="prev2-hero__divider" />

      {/* Right — bars */}
      <div className="prev2-hero__bars">
        {[5, 4, 3, 2, 1].map((s) => (
          <RatingBar
            key={s}
            star={s}
            count={stats.breakdown[s] ?? 0}
            total={stats.totalReviews}
            active={activeFilter === s}
            onClick={() => onFilterChange(activeFilter === s ? undefined : s)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="prev2">
      <div className="prev2__header">
        <div className="prev2-sk prev2-sk--eyebrow" />
        <div className="prev2-sk prev2-sk--title" />
      </div>
      <div className="prev2-sk prev2-sk--hero" />
      <div className="prev2-sk prev2-sk--card" />
      <div className="prev2-sk prev2-sk--card" />
      <div className="prev2-sk prev2-sk--card" />
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ProviderReviewsPage() {
  const [data,       setData]       = useState<TProviderReviewsResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [starFilter, setStarFilter] = useState<number | undefined>(undefined);
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async (p: number, star: number | undefined) => {
    setLoading(true);
    try {
      const res = await getProviderReviews({ page: p, limit: 8, rating: star });
      setData(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, starFilter); }, [page, starFilter, load]);

  const handleFilter = (star: number | undefined) => {
    setStarFilter(star);
    setPage(1);
  };

  const handlePage = (next: number) => {
    setPage(next);
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  if (loading && !data) return <Skeleton />;

  const reviews    = data?.reviews    ?? [];
  const stats      = data?.stats;
  const pagination = data?.pagination;

  return (
    <div className="prev2">

      {/* ── Page header ── */}
      <div className="prev2__header">
        <p className="prev2__eyebrow">Provider Dashboard</p>
        <h1 className="prev2__title">Customer Reviews</h1>
        <p className="prev2__subtitle">
          What your customers are saying about your food.
        </p>
      </div>

      {/* ── Hero stats block ── */}
      {stats && stats.totalReviews > 0 ? (
        <HeroStats
          stats={stats}
          total={pagination?.total ?? stats.totalReviews}
          activeFilter={starFilter}
          onFilterChange={handleFilter}
        />
      ) : stats && stats.totalReviews === 0 ? null : null}

      {/* ── Filter chips (All + each star) ── */}
      {stats && stats.totalReviews > 0 && (
        <div className="prev2__chips">
          {STAR_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              className={`prev2__chip${starFilter === f.value ? " prev2__chip--on" : ""}`}
              onClick={() => handleFilter(f.value)}
            >
              {f.label}
              {f.value === undefined && stats.totalReviews > 0 && (
                <span className="prev2__chip-count">{stats.totalReviews}</span>
              )}
            </button>
          ))}

          {/* Loading indicator inline */}
          {loading && <span className="prev2__spinner" aria-label="Loading" />}
        </div>
      )}

      {/* ── Review list ── */}
      <div ref={listRef}>
        {reviews.length === 0 && !loading ? (
          <div className="prev2__empty">
            <div className="prev2__empty-icon">
              {starFilter ? "🔍" : "⭐"}
            </div>
            <p className="prev2__empty-title">
              {starFilter
                ? `No ${starFilter}-star reviews yet`
                : "No reviews yet"}
            </p>
            <p className="prev2__empty-hint">
              {starFilter
                ? "Try a different star filter."
                : "Reviews appear here once customers rate their delivered orders."}
            </p>
          </div>
        ) : (
          <div className={`prev2__list${loading ? " prev2__list--fading" : ""}`}>
            {reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="prev2__pag">
          <button
            className="prev2__pag-btn"
            disabled={!pagination.hasPrevPage || loading}
            onClick={() => handlePage(page - 1)}
          >
            ← Previous
          </button>

          <div className="prev2__pag-pages">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - page) <= 1
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && (arr[idx - 1] as number) + 1 !== p) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="prev2__pag-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`prev2__pag-num${page === p ? " prev2__pag-num--active" : ""}`}
                    onClick={() => handlePage(p as number)}
                    disabled={loading}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            className="prev2__pag-btn"
            disabled={!pagination.hasNextPage || loading}
            onClick={() => handlePage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}