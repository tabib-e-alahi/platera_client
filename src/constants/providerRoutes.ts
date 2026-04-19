import {
  UtensilsCrossed,
  ListOrdered,
  User,
  PlusCircle,
  LayoutDashboard,
  BarChart2,
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