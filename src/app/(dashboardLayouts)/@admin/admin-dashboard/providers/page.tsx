"use client";

import { useEffect, useState } from "react";
import { getAllProviders, updateProviderStatus } from "@/services/admin.service";
import { toast } from "sonner";

type TProvider = {
  id: string;
  businessName: string;
  businessCategory: string;
  city: string;
  approvalStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  user?: {
    name?: string;
    email?: string;
    status?: "ACTIVE" | "SUSPENDED";
  };
};

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<TProvider[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      const res = await getAllProviders();
      setProviders(res?.data?.providers ?? []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to load providers."
      );
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleApprovalChange = async (
    providerId: string,
    approvalStatus: TProvider["approvalStatus"]
  ) => {
    try {
      setBusyId(providerId);
      await updateProviderStatus(providerId, { approvalStatus });
      toast.success("Provider approval status updated.");
      await fetchProviders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to update provider."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleUserStatusChange = async (
    providerId: string,
    userStatus: "ACTIVE" | "SUSPENDED"
  ) => {
    try {
      setBusyId(providerId);
      await updateProviderStatus(providerId, { userStatus });
      toast.success("Provider account status updated.");
      await fetchProviders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update account status."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">All Providers</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <p className="text-lg font-semibold">{provider.businessName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {provider.user?.name ?? "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {provider.user?.email ?? "N/A"}
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <p>
                <span className="font-medium">Type:</span>{" "}
                {provider.businessCategory}
              </p>
              <p>
                <span className="font-medium">District:</span> {provider.city}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Approval Status
                </label>
                <select
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  value={provider.approvalStatus}
                  disabled={busyId === provider.id}
                  onChange={(e) =>
                    handleApprovalChange(
                      provider.id,
                      e.target.value as TProvider["approvalStatus"]
                    )
                  }
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Account Status
                </label>
                <select
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  value={provider.user?.status ?? "ACTIVE"}
                  disabled={busyId === provider.id}
                  onChange={(e) =>
                    handleUserStatusChange(
                      provider.id,
                      e.target.value as "ACTIVE" | "SUSPENDED"
                    )
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}