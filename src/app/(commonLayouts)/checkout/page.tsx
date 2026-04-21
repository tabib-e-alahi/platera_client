"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMyCart } from "@/services/cart.service";
import { getMyCustomerProfile } from "@/services/customer.service";
import {
  createOrder,
  getCheckoutPreview,
  TCheckoutPayload,
} from "@/services/order.service";
import { initiatePayment } from "@/services/payment.service";

type TCart = {
  id: string;
  subtotal: string | number;
  deliveryFee: string | number;
  discountAmount: string | number;
  totalAmount: string | number;
  provider: {
    id: string;
    businessName: string;
    city: string;
    imageURL?: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    totalPrice: string | number;
    meal: {
      id: string;
      name: string;
      mainImageURL: string;
    };
  }>;
};

type TCustomerProfile = {
  phone?: string | null;
  city: string;
  streetAddress: string;
  houseNumber?: string | null;
  apartment?: string | null;
  postalCode?: string | null;
  user?: {
    name?: string;
  };
};

const toNumber = (value: string | number | null | undefined) =>
  Number(value ?? 0);

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<TCart | null>(null);
  const [profile, setProfile] = useState<TCustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryStreetAddress: "",
    deliveryHouseNumber: "",
    deliveryApartment: "",
    deliveryPostalCode: "",
    deliveryNote: "",
    paymentMethod: "ONLINE" as "ONLINE" | "COD",
  });

  const summary = useMemo(() => {
    return {
      subtotal: toNumber(cart?.subtotal),
      deliveryFee: toNumber(cart?.deliveryFee),
      discountAmount: toNumber(cart?.discountAmount),
      totalAmount: toNumber(cart?.totalAmount),
    };
  }, [cart]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setLoading(true);

      const [cartRes, profileRes] = await Promise.all([
        getMyCart(),
        getMyCustomerProfile(),
      ]);



      const cartData = cartRes?.data ?? null;
      const profileData = profileRes?.data ?? null;

      if (!profileData) {
        toast.error("Please complete your customer profile first.");
        router.push("/customer-dashboard/profile");
        return;
      }

      if (!cartData || !cartData.cartItems?.length) {
        toast.error("Your cart is empty.");
        router.push("/cart");
        return;
      }

      setCart(cartData);
      setProfile(profileData);

      setForm((prev) => ({
        ...prev,
        customerName: profileData?.user?.name ?? "",
        customerPhone: profileData?.phone ?? "",
        deliveryStreetAddress: profileData?.streetAddress ?? "",
        deliveryHouseNumber: profileData?.houseNumber ?? "",
        deliveryApartment: profileData?.apartment ?? "",
        deliveryPostalCode: profileData?.postalCode ?? "",
      }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load checkout.");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildCheckoutPayload = (): TCheckoutPayload => ({
    customerName: form.customerName.trim(),
    customerPhone: form.customerPhone.trim(),
    deliveryStreetAddress: form.deliveryStreetAddress.trim(),
    deliveryHouseNumber: form.deliveryHouseNumber.trim() || undefined,
    deliveryApartment: form.deliveryApartment.trim() || undefined,
    deliveryPostalCode: form.deliveryPostalCode.trim() || undefined,
    deliveryNote: form.deliveryNote.trim() || undefined,
  });

  const validateForm = () => {
    if (!form.customerName.trim()) {
      toast.error("Customer name is required.");
      return false;
    }
    if (!form.customerPhone.trim()) {
      toast.error("Phone number is required.");
      return false;
    }
    if (!form.deliveryStreetAddress.trim()) {
      toast.error("Street address is required.");
      return false;
    }
    return true;
  };

  const handlePreviewRefresh = async () => {
    if (!validateForm()) return;

    try {
      setPreviewLoading(true);
      const payload = buildCheckoutPayload();
      const res = await getCheckoutPreview(payload);

      if (res?.success) {
        toast.success("Checkout preview updated.");
      } else {
        toast.error(res?.message ?? "Failed to refresh preview.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to refresh preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        ...buildCheckoutPayload(),
        paymentMethod: form.paymentMethod,
      };

      const res = await createOrder(payload);

      if (!res?.success) {
        toast.error(res?.message ?? "Failed to create order.");
        return;
      }

      toast.success("Order created successfully.");

      const order = res.data;

      if (form.paymentMethod === "ONLINE") {
        const res = await initiatePayment(order.id);
        console.log("From checkout page condition ONLINE line 207:", res);
console.log(res);
        if (res?.success) {
          window.location.href = res.data.data.gatewayURL;
        }
        return;
      }

      router.push("/customer-dashboard/orders");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!cart || !profile) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You can update the delivery address, but the district remains fixed to{" "}
          <span className="font-medium text-foreground">{profile.city}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Provider</h2>
            <p className="mt-2 text-sm">
              <span className="font-medium">{cart.provider.businessName}</span> ·{" "}
              {cart.provider.city}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Delivery Information</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Customer Name</label>
                <input
                  value={form.customerName}
                  onChange={(e) => setField("customerName", e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input
                  value={form.customerPhone}
                  onChange={(e) => setField("customerPhone", e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">District</label>
                <input
                  value={profile.city}
                  disabled
                  className="w-full rounded-xl border bg-muted px-4 py-3 text-muted-foreground"
                />
              </div>

              <div />

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Street Address</label>
                <textarea
                  rows={4}
                  value={form.deliveryStreetAddress}
                  onChange={(e) => setField("deliveryStreetAddress", e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">House Number</label>
                <input
                  value={form.deliveryHouseNumber}
                  onChange={(e) => setField("deliveryHouseNumber", e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Apartment</label>
                <input
                  value={form.deliveryApartment}
                  onChange={(e) => setField("deliveryApartment", e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Postal Code</label>
                <input
                  value={form.deliveryPostalCode}
                  onChange={(e) => setField("deliveryPostalCode", e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Delivery Note</label>
                <textarea
                  rows={3}
                  value={form.deliveryNote}
                  onChange={(e) => setField("deliveryNote", e.target.value)}
                  placeholder="Optional instructions"
                  className="w-full rounded-xl border bg-background px-4 py-3"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePreviewRefresh}
              disabled={previewLoading}
              className="mt-4 rounded-xl border px-4 py-2 text-sm font-medium"
            >
              {previewLoading ? "Refreshing..." : "Refresh Preview"}
            </button>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Payment Method</h2>

            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === "ONLINE"}
                  onChange={() => setField("paymentMethod", "ONLINE")}
                />
                <div>
                  <p className="font-medium">Online Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Recommended. You will be redirected to the payment gateway.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => setField("paymentMethod", "COD")}
                />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Optional fallback. Use only if you want COD enabled.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>৳{summary.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>৳{summary.deliveryFee.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>- ৳{summary.discountAmount.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>৳{summary.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting
              ? "Processing..."
              : form.paymentMethod === "ONLINE"
                ? "Place Order & Continue to Payment"
                : "Place Order"}
          </button>
        </aside>
      </div>
    </div>
  );
}