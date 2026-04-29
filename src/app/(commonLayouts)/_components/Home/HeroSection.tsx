<<<<<<< HEAD
import { Playfair_Display } from 'next/font/google';
import { Star, Clock, Store, ArrowRight, Flame, UtensilsCrossed } from "lucide-react"
import "./hero.css"
import { getHeroStats } from '@/services/public.service';
=======
"use client"
import { Playfair_Display } from 'next/font/google';
import Image from "next/image"
import { Star, Clock, Store, ArrowRight, Flame, UtensilsCrossed } from "lucide-react"
import "./hero.css"
>>>>>>> dc5656236feee959b1e0e891718009336b905842
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

<<<<<<< HEAD

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  return `${n}+`;
}

function formatRating(avg: number): string {
  return avg > 0 ? `${avg.toFixed(1)} / 5.0` : "— / 5.0";
}


export default async function HeroSection() {

   const stats = await getHeroStats();

  const restaurantLabel  = formatCount(stats.restaurantCount);
  const cuisineLabel     = formatCount(stats.cuisineCount);
  const foodiesLabel     = formatCount(stats.happyFoodiesCount);
  const ratingLabel      = formatRating(stats.averageRating);

=======
export default function HeroSection() {
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  return (
     <section className="hero">
      <div className="hero__overlay" />

      <div className="hero__container">
        {/* Left Content */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            #1 Food Discovery Platform
          </div>

          <h1 className="hero__title">
            Discover the Best
            <br />
            Dining <span className="hero__title-accent">Near You</span>
          </h1>

          <p className="hero__description">
            From hidden gems to award-winning restaurants — explore menus,
            read reviews, and reserve tables at hundreds of handpicked
            dining spots, all in one place.
          </p>

          <div className="hero__actions">
            <button className="hero__btn-primary">
              Explore Restaurants
              <ArrowRight size={18} />
            </button>
            <button className="hero__btn-secondary">
              How It Works
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hero__visual">
          <div className="hero__ring" />

          <div className="hero__image-wrapper">
            <img
              src="hero-food.jpg"
              alt="Beautifully plated gourmet dish"
              className="hero__image"
              width={540}
              height={472}
            />
          </div>

          {/* Floating card: Rating */}
          <div className="hero__float hero__float--top">
            <div className="hero__float-icon">
              <Star size={18} />
            </div>
            <div className="hero__float-text">
              <span className="hero__float-label">Avg. Rating</span>
<<<<<<< HEAD
              <span className="hero__float-value">{ratingLabel}</span>
=======
              <span className="hero__float-value">4.8 / 5.0</span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            </div>
          </div>

          {/* Floating card */}
          <div className="hero__float hero__float--bottom">
            <div className="hero__float-icon">
              <Clock size={18} />
            </div>
            <div className="hero__float-text">
              <span className="hero__float-label">Delivery</span>
              <span className="hero__float-value">Under 30 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="hero__stats">
        <div className="hero__stats-inner">
          <div className="hero__stat">
            <Store size={20} style={{ color: 'var(--gold)' }} />
<<<<<<< HEAD
            <span className="hero__stat-number">{restaurantLabel}</span>
=======
            <span className="hero__stat-number">500+</span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            <span className="hero__stat-label">Restaurants</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <Flame size={20} style={{ color: 'var(--gold)' }} />
<<<<<<< HEAD
            <span className="hero__stat-number">{cuisineLabel}</span>
=======
            <span className="hero__stat-number">50+</span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            <span className="hero__stat-label">Cuisines</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <UtensilsCrossed size={20} style={{ color: 'var(--gold)' }} />
<<<<<<< HEAD
            <span className="hero__stat-number">{foodiesLabel}</span>
=======
            <span className="hero__stat-number">100K+</span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            <span className="hero__stat-label">Happy Foodies</span>
          </div>
        </div>
      </div>
    </section>
  )
}