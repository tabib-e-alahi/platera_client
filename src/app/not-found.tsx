"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Home, Soup } from "lucide-react";
import "./not-found.css";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <main className="notfound ">
      <div className="container lg:max-w-7xl lg:mx-auto">
        <section className="notfound__card">
          <div className="notfound__badge">
            <Soup size={16} />
            <span>Platera</span>
          </div>

          <div className="notfound__content">
            <div className="notfound__left">
              <p className="notfound__eyebrow">404 • Page not found</p>

              <h1 className="notfound__title">
                This page is not on the menu.
              </h1>

              <p className="notfound__text">
                The route you tried does not exist, may have been moved, or is
                no longer available. Let’s take you back to a valid path.
              </p>

              <div className="notfound__actions">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="notfound__btn notfound__btn--primary"
                >
                  <ArrowLeft size={18} />
                  <span>Go Back</span>
                </button>

                <Link
                  href="/"
                  className="notfound__btn notfound__btn--secondary"
                >
                  <Home size={18} />
                  <span>Back to Home</span>
                </Link>

                <Link
                  href="/meals"
                  className="notfound__btn notfound__btn--ghost"
                >
                  <Search size={18} />
                  <span>Browse Meals</span>
                </Link>
              </div>

              <p className="notfound__hint">
                You can return to the previous page or explore available meals.
              </p>
            </div>

            <div className="notfound__right">
              <div className="notfound__illustration">
                <div className="notfound__glow notfound__glow--1" />
                <div className="notfound__glow notfound__glow--2" />
                <div className="notfound__plate" />
                <div className="notfound__ring" />
                <div className="notfound__number">404</div>
                <div className="notfound__crumb notfound__crumb--1" />
                <div className="notfound__crumb notfound__crumb--2" />
                <div className="notfound__crumb notfound__crumb--3" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}