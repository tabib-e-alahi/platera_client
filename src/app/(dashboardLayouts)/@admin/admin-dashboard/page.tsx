"use client";

import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/services/admin.service";
import { toast } from "sonner";
import Link from "next/link";
import "./admin-dashboard.css";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminDashboardStats();
        setStats(res?.data ?? null);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: "👥",
      color: "ad-stat--blue",
    },
    {
      label: "Providers",
      value: stats?.totalProviders ?? 0,
      icon: "🏪",
      color: "ad-stat--green",
    },
    {
      label: "Pending Requests",
      value: stats?.pendingProviders ?? 0,
      icon: "⏳",
      color: "ad-stat--amber",
      href: "/admin-dashboard/provider-request",
    },
    {
      label: "Total Meals",
      value: stats?.totalMeals ?? 0,
      icon: "🍽️",
      color: "ad-stat--wine",
    },
  ];

  return (
    <div className="adash">

      {/* header */}
      <div className="adash__header">
        <p className="adash__eyebrow">Admin Panel</p>
        <h1 className="adash__title">Dashboard</h1>
        <p className="adash__subtitle">
          Overview of platform activity and key metrics.
        </p>
      </div>

      {/* stat cards */}
      {isLoading ? (
        <div className="adash__skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="adash__skeleton-card">
              <div className="adash__skeleton-line adash__skeleton-line--short" />
              <div className="adash__skeleton-line adash__skeleton-line--big" />
            </div>
          ))}
        </div>
      ) : (
        <div className="adash__stat-grid">
          {statCards.map((card) => {
            const Wrapper = card.href ? Link : "div";
            return (
              <Wrapper
                key={card.label}
                href={card.href ?? ""}
                className={`ad-stat ${card.color} ${card.href ? "ad-stat--link" : ""}`}
              >
                <div className="ad-stat__icon">{card.icon}</div>
                <div className="ad-stat__body">
                  <span className="ad-stat__label">{card.label}</span>
                  <span className="ad-stat__value">{card.value}</span>
                </div>
                {card.href && (
                  <span className="ad-stat__arrow">→</span>
                )}
              </Wrapper>
            );
          })}
        </div>
      )}

      {/* quick links */}
      <div className="adash__quick">
        <h2 className="adash__quick-title">Quick actions</h2>
        <div className="adash__quick-grid">
          <Link href="/admin-dashboard/provider-request" className="adash__quick-card">
            <span className="adash__quick-icon">📋</span>
            <div>
              <p className="adash__quick-name">Review requests</p>
              <p className="adash__quick-desc">
                Approve or reject pending provider applications
              </p>
            </div>
            <span className="adash__quick-arrow">→</span>
          </Link>

          <Link href="/admin-dashboard/providers" className="adash__quick-card">
            <span className="adash__quick-icon">🏪</span>
            <div>
              <p className="adash__quick-name">Manage providers</p>
              <p className="adash__quick-desc">
                Update approval and account status
              </p>
            </div>
            <span className="adash__quick-arrow">→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}