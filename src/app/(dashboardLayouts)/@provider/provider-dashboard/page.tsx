"use client";

import { useEffect, useState } from "react";
import { getProviderDashboardStats } from "@/services/provider.service";
import { toast } from "sonner";
import "./provider-dashboard.css";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";

const fmt = (n: number) =>
  n >= 1_000_000 ? `৳${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `৳${(n / 1_000).toFixed(1)}K`
  : `৳${n.toFixed(0)}`;

const pct = (part: number, total: number) =>
  total === 0 ? "0.0" : ((part / total) * 100).toFixed(1);

const C = {
  gold: "hsl(38 70% 52%)",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="pd-tooltip">
      <p className="pd-tooltip__label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="pd-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}:</span><strong>{fmt(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

function Skeleton() {
  return (
    <div className="pd-page">
      <div className="pd-skeleton__header" />
      <div className="pd-kpi-grid">
        {[1,2,3,4].map(i => <div key={i} className="pd-skeleton__card" />)}
      </div>
      <div className="pd-order-grid">
        {[1,2,3,4,5].map(i => <div key={i} className="pd-skeleton__card pd-skeleton__card--sm" />)}
      </div>
      <div className="pd-skeleton__chart-row">
        <div className="pd-skeleton__chart" />
        <div className="pd-skeleton__chart pd-skeleton__chart--sm" />
      </div>
    </div>
  );
}

export default function ProviderDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProviderDashboardStats();
        setStats(res?.data ?? null);
      } catch (e: any) {
        toast.error(e?.response?.data?.message ?? "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Skeleton />;
  if (!stats)
    return (
      <div className="pd-empty">
        <span>📊</span>
        <p>No dashboard data available yet.</p>
        <small>Stats appear once you start receiving orders.</small>
      </div>
    );

  const { overview, orders, settlements, monthlyRevenue } = stats;
  const deliveryRate = pct(orders.delivered, orders.total);
  const cancelRate   = pct(orders.cancelled, orders.total);
  const feeRate      = pct(overview.totalPlatformFee, overview.totalGrossRevenue);

  const lastMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const growthPct =
    prevMonth && prevMonth.net > 0
      ? (((lastMonth?.net ?? 0) - prevMonth.net) / prevMonth.net) * 100
      : null;

  const orderPie = [
    { name: "Delivered", value: orders.delivered, color: C.green },
    { name: "Active",    value: orders.active,    color: C.blue },
    { name: "Cancelled", value: orders.cancelled, color: C.red },
    { name: "Placed",    value: orders.placed,    color: C.gold },
  ].filter(d => d.value > 0);

  const settlePie = [
    { name: "Paid to you", value: settlements.paid.amount,    color: C.green },
    { name: "Pending",     value: settlements.pending.amount, color: C.gold },
  ].filter(d => d.value > 0);

  const totalSettle = settlements.paid.amount + settlements.pending.amount;

  return (
    <div className="pd-page">

      {/* ── Header ── */}
      <div className="pd-header">
        <div className="pd-header__left">
          <p className="pd-eyebrow">Provider Dashboard</p>
          <h1 className="pd-title">Business Overview</h1>
          <p className="pd-subtitle">Complete financial &amp; order analytics for your business</p>
        </div>
        {growthPct !== null && (
          <div className={`pd-growth-badge ${growthPct >= 0 ? "pd-growth-badge--up" : "pd-growth-badge--down"}`}>
            <span className="pd-growth-badge__arrow">{growthPct >= 0 ? "↑" : "↓"}</span>
            <div>
              <p className="pd-growth-badge__pct">{Math.abs(growthPct).toFixed(1)}%</p>
              <p className="pd-growth-badge__label">vs last month</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Revenue KPIs ── */}
      <section className="pd-section">
        <h2 className="pd-section__title">Revenue &amp; Earnings</h2>
        <div className="pd-kpi-grid">
          {[
            { label: "Gross Revenue",   value: fmt(overview.totalGrossRevenue),    sub: "Total customer payments",         icon: "💰", accent: "gold",  badge: null },
            { label: "Platform Fee",    value: fmt(overview.totalPlatformFee),     sub: `${feeRate}% of gross · Platera commission`,  icon: "🏛️", accent: "blue",  badge: "25%" },
            { label: "Net Earnings",    value: fmt(overview.totalProviderEarning), sub: "Your share after platform fee",   icon: "💵", accent: "green", badge: null },
            { label: "Pending Payout",  value: fmt(overview.currentPayableAmount), sub: "Awaiting admin settlement",       icon: "⏳", accent: "amber", badge: null },
          ].map(k => (
            <div key={k.label} className={`pd-kpi pd-kpi--${k.accent}`}>
              <div className="pd-kpi__icon-wrap">
                <span className="pd-kpi__icon">{k.icon}</span>
                {k.badge && <span className="pd-kpi__badge">{k.badge}</span>}
              </div>
              <div className="pd-kpi__body">
                <span className="pd-kpi__label">{k.label}</span>
                <span className="pd-kpi__value">{k.value}</span>
                <span className="pd-kpi__sub">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Order Stats ── */}
      <section className="pd-section">
        <h2 className="pd-section__title">Order Statistics</h2>
        <div className="pd-order-grid">
          {[
            { label: "Total Orders", value: orders.total,     icon: "📦", color: "",       rate: null },
            { label: "Placed",       value: orders.placed,    icon: "🛒", color: "blue",   rate: pct(orders.placed, orders.total) },
            { label: "Active",       value: orders.active,    icon: "🔥", color: "purple", rate: pct(orders.active, orders.total) },
            { label: "Delivered",    value: orders.delivered, icon: "✅", color: "green",  rate: deliveryRate },
            { label: "Cancelled",    value: orders.cancelled, icon: "❌", color: "red",    rate: cancelRate },
          ].map(o => (
            <div key={o.label} className={`pd-ostat pd-ostat--${o.color}`}>
              <span className="pd-ostat__icon">{o.icon}</span>
              <span className="pd-ostat__value">{o.value}</span>
              <span className="pd-ostat__label">{o.label}</span>
              {o.rate !== null && <span className="pd-ostat__rate">{o.rate}%</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Charts Row ── */}
      <section className="pd-section">
        <h2 className="pd-section__title">Revenue Charts</h2>
        <div className="pd-charts-row">

          <div className="pd-chart-card pd-chart-card--wide">
            <div className="pd-chart-card__header">
              <div>
                <h3 className="pd-chart-title">Monthly Revenue Breakdown</h3>
                <p className="pd-chart-sub">Last 6 months — gross, platform fee &amp; net earnings</p>
              </div>
            </div>
            {monthlyRevenue.length === 0
              ? <div className="pd-chart-empty">No revenue data for the last 6 months</div>
              : (
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={monthlyRevenue} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={3} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                    <Bar dataKey="gross" name="Gross"        fill={C.blue}  radius={[4,4,0,0]} />
                    <Bar dataKey="fee"   name="Platform Fee" fill={C.red}   radius={[4,4,0,0]} />
                    <Bar dataKey="net"   name="Net Earnings" fill={C.green} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </div>

          <div className="pd-chart-card">
            <h3 className="pd-chart-title">Order Distribution</h3>
            <p className="pd-chart-sub">All-time breakdown by status</p>
            {orderPie.length === 0
              ? <div className="pd-chart-empty">No orders yet</div>
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={orderPie} cx="50%" cy="50%" innerRadius={52} outerRadius={82}
                      dataKey="value" nameKey="name" paddingAngle={3} strokeWidth={0}>
                      {orderPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v} orders`]} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
            <div className="pd-rate-row">
              <div className="pd-rate">
                <span className="pd-rate__pct" style={{ color: C.green }}>{deliveryRate}%</span>
                <span className="pd-rate__label">Delivery rate</span>
              </div>
              <div className="pd-rate__divider" />
              <div className="pd-rate">
                <span className="pd-rate__pct" style={{ color: C.red }}>{cancelRate}%</span>
                <span className="pd-rate__label">Cancel rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Earnings Growth Line ── */}
      <section className="pd-section">
        <div className="pd-chart-card pd-chart-card--full">
          <div className="pd-chart-card__header">
            <div>
              <h3 className="pd-chart-title">Earnings Growth Trend</h3>
              <p className="pd-chart-sub">Month-over-month net income trajectory</p>
            </div>
            {growthPct !== null && (
              <span className={`pd-inline-badge ${growthPct >= 0 ? "pd-inline-badge--green" : "pd-inline-badge--red"}`}>
                {growthPct >= 0 ? "↑" : "↓"} {Math.abs(growthPct).toFixed(1)}% MoM
              </span>
            )}
          </div>
          {monthlyRevenue.length === 0
            ? <div className="pd-chart-empty">No data yet</div>
            : (
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={monthlyRevenue} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                  <Line type="monotone" dataKey="net"   name="Net Earnings"   stroke={C.gold}  strokeWidth={2.5} dot={{ r: 4, fill: C.gold, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="gross" name="Gross Revenue"  stroke={C.blue}  strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  <Line type="monotone" dataKey="fee"   name="Platform Fee"   stroke={C.red}   strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </section>

      {/* ── Settlement Summary ── */}
      <section className="pd-section">
        <h2 className="pd-section__title">Settlement Summary</h2>
        <div className="pd-settle-grid">

          <div className="pd-settle-card pd-settle-card--paid">
            <div className="pd-settle-card__top">
              <span className="pd-settle-card__icon">✅</span>
              <div className="pd-settle-card__meta">
                <p className="pd-settle-card__label">Total Paid to You</p>
                <p className="pd-settle-card__count">{settlements.paid.count} payments settled</p>
              </div>
            </div>
            <p className="pd-settle-card__value">{fmt(settlements.paid.amount)}</p>
            <div className="pd-settle-card__bar">
              <div className="pd-settle-card__bar-fill pd-settle-card__bar-fill--green"
                style={{ width: `${pct(settlements.paid.amount, totalSettle)}%` }} />
            </div>
          </div>

          <div className="pd-settle-card pd-settle-card--pending">
            <div className="pd-settle-card__top">
              <span className="pd-settle-card__icon">⏳</span>
              <div className="pd-settle-card__meta">
                <p className="pd-settle-card__label">Pending Settlement</p>
                <p className="pd-settle-card__count">{settlements.pending.count} payments awaiting</p>
              </div>
            </div>
            <p className="pd-settle-card__value">{fmt(settlements.pending.amount)}</p>
            <div className="pd-settle-card__bar">
              <div className="pd-settle-card__bar-fill pd-settle-card__bar-fill--gold"
                style={{ width: `${pct(settlements.pending.amount, totalSettle)}%` }} />
            </div>
          </div>

          <div className="pd-settle-chart-card">
            <h4 className="pd-settle-chart-card__title">Settlement Ratio</h4>
            {settlePie.length === 0
              ? <div className="pd-chart-empty" style={{ height: 150 }}>No payments yet</div>
              : (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={settlePie} cx="50%" cy="50%" outerRadius={58}
                      dataKey="value" nameKey="name" paddingAngle={3} strokeWidth={0}>
                      {settlePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => fmt(Number(v))} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
          </div>

          <div className="pd-settle-info">
            {[
              { icon: "🏆", label: "Orders Completed", val: overview.totalOrdersCompleted.toString() },
              { icon: "📅", label: "Last Settlement",   val: overview.lastPaymentAt
                  ? new Date(overview.lastPaymentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : "No settlements yet" },
              { icon: "📊", label: "Platform Fee Rate", val: "25% of gross" },
            ].map((row, i) => (
              <div key={i}>
                {i > 0 && <div className="pd-settle-info__divider" />}
                <div className="pd-settle-info__row">
                  <span className="pd-settle-info__icon">{row.icon}</span>
                  <div>
                    <p className="pd-settle-info__label">{row.label}</p>
                    <p className="pd-settle-info__val">{row.val}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}