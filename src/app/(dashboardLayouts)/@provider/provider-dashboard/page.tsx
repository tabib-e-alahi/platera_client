"use client"

import { useAuth } from "@/providers/AuthProvider";

export default function ProviderDashboardPage() {
  const {user} = useAuth()
  console.log(user);
  return (
    <div>
      <h1>provider page</h1>
    </div>
  );
}