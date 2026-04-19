// src/app/(provider)/_components/ProviderSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { toast } from "sonner"
import "./sidebar.css"
import { logoutUser } from "@/services/auth.service"
import { Provider_NAV_ITEMS, Routes } from "@/constants/providerRoutes"



export default function Sidebar({ role }: { role: "PROVIDER" | "CUSTOMER" | "ADMIN" | "SUPER_ADMIN" }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)


  let NAV_ITEMS: Routes = [] as Routes

  switch (role) {
    // case "ADMIN": NAV_ITEMS = adminRoutes; break;
    // case "CUSTOMER": NAV_ITEMS = customerRoutes; break;
    case "PROVIDER": NAV_ITEMS = Provider_NAV_ITEMS as Routes; break;
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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

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
          Platera
        </Link>
        <span className="ps-role-badge">Provider</span>
      </div>

      <nav className="ps-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`ps-nav-item${active ? " ps-nav-item--active" : ""}`}
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
