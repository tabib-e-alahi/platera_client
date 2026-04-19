"use client";

import { useEffect, useMemo, useState } from "react";
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

type TEditableProvider = TProvider & {
  draftApprovalStatus: TProvider["approvalStatus"];
  draftUserStatus: "ACTIVE" | "SUSPENDED";
};

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<TEditableProvider[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      const res = await getAllProviders();
      const rawProviders: TProvider[] = res?.data?.providers ?? [];

      const mappedProviders: TEditableProvider[] = rawProviders.map((provider) => ({
        ...provider,
        draftApprovalStatus: provider.approvalStatus,
        draftUserStatus: provider.user?.status ?? "ACTIVE",
      }));

      setProviders(mappedProviders);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to load providers."
      );
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const updateDraftField = <
    K extends keyof Pick<TEditableProvider, "draftApprovalStatus" | "draftUserStatus">
  >(
    providerId: string,
    field: K,
    value: TEditableProvider[K]
  ) => {
    setProviders((prev) =>
      prev.map((provider) =>
        provider.id === providerId ? { ...provider, [field]: value } : provider
      )
    );
  };

  const hasChanges = (provider: TEditableProvider) => {
    const currentApproval = provider.approvalStatus;
    const draftApproval = provider.draftApprovalStatus;

    const currentUserStatus = provider.user?.status ?? "ACTIVE";
    const draftUserStatus = provider.draftUserStatus;

    return (
      currentApproval !== draftApproval || currentUserStatus !== draftUserStatus
    );
  };

  const handleSaveChanges = async (provider: TEditableProvider) => {
    if (!hasChanges(provider)) {
      toast.info("No changes to save.");
      return;
    }

    toast(
      `Save changes for ${provider.businessName}?`,
      {
        action: {
          label: "Confirm",
          onClick: async () => {
            try {
              setBusyId(provider.id);

              await updateProviderStatus(provider.id, {
                approvalStatus: provider.draftApprovalStatus,
                userStatus: provider.draftUserStatus,
              });

              toast.success("Provider status updated successfully.");
              await fetchProviders();
            } catch (error: any) {
              toast.error(
                error?.response?.data?.message ?? "Failed to update provider."
              );
            } finally {
              setBusyId(null);
            }
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
      }
    );
  };

  const providerCount = useMemo(() => providers.length, [providers]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">All Providers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage provider approval and account status.
          </p>
        </div>

        <div className="rounded-xl border bg-card px-4 py-2 text-sm text-muted-foreground">
          Total Providers: <span className="font-semibold text-foreground">{providerCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => {
          const changed = hasChanges(provider);
          const isBusy = busyId === provider.id;

          return (
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
                    value={provider.draftApprovalStatus}
                    disabled={isBusy}
                    onChange={(e) =>
                      updateDraftField(
                        provider.id,
                        "draftApprovalStatus",
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
                    value={provider.draftUserStatus}
                    disabled={isBusy}
                    onChange={(e) =>
                      updateDraftField(
                        provider.id,
                        "draftUserStatus",
                        e.target.value as "ACTIVE" | "SUSPENDED"
                      )
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span
                  className={`text-xs font-medium ${
                    changed ? "text-amber-600" : "text-muted-foreground"
                  }`}
                >
                  {changed ? "Unsaved changes" : "No pending changes"}
                </span>

                <button
                  type="button"
                  disabled={!changed || isBusy}
                  onClick={() => handleSaveChanges(provider)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBusy ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}