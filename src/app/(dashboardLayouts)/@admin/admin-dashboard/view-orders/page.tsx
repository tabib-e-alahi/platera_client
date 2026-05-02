"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAdminOrderDetail, getAdminOrders } from "@/services/admin.service";
import "./admin-orders.css";

type TOrderItem = {
  id: string; mealName: string; mealImageUrl?: string | null;
  quantity: number; unitPrice: string | number; totalPrice: string | number;
};
type TPayment = {
  id: string; status: string; amount: string | number;
  providerSettlementStatus: string; gatewayName?: string | null;
};
type TOrder = {
  id: string; orderNumber: string; status: string; paymentMethod: string;
  totalAmount: string | number; subtotal: string | number;
  deliveryFee: string | number; discountAmount: string | number;
  createdAt: string; placedAt?: string | null; deliveredAt?: string | null;
  cancelledAt?: string | null;
  customerName?: string | null; customerPhone?: string | null;
  deliveryCity?: string; deliveryStreetAddress?: string | null;
  deliveryHouseNumber?: string | null; deliveryApartment?: string | null;
  deliveryPostalCode?: string | null; deliveryNote?: string | null;
  provider?: { id: string; businessName: string; city: string; businessEmail?: string };
  customer?: { id: string; name: string; email: string; phone?: string };
  payments?: TPayment[];
  orderItems?: TOrderItem[];
  orderStatusHistories?: Array<{ id: string; status: string; note?: string | null; createdAt: string; changedByRole?: string }>;
};

const n = (v: string | number | null | undefined) => Number(v ?? 0);

const STATUS_META: Record<string, { label: string; icon: string }> = {
  PENDING_PAYMENT: { label: "Pending Payment", icon: "💳" },
  PLACED: { label: "Placed", icon: "📋" },
  ACCEPTED: { label: "Accepted", icon: "✅" },
  PREPARING: { label: "Preparing", icon: "👨‍🍳" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: "🛵" },
  DELIVERED: { label: "Delivered", icon: "🎉" },
  CANCELLED: { label: "Cancelled", icon: "✕" },
  REFUNDED: { label: "Refunded", icon: "↩" },
};

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Placed", value: "PLACED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function fmt(d: string, time = false) {
  return new Date(d).toLocaleDateString("en-BD", {
    day: "numeric", month: "short", year: "numeric",
    ...(time && { hour: "2-digit", minute: "2-digit" }),
  });
}

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(k => (
        <tr key={k} className="aord__skeleton-row">
          {[1, 2, 3, 4, 5, 6, 7].map(c => (
            <td key={c}><div className="aord__skeleton-cell" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

function OrderDrawer({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [order, setOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminOrderDetail(orderId);
        setOrder(res?.data ?? null);
      } catch {
        toast.error("Failed to load order detail.");
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="aord-drawer-overlay" onClick={onClose}>
      <div className="aord-drawer" onClick={e => e.stopPropagation()}>
        <div className="aord-drawer__header">
          <div>
            <p className="aord-drawer__eyebrow">Order detail</p>
            {order && <h2 className="aord-drawer__title">#{order.orderNumber}</h2>}
          </div>
          <button className="aord-drawer__close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="aord-drawer__loading">
            <div className="aord-drawer__spinner" />
            <p>Loading order details…</p>
          </div>
        ) : !order ? null : (
          <div className="aord-drawer__body">

            {/* Status + amount hero */}
            <div className="aord-drawer__hero">
              <div>
                <span className={`aord-badge aord-badge--${order.status.toLowerCase()}`}>
                  {STATUS_META[order.status]?.icon} {STATUS_META[order.status]?.label ?? order.status}
                </span>
                <p className="aord-drawer__sub-date">Placed {fmt(order.createdAt, true)}</p>
              </div>
              <div className="aord-drawer__hero-amount">৳{n(order.totalAmount).toFixed(2)}</div>
            </div>

            {/* Provider + Customer */}
            <div className="aord-drawer__two-col">
              <div className="aord-drawer__section">
                <p className="aord-drawer__section-title">🏪 Provider</p>
                <div className="aord-drawer__rows">
                  <div className="aord-drawer__row"><span>Business</span><span>{order.provider?.businessName}</span></div>
                  <div className="aord-drawer__row"><span>City</span><span>{order.provider?.city}</span></div>
                  {order.provider?.businessEmail && (
                    <div className="aord-drawer__row"><span>Email</span><span>{order.provider.businessEmail}</span></div>
                  )}
                </div>
              </div>
              <div className="aord-drawer__section">
                <p className="aord-drawer__section-title">👤 Customer</p>
                <div className="aord-drawer__rows">
                  <div className="aord-drawer__row"><span>Name</span><span>{order.customerName ?? order.customer?.name}</span></div>
                  <div className="aord-drawer__row"><span>Email</span><span>{order.customer?.email}</span></div>
                  <div className="aord-drawer__row"><span>Phone</span><span>{order.customerPhone ?? order.customer?.phone ?? "—"}</span></div>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="aord-drawer__section">
              <p className="aord-drawer__section-title">📍 Delivery address</p>
              <div className="aord-drawer__rows">
                {[
                  ["City", order.deliveryCity],
                  ["Street", order.deliveryStreetAddress],
                  ["House", order.deliveryHouseNumber],
                  ["Apt", order.deliveryApartment],
                  ["Postal", order.deliveryPostalCode],
                  ...(order.deliveryNote ? [["Note", `"${order.deliveryNote}"`]] : []),
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="aord-drawer__row"><span>{k}</span><span>{v}</span></div>
                ))}
              </div>
            </div>

            {/* Items */}
            {order.orderItems && order.orderItems.length > 0 && (
              <div className="aord-drawer__section">
                <p className="aord-drawer__section-title">🍱 Items ({order.orderItems.length})</p>
                <div className="aord-drawer__items">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="aord-drawer__item">
                      <div className="aord-drawer__item-img">
                        {item.mealImageUrl
                          ? <img src={item.mealImageUrl} alt={item.mealName} />
                          : <span>🍱</span>}
                      </div>
                      <span className="aord-drawer__item-name">{item.mealName}</span>
                      <span className="aord-drawer__item-qty">×{item.quantity}</span>
                      <span className="aord-drawer__item-price">৳{n(item.totalPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="aord-drawer__price-breakdown">
                  <div className="aord-drawer__price-row"><span>Subtotal</span><span>৳{n(order.subtotal).toFixed(2)}</span></div>
                  <div className="aord-drawer__price-row"><span>Delivery fee</span><span>৳{n(order.deliveryFee).toFixed(2)}</span></div>
                  {n(order.discountAmount) > 0 && (
                    <div className="aord-drawer__price-row aord-drawer__price-row--discount">
                      <span>Discount</span><span>-৳{n(order.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="aord-drawer__price-row aord-drawer__price-row--total">
                    <span>Total</span><span>৳{n(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payments */}
            {order.payments && order.payments.length > 0 && (
              <div className="aord-drawer__section">
                <p className="aord-drawer__section-title">💳 Payment · {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}</p>
                {order.payments.map(p => (
                  <div key={p.id} className="aord-drawer__rows">
                    <div className="aord-drawer__row">
                      <span>Status</span>
                      <span className={`aord-drawer__pay-pill aord-drawer__pay-pill--${p.status.toLowerCase()}`}>{p.status}</span>
                    </div>
                    <div className="aord-drawer__row">
                      <span>Settlement</span>
                      <span className={`aord-drawer__pay-pill aord-drawer__pay-pill--${p.providerSettlementStatus.toLowerCase()}`}>{p.providerSettlementStatus}</span>
                    </div>
                    {p.gatewayName && <div className="aord-drawer__row"><span>Gateway</span><span>{p.gatewayName}</span></div>}
                    <div className="aord-drawer__row"><span>Amount</span><span>৳{n(p.amount).toFixed(2)}</span></div>
                  </div>
                ))}
              </div>
            )}

            {/* Status timeline */}
            {order.orderStatusHistories && order.orderStatusHistories.length > 0 && (
              <div className="aord-drawer__section">
                <p className="aord-drawer__section-title">🕓 Status timeline</p>
                <div className="aord-drawer__timeline">
                  {order.orderStatusHistories.map((h, i) => (
                    <div key={h.id} className={`aord-drawer__tl-entry${i === order.orderStatusHistories!.length - 1 ? " aord-drawer__tl-entry--last" : ""}`}>
                      <div className="aord-drawer__tl-dot" />
                      <div>
                        <div className="aord-drawer__tl-top">
                          <span className={`aord-badge aord-badge--${h.status.toLowerCase()}`}>{STATUS_META[h.status]?.label ?? h.status}</span>
                          {h.changedByRole && <span className="aord-drawer__tl-role">by {h.changedByRole === "CUSTOMER" ? "Customer" : h.changedByRole === "PROVIDER" ? "Provider" : "System"}</span>}
                        </div>
                        {h.note && <p className="aord-drawer__tl-note">{h.note}</p>}
                        <p className="aord-drawer__tl-time">{fmt(h.createdAt, true)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminViewOrdersPage() {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [drawerOrderId, setDrawerOrderId] = useState<string | null>(null);
  const limit = 20;
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminOrders({ page, limit, search: search || undefined, status: statusFilter || undefined });
      setOrders(res?.data?.orders ?? res?.data ?? []);
      const meta = res?.data?.pagination ?? res?.meta;
      setTotal(meta?.total ?? 0);
      setTotalPages(meta?.totalPages ?? 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchOrders, search]);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleStatusChange = (v: string) => { setStatusFilter(v); setPage(1); };

  // page window
  const pageWindow = () => {
    const pages: number[] = [];
    const w = 2;
    for (let p = Math.max(1, page - w); p <= Math.min(totalPages, page + w); p++) pages.push(p);
    return pages;
  };

  return (
    <div className="aord">
      {/* Header */}
      <div className="aord__header">
        <div>
          <p className="aord__eyebrow">Admin Panel</p>
          <h1 className="aord__title">All Orders</h1>
          <p className="aord__subtitle">Monitor, search, and investigate every platform order.</p>
        </div>
        <div className="aord__header-stats">
          <div className="aord__stat-pill">
            <span className="aord__stat-num">{total.toLocaleString()}</span>
            <span className="aord__stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="aord__toolbar">
        <div className="aord__search-wrap">
          <svg className="aord__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            className="aord__search"
            placeholder="Search order #, provider, or customer…"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
          {search && (
            <button className="aord__search-clear" onClick={() => handleSearchChange("")}>✕</button>
          )}
        </div>
        <div className="aord__toolbar-right">
          {!isLoading && (
            <span className="aord__result-hint">
              {total > 0 ? `${total.toLocaleString()} result${total !== 1 ? "s" : ""}` : "No results"}
            </span>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="aord__tabs" role="tablist">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            role="tab"
            aria-selected={statusFilter === t.value}
            className={`aord__tab${statusFilter === t.value ? " aord__tab--active" : ""}`}
            onClick={() => handleStatusChange(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="aord__table-wrap">
        <table className="aord__table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Provider</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Provider Sattlement</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="aord__empty">
                    <span className="aord__empty-icon">{search ? "🔍" : "📦"}</span>
                    <p className="aord__empty-title">{search ? "No matching orders" : "No orders found"}</p>
                    <p className="aord__empty-hint">
                      {search ? `No orders match "${search}"` : statusFilter ? `No orders with status "${STATUS_META[statusFilter]?.label}"` : "No orders on this platform yet."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : orders.map(order => (
              <tr key={order.id} className={`aord__row ${order.status === "CANCELLED" ? "aord__row--cancelled" : ""} ${order.status === "DELIVERED" ? "aord__row--delivered" : ""}`} onClick={() => setDrawerOrderId(order.id)}>
                <td>
                  <span className="aord__order-num">#{order.orderNumber}</span>
                  <span className="aord__order-method">{order.paymentMethod === "COD" ? "💵 COD" : "💳 Online"}</span>
                </td>
                <td>
                  <span className="aord__provider-name">{order.provider?.businessName}</span>
                  <span className="aord__city">{order.provider?.city}</span>
                </td>
                <td>
                  <span className="aord__customer-name">{order.customer?.name}</span>
                  <span className="aord__customer-email">{order.customer?.email}</span>
                </td>
                <td>
                  <span className={`aord-badge aord-badge--${order.status.toLowerCase()}`}>
                    {STATUS_META[order.status]?.icon} {STATUS_META[order.status]?.label ?? order.status}
                  </span>
                </td>
                <td>
                  {order.payments?.[0] ? (
                    <div>
                      <span className={`aord__pay-tag aord__pay-tag--${order.payments[0].status.toLowerCase()}`}>
                        {order.payments[0].status}
                      </span>
                    </div>
                  ) : <span className="aord__na">—</span>}
                </td>
                <td className="text-center">
                  {order.payments?.[0] ? (
                    <div>
                      <span className={`aord__settle-tag aord__settle-tag--${order.payments[0].providerSettlementStatus.toLowerCase()}`}>
                        {order.payments[0].providerSettlementStatus}
                      </span>
                    </div>
                  ) : <span className="aord__na">—</span>}
                </td>
                <td><span className="aord__amount">৳{n(order.totalAmount).toFixed(2)}</span></td>
                <td>
                  <span className="aord__date">{fmt(order.createdAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="aord__pagination">
            <span className="aord__page-info">
              Showing <strong>{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</strong> of <strong>{total.toLocaleString()}</strong>
            </span>
            <div className="aord__page-btns">
              <button className="aord__page-btn" disabled={page === 1} onClick={() => setPage(1)} title="First">«</button>
              <button className="aord__page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)} title="Previous">‹</button>
              {pageWindow().map(p => (
                <button
                  key={p}
                  className={`aord__page-btn${page === p ? " aord__page-btn--active" : ""}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
              <button className="aord__page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} title="Next">›</button>
              <button className="aord__page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)} title="Last">»</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {drawerOrderId && (
        <OrderDrawer orderId={drawerOrderId} onClose={() => setDrawerOrderId(null)} />
      )}
    </div>
  );
}