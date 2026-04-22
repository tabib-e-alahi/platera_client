import { NextRequest, NextResponse } from "next/server";
import { getSessionInfoForProxy } from "./services/auth.service";

const AUTH_ONLY_ROUTES = [
  "/login",
  "/register-customer",
  "/register-provider",
  "/verify-email",
];

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register-customer",
  "/register-provider",
  "/verify-email",
  "/restaurants",
];

const CUSTOMER_PREFIX  = "/customer-dashboard";
const PROVIDER_PREFIX  = "/provider-dashboard";
const ADMIN_PREFIX     = "/admin-dashboard";
const CREATE_PROVIDER_PROFILE_ROUTE = "/create-provider-profile";

const PROVIDER_RESTRICTED_ROUTES = [
  "/provider-dashboard/add-meal",
  "/provider-dashboard/menu",
  "/provider-dashboard/orders",
  "/provider-dashboard/profile",
];

export async function handleProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/api completely — never touch auth for these
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|map|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // Public routes that never need a session check
  const isPublicRoute = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith("/restaurants")
  );
  const isDashboardRoute =
    pathname.startsWith(CUSTOMER_PREFIX) ||
    pathname.startsWith(PROVIDER_PREFIX) ||
    pathname.startsWith(ADMIN_PREFIX) ||
    pathname === CREATE_PROVIDER_PROFILE_ROUTE;
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

  // Only call session-check if the route actually needs it
  if (!isPublicRoute || isAuthOnlyRoute) {
    const session = await getSessionInfoForProxy(request);

    const isAuthenticated    = session?.isAuthenticated;
    const role               = session?.user?.role;
    const hasProviderProfile = session?.hasProviderProfile;
    const providerProfileStatus = session?.providerProfileStatus;

    // Not logged in → redirect to login
    if (!isAuthenticated && isDashboardRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Logged-in user trying to access auth pages → redirect to their dashboard
    if (isAuthenticated && isAuthOnlyRoute) {
      const dest =
        role === "CUSTOMER"                         ? "/customer-dashboard"
        : role === "PROVIDER" && !hasProviderProfile ? CREATE_PROVIDER_PROFILE_ROUTE
        : role === "PROVIDER"                        ? "/provider-dashboard"
        : "/admin-dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // Wrong role → redirect to own dashboard
    if (isDashboardRoute) {
      if (role === "CUSTOMER" && !pathname.startsWith(CUSTOMER_PREFIX)) {
        return NextResponse.redirect(new URL("/customer-dashboard", request.url));
      }
      if (role === "PROVIDER" && !pathname.startsWith(PROVIDER_PREFIX) && pathname !== CREATE_PROVIDER_PROFILE_ROUTE) {
        return NextResponse.redirect(new URL("/provider-dashboard", request.url));
      }
      if ((role === "ADMIN" || role === "SUPER_ADMIN") && !pathname.startsWith(ADMIN_PREFIX)) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }

      // Provider-specific checks
      if (role === "PROVIDER") {
        if (!hasProviderProfile && pathname !== CREATE_PROVIDER_PROFILE_ROUTE) {
          return NextResponse.redirect(new URL(CREATE_PROVIDER_PROFILE_ROUTE, request.url));
        }
        if (
          hasProviderProfile &&
          providerProfileStatus !== "APPROVED" &&
          PROVIDER_RESTRICTED_ROUTES.some((r) => pathname.startsWith(r))
        ) {
          return NextResponse.redirect(new URL("/provider-dashboard/profile", request.url));
        }
        if (hasProviderProfile && providerProfileStatus === "APPROVED" && pathname === CREATE_PROVIDER_PROFILE_ROUTE) {
          return NextResponse.redirect(new URL("/provider-dashboard", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}