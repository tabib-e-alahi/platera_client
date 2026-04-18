import type { Metadata } from "next"
import "./register-provider.css"
import { RegisterProviderForm } from "../_components/Auth/RegisterProviderForm"

export const metadata: Metadata = {
  title: "Become a Provider — Platera",
  description:
    "Start selling your food on Platera. Register as a food provider and reach thousands of hungry customers near you. Home kitchens, restaurants and street food welcome.",
  keywords: [
    "sell food online",
    "become a food provider",
    "platera vendor",
    "home kitchen business",
    "restaurant partner",
  ],
  openGraph: {
    title: "Become a Provider — Platera",
    description:
      "Turn your passion for cooking into a business. Join Platera as a food provider today.",
    type: "website",
  },
}

export default function RegisterProviderPage() {
  return (
    <div className="rp-page">

      {/* LEFT — dark hero panel */}
      <aside className="rp-left">
        <div className="rp-left__inner">

          <a href="/" className="rp-left__logo">Platera</a>

          <div className="rp-left__content">
            <p className="rp-left__eyebrow">For food providers</p>

            <h1 className="rp-left__heading">
              Turn your passion
              <br />
              <em>into a business.</em>
            </h1>

            <p className="rp-left__subtext">
              Join hundreds of home cooks, restaurants, and street
              food vendors already earning on Platera. Your kitchen,
              your rules.
            </p>

            <ul className="rp-left__perks" aria-label="Provider benefits">
              <li className="rp-left__perk">
                <span className="rp-left__perk-icon">✦</span>
                <div>
                  <strong>Zero listing fees</strong>
                  <p>Create your menu for free, always.</p>
                </div>
              </li>
              <li className="rp-left__perk">
                <span className="rp-left__perk-icon">✦</span>
                <div>
                  <strong>Reach thousands</strong>
                  <p>Get discovered by hungry customers nearby.</p>
                </div>
              </li>
              <li className="rp-left__perk">
                <span className="rp-left__perk-icon">✦</span>
                <div>
                  <strong>Full control</strong>
                  <p>Set your prices, hours and availability.</p>
                </div>
              </li>
              <li className="rp-left__perk">
                <span className="rp-left__perk-icon">✦</span>
                <div>
                  <strong>Fast approval</strong>
                  <p>Our team reviews applications within 24 hours.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rp-left__badge">
            <span className="rp-left__badge-dot" />
            500+ active providers and growing
          </div>

        </div>
      </aside>

      {/* DIVIDER */}
      <div className="rp-divider" aria-hidden="true" />

      {/* RIGHT — form */}
      <main className="rp-right">
        <div className="rp-right__inner">
          <RegisterProviderForm />
        </div>
      </main>

    </div>
  )
}