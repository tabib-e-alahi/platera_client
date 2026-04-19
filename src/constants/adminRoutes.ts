import { Home, LayoutDashboard, MessageSquareQuote, ShoppingBag, Users } from "lucide-react";

export const adminRoutes =
{
  title: "Admin Dashboard",
  navItems: [
    { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "View All Users", href: "/admin-dashboard/view-users", icon: Users },
    { label: "View All Users", href: "/admin-dashboard/view-users", icon: Users },
    { label: "Orders", href: "/admin-dashboard/view-orders", icon: ShoppingBag },
    { label: "Manage Categories", href: "/admin-dashboard/manage-categories", icon: MessageSquareQuote },
    { label: "Home", href: "/", icon: Home },
  ]
}