"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
<<<<<<< HEAD
  Home,
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { toast } from "sonner"
import "./sidebar.css"
import { logoutUser } from "@/services/auth.service"
<<<<<<< HEAD
import { Admin_NAV_ITEMS, Customer_NAV_ITEMS, Provider_NAV_ITEMS, Routes, Super_Admin_NAV_ITEMS } from "@/constants/roleBasedRoutes"
=======
import { Admin_NAV_ITEMS, Customer_NAV_ITEMS, Provider_NAV_ITEMS, Routes } from "@/constants/roleBasedRoutes"
>>>>>>> dc5656236feee959b1e0e891718009336b905842



export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  let NAV_ITEMS: Routes = [] as Routes
  const role = user?.role as "PROVIDER" | "CUSTOMER" | "ADMIN" | "SUPER_ADMIN"
  switch (role) {
<<<<<<< HEAD
    case "ADMIN": NAV_ITEMS = [...Admin_NAV_ITEMS, { label: "Home", href: "/", icon: Home, active: false }]; break;
    case "SUPER_ADMIN": NAV_ITEMS = [...Super_Admin_NAV_ITEMS, { label: "Home", href: "/", icon: Home, active: false }]; break; // SUPER_ADMIN has full admin access
    case "CUSTOMER": NAV_ITEMS = [...Customer_NAV_ITEMS, { label: "Home", href: "/", icon: Home, active: false }]; break;
    case "PROVIDER": NAV_ITEMS = [...Provider_NAV_ITEMS, { label: "Home", href: "/", icon: Home, active: false }] as Routes; break;
=======
    case "ADMIN": NAV_ITEMS = Admin_NAV_ITEMS; break;
    case "CUSTOMER": NAV_ITEMS = Customer_NAV_ITEMS; break;
    case "PROVIDER": NAV_ITEMS = Provider_NAV_ITEMS as Routes; break;
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  }

  // close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

<<<<<<< HEAD
  const isActive = (href: string, exact?: boolean, active?: boolean | undefined) => {
=======
  const isActive = (href: string, exact?: boolean, active?: boolean|undefined) =>{
>>>>>>> dc5656236feee959b1e0e891718009336b905842
    if (active !== undefined) return active
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/login")
      router.refresh()
    } catch {
      toast.error("Logout failed.")
    }
  }

  const sidebarContent = (
    <>
      <div className="ps-top">
        <Link href="/" className="ps-logo">
          {user?.name || "Platera"}
        </Link>
        <span className="ps-role-badge">{user?.role}</span>
      </div>

      <nav className="ps-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact, item.active)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`ps-nav-item ${active ? " ps-nav-item--active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <button className="ps-logout" onClick={handleLogout}>
        <LogOut size={16} />
        <span>Sign out</span>
      </button>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ 900px) ── */}
      <aside className="ps-sidebar ps-sidebar--desktop">{sidebarContent}</aside>

      {/* ── Mobile topbar ── */}
      <header className="ps-mobile-bar">
        <Link href="/" className="ps-logo">
          Platera
        </Link>
        <button
          className="ps-hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── Mobile drawer + overlay ── */}
      {open && (
        <div
          className="ps-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`ps-sidebar ps-sidebar--drawer${open ? " ps-sidebar--drawer-open" : ""}`}
      >
        <button
          className="ps-drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
