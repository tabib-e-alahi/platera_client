import { TOrder } from "./typesAndConstants";

export function formatDate(d: string, includeTime = true) {
  return new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  });
}

export function getDeliveryAddress(order: TOrder): string {
  const parts = [
    order.deliveryHouseNumber,
    order.deliveryStreetAddress,
    order.deliveryApartment && `Apt ${order.deliveryApartment}`,
    order.deliveryCity,
  ].filter(Boolean);
  return parts.join(", ") || "—";
}