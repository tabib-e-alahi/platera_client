"use client"

import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// use this in any page that needs a logged-in user
export function useRequireAuth(redirectTo = "/login") {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo)
    }
  }, [user, isLoading, redirectTo, router])
  return { user, isLoading }
}

// use this to redirect logged-in users away from auth pages
export function useRedirectIfAuth(redirectTo = "/") {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      const roleMap: Record<string, string> = {
        CUSTOMER: "/",
        PROVIDER: "/provider-dashboard/profile",
        ADMIN: "/admin-dashboard",
        SUPER_ADMIN: "/admin-dashboard",
      }
      router.push(roleMap[user.role] ?? redirectTo)
    }
  }, [user, isLoading, redirectTo, router])

  return { isLoading }
}