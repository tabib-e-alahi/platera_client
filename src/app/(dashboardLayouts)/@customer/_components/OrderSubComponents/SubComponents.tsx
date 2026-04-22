"use client";

import { formatDate, getDeliveryAddress } from "@/HelpersAndAttributes/CustomerOrder/functions";
import { ACTIVE_STATUSES, CANCELLABLE_STATUSES, FLOW_STEPS, n, STATUS_CONFIG, TOrder } from "@/HelpersAndAttributes/CustomerOrder/typesAndConstants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

export function OrderProgressBar({ status }: { status: string }) {
  if (status === "PENDING_PAYMENT") return null;
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";
  const currentIdx = FLOW_STEPS.indexOf(status as (typeof FLOW_STEPS)[number]);

  return (
    <div className="cord-progress">
      <div className="cord-progress__track">
        {FLOW_STEPS.map((step, i) => {
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
                  {STATUS_CONFIG[step]?.label ?? step}
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div
                  className={`cord-progress__line${
                    isDone ? " cord-progress__line--done" : isActive ? " cord-progress__line--active" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {isCancelled && (
        <div className="cord-progress__cancelled-note">
          <span>✕</span> Order was cancelled
        </div>
      )}
    </div>
  );
}

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
  return (
    <div className="cord-modal-overlay" onClick={onClose}>
      <div className="cord-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cord-modal__icon">⚠️</div>
        <h3 className="cord-modal__title">Cancel this order?</h3>
        <p className="cord-modal__body">
          Order <strong>#{orderNumber}</strong> will be cancelled. This action
          cannot be undone.
        </p>
        <div className="cord-modal__actions">
          <button
            className="cord-modal__btn cord-modal__btn--ghost"
            onClick={onClose}
            disabled={isBusy}
          >
            Keep order
          </button>
          <button
            className="cord-modal__btn cord-modal__btn--danger"
            onClick={() => onConfirm(orderId)}
            disabled={isBusy}
          >
            {isBusy ? (
              <>
                <span className="cord-spinner" /> Cancelling…
              </>
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
      <div className="cord-card__header">
        <div className="cord-card__provider-info">
          {order.provider?.imageURL ? (
            <div className="cord-card__avatar">
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
            <p className="cord-card__order-num">#{order.orderNumber}</p>
            <p className="cord-card__date">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="cord-card__header-right">
          <StatusBadge status={order.status} />
          <p className="cord-card__amount">
            ৳{n(order.totalAmount).toFixed(2)}
          </p>
          <PaymentMethodBadge method={order.paymentMethod} />
        </div>
      </div>

      {/* ── Status description strip ── */}
      {cfg && (
        <div className={`cord-card__status-strip cord-card__status-strip--${order.status.toLowerCase()}`}>
          <span>{cfg.icon}</span>
          <span>{cfg.description}</span>
          {order.status === "OUT_FOR_DELIVERY" && (
            <span className="cord-card__eta">Arriving soon</span>
          )}
        </div>
      )}

      {/* ── Progress bar ── */}
      {/* <OrderProgressBar status={order.status} /> */}

      {/* ── Items ── */}
      <div className="cord-card__items">
        <p className="cord-card__items-label">
          {order.orderItems.length} item
          {order.orderItems.length !== 1 ? "s" : ""}
        </p>
        {visibleItems.map((item) => (
          <div key={item.id} className="cord-card__item">
            {item.mealImageUrl ? (
              <div className="cord-card__item-img">
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
          </button>
        )}
      </div>

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
              ? `via ${payment.gatewayName}`
              : payment.status}
          </span>
        )}
      </div>

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
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{getDeliveryAddress(order)}</span>
        {order.deliveryNote && (
          <span className="cord-card__note">"{order.deliveryNote}"</span>
        )}
      </div>

      {/* ── Footer actions ── */}
      <div className="cord-card__footer">
        <div className="cord-card__footer-left">
          {order.placedAt && (
            <span className="cord-card__timestamp">
              Placed {formatDate(order.placedAt, false)}
            </span>
          )}
          {order.deliveredAt && (
            <span className="cord-card__timestamp cord-card__timestamp--green">
              ✓ Delivered {formatDate(order.deliveredAt, false)}
            </span>
          )}
          {order.cancelledAt && (
            <span className="cord-card__timestamp cord-card__timestamp--red">
              Cancelled {formatDate(order.cancelledAt, false)}
            </span>
          )}
        </div>

        <div className="cord-card__actions">
          {isPendingPayment && (
            <Link
              href={`/checkout/payment?orderId=${order.id}`}
              className="cord-btn cord-btn--pay"
            >
              💳 Pay now
            </Link>
          )}

          <Link
            href={`/customer-dashboard/orders/${order.id}`}
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
        </div>
      </div>
    </div>
  );
}

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