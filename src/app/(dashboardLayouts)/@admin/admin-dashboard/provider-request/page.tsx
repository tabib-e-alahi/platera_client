"use client";

import { useEffect, useState } from "react";
import {
  approveProvider,
  getPendingProviders,
  getProviderDetail,
  rejectProvider,
} from "@/services/admin.service";
import { toast } from "sonner";
import "./admin-requests.css";

type TProvider = {
  id: string;
  businessName: string;
  businessCategory: string;
  city: string;
  approvalStatus: string;
  user: {
    name: string;
    email: string;
    createdAt: string;
  };
};

export default function AdminProviderRequestPage() {
  const [providers, setProviders] = useState<TProvider[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [providerDetail, setProviderDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchProviders = async () => {
    try {
      const res = await getPendingProviders();
      setProviders(res?.data?.providers ?? []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load provider requests.");
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const openReview = async (id: string) => {
    try {
      setSelectedId(id);
      setLoadingDetail(true);
      setReason("");
      const res = await getProviderDetail(id);
      setProviderDetail(res?.data ?? null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load provider detail.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setProviderDetail(null);
    setReason("");
  };

  const handleApprove = async () => {
    if (!selectedId) return;
    try {
      setBusy(true);
      await approveProvider(selectedId);
      toast.success("Provider approved successfully.");
      closeModal();
      await fetchProviders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Approval failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!selectedId) return;
    if (!reason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    try {
      setBusy(true);
      await rejectProvider(selectedId, { rejectionReason: reason });
      toast.success("Provider rejected.");
      closeModal();
      await fetchProviders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Rejection failed.");
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-BD", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div className="areq">

      {/* header */}
      <div className="areq__header">
        <p className="areq__eyebrow">Admin Panel</p>
        <h1 className="areq__title">Provider Requests</h1>
        <p className="areq__subtitle">
          Review and act on pending provider applications.
        </p>
      </div>

      {/* cards */}
      {providers.length === 0 ? (
        <div className="areq__empty">
          <span className="areq__empty-icon">📋</span>
          <p className="areq__empty-title">No pending requests</p>
          <p className="areq__empty-hint">
            All provider applications have been reviewed.
          </p>
        </div>
      ) : (
        <div className="areq__grid">
          {providers.map((provider) => (
            <div key={provider.id} className="areq-card">
              <p className="areq-card__name">{provider.businessName}</p>
              <p className="areq-card__user">{provider.user.name}</p>
              <p className="areq-card__email">{provider.user.email}</p>

              <div className="areq-card__meta">
                <span className="areq-card__meta-tag">
                  {provider.businessCategory}
                </span>
                <span className="areq-card__meta-tag">
                  {provider.city}
                </span>
              </div>

              <p className="areq-card__date">
                Registered {formatDate(provider.user.createdAt)}
              </p>

              <button
                className="areq-card__review-btn"
                onClick={() => openReview(provider.id)}
              >
                Review application
              </button>
            </div>
          ))}
        </div>
      )}

      {/* modal */}
      {selectedId && (
        <div className="areq-modal-overlay">
          <div className="areq-modal">
            {loadingDetail || !providerDetail ? (
              <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading…</p>
            ) : (
              <>
                {/* modal header */}
                <div className="areq-modal__header">
                  <div>
                    <h2 className="areq-modal__title">
                      {providerDetail.businessName}
                    </h2>
                    <p className="areq-modal__sub">
                      {providerDetail.user?.name} · {providerDetail.user?.email}
                    </p>
                  </div>
                  <button className="areq-modal__close" onClick={closeModal}>
                    Close
                  </button>
                </div>

                {/* modal content grid */}
                <div className="areq-modal__grid">

                  {/* personal info */}
                  <div className="areq-modal__section">
                    <p className="areq-modal__section-title">Personal info</p>
                    <p className="areq-modal__info-row">
                      <strong>Name:</strong> {providerDetail.user?.name}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Email:</strong> {providerDetail.user?.email}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Phone:</strong>{" "}
                      {providerDetail.user?.phone ?? providerDetail.phone ?? "N/A"}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Email verified:</strong>{" "}
                      {providerDetail.user?.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>

                  {/* business info */}
                  <div className="areq-modal__section">
                    <p className="areq-modal__section-title">Business info</p>
                    <p className="areq-modal__info-row">
                      <strong>Business name:</strong> {providerDetail.businessName}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Type:</strong> {providerDetail.businessCategory}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>BIN:</strong> {providerDetail.binNumber ?? "N/A"}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Bio:</strong> {providerDetail.bio ?? "N/A"}
                    </p>
                  </div>

                  {/* address */}
                  <div className="areq-modal__section areq-modal__section--full">
                    <p className="areq-modal__section-title">Address</p>
                    <p className="areq-modal__info-row">
                      <strong>District:</strong> {providerDetail.city}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Street:</strong> {providerDetail.street}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>House:</strong> {providerDetail.houseNumber}
                      {providerDetail.apartment
                        ? `, Apt ${providerDetail.apartment}`
                        : ""}
                    </p>
                    <p className="areq-modal__info-row">
                      <strong>Postal code:</strong>{" "}
                      {providerDetail.postalCode ?? "N/A"}
                    </p>
                  </div>

                  {/* images */}
                  {(providerDetail.imageURL ||
                    providerDetail.businessMainGateURL ||
                    providerDetail.businessKitchenURL) && (
                    <div className="areq-modal__section areq-modal__section--full">
                      <p className="areq-modal__section-title">Images</p>
                      <div className="areq-modal__images">
                        {providerDetail.imageURL && (
                          <img
                            src={providerDetail.imageURL}
                            alt="Profile"
                            className="areq-modal__img"
                          />
                        )}
                        {providerDetail.businessMainGateURL && (
                          <img
                            src={providerDetail.businessMainGateURL}
                            alt="Main gate"
                            className="areq-modal__img"
                          />
                        )}
                        {providerDetail.businessKitchenURL && (
                          <img
                            src={providerDetail.businessKitchenURL}
                            alt="Kitchen"
                            className="areq-modal__img"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* rejection reason */}
                  <div className="areq-modal__section areq-modal__section--full">
                    <p className="areq-modal__section-title">
                      Rejection reason
                    </p>
                    <textarea
                      className="areq-modal__textarea"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      placeholder="Required if rejecting. Leave blank if approving."
                    />
                  </div>

                </div>

                {/* actions */}
                <div className="areq-modal__actions">
                  <button
                    className="areq-modal__approve-btn"
                    onClick={handleApprove}
                    disabled={busy}
                  >
                    {busy ? "Processing…" : "Approve"}
                  </button>
                  <button
                    className="areq-modal__reject-btn"
                    onClick={handleReject}
                    disabled={busy}
                  >
                    {busy ? "Processing…" : "Reject"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}