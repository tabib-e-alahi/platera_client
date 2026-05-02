"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { getMyCart } from "@/services/cart.service";
import { getMyCustomerProfile } from "@/services/customer.service";
import {
  createOrder,
  getCheckoutPreview,
  TCheckoutPayload,
} from "@/services/order.service";
import { initiatePayment } from "@/services/payment.service";
import "./checkout.css";

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
    meal: { id: string; name: string; mainImageURL: string };
  }>;
};

type TCustomerProfile = {
  phone?: string | null;
  city: string;
  streetAddress: string;
  houseNumber?: string | null;
  apartment?: string | null;
  postalCode?: string | null;
  user?: { name?: string };
};

const toNumber = (v: string | number | null | undefined) => Number(v ?? 0);

// ── Skeleton ──────────────────────────────────────────────────────────────────

function CheckoutSkeleton() {
  return (
    <div className="co">
      <div className="co__skel-hero">
        <div className="co__skel-hero-inner">
          <div className="co__skel co__skel-line-sm" />
          <div className="co__skel co__skel-line-lg" style={{ marginTop: "0.75rem" }} />
          <div className="co__skel co__skel-line-xs" style={{ marginTop: "0.5rem" }} />
        </div>
      </div>

      <div className="co__skel-body">
        {/* left */}
        <div>
          {/* provider */}
          <div className="co__skel-card">
            <div className="co__skel-title-row">
              <div className="co__skel co__skel-icon" />
              <div className="co__skel co__skel-title" />
            </div>
            <div className="co__skel-provider-row">
              <div className="co__skel co__skel-avatar" />
              <div>
                <div className="co__skel co__skel-pname" />
                <div className="co__skel co__skel-pcity" />
              </div>
            </div>
          </div>

          {/* items */}
          <div className="co__skel-card">
            <div className="co__skel-title-row">
              <div className="co__skel co__skel-icon" />
              <div className="co__skel co__skel-title" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem", borderRadius: 12, background: "hsl(var(--muted) / 0.4)" }}>
                  <div className="co__skel" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="co__skel" style={{ width: "60%", height: 13, borderRadius: 4, marginBottom: 6 }} />
                    <div className="co__skel" style={{ width: "30%", height: 10, borderRadius: 4 }} />
                  </div>
                  <div className="co__skel" style={{ width: 60, height: 13, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <div className="co__skel-card">
            <div className="co__skel-title-row">
              <div className="co__skel co__skel-icon" />
              <div className="co__skel co__skel-title" />
            </div>
            <div className="co__skel-form-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="co__skel-field">
                  <div className="co__skel co__skel-label" />
                  <div className="co__skel co__skel-input" />
                </div>
              ))}
              <div className="co__skel-field co__skel-col-2">
                <div className="co__skel co__skel-label" />
                <div className="co__skel co__skel-textarea" />
              </div>
              <div className="co__skel-field co__skel-col-2">
                <div className="co__skel co__skel-label" />
                <div className="co__skel co__skel-textarea" style={{ height: 72 }} />
              </div>
            </div>
          </div>

          {/* payment */}
          <div className="co__skel-card">
            <div className="co__skel-title-row">
              <div className="co__skel co__skel-icon" />
              <div className="co__skel co__skel-title" />
            </div>
            <div className="co__skel-payment-opts">
              <div className="co__skel co__skel-pay-opt" />
              <div className="co__skel co__skel-pay-opt" />
            </div>
          </div>
        </div>

        {/* sidebar */}
        <div>
          <div className="co__skel-card">
            <div className="co__skel-title-row">
              <div className="co__skel co__skel-icon" />
              <div className="co__skel co__skel-title" />
            </div>
            <div className="co__skel-sum-rows">
              {[1, 2, 3].map((i) => (
                <div key={i} className="co__skel-sum-row">
                  <div className="co__skel co__skel-sum-label" />
                  <div className="co__skel co__skel-sum-val" />
                </div>
              ))}
            </div>
            <div className="co__skel co__skel-divider" />
            <div className="co__skel-sum-row" style={{ marginTop: "0.5rem" }}>
              <div className="co__skel co__skel-total-label" />
              <div className="co__skel co__skel-total-val" />
            </div>
            <div className="co__skel co__skel-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart]               = useState<TCart | null>(null);
  const [profile, setProfile]         = useState<TCustomerProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const [form, setFormState] = useState({
    customerName:          "",
    customerPhone:         "",
    deliveryStreetAddress: "",
    deliveryHouseNumber:   "",
    deliveryApartment:     "",
    deliveryPostalCode:    "",
    deliveryNote:          "",
    paymentMethod:         "ONLINE" as "ONLINE" | "COD",
  });

  const summary = useMemo(() => ({
    subtotal:       toNumber(cart?.subtotal),
    deliveryFee:    toNumber(cart?.deliveryFee),
    discountAmount: toNumber(cart?.discountAmount),
    totalAmount:    toNumber(cart?.totalAmount),
  }), [cart]);

  useEffect(() => { initialize(); }, []);

  const initialize = async () => {
    try {
      setLoading(true);
      const [cartRes, profileRes] = await Promise.all([getMyCart(), getMyCustomerProfile()]);
      const cartData    = cartRes?.data ?? null;
      const profileData = profileRes?.data ?? null;

      if (!profileData) { toast.error("Please complete your customer profile first."); router.push("/customer-dashboard/profile"); return; }
      if (!cartData || !cartData.cartItems?.length) { toast.error("Your cart is empty."); router.push("/cart"); return; }

      setCart(cartData);
      setProfile(profileData);
      setFormState((p) => ({
        ...p,
        customerName:          profileData?.user?.name ?? "",
        customerPhone:         profileData?.phone ?? "",
        deliveryStreetAddress: profileData?.streetAddress ?? "",
        deliveryHouseNumber:   profileData?.houseNumber ?? "",
        deliveryApartment:     profileData?.apartment ?? "",
        deliveryPostalCode:    profileData?.postalCode ?? "",
      }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to load checkout.");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: keyof typeof form, value: string) =>
    setFormState((p) => ({ ...p, [key]: value }));

  const buildPayload = (): TCheckoutPayload => ({
    customerName:          form.customerName.trim(),
    customerPhone:         form.customerPhone.trim(),
    deliveryStreetAddress: form.deliveryStreetAddress.trim(),
    deliveryHouseNumber:   form.deliveryHouseNumber.trim() || undefined,
    deliveryApartment:     form.deliveryApartment.trim() || undefined,
    deliveryPostalCode:    form.deliveryPostalCode.trim() || undefined,
    deliveryNote:          form.deliveryNote.trim() || undefined,
  });

  const validate = () => {
    if (!form.customerName.trim())          { toast.error("Customer name is required.");  return false; }
    if (!form.customerPhone.trim())         { toast.error("Phone number is required.");   return false; }
    if (!form.deliveryStreetAddress.trim()) { toast.error("Street address is required."); return false; }
    return true;
  };

  const handlePreviewRefresh = async () => {
    if (!validate()) return;
    try {
      setPreviewLoading(true);
      const res = await getCheckoutPreview(buildPayload());
      if (res?.success && res.data) {
        // Update cart state so the order summary reflects the latest prices/fees.
        // Previously the response was fetched but the returned data was discarded,
        // meaning the "Refresh Preview" button did nothing visible to the user.
        setCart((prev) =>
          prev
            ? {
                ...prev,
                subtotal:       res.data.totals?.subtotal       ?? prev.subtotal,
                deliveryFee:    res.data.totals?.deliveryFee    ?? prev.deliveryFee,
                discountAmount: res.data.totals?.discountAmount ?? prev.discountAmount,
                totalAmount:    res.data.totals?.totalAmount    ?? prev.totalAmount,
              }
            : prev
        );
        toast.success("Checkout preview updated.");
      } else {
        toast.error(res?.message ?? "Failed to refresh preview.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to refresh preview.");
    } finally { setPreviewLoading(false); }
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await createOrder({ ...buildPayload(), paymentMethod: form.paymentMethod });
      if (!res?.success) { toast.error(res?.message ?? "Failed to create order."); return; }
      toast.success("Order created successfully.");
      if (form.paymentMethod === "ONLINE") {
        const payRes = await initiatePayment(res.data.id);
        if (payRes?.success) window.location.href = payRes.data.data.gatewayURL;
        return;
      }
      router.push("/customer-dashboard/orders");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to create order.");
    } finally { setSubmitting(false); }
  };

  if (loading) return <CheckoutSkeleton />;
  if (!cart || !profile) return <CheckoutSkeleton />;

  const cartItems = (cart as any).cartItems ?? cart.items ?? [];

  return (
    <div className="co">

      {/* Hero */}
      <div className="co__hero">
        <div className="co__hero-inner">
          <div className="co__hero-label">
            <span className="co__hero-label-line" />
            Secure Checkout
            <span className="co__hero-label-line" />
          </div>
          <h1 className="co__hero-title">Almost <em>there.</em></h1>
          <p className="co__hero-sub">
            Delivering to{" "}
            <strong style={{ color: "hsl(var(--gold))", fontWeight: 600 }}>{profile.city}</strong>
            {" "}· Review your order below
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="co__body">

        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div>

          {/* Provider */}
          <div className="co__card">
            <h2 className="co__card-title">
              <span className="co__card-title-icon">🍽️</span>
              Provider
            </h2>
            <div className="co__provider">
              {cart.provider.imageURL ? (
                <Image src={cart.provider.imageURL} alt={cart.provider.businessName} width={52} height={52} className="co__provider-img" />
              ) : (
                <div className="co__provider-img-placeholder">🏪</div>
              )}
              <div>
                <div className="co__provider-name">{cart.provider.businessName}</div>
                <div className="co__provider-city">📍 {cart.provider.city}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          {cartItems.length > 0 && (
            <div className="co__card">
              <h2 className="co__card-title">
                <span className="co__card-title-icon">🛒</span>
                Your Items
                <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 500, color: "hsl(var(--muted-foreground))" }}>
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </span>
              </h2>
              <div className="co__items">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="co__item">
                    {item.meal?.mainImageURL ? (
                      <Image src={item.meal.mainImageURL} alt={item.meal.name} width={44} height={44} className="co__item-img" />
                    ) : (
                      <div className="co__item-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🍱</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="co__item-name">{item.meal?.name}</div>
                      <div className="co__item-qty">× {item.quantity}</div>
                    </div>
                    <div className="co__item-price">৳{toNumber(item.totalPrice).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="co__card">
            <h2 className="co__card-title">
              <span className="co__card-title-icon">📦</span>
              Delivery Information
            </h2>

            <div className="co__form-grid">
              <div>
                <label className="co__label co__label-required">Full Name</label>
                <input className="co__input" value={form.customerName} onChange={(e) => setField("customerName", e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="co__label co__label-required">Phone</label>
                <input className="co__input" value={form.customerPhone} onChange={(e) => setField("customerPhone", e.target.value)} placeholder="+880 ..." />
              </div>
              <div>
                <label className="co__label">District</label>
                <div className="co__input-lock-badge">
                  <input className="co__input" value={profile.city} disabled />
                </div>
              </div>
              <div>
                <label className="co__label">Postal Code</label>
                <input className="co__input" value={form.deliveryPostalCode} onChange={(e) => setField("deliveryPostalCode", e.target.value)} placeholder="e.g. 1207" />
              </div>
              <div className="co__form-col-2">
                <label className="co__label co__label-required">Street Address</label>
                <textarea rows={3} className="co__textarea" value={form.deliveryStreetAddress} onChange={(e) => setField("deliveryStreetAddress", e.target.value)} placeholder="Road no., area, landmark…" />
              </div>
              <div>
                <label className="co__label">House / Flat No.</label>
                <input className="co__input" value={form.deliveryHouseNumber} onChange={(e) => setField("deliveryHouseNumber", e.target.value)} placeholder="e.g. H-12" />
              </div>
              <div>
                <label className="co__label">Apartment / Floor</label>
                <input className="co__input" value={form.deliveryApartment} onChange={(e) => setField("deliveryApartment", e.target.value)} placeholder="e.g. 4B" />
              </div>
              <div className="co__form-col-2">
                <label className="co__label">Delivery Note</label>
                <textarea rows={2} className="co__textarea" value={form.deliveryNote} onChange={(e) => setField("deliveryNote", e.target.value)} placeholder="Gate code, preferred drop-off spot, allergies…" />
              </div>
            </div>

            <button type="button" onClick={handlePreviewRefresh} disabled={previewLoading} className="co__refresh-btn">
              {previewLoading ? (
                <><span className="co__cta-spinner" style={{ width: 11, height: 11 }} /> Refreshing…</>
              ) : "↻ Refresh Preview"}
            </button>
          </div>

          {/* Payment method */}
          <div className="co__card">
            <h2 className="co__card-title">
              <span className="co__card-title-icon">💳</span>
              Payment Method
            </h2>
            <div className="co__payment-options">
              <label className={`co__payment-option ${form.paymentMethod === "ONLINE" ? "co__payment-option--active" : ""}`}>
                <input type="radio" name="paymentMethod" checked={form.paymentMethod === "ONLINE"} onChange={() => setField("paymentMethod", "ONLINE")} />
                <div style={{ flex: 1 }}>
                  <div className="co__payment-option-label">💳 Online Payment</div>
                  <div className="co__payment-option-desc">Secure redirect to payment gateway. Supports cards, mobile banking & more.</div>
                </div>
                <span className="co__payment-badge">Recommended</span>
              </label>
              <label className={`co__payment-option ${form.paymentMethod === "COD" ? "co__payment-option--active" : ""}`}>
                <input type="radio" name="paymentMethod" checked={form.paymentMethod === "COD"} onChange={() => setField("paymentMethod", "COD")} />
                <div>
                  <div className="co__payment-option-label">💵 Cash on Delivery</div>
                  <div className="co__payment-option-desc">Pay in cash when your order arrives at your door.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="co__sidebar">
          <div className="co__card">
            <h2 className="co__card-title">
              <span className="co__card-title-icon">🧾</span>
              Order Summary
            </h2>

            <div className="co__summary-rows">
              <div className="co__summary-row">
                <span className="co__summary-label">Subtotal</span>
                <span className="co__summary-value">৳{summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="co__summary-row">
                <span className="co__summary-label">Delivery Fee</span>
                <span className="co__summary-value">৳{summary.deliveryFee.toFixed(2)}</span>
              </div>
              {summary.discountAmount > 0 && (
                <div className="co__summary-row">
                  <span className="co__summary-label">Discount</span>
                  <span className="co__summary-value co__summary-value--discount">− ৳{summary.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="co__divider" />

            <div className="co__summary-total">
              <span>Total</span>
              <span className="co__summary-total-amount">৳{summary.totalAmount.toFixed(2)}</span>
            </div>

            <button type="button" onClick={handlePlaceOrder} disabled={submitting} className="co__cta">
              {submitting ? (
                <><span className="co__cta-spinner" /> Processing…</>
              ) : form.paymentMethod === "ONLINE" ? "Place Order & Pay →" : "Place Order →"}
            </button>

            <div className="co__trust">
              <span className="co__trust-item">🔒 SSL Secured</span>
              <span className="co__trust-item">✓ Verified Provider</span>
              <span className="co__trust-item">↩ Refund Policy</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}