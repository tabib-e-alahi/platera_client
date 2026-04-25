"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import {
  getAllAdmins,
  createAdminAccount,
  suspendAdminAccount,
  reactivateAdminAccount,
  deleteAdminAccount,
  type TAdminUser,
} from "@/services/admin.service";
import "./admin-admins.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-BD", {
    day: "numeric", month: "short", year: "numeric",
  });

// Password strength: returns 0–4
const strength = (pw: string) => {
  let s = 0;
  if (pw.length >= 8)         s++;
  if (/[A-Z]/.test(pw))       s++;
  if (/[0-9]/.test(pw))       s++;
  if (/[@$!%*?&]/.test(pw))   s++;
  return s;
};
const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

// ─── Create Admin Modal ───────────────────────────────────────────────────────

type TCreateForm = { name: string; email: string; password: string };
type TCreateErrors = Partial<TCreateForm>;

function CreateAdminModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (admin: TAdminUser) => void;
}) {
  const [form, setForm]       = useState<TCreateForm>({ name: "", email: "", password: "" });
  const [errors, setErrors]   = useState<TCreateErrors>({});
  const [showPw, setShowPw]   = useState(false);
  const [busy, setBusy]       = useState(false);

  const pw_strength = strength(form.password);

  const validate = (): boolean => {
    const e: TCreateErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.password || form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.password))
      e.password = "Must include uppercase, lowercase, number and special character (@$!%*?&).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const res = await createAdminAccount({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success(`Admin account created for ${form.name}.`);
      onCreated(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to create admin.");
    } finally {
      setBusy(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof TCreateErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div
      className="aadmins__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="aadmins__modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="aadmins__modal-head">
          <h2 className="aadmins__modal-title" id="modal-title">Create admin account</h2>
          <button className="aadmins__modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="aadmins__modal-body">
          {/* Name */}
          <div className="aadmins__field">
            <label className="aadmins__label">
              Full name <span className="aadmins__req">*</span>
            </label>
            <input
              className="aadmins__input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Nadia Rahman"
              autoFocus
            />
            {errors.name && <p className="aadmins__field-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="aadmins__field">
            <label className="aadmins__label">
              Email address <span className="aadmins__req">*</span>
            </label>
            <input
              className="aadmins__input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@platera.com.bd"
            />
            {errors.email && <p className="aadmins__field-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="aadmins__field">
            <label className="aadmins__label">
              Password <span className="aadmins__req">*</span>
            </label>
            <div className="aadmins__pw-wrap">
              <input
                className="aadmins__input aadmins__input--pw"
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 8 chars, uppercase, number, symbol"
              />
              <button
                type="button"
                className="aadmins__pw-toggle"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#E2E8F0", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(pw_strength / 4) * 100}%`,
                      background: STRENGTH_COLORS[pw_strength],
                      borderRadius: 2,
                      transition: "width 0.2s, background 0.2s",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11.5, color: STRENGTH_COLORS[pw_strength], fontWeight: 600, whiteSpace: "nowrap" }}>
                  {STRENGTH_LABELS[pw_strength]}
                </span>
              </div>
            )}
            {errors.password && <p className="aadmins__field-error">{errors.password}</p>}
            <p className="aadmins__hint">
              The new admin will use these credentials to log in. Share securely.
            </p>
          </div>
        </div>

        <div className="aadmins__modal-foot">
          <button className="aadmins__modal-cancel" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className="aadmins__modal-submit"
            onClick={handleSubmit}
            disabled={busy}
          >
            {busy ? (
              <>
                <span style={{ width: 14, height: 14, border: "2px solid #ffffff44", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Creating…
              </>
            ) : (
              <>+ Create admin</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAdminsPage() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const [admins, setAdmins]     = useState<TAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId]     = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllAdmins();
      setAdmins(res?.data ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load admin accounts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  // Local search filter (list is small — no need for server-side search)
  const filtered = useMemo(() => {
    if (!search.trim()) return admins;
    const q = search.toLowerCase();
    return admins.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  }, [admins, search]);

  // Stats
  const stats = useMemo(() => ({
    total:     admins.length,
    superAdmins: admins.filter((a) => a.role === "SUPER_ADMIN").length,
    active:    admins.filter((a) => a.status === "ACTIVE").length,
    suspended: admins.filter((a) => a.status === "SUSPENDED").length,
  }), [admins]);

  // ── Actions ──

  const handleSuspend = async (admin: TAdminUser) => {
    toast.warning(`Suspend ${admin.name}?`, {
      description: "They will be logged out immediately and unable to log in until reactivated.",
      action: {
        label: "Suspend",
        onClick: async () => {
          setBusyId(admin.id);
          try {
            await suspendAdminAccount(admin.id);
            toast.success(`${admin.name} has been suspended.`);
            setAdmins((prev) => prev.map((a) => a.id === admin.id ? { ...a, status: "SUSPENDED" } : a));
          } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to suspend admin.");
          } finally {
            setBusyId(null);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleReactivate = async (admin: TAdminUser) => {
    setBusyId(admin.id);
    try {
      await reactivateAdminAccount(admin.id);
      toast.success(`${admin.name} has been reactivated.`);
      setAdmins((prev) => prev.map((a) => a.id === admin.id ? { ...a, status: "ACTIVE" } : a));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to reactivate admin.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (admin: TAdminUser) => {
    toast.error(`Permanently remove ${admin.name}?`, {
      description: "This will delete their account and revoke all access. This cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          setBusyId(admin.id);
          try {
            await deleteAdminAccount(admin.id);
            toast.success(`${admin.name}'s account has been deleted.`);
            setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
          } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to delete admin.");
          } finally {
            setBusyId(null);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleCreated = (newAdmin: TAdminUser) => {
    setAdmins((prev) => [...prev, newAdmin]);
  };

  // ── Render ──

  return (
    <div className="aadmins">
      {/* Header */}
      <div className="aadmins__header">
        <div>
          <p className="aadmins__eyebrow">Super Admin Panel</p>
          <h1 className="aadmins__title">Manage Admins</h1>
          <p className="aadmins__subtitle">
            View, create, suspend and remove admin accounts across the platform.
          </p>
        </div>
        <div className="aadmins__header-right">
          <span className="aadmins__count">{stats.total} admin{stats.total !== 1 ? "s" : ""}</span>
          {isSuperAdmin && (
            <button
              className="aadmins__create-btn"
              onClick={() => setShowCreate(true)}
            >
              + New admin
            </button>
          )}
        </div>
      </div>

      {/* Super-admin-only guard notice for regular admins */}
      {!isSuperAdmin && (
        <div className="aadmins__guard-notice">
          🔒 <span>You have <strong>read-only</strong> access. Only a Super Admin can create, suspend or delete admin accounts.</span>
        </div>
      )}

      {/* Stats strip */}
      <div className="aadmins__stats">
        <div className="aadmins__stat aadmins__stat--super">
          <span className="aadmins__stat-value">{stats.superAdmins}</span>
          <span className="aadmins__stat-label">Super admins</span>
        </div>
        <div className="aadmins__stat">
          <span className="aadmins__stat-value">{stats.total - stats.superAdmins}</span>
          <span className="aadmins__stat-label">Admins</span>
        </div>
        <div className="aadmins__stat aadmins__stat--active">
          <span className="aadmins__stat-value">{stats.active}</span>
          <span className="aadmins__stat-label">Active</span>
        </div>
        <div className="aadmins__stat aadmins__stat--suspended">
          <span className="aadmins__stat-value">{stats.suspended}</span>
          <span className="aadmins__stat-label">Suspended</span>
        </div>
      </div>

      {/* Search */}
      <div className="aadmins__toolbar">
        <input
          className="aadmins__search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="aadmins__loading">Loading admin accounts…</p>
      ) : filtered.length === 0 ? (
        <div className="aadmins__empty">
          {search ? `No admins match "${search}"` : "No admin accounts found."}
        </div>
      ) : (
        <div className="aadmins__table-wrap">
          <table className="aadmins__table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Created</th>
                {isSuperAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((admin) => {
                const isMe      = admin.id === currentUser?.id;
                const isSA      = admin.role === "SUPER_ADMIN";
                const isBusy    = busyId === admin.id;
                const canAct    = isSuperAdmin && !isMe && !isSA;

                return (
                  <tr key={admin.id}>
                    {/* Account */}
                    <td>
                      <span className="aadmins__name">
                        {admin.name}
                        {isMe && (
                          <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 400, marginLeft: 6 }}>
                            (you)
                          </span>
                        )}
                      </span>
                      <span className="aadmins__email">{admin.email}</span>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`aadmins__role aadmins__role--${admin.role.toLowerCase()}`}>
                        {admin.role === "SUPER_ADMIN" ? "⭐ Super Admin" : "🛡 Admin"}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`aadmins__status aadmins__status--${admin.status.toLowerCase()}`}>
                        {admin.status === "ACTIVE" ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Email verified */}
                    <td>
                      <span className={`aadmins__verified aadmins__verified--${admin.emailVerified ? "yes" : "no"}`}>
                        {admin.emailVerified ? "✓ Verified" : "✗ Unverified"}
                      </span>
                    </td>

                    {/* Created date */}
                    <td style={{ fontSize: 12, color: "#94A3B8" }}>
                      {fmt(admin.createdAt)}
                    </td>

                    {/* Actions — super admin only */}
                    {isSuperAdmin && (
                      <td>
                        {isMe ? (
                          <span className="aadmins__protected">Your account</span>
                        ) : isSA ? (
                          <span className="aadmins__protected">Protected</span>
                        ) : (
                          <div className="aadmins__actions">
                            {/* Suspend / Reactivate */}
                            {admin.status === "ACTIVE" ? (
                              <button
                                className="aadmins__btn aadmins__btn--suspend"
                                disabled={isBusy}
                                onClick={() => handleSuspend(admin)}
                                title="Suspend this admin"
                              >
                                {isBusy ? "…" : "Suspend"}
                              </button>
                            ) : (
                              <button
                                className="aadmins__btn aadmins__btn--activate"
                                disabled={isBusy}
                                onClick={() => handleReactivate(admin)}
                                title="Reactivate this admin"
                              >
                                {isBusy ? "…" : "Reactivate"}
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              className="aadmins__btn aadmins__btn--delete"
                              disabled={isBusy}
                              onClick={() => handleDelete(admin)}
                              title="Permanently delete this admin"
                            >
                              🗑
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create admin modal */}
      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}