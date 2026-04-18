// src/app/(provider)/layout.tsx
import type { Metadata } from "next"
import "./provider-layout.css"
import ProviderSidebar from "../_components/ProviderSidebar"

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
      <ProviderSidebar />
      <main className="pd-main">{children}</main>
    </div>
  )
}