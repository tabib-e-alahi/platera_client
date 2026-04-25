"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import "./payment-result.css";

function FailPageInner() {
  const params  = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="pr-page">
      <div className="pr-card pr-card--fail">
        <span className="pr-icon">❌</span>
        <h1 className="pr-title">Payment failed</h1>
        <p className="pr-hint">
          Your payment could not be processed. No charge was made.
          You can try again from your orders page.
        </p>
        <div className="pr-actions">
          {orderId && (
            <Link
              href={`/checkout/payment?orderId=${orderId}`}
              className="pr-btn pr-btn--primary"
            >
              Try again
            </Link>
          )}
          <Link href="/customer-dashboard/orders" className="pr-btn pr-btn--secondary">
            My orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return <Suspense><FailPageInner /></Suspense>;
}