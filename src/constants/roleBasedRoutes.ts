// src/constants/roleBasedRoutes.ts

import { ShoppingBag } from 'lucide-react';
import {
  UtensilsCrossed,
  ListOrdered,
  User,
  PlusCircle,
  LayoutDashboard,
  LucideIcon,
  Users,
  User2,
  Hamburger,
  MessageSquare,  // ✅ NEW — for Support Messages nav item
} from "lucide-react"

export const Provider_NAV_ITEMS = [
  {
    label: "Overview",
    href: "/provider-dashboard/statistics",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "My Menu", href: "/provider-dashboard/menu", icon: UtensilsCrossed },
  { label: "Add Meal", href: "/provider-dashboard/add-meal", icon: PlusCircle },
  { label: "Orders", href: "/provider-dashboard/orders", icon: ListOrdered },
  { label: "Profile", href: "/provider-dashboard/profile", icon: User },
]

export const Admin_NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "View All Users", href: "/admin-dashboard/view-users", icon: Users },
  { label: "Provider Requests", href: "/admin-dashboard/provider-request", icon: PlusCircle },
  { label: "Providers", href: "/admin-dashboard/providers", icon: Users },
  { label: "Orders", href: "/admin-dashboard/view-orders", icon: ListOrdered },
  { label: "Manage Categories", href: "/admin-dashboard/manage-categories", icon: User },
  { label: "Settlements", href: "/admin-dashboard/settlements", icon: ShoppingBag },
  // ✅ NEW
  { label: "Support Messages", href: "/admin-dashboard/support-messages", icon: MessageSquare },
]

export const Super_Admin_NAV_ITEMS = [...Admin_NAV_ITEMS,
{ label: "Admins", href: "/admin-dashboard/admins", icon: Users }]

export const Customer_NAV_ITEMS = [
  { label: "My Profile", href: "/customer-dashboard/profile", icon: User2 },
  { label: "My Orders", href: "/customer-dashboard/orders", icon: ListOrdered },
  { label: "Browse Food", href: "/restaurants", icon: Hamburger },
  { label: "My Cart", href: "/cart", icon: ShoppingBag },
]

export type Route = {
  label: string
  href: string
  icon: string | LucideIcon
  exact?: boolean
  active?: boolean | undefined
}

export type Routes = Route[]