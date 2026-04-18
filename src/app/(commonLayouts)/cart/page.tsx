"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight, MapPin, ShoppingBag, Trash2, UtensilsCrossed, Minus, Plus, X,
} from "lucide-react";
import {
  clearCart, getMyCart, removeCartItem, updateCartItemQuantity,
} from "@/services/cart.service";
import "./cart-page.css";

/* ─── Types ──────────────────────────────────────────────── */
type TCartItem = {
  id: string;
  quantity: number;
  baseUnitPrice: string | number;
  unitPrice: string | number;
  totalPrice: string | number;
  meal: {
    id: string;
    name: string;
    mainImageURL: string;
    basePrice: string | number;
    discountPrice?: string | number | null;
    deliveryFee?: string | number;
    isAvailable: boolean;
    isActive: boolean;
  };
};

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
  items: TCartItem[];
};

const n = (v: string | number | null | undefined) => Number(v ?? 0);

/* ─── Optimistic summary helper ─────────────────────────── */
/**
 * Re-computes subtotal/total locally based on current item quantities + unit prices.
 * This gives instant feedback while the API call is in-flight.
 */
function computeOptimisticSummary(items: TCartItem[], deliveryFee: number, discountAmount: number) {
  const subtotal = items.reduce((acc, it) => acc + n(it.unitPrice) * it.quantity, 0);
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);
  return { subtotal, total };
}

/* ─── Cart Item ──────────────────────────────────────────── */
function CartItem({
  item,
  isBusy,
  isRemoving,
  onQty,
  onRemove,
}: {
  item: TCartItem;
  isBusy: boolean;
  isRemoving: boolean;
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className={`ci ${isBusy ? "ci--busy" : ""} ${isRemoving ? "ci--removing" : ""}`}>
      {isBusy && <div className="ci__busy-bar" />}

      {/* Image */}
      <div className="ci__img-wrap">
        {item.meal.mainImageURL ? (
          <img src={item.meal.mainImageURL} alt={item.meal.name} className="ci__img" loading="lazy" />
        ) : (
          <div className="ci__img-placeholder"><UtensilsCrossed size={28} /></div>
        )}
      </div>

      {/* Body */}
      <div className="ci__body">
        <div className="ci__top">
          <div style={{ minWidth: 0 }}>
            <h3 className="ci__name">{item.meal.name}</h3>
            <p className="ci__unit-price">৳{n(item.unitPrice).toFixed(2)} each</p>
          </div>
          {/* line total — computed optimistically from item.quantity * item.unitPrice */}
          <span className="ci__line-total">
            ৳{(n(item.unitPrice) * item.quantity).toFixed(2)}
          </span>
        </div>

        <div className="ci__controls">
          {/* Stepper */}
          <div className="ci__stepper">
            <button
              type="button"
              className="ci__step-btn"
              disabled={isBusy || item.quantity <= 1}
              onClick={() => onQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="ci__qty">{item.quantity}</span>
            <button
              type="button"
              className="ci__step-btn"
              disabled={isBusy}
              onClick={() => onQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            className="ci__remove-btn"
            disabled={isBusy}
            onClick={() => onRemove(item.id)}
          >
            <X size={12} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<TCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyItems, setBusyItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isClearing, setIsClearing] = useState(false);

  // Optimistic summary — updated immediately on interaction
  const [optimisticItems, setOptimisticItems] = useState<TCartItem[]>([]);

  // Debounce map: itemId → timeout so rapid clicks collapse into one request
  const debounceMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => { fetchCart(); }, []);
  useEffect(() => { if (cart) setOptimisticItems(cart.items); }, [cart]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await getMyCart();
      setCart(res?.data ?? null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load cart.");
    } finally {
      setIsLoading(false);
    }
  };

  /* Optimistic quantity change — instant UI + debounced API */
  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    // 1. Update UI immediately
    setOptimisticItems((prev) =>
      prev.map((it) => it.id === itemId ? { ...it, quantity: newQty } : it)
    );

    // Mark busy (disables further clicks until API resolves)
    setBusyItems((prev) => new Set(prev).add(itemId));

    // 2. Debounce the API call by 400ms so rapid +/- taps collapse
    const existing = debounceMap.current.get(itemId);
    if (existing) clearTimeout(existing);

    const t = setTimeout(async () => {
      try {
        const res = await updateCartItemQuantity(itemId, { quantity: newQty });
        // Server response is authoritative — sync back
        if (res?.data) setCart(res.data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to update cart.");
        // Rollback optimistic change
        if (cart) setOptimisticItems(cart.items);
      } finally {
        setBusyItems((prev) => { const s = new Set(prev); s.delete(itemId); return s; });
        debounceMap.current.delete(itemId);
      }
    }, 400);

    debounceMap.current.set(itemId, t);
  };

  const handleRemoveItem = async (itemId: string) => {
    // animate out immediately
    setRemovingItems((prev) => new Set(prev).add(itemId));
    setBusyItems((prev) => new Set(prev).add(itemId));

    // Cancel any pending debounce for this item
    const existing = debounceMap.current.get(itemId);
    if (existing) { clearTimeout(existing); debounceMap.current.delete(itemId); }

    // Optimistically remove from list after animation
    setTimeout(() => {
      setOptimisticItems((prev) => prev.filter((it) => it.id !== itemId));
    }, 300);

    try {
      const res = await removeCartItem(itemId);
      setCart(res?.data ?? null);
      toast.success("Item removed.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to remove item.");
      if (cart) setOptimisticItems(cart.items);
    } finally {
      setBusyItems((prev) => { const s = new Set(prev); s.delete(itemId); return s; });
      setRemovingItems((prev) => { const s = new Set(prev); s.delete(itemId); return s; });
    }
  };

  const handleClearCart = async () => {
    try {
      setIsClearing(true);
      await clearCart();
      setCart(null);
      setOptimisticItems([]);
      toast.success("Cart cleared.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to clear cart.");
    } finally {
      setIsClearing(false);
    }
  };

  /* Optimistic summary — recomputes instantly from optimistic items */
  const delivery = n(cart?.deliveryFee ?? 0);
  const discount = n(cart?.discountAmount ?? 0);
  const { subtotal, total } = computeOptimisticSummary(optimisticItems, delivery, discount);
  const itemCount = optimisticItems.reduce((a, it) => a + it.quantity, 0);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-page__hero">
          <div className="cart-page__hero-inner">
            <div className="cart-page__hero-label">
              <span className="cart-page__hero-label-line" />Your Order<span className="cart-page__hero-label-line" />
            </div>
            <h1 className="cart-page__hero-title">My <em>Cart</em></h1>
          </div>
        </div>
        <div className="cart-page__body">
          <div className="cart-page__layout">
            <div className="cart-page__skeleton">
              {[1, 2, 3].map((i) => (
                <div className="cart-page__skeleton-card" key={i}>
                  <div className="cart-page__skeleton-img" />
                  <div className="cart-page__skeleton-lines">
                    <div className="cart-page__skeleton-line" style={{ width: "70%" }} />
                    <div className="cart-page__skeleton-line" style={{ width: "40%" }} />
                    <div className="cart-page__skeleton-line" style={{ width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (!cart || optimisticItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__hero">
          <div className="cart-page__hero-inner">
            <div className="cart-page__hero-label">
              <span className="cart-page__hero-label-line" />Your Order<span className="cart-page__hero-label-line" />
            </div>
            <h1 className="cart-page__hero-title">My <em>Cart</em></h1>
          </div>
        </div>
        <div className="cart-page__body">
          <div className="cart-page__empty">
            <div className="cart-page__empty-icon"><ShoppingBag size={36} /></div>
            <h2 className="cart-page__empty-title">Your cart is <em>empty</em></h2>
            <p className="cart-page__empty-hint">
              Looks like you haven't added anything yet. Explore our restaurants and find something delicious.
            </p>
            <Link href="/restaurants" className="cart-page__empty-btn">
              Browse Restaurants <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full cart ── */
  return (
    <div className="cart-page">
      {/* Hero */}
      <div className="cart-page__hero">
        <div className="cart-page__hero-inner">
          <div className="cart-page__hero-label">
            <span className="cart-page__hero-label-line" />Your Order<span className="cart-page__hero-label-line" />
          </div>
          <h1 className="cart-page__hero-title">My <em>Cart</em></h1>
          <p className="cart-page__hero-sub">{itemCount} item{itemCount !== 1 ? "s" : ""} ready to checkout</p>
        </div>
      </div>

      <div className="cart-page__body">
        {/* Provider bar */}
        <div className="cart-page__provider-bar">
          <div className="cart-page__provider-info">
            <div className="cart-page__provider-avatar">
              {cart.provider.imageURL
                ? <img src={cart.provider.imageURL} alt={cart.provider.businessName} />
                : <UtensilsCrossed size={18} />}
            </div>
            <div>
              <div className="cart-page__provider-name">{cart.provider.businessName}</div>
              <div className="cart-page__provider-city">
                <MapPin size={10} /> {cart.provider.city}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="cart-page__clear-btn"
            onClick={handleClearCart}
            disabled={isClearing}
          >
            <Trash2 size={13} />
            {isClearing ? "Clearing…" : "Clear cart"}
          </button>
        </div>

        {/* Layout */}
        <div className="cart-page__layout">
          {/* Items */}
          <div className="cart-page__items">
            {optimisticItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                isBusy={busyItems.has(item.id)}
                isRemoving={removingItems.has(item.id)}
                onQty={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Summary */}
          <aside className="cart-summary">
            <div className="cart-summary__header">
              <div className="cart-summary__header-label">Order Summary</div>
              <div className="cart-summary__header-title">Your Total</div>
              <div className="cart-summary__header-count">{itemCount} item{itemCount !== 1 ? "s" : ""} from {cart.provider.businessName}</div>
            </div>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Delivery fee</span>
                <span>৳{delivery.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <>
                  <div className="cart-summary__divider" />
                  <div className="cart-summary__row cart-summary__row--discount">
                    <span>Discount</span>
                    <span>− ৳{discount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="cart-summary__total">
              <span className="cart-summary__total-label">Total</span>
              <span className="cart-summary__total-amount">৳{total.toFixed(2)}</span>
            </div>

            <div className="cart-summary__actions">
              <button
                type="button"
                className="cart-summary__checkout-btn"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link href="/restaurants" className="cart-summary__continue-btn">
                ← Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
