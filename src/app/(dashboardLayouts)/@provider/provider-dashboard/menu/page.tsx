// src/app/(provider)/provider-dashboard/menu/page.tsx
import type { Metadata } from "next"
import "./menu.css"
import MenuPage from "../../_components/MenuPage"

export const metadata: Metadata = { title: "My Menu" }

export default function Page() {
  return <MenuPage />
}