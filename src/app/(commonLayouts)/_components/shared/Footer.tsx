"use client"
import { UtensilsCrossed } from "lucide-react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      {/* Newsletter CTA */}
      <div className="footer__cta-band">
        <div className="footer__cta-inner">
          <h3 className="footer__cta-title">
            Never Miss a <em>Great Meal</em>
          </h3>
          <p className="footer__cta-desc">
            Get weekly picks, new restaurant alerts, and exclusive offers delivered to your inbox.
          </p>
          <form className="footer__cta-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="footer__cta-input"
            />
            <button type="submit" className="footer__cta-submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer__main">
        <div>
          <div className="footer__logo">
            <span className="footer__logo-icon">
              <UtensilsCrossed size={18} />
            </span>
            <span className="footer__logo-text">Platera</span>
          </div>
          <p className="footer__brand-desc">
            Connecting food lovers with the best restaurants. Discover, reserve, and enjoy — all in one place.
          </p>
        </div>

        <div>
          <h4 className="footer__col-title">Explore</h4>
          <ul className="footer__links">
            <li><a href="#restaurants" className="footer__link">Restaurants</a></li>
            <li><a href="#about" className="footer__link">How It Works</a></li>
            <li><a href="#" className="footer__link">Cuisines</a></li>
            <li><a href="#" className="footer__link">Top Rated</a></li>
            <li><a href="#" className="footer__link">Near Me</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__col-title">For Restaurants</h4>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Partner With Us</a></li>
            <li><a href="#" className="footer__link">Business Dashboard</a></li>
            <li><a href="#" className="footer__link">Pricing</a></li>
            <li><a href="#" className="footer__link">Success Stories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__col-title">Support</h4>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Help Center</a></li>
            <li><a href="#" className="footer__link">Contact Us</a></li>
            <li><a href="#" className="footer__link">Privacy Policy</a></li>
            <li><a href="#" className="footer__link">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span className="footer__copy">
            © 2024 Platera. All rights reserved.
          </span>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="Instagram"><img src="instagram.svg" alt=""/></a>
            <a href="#" className="footer__social" aria-label="Facebook"><img src="instagram.svg" alt=""/></a>
            <a href="#" className="footer__social" aria-label="Twitter"><img src="instagram.svg" alt=""/></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
