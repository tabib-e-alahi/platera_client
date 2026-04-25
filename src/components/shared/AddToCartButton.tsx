"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCart } from "@/services/cart.service";
import "./add-to-cart-btn.css";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type AddToCartButtonProps = {
  mealId: string;
  quantity?: number;
  className?: string;
};

export default function AddToCartButton({
  mealId,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);

      const res = await addToCart({ mealId, quantity });

      if (res?.success) {
        toast.success("Item added to cart.");
        return;
      }

      toast.error(res?.message ?? "Failed to add item to cart.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Something went wrong.";

      if (message.toLowerCase().includes("complete your customer profile")) {
        toast.error("Please complete your customer profile first.");
        router.push("/customer-dashboard/profile");
        return;
      }

      if (message.toLowerCase().includes("only serves customers in")) {
        toast.error(message);
        return;
      }

      if (message.toLowerCase().includes("another provider")) {
        toast.error(message);
        return;
      }

      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`atc-btn ${isAdding ? "atc-btn--loading" : ""} ${className}`}
        >
          <Plus/>
        </button>
      </TooltipTrigger>
      <TooltipContent>Add to Cart</TooltipContent>
    </Tooltip>
  );
}