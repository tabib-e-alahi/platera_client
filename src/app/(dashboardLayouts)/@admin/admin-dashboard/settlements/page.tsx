// src/app/(dashboardLayouts)/@admin/admin-dashboard/settlements/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAdminPayments,
  settlePayment,
  bulkSettleProvider,
} from "@/services/payment.service";
import "./settlements.css";

export default function AdminSettlementsPage() {
  const [payments, setPayments]         = useState<any[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [filter, setFilter]             = useState("PENDING"); // PENDING | PAID | all
  const [busyId, setBusyId]             = useState<string | null>(null);
  const [noteMap, setNoteMap]           = useState<Record<string, string>>({});
  const limit = 20;

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAdminPayments({
        page,
        limit,
        settlementStatus: filter === "all" ? undefined : filter,
      });
      setPayments(res?.data?.payments ?? []);
      setTotal(res?.data?.pagination?.total ?? 0);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load payments.");
    } finally {
      setIsLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleSettle = async (paymentId: string) => {
<<<<<<< HEAD
=======
    console.log(paymentId);
>>>>>>> dc5656236feee959b1e0e891718009336b905842
    setBusyId(paymentId);
    try {
      const res = await settlePayment(paymentId, noteMap[paymentId]);
      if (res?.success) {
        toast.success("Payment settled.");
        fetchPayments();
      } else {
        toast.error(res?.message ?? "Settlement failed.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Settlement failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleBulkSettle = async (providerId: string, businessName: string) => {
    if (!confirm(`Bulk settle all pending payments for ${businessName}?`)) return;
    setBusyId(`bulk-${providerId}`);
    try {
      const res = await bulkSettleProvider(providerId);
      if (res?.success) {
        toast.success(`Bulk settled ৳${res.data?.totalSettled?.toFixed(2)} for ${businessName}.`);
        fetchPayments();
      } else {
        toast.error(res?.message ?? "Bulk settlement failed.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed.");
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-BD", {
      day: "numeric", month: "short", year: "numeric",
    }) : "—";

  const totalPages = Math.ceil(total / limit);

<<<<<<< HEAD
  // Derive how many PENDING rows are non-DELIVERED (i.e. not yet settleable)
  const nonDeliveredPendingCount = payments.filter(
    (p) => p.providerSettlementStatus === "PENDING" && p.order?.status !== "DELIVERED"
  ).length;

=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  return (
    <div className="sett">

      <div className="sett__header">
        <div>
          <p className="sett__eyebrow">Admin Panel</p>
          <h1 className="sett__title">Provider Settlements</h1>
          <p className="sett__subtitle">
            Manage and settle provider earnings from completed payments.
          </p>
        </div>
        <div className="sett__total-badge">
          {total} payment{total !== 1 ? "s" : ""}
        </div>
      </div>

<<<<<<< HEAD
      <div className="sett__policy-banner">
        <span className="sett__policy-icon">⚠️</span>
        <div className="sett__policy-text">
          <strong>Settle payments only after successful delivery.</strong>
          {" "}If a customer cancels an order that hasn&apos;t been settled yet,
          the refund is handled entirely on the admin/platform side — no action
          needed from the provider. Settling early (before delivery) means a
          cancellation would require a manual clawback from the provider, which
          is significantly more complex.
          {nonDeliveredPendingCount > 0 && (
            <span className="sett__policy-count">
              {" "}· {nonDeliveredPendingCount} pending payment{nonDeliveredPendingCount !== 1 ? "s" : ""} below {nonDeliveredPendingCount !== 1 ? "are" : "is"} not yet delivered — settle buttons are blocked.
            </span>
          )}
        </div>
      </div>

=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      {/* filters */}
      <div className="sett__filters">
        {["PENDING", "PAID", "all"].map((f) => (
          <button
            key={f}
            className={`sett__filter-btn ${filter === f ? "sett__filter-btn--active" : ""}`}
            onClick={() => { setFilter(f); setPage(1); }}
          >
            {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* table */}
      {isLoading ? (
        <div className="sett__loading">Loading settlements…</div>
      ) : payments.length === 0 ? (
        <div className="sett__empty">
          <span>💰</span>
          <p>No payments found for this filter.</p>
        </div>
      ) : (
        <div className="sett__table-wrap">
          <table className="sett__table">
            <thead>
              <tr>
                <th>Order</th>
<<<<<<< HEAD
                <th>Order Status</th>
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                <th>Provider</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Provider share (75%)</th>
                <th>Paid at</th>
                <th>Settlement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
<<<<<<< HEAD
                const isRefunded   = payment.status === "REFUNDED";
                const isPending    = payment.providerSettlementStatus === "PENDING" && !isRefunded;
                const isBusy       = busyId === payment.id;
                const orderStatus  = payment.order?.status ?? "—";
                const isDelivered  = orderStatus === "DELIVERED";
                const canSettle    = isPending && isDelivered;
=======
                const isPending = payment.providerSettlementStatus === "PENDING";
                const isBusy    = busyId === payment.id;
>>>>>>> dc5656236feee959b1e0e891718009336b905842

                return (
                  <tr key={payment.id}>
                    <td>
                      <span className="sett__order-num">
                        {payment.order?.orderNumber}
                      </span>
                    </td>
                    <td>
<<<<<<< HEAD
                      <span className={`sett__order-status sett__order-status--${orderStatus.toLowerCase().replace(/_/g, "-")}`}>
                        {orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                      <div className="sett__provider">
                        <span className="sett__provider-name">
                          {payment.provider?.businessName}
                        </span>
                        <span className="sett__provider-city">
                          {payment.provider?.city}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="sett__customer">
                        {payment.customer?.name}
                      </span>
                    </td>
                    <td>
                      <span className="sett__amount">
                        ৳{Number(payment.amount).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="sett__share">
                        ৳{Number(payment.providerShareAmount).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="sett__date">
                        {formatDate(payment.paidAt)}
                      </span>
                    </td>
                    <td>
<<<<<<< HEAD
                      <span className={`sett__status ${isRefunded ? "sett__status--refunded" : isPending ? "sett__status--pending" : "sett__status--paid"}`}>
                        {isRefunded ? "Refunded" : isPending ? "Pending" : "Settled"}
=======
                      <span className={`sett__status ${isPending ? "sett__status--pending" : "sett__status--paid"}`}>
                        {isPending ? "Pending" : "Settled"}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                      </span>
                      {payment.providerSettledAt && (
                        <span className="sett__settled-date">
                          {formatDate(payment.providerSettledAt)}
                        </span>
                      )}
                    </td>
                    <td>
<<<<<<< HEAD
                      {isRefunded ? (
                        <span className="sett__refunded-note">
                          🔄 Refunded — no settlement required
                        </span>
                      ) : isPending ? (
                        <div className="sett__action-cell">
                          {!isDelivered && (
                            <p className="sett__not-delivered-note">
                              ⏳ Awaiting delivery before settlement
                            </p>
                          )}
                          {isDelivered && (
                            <input
                              className="sett__note-input"
                              placeholder="Settlement note…"
                              value={noteMap[payment.id] ?? ""}
                              onChange={(e) =>
                                setNoteMap((prev) => ({
                                  ...prev,
                                  [payment.id]: e.target.value,
                                }))
                              }
                            />
                          )}
                          <div className="sett__btns">
                            <button
                              className={`sett__settle-btn ${!canSettle ? "sett__settle-btn--disabled" : ""}`}
                              disabled={isBusy || !canSettle}
                              onClick={() => handleSettle(payment.id)}
                              title={!isDelivered ? "Can only settle after order is delivered" : "Settle this payment"}
=======
                      {isPending ? (
                        <div className="sett__action-cell">
                          <input
                            className="sett__note-input"
                            placeholder="Settlement note…"
                            value={noteMap[payment.id] ?? ""}
                            onChange={(e) =>
                              setNoteMap((prev) => ({
                                ...prev,
                                [payment.id]: e.target.value,
                              }))
                            }
                          />
                          <div className="sett__btns">
                            <button
                              className="sett__settle-btn"
                              disabled={isBusy}
                              onClick={() => handleSettle(payment.id)}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                            >
                              {isBusy ? "…" : "Settle"}
                            </button>
                            <button
                              className="sett__bulk-btn"
                              disabled={!!busyId}
                              onClick={() =>
                                handleBulkSettle(
                                  payment.providerId,
                                  payment.provider?.businessName
                                )
                              }
<<<<<<< HEAD
                              title="Settle all DELIVERED pending payments for this provider"
=======
                              title="Settle all pending for this provider"
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                            >
                              Bulk
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="sett__settled-note">
                          {payment.providerSettlementNote ?? "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="sett__pagination">
          <button
            className="sett__page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >←</button>
          <span className="sett__page-info">{page} / {totalPages}</span>
          <button
            className="sett__page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >→</button>
        </div>
      )}
    </div>
  );
}