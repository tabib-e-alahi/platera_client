// src/app/(auth)/register/page.tsx
import type { Metadata } from "next"
import "./register.css"
import { RegisterForm } from "../_components/Auth/RegisterForm"
import WantToProvider from "../_components/WantToProviderButton/WantToProvider"

export const metadata: Metadata = {
  title: "Create Account — Platera",
  description:
    "Create your free Platera account and start ordering from the best local food providers near you. Fast signup, fresh food.",
  keywords: [
    "platera register",
    "create account",
    "food delivery signup",
    "order food online",
  ],
  openGraph: {
    title: "Create Account — Platera",
    description:
      "Join thousands ordering fresh food from local providers.",
    type: "website",
  },
}

export default function RegisterPage() {
  return (
    <div className="register-page">
      {/* LEFT */}
      <aside className="register-left" aria-hidden="false">
        <div className="register-left__inner">

          <a href="/" className="register-left__logo">
            Platera
          </a>

          <div className="register-left__content">
            <h1 className="register-left__heading">
              Start your
              <br />
              <em>food journey.</em>
            </h1>
            <p className="register-left__subtext">
              Create a free account and unlock access to hundreds of
              local restaurants, home kitchens, and street food
              providers near you.
            </p>

            <ul className="register-left__perks" aria-label="Account benefits">
              <li className="register-left__perk">
                <span className="register-left__perk-icon">✓</span>
                Order from 500+ local providers
              </li>
              <li className="register-left__perk">
                <span className="register-left__perk-icon">✓</span>
                Real-time order tracking
              </li>
              <li className="register-left__perk">
                <span className="register-left__perk-icon">✓</span>
                Exclusive deals and discounts
              </li>
              <li className="register-left__perk">
                <span className="register-left__perk-icon">✓</span>
                100% free to join
              </li>
            </ul>
          </div>


          <WantToProvider></WantToProvider>


        </div>
      </aside>

      {/* DIVIDER */}
      <div className="register-divider" aria-hidden="true" />

      {/* RIGHT */}
      <main className="register-right">
        <div className="register-right__inner">
          <RegisterForm />
        </div>
      </main>

    </div>
  )
}