"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logOut } from "@/services/auth.service";
import { toast } from "sonner";
import "./customer-sidebar.css";

const NAV = [
  { label: "Overview", href: "/customer-dashboard", icon: "⊞", exact: true },
  { label: "My Profile", href: "/customer-dashboard/profile", icon: "◉" },
  { label: "My Orders", href: "/customer-dashboard/orders", icon: "📦" },
  { label: "Browse Food", href: "/", icon: "🍽️" },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logOut();
      router.push("/login");
    } catch {
      toast.error("Logout failed.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* mobile top bar */}
      <div className="csb-mobile-bar">
        <span className="csb-mobile-logo">Platera</span>
        <button
          className="csb-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* overlay */}
      {mobileOpen && (
        <div
          className="csb-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside className={`csb ${mobileOpen ? "csb--open" : ""}`}>
        <div className="csb__top">
          <span className="csb__logo">Platera</span>
          <span className="csb__badge">Customer</span>
        </div>

        <nav className="csb__nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`csb__link ${isActive(item.href, item.exact) ? "csb__link--active" : ""}`}
            >
              <span className="csb__icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          className="csb__logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <span>🚪</span>
          <span>{loggingOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </aside>
    </>
  );
}