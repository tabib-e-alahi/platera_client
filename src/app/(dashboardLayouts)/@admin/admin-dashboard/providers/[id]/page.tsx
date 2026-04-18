"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  approveProvider,
  getProviderDetail,
  rejectProvider,
} from "@/services/admin.service";
import { toast } from "sonner";

export default function AdminProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [provider, setProvider] = useState<any>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProviderDetail(id);
        setProvider(res?.data ?? null);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to load provider.");
      }
    })();
  }, [id]);

  const handleApprove = async () => {
    try {
      setBusy(true);
      await approveProvider(id);
      toast.success("Provider approved successfully.");
      router.push("/admin-dashboard/providers");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Approval failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    try {
      if (!note.trim()) {
        toast.error("Rejection reason is required.");
        return;
      }
      setBusy(true);
      await rejectProvider(id, { rejectionReason: note });
      toast.success("Provider rejected successfully.");
      router.push("/admin-dashboard/providers");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Rejection failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!provider) {
    return <div>Loading provider...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <h1 className="text-2xl font-semibold">{provider.businessName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {provider.user?.name} · {provider.user?.email}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {provider.city}, {provider.street}, {provider.houseNumber}
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold">Review Note</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          className="w-full rounded-xl border bg-background px-4 py-3"
          placeholder="Add rejection reason if needed"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleApprove}
            disabled={busy}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}