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
];

const CUSTOMER_PREFIX = "/customer-dashboard";
const PROVIDER_PREFIX = "/provider-dashboard";
const ADMIN_PREFIX = "/admin-dashboard";
const CREATE_PROVIDER_PROFILE_ROUTE = "/create-provider-profile";

const PROVIDER_RESTRICTED_ROUTES = [
  "/provider-dashboard/add-meal",
  "/provider-dashboard/meals",
  "/provider-dashboard/orders",
];

export async function handleProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const session = await getSessionInfoForProxy(request);

  const isAuthenticated = session?.isAuthenticated;
  const role = session?.user?.role;
  const hasProviderProfile = session?.hasProviderProfile;
  const providerProfileStatus = session?.providerProfileStatus;

  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute && pathname !== CREATE_PROVIDER_PROFILE_ROUTE) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isAuthOnlyRoute) {
    if (role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/customer-dashboard", request.url));
    }

    if (role === "PROVIDER") {
      if (!hasProviderProfile) {
        return NextResponse.redirect(
          new URL(CREATE_PROVIDER_PROFILE_ROUTE, request.url)
        );
      }

      return NextResponse.redirect(new URL("/provider-dashboard", request.url));
    }

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  if (role === "CUSTOMER" && pathname.startsWith(PROVIDER_PREFIX)) {
    return NextResponse.redirect(new URL("/customer-dashboard", request.url));
  }

  if (
    role === "CUSTOMER" &&
    pathname.startsWith(ADMIN_PREFIX)
  ) {
    return NextResponse.redirect(new URL("/customer-dashboard", request.url));
  }

  if (role === "PROVIDER" && pathname.startsWith(CUSTOMER_PREFIX)) {
    return NextResponse.redirect(new URL("/provider-dashboard", request.url));
  }

  if (
    role === "PROVIDER" &&
    pathname.startsWith(ADMIN_PREFIX)
  ) {
    return NextResponse.redirect(new URL("/provider-dashboard", request.url));
  }

  if (
    (role === "ADMIN" || role === "SUPER_ADMIN") &&
    pathname.startsWith(CUSTOMER_PREFIX)
  ) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  if (
    (role === "ADMIN" || role === "SUPER_ADMIN") &&
    pathname.startsWith(PROVIDER_PREFIX)
  ) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  if (role === "PROVIDER") {
    const isProviderDashboard = pathname.startsWith(PROVIDER_PREFIX);
    const isRestrictedProviderRoute = PROVIDER_RESTRICTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (!hasProviderProfile && (isProviderDashboard || pathname === CREATE_PROVIDER_PROFILE_ROUTE)) {
      if (pathname !== CREATE_PROVIDER_PROFILE_ROUTE) {
        return NextResponse.redirect(
          new URL(CREATE_PROVIDER_PROFILE_ROUTE, request.url)
        );
      }
    }

    if (!hasProviderProfile && isProviderDashboard && pathname !== CREATE_PROVIDER_PROFILE_ROUTE) {
      return NextResponse.redirect(
        new URL(CREATE_PROVIDER_PROFILE_ROUTE, request.url)
      );
    }

    if (
      hasProviderProfile &&
      providerProfileStatus &&
      providerProfileStatus !== "APPROVED" &&
      isRestrictedProviderRoute
    ) {
      return NextResponse.redirect(
        new URL("/provider-dashboard/profile", request.url)
      );
    }

    if (
      hasProviderProfile &&
      providerProfileStatus === "APPROVED" &&
      pathname === CREATE_PROVIDER_PROFILE_ROUTE
    ) {
      return NextResponse.redirect(
        new URL("/provider-dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}