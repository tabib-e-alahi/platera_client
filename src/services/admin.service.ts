// src/services/admin.service.ts — COMPLETE REPLACEMENT

import api from "@/lib/axios";

// ── Dashboard ──────────────────────────────────────────────────────────────────

export const getAdminDashboardStats = async () => {
<<<<<<< HEAD
  const res = await api.get("/admins/dashboard");
  return res.data;
=======
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/dashboard`, {
    method: "GET",
    credentials: "include", // ✅ include cookies
    next: {
      revalidate: 10, // ✅ revalidate every 10 seconds
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return res.json();
>>>>>>> dc5656236feee959b1e0e891718009336b905842
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

<<<<<<< HEAD
export const getAdminOrders = async (params?: {
=======
export const getAdminOrders = async function (params?: {
>>>>>>> dc5656236feee959b1e0e891718009336b905842
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
<<<<<<< HEAD
}) => {
  const res = await api.get("/admins/orders", { params });
  return res.data;
=======
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
>>>>>>> dc5656236feee959b1e0e891718009336b905842
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

<<<<<<< HEAD
export const getAdminCategories = async () => {
  const res = await api.get("/admins/categories");
  return res.data;
=======
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
    return data
  } catch (err) {
    throw err;
  }
>>>>>>> dc5656236feee959b1e0e891718009336b905842
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
<<<<<<< HEAD
};


export type TSupportMessageStatus = "UNREAD" | "READ" | "RESOLVED";
export type TSupportMessageCategory =
  | "ORDER" | "REFUND" | "PROVIDER" | "ACCOUNT" | "PARTNERSHIP" | "OTHER";
 
export type TSupportMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  category: TSupportMessageCategory;
  message: string;
  status: TSupportMessageStatus;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
};
 
export type TSupportMessagesResponse = {
  messages: TSupportMessage[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  counts: { unread: number; read: number; resolved: number };
};
 
/** Public — contact form submission (no auth) */
export const submitContactMessage = async (payload: {
  name: string;
  email: string;
  subject?: string;
  category: string;
  message: string;
}) => {
  const res = await api.post("/support", payload);
  return res.data;
};
 
/** Admin — list messages with filters + pagination */
export const getAdminSupportMessages = async (params?: {
  page?: number;
  limit?: number;
  status?: TSupportMessageStatus;
  category?: TSupportMessageCategory;
  search?: string;
}) => {
  const res = await api.get("/admins/support", { params });
  return res.data as { success: boolean; data: TSupportMessagesResponse };
};
 
/** Admin — fetch a single message (auto-marked READ by backend) */
export const getAdminSupportMessageById = async (id: string) => {
  const res = await api.get(`/admins/support/${id}`);
  return res.data as { success: boolean; data: TSupportMessage };
};
 
/** Admin — update status / attach note */
export const updateSupportMessageStatus = async (
  id: string,
  payload: { status: TSupportMessageStatus; note?: string }
) => {
  const res = await api.patch(`/admins/support/${id}`, payload);
  return res.data;
};
 
/** Admin — delete a message */
export const deleteSupportMessage = async (id: string) => {
  const res = await api.delete(`/admins/support/${id}`);
  return res.data;
};


// ── Admin management (SUPER_ADMIN only) ───────────────────────────────────────

export type TAdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  emailVerified: boolean;
  createdAt: string;
};

/** Fetch all admin and super-admin accounts */
export const getAllAdmins = async () => {
  const res = await api.get("/admins/admins");
  return res.data as { success: boolean; data: TAdminUser[] };
};

/** Create a new ADMIN account */
export const createAdminAccount = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/admins/admins", payload);
  return res.data;
};

/** Suspend an ADMIN account (cannot suspend SUPER_ADMIN) */
export const suspendAdminAccount = async (id: string) => {
  const res = await api.patch(`/admins/admins/${id}/suspend`);
  return res.data;
};

/** Reactivate a suspended ADMIN account */
export const reactivateAdminAccount = async (id: string) => {
  const res = await api.patch(`/admins/admins/${id}/reactivate`);
  return res.data;
};

/** Permanently soft-delete an ADMIN account */
export const deleteAdminAccount = async (id: string) => {
  const res = await api.delete(`/admins/admins/${id}`);
  return res.data;
=======
>>>>>>> dc5656236feee959b1e0e891718009336b905842
};