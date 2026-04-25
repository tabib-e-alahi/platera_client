// src/app/(commonLayouts)/checkout/payment/page.tsx

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { initiatePayment } from "@/services/payment.service";

function PaymentPageInner() {
  const router     = useRouter();
  const params     = useSearchParams();
  const orderId    = params.get("orderId");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found.");
      setIsLoading(false);
      return;
    }
    startPayment(orderId);
  }, [orderId]);

  const startPayment = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await initiatePayment(id);

      if (!res?.success || !res?.data?.gatewayURL) {
        setError(res?.message ?? "Failed to initiate payment.");
        return;
      }

      // Redirect to SSLCommerz gateway page
      window.location.href = res.data.gatewayURL;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ?? "Failed to start payment.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pay-page">
        <div className="pay-card">
          <div className="pay-spinner" />
          <h1 className="pay-title">Connecting to payment gateway…</h1>
          <p className="pay-hint">
            Please wait. You will be redirected to SSLCommerz shortly.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pay-page">
        <div className="pay-card pay-card--error">
          <span className="pay-icon">⚠️</span>
          <h1 className="pay-title">Payment initiation failed</h1>
          <p className="pay-hint">{error}</p>
          <button
            className="pay-btn"
            onClick={() => router.push("/customer-dashboard/orders")}
          >
            View my orders
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function CheckoutPaymentPage() {
  return (
    <Suspense>
      <PaymentPageInner />
    </Suspense>
  );
}