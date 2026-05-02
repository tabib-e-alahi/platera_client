import api from "@/lib/axios";

export const initiatePayment = async (orderId: string) => {
  const res = await api.post(`/payments/initiate/${orderId}`);
  return res.data;
};

// Poll payment status
export const getPaymentStatus = async (orderId: string) => {
  const res = await api.get(`/payments/status/${orderId}`);
  return res.data;
};

export const getAdminPayments = async (params?: {
  settlementStatus?: string;
  providerId?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/admins/settlements", { params });
  return res.data;
};

export const settlePayment = async (
  paymentId: string,
  note?: string
) => {
  const res = await api.patch(`/admins/settlements/${paymentId}`, { note });
  return res.data;
};

export const bulkSettleProvider = async (
  providerId: string,
  note?: string
) => {
  const res = await api.patch(
    `/admins/settlements/bulk/${providerId}`,
    { note }
  );
  return res.data;
};