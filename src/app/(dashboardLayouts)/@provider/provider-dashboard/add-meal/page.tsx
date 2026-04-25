// src/app/(provider)/provider-dashboard/add-meal/page.tsx
import type { Metadata } from "next"
import AddMealForm from "../../_components/AddMealForm"
import "./add-meal.css"

export const metadata: Metadata = {
  title: "Add Meal",
}

export default function AddMealPage() {
  return (
    <div className="am-page">
      <div className="am-header">
        <div>
          <h1 className="am-title">Add a new meal</h1>
          <p className="am-subtitle">
            Fill in the details below to add a meal to your menu.
          </p>
        </div>
      </div>
      <AddMealForm />
    </div>
  )
}