import { TrendingTier } from "@/lib/trendingScore";

interface TrendingBadgeProps {
  tier: TrendingTier;
}

const CONFIG = {
  hot: { label: "Trending", icon: "🔥", className: "trending-badge trending-badge--hot" },
  rising: { label: "Rising", icon: "⬆", className: "trending-badge trending-badge--rising" },
  popular: { label: "Popular", icon: "★", className: "trending-badge trending-badge--popular" },
};

export default function TrendingBadge({ tier }: TrendingBadgeProps) {
  if (!tier) return null;
  const { label, icon, className } = CONFIG[tier];
  return (
    <span className={className}>
      <span style={{ fontSize: 11 }}>{icon}</span>
      {label}
    </span>
  );
}