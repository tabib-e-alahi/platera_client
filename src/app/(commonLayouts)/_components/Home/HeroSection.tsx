"use client"
import { Playfair_Display } from 'next/font/google';
import Image from "next/image"
import { Star, Clock, Store, ArrowRight, Flame, UtensilsCrossed } from "lucide-react"
import "./hero.css"
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

export default function HeroSection() {
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
              <span className="hero__float-value">4.8 / 5.0</span>
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
            <span className="hero__stat-number">500+</span>
            <span className="hero__stat-label">Restaurants</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <Flame size={20} style={{ color: 'var(--gold)' }} />
            <span className="hero__stat-number">50+</span>
            <span className="hero__stat-label">Cuisines</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <UtensilsCrossed size={20} style={{ color: 'var(--gold)' }} />
            <span className="hero__stat-number">100K+</span>
            <span className="hero__stat-label">Happy Foodies</span>
          </div>
        </div>
      </div>
    </section>
  )
}