"use client";

import { useEffect, useState } from "react";
import {
  approveProvider,
  getPendingProviders,
  getProviderDetail,
  rejectProvider,
} from "@/services/admin.service";
import { toast } from "sonner";

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

  useEffect(() => {
    fetchProviders();
  }, []);

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
      toast.success("Provider rejected successfully.");
      closeModal();
      await fetchProviders();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Rejection failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Provider Requests</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => (
          <div key={provider.id} className="rounded-2xl border bg-card p-5">
            <p className="text-lg font-semibold">{provider.businessName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{provider.user.name}</p>
            <p className="text-sm text-muted-foreground">{provider.user.email}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">Business Type:</span> {provider.businessCategory}
            </p>
            <p className="text-sm">
              <span className="font-medium">District:</span> {provider.city}
            </p>

            <button
              onClick={() => openReview(provider.id)}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Review
            </button>
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
            {loadingDetail || !providerDetail ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{providerDetail.businessName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {providerDetail.user?.name} · {providerDetail.user?.email}
                    </p>
                  </div>

                  <button
                    onClick={closeModal}
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border p-4">
                    <h3 className="mb-3 font-semibold">Provider Info</h3>
                    <p><strong>Name:</strong> {providerDetail.user?.name}</p>
                    <p><strong>Email:</strong> {providerDetail.user?.email}</p>
                    <p><strong>Phone:</strong> {providerDetail.user?.phone ?? providerDetail.phone ?? "N/A"}</p>
                    <p><strong>Email Verified:</strong> {providerDetail.user?.emailVerified ? "Yes" : "No"}</p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <h3 className="mb-3 font-semibold">Business Info</h3>
                    <p><strong>Business Name:</strong> {providerDetail.businessName}</p>
                    <p><strong>Type:</strong> {providerDetail.businessCategory}</p>
                    <p><strong>Business Email:</strong> {providerDetail.businessEmail}</p>
                    <p><strong>BIN:</strong> {providerDetail.binNumber ?? "N/A"}</p>
                    <p><strong>Bio:</strong> {providerDetail.bio ?? "N/A"}</p>
                  </div>

                  <div className="rounded-xl border p-4 md:col-span-2">
                    <h3 className="mb-3 font-semibold">Address</h3>
                    <p><strong>District:</strong> {providerDetail.city}</p>
                    <p><strong>Street:</strong> {providerDetail.street}</p>
                    <p><strong>House Number:</strong> {providerDetail.houseNumber}</p>
                    <p><strong>Apartment:</strong> {providerDetail.apartment ?? "N/A"}</p>
                    <p><strong>Postal Code:</strong> {providerDetail.postalCode}</p>
                  </div>

                  <div className="rounded-xl border p-4 md:col-span-2">
                    <h3 className="mb-3 font-semibold">Images</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {providerDetail.imageURL && (
                        <img
                          src={providerDetail.imageURL}
                          alt="Provider profile"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                      )}
                      {providerDetail.businessMainGateURL && (
                        <img
                          src={providerDetail.businessMainGateURL}
                          alt="Main gate"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                      )}
                      {providerDetail.businessKitchenURL && (
                        <img
                          src={providerDetail.businessKitchenURL}
                          alt="Kitchen"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 md:col-span-2">
                    <h3 className="mb-3 font-semibold">Reason</h3>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl border px-4 py-3"
                      placeholder="Write rejection reason if you want to reject"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={busy}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={busy}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Reject
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