// src/app/(auth)/google-callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

export default function GoogleCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await api.get("/auth/session-check")
        const data = res.data?.data

        if (!data?.isAuthenticated) {
          router.replace("/login")
          return
        }

        const role               = data.user?.role as string
        const hasProviderProfile = data.hasProviderProfile as boolean

        if (role === "CUSTOMER") {
          router.replace("/")
        } else if (role === "PROVIDER") {
          router.replace(hasProviderProfile ? "/provider-dashboard" : "/create-provider-profile")
        } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
          router.replace("/admin-dashboard")
        } else {
          router.replace("/")
        }
      } catch {
        router.replace("/login")
      }
    }

    redirect()
  }, [router])

  return (
      <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "16px",
        fontFamily: "sans-serif",
        color: "#555",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "spin 1s linear infinite" }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p>Signing you in…</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}