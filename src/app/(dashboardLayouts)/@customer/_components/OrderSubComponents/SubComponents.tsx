"use client";
<<<<<<< HEAD
// src/app/(dashboardLayouts)/@customer/_components/OrderSubComponents/SubComponents.tsx
// FULL REPLACEMENT — adds ReviewButton to DELIVERED order cards

import { formatDate, getDeliveryAddress } from "@/HelpersAndAttributes/CustomerOrder/functions";
import {
  ACTIVE_STATUSES,
  CANCELLABLE_STATUSES,
  FLOW_STEPS,
  n,
  STATUS_CONFIG,
  TCancelResult,
  TOrder,
  TRefundResult,
} from "@/HelpersAndAttributes/CustomerOrder/typesAndConstants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReviewButton from "../reviews/ReviewButton";
=======

import { formatDate, getDeliveryAddress } from "@/HelpersAndAttributes/CustomerOrder/functions";
import { ACTIVE_STATUSES, CANCELLABLE_STATUSES, FLOW_STEPS, n, STATUS_CONFIG, TOrder } from "@/HelpersAndAttributes/CustomerOrder/typesAndConstants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
>>>>>>> dc5656236feee959b1e0e891718009336b905842

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`cord-badge cord-badge--${status.toLowerCase()}`}>
      <span className="cord-badge__icon">{cfg?.icon}</span>
      {cfg?.label ?? status}
    </span>
  );
}

export function PaymentMethodBadge({ method }: { method: string }) {
  return (
    <span className="cord-pay-method">
      {method === "COD" ? "💵 Cash on Delivery" : "💳 Online Payment"}
    </span>
  );
}

<<<<<<< HEAD
export function RefundBanner({ order }: { order: TOrder }) {
  if (order.status !== "REFUNDED") return null;

  const refundedPayment = order.payments.find((p) => p.status === "REFUNDED");
  const gwData          = refundedPayment?.paymentGatewayData;
  const amount          = gwData?.refundAmount ?? n(order.totalAmount);
  const refundRefId     = gwData?.refundRefId ?? null;
  const isSandbox       = gwData?.refundSimulated === true;

  return (
    <div className="cord-refund-banner">
      <div className="cord-refund-banner__icon">↩</div>
      <div className="cord-refund-banner__content">
        <p className="cord-refund-banner__title">
          {isSandbox ? "[SANDBOX] " : ""}Refund of ৳{Number(amount).toFixed(2)} initiated
        </p>
        <p className="cord-refund-banner__body">
          {isSandbox
            ? "This is a test refund — no real money was moved."
            : "Processed via SSLCommerz. Funds reach your account in 3–7 business days."}
        </p>
        {refundRefId && (
          <p className="cord-refund-banner__ref">
            Ref: <code>{refundRefId}</code>
          </p>
        )}
      </div>
    </div>
  );
}


export function OrderProgressBar({ status }: { status: string }) {
  if (status === "PENDING_PAYMENT") return null;
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";
  const currentIdx  = FLOW_STEPS.indexOf(status as (typeof FLOW_STEPS)[number]);
=======
export function OrderProgressBar({ status }: { status: string }) {
  if (status === "PENDING_PAYMENT") return null;
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";
  const currentIdx = FLOW_STEPS.indexOf(status as (typeof FLOW_STEPS)[number]);
>>>>>>> dc5656236feee959b1e0e891718009336b905842

  return (
    <div className="cord-progress">
      <div className="cord-progress__track">
        {FLOW_STEPS.map((step, i) => {
<<<<<<< HEAD
          const isDone   = !isCancelled && currentIdx > i;
          const isActive = !isCancelled && currentIdx === i;
          return (
            <div key={step} className="cord-progress__step-wrapper">
              <div className="cord-progress__step">
                <div className={`cord-progress__dot${isDone ? " cord-progress__dot--done" : isActive ? " cord-progress__dot--active" : ""}`}>
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isActive ? <span className="cord-progress__pulse" /> : null}
                </div>
                <span className={`cord-progress__label${isDone ? " cord-progress__label--done" : isActive ? " cord-progress__label--active" : ""}`}>
=======
          const isDone = !isCancelled && currentIdx > i;
          const isActive = !isCancelled && currentIdx === i;

          return (
            <div key={step} className="cord-progress__step-wrapper">
              <div className="cord-progress__step">
                <div
                  className={`cord-progress__dot${
                    isDone
                      ? " cord-progress__dot--done"
                      : isActive
                      ? " cord-progress__dot--active"
                      : ""
                  }`}
                >
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : isActive ? (
                    <span className="cord-progress__pulse" />
                  ) : null}
                </div>
                <span
                  className={`cord-progress__label${
                    isDone
                      ? " cord-progress__label--done"
                      : isActive
                      ? " cord-progress__label--active"
                      : ""
                  }`}
                >
>>>>>>> dc5656236feee959b1e0e891718009336b905842
                  {STATUS_CONFIG[step]?.label ?? step}
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
<<<<<<< HEAD
                <div className={`cord-progress__line${isDone ? " cord-progress__line--done" : isActive ? " cord-progress__line--active" : ""}`} />
=======
                <div
                  className={`cord-progress__line${
                    isDone ? " cord-progress__line--done" : isActive ? " cord-progress__line--active" : ""
                  }`}
                />
>>>>>>> dc5656236feee959b1e0e891718009336b905842
              )}
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="cord-progress__cancelled-note">
<<<<<<< HEAD
          <span>✕</span>{" "}
          {status === "REFUNDED" ? "Order cancelled — payment refunded" : "Order was cancelled"}
=======
          <span>✕</span> Order was cancelled
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD

export function CancelConfirmModal({
  order,
  onConfirm,
  onClose,
  isBusy,
  cancelResult,
  serverMessage,
}: {
  order:         TOrder;
  onConfirm:     (id: string) => void;
  onClose:       () => void;
  isBusy:        boolean;
  cancelResult:  TCancelResult | null;
  serverMessage: string | null;
}) {
  const isOnline          = order.paymentMethod === "ONLINE";
  const hasSuccessPayment = order.payments.some((p) => p.status === "SUCCESS");
  const willRefund        = isOnline && hasSuccessPayment;
  const totalAmt          = n(order.totalAmount);

  if (cancelResult) {
    const refund      = cancelResult.refund;
    const didAttempt  = refund.attempted;
    const didRefund   = didAttempt && (refund as any).success === true;
    const isSandbox   = didRefund  && (refund as any).isSandbox === true;
    const refundAmt   = didRefund  ? (refund as any).amount as number : 0;
    const refundRefId = didRefund  ? (refund as any).refundRefId as string : null;

    return (
      <div className="cord-modal-overlay" onClick={onClose}>
        <div className="cord-modal cord-modal--result" onClick={(e) => e.stopPropagation()}>
          <div className={`cord-modal__result-icon cord-modal__result-icon--${didRefund ? "success" : "neutral"}`}>
            {didRefund ? "✓" : "✕"}
          </div>
          <h3 className="cord-modal__title">
            {didRefund ? "Order cancelled & refund initiated" : "Order cancelled"}
          </h3>
          {serverMessage && (
            <p className="cord-modal__server-msg">{serverMessage}</p>
          )}
          {didRefund && (
            <div className={`cord-modal__refund-box cord-modal__refund-box--success${isSandbox ? " cord-modal__refund-box--sandbox" : ""}`}>
              {isSandbox && (
                <div className="cord-modal__sandbox-tag">⚠ SANDBOX — test refund only, no real money moved</div>
              )}
              <div className="cord-modal__refund-amount-row">
                <span className="cord-modal__refund-label">Refund amount</span>
                <span className="cord-modal__refund-value">৳{refundAmt.toFixed(2)}</span>
              </div>
              {!isSandbox && (
                <p className="cord-modal__refund-note">
                  Funds reach your original payment method within <strong>3–7 business days</strong>.
                </p>
              )}
              {refundRefId && (
                <p className="cord-modal__refund-ref">
                  Reference: <code>{refundRefId}</code>
                </p>
              )}
            </div>
          )}
          {!didAttempt && (
            <div className="cord-modal__refund-box cord-modal__refund-box--neutral">
              <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>
                {(refund as any).reason}
              </p>
            </div>
          )}
          <button className="cord-modal__btn cord-modal__btn--done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }

  /* ── VIEW 1: Pre-cancel confirmation ── */
=======
export function CancelConfirmModal({
  orderId,
  orderNumber,
  onConfirm,
  onClose,
  isBusy,
}: {
  orderId: string;
  orderNumber: string;
  onConfirm: (id: string) => void;
  onClose: () => void;
  isBusy: boolean;
}) {
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  return (
    <div className="cord-modal-overlay" onClick={onClose}>
      <div className="cord-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cord-modal__icon">⚠️</div>
        <h3 className="cord-modal__title">Cancel this order?</h3>
        <p className="cord-modal__body">
<<<<<<< HEAD
          Order <strong>#{order.orderNumber}</strong> will be cancelled immediately. This cannot be undone.
        </p>
        {willRefund && (
          <div className="cord-modal__info-box cord-modal__info-box--refund">
            <span className="cord-modal__info-icon">↩</span>
            <div>
              <p className="cord-modal__info-title">৳{totalAmt.toFixed(2)} will be refunded</p>
              <p className="cord-modal__info-body">
                Since you paid online, your money will be returned to your original payment method via SSLCommerz.
              </p>
            </div>
          </div>
        )}
        {isOnline && !hasSuccessPayment && (
          <div className="cord-modal__info-box cord-modal__info-box--neutral">
            <span className="cord-modal__info-icon">💳</span>
            <div>
              <p className="cord-modal__info-title">No charge to reverse</p>
              <p className="cord-modal__info-body">Payment was not completed — nothing will be charged.</p>
            </div>
          </div>
        )}
        {!isOnline && (
          <div className="cord-modal__info-box cord-modal__info-box--cod">
            <span className="cord-modal__info-icon">💵</span>
            <div>
              <p className="cord-modal__info-title">Cash on Delivery order</p>
              <p className="cord-modal__info-body">No payment was taken — nothing to refund.</p>
            </div>
          </div>
        )}
        <div className="cord-modal__actions">
          <button className="cord-modal__btn cord-modal__btn--ghost" onClick={onClose} disabled={isBusy}>
=======
          Order <strong>#{orderNumber}</strong> will be cancelled. This action
          cannot be undone.
        </p>
        <div className="cord-modal__actions">
          <button
            className="cord-modal__btn cord-modal__btn--ghost"
            onClick={onClose}
            disabled={isBusy}
          >
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            Keep order
          </button>
          <button
            className="cord-modal__btn cord-modal__btn--danger"
<<<<<<< HEAD
            onClick={() => onConfirm(order.id)}
            disabled={isBusy}
          >
            {isBusy ? (
              <><span className="cord-spinner" /> Cancelling…</>
            ) : willRefund ? (
              "Cancel & refund"
=======
            onClick={() => onConfirm(orderId)}
            disabled={isBusy}
          >
            {isBusy ? (
              <>
                <span className="cord-spinner" /> Cancelling…
              </>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            ) : (
              "Yes, cancel it"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrderCard({
  order,
  onCancelRequest,
  busyId,
}: {
<<<<<<< HEAD
  order:           TOrder;
  onCancelRequest: (id: string) => void;
  busyId:          string | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const canCancel        = CANCELLABLE_STATUSES.includes(order.status);
  const isPendingPayment = order.status === "PENDING_PAYMENT";
  const isActive         = ACTIVE_STATUSES.includes(order.status);
  const isRefunded       = order.status === "REFUNDED";
  const isCancelled      = order.status === "CANCELLED";
  const isDelivered      = order.status === "DELIVERED";

  const SHOW_LIMIT   = 2;
  const visibleItems = expanded ? order.orderItems : order.orderItems.slice(0, SHOW_LIMIT);
  const hasMore      = order.orderItems.length > SHOW_LIMIT;
  const payment      = order.payments[0] ?? null;
  const cfg          = STATUS_CONFIG[order.status];

  const primaryMeal = order.orderItems[0] ?? null;

  return (
    <div
      className={[
        "cord-card",
        isActive    && "cord-card--active",
        isCancelled && "cord-card--cancelled",
        isRefunded  && "cord-card--refunded",
        isDelivered && "cord-card--delivered",
      ].filter(Boolean).join(" ")}
    >
      {/* ── Header ── */}
=======
  order: TOrder;
  onCancelRequest: (id: string) => void;
  busyId: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const isPendingPayment = order.status === "PENDING_PAYMENT";
  const isActive = ACTIVE_STATUSES.includes(order.status);

  const SHOW_LIMIT = 2;
  const visibleItems = expanded
    ? order.orderItems
    : order.orderItems.slice(0, SHOW_LIMIT);
  const hasMore = order.orderItems.length > SHOW_LIMIT;
  const payment = order.payments?.[0];
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div
      className={`cord-card${isActive ? " cord-card--active" : ""}${
        order.status === "CANCELLED" ? " cord-card--cancelled" : ""
      }${order.status === "DELIVERED" ? " cord-card--delivered" : ""}`}
    >
      {/* ── Card header ── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      <div className="cord-card__header">
        <div className="cord-card__provider-info">
          {order.provider?.imageURL ? (
            <div className="cord-card__avatar">
<<<<<<< HEAD
              <Image src={order.provider.imageURL} alt={order.provider.businessName} fill className="object-cover" />
            </div>
          ) : (
            <div className="cord-card__avatar cord-card__avatar--placeholder">🍽</div>
          )}
          <div>
            <p className="cord-card__provider-name">{order.provider?.businessName ?? "Provider"}</p>
=======
              <Image
                src={order.provider.imageURL}
                alt={order.provider.businessName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="cord-card__avatar cord-card__avatar--placeholder">
              🍽
            </div>
          )}
          <div>
            <p className="cord-card__provider-name">
              {order.provider?.businessName ?? "Provider"}
            </p>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            <p className="cord-card__order-num">#{order.orderNumber}</p>
            <p className="cord-card__date">{formatDate(order.createdAt)}</p>
          </div>
        </div>
<<<<<<< HEAD
        <div className="cord-card__header-right">
          <StatusBadge status={order.status} />
          <p className="cord-card__amount">৳{n(order.totalAmount).toFixed(2)}</p>
=======

        <div className="cord-card__header-right">
          <StatusBadge status={order.status} />
          <p className="cord-card__amount">
            ৳{n(order.totalAmount).toFixed(2)}
          </p>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          <PaymentMethodBadge method={order.paymentMethod} />
        </div>
      </div>

<<<<<<< HEAD
      {/* ── Status strip ── */}
=======
      {/* ── Status description strip ── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      {cfg && (
        <div className={`cord-card__status-strip cord-card__status-strip--${order.status.toLowerCase()}`}>
          <span>{cfg.icon}</span>
          <span>{cfg.description}</span>
          {order.status === "OUT_FOR_DELIVERY" && (
            <span className="cord-card__eta">Arriving soon</span>
          )}
        </div>
      )}

<<<<<<< HEAD
      {/* ── Refund banner ── */}
      <RefundBanner order={order} />
=======
      {/* ── Progress bar ── */}
      {/* <OrderProgressBar status={order.status} /> */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842

      {/* ── Items ── */}
      <div className="cord-card__items">
        <p className="cord-card__items-label">
<<<<<<< HEAD
          {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
=======
          {order.orderItems.length} item
          {order.orderItems.length !== 1 ? "s" : ""}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        </p>
        {visibleItems.map((item) => (
          <div key={item.id} className="cord-card__item">
            {item.mealImageUrl ? (
              <div className="cord-card__item-img">
<<<<<<< HEAD
                <Image src={item.mealImageUrl} alt={item.mealName} fill className="object-cover" />
              </div>
            ) : (
              <div className="cord-card__item-img cord-card__item-img--placeholder">🍱</div>
            )}
            <span className="cord-card__item-name">{item.mealName}</span>
            <span className="cord-card__item-qty">×{item.quantity}</span>
            <span className="cord-card__item-price">৳{n(item.totalPrice).toFixed(2)}</span>
          </div>
        ))}
        {hasMore && (
          <button className="cord-card__show-more" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show less ↑" : `+${order.orderItems.length - SHOW_LIMIT} more items ↓`}
=======
                <Image
                  src={item.mealImageUrl}
                  alt={item.mealName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="cord-card__item-img cord-card__item-img--placeholder">
                🍱
              </div>
            )}
            <span className="cord-card__item-name">{item.mealName}</span>
            <span className="cord-card__item-qty">×{item.quantity}</span>
            <span className="cord-card__item-price">
              ৳{n(item.totalPrice).toFixed(2)}
            </span>
          </div>
        ))}
        {hasMore && (
          <button
            className="cord-card__show-more"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? "Show less ↑"
              : `+${order.orderItems.length - SHOW_LIMIT} more item${
                  order.orderItems.length - SHOW_LIMIT > 1 ? "s" : ""
                } ↓`}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          </button>
        )}
      </div>

<<<<<<< HEAD
      {/* ── Price row ── */}
      <div className="cord-card__price-row">
        <span className="cord-card__price-breakdown">
          Subtotal ৳{n(order.subtotal).toFixed(2)}
          {n(order.deliveryFee) > 0 && ` · Delivery ৳${n(order.deliveryFee).toFixed(2)}`}
          {n(order.discountAmount) > 0 && (
            <span className="cord-card__saved"> · Saved ৳{n(order.discountAmount).toFixed(2)}</span>
          )}
        </span>
        {payment && (
          <span className={`cord-payment-status cord-payment-status--${payment.status.toLowerCase()}`}>
            {payment.status === "REFUNDED"
              ? "↩ Refunded"
              : payment.gatewayName
=======
      {/* ── Price breakdown ── */}
      <div className="cord-card__price-row">
        <span className="cord-card__price-breakdown">
          Subtotal ৳{n(order.subtotal).toFixed(2)}
          {n(order.deliveryFee) > 0 &&
            ` · Delivery ৳${n(order.deliveryFee).toFixed(2)}`}
          {n(order.discountAmount) > 0 && (
            <span className="cord-card__saved">
              {" "}
              · Saved ৳{n(order.discountAmount).toFixed(2)}
            </span>
          )}
        </span>

        {payment && (
          <span
            className={`cord-payment-status cord-payment-status--${payment.status.toLowerCase()}`}
          >
            {payment.gatewayName
>>>>>>> dc5656236feee959b1e0e891718009336b905842
              ? `via ${payment.gatewayName}`
              : payment.status}
          </span>
        )}
      </div>

<<<<<<< HEAD
      {/* ── Address ── */}
      <div className="cord-card__address">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
=======
      {/* ── Delivery address ── */}
      <div className="cord-card__address">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{getDeliveryAddress(order)}</span>
        {order.deliveryNote && (
          <span className="cord-card__note">"{order.deliveryNote}"</span>
        )}
      </div>

<<<<<<< HEAD
      {/* ── Footer ── */}
      <div className="cord-card__footer">
        <div className="cord-card__footer-left">
          {order.placedAt && (
            <span className="cord-card__timestamp">Placed {formatDate(order.placedAt, false)}</span>
=======
      {/* ── Footer actions ── */}
      <div className="cord-card__footer">
        <div className="cord-card__footer-left">
          {order.placedAt && (
            <span className="cord-card__timestamp">
              Placed {formatDate(order.placedAt, false)}
            </span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          )}
          {order.deliveredAt && (
            <span className="cord-card__timestamp cord-card__timestamp--green">
              ✓ Delivered {formatDate(order.deliveredAt, false)}
            </span>
          )}
          {order.cancelledAt && (
            <span className="cord-card__timestamp cord-card__timestamp--red">
<<<<<<< HEAD
              {isRefunded ? "↩ Refunded" : "Cancelled"} {formatDate(order.cancelledAt, false)}
=======
              Cancelled {formatDate(order.cancelledAt, false)}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
            </span>
          )}
        </div>

        <div className="cord-card__actions">
          {isPendingPayment && (
<<<<<<< HEAD
            <Link href={`/checkout/payment?orderId=${order.id}`} className="cord-btn cord-btn--pay">
=======
            <Link
              href={`/checkout/payment?orderId=${order.id}`}
              className="cord-btn cord-btn--pay"
            >
>>>>>>> dc5656236feee959b1e0e891718009336b905842
              💳 Pay now
            </Link>
          )}

          <Link
            href={`/customer-dashboard/orders/${order.id}`}
<<<<<<< HEAD
            className={`cord-btn cord-btn--track${(isCancelled || isRefunded) ? " cord-btn--disabled" : ""}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {isRefunded ? "View details" : "Track order"}
=======
            className={`cord-btn cord-btn--track  ${order.status === "CANCELLED" ? "pointer-events-none cursor-not-allowed opacity-10" : ""}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Track order
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          </Link>

          {canCancel && (
            <button
              className="cord-btn cord-btn--cancel"
              onClick={() => onCancelRequest(order.id)}
              disabled={busyId === order.id}
            >
              Cancel
            </button>
          )}
<<<<<<< HEAD

          {/* ── Review button — only shown for DELIVERED orders ── */}
          {isDelivered && primaryMeal && (
            <ReviewButton
              orderId={order.id}
              orderNumber={order.orderNumber}
              mealId={primaryMeal.mealId}
              mealName={primaryMeal.mealName}
              orderStatus={order.status}
            />
          )}
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD

=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
export function OrderSkeleton() {
  return (
    <div className="cord-skeleton">
      <div className="cord-skeleton__header">
        <div className="cord-skeleton__avatar" />
        <div className="cord-skeleton__lines">
          <div className="cord-skeleton__line cord-skeleton__line--lg" />
          <div className="cord-skeleton__line cord-skeleton__line--sm" />
        </div>
        <div className="cord-skeleton__badge" />
      </div>
      <div className="cord-skeleton__body">
        <div className="cord-skeleton__line" />
        <div className="cord-skeleton__line cord-skeleton__line--sm" />
      </div>
    </div>
  );
}