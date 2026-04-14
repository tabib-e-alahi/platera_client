// src/components/home/FilterChips.tsx
"use client";

import { useState } from "react";
import "./filter-chips.css";

const chips = [
  { label: "🌱 Vegan", value: "vegan" },
  { label: "🍔 Fast Food", value: "fast-food" },
  { label: "💰 Budget", value: "budget" },
  { label: "👑 Premium", value: "premium" },
  { label: "📍 Nearby", value: "nearby" },
  { label: "⭐ Top Rated", value: "top-rated" },
  { label: "🚀 Free Delivery", value: "free-delivery" },
  { label: "✨ New", value: "new" },
];

export default function FilterChips() {
  const [active, setActive] = useState("vegan");

  return (
    <section className="filter-chips">
      <div className="container">
        <div className="filter-chips__scroll">
          {chips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActive(chip.value)}
              className={`filter-chips__item ${
                active === chip.value
                  ? "filter-chips__item--active"
                  : ""
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}