"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getProviderOrders,
  updateProviderOrderStatus,
  getProviderDashboardStats,
} from "@/services/order.service";
import "./provider-orders.css";

<<<<<<< HEAD
=======
/* ─── Types ──────────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
type TOrderItem = {
  id: string; mealName: string; mealImageUrl?: string | null;
  quantity: number; unitPrice: string | number; totalPrice: string | number;
};
type TOrder = {
  id: string; orderNumber: string; status: string; paymentMethod: string;
  totalAmount: string | number; subtotal: string | number;
  deliveryFee: string | number; createdAt: string; placedAt?: string | null;
  customerName?: string | null; customerPhone?: string | null;
  deliveryCity?: string; deliveryStreetAddress?: string | null;
  deliveryHouseNumber?: string | null; deliveryApartment?: string | null;
  deliveryNote?: string | null;
  customer?: { name?: string; email?: string };
  orderItems: TOrderItem[];
  payments?: Array<{ status: string; amount: string | number; gatewayName?: string | null }>;
};

<<<<<<< HEAD
=======
/* ─── Constants ──────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
const n = (v: string | number | null | undefined) => Number(v ?? 0);

const STATUS_META: Record<string, { label: string; icon: string; rowClass: string }> = {
  PENDING_PAYMENT:  { label: "Pending Payment",   icon: "💳", rowClass: "" },
  PLACED:           { label: "New Order",         icon: "🔔", rowClass: "pord-card--incoming" },
  ACCEPTED:         { label: "Accepted",          icon: "✅", rowClass: "pord-card--accepted" },
  PREPARING:        { label: "Preparing",         icon: "👨‍🍳", rowClass: "pord-card--preparing" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery",  icon: "🛵", rowClass: "pord-card--delivery" },
  DELIVERED:        { label: "Delivered",         icon: "🎉", rowClass: "pord-card--delivered" },
  CANCELLED:        { label: "Cancelled",         icon: "✕",  rowClass: "pord-card--cancelled" },
};

const ACTIONS: Record<string, Array<{ label: string; next: string; cls: string; confirm?: string }>> = {
  PLACED: [
    { label: "✅ Accept order",   next: "ACCEPTED",         cls: "pord-btn--accept",   confirm: "Accept this order?" },
    { label: "✕ Cancel order",   next: "CANCELLED",        cls: "pord-btn--cancel",   confirm: "Cancel this order? The customer will be notified." },
  ],
  ACCEPTED: [
    { label: "👨‍🍳 Start preparing", next: "PREPARING",      cls: "pord-btn--prepare",  confirm: "Start preparing this order?" },
    { label: "✕ Cancel",          next: "CANCELLED",        cls: "pord-btn--cancel",   confirm: "Cancel this order? The customer will be notified." },
  ],
  PREPARING: [
    { label: "🛵 Dispatch",       next: "OUT_FOR_DELIVERY", cls: "pord-btn--dispatch", confirm: "Mark as out for delivery?" },
  ],
  OUT_FOR_DELIVERY: [
    { label: "🎉 Mark delivered", next: "DELIVERED",        cls: "pord-btn--deliver",  confirm: "Mark this order as delivered?" },
  ],
};

const TABS = [
  { label: "New",         value: "PLACED",           badge: "incoming" },
  { label: "Active",      value: "active",            badge: "active" },
  { label: "All orders",  value: "all",               badge: null },
  { label: "Delivered",   value: "DELIVERED",         badge: null },
  { label: "Cancelled",   value: "CANCELLED",         badge: null },
];

const ACTIVE_STATUSES = ["ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-BD", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

<<<<<<< HEAD
=======
/* ─── Confirm modal ──────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
function ConfirmModal({
  message, onConfirm, onCancel, isBusy,
}: {
  message: string; onConfirm: () => void; onCancel: () => void; isBusy: boolean;
}) {
  return (
    <div className="pord-modal-overlay" onClick={onCancel}>
      <div className="pord-modal" onClick={e => e.stopPropagation()}>
        <p className="pord-modal__msg">{message}</p>
        <div className="pord-modal__btns">
          <button className="pord-modal__no" onClick={onCancel} disabled={isBusy}>Keep</button>
          <button className="pord-modal__yes" onClick={onConfirm} disabled={isBusy}>
            {isBusy ? <span className="pord-spinner" /> : null}
            {isBusy ? "Updating…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
/* ─── Skeleton ───────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
function OrderSkeleton() {
  return (
    <div className="pord-skeleton">
      <div className="pord-skeleton__header">
        <div className="pord-skeleton__avatar" />
        <div className="pord-skeleton__lines">
          <div className="pord-skeleton__line pord-skeleton__line--lg" />
          <div className="pord-skeleton__line pord-skeleton__line--sm" />
        </div>
        <div className="pord-skeleton__badge" />
      </div>
      <div className="pord-skeleton__body">
        <div className="pord-skeleton__line" />
        <div className="pord-skeleton__line pord-skeleton__line--sm" />
      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
/* ─── Order card ─────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
function OrderCard({
  order, onAction, busyId,
}: {
  order: TOrder;
  onAction: (orderId: string, next: string, confirmMsg: string) => void;
  busyId: string | null;
}) {
  const actions = ACTIONS[order.status] ?? [];
  const isBusy = busyId === order.id;
  const meta = STATUS_META[order.status];
  const payment = order.payments?.[0];

  return (
    <div className={`pord-card ${meta?.rowClass ?? ""}`}>
      {/* Header */}
      <div className="pord-card__header">
        <div className="pord-card__info">
          <div className="pord-card__top-row">
            <span className="pord-card__number">#{order.orderNumber}</span>
            <span className={`pord-badge pord-badge--${order.status.toLowerCase()}`}>
              {meta?.icon} {meta?.label ?? order.status}
            </span>
          </div>
          <p className="pord-card__customer">
            {order.customerName ?? order.customer?.name ?? "Customer"}
          </p>
          {order.customerPhone && (
            <a href={`tel:${order.customerPhone}`} className="pord-card__phone">
              📞 {order.customerPhone}
            </a>
          )}
          {(order.deliveryStreetAddress || order.deliveryCity) && (
            <p className="pord-card__address">
              📍 {[order.deliveryHouseNumber, order.deliveryStreetAddress, order.deliveryCity].filter(Boolean).join(", ")}
            </p>
          )}
          {order.deliveryNote && (
            <p className="pord-card__note">💬 "{order.deliveryNote}"</p>
          )}
        </div>
        <div className="pord-card__right">
          <p className="pord-card__amount">৳{n(order.totalAmount).toFixed(2)}</p>
          <span className={`pord-pay-tag pord-pay-tag--${order.paymentMethod === "COD" ? "cod" : "online"}`}>
            {order.paymentMethod === "COD" ? "💵 COD" : "💳 Online"}
          </span>
          {payment && (
            <span className={`pord-pay-status pord-pay-status--${payment.status.toLowerCase()}`}>
              {payment.status}
            </span>
          )}
          <p className="pord-card__date">{fmt(order.createdAt)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="pord-card__items">
        <p className="pord-card__items-label">{order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}</p>
        {order.orderItems.map(item => (
          <div key={item.id} className="pord-card__item">
            <div className="pord-card__item-img">
              {item.mealImageUrl
                ? <img src={item.mealImageUrl} alt={item.mealName} />
                : <span>🍱</span>}
            </div>
            <span className="pord-card__item-name">{item.mealName}</span>
            <span className="pord-card__item-qty">×{item.quantity}</span>
            <span className="pord-card__item-price">৳{n(item.totalPrice).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="pord-card__actions">
          <span className="pord-card__actions-label">Update status</span>
          <div className="pord-card__action-btns">
            {actions.map(action => (
              <button
                key={action.next}
                className={`pord-btn ${action.cls}`}
                disabled={isBusy}
                onClick={() => onAction(order.id, action.next, action.confirm ?? `Move to ${action.next}?`)}
              >
                {isBusy ? <span className="pord-spinner" /> : null}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delivered / Cancelled footer badge */}
      {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
        <div className={`pord-card__final-bar pord-card__final-bar--${order.status.toLowerCase()}`}>
          {order.status === "DELIVERED" ? "✓ Order completed successfully" : "✕ Order cancelled"}
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
=======
/* ─── Main page ──────────────────────────────────────────────────────────── */
>>>>>>> dc5656236feee959b1e0e891718009336b905842
export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [tab, setTab] = useState("PLACED");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState<{ orderId: string; next: string; msg: string } | null>(null);
  const limit = 20;
  const searchRef = useRef<HTMLInputElement>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusParam = tab === "all" || tab === "active" ? undefined : tab;
      const [ordersRes, statsRes] = await Promise.all([
        getProviderOrders({ status: statusParam, page, limit, search: search || undefined } as any),
        page === 1 ? getProviderDashboardStats().catch(() => null) : Promise.resolve(null),
      ]);

      let raw: TOrder[] = ordersRes?.data?.orders ?? ordersRes?.data ?? [];
      if (tab === "active") raw = raw.filter(o => ACTIVE_STATUSES.includes(o.status));

      setOrders(raw);
      const meta = ordersRes?.data?.pagination ?? ordersRes?.meta;
      setTotal(meta?.total ?? raw.length);
      setTotalPages(meta?.totalPages ?? 1);
      if (statsRes) setStats(statsRes?.data ?? null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [tab, page, search]);

  useEffect(() => {
    const t = setTimeout(loadOrders, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [loadOrders, search]);

  const handleActionRequest = (orderId: string, next: string, msg: string) => {
    setConfirm({ orderId, next, msg });
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    setBusyOrderId(confirm.orderId);
    try {
      await updateProviderOrderStatus(confirm.orderId, confirm.next as any);
      toast.success("Order status updated.");
      setConfirm(null);
      await loadOrders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update status.");
    } finally {
      setBusyOrderId(null);
    }
  };

  const tabBadge = (val: string): number | null => {
    if (!stats) return null;
    if (val === "PLACED") return stats.pendingOrders ?? 0;
    if (val === "active") return stats.activeOrders ?? 0;
    return null;
  };

  const pageWindow = () => {
    const pages: number[] = [];
    for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) pages.push(p);
    return pages;
  };

  return (
    <div className="pord">
      {/* Header */}
      <div className="pord__header">
        <div>
          <p className="pord__eyebrow">Provider dashboard</p>
          <h1 className="pord__title">Orders</h1>
          <p className="pord__subtitle">Manage and fulfill customer orders in real time.</p>
        </div>

        {stats && (
          <div className="pord__stats">
            {[
              { val: stats.pendingOrders ?? 0,          label: "New",       cls: "pord__stat--amber" },
              { val: stats.activeOrders ?? 0,           label: "Active",    cls: "pord__stat--blue" },
              { val: stats.totalOrdersCompleted ?? 0,   label: "Completed", cls: "pord__stat--green" },
              { val: stats.totalOrdersCancelled ?? 0,   label: "Cancelled", cls: "pord__stat--red" },
            ].map(s => (
              <div key={s.label} className={`pord__stat ${s.cls}`}>
                <span className="pord__stat-value">{s.val}</span>
                <span className="pord__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="pord__toolbar">
        <div className="pord__search-wrap">
          <svg className="pord__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={searchRef}
            className="pord__search"
            placeholder="Search by order # or customer…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button className="pord__search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        {!isLoading && total > 0 && (
          <span className="pord__result-count">{total} order{total !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Tabs */}
      <div className="pord__tabs" role="tablist">
        {TABS.map(t => {
          const count = tabBadge(t.value);
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              className={`pord__tab${tab === t.value ? " pord__tab--active" : ""}${t.value === "PLACED" && (count ?? 0) > 0 ? " pord__tab--pulse" : ""}`}
              onClick={() => { setTab(t.value); setPage(1); }}
            >
              {t.label}
              {count !== null && count > 0 && (
                <span className={`pord__tab-badge${t.value === "PLACED" ? " pord__tab-badge--hot" : ""}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="pord__list">
          {[1,2,3].map(k => <OrderSkeleton key={k} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="pord__empty">
          <span className="pord__empty-icon">{tab === "PLACED" ? "🔔" : tab === "DELIVERED" ? "🎉" : "📋"}</span>
          <p className="pord__empty-title">
            {tab === "PLACED" ? "No new orders" : tab === "DELIVERED" ? "No delivered orders" : "No orders found"}
          </p>
          <p className="pord__empty-hint">
            {tab === "PLACED" ? "New customer orders will appear here as they come in." : "Try a different tab or search term."}
          </p>
        </div>
      ) : (
        <div className="pord__list">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={handleActionRequest}
              busyId={busyOrderId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="pord__pagination">
          <span className="pord__page-info">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <div className="pord__page-btns">
            <button className="pord__page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button className="pord__page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {pageWindow().map(p => (
              <button key={p} className={`pord__page-btn${page === p ? " pord__page-btn--active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="pord__page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            <button className="pord__page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          message={confirm.msg}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          isBusy={busyOrderId === confirm.orderId}
        />
      )}
    </div>
  );
}