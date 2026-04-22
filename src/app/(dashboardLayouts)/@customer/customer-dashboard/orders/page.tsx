"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cancelMyOrder, getMyOrders } from "@/services/order.service";
import "./customer-orders.css";
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

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getMyOrders();
      setOrders(res?.data.orders ?? []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    } finally {
      setBusyOrderId(null);
    }
  };

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

    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.provider?.businessName?.toLowerCase().includes(q) ||
      o.orderItems.some((i) => i.mealName.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  const activeCount = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  ).length;

  return (
    <div className="cord">
      {/* ── Page header ── */}
      <div className="cord__header">
        <div className="cord__header-text">
          <p className="cord__eyebrow">Customer dashboard</p>
          <h1 className="cord__title">My Orders</h1>
          <p className="cord__subtitle">
            Track, manage, and review all your food orders in one place.
          </p>
        </div>

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
          </svg>
          <input
            type="text"
            placeholder="Search by order #, restaurant, or dish…"
            className="cord__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="cord__search-clear"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
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
                <span className="cord__tab-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="cord__list">
          {[1, 2, 3].map((k) => (
            <OrderSkeleton key={k} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="cord__empty">
          <div className="cord__empty-icon">
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
          )}
        </div>
      ) : (
        <>
          <p className="cord__result-count">
            Showing {filtered.length} order
            {filtered.length !== 1 ? "s" : ""}
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

      {/* ── Cancel confirmation modal ── */}
      {cancelTarget && (
        <CancelConfirmModal
          orderId={cancelTarget.id}
          orderNumber={cancelTarget.orderNumber}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
          isBusy={busyOrderId === cancelTarget.id}
        />
      )}
    </div>
  );
}