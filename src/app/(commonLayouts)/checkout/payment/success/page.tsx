"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPaymentStatus } from "@/services/payment.service";
import "./payment-result.css";

function SuccessPageInner() {
  const params  = useSearchParams();
  const orderId = params.get("orderId");
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;
    // Poll once to confirm backend processed it
    getPaymentStatus(orderId)
      .then((res) => setStatus(res?.data ?? null))
      .catch(() => {});
  }, [orderId]);

  return (
    <div className="pr-page">
      <div className="pr-card pr-card--success">
        <span className="pr-icon">✅</span>
        <h1 className="pr-title">Payment successful!</h1>
        <p className="pr-hint">
          Your order has been placed and the provider has been notified.
        </p>
        {status?.orderNumber && (
          <p className="pr-order-number">Order #{status.orderNumber}</p>
        )}
        <div className="pr-actions">
          <Link href="/customer-dashboard/orders" className="pr-btn pr-btn--primary">
            View my orders
          </Link>
          <Link href="/" className="pr-btn pr-btn--secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense><SuccessPageInner /></Suspense>;
}