"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAdminSupportMessages,
  updateSupportMessageStatus,
  deleteSupportMessage,
  type TSupportMessage,
  type TSupportMessageStatus,
  type TSupportMessageCategory,
} from "@/services/admin.service";
import "./support-messages.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<TSupportMessageCategory, string> = {
  ORDER:       "Order",
  REFUND:      "Refund",
  PROVIDER:    "Provider",
  ACCOUNT:     "Account",
  PARTNERSHIP: "Partnership",
  OTHER:       "Other",
};

const STATUS_LABELS: Record<TSupportMessageStatus, string> = {
  UNREAD:   "Unread",
  READ:     "Read",
  RESOLVED: "Resolved",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-BD", {
    day: "numeric", month: "short", year: "numeric",
  }) + " · " + d.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="sm-skeleton">
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="sm-skeleton__row" key={i}>
          <div className="sm-skeleton__cell" style={{ width: 140 }} />
          <div className="sm-skeleton__cell" style={{ width: 180, marginLeft: 24 }} />
          <div className="sm-skeleton__cell" style={{ width: 80,  marginLeft: 24 }} />
          <div className="sm-skeleton__cell" style={{ width: 200, marginLeft: 24, flex: 1 }} />
          <div className="sm-skeleton__cell" style={{ width: 70,  marginLeft: 24 }} />
          <div className="sm-skeleton__cell" style={{ width: 90,  marginLeft: 24 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function MessageModal({
  message,
  onClose,
  onUpdated,
  onDeleted,
}: {
  message: TSupportMessage;
  onClose: () => void;
  onUpdated: (updated: TSupportMessage) => void;
  onDeleted: (id: string) => void;
}) {
  const [busy, setBusy]   = useState(false);
  const [note, setNote]   = useState(message.note ?? "");
  const [local, setLocal] = useState<TSupportMessage>(message);

  const changeStatus = async (newStatus: TSupportMessageStatus) => {
    setBusy(true);
    try {
      const res = await updateSupportMessageStatus(local.id, {
        status: newStatus,
        note: note.trim() || undefined,
      });
      const updated: TSupportMessage = { ...local, status: newStatus, note: note.trim() || local.note };
      setLocal(updated);
      onUpdated(updated);
      toast.success(`Marked as ${STATUS_LABELS[newStatus]}.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete message from ${local.name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteSupportMessage(local.id);
      toast.success("Message deleted.");
      onDeleted(local.id);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete message.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sm-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sm-modal" role="dialog" aria-modal="true">

        {/* Head */}
        <div className="sm-modal__head">
          <div className="sm-modal__sender">
            <div className="sm-modal__sender-name">{local.name}</div>
            <div className="sm-modal__sender-meta">
              <span>📧 {local.email}</span>
              <span className={`sm-pill sm-pill--${local.status}`}>
                <span className="sm-pill__dot" />
                {STATUS_LABELS[local.status]}
              </span>
              <span className="sm-cat">{CATEGORY_LABELS[local.category]}</span>
            </div>
          </div>
          <button className="sm-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="sm-modal__body">
          {local.subject && (
            <div className="sm-modal__subject">Re: {local.subject}</div>
          )}
          <div className="sm-modal__message">{local.message}</div>
          <div className="sm-date" style={{ marginTop: 10 }}>
            Received {formatDate(local.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="sm-modal__actions">

          {/* Existing note */}
          {local.note && (
            <div className="sm-modal__existing-note">
              <strong>Admin note:</strong> {local.note}
            </div>
          )}

          {/* Note input */}
          <div className="sm-modal__note-wrap">
            <div className="sm-modal__note-label">Internal note (optional)</div>
            <textarea
              className="sm-modal__note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a private note about this message…"
              maxLength={500}
            />
          </div>

          {/* Status buttons */}
          {local.status !== "RESOLVED" && (
            <button
              className="sm-btn sm-btn--resolve"
              onClick={() => changeStatus("RESOLVED")}
              disabled={busy}
            >
              ✓ Mark resolved
            </button>
          )}
          {local.status === "UNREAD" && (
            <button
              className="sm-btn sm-btn--read"
              onClick={() => changeStatus("READ")}
              disabled={busy}
            >
              Mark as read
            </button>
          )}
          {local.status === "RESOLVED" && (
            <button
              className="sm-btn sm-btn--read"
              onClick={() => changeStatus("READ")}
              disabled={busy}
            >
              Re-open
            </button>
          )}

          {/* Save note only (no status change) */}
          {note.trim() && note.trim() !== (local.note ?? "") && (
            <button
              className="sm-btn sm-btn--read"
              onClick={() => changeStatus(local.status)}
              disabled={busy}
            >
              💾 Save note
            </button>
          )}

          {/* Delete */}
          <button
            className="sm-btn sm-btn--delete"
            onClick={handleDelete}
            disabled={busy}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STATUS_FILTERS: { label: string; value: TSupportMessageStatus | "" }[] = [
  { label: "All",      value: "" },
  { label: "Unread",   value: "UNREAD" },
  { label: "Read",     value: "READ" },
  { label: "Resolved", value: "RESOLVED" },
];

const CATEGORY_FILTERS: { label: string; value: TSupportMessageCategory | "" }[] = [
  { label: "All categories", value: "" },
  { label: "Order",          value: "ORDER" },
  { label: "Refund",         value: "REFUND" },
  { label: "Provider",       value: "PROVIDER" },
  { label: "Account",        value: "ACCOUNT" },
  { label: "Partnership",    value: "PARTNERSHIP" },
  { label: "Other",          value: "OTHER" },
];

export default function AdminSupportMessagesPage() {
  const [messages, setMessages]   = useState<TSupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected]   = useState<TSupportMessage | null>(null);

  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState<TSupportMessageStatus | "">("");
  const [category, setCategory] = useState<TSupportMessageCategory | "">("");
  const [page,     setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,    setTotal]    = useState(0);

  const [counts, setCounts] = useState({ unread: 0, read: 0, resolved: 0 });

  const limit = 20;

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminSupportMessages({
        page,
        limit,
        search:   search || undefined,
        status:   status || undefined,
        category: category || undefined,
      });
      setMessages(res?.data?.messages ?? []);
      setTotal(res?.data?.pagination?.total ?? 0);
      setTotalPages(res?.data?.pagination?.totalPages ?? 1);
      setCounts(res?.data?.counts ?? { unread: 0, read: 0, resolved: 0 });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load support messages.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, category]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(fetchMessages, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchMessages, search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, status, category]);

  const handleUpdated = (updated: TSupportMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    // Refresh counts
    fetchMessages();
  };

  const handleDeleted = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    fetchMessages();
  };

  return (
    <div className="sm-page">

      {/* Header */}
      <div className="sm-page__header">
        <div>
          <p className="sm-page__eyebrow">Admin dashboard</p>
          <h1 className="sm-page__title">Support Messages</h1>
        </div>
      </div>

      {/* Count badges */}
      <div className="sm-counts">
        <button
          className={`sm-count-badge sm-count-badge--all${status === "" ? " sm-count-badge--active" : ""}`}
          onClick={() => setStatus("")}
        >
          All · {counts.unread + counts.read + counts.resolved}
        </button>
        <button
          className={`sm-count-badge sm-count-badge--unread${status === "UNREAD" ? " sm-count-badge--active" : ""}`}
          onClick={() => setStatus("UNREAD")}
        >
          <span className="sm-count-badge__dot" />
          Unread · {counts.unread}
        </button>
        <button
          className={`sm-count-badge sm-count-badge--read${status === "READ" ? " sm-count-badge--active" : ""}`}
          onClick={() => setStatus("READ")}
        >
          <span className="sm-count-badge__dot" />
          Read · {counts.read}
        </button>
        <button
          className={`sm-count-badge sm-count-badge--resolved${status === "RESOLVED" ? " sm-count-badge--active" : ""}`}
          onClick={() => setStatus("RESOLVED")}
        >
          <span className="sm-count-badge__dot" />
          Resolved · {counts.resolved}
        </button>
      </div>

      {/* Toolbar */}
      <div className="sm-toolbar">
        <input
          className="sm-search"
          type="search"
          placeholder="Search by name, email or message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="sm-filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as TSupportMessageCategory | "")}
        >
          {CATEGORY_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="sm-table-wrap">
        {isLoading ? (
          <Skeleton />
        ) : messages.length === 0 ? (
          <div className="sm-empty">
            <span className="sm-empty__icon">💬</span>
            <p className="sm-empty__title">No messages found</p>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <table className="sm-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Category</th>
                <th>Subject / Message</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`sm-row--${msg.status.toLowerCase()}`}
                  onClick={() => setSelected(msg)}
                >
                  <td>
                    <div className="sm-row__name">{msg.name}</div>
                    <div className="sm-row__email">{msg.email}</div>
                  </td>
                  <td>
                    <span className="sm-cat">{CATEGORY_LABELS[msg.category]}</span>
                  </td>
                  <td>
                    <div className="sm-msg-preview">
                      {msg.subject ? <strong>{msg.subject} — </strong> : null}
                      {msg.message}
                    </div>
                  </td>
                  <td>
                    <span className={`sm-pill sm-pill--${msg.status}`}>
                      <span className="sm-pill__dot" />
                      {STATUS_LABELS[msg.status]}
                    </span>
                  </td>
                  <td>
                    <span className="sm-date">
                      {new Date(msg.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="sm-pagination">
            <span>
              {total} message{total !== 1 ? "s" : ""} ·
              Page {page} of {totalPages}
            </span>
            <div className="sm-pagination__btns">
              <button
                className="sm-pagination__btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                ← Prev
              </button>
              <button
                className="sm-pagination__btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <MessageModal
          message={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}