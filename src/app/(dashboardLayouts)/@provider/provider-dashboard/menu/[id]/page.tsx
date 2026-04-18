// src/app/(provider)/provider-dashboard/menu/[id]/page.tsx
import type { Metadata } from "next"
import "./edit-meal.css"
import EditMealPage from "../../../_components/EditMealPage"

export const metadata: Metadata = { title: "Edit Meal" }

export default function Page({
  params,
}: {
  params: { id: string }
}) {
  return <EditMealPage mealId={params.id} />
}