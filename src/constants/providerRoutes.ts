import {
  UtensilsCrossed,
  ListOrdered,
  User,
  PlusCircle,
  LayoutDashboard,
  BarChart2,
  LucideIcon,
  Users,
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
  { label: "Home", href: "/", icon: Home },
]

export const Admin_NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "View All Users", href: "/admin-dashboard/view-users", icon: Users },
  { label: "Provider Requests", href: "/admin-dashboard/provider-requests", icon: PlusCircle },
  { label: "Providers", href: "/admin-dashboard/providers", icon: ListOrdered },
  { label: "Orders", href: "/admin-dashboard/view-orders", icon: BarChart2 },
  { label: "Manage Categories", href: "/admin-dashboard/manage-categories", icon: User },
  { label: "Home", href: "/", icon: Home },
]


export type Route = {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export type Routes = Route[]