"use client";


import { useState } from "react";
import { X, Star, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createReview, TCreateReviewPayload } from "@/services/review.service";
import "./review-modal.css";

type Props = {
  orderId:     string;
  orderNumber: string;
  mealId:      string;
  mealName:    string;
  onClose:     () => void;
  onSuccess:   () => void; // caller refreshes order list / sets reviewed state
};

export default function ReviewModal({
  orderId,
  orderNumber,
  mealId,
  mealName,
  onClose,
  onSuccess,
}: Props) {
  const [rating,   setRating]   = useState(0);
  const [hovered,  setHovered]  = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    setLoading(true);
    try {
      const payload: TCreateReviewPayload = {
        orderId,
        mealId,
        rating,
        feedback: feedback.trim() || undefined,
      };
      await createReview(payload);
      setDone(true);
      onSuccess();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ?? "Failed to submit review. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const starLabel: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
  };

  return (
    <div className="rm-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="rm-card" onClick={(e) => e.stopPropagation()}>
        <button className="rm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {done ? (
   
          <div className="rm-success">
            <CheckCircle2 size={48} className="rm-success__icon" />
            <h3>Review submitted!</h3>
            <p>Thanks for your feedback on <strong>{mealName}</strong>.</p>
            <button className="rm-btn rm-btn--primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
     
          <>
            <div className="rm-header">
              <h2 className="rm-title">Rate your order</h2>
              <p className="rm-subtitle">
                Order <span className="rm-order-number">#{orderNumber}</span> · {mealName}
              </p>
            </div>

            {/* Star rating */}
            <div className="rm-stars" role="group" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rm-star${(hovered || rating) >= star ? " rm-star--filled" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star size={32} />
                </button>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p className="rm-star-label">
                {starLabel[hovered || rating]}
              </p>
            )}

            {/* Feedback textarea */}
            <div className="rm-field">
              <label className="rm-label" htmlFor="rm-feedback">
                Your feedback <span className="rm-optional">(optional)</span>
              </label>
              <textarea
                id="rm-feedback"
                className="rm-textarea"
                placeholder="What did you like or dislike about this meal?"
                maxLength={1000}
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <span className="rm-char-count">{feedback.length}/1000</span>
            </div>

            {/* Actions */}
            <div className="rm-actions">
              <button
                className="rm-btn rm-btn--ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="rm-btn rm-btn--primary"
                onClick={handleSubmit}
                disabled={loading || rating === 0}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="rm-spinner" />
                    Submitting…
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}