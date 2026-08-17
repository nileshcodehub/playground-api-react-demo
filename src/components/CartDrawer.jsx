import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { mediaApi } from "@/api/media";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    tax,
    shipping,
    total,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderComplete({
        orderId,
        itemsCount: totalItems,
        totalAmount: total,
      });
      clearCart();
      setIsCheckingOut(false);
    }, 800);
  };

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-[#12151d] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-lg">
              🛒
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Shopping Cart
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {totalItems} {totalItems === 1 ? "item" : "items"} in session
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-black/30 border-b border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold">
                  🎉 Free Shipping unlocked!
                </span>
              ) : (
                <span>
                  Add <strong>${remainingForFreeShipping.toFixed(2)}</strong>{" "}
                  more for Free Shipping
                </span>
              )}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {orderComplete ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">
                  Order Simulated!
                </h4>
                <p className="text-xs text-slate-400">
                  Order Ref:{" "}
                  <span className="font-mono text-emerald-400">
                    {orderComplete.orderId}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Total:{" "}
                  <strong className="text-white">
                    ${orderComplete.totalAmount.toFixed(2)}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderComplete(null);
                  setIsCartOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="text-4xl">🛍️</div>
              <p className="text-sm font-bold text-white">Your cart is empty</p>
              <p className="text-xs text-slate-400">
                Add products from the catalog to test cart persistence.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white/3 border border-white/5 flex items-center gap-3.5"
                >
                  <img
                    src={mediaApi.getThumbnailUrl(`prod-${item.id}`, {
                      width: 80,
                      height: 80,
                      text: item.name || item.title,
                    })}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h5 className="text-xs font-bold text-white truncate">
                      {item.name || item.title}
                    </h5>
                    <p className="text-xs font-mono font-bold text-emerald-400">
                      ${item.price}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && !orderComplete && (
          <div className="p-5 border-t border-white/10 bg-black/40 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-mono text-white">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                <span className="text-white">Total</span>
                <span className="font-mono text-emerald-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={clearCart}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {isCheckingOut
                  ? "Simulating Checkout..."
                  : "Simulate Checkout →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
