// src/app/(provider)/provider-dashboard/menu/[id]/page.tsx
import type { Metadata } from "next"
import "./edit-meal.css"
import EditMealPage from "../../../_components/EditMealPage"

export const metadata: Metadata = { title: "Edit Meal" }

export default async function SingleproviderMealPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditMealPage mealId={id} />
}