import { Role } from "@/constants/roles";

export const protectedRoutes:{ route: string; roles: Role[] }[] = [
  { route: "/customer-dashboard", roles: ["CUSTOMER"] },
  { route: "/customer-dashboard/profile", roles: ["CUSTOMER"] },
  { route: "/customer-dashboard/orders", roles: ["CUSTOMER"] },
  { route: "/cart", roles: ["CUSTOMER"] },
  { route: "/checkout", roles: ["CUSTOMER"] },

  { route: "/provider-dashboard", roles: ["PROVIDER"] },
  { route: "/provider-dashboard/profile", roles: ["PROVIDER"] },
  { route: "/provider-dashboard/add-meal", roles: ["PROVIDER"] },
  { route: "/provider-dashboard/orders", roles: ["PROVIDER"] },
  { route: "/provider-dashboard/menu", roles: ["PROVIDER"] },
  { route: "/create-provider-profile", roles: ["PROVIDER"] },

  { route: "/admin-dashboard", roles: ["ADMIN", "SUPER_ADMIN"] },
  { route: "/admin-dashboard/providers", roles: ["ADMIN", "SUPER_ADMIN"] },
  { route: "/admin-dashboard/customers", roles: ["ADMIN", "SUPER_ADMIN"] },
  { route: "/admin-dashboard/orders", roles: ["ADMIN", "SUPER_ADMIN"] },
  { route: "/admin-dashboard/admins", roles: ["SUPER_ADMIN"] },
]