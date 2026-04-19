// src/app/(provider)/layout.tsx
import type { Metadata } from "next"
import "./provider-layout.css"
import Sidebar from "@/components/shared/DashboardSidebar/Sidebar"

export const metadata: Metadata = {
  title: {
    template: "%s | Provider Dashboard — Platera",
    default: "Provider Dashboard — Platera",
  },
}

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pd-layout">
      <Sidebar/>
      <main className="pd-main">{children}</main>
    </div>
  )
}