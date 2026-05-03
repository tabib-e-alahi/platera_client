import { TTopDish } from "@/app/(commonLayouts)/_components/Home/TopDishes/TopDishes";

export type TrendingTier = "hot" | "rising" | "popular" | null;

export interface ScoredDish extends TTopDish {
  trendingScore: number;
  trendingTier: TrendingTier;
}

/**
 * Pure client-side AI trending score.
 * Uses existing orderCount, avgRating, reviewCount — zero API calls.
 *
 * Score = 0.50 * normalizedOrders + 0.30 * normalizedRating + 0.20 * normalizedReviews
 *
 * Tiers (based on score percentile within the current dataset):
 *   Top 20%  → "hot"     🔥 Trending
 *   20–40%   → "rising"  ⬆ Rising
 *   40–60%   → "popular" ★ Popular
 *   Bottom   → null
 */
export function scoreDishes(dishes: TTopDish[]): ScoredDish[] {
  if (!dishes.length) return [];

  const maxOrders = Math.max(...dishes.map((d) => d.orderCount), 1);
  const maxReviews = Math.max(...dishes.map((d) => d.reviewCount), 1);

  const scored = dishes.map((dish) => {
    const normOrders = dish.orderCount / maxOrders;
    const normRating = dish.avgRating / 5;
    const normReviews = dish.reviewCount / maxReviews;

    const trendingScore =
      0.5 * normOrders + 0.3 * normRating + 0.2 * normReviews;

    return { ...dish, trendingScore, trendingTier: null as TrendingTier };
  });

  // Sort by score to find percentile thresholds
  const sorted = [...scored].sort((a, b) => b.trendingScore - a.trendingScore);
  const hotCutoff = sorted[Math.floor(sorted.length * 0.2)]?.trendingScore ?? 0;
  const risingCutoff = sorted[Math.floor(sorted.length * 0.4)]?.trendingScore ?? 0;
  const popularCutoff = sorted[Math.floor(sorted.length * 0.6)]?.trendingScore ?? 0;

  return scored.map((dish) => ({
    ...dish,
    trendingTier:
      dish.trendingScore >= hotCutoff
        ? "hot"
        : dish.trendingScore >= risingCutoff
        ? "rising"
        : dish.trendingScore >= popularCutoff
        ? "popular"
        : null,
  }));
}