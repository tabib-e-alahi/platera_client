// src/services/admin.service.ts — COMPLETE REPLACEMENT

import api from "@/lib/axios";

// ── Dashboard ──────────────────────────────────────────────────────────────────

export const getAdminDashboardStats = async () => {
  const res = await api.get("/admins/dashboard");
  return res.data;
};

// ── Provider management ────────────────────────────────────────────────────────

export const getPendingProviders = async (params?: Record<string, string | number>) => {
  const res = await api.get("/admins/providers/pending", { params });
  return res.data;
};

export const getAllProviders = async (params?: Record<string, string | number>) => {
  const res = await api.get("/admins/providers", { params });
  return res.data;
};

export const getProviderDetail = async (id: string) => {
  const res = await api.get(`/admins/providers/${id}`);
  return res.data;
};

export const approveProvider = async (id: string) => {
  const res = await api.patch(`/admins/providers/${id}/approve`);
  return res.data;
};

export const rejectProvider = async (
  id: string,
  payload: { rejectionReason: string }
) => {
  const res = await api.patch(`/admins/providers/${id}/reject`, payload);
  return res.data;
};

export const updateProviderStatus = async (
  id: string,
  payload: {
    approvalStatus?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
    userStatus?: "ACTIVE" | "SUSPENDED";
    rejectionReason?: string;
  }
) => {
  const res = await api.patch(`/admins/providers/${id}/status`, payload);
  return res.data;
};

// ── User management ────────────────────────────────────────────────────────────

export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) => {
  const res = await api.get("/admins/users", { params });
  return res.data;
};

export const getUserDetail = async (id: string) => {
  const res = await api.get(`/admins/users/${id}`);
  return res.data;
};

export const suspendUser = async (id: string, reason?: string) => {
  const res = await api.patch(`/admins/users/${id}/suspend`, { reason });
  return res.data;
};

export const reactivateUser = async (id: string) => {
  const res = await api.patch(`/admins/users/${id}/reactivate`);
  return res.data;
};

// Single toggle: activates if suspended, suspends if active
export const toggleUserStatus = async (userId: string) => {
  const res = await api.patch(`/admins/users/${userId}/toggle-status`);
  return res.data;
};

// ── Orders ─────────────────────────────────────────────────────────────────────

export const getAdminOrders = async function (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/admins/orders`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const res = await fetch(url.toString(), {
      credentials: "include",
      next: {
        revalidate: 120, // ⏱ cache for 120 seconds
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch admin orders");
    }

    const data = await res.json();

    return data
  } catch (err) {
    console.error("getAdminOrders error:", err);
    throw err;
  }
};

export const getAdminOrderDetail = async (id: string) => {
  const res = await api.get(`/admins/orders/${id}`);
  return res.data;
};

// ── Payments / Settlements ─────────────────────────────────────────────────────

export const getAdminPayments = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  providerSettlementStatus?: string;
}) => {
  const res = await api.get("/admins/payments", { params });
  return res.data;
};

export const getAdminPaymentDetail = async (id: string) => {
  const res = await api.get(`/admins/payments/${id}`);
  return res.data;
};

export const getProviderPayablesSummary = async () => {
  const res = await api.get("/admins/payables/providers");
  return res.data;
};

export const settlePayment = async (paymentId: string, note?: string) => {
  const res = await api.patch(
    `/admins/payments/${paymentId}/mark-provider-paid`,
    { note }
  );
  return res.data;
};

export const bulkSettleProvider = async (providerId: string, note?: string) => {
  const res = await api.patch(
    `/admins/settlements/bulk/${providerId}`,
    { note }
  );
  return res.data;
};

// ── Category management ────────────────────────────────────────────────────────

// export const getAdminCategories = async () => {
//   const res = await api.get("/admins/categories");
//   return res.data;
// };

export const getAdminCategories = async function () {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admins/categories`,
      {
        credentials: "include",
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch admin categories");
    }

    const data = await res.json();
    console.log("==============", data);
    return data
  } catch (err) {
    console.error("getAdminCategories error:", err);
    throw err;
  }
};

export const createCategory = async (payload: {
  name: string;
  slug: string;
  imageURL: string;
  displayOrder?: number;
}) => {
  const res = await api.post("/admins/categories", payload);
  return res.data;
};

export const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    imageURL?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) => {
  const res = await api.patch(`/admins/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/admins/categories/${id}`);
  return res.data;
};

export const toggleCategoryStatus = async (id: string) => {
  const res = await api.patch(`/admins/categories/${id}/toggle`);
  return res.data;
};