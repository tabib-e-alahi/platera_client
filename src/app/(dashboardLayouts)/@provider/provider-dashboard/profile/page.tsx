// src/app/(provider)/provider-dashboard/profile/page.tsx
import type { Metadata } from "next"

import "./profile.css"
import ProviderProfilePage from "../../_components/ProviderProfilePage"

export const metadata: Metadata = { title: "My Profile" }

export default function ProfilePage() {
  return <ProviderProfilePage />
}