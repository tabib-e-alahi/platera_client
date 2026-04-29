"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/services/admin.service";
import { toast } from "sonner";
import Link from "next/link";
import "./admin-dashboard.css";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1_000_000 ? `৳${(n / 1_000_000).toFixed(2)}M`
  : n >= 1_000 ? `৳${(n / 1_000).toFixed(1)}K`
  : `৳${n.toFixed(0)}`;

const pct = (part: number, total: number) =>
  total === 0 ? "0.0" : ((part / total) * 100).toFixed(1);

const C = {
  gold:   "hsl(38 70% 52%)",
  green:  "#22c55e",
  red:    "#ef4444",
  blue:   "#3b82f6",
  purple: "#a855f7",
  teal:   "#14b8a6",
  orange: "#f97316",
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="adash-tooltip">
      <p className="adash-tooltip__label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="adash-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <strong>{p.name?.toLowerCase().includes("order") ? p.value : fmt(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

function Skeleton() {
  return (
    <div className="adash-page">
      <div className="adash-skel__header" />
      <div className="adash-skel__grid4">
        {[1,2,3,4].map(i => <div key={i} className="adash-skel__card" />)}
      </div>
      <div className="adash-skel__grid4">
        {[1,2,3,4].map(i => <div key={i} className="adash-skel__card" />)}
      </div>
      <div className="adash-skel__chart-row">
        <div className="adash-skel__chart" />
        <div className="adash-skel__chart" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminDashboardStats();
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
      <div className="adash-empty">
        <span>📊</span>
        <p>Dashboard data unavailable.</p>
      </div>
    );

  const { users, providers, orders, revenue, monthlyRevenue = [], userGrowth = [] } = stats;

  // growth indicator
  const lastMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const revenueGrowth =
    prevMonth && prevMonth.gross > 0
      ? (((lastMonth?.gross ?? 0) - prevMonth.gross) / prevMonth.gross) * 100
      : null;

  const ordersPie = [
    { name: "Delivered", value: orders.delivered, color: C.green },
    { name: "Active",    value: orders.active,    color: C.blue },
    { name: "Cancelled", value: orders.cancelled, color: C.red },
    { name: "Placed",    value: orders.placed,    color: C.gold },
  ].filter(d => d.value > 0);

  const providersPie = [
    { name: "Approved", value: providers.approved, color: C.green },
    { name: "Pending",  value: providers.pending,  color: C.gold },
    { name: "Rejected", value: providers.rejected, color: C.red },
  ].filter(d => d.value > 0);

  const settlementPie = [
    { name: "Paid to Providers",   value: revenue.paidToProviders,   color: C.green },
    { name: "Unpaid to Providers", value: revenue.unpaidToProviders, color: C.gold },
    { name: "Platform Fee",        value: revenue.platformFee,       color: C.blue },
  ].filter(d => d.value > 0);

  return (
    <div className="adash-page">
<<<<<<< HEAD
=======

      {/* ── Header ── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      <div className="adash-header">
        <div>
          <p className="adash-eyebrow">Admin Panel</p>
          <h1 className="adash-title">Dashboard</h1>
          <p className="adash-subtitle">Platform-wide metrics, revenue analytics &amp; operational overview</p>
        </div>
        {revenueGrowth !== null && (
          <div className={`adash-growth-badge ${revenueGrowth >= 0 ? "adash-growth-badge--up" : "adash-growth-badge--down"}`}>
            <span>{revenueGrowth >= 0 ? "↑" : "↓"}</span>
            <div>
              <p className="adash-growth-badge__pct">{Math.abs(revenueGrowth).toFixed(1)}%</p>
              <p className="adash-growth-badge__label">revenue vs last month</p>
            </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
=======
      {/* ── Revenue KPIs ── */}
>>>>>>> dc5656236feee959b1e0e891718009336b905842
      <section className="adash-section">
        <h2 className="adash-section__title">Platform Revenue</h2>
        <div className="adash-kpi-grid">
          {[
            { label: "Gross Revenue",      value: fmt(revenue.gross),            sub: "Total customer payments",      icon: "💰", accent: "gold"   },
            { label: "Platform Fee (25%)", value: fmt(revenue.platformFee),      sub: "Platera commission earned",    icon: "🏛️", accent: "blue"   },
            { label: "Provider Share",     value: fmt(revenue.providerShare),    sub: "Total owed to providers",      icon: "🤝", accent: "purple" },
            { label: "Unpaid to Provider", value: fmt(revenue.unpaidToProviders),sub: "Pending settlement",           icon: "⏳", accent: "amber"  },
          ].map(k => (
            <div key={k.label} className={`adash-kpi adash-kpi--${k.accent}`}>
              <div className={`adash-kpi__icon adash-kpi__icon--${k.accent}`}>{k.icon}</div>
              <div className="adash-kpi__body">
                <span className="adash-kpi__label">{k.label}</span>
                <span className="adash-kpi__value">{k.value}</span>
                <span className="adash-kpi__sub">{k.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Settlement row ── */}
      <section className="adash-section">
        <div className="adash-settle-row">
          <div className="adash-settle-card adash-settle-card--paid">
            <span className="adash-settle-card__icon">✅</span>
            <div>
              <p className="adash-settle-card__label">Total Paid to Providers</p>
              <p className="adash-settle-card__value">{fmt(revenue.paidToProviders)}</p>
            </div>
          </div>
          <div className="adash-settle-card adash-settle-card--unpaid">
            <span className="adash-settle-card__icon">⚠️</span>
            <div>
              <p className="adash-settle-card__label">Unpaid to Providers</p>
              <p className="adash-settle-card__value">{fmt(revenue.unpaidToProviders)}</p>
            </div>
            <Link href="/admin-dashboard/settlements" className="adash-settle-card__action">
              Settle now →
            </Link>
          </div>
          <div className="adash-settle-card adash-settle-card--fee">
            <span className="adash-settle-card__icon">🏛️</span>
            <div>
              <p className="adash-settle-card__label">Net Platform Revenue</p>
              <p className="adash-settle-card__value">{fmt(revenue.platformFee)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── User & Order stats ── */}
      <section className="adash-section">
        <h2 className="adash-section__title">Users &amp; Orders</h2>
        <div className="adash-stat-row">
          {/* Users */}
          {[
            { label: "Total Users",     value: users.total,     icon: "👥", color: "",       href: "/admin-dashboard/view-users" },
            { label: "Customers",       value: users.customers, icon: "🛒", color: "blue",   href: "/admin-dashboard/view-users" },
            { label: "Providers",       value: users.providers, icon: "🏪", color: "green",  href: "/admin-dashboard/providers" },
            { label: "Suspended",       value: users.suspended, icon: "🚫", color: "red",    href: "/admin-dashboard/view-users" },
          ].map(s => (
            <Link key={s.label} href={s.href} className={`adash-stat adash-stat--${s.color}`}>
              <div className={`adash-stat__icon adash-stat__icon--${s.color}`}>{s.icon}</div>
              <div className="adash-stat__body">
                <span className="adash-stat__label">{s.label}</span>
                <span className="adash-stat__value">{s.value}</span>
              </div>
              <span className="adash-stat__arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="adash-stat-row" style={{ marginTop: 12 }}>
          {/* Orders */}
          {[
            { label: "Total Orders", value: orders.total,     icon: "📦", color: "",        href: "/admin-dashboard/view-orders" },
            { label: "Placed",       value: orders.placed,    icon: "🛒", color: "blue",    href: "/admin-dashboard/view-orders" },
            { label: "Active",       value: orders.active,    icon: "🔥", color: "purple",  href: "/admin-dashboard/view-orders" },
            { label: "Delivered",    value: orders.delivered, icon: "✅", color: "green",   href: "/admin-dashboard/view-orders" },
            { label: "Cancelled",    value: orders.cancelled, icon: "❌", color: "red",     href: "/admin-dashboard/view-orders" },
          ].map(s => (
            <Link key={s.label} href={s.href} className={`adash-stat adash-stat--${s.color}`} style={{ flex: 1 }}>
              <div className={`adash-stat__icon adash-stat__icon--${s.color}`}>{s.icon}</div>
              <div className="adash-stat__body">
                <span className="adash-stat__label">{s.label}</span>
                <span className="adash-stat__value">{s.value}</span>
              </div>
              <span className="adash-stat__arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Provider approval stats ── */}
      <section className="adash-section">
        <h2 className="adash-section__title">Provider Status</h2>
        <div className="adash-provider-row">
          {[
            { label: "Approved",  value: providers.approved, icon: "✅", color: "green",  href: "/admin-dashboard/providers" },
            { label: "Pending",   value: providers.pending,  icon: "⏳", color: "amber",  href: "/admin-dashboard/provider-request" },
            { label: "Rejected",  value: providers.rejected, icon: "❌", color: "red",    href: "/admin-dashboard/providers" },
          ].map(p => (
            <Link key={p.label} href={p.href} className={`adash-prov-card adash-prov-card--${p.color}`}>
              <span className="adash-prov-card__icon">{p.icon}</span>
              <div>
                <p className="adash-prov-card__value">{p.value}</p>
                <p className="adash-prov-card__label">{p.label}</p>
              </div>
              <span className="adash-prov-card__pct">
                {pct(p.value, providers.approved + providers.pending + providers.rejected)}%
              </span>
            </Link>
          ))}
          {providers.pending > 0 && (
            <Link href="/admin-dashboard/provider-request" className="adash-prov-alert">
              <span>🔔</span>
              <p>{providers.pending} provider{providers.pending > 1 ? "s" : ""} awaiting review</p>
              <span className="adash-prov-alert__arrow">→</span>
            </Link>
          )}
        </div>
      </section>

      {/* ── Charts — Revenue & User Growth ── */}
      <section className="adash-section">
        <h2 className="adash-section__title">Monthly Analytics</h2>
        <div className="adash-charts-row">

          {/* Revenue BarChart */}
          <div className="adash-chart-card adash-chart-card--wide">
            <div className="adash-chart-card__header">
              <div>
                <h3 className="adash-chart-title">Monthly Revenue Breakdown</h3>
                <p className="adash-chart-sub">Last 6 months — gross, platform fee &amp; provider share</p>
              </div>
            </div>
            {monthlyRevenue.length === 0
              ? <div className="adash-chart-empty">No revenue data yet</div>
              : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyRevenue} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={3} barCategoryGap="26%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                    <Bar dataKey="gross" name="Gross Revenue"   fill={C.blue}   radius={[4,4,0,0]} />
                    <Bar dataKey="fee"   name="Platform Fee"    fill={C.gold}   radius={[4,4,0,0]} />
                    <Bar dataKey="net"   name="Provider Share"  fill={C.green}  radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </div>

          {/* Order Pie */}
          <div className="adash-chart-card">
            <h3 className="adash-chart-title">Order Distribution</h3>
            <p className="adash-chart-sub">All-time breakdown by status</p>
            {ordersPie.length === 0
              ? <div className="adash-chart-empty">No orders yet</div>
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={ordersPie} cx="50%" cy="50%"
                      innerRadius={52} outerRadius={82}
                      dataKey="value" nameKey="name"
                      paddingAngle={3} strokeWidth={0}>
                      {ordersPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v} orders`]} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
            <div className="adash-rate-row">
              <div className="adash-rate">
                <span className="adash-rate__pct" style={{ color: C.green }}>{pct(orders.delivered, orders.total)}%</span>
                <span className="adash-rate__label">Delivery rate</span>
              </div>
              <div className="adash-rate__divider" />
              <div className="adash-rate">
                <span className="adash-rate__pct" style={{ color: C.red }}>{pct(orders.cancelled, orders.total)}%</span>
                <span className="adash-rate__label">Cancel rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Revenue trend + User growth ── */}
      <section className="adash-section">
        <div className="adash-charts-row">

          {/* Revenue line trend */}
          <div className="adash-chart-card adash-chart-card--wide">
            <div className="adash-chart-card__header">
              <div>
                <h3 className="adash-chart-title">Revenue Growth Trend</h3>
                <p className="adash-chart-sub">Month-over-month platform revenue</p>
              </div>
              {revenueGrowth !== null && (
                <span className={`adash-inline-badge ${revenueGrowth >= 0 ? "adash-inline-badge--green" : "adash-inline-badge--red"}`}>
                  {revenueGrowth >= 0 ? "↑" : "↓"} {Math.abs(revenueGrowth).toFixed(1)}% MoM
                </span>
              )}
            </div>
            {monthlyRevenue.length === 0
              ? <div className="adash-chart-empty">No data yet</div>
              : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyRevenue} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.15} />
                        <stop offset="95%" stopColor={C.blue}  stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.gold}  stopOpacity={0.15} />
                        <stop offset="95%" stopColor={C.gold}  stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                    <Area type="monotone" dataKey="gross" name="Gross Revenue"  stroke={C.blue}  strokeWidth={2} fill="url(#grossGrad)" dot={{ r: 3, fill: C.blue, strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="fee"   name="Platform Fee"   stroke={C.gold}  strokeWidth={2} fill="url(#feeGrad)"  dot={{ r: 3, fill: C.gold, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )
            }
          </div>

          {/* Settlement Pie */}
          <div className="adash-chart-card">
            <h3 className="adash-chart-title">Revenue Split</h3>
            <p className="adash-chart-sub">Platform fee vs provider payments</p>
            {settlementPie.length === 0
              ? <div className="adash-chart-empty">No payment data</div>
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={settlementPie} cx="50%" cy="50%"
                      outerRadius={80} dataKey="value" nameKey="name"
                      paddingAngle={3} strokeWidth={0}>
                      {settlementPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => fmt(Number(v))} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
            <div className="adash-rate-row">
              <div className="adash-rate">
                <span className="adash-rate__pct" style={{ color: C.blue }}>{pct(revenue.platformFee, revenue.gross)}%</span>
                <span className="adash-rate__label">Fee rate</span>
              </div>
              <div className="adash-rate__divider" />
              <div className="adash-rate">
                <span className="adash-rate__pct" style={{ color: C.green }}>{pct(revenue.paidToProviders, revenue.providerShare)}%</span>
                <span className="adash-rate__label">Settlement rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── User Growth ── */}
      {userGrowth.length > 0 && (
        <section className="adash-section">
          <div className="adash-chart-card adash-chart-card--full">
            <div className="adash-chart-card__header">
              <div>
                <h3 className="adash-chart-title">User Growth</h3>
                <p className="adash-chart-sub">New customers &amp; providers per month (last 6 months)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                <Line type="monotone" dataKey="customers" name="Customers" stroke={C.blue}  strokeWidth={2.5} dot={{ r: 4, fill: C.blue,  strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="providers" name="Providers" stroke={C.gold}  strokeWidth={2.5} dot={{ r: 4, fill: C.gold,  strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ── Provider Pie ── */}
      <section className="adash-section">
        <div className="adash-bottom-row">
          <div className="adash-chart-card">
            <h3 className="adash-chart-title">Provider Approval Status</h3>
            <p className="adash-chart-sub">All-time provider approval breakdown</p>
            {providersPie.length === 0
              ? <div className="adash-chart-empty">No providers yet</div>
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={providersPie} cx="50%" cy="50%"
                      innerRadius={50} outerRadius={78}
                      dataKey="value" nameKey="name" paddingAngle={3} strokeWidth={0}>
                      {providersPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v} providers`]} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12, color: "#64748b" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
          </div>

          {/* Quick actions */}
          <div className="adash-quick-grid">
            {[
              { icon: "📋", name: "Review Requests",    desc: "Approve or reject pending provider applications", href: "/admin-dashboard/provider-request", badge: providers.pending > 0 ? providers.pending : null },
              { icon: "🏪", name: "Manage Providers",   desc: "Update approval and account status",              href: "/admin-dashboard/providers",         badge: null },
              { icon: "📦", name: "View Orders",        desc: "Monitor all orders across the platform",          href: "/admin-dashboard/view-orders",        badge: orders.active > 0 ? orders.active : null },
              { icon: "💸", name: "Settlements",        desc: "Pay pending provider earnings",                   href: "/admin-dashboard/settlements",        badge: null },
              { icon: "👥", name: "Manage Users",       desc: "View and manage customers and providers",         href: "/admin-dashboard/view-users",         badge: users.suspended > 0 ? users.suspended : null },
              { icon: "🍽️", name: "Categories",         desc: "Manage meal categories",                          href: "/admin-dashboard/manage-categories",  badge: null },
            ].map(q => (
              <Link key={q.name} href={q.href} className="adash-quick-card">
                <div className="adash-quick-card__icon-wrap">
                  <span className="adash-quick-card__icon">{q.icon}</span>
                  {q.badge && <span className="adash-quick-card__badge">{q.badge}</span>}
                </div>
                <div>
                  <p className="adash-quick-card__name">{q.name}</p>
                  <p className="adash-quick-card__desc">{q.desc}</p>
                </div>
                <span className="adash-quick-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}