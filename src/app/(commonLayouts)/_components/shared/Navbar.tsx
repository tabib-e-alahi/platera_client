"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UtensilsCrossed,
} from "lucide-react";
import "./navbar.css";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { logoutUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ThemeToggle from "@/components/shared/ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Pages that have a dark hero behind the navbar — start transparent
const HERO_ROUTES = ["/", "/cart", "/restaurants", "/meals"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Transparent start only on hero pages; all others start solid
  const isHeroPage = HERO_ROUTES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    // Re-evaluate on mount (matters when navigating back to hero page)
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  // Determine class: solid when not a hero page, or when scrolled on any page
  const solidClass = !isHeroPage || scrolled ? "navbar--solid" : "";
  // On hero pages that are scrolled we rely on --scrolled; on non-hero pages we use --solid
  const scrolledClass = isHeroPage && scrolled ? "navbar--scrolled" : "";

  const dashboardHref =
    user?.role === "PROVIDER"
      ? "/provider-dashboard"
      : user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
        ? "/admin-dashboard"
        : "/customer-dashboard";

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <>
      <nav className={`navbar ${solidClass} ${scrolledClass}`}>
        <div className="navbar__inner">
          <Link href="/" className="navbar__logo" onClick={closeMobileMenu}>
            <span className="navbar__logo-icon">
              <UtensilsCrossed size={20} />
            </span>
            <span className="navbar__logo-text">Platera</span>
          </Link>

          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="navbar__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar__right">
            <ThemeToggle></ThemeToggle>
            {!isLoading &&
              (user ? (
                <div className="navbar__auth navbar__auth--logged">
                  <Link href="/cart" className="navbar__icon-btn" aria-label="Cart">
                    <ShoppingCart size={20} />
                  </Link>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={dashboardHref} className="navbar__icon-btn" aria-label="Dashboard">
                        <User size={20} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-inherit">Dashboard</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleLogout} className="navbar__icon-btn" aria-label="Dashboard">
                        <LogOut size={20}></LogOut>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-inherit">Logout</TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="navbar__auth">
                  <Link href="/login" className="navbar__cta_login desktop-only" aria-label="Dashboard">
                    Login
                  </Link>
                  <Link href="/login" className="navbar__icon-btn mobile-only" aria-label="Login">
                    <LogIn size={20} />
                  </Link>
                </div>
              ))}

            <button
              type="button"
              className={`navbar__toggle ${mobileOpen ? "navbar__toggle--open" : ""}`}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className="navbar__toggle-bar" />
              <span className="navbar__toggle-bar" />
              <span className="navbar__toggle-bar" />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`navbar__overlay ${mobileOpen ? "navbar__overlay--open" : ""}`}
        onClick={closeMobileMenu}
      />

      <div className={`navbar__mobile ${mobileOpen ? "navbar__mobile--open" : ""}`}>
        <div className="navbar__mobile-inner">
          <div className="navbar__mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="navbar__mobile-link"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="navbar__mobile-actions">
            {!isLoading &&
              (user ? (
                <>
                  <Link href={dashboardHref} className="navbar__mobile-cta">Dashboard</Link>
                  <Link href="/cart" className="navbar__mobile-cta-secondary">Cart</Link>
                  <Button className="navbar__mobile-cta-logout" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Link href="/login" className="navbar__mobile-cta">
                  <LogIn size={18} /><span>Login</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
