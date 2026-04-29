"use client";
<<<<<<< HEAD
// src/app/(dashboardLayouts)/@customer/customer-dashboard/orders/page.tsx
// FULL REPLACEMENT

=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cancelMyOrder, getMyOrders } from "@/services/order.service";
import "./customer-orders.css";
<<<<<<< HEAD
import {
  ACTIVE_STATUSES,
  TAB_FILTERS,
  TCancelResult,
  TOrder,
} from "@/HelpersAndAttributes/CustomerOrder/typesAndConstants";
import {
  CancelConfirmModal,
  OrderCard,
  OrderSkeleton,
} from "../../_components/OrderSubComponents/SubComponents";

export default function CustomerOrdersPage() {
  const [orders, setOrders]               = useState<TOrder[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [busyOrderId, setBusyOrderId]     = useState<string | null>(null);
  const [tab, setTab]                     = useState("all");
  const [search, setSearch]               = useState("");
  // Modal state
  const [cancelTarget, setCancelTarget]   = useState<TOrder | null>(null);
  const [cancelResult, setCancelResult]   = useState<TCancelResult | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
=======
import { ACTIVE_STATUSES, TAB_FILTERS, TOrder } from "@/HelpersAndAttributes/CustomerOrder/typesAndConstants";
import { CancelConfirmModal, OrderCard, OrderSkeleton } from "../../_components/OrderSubComponents/SubComponents";


/* ─── Main page ──────────────────────────────────────────────────────────── */

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [tab, setTab] = useState("all");
  const [cancelTarget, setCancelTarget] = useState<TOrder | null>(null);
  const [search, setSearch] = useState("");
>>>>>>> dc5656236feee959b1e0e891718009336b905842

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getMyOrders();
<<<<<<< HEAD
      setOrders(res?.data?.orders ?? []);
=======
      setOrders(res?.data.orders ?? []);
>>>>>>> dc5656236feee959b1e0e891718009336b905842
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

<<<<<<< HEAD
  useEffect(() => { loadOrders(); }, [loadOrders]);

  /* Step 1 — Customer clicks Cancel on a card */
  const handleCancelRequest = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId) ?? null;
    setCancelTarget(order);
    setCancelResult(null);
    setServerMessage(null);
  };

  /* Step 2 — Customer confirms in the modal → API call */
  const handleCancelConfirm = async (orderId: string) => {
    setBusyOrderId(orderId);
    try {
      const res = await cancelMyOrder(orderId);
      // Keep the modal open and switch it to the "result" view
      setCancelResult(res.data ?? null);
      setServerMessage(res.message ?? null);
      // Reload list quietly so the card updates in background
      loadOrders();
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? "Failed to cancel order.";
      toast.error(msg);
      // Close modal on error — the order was not cancelled
      setCancelTarget(null);
=======
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancelRequest = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId) ?? null;
    setCancelTarget(order);
  };

  const handleCancelConfirm = async (orderId: string) => {
    setBusyOrderId(orderId);
    try {
      await cancelMyOrder(orderId);
      toast.success("Order cancelled successfully.");
      setCancelTarget(null);
      await loadOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to cancel order."
      );
>>>>>>> dc5656236feee959b1e0e891718009336b905842
    } finally {
      setBusyOrderId(null);
    }
  };

<<<<<<< HEAD
  /* Step 3 — Customer closes the result modal */
  const handleModalClose = () => {
    setCancelTarget(null);
    setCancelResult(null);
    setServerMessage(null);
  };

  /* Filtering */
  const tabCount = (val: string) => {
    if (val === "all")    return orders.length;
    if (val === "active") return orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
    return orders.filter((o) => o.status === val).length;
  };

  const filtered = orders.filter((o) => {
    const matchesTab =
      tab === "all"    ? true
      : tab === "active" ? ACTIVE_STATUSES.includes(o.status)
      : o.status === tab;
=======
  const tabCount = (val: string) => {
    if (val === "all") return orders.length;
    if (val === "active")
      return orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
    return orders.filter((o) => o.status === val).length;
  };
  const filtered = orders?.filter((o) => {
    const matchesTab =
      tab === "all"
        ? true
        : tab === "active"
        ? ACTIVE_STATUSES.includes(o.status)
        : o.status === tab;
>>>>>>> dc5656236feee959b1e0e891718009336b905842

    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.provider?.businessName?.toLowerCase().includes(q) ||
      o.orderItems.some((i) => i.mealName.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

<<<<<<< HEAD
  const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  return (
    <div className="cord">
      {/* ── Header ── */}
=======
  const activeCount = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  ).length;

  return (
    <div className="cord">
      {/* ── Page header ── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      <div className="cord__header">
        <div className="cord__header-text">
          <p className="cord__eyebrow">Customer dashboard</p>
          <h1 className="cord__title">My Orders</h1>
<<<<<<< HEAD
          <p className="cord__subtitle">Track, manage, and review all your food orders in one place.</p>
        </div>
=======
          <p className="cord__subtitle">
            Track, manage, and review all your food orders in one place.
          </p>
        </div>

>>>>>>> dc5656236feee959b1e0e891718009336b905842
        {activeCount > 0 && (
          <div className="cord__active-pill">
            <span className="cord__active-dot" />
            {activeCount} active order{activeCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Search ── */}
      <div className="cord__search-row">
        <div className="cord__search">
<<<<<<< HEAD
          <svg className="cord__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
=======
          <svg
            className="cord__search-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          </svg>
          <input
            type="text"
            placeholder="Search by order #, restaurant, or dish…"
            className="cord__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
<<<<<<< HEAD
            <button className="cord__search-clear" onClick={() => setSearch("")}>✕</button>
=======
            <button
              className="cord__search-clear"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="cord__tabs" role="tablist">
        {TAB_FILTERS.map((t) => {
          const count = tabCount(t.value);
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              className={`cord__tab${tab === t.value ? " cord__tab--active" : ""}`}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              {count > 0 && (
<<<<<<< HEAD
                <span className={`cord__tab-count${t.value === "REFUNDED" ? " cord__tab-count--violet" : ""}`}>
                  {count}
                </span>
=======
                <span className="cord__tab-count">{count}</span>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="cord__list">
<<<<<<< HEAD
          {[1, 2, 3].map((k) => <OrderSkeleton key={k} />)}
=======
          {[1, 2, 3].map((k) => (
            <OrderSkeleton key={k} />
          ))}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        </div>
      ) : filtered.length === 0 ? (
        <div className="cord__empty">
          <div className="cord__empty-icon">
<<<<<<< HEAD
            {search ? "🔍" : tab === "DELIVERED" ? "📦" : tab === "REFUNDED" ? "↩" : "🍽"}
          </div>
          <p className="cord__empty-title">{search ? "No matching orders" : "No orders here"}</p>
          <p className="cord__empty-hint">
            {search
              ? `No orders match "${search}". Try clearing your search.`
              : tab === "all"
              ? "You haven't placed any orders yet. Start exploring our restaurants!"
              : `No ${TAB_FILTERS.find((t) => t.value === tab)?.label.toLowerCase() ?? tab} orders found.`}
          </p>
          {tab === "all" && !search && (
            <Link href="/restaurants" className="cord__empty-cta">Browse restaurants →</Link>
=======
            {search ? "🔍" : tab === "DELIVERED" ? "📦" : "🍽"}
          </div>
          <p className="cord__empty-title">
            {search ? "No matching orders" : "No orders here"}
          </p>
          <p className="cord__empty-hint">
            {search
              ? `No orders match "${search}". Try a different search term.`
              : tab === "all"
              ? "You haven't placed any orders yet. Start exploring our restaurants!"
              : `No ${
                  TAB_FILTERS.find((t) => t.value === tab)?.label.toLowerCase() ??
                  tab.toLowerCase().replace(/_/g, " ")
                } orders found.`}
          </p>
          {tab === "all" && !search && (
            <Link href="/restaurants" className="cord__empty-cta">
              Browse restaurants →
            </Link>
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          )}
        </div>
      ) : (
        <>
          <p className="cord__result-count">
<<<<<<< HEAD
            Showing {filtered.length} order{filtered.length !== 1 ? "s" : ""}
=======
            Showing {filtered.length} order
            {filtered.length !== 1 ? "s" : ""}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
          </p>
          <div className="cord__list">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancelRequest={handleCancelRequest}
                busyId={busyOrderId}
              />
            ))}
          </div>
        </>
      )}

<<<<<<< HEAD
      {/* ── Cancel / refund modal ── */}
      {cancelTarget && (
        <CancelConfirmModal
          order={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={handleModalClose}
          isBusy={busyOrderId === cancelTarget.id}
          cancelResult={cancelResult}
          serverMessage={serverMessage}
=======
      {/* ── Cancel confirmation modal ── */}
      {cancelTarget && (
        <CancelConfirmModal
          orderId={cancelTarget.id}
          orderNumber={cancelTarget.orderNumber}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
          isBusy={busyOrderId === cancelTarget.id}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
        />
      )}
    </div>
  );
}