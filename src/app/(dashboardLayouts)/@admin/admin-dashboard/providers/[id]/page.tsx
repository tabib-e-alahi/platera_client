"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { approveProvider, getProviderDetail, rejectProvider, updateProviderStatus } from "@/services/admin.service";
import { toast } from "sonner";
import "./admin-provider-detail.css";

<<<<<<< HEAD
=======
/* ─── Detail skeleton ────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
function DetailSkeleton() {
  return (
    <div className="apd">
      <div className="apd__back-ph" />
      <div className="apd__hero-sk">
        <div className="apd__sk-circle" />
        <div className="apd__sk-lines">
          <div className="apd__sk-line apd__sk-line--xl" />
          <div className="apd__sk-line apd__sk-line--md" />
          <div className="apd__sk-line apd__sk-line--sm" />
        </div>
      </div>
      <div className="apd__grid">
        {[1,2,3,4].map(k => (
          <div key={k} className="apd__card">
            <div className="apd__sk-title" />
            {[1,2,3].map(r => <div key={r} className="apd__sk-row" />)}
          </div>
        ))}
      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
/* ─── Info row ───────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
function InfoRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: "green" | "red" }) {
  return (
    <div className="apd__row">
      <span className="apd__row-label">{label}</span>
      <span className={`apd__row-val${highlight === "green" ? " apd__row-val--green" : highlight === "red" ? " apd__row-val--red" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

<<<<<<< HEAD
=======
/* ─── Main page ──────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
export default function AdminProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "review">("info");

  useEffect(() => {
    (async () => {
      try {
        const res = await getProviderDetail(id);
        setProvider(res?.data ?? null);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to load provider.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleApprove = async () => {
    setBusy(true);
    try {
      await approveProvider(id);
      toast.success("Provider approved and email sent.");
      router.push("/admin-dashboard/providers");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Approval failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) { toast.error("Rejection reason is required."); return; }
    setBusy(true);
    try {
      await rejectProvider(id, { rejectionReason: note });
      toast.success("Provider rejected and email sent.");
      router.push("/admin-dashboard/providers");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Rejection failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleSuspend = async () => {
    if (!provider) return;
    const isSuspended = provider.user?.status === "SUSPENDED";
    toast.warning(`${isSuspended ? "Reactivate" : "Suspend"} ${provider.businessName}?`, {
      action: {
        label: "Confirm",
        onClick: async () => {
          setBusy(true);
          try {
            await updateProviderStatus(id, { userStatus: isSuspended ? "ACTIVE" : "SUSPENDED" });
            toast.success(`Provider account ${isSuspended ? "reactivated" : "suspended"}.`);
            const res = await getProviderDetail(id);
            setProvider(res?.data ?? null);
          } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Update failed.");
          } finally {
            setBusy(false);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  if (isLoading) return <DetailSkeleton />;
  if (!provider) return (
    <div className="apd">
      <Link href="/admin-dashboard/providers" className="apd__back">← Back to providers</Link>
      <div className="apd__error">
        <p className="apd__error-icon">🔍</p>
        <p className="apd__error-title">Provider not found</p>
        <p className="apd__error-sub">This provider may have been removed.</p>
      </div>
    </div>
  );

  const isPending   = provider.approvalStatus === "PENDING";
  const isApproved  = provider.approvalStatus === "APPROVED";
  const isSuspended = provider.user?.status === "SUSPENDED";

  return (
    <div className="apd">
      {/* Back */}
      <Link href="/admin-dashboard/providers" className="apd__back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to providers
      </Link>

      {/* Hero */}
      <div className="apd__hero">
        <div className="apd__hero-left">
          <div className="apd__hero-avatar">
            {provider.imageURL
              ? <Image src={provider.imageURL} alt={provider.businessName} fill className="object-cover" />
              : <span>🍽</span>}
          </div>
          <div>
            <p className="apd__eyebrow">Provider review</p>
            <h1 className="apd__title">{provider.businessName}</h1>
            <p className="apd__sub">{provider.user?.name} · {provider.user?.email}</p>
            <div className="apd__hero-meta">
              <span className="apd__hero-pill">{provider.businessCategory}</span>
              <span className="apd__hero-pill">📍 {provider.city}</span>
              {provider.mealCount  !== undefined && <span className="apd__hero-pill">🍱 {provider.mealCount} meals</span>}
              {provider.orderCount !== undefined && <span className="apd__hero-pill">📦 {provider.orderCount} orders</span>}
            </div>
          </div>
        </div>
        <div className="apd__hero-right">
          <span className={`apd__status apd__status--${(provider.approvalStatus ?? "DRAFT").toLowerCase()}`}>
            {provider.approvalStatus}
          </span>
          {isSuspended && <span className="apd__suspended-tag">⚠ Suspended</span>}
          {isApproved && (
            <button className={`apd__suspend-btn${isSuspended ? " apd__suspend-btn--reactivate" : ""}`} onClick={handleToggleSuspend} disabled={busy}>
              {isSuspended ? "Reactivate account" : "Suspend account"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="apd__tabs">
        <button className={`apd__tab${activeTab === "info" ? " apd__tab--active" : ""}`} onClick={() => setActiveTab("info")}>Provider info</button>
        {isPending && (
          <button className={`apd__tab apd__tab--review${activeTab === "review" ? " apd__tab--active" : ""}`} onClick={() => setActiveTab("review")}>
            <span className="apd__tab-dot" />Review decision
          </button>
        )}
      </div>

      {/* Info tab */}
      {activeTab === "info" && (
        <div className="apd__grid">
          <div className="apd__card">
            <p className="apd__card-title">Personal info</p>
            <div className="apd__rows">
              <InfoRow label="Full name"       value={provider.user?.name} />
              <InfoRow label="Email"           value={provider.user?.email} />
              <InfoRow label="Phone"           value={provider.user?.phone ?? provider.phone} />
              <InfoRow label="Email verified"  value={provider.user?.emailVerified ? "Yes" : "No"} highlight={provider.user?.emailVerified ? "green" : "red"} />
              <InfoRow label="Account status"  value={provider.user?.status} highlight={provider.user?.status === "ACTIVE" ? "green" : "red"} />
            </div>
          </div>

          <div className="apd__card">
            <p className="apd__card-title">Business info</p>
            <div className="apd__rows">
              <InfoRow label="Business name" value={provider.businessName} />
              <InfoRow label="Category"      value={provider.businessCategory} />
              <InfoRow label="BIN number"    value={provider.binNumber} />
              <InfoRow label="Business email" value={provider.businessEmail} />
              <InfoRow label="Bio"           value={provider.bio} />
            </div>
          </div>

          <div className="apd__card apd__card--full">
            <p className="apd__card-title">Address</p>
            <div className="apd__rows apd__rows--cols">
              <InfoRow label="District"    value={provider.city} />
              <InfoRow label="Street"      value={provider.street} />
              <InfoRow label="House"       value={provider.houseNumber} />
              <InfoRow label="Apartment"   value={provider.apartment && `Apt ${provider.apartment}`} />
              <InfoRow label="Postal code" value={provider.postalCode} />
            </div>
          </div>

          {(provider.imageURL || provider.businessMainGateURL || provider.businessKitchenURL) && (
            <div className="apd__card apd__card--full">
              <p className="apd__card-title">Uploaded images</p>
              <div className="apd__images">
                {[
                  { url: provider.imageURL,              label: "Profile photo" },
                  { url: provider.businessMainGateURL,   label: "Main gate" },
                  { url: provider.businessKitchenURL,    label: "Kitchen" },
                ].filter(i => i.url).map(({ url, label }) => (
                  <div key={label} className="apd__image-wrap">
                    <span className="apd__image-label">{label}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="apd__img-link">
                      <img src={url} alt={label} className="apd__img" />
                      <span className="apd__img-overlay">View full ↗</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {provider.rejectionReason && (
            <div className="apd__card apd__card--full apd__card--rejection">
              <p className="apd__card-title">Previous rejection reason</p>
              <p className="apd__rejection-text">"{provider.rejectionReason}"</p>
            </div>
          )}
        </div>
      )}

      {/* Review tab */}
      {activeTab === "review" && isPending && (
        <div className="apd__review">
          <div className="apd__review-hint-card">
            <span className="apd__review-hint-icon">ℹ️</span>
            <p>Review the provider information above before making a decision. If rejecting, provide a clear reason so the provider can resubmit.</p>
          </div>

          <div className="apd__review-card">
            <p className="apd__card-title">Rejection reason <span className="apd__card-optional">(required only when rejecting)</span></p>
            <textarea
              className="apd__textarea"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              placeholder="e.g. Documents are unclear. Please re-upload your kitchen and gate photos."
            />

            <div className="apd__actions">
              <button className="apd__approve-btn" onClick={handleApprove} disabled={busy}>
                {busy ? <><span className="apd__btn-spinner" /> Processing…</> : "✓ Approve provider"}
              </button>
              <button className="apd__reject-btn" onClick={handleReject} disabled={busy}>
                {busy ? <><span className="apd__btn-spinner" /> Processing…</> : "✕ Reject provider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}