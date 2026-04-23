"use client";

import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getHomeTestimonials } from "@/services/public.service";
import "./testimonials.css";


export type TTestimonial = {
  id: string;
  rating: number;
  feedback: string;
  createdAt: string;
  user: { name: string; image?: string | null };
  meal: { name: string };
  provider: { businessName: string; city: string };
};


function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}


function TestimonialSkeleton() {
  return (
    <div className="testimonial-card testimonial-card--skeleton">
      <div className="tc-sk tc-sk--stars" />
      <div className="tc-sk tc-sk--text" />
      <div className="tc-sk tc-sk--text tc-sk--short" />
      <div className="testimonial-card__author" style={{ marginTop: "auto", paddingTop: "1.25rem", borderTop: "1px solid transparent" }}>
        <div className="tc-sk tc-sk--avatar" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="tc-sk tc-sk--name" />
          <div className="tc-sk tc-sk--role" />
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ t, featured }: { t: TTestimonial; featured?: boolean }) {
  return (
    <div className={`testimonial-card${featured ? " testimonial-card--featured" : ""}`}>
      <div className="testimonial-card__quote">"</div>

      <div className="testimonial-card__stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            fill={i < Math.round(t.rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={i < Math.round(t.rating) ? 0 : 1.5}
          />
        ))}
        <span className="testimonial-card__rating-num">{t.rating.toFixed(1)}</span>
      </div>

      <p className="testimonial-card__text">{t.feedback}</p>

      <div className="testimonial-card__meal-ref">
        🍱 <span>{t.meal.name}</span> · {t.provider.businessName}
      </div>

      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar">
          {t.user.image ? (
            <img src={t.user.image} alt={t.user.name} className="testimonial-card__avatar-img" />
          ) : (
            initials(t.user.name)
          )}
        </div>
        <div className="testimonial-card__info">
          <span className="testimonial-card__name">{t.user.name}</span>
          <span className="testimonial-card__role">
            {t.provider.city} · {timeAgo(t.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}


export default function TestimonialsSection(){
  const [testimonials, setTestimonials] = useState<TTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  // How many cards visible at a time
  const PER_PAGE = 3;
  const totalPages = Math.ceil(testimonials.length / PER_PAGE);

  const visible = testimonials.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHomeTestimonials();
        setTestimonials(res?.data ?? []);
      } catch {
        // silently hide section
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (totalPages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 6000);
    return () => clearInterval(id);
  }, [totalPages]);

  // Don't render section if no data and not loading
  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section className="testimonials">
      <div className="testimonials__container">
        {/* Header */}
        <div className="testimonials__header">
          <div className="testimonials__subtitle">
            <span className="testimonials__subtitle-line" />
            Real Customers, Real Reviews
            <span className="testimonials__subtitle-line" />
          </div>
          <h2 className="testimonials__title">
            What Our <em>Community</em> Says
          </h2>
          {!isLoading && testimonials.length > 0 && (
            <p className="testimonials__count">
              {testimonials.length} verified reviews from real customers
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="testimonials__grid">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))
            : visible.map((t, i) => (
                <TestimonialCard key={t.id} t={t} featured={i === 1} />
              ))}
        </div>

        {/* Pagination dots */}
        {!isLoading && totalPages > 1 && (
          <div className="testimonials__nav">
            <button
              className="testimonials__nav-btn"
              onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="testimonials__dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`testimonials__dot${i === page ? " testimonials__dot--active" : ""}`}
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            <button
              className="testimonials__nav-btn"
              onClick={() => setPage((p) => (p + 1) % totalPages)}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
