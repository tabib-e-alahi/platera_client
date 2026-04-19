import {
  UtensilsCrossed,
  ListOrdered,
  User,
  PlusCircle,
  LayoutDashboard,
  BarChart2,
  LucideIcon,
} from "lucide-react"

export const Provider_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/provider-dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "My Menu", href: "/provider-dashboard/menu", icon: UtensilsCrossed },
  { label: "Add Meal", href: "/provider-dashboard/add-meal", icon: PlusCircle },
  { label: "Orders", href: "/provider-dashboard/orders", icon: ListOrdered },
  { label: "Analytics", href: "/provider-dashboard/analytics", icon: BarChart2 },
  { label: "Profile", href: "/provider-dashboard/profile", icon: User },
]

export const Admin_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "", href: "/admin-dashboard/menu", icon: UtensilsCrossed },
  { label: "Add Meal", href: "/admin-dashboard/add-meal", icon: PlusCircle },
  { label: "Orders", href: "/admin-dashboard/orders", icon: ListOrdered },
  { label: "Analytics", href: "/admin-dashboard/analytics", icon: BarChart2 },
  { label: "Profile", href: "/admin-dashboard/profile", icon: User },
]


export type Route = {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export type Routes = Route[]