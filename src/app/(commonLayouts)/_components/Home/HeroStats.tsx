import { Playfair_Display } from 'next/font/google';
import { Store, Flame, UtensilsCrossed } from "lucide-react"
import "./hero.css"
import { getHeroStats } from '@/services/public.service';
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});


function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  return `${n}+`;
}

function formatRating(avg: number): string {
  return avg > 0 ? `${avg.toFixed(1)} / 5.0` : "— / 5.0";
}


export default async function HeroStats() {

  const stats = await getHeroStats();

  const restaurantLabel  = formatCount(stats.restaurantCount);
  const cuisineLabel     = formatCount(stats.cuisineCount);
  const foodiesLabel     = formatCount(stats.happyFoodiesCount);

  return (
    stats?.restaurantCount > 15 && (
      <div className="hero__stats">
        <div className="hero__stats-inner">
          <div className="hero__stat">
            <Store size={20} style={{ color: 'var(--gold)' }} />
            <span className="hero__stat-number">{restaurantLabel}</span>
            <span className="hero__stat-label">Restaurants</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <Flame size={20} style={{ color: 'var(--gold)' }} />
            <span className="hero__stat-number">{cuisineLabel}</span>
            <span className="hero__stat-label">Cuisines</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <UtensilsCrossed size={20} style={{ color: 'var(--gold)' }} />
            <span className="hero__stat-number">{foodiesLabel}</span>
            <span className="hero__stat-label">Happy Foodies</span>
          </div>
        </div>
      </div>
    )
  )
}