"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProviderDashboardStats, getProviderRevenueChart } from "@/services/order.service";
import "./statistics.css";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type TStats = {
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  totalOrdersCompleted: number;
  totalOrdersCancelled: number;
  totalRevenue: number;
  totalPlatformFee: number;
  totalProviderEarning: number;
  currentPayableAmount: number;
  lastPaymentAt?: string | null;
  averageOrderValue: number;
  totalMeals: number;
  activeMeals: number;
  approvalStatus: string;
  businessName: string;
};

type TChartEntry = { label: string; revenue: number; orders: number };

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const n = (v: any) => Number(v ?? 0);
const fmt = (v: number) =>
  v >= 1_000_000 ? `৳${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `৳${(v / 1_000).toFixed(1)}K`
  : `৳${v.toFixed(0)}`;

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function StatSkeleton() {
  return (
    <div className="pstat-skeleton">
      {[1,2,3,4,5,6,7,8].map(k => (
        <div key={k} className="pstat-skeleton__card">
          <div className="pstat-skeleton__line pstat-skeleton__line--sm" />
          <div className="pstat-skeleton__line pstat-skeleton__line--lg" />
        </div>
      ))}
    </div>
  );
}

/* ─── Mini bar chart ─────────────────────────────────────────────────────── */
function BarChart({ data }: { data: TChartEntry[] }) {
  if (!data.length) return <div className="pstat-chart__empty">No data available.</div>;
  const maxRev = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="pstat-chart">
      <div className="pstat-chart__bars">
        {data.map((entry, i) => (
          <div key={i} className="pstat-chart__col">
            <div className="pstat-chart__bar-wrap">
              <div
                className="pstat-chart__bar"
                style={{ height: `${(entry.revenue / maxRev) * 100}%` }}
                title={`৳${n(entry.revenue).toFixed(0)} · ${entry.orders} orders`}
              >
                <span className="pstat-chart__bar-tip">{fmt(entry.revenue)}</span>
              </div>
            </div>
            <span className="pstat-chart__label">{entry.label}</span>
          </div>
        ))}
      </div>
      <div className="pstat-chart__legend">
        <span className="pstat-chart__legend-dot" /> Revenue (last 7 days)
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, icon, color, large,
}: {
  label: string; value: string | number; sub?: string;
  icon: string; color: string; large?: boolean;
}) {
  return (
    <div className={`pstat-card pstat-card--${color}${large ? " pstat-card--large" : ""}`}>
      <div className="pstat-card__icon">{icon}</div>
      <div className="pstat-card__body">
        <p className="pstat-card__label">{label}</p>
        <p className="pstat-card__value">{value}</p>
        {sub && <p className="pstat-card__sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function ProviderStatisticsPage() {
  const [stats, setStats] = useState<TStats | null>(null);
  const [chart, setChart] = useState<TChartEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          getProviderDashboardStats(),
          getProviderRevenueChart().catch(() => ({ data: [] })),
        ]);
        setStats(statsRes?.data ?? null);
        setChart(chartRes?.data ?? []);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to load statistics.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return (
    <div className="pstat">
      <div className="pstat__header">
        <p className="pstat__eyebrow">Provider dashboard</p>
        <h1 className="pstat__title">Statistics</h1>
      </div>
      <StatSkeleton />
    </div>
  );

  if (!stats) return (
    <div className="pstat">
      <div className="pstat__error">
        <span>📊</span>
        <p>Could not load statistics. Please refresh.</p>
      </div>
    </div>
  );

  const deliveryRate = stats.totalOrders > 0
    ? Math.round((stats.totalOrdersCompleted / stats.totalOrders) * 100)
    : 0;

  const cancelRate = stats.totalOrders > 0
    ? Math.round((stats.totalOrdersCancelled / stats.totalOrders) * 100)
    : 0;

  return (
    <div className="pstat">
      {/* Header */}
      <div className="pstat__header">
        <div>
          <p className="pstat__eyebrow">Provider dashboard</p>
          <h1 className="pstat__title">Statistics</h1>
          <p className="pstat__subtitle">A full overview of your business performance.</p>
        </div>
        <div className={`pstat__status-pill pstat__status-pill--${(stats.approvalStatus ?? "draft").toLowerCase()}`}>
          {stats.approvalStatus === "APPROVED" ? "✅" : stats.approvalStatus === "PENDING" ? "🕐" : "✏️"} {stats.approvalStatus}
        </div>
      </div>

      {/* Revenue cards */}
      <section className="pstat__section">
        <h2 className="pstat__section-title">Revenue overview</h2>
        <div className="pstat__grid pstat__grid--4">
          <StatCard icon="💰" color="amber" large label="Total revenue" value={fmt(n(stats.totalRevenue))} sub="All completed orders" />
          <StatCard icon="📤" color="green" label="Your earnings"  value={fmt(n(stats.totalProviderEarning))} sub="After platform fee" />
          <StatCard icon="🏦" color="blue"  label="Platform fee"   value={fmt(n(stats.totalPlatformFee))} sub="Deducted from orders" />
          <StatCard icon="⏳" color="red"   label="Pending payout" value={fmt(n(stats.currentPayableAmount))}
            sub={stats.lastPaymentAt ? `Last paid ${new Date(stats.lastPaymentAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}` : "Not yet paid out"} />
        </div>
      </section>

      {/* Order stats */}
      <section className="pstat__section">
        <h2 className="pstat__section-title">Orders</h2>
        <div className="pstat__grid pstat__grid--4">
          <StatCard icon="📦" color="neutral" label="Total orders"    value={stats.totalOrders} />
          <StatCard icon="🔔" color="amber"   label="New / pending"   value={stats.pendingOrders} sub="Awaiting acceptance" />
          <StatCard icon="⚡" color="blue"    label="Active orders"   value={stats.activeOrders} sub="In progress" />
          <StatCard icon="🎉" color="green"   label="Completed"       value={stats.totalOrdersCompleted} sub={`${deliveryRate}% delivery rate`} />
        </div>

        <div className="pstat__grid pstat__grid--3" style={{ marginTop: 10 }}>
          <StatCard icon="✕"  color="red"     label="Cancelled"        value={stats.totalOrdersCancelled} sub={`${cancelRate}% cancel rate`} />
          <StatCard icon="💳" color="neutral" label="Avg. order value" value={fmt(n(stats.averageOrderValue))} />
          <div className="pstat-card pstat-card--neutral">
            <div className="pstat-card__icon">📊</div>
            <div className="pstat-card__body">
              <p className="pstat-card__label">Delivery rate</p>
              <p className="pstat-card__value">{deliveryRate}%</p>
              <div className="pstat__progress-bar">
                <div className="pstat__progress-fill pstat__progress-fill--green" style={{ width: `${deliveryRate}%` }} />
              </div>
              <div className="pstat__progress-bar" style={{ marginTop: 6 }}>
                <div className="pstat__progress-fill pstat__progress-fill--red" style={{ width: `${cancelRate}%` }} />
              </div>
              <p className="pstat-card__sub">{cancelRate}% cancelled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue chart */}
      {chart.length > 0 && (
        <section className="pstat__section">
          <h2 className="pstat__section-title">Revenue — last 7 days</h2>
          <div className="pstat__chart-card">
            <BarChart data={chart} />
          </div>
        </section>
      )}

      {/* Menu stats */}
      <section className="pstat__section">
        <h2 className="pstat__section-title">Menu</h2>
        <div className="pstat__grid pstat__grid--3">
          <StatCard icon="🍱" color="neutral" label="Total meals"  value={stats.totalMeals ?? 0} />
          <StatCard icon="✅" color="green"   label="Active meals" value={stats.activeMeals ?? 0} sub="Visible to customers" />
          <StatCard icon="🚫" color="red"     label="Inactive"     value={Math.max(0, (stats.totalMeals ?? 0) - (stats.activeMeals ?? 0))} sub="Hidden from customers" />
        </div>
      </section>
    </div>
  );
}