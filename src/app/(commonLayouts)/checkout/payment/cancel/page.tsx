"use client";

import Link from "next/link";
import "./payment-result.css";

export default function PaymentCancelPage() {
  return (
    <div className="pr-page">
      <div className="pr-card pr-card--cancel">
        <span className="pr-icon">🚫</span>
        <h1 className="pr-title">Payment cancelled</h1>
        <p className="pr-hint">
          You cancelled the payment. Your order is still pending.
          You can pay again from your orders page.
        </p>
        <div className="pr-actions">
          <Link href="/customer-dashboard/orders" className="pr-btn pr-btn--primary">
            My orders
          </Link>
          <Link href="/" className="pr-btn pr-btn--secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}