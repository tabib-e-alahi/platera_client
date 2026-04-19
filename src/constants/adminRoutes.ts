import { Home, LayoutDashboard, MessageSquareQuote, ListOrdered, Users } from "lucide-react";

export const adminRoutes =
{
  title: "Provider",
  navItems: [
    { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "View All Users", href: "/admin-dashboard/view-users", icon: Users },
    { label: "Provider Requests", href: "/admin-dashboard/provider-requests", icon: Users },
    { label: "Providers", href: "/admin-dashboard/providers", icon: Users },
    { label: "Orders", href: "/admin-dashboard/view-orders", icon: ListOrdered },
    { label: "Manage Categories", href: "/admin-dashboard/manage-categories", icon: MessageSquareQuote },
    { label: "Home", href: "/", icon: Home },
  ]
}