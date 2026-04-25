"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitContactMessage } from "@/services/admin.service";
import "./contact.css";

const INITIAL_FORM = {
  name: "", email: "", subject: "", category: "", message: "",
};

export default function ContactPage() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      toast.error("Please select a topic.");
      return;
    }
    setLoading(true);
    try {
      await submitContactMessage({
        name:     form.name.trim(),
        email:    form.email.trim(),
        subject:  form.subject.trim() || undefined,
        category: form.category,
        message:  form.message.trim(),
      });
      setSent(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Could not send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const CONTACT_CARDS = [
    {
      icon: "📧", title: "Email us",
      value: "support@platera.com.bd", sub: "We reply within 24 hours",
      href: "mailto:support@platera.com.bd",
    },
    {
      icon: "📞", title: "Call us",
      value: "+880 1700-000000", sub: "Sat – Thu, 9am – 9pm",
      href: "tel:+8801700000000",
    },
    {
      icon: "💬", title: "Live chat",
      value: "Chat with support", sub: "Usually responds in minutes",
      href: "#",
    },
  ];

  const FAQ = [
    {
      q: "How do I cancel an order?",
      a: "You can cancel any order before the provider starts preparing it. Go to My Orders, open the order, and tap Cancel. If you paid online, your refund will be processed within 3–7 business days.",
    },
    {
      q: "How long does delivery take?",
      a: "Our same-city model means average delivery is under 30 minutes. Exact times vary by provider and distance within your district.",
    },
    {
      q: "How do I become a provider?",
      a: "Register as a provider, complete your profile with business details and verification documents, then submit for approval. Our team reviews within 48 hours.",
    },
    {
      q: "Is there a minimum order amount?",
      a: "Each provider sets their own minimum (usually ৳100–৳200). You'll see this on the provider's page before adding items to your cart.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept online payments via SSLCommerz (all major cards, mobile banking) and Cash on Delivery for eligible orders.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="contact-hero__inner">
          <span className="contact-hero__eyebrow">We're here to help</span>
          <h1 className="contact-hero__title">
            Get in touch with<br />
            <em>our team</em>
          </h1>
          <p className="contact-hero__body">
            Whether you have a question about an order, want to partner with us,
            or just want to say hello — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="contact-cards">
        <div className="contact-cards__inner">
          {CONTACT_CARDS.map((c, i) => (
            <a
              href={c.href}
              className="contact-card"
              key={c.title}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="contact-card__icon">{c.icon}</span>
              <div>
                <div className="contact-card__title">{c.title}</div>
                <div className="contact-card__value">{c.value}</div>
                <div className="contact-card__sub">{c.sub}</div>
              </div>
              <span className="contact-card__arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="contact-main">
        <div className="contact-main__inner">

          {/* Form */}
          <div className="contact-form-wrap">
            <div className="contact-form-header">
              <h2 className="contact-form-header__title">Send us a message</h2>
              <p className="contact-form-header__sub">
                Fill in the form and we'll get back to you within 24 hours.
              </p>
            </div>

            {sent ? (
              <div className="contact-success">
                <span className="contact-success__icon">✓</span>
                <h3>Message sent!</h3>
                <p>
                  Thanks for reaching out, <strong>{form.name}</strong>.
                  We've received your message and will reply to{" "}
                  <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  className="contact-success__reset"
                  onClick={() => { setSent(false); setForm(INITIAL_FORM); }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label className="contact-form__label">
                      Full name <span className="contact-req">*</span>
                    </label>
                    <input
                      className="contact-form__input"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Arif Hossain"
                      required
                    />
                  </div>
                  <div className="contact-form__field">
                    <label className="contact-form__label">
                      Email address <span className="contact-req">*</span>
                    </label>
                    <input
                      className="contact-form__input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="arif@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label">
                    I'm contacting about <span className="contact-req">*</span>
                  </label>
                  <select
                    className="contact-form__select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="ORDER">Order issue</option>
                    <option value="REFUND">Refund / payment</option>
                    <option value="PROVIDER">Becoming a provider</option>
                    <option value="ACCOUNT">My account</option>
                    <option value="PARTNERSHIP">Business partnership</option>
                    <option value="OTHER">Something else</option>
                  </select>
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label">Subject</label>
                  <input
                    className="contact-form__input"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your enquiry"
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label">
                    Message <span className="contact-req">*</span>
                  </label>
                  <textarea
                    className="contact-form__textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    rows={5}
                    maxLength={1000}
                    required
                  />
                  <span className="contact-form__char">
                    {form.message.length}/1000
                  </span>
                </div>

                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="contact-form__spinner" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="contact-faq">
            <h2 className="contact-faq__title">Frequently asked questions</h2>
            <div className="contact-faq__list">
              {FAQ.map((item, i) => (
                <div
                  className={`contact-faq__item${openFaq === i ? " contact-faq__item--open" : ""}`}
                  key={i}
                >
                  <button
                    className="contact-faq__q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="contact-faq__chevron">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="contact-faq__a">{item.a}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="contact-office">
              <div className="contact-office__header">
                <span className="contact-office__icon">📍</span>
                <h3>Our office</h3>
              </div>
              <p>House 12, Road 5, Mirpur 2<br />Dhaka 1216, Bangladesh</p>
              <div className="contact-office__hours">
                <strong>Business hours</strong>
                <span>Sat – Thu, 9:00am – 9:00pm</span>
                <span style={{ color: "hsl(20 10% 55%)", fontSize: 12 }}>
                  Closed Fridays & public holidays
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}