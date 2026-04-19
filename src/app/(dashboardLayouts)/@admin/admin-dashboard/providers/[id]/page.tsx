"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  approveProvider,
  getProviderDetail,
  rejectProvider,
} from "@/services/admin.service";
import { toast } from "sonner";
import "./admin-provider-detail.css";

export default function AdminProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProviderDetail(id);
        setProvider(res?.data ?? null);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to load provider.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleApprove = async () => {
    try {
      setBusy(true);
      await approveProvider(id);
      toast.success("Provider approved.");
      router.push("/admin-dashboard/providers");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Approval failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    try {
      setBusy(true);
      await rejectProvider(id, { rejectionReason: note });
      toast.success("Provider rejected.");
      router.push("/admin-dashboard/providers");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Rejection failed.");
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="apd">
        <p className="apd__loading">Loading provider…</p>
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="apd">

      {/* back */}
      <Link href="/admin-dashboard/providers" className="apd__back">
        ← Back to providers
      </Link>

      {/* header */}
      <div className="apd__header">
        <div>
          <p className="apd__eyebrow">Provider review</p>
          <h1 className="apd__title">{provider.businessName}</h1>
          <p className="apd__sub">
            {provider.user?.name} · {provider.user?.email}
          </p>
        </div>
        <span className={`apd__status apd__status--${(provider.approvalStatus ?? "DRAFT").toLowerCase()}`}>
          {provider.approvalStatus}
        </span>
      </div>

      {/* info grid */}
      <div className="apd__grid">

        <div className="apd__card">
          <p className="apd__card-title">Personal info</p>
          <div className="apd__rows">
            <div className="apd__row"><span>Name</span><span>{provider.user?.name}</span></div>
            <div className="apd__row"><span>Email</span><span>{provider.user?.email}</span></div>
            <div className="apd__row"><span>Phone</span><span>{provider.user?.phone ?? provider.phone ?? "N/A"}</span></div>
            <div className="apd__row">
              <span>Email verified</span>
              <span className={provider.user?.emailVerified ? "apd__yes" : "apd__no"}>
                {provider.user?.emailVerified ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="apd__card">
          <p className="apd__card-title">Business info</p>
          <div className="apd__rows">
            <div className="apd__row"><span>Business name</span><span>{provider.businessName}</span></div>
            <div className="apd__row"><span>Type</span><span>{provider.businessCategory}</span></div>
            <div className="apd__row"><span>BIN</span><span>{provider.binNumber ?? "N/A"}</span></div>
            <div className="apd__row"><span>Bio</span><span>{provider.bio ?? "N/A"}</span></div>
          </div>
        </div>

        <div className="apd__card apd__card--full">
          <p className="apd__card-title">Address</p>
          <div className="apd__rows">
            <div className="apd__row"><span>District</span><span>{provider.city}</span></div>
            <div className="apd__row"><span>Street</span><span>{provider.street}</span></div>
            <div className="apd__row">
              <span>House / Apt</span>
              <span>
                {provider.houseNumber}
                {provider.apartment ? `, Apt ${provider.apartment}` : ""}
              </span>
            </div>
            <div className="apd__row"><span>Postal code</span><span>{provider.postalCode ?? "N/A"}</span></div>
          </div>
        </div>

        {/* images */}
        {(provider.imageURL || provider.businessMainGateURL || provider.businessKitchenURL) && (
          <div className="apd__card apd__card--full">
            <p className="apd__card-title">Images</p>
            <div className="apd__images">
              {provider.imageURL && (
                <div className="apd__image-wrap">
                  <span className="apd__image-label">Profile</span>
                  <img src={provider.imageURL} alt="Profile" className="apd__img" />
                </div>
              )}
              {provider.businessMainGateURL && (
                <div className="apd__image-wrap">
                  <span className="apd__image-label">Main gate</span>
                  <img src={provider.businessMainGateURL} alt="Gate" className="apd__img" />
                </div>
              )}
              {provider.businessKitchenURL && (
                <div className="apd__image-wrap">
                  <span className="apd__image-label">Kitchen</span>
                  <img src={provider.businessKitchenURL} alt="Kitchen" className="apd__img" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* review action */}
        <div className="apd__card apd__card--full">
          <p className="apd__card-title">Review decision</p>
          <p className="apd__review-hint">
            Add a rejection reason below if you intend to reject this provider.
            Leave it blank if approving.
          </p>
          <textarea
            className="apd__textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Rejection reason (required only when rejecting)…"
          />
          <div className="apd__actions">
            <button
              className="apd__approve-btn"
              onClick={handleApprove}
              disabled={busy}
            >
              {busy ? "Processing…" : "✓ Approve provider"}
            </button>
            <button
              className="apd__reject-btn"
              onClick={handleReject}
              disabled={busy}
            >
              {busy ? "Processing…" : "✕ Reject provider"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}