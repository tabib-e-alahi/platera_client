"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllUsers, toggleUserStatus } from "@/services/admin.service";
import "./admin-users.css";

type TUser = {
  id: string; name: string; email: string;
  role: string; status: string; emailVerified: boolean;
  createdAt: string;
  providerProfile?: { id: string; businessName: string; approvalStatus: string } | null;
};

const ROLE_OPTIONS = [
  { label: "All roles", value: "" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Provider", value: "PROVIDER" },
  { label: "Admin", value: "ADMIN" },
];

const STATUS_OPTIONS = [
  { label: "All status", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export default function AdminViewUsersPage() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers({
        page,
        limit,
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(res?.data?.users ?? []);
      setTotal(res?.data?.pagination?.total ?? 0);
      setTotalPages(res?.data?.pagination?.totalPages ?? 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers, search]);

  const handleToggle = async (user: TUser) => {
  const action =
    user.status === "ACTIVE" ? "suspend" : "reactivate";

  toast.warning(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}?`, {
    description: "Please confirm this action.",
    action: {
      label: "Confirm",
      onClick: async () => {
        setBusyId(user.id);

        try {
          await toggleUserStatus(user.id);
          toast.success(`User ${action}d successfully.`);
          fetchUsers();
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message ??
              "Failed to update user status."
          );
        } finally {
          setBusyId(null);
        }
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => {
        toast.info("Action cancelled");
      },
    },
  });
};

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" });

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="ausers">
      <div className="ausers__header">
        <div>
          <p className="ausers__eyebrow">Admin Panel</p>
          <h1 className="ausers__title">All users</h1>
          <p className="ausers__subtitle">View and manage user accounts across the platform.</p>
        </div>
        <div className="ausers__count">
          {total} user{total !== 1 ? "s" : ""}
        </div>
      </div>

      {/* toolbar */}
      <div className="ausers__toolbar">
        <input
          className="ausers__search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="ausers__select"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          className="ausers__select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* table */}
      {isLoading ? (
        <p className="ausers__loading">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="ausers__empty">No users found for this filter.</div>
      ) : (
        <div className="ausers__table-wrap">
          <table className="ausers__table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Email verified</th>
                <th>Joined</th>
                <th>Provider</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="ausers__user-name">{user.name}</span>
                    <span className="ausers__user-email">{user.email}</span>
                  </td>
                  <td>
                    <span className={`ausers__role-badge ausers__role-badge--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`ausers__status-dot ausers__status-dot--${user.status.toLowerCase()}`}>
                      {user.status === "ACTIVE" ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: user.emailVerified ? "#15803D" : "#DC2626", fontWeight: 500 }}>
                    {user.emailVerified ? "✓ Verified" : "✗ Unverified"}
                  </td>
                  <td style={{ fontSize: 12, color: "#94A3B8" }}>{formatDate(user.createdAt)}</td>
                  <td style={{ fontSize: 12, color: "#64748B" }}>
                    {user.providerProfile
                      ? <span title={user.providerProfile.approvalStatus}>{user.providerProfile.businessName}</span>
                      : <span style={{ color: "#CBD5E1" }}>—</span>}
                  </td>
                  <td>
                    {["ADMIN", "SUPER_ADMIN"].includes(user.role) ? (
                      <span style={{ fontSize: 12, color: "#CBD5E1" }}>Protected</span>
                    ) : (
                      <button
                        className={`ausers__toggle-btn ${user.status === "ACTIVE" ? "ausers__toggle-btn--suspend" : "ausers__toggle-btn--activate"}`}
                        disabled={busyId === user.id}
                        onClick={() => handleToggle(user)}
                      >
                        {busyId === user.id ? "…" : user.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination inside table wrap */}
          {totalPages > 1 && (
            <div className="ausers__pagination">
              <span className="ausers__page-info">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </span>
              <div className="ausers__page-btns">
                <button className="ausers__page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>←</button>
                {pages.map((p) => (
                  <button
                    key={p}
                    className={`ausers__page-btn${page === p ? " ausers__page-btn--active" : ""}`}
                    onClick={() => setPage(p)}
                  >{p}</button>
                ))}
                <button className="ausers__page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}