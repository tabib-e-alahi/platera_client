export type TOrderItem = {
  id: string;
  mealName: string;
  mealImageUrl?: string | null;
  quantity: number;
  unitPrice: string | number;
  totalPrice: string | number;
};

export type TPayment = {
  id: string;
  status: string;
  amount: string | number;
  gatewayName?: string | null;
};

export type TOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  totalAmount: string | number;
  subtotal: string | number;
  deliveryFee: string | number;
  discountAmount: string | number;
  createdAt: string;
  placedAt?: string | null;
  acceptedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  deliveryCity?: string;
  deliveryStreetAddress?: string | null;
  deliveryHouseNumber?: string | null;
  deliveryApartment?: string | null;
  deliveryPostalCode?: string | null;
  deliveryNote?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  provider?: {
    id: string;
    businessName: string;
    imageURL?: string | null;
    city?: string;
  };
  orderItems: TOrderItem[];
  payments: TPayment[];
};


//* ─── Constants ─────────────────────────────────────────────────────────── 

export const n = (v: string | number | null | undefined) => Number(v ?? 0);

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; description: string }
> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    color: "red",
    icon: "💳",
    description: "Awaiting payment confirmation",
  },
  PLACED: {
    label: "Order Placed",
    color: "amber",
    icon: "📋",
    description: "Your order has been placed",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "blue",
    icon: "✅",
    description: "Provider accepted your order",
  },
  PREPARING: {
    label: "Preparing",
    color: "yellow",
    icon: "👨‍🍳",
    description: "Your food is being prepared",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "purple",
    icon: "🛵",
    description: "Your order is on the way",
  },
  DELIVERED: {
    label: "Delivered",
    color: "green",
    icon: "🎉",
    description: "Order delivered successfully",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "slate",
    icon: "✕",
    description: "Order was cancelled",
  },
  REFUNDED: {
    label: "Refunded",
    color: "violet",
    icon: "↩",
    description: "Payment has been refunded",
  },
};

export const FLOW_STEPS = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export const CANCELLABLE_STATUSES = ["PENDING_PAYMENT", "PLACED", "ACCEPTED"];

export const TAB_FILTERS = [
  { label: "All orders", value: "all" },
  { label: "Active", value: "active" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
];

export const ACTIVE_STATUSES = ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"];
