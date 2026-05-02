// src/handleProxy.ts

import { NextRequest, NextResponse } from "next/server";
import { getSessionInfoForProxy } from "./services/auth.service";
import { UserRole } from "./types/auth.type";

// ─────────────────────────────────────────────────────────────────────────────
// Route definitions
// ─────────────────────────────────────────────────────────────────────────────

const PUBLIC_EXACT = new Set(["/"]);

const PUBLIC_PREFIXES = ["/restaurants", "/about", "/contact"];

const AUTH_ONLY_ROUTES = new Set([
  "/login",
  "/register-customer",
  "/register-provider",
  "/verify-email",
]);

const CUSTOMER_PREFIX = "/customer-dashboard";
const PROVIDER_PREFIX = "/provider-dashboard";
const ADMIN_PREFIX = "/admin-dashboard";
const CREATE_PROVIDER_PROFILE = "/create-provider-profile";

const PROVIDER_PROFILE_ONLY_PREFIXES = [`${PROVIDER_PREFIX}/profile`];

const SUPER_ADMIN_ONLY_PREFIXES = [`${ADMIN_PREFIX}/admins`];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function homeDashboard(role: UserRole, hasProviderProfile: boolean): string {
  switch (role) {
    case "CUSTOMER": return CUSTOMER_PREFIX;
    case "PROVIDER": return hasProviderProfile ? PROVIDER_PREFIX : CREATE_PROVIDER_PROFILE;
    case "ADMIN": return ADMIN_PREFIX;
    case "SUPER_ADMIN": return ADMIN_PREFIX;
  }
}

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith(CUSTOMER_PREFIX) ||
    pathname.startsWith(PROVIDER_PREFIX) ||
    pathname.startsWith(ADMIN_PREFIX) ||
    pathname === CREATE_PROVIDER_PROFILE ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout")
  );
}

function matchesAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip Next.js internals — should already be excluded by matcher, but
  //    kept as a safety net.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 2. Purely public path → no session check
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("__Secure-session_token") ||
    request.cookies.get("session_token");

  console.log("89",token);

  if (!token) {
    if (isProtectedPath(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Session cookie present → verify with backend
  const session = await getSessionInfoForProxy(request);

  const isAuthenticated = session?.isAuthenticated ?? false;
  const role = session?.user?.role ?? null;
  const hasProviderProfile = session?.hasProviderProfile ?? false;
  const providerStatus = session?.providerProfileStatus ?? null;

  // 4a. Cookie present but session invalid / expired
  if (!isAuthenticated) {
    if (isProtectedPath(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 5. Authenticated user on an auth-only page → bounce to their dashboard
  if (AUTH_ONLY_ROUTES.has(pathname)) {
    return NextResponse.redirect(
      new URL(homeDashboard(role!, hasProviderProfile), request.url)
    );
  }

  // 6. Role-based access control ────────────────────────────────────────────

  // ── CUSTOMER ──────────────────────────────────────────────────────────────
  if (role === "CUSTOMER") {
    if (
      pathname.startsWith(PROVIDER_PREFIX) ||
      pathname.startsWith(ADMIN_PREFIX) ||
      pathname === CREATE_PROVIDER_PROFILE
    ) {
      return NextResponse.redirect(new URL(CUSTOMER_PREFIX, request.url));
    }
    // /customer-dashboard/* and /cart /checkout → allow
    return NextResponse.next();
  }

  // ── PROVIDER ──────────────────────────────────────────────────────────────
  if (role === "PROVIDER") {
    // Block customer-only and admin areas
    if (
      pathname.startsWith(CUSTOMER_PREFIX) ||
      pathname.startsWith(ADMIN_PREFIX) ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout")
    ) {
      return NextResponse.redirect(
        new URL(homeDashboard("PROVIDER", hasProviderProfile), request.url)
      );
    }

    // No profile yet → must create profile
    if (!hasProviderProfile) {
      if (pathname !== CREATE_PROVIDER_PROFILE) {
        return NextResponse.redirect(
          new URL(CREATE_PROVIDER_PROFILE, request.url)
        );
      }
      return NextResponse.next();
    }

    // Has profile → bounce away from create-profile page
    if (pathname === CREATE_PROVIDER_PROFILE) {
      return NextResponse.redirect(new URL(PROVIDER_PREFIX, request.url));
    }

    // Profile not yet APPROVED → lock to profile-only routes
    if (
      providerStatus !== "APPROVED" &&
      pathname.startsWith(PROVIDER_PREFIX) &&
      !matchesAny(pathname, PROVIDER_PROFILE_ONLY_PREFIXES)
    ) {
      return NextResponse.redirect(
        new URL(`${PROVIDER_PREFIX}/profile`, request.url)
      );
    }

    return NextResponse.next();
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (role === "ADMIN") {
    if (
      pathname.startsWith(CUSTOMER_PREFIX) ||
      pathname.startsWith(PROVIDER_PREFIX) ||
      pathname === CREATE_PROVIDER_PROFILE ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout")
    ) {
      return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
    }

    if (matchesAny(pathname, SUPER_ADMIN_ONLY_PREFIXES)) {
      return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
    }

    return NextResponse.next();
  }

  // ── SUPER_ADMIN ───────────────────────────────────────────────────────────
  if (role === "SUPER_ADMIN") {
    if (
      pathname.startsWith(CUSTOMER_PREFIX) ||
      pathname.startsWith(PROVIDER_PREFIX) ||
      pathname === CREATE_PROVIDER_PROFILE ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout")
    ) {
      return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
    }
    return NextResponse.next();
  }

  // 7. Unknown role → deny protected routes
  if (isProtectedPath(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}