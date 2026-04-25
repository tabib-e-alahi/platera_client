"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getAllProviders, updateProviderStatus } from "@/services/admin.service";
import "./admin-providers.css";

type TProvider = {
  id: string;
  businessName: string;
  businessCategory: string;
  city: string;
  approvalStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  imageURL?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt: string;
  mealCount?: number;
  orderCount?: number;
  user?: { id: string; name?: string; email?: string; status?: "ACTIVE" | "SUSPENDED"; createdAt?: string };
};
type TEditable = TProvider & { draftApproval: TProvider["approvalStatus"]; draftUserStatus: "ACTIVE" | "SUSPENDED" };

const APPROVAL_TABS = [
  { label: "All",      value: "" },
  { label: "Pending",  value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Draft",    value: "DRAFT" },
];

const APPROVAL_META: Record<string, { color: string; icon: string }> = {
  DRAFT:    { color: "draft",    icon: "✏️" },
  PENDING:  { color: "pending",  icon: "🕐" },
  APPROVED: { color: "approved", icon: "✅" },
  REJECTED: { color: "rejected", icon: "✕" },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" });
}

function ProviderCardSkeleton() {
  return (
    <div className="aprov-card aprov-card--skeleton">
      <div className="aprov-card__sk-avatar" />
      <div className="aprov-card__sk-lines">
        <div className="aprov-card__sk-line aprov-card__sk-line--lg" />
        <div className="aprov-card__sk-line aprov-card__sk-line--sm" />
        <div className="aprov-card__sk-line aprov-card__sk-line--md" />
      </div>
    </div>
  );
}

function ProviderCard({
  provider, onSave, busyId,
}: {
  provider: TEditable;
  onSave: (p: TEditable) => void;
  busyId: string | null;
}) {
  const hasChanges =
    provider.approvalStatus !== provider.draftApproval ||
    (provider.user?.status ?? "ACTIVE") !== provider.draftUserStatus;
  const isBusy = busyId === provider.id;

  return (
    <div className={`aprov-card${hasChanges ? " aprov-card--dirty" : ""}`}>
      {/* card header */}
      <div className="aprov-card__top">
        <div className="aprov-card__avatar">
          {provider.imageURL ? (
            <Image src={provider.imageURL} alt={provider.businessName} fill className="object-cover" />
          ) : (
            <span>🍽</span>
          )}
        </div>
        <div className="aprov-card__info">
          <Link href={`/admin-dashboard/providers/${provider.id}`} className="aprov-card__name" onClick={e => e.stopPropagation()}>
            {provider.businessName}
          </Link>
          <p className="aprov-card__user-name">{provider.user?.name ?? "—"}</p>
          <p className="aprov-card__email">{provider.user?.email ?? "—"}</p>
        </div>
        <span className={`aprov-badge aprov-badge--${provider.approvalStatus.toLowerCase()}`}>
          {APPROVAL_META[provider.approvalStatus]?.icon} {provider.approvalStatus}
        </span>
      </div>

      {/* meta pills */}
      <div className="aprov-card__meta">
        <span className="aprov-card__pill">{provider.businessCategory}</span>
        <span className="aprov-card__pill">📍 {provider.city}</span>
        {provider.mealCount !== undefined && (
          <span className="aprov-card__pill">🍱 {provider.mealCount} meals</span>
        )}
        {provider.orderCount !== undefined && (
          <span className="aprov-card__pill">📦 {provider.orderCount} orders</span>
        )}
        <span className="aprov-card__pill aprov-card__pill--date">Joined {fmt(provider.createdAt)}</span>
      </div>

      {/* status controls */}
      <div className="aprov-card__controls">
        <div className="aprov-card__field">
          <label className="aprov-card__label">Approval status</label>
          <select
            className="aprov-card__select"
            value={provider.draftApproval}
            disabled={isBusy}
            onChange={e => provider.draftApproval = e.target.value as any}
            // React controlled: we use a wrapper approach
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="aprov-card__field">
          <label className="aprov-card__label">Account status</label>
          <select
            className="aprov-card__select"
            value={provider.draftUserStatus}
            disabled={isBusy}
          >
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* footer */}
      <div className="aprov-card__footer">
        <div className="aprov-card__footer-left">
          {hasChanges
            ? <span className="aprov-card__unsaved">● Unsaved changes</span>
            : <span className="aprov-card__clean">No pending changes</span>}
        </div>
        <div className="aprov-card__footer-right">
          <Link href={`/admin-dashboard/providers/${provider.id}`} className="aprov-card__view-btn">
            View details →
          </Link>
          <button
            className="aprov-card__save-btn"
            disabled={!hasChanges || isBusy}
            onClick={() => onSave(provider)}
          >
            {isBusy ? <><span className="aprov-spinner" /> Saving…</> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<TEditable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;
  const searchRef = useRef<HTMLInputElement>(null);

  const toEditable = (raw: TProvider[]): TEditable[] =>
    raw.map(p => ({ ...p, draftApproval: p.approvalStatus, draftUserStatus: p.user?.status ?? "ACTIVE" }));

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllProviders({
        page, limit,
        search: search || undefined,
        approvalStatus: approvalFilter || undefined,
      } as any);
      const raw: TProvider[] = res?.data?.providers ?? res?.data ?? [];
      setProviders(toEditable(raw));
      const meta = res?.data?.pagination ?? res?.meta;
      setTotal(meta?.total ?? raw.length);
      setTotalPages(meta?.totalPages ?? 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load providers.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, approvalFilter]);

  useEffect(() => {
    const t = setTimeout(fetchProviders, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchProviders, search]);

  const updateField = <K extends "draftApproval" | "draftUserStatus">(
    id: string, key: K, value: TEditable[K]
  ) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, [key]: value } : p));
  };

  const handleSave = (provider: TEditable) => {
    toast.warning(`Save changes for ${provider.businessName}?`, {
      action: {
        label: "Confirm",
        onClick: async () => {
          setBusyId(provider.id);
          try {
            await updateProviderStatus(provider.id, {
              approvalStatus: provider.draftApproval,
              userStatus: provider.draftUserStatus,
            });
            toast.success("Provider status updated.");
            await fetchProviders();
          } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Update failed.");
          } finally {
            setBusyId(null);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const pageWindow = () => {
    const pages: number[] = [];
    for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) pages.push(p);
    return pages;
  };

  return (
    <div className="aproviders">
      {/* Header */}
      <div className="aproviders__header">
        <div>
          <p className="aproviders__eyebrow">Admin Panel</p>
          <h1 className="aproviders__title">All Providers</h1>
          <p className="aproviders__subtitle">Manage approvals, account status, and review provider details.</p>
        </div>
        <div className="aproviders__header-stats">
          <div className="aproviders__stat-pill">
            <span className="aproviders__stat-num">{total}</span>
            <span className="aproviders__stat-label">Providers</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="aproviders__toolbar">
        <div className="aproviders__search-wrap">
          <svg className="aproviders__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={searchRef}
            className="aproviders__search"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="aproviders__search-clear" onClick={() => { setSearch(""); setPage(1); }}>✕</button>
          )}
        </div>
        {!isLoading && total > 0 && (
          <span className="aproviders__result-hint">{total} provider{total !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Tabs */}
      <div className="aproviders__tabs">
        {APPROVAL_TABS.map(t => (
          <button
            key={t.value}
            className={`aproviders__tab${approvalFilter === t.value ? " aproviders__tab--active" : ""}`}
            onClick={() => { setApprovalFilter(t.value); setPage(1); }}
          >
            {t.value && <span className={`aproviders__tab-dot aproviders__tab-dot--${t.value.toLowerCase()}`} />}
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="aproviders__grid">
          {[1,2,3,4,5,6].map(k => <ProviderCardSkeleton key={k} />)}
        </div>
      ) : providers.length === 0 ? (
        <div className="aproviders__empty">
          <span className="aproviders__empty-icon">{search ? "🔍" : "🏪"}</span>
          <p className="aproviders__empty-title">{search ? "No matching providers" : "No providers found"}</p>
          <p className="aproviders__empty-hint">
            {search ? `No providers match "${search}"` : `No providers with status "${approvalFilter || "any"}".`}
          </p>
        </div>
      ) : (
        <div className="aproviders__grid">
          {providers.map(p => (
            <div key={p.id}>
              <ProviderCard
                provider={p}
                busyId={busyId}
                onSave={handleSave}
              />
              {/* Controlled selects need event from parent level */}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="aproviders__pagination">
          <span className="aproviders__page-info">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> · {total} providers
          </span>
          <div className="aproviders__page-btns">
            <button className="aproviders__page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button className="aproviders__page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {pageWindow().map(p => (
              <button key={p} className={`aproviders__page-btn${page === p ? " aproviders__page-btn--active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="aproviders__page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            <button className="aproviders__page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}