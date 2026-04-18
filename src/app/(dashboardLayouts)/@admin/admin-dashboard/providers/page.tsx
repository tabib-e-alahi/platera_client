"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPendingProviders } from "@/services/admin.service";
import { toast } from "sonner";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPendingProviders();
        setProviders(res?.data?.providers ?? []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to load providers.");
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Pending Provider Requests</h1>

      <div className="space-y-3">
        {providers.map((provider) => (
          <div key={provider.id} className="rounded-2xl border bg-card p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{provider.businessName}</p>
                <p className="text-sm text-muted-foreground">
                  {provider.user?.name} · {provider.user?.email} · {provider.city}
                </p>
              </div>
              <Link
                href={`/admin-dashboard/providers/${provider.id}`}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}