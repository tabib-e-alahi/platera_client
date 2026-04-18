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

export const rejectProvider = async (id: string, payload: { rejectionReason: string }) => {
  const res = await api.patch(`/admins/providers/${id}/reject`, payload);
  return res.data;
};

export const getAllUsers = async (params?: Record<string, string | number>) => {
  const res = await api.get("/admins/users", { params });
  return res.data;
};

export const suspendUser = async (id: string, payload?: { reason?: string }) => {
  const res = await api.patch(`/admins/users/${id}/suspend`, payload ?? {});
  return res.data;
};

export const reactivateUser = async (id: string) => {
  const res = await api.patch(`/admins/users/${id}/reactivate`);
  return res.data;
};

export const getAllOrders = async (params?: Record<string, string | number>) => {
  const res = await api.get("/admins/orders", { params });
  return res.data;
};

export const getAllPayments = async (params?: Record<string, string | number>) => {
  const res = await api.get("/admins/payments", { params });
  return res.data;
};

export const getProviderPayablesSummary = async () => {
  const res = await api.get("/admins/payables/providers");
  return res.data;
};

export const markPaymentAsProviderPaid = async (
  id: string,
  payload?: { note?: string }
) => {
  const res = await api.patch(`/admins/payments/${id}/mark-provider-paid`, payload ?? {});
  return res.data;
};