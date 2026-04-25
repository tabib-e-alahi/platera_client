"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { canReviewOrder } from "@/services/review.service";
import ReviewModal from "./ReviewModal";
import "./review-button.css"

type Props = {
  orderId:     string;
  orderNumber: string;
  mealId:      string;
  mealName:    string;
  orderStatus: string;
};

export default function ReviewButton({
  orderId,
  orderNumber,
  mealId,
  mealName,
  orderStatus,
}: Props) {
  const [checking,  setChecking]  = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [reviewed,  setReviewed]  = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only check for DELIVERED orders
    if (orderStatus !== "DELIVERED") {
      setChecking(false);
      return;
    }
    canReviewOrder(orderId)
      .then((res) => {
        setCanReview(res.data.canReview);
        setReviewed(!res.data.canReview && !!res.data.existingReview);
      })
      .catch(() => setCanReview(false))
      .finally(() => setChecking(false));
  }, [orderId, orderStatus]);

  if (orderStatus !== "DELIVERED") return null;
  if (checking)
    return (
      <span className="rb-checking">
        <Loader2 size={13} className="rb-spin" />
      </span>
    );

  if (reviewed)
    return (
      <span className="rb-reviewed">
        <CheckCircle2 size={14} />
        Reviewed
      </span>
    );

  if (!canReview) return null;

  return (
    <>
      <button className="rb-btn" onClick={() => setShowModal(true)}>
        <Star size={14} />
        Write a Review
      </button>

      {showModal && (
        <ReviewModal
          orderId={orderId}
          orderNumber={orderNumber}
          mealId={mealId}
          mealName={mealName}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setCanReview(false);
            setReviewed(true);
          }}
        />
      )}
    </>
  );
}