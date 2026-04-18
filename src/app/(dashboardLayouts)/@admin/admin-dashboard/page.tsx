"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/services/admin.service";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminDashboardStats();
        setStats(res?.data ?? null);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to load dashboard.");
      }
    })();
  }, []);

  const cards = [
    ["Users", stats?.totalUsers ?? 0],
    ["Providers", stats?.totalProviders ?? 0],
    ["Pending Providers", stats?.pendingProviders ?? 0],
    ["Meals", stats?.totalMeals ?? 0],
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}