"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProviders, updateProviderStatus } from "@/services/admin.service";
import { toast } from "sonner";
import "./admin-providers.css";

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
      setProviders(
        rawProviders.map((p) => ({
          ...p,
          draftApprovalStatus: p.approvalStatus,
          draftUserStatus: p.user?.status ?? "ACTIVE",
        }))
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load providers.");
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const updateDraftField = <
    K extends keyof Pick<TEditableProvider, "draftApprovalStatus" | "draftUserStatus">
  >(
    providerId: string,
    field: K,
    value: TEditableProvider[K]
  ) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, [field]: value } : p))
    );
  };

  const hasChanges = (p: TEditableProvider) =>
    p.approvalStatus !== p.draftApprovalStatus ||
    (p.user?.status ?? "ACTIVE") !== p.draftUserStatus;

  const handleSaveChanges = async (provider: TEditableProvider) => {
    if (!hasChanges(provider)) {
      toast.info("No changes to save.");
      return;
    }

    toast(`Save changes for ${provider.businessName}?`, {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            setBusyId(provider.id);
            await updateProviderStatus(provider.id, {
              approvalStatus: provider.draftApprovalStatus,
              userStatus: provider.draftUserStatus,
            });
            toast.success("Provider status updated.");
            await fetchProviders();
          } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Update failed.");
          } finally {
            setBusyId(null);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const providerCount = useMemo(() => providers.length, [providers]);

  return (
    <div className="aproviders">

      {/* header */}
      <div className="aproviders__header">
        <div>
          <p className="aproviders__eyebrow">Admin Panel</p>
          <h1 className="aproviders__title">All Providers</h1>
          <p className="aproviders__subtitle">
            Manage provider approval and account status.
          </p>
        </div>
        <div className="aproviders__count">
          Total:{" "}
          <strong>{providerCount}</strong>
        </div>
      </div>

      {/* grid */}
      <div className="aproviders__grid">
        {providers.map((provider) => {
          const changed = hasChanges(provider);
          const isBusy = busyId === provider.id;

          return (
            <div key={provider.id} className="aprov-card">

              <p className="aprov-card__name">{provider.businessName}</p>
              <p className="aprov-card__user">{provider.user?.name ?? "N/A"}</p>
              <p className="aprov-card__email">{provider.user?.email ?? "N/A"}</p>

              <div className="aprov-card__meta">
                <span className="aprov-card__meta-item">
                  {provider.businessCategory}
                </span>
                <span className="aprov-card__meta-item">
                  {provider.city}
                </span>
              </div>

              <div className="aprov-card__fields">
                <div className="aprov-card__field">
                  <label className="aprov-card__label">Approval status</label>
                  <select
                    className="aprov-card__select"
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
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="aprov-card__field">
                  <label className="aprov-card__label">Account status</label>
                  <select
                    className="aprov-card__select"
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
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="aprov-card__footer">
                {changed ? (
                  <span className="aprov-card__unsaved">Unsaved changes</span>
                ) : (
                  <span className="aprov-card__clean">No pending changes</span>
                )}

                <button
                  type="button"
                  className="aprov-card__save-btn"
                  disabled={!changed || isBusy}
                  onClick={() => handleSaveChanges(provider)}
                >
                  {isBusy ? "Saving…" : "Save changes"}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}