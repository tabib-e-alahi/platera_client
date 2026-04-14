"use client"

import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import "./top-dishes.css";

const categories = ["All", "Mains", "Seafood", "Pasta", "Desserts"];

const dishes = [
  {
    name: "Herb-Crusted Salmon",
    category: "Seafood",
    description: "Pan-seared with lemon butter, asparagus & microgreens",
    price: 34,
    rating: 4.9,
    image: "dish-salmon.jpg",
    badge: "popular" as const,
  },
  {
    name: "Wagyu Beef Tenderloin",
    category: "Mains",
    description: "Red wine reduction, truffle mash & roasted roots",
    price: 52,
    rating: 4.8,
    image: "dish-steak.jpg",
    badge: null,
  },
  {
    name: "Burrata & Tomato Pasta",
    category: "Pasta",
    description: "Fresh burrata, cherry tomatoes, basil & olive oil",
    price: 26,
    rating: 4.7,
    image: "dish-pasta.jpg",
    badge: "new" as const,
  },
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    description: "Vanilla ice cream, raspberry coulis & gold leaf",
    price: 18,
    rating: 4.9,
    image: "dish-dessert.jpg",
    badge: "popular" as const,
  },
  {
    name: "Tuna Poke Bowl",
    category: "Seafood",
    description: "Fresh tuna, avocado, edamame & sesame dressing",
    price: 28,
    rating: 4.6,
    image: "dish-poke.jpg",
    badge: null,
  },
  {
    name: "Grilled Lobster Tail",
    category: "Seafood",
    description: "Garlic herb butter, lemon & seasonal greens",
    price: 48,
    rating: 4.9,
    image: "dish-lobster.jpg",
    badge: "new" as const,
  },
];

const TopDishes = () => {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? dishes : dishes.filter((d) => d.category === active);

  return (
    <section className="menu" id="menu">
      <div className="menu__container">
        <div className="menu__header">
          <div className="menu__subtitle">
            <span className="menu__subtitle-line" />
            Curated for You
            <span className="menu__subtitle-line" />
          </div>
          <h2 className="menu__title">
            Our <em>Signature</em> Collection
          </h2>
          <p className="menu__description">
            Every plate is a canvas — seasonally inspired, locally sourced,
            and crafted by our award-winning culinary team.
          </p>
        </div>

        <div className="menu__tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu__tab ${active === cat ? "menu__tab--active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="menu__grid">
          {filtered.map((dish) => (
            <div className="menu__card" key={dish.name}>
              <div className="menu__card-image-wrapper">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="menu__card-image"
                  loading="lazy"
                  width={640}
                  height={480}
                />
                {dish.badge && (
                  <span
                    className={`menu__card-badge menu__card-badge--${dish.badge}`}
                  >
                    {dish.badge === "popular" ? "★ Popular" : "New"}
                  </span>
                )}
                <div className="menu__card-rating">
                  <Star
                    size={11}
                    className="menu__card-rating-star"
                    fill="currentColor"
                  />
                  <span className="menu__card-rating-value">{dish.rating}</span>
                </div>
                <div className="menu__card-overlay" />
              </div>
              <div className="menu__card-body">
                <div className="menu__card-category">{dish.category}</div>
                <h3 className="menu__card-name">{dish.name}</h3>
                <p className="menu__card-desc">{dish.description}</p>
                <div className="menu__card-footer">
                  <span className="menu__card-price">
                    <span className="menu__card-price-currency">$</span>
                    {dish.price}
                  </span>
                  <button className="menu__card-btn">Order Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="menu__cta">
          <button className="menu__cta-btn">
            View Full Menu
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopDishes;
