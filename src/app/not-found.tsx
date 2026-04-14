import Link from "next/link";
import { Search, ArrowLeft, Home, Soup } from "lucide-react";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="container">
        <section className="notfound__card">
          <div className="notfound__badge">
            <Soup size={16} />
            <span>Platera</span>
          </div>

          <div className="notfound__content">
            <div className="notfound__left">
              <p className="notfound__eyebrow">404 • Page not found</p>

              <h1 className="notfound__title">
                Oops, this page is no longer on the menu.
              </h1>

              <p className="notfound__text">
                The page you’re looking for may have been moved, renamed, or
                never existed. Let’s help you get back to something delicious.
              </p>

              <div className="notfound__actions">
                <Link href="/" className="notfound__btn notfound__btn--primary">
                  <Home size={18} />
                  <span>Back to Home</span>
                </Link>

                <Link
                  href="/meals"
                  className="notfound__btn notfound__btn--secondary"
                >
                  <Search size={18} />
                  <span>Browse Meals</span>
                </Link>
              </div>

              <Link href="/" className="notfound__backlink">
                <ArrowLeft size={16} />
                <span>Return to homepage</span>
              </Link>
            </div>

            <div className="notfound__right">
              <div className="notfound__illustration">
                <div className="notfound__plate" />
                <div className="notfound__circle notfound__circle--1" />
                <div className="notfound__circle notfound__circle--2" />
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