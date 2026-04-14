import { Star } from "lucide-react";
import "./testimonials.css";

const testimonials = [
  {
    text: "Platera helped me discover restaurants I never knew existed in my own neighborhood. The Sakura Omakase recommendation was life-changing!",
    name: "Sophia Chen",
    role: "Food Enthusiast, NYC",
    initials: "SC",
    rating: 5,
  },
  {
    text: "As a restaurant owner, joining Platera doubled our reservations within the first month. The exposure to food lovers is incredible.",
    name: "Marco Rossi",
    role: "Owner, Trattoria Bella Vita",
    initials: "MR",
    rating: 5,
  },
  {
    text: "The curation is what sets Platera apart — every restaurant listed is genuinely excellent. I trust their picks completely.",
    name: "Emily & James",
    role: "Weekly Platera Users",
    initials: "EJ",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <div className="testimonials__subtitle">
            <span className="testimonials__subtitle-line" />
            Loved by Foodies
            <span className="testimonials__subtitle-line" />
          </div>
          <h2 className="testimonials__title">
            What Our <em>Community</em> Says
          </h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="testimonial-card__quote">"</div>
              <div className="testimonial-card__stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-card__text">{t.text}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.initials}</div>
                <div className="testimonial-card__info">
                  <span className="testimonial-card__name">{t.name}</span>
                  <span className="testimonial-card__role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
