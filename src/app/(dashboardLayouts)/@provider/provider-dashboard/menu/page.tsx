import type { Metadata } from "next"
import MenuPage from "../../_components/MenuPage"
import "./menu.css"
export const metadata: Metadata = { title: "My Menu" }

export default function MenuMainPage() {
  return <MenuPage />
}