import type { Metadata } from "next"
import "./login.css"
import { LoginForm } from "../_components/Auth/LoginForm"
import WantToProvider from "../_components/WantToProviderButton/WantToProvider"
import { Suspense } from "react"
import LoadingPage from "@/components/shared/loading/LoadingCompo"

export const metadata: Metadata = {
  title: "Sign In — Platera",
  description:
    "Sign in to Platera and discover the best local food near you. Order from home kitchens, restaurants and street food providers.",
  keywords: ["platera login", "food delivery sign in", "order food online"],
  openGraph: {
    title: "Sign In — Platera",
    description: "Sign in and start ordering fresh food near you.",
    type: "website",
  },
}

export default function LoginPage() {
  return (
    <div className="login-page">

      {/* LEFT — SEO friendly welcome content */}
      <aside className="login-left" aria-hidden="false">
        <div className="login-left__inner">

          <a href="/" className="login-left__logo">
            Platera
          </a>

          <div className="login-left__content">
            <h1 className="login-left__heading">
              The best food,
              <br />
              <em>delivered fast.</em>
            </h1>
            <p className="login-left__subtext">
              Join thousands of food lovers ordering from local home
              kitchens, restaurants, and street food providers every day.
            </p>

            <ul className="login-left__stats" aria-label="Platform highlights">
              <li className="login-left__stat">
                <span className="login-left__stat-value">500+</span>
                <span className="login-left__stat-label">Restaurants</span>
              </li>
              <li className="login-left__stat-divider" aria-hidden="true" />
              <li className="login-left__stat">
                <span className="login-left__stat-value">4.8★</span>
                <span className="login-left__stat-label">Avg Rating</span>
              </li>
              <li className="login-left__stat-divider" aria-hidden="true" />
              <li className="login-left__stat">
                <span className="login-left__stat-value">25 min</span>
                <span className="login-left__stat-label">Avg Delivery</span>
              </li>
            </ul>
          </div>

          <WantToProvider></WantToProvider>
        </div>
      </aside>

      {/* DIVIDER */}
      <div className="login-divider" aria-hidden="true" />

      {/* RIGHT — form */}
      <main className="login-right">
        <div className="login-right__inner">
          <Suspense fallback={<LoadingPage></LoadingPage>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>

    </div>
  )
}