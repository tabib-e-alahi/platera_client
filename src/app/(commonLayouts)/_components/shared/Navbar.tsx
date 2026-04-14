"use client"

import { useState, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import "./navbar.css";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Restaurants", href: "#restaurants" },
  { label: "How It Works", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          <a href="#" className="navbar__logo">
            <span className="navbar__logo-icon">
              <UtensilsCrossed size={20} />
            </span>
            <span className="navbar__logo-text">Platera</span>
          </a>

          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="navbar__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar__right">
            <a href="#reserve" className="navbar__cta">
              Reserve a Table
            </a>
            <button
              className={`navbar__toggle ${mobileOpen ? "navbar__toggle--open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="navbar__toggle-bar" />
              <span className="navbar__toggle-bar" />
              <span className="navbar__toggle-bar" />
            </button>
          </div>
        </div>
      </nav>

      <div className={`navbar__mobile ${mobileOpen ? "navbar__mobile--open" : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="navbar__mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a href="#reserve" className="navbar__mobile-cta" onClick={() => setMobileOpen(false)}>
          Reserve a Table
        </a>
      </div>
    </>
  );
};

export default Navbar;
