"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { cancelMyOrder } from "@/services/order.service";
import "./order-tracking.css";

/* ─── Types & constants ──────────────────────────────────────────────────── */

const ORDER_STEPS = [
  {
    key: "PENDING_PAYMENT",
    label: "Payment Pending",
    icon: "💳",
    description: "Waiting for payment",
  },
  {
    key: "PLACED",
    label: "Order Placed",
    icon: "📋",
    description: "Order sent to restaurant",
  },
  {
    key: "ACCEPTED",
    label: "Accepted",
    icon: "✅",
    description: "Restaurant confirmed",
  },
  {
    key: "PREPARING",
    label: "Preparing",
    icon: "👨‍🍳",
    description: "Chefs are cooking",
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: "🛵",
    description: "On the way to you",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: "🎉",
    description: "Enjoy your meal!",
  },
] as const;

const CANCELLABLE_STATUSES = ["PENDING_PAYMENT", "PLACED", "ACCEPTED"];

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PLACED: "Placed",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const n = (v: any) => Number(v ?? 0);

function formatDate(d?: string | null, full = true) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(full && { hour: "2-digit", minute: "2-digit" }),
  });
}

function getDeliveryAddress(data: any): string {
  const parts = [
    data.deliveryHouseNumber,
    data.deliveryStreetAddress,
    data.deliveryApartment && `Apt ${data.deliveryApartment}`,
    data.deliveryPostalCode,
    data.deliveryCity,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function LiveIndicator({
  streamState,
}: {
  streamState: "connecting" | "connected" | "disconnected";
}) {
  return (
    <span
      className={`ot-live-indicator ot-live-indicator--${streamState}`}
      title={`Stream: ${streamState}`}
    >
      <span className="ot-live-dot" />
      {streamState === "connected"
        ? "Live"
        : streamState === "connecting"
        ? "Connecting…"
        : "Offline"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`ot-badge ot-badge--${status.toLowerCase()}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function CancelModal({
  orderNumber,
  onConfirm,
  onClose,
  isBusy,
}: {
  orderNumber: string;
  onConfirm: () => void;
  onClose: () => void;
  isBusy: boolean;
}) {
  return (
    <div className="ot-modal-overlay" onClick={onClose}>
      <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ot-modal__icon">⚠️</div>
        <h3 className="ot-modal__title">Cancel this order?</h3>
        <p className="ot-modal__body">
          Order <strong>#{orderNumber}</strong> will be cancelled immediately.
          This cannot be undone.
        </p>
        <div className="ot-modal__actions">
          <button
            className="ot-modal__btn ot-modal__btn--ghost"
            onClick={onClose}
            disabled={isBusy}
          >
            Keep order
          </button>
          <button
            className="ot-modal__btn ot-modal__btn--danger"
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy ? (
              <span className="ot-spinner" />
            ) : null}
            {isBusy ? "Cancelling…" : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export default function CustomerOrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading, isError, streamState, liveMessage } =
    useOrderTracking(id);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelMyOrder(id);
      toast.success("Order cancelled successfully.");
      setShowCancelModal(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="ot">
        <div className="ot__back-row">
          <div className="ot__back-link-placeholder" />
        </div>
        <div className="ot__skeleton">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="ot__skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError || !data) {
    return (
      <div className="ot">
        <Link href="/customer-dashboard/orders" className="ot__back-link">
          ← Back to orders
        </Link>
        <div className="ot__error-card">
          <div className="ot__error-icon">🔍</div>
          <h2 className="ot__error-title">Order not found</h2>
          <p className="ot__error-body">
            We couldn't load tracking details for this order. It may have been
            removed or you may not have access.
          </p>
          <Link
            href="/customer-dashboard/orders"
            className="ot__error-cta"
          >
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  /* ── Compute step progress ── */
  const isCancelled = data.status === "CANCELLED" || data.status === "REFUNDED";
  const currentStepIdx = ORDER_STEPS.findIndex((s) => s.key === data.status);
  const canCancel = CANCELLABLE_STATUSES.includes(data.status);

  const statusHistories: any[] = data.orderStatusHistories ?? [];
  const items: any[] = data.items ?? data.orderItems ?? [];
  const payments: any[] = data.payments ?? [];

  return (
    <div className="ot">
      {/* ── Back nav ── */}
      <div className="ot__nav-row">
        <Link href="/customer-dashboard/orders" className="ot__back-link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to orders
        </Link>
        <LiveIndicator streamState={streamState} />
      </div>

      {/* ── Hero card ── */}
      <div className={`ot__hero${isCancelled ? " ot__hero--cancelled" : ""}`}>
        <div className="ot__hero-left">
          {data.provider?.imageURL && (
            <div className="ot__provider-avatar">
              <Image
                src={data.provider.imageURL}
                alt={data.provider.businessName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="ot__eyebrow">Order tracking</p>
            <h1 className="ot__order-number">#{data.orderNumber}</h1>
            <p className="ot__provider-name">
              {data.provider?.businessName}
              {data.provider?.city && (
                <span className="ot__provider-city">
                  {" "}
                  · {data.provider.city}
                </span>
              )}
            </p>
            <p className="ot__placed-at">
              Placed {formatDate(data.placedAt ?? data.createdAt)}
            </p>
          </div>
        </div>

        <div className="ot__hero-right">
          <StatusBadge status={data.status} />
          <p className="ot__total">৳{n(data.totalAmount).toFixed(2)}</p>
          {canCancel && (
            <button
              className="ot__cancel-btn"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel order
            </button>
          )}
        </div>
      </div>

      {/* ── Live update banner ── */}
      {liveMessage && (
        <div className="ot__live-banner">
          <span className="ot__live-pulse" />
          <span>{liveMessage}</span>
        </div>
      )}

      {/* ── Main grid ── */}
      <div className="ot__grid">
        {/* Left column */}
        <div className="ot__col-main">

          {/* Progress tracker */}
          {!isCancelled ? (
            <section className="ot__card">
              <h2 className="ot__card-title">Order Progress</h2>
              <div className="ot__steps">
                {ORDER_STEPS.map((step, i) => {
                  const isDone = currentStepIdx > i;
                  const isActive = currentStepIdx === i;

                  return (
                    <div key={step.key} className="ot__step">
                      <div className="ot__step-left">
                        <div
                          className={`ot__step-dot${
                            isDone
                              ? " ot__step-dot--done"
                              : isActive
                              ? " ot__step-dot--active"
                              : ""
                          }`}
                        >
                          {isDone ? (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : isActive ? (
                            <span className="ot__step-pulse" />
                          ) : (
                            <span style={{ fontSize: "13px" }}>{step.icon}</span>
                          )}
                        </div>
                        {i < ORDER_STEPS.length - 1 && (
                          <div
                            className={`ot__step-line${
                              isDone ? " ot__step-line--done" : isActive ? " ot__step-line--active" : ""
                            }`}
                          />
                        )}
                      </div>

                      <div
                        className={`ot__step-content${
                          isActive ? " ot__step-content--active" : isDone ? " ot__step-content--done" : ""
                        }`}
                      >
                        <div className="ot__step-icon">{step.icon}</div>
                        <div>
                          <p className="ot__step-label">{step.label}</p>
                          <p className="ot__step-desc">{step.description}</p>
                        </div>
                        {isActive && (
                          <span className="ot__step-now-badge">Now</span>
                        )}
                        {isDone && (
                          <span className="ot__step-done-badge">Done</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="ot__card ot__card--cancelled-state">
              <div className="ot__cancelled-info">
                <div className="ot__cancelled-icon">✕</div>
                <div>
                  <p className="ot__cancelled-title">Order Cancelled</p>
                  <p className="ot__cancelled-sub">
                    {data.cancelledAt
                      ? `Cancelled on ${formatDate(data.cancelledAt)}`
                      : "This order was cancelled."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Status timeline history */}
          {statusHistories.length > 0 && (
            <section className="ot__card">
              <h2 className="ot__card-title">Status Timeline</h2>
              <div className="ot__timeline">
                {statusHistories.map((entry: any, idx: number) => (
                  <div
                    key={entry.id}
                    className={`ot__tl-entry${
                      idx === statusHistories.length - 1
                        ? " ot__tl-entry--last"
                        : ""
                    }`}
                  >
                    <div className="ot__tl-dot" />
                    <div className="ot__tl-content">
                      <div className="ot__tl-header">
                        <span
                          className={`ot__tl-status ot-badge ot-badge--${entry.status.toLowerCase()}`}
                        >
                          {STATUS_LABELS[entry.status] ?? entry.status}
                        </span>
                        {entry.changedByRole && (
                          <span className="ot__tl-role">
                            by{" "}
                            {entry.changedByRole === "CUSTOMER"
                              ? "You"
                              : entry.changedByRole === "PROVIDER"
                              ? "Restaurant"
                              : "System"}
                          </span>
                        )}
                      </div>
                      {entry.note && (
                        <p className="ot__tl-note">{entry.note}</p>
                      )}
                      <p className="ot__tl-time">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="ot__col-side">

          {/* Order items */}
          <section className="ot__card">
            <h2 className="ot__card-title">
              Items{" "}
              <span className="ot__card-count">({items.length})</span>
            </h2>
            <div className="ot__items">
              {items.map((item: any) => (
                <div key={item.id} className="ot__item">
                  {item.mealImageUrl ? (
                    <div className="ot__item-img">
                      <Image
                        src={item.mealImageUrl}
                        alt={item.mealName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="ot__item-img ot__item-img--placeholder">
                      🍱
                    </div>
                  )}
                  <div className="ot__item-info">
                    <p className="ot__item-name">{item.mealName}</p>
                    <p className="ot__item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="ot__item-price">
                    ৳{n(item.totalPrice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="ot__price-breakdown">
              <div className="ot__price-row">
                <span>Subtotal</span>
                <span>৳{n(data.subtotal).toFixed(2)}</span>
              </div>
              <div className="ot__price-row">
                <span>Delivery fee</span>
                <span>৳{n(data.deliveryFee).toFixed(2)}</span>
              </div>
              {n(data.discountAmount) > 0 && (
                <div className="ot__price-row ot__price-row--discount">
                  <span>Discount</span>
                  <span>-৳{n(data.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div className="ot__price-row ot__price-row--total">
                <span>Total</span>
                <span>৳{n(data.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Delivery details */}
          <section className="ot__card">
            <h2 className="ot__card-title">Delivery Details</h2>
            <div className="ot__detail-list">
              <div className="ot__detail-row">
                <span className="ot__detail-label">Name</span>
                <span className="ot__detail-value">
                  {data.customerName ?? "—"}
                </span>
              </div>
              <div className="ot__detail-row">
                <span className="ot__detail-label">Phone</span>
                <span className="ot__detail-value">
                  {data.customerPhone ?? "—"}
                </span>
              </div>
              <div className="ot__detail-row">
                <span className="ot__detail-label">Address</span>
                <span className="ot__detail-value">
                  {getDeliveryAddress(data)}
                </span>
              </div>
              {data.deliveryNote && (
                <div className="ot__detail-row">
                  <span className="ot__detail-label">Note</span>
                  <span className="ot__detail-value ot__detail-value--note">
                    "{data.deliveryNote}"
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Payment details */}
          {payments.length > 0 && (
            <section className="ot__card">
              <h2 className="ot__card-title">Payment</h2>
              <div className="ot__detail-list">
                <div className="ot__detail-row">
                  <span className="ot__detail-label">Method</span>
                  <span className="ot__detail-value">
                    {data.paymentMethod === "COD"
                      ? "💵 Cash on Delivery"
                      : "💳 Online Payment"}
                  </span>
                </div>
                {payments.map((p: any) => (
                  <div key={p.id} className="ot__detail-row">
                    <span className="ot__detail-label">Status</span>
                    <span
                      className={`ot__payment-pill ot__payment-pill--${p.status.toLowerCase()}`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
                {payments[0]?.gatewayName && (
                  <div className="ot__detail-row">
                    <span className="ot__detail-label">Gateway</span>
                    <span className="ot__detail-value">
                      {payments[0].gatewayName}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Pay now if pending */}
          {data.status === "PENDING_PAYMENT" && (
            <Link
              href={`/checkout/payment?orderId=${data.id}`}
              className="ot__pay-cta"
            >
              💳 Complete Payment · ৳{n(data.totalAmount).toFixed(2)}
            </Link>
          )}
        </div>
      </div>

      {/* ── Cancel modal ── */}
      {showCancelModal && (
        <CancelModal
          orderNumber={data.orderNumber}
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          isBusy={isCancelling}
        />
      )}
    </div>
  );
}