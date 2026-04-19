import api from "@/lib/axios";

export const getAdminDashboardStats = async () => {
  const res = await api.get("/admins/dashboard");
  return res.data;
};

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