import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "@/context/CartContext";
import { mediaApi } from "@/api/media";

export function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    tax,
    shipping,
    total,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const clean = promoCode.trim().toUpperCase();
    if (clean === "SAVE20" || clean === "PLAYGROUND") {
      const disc = subtotal * 0.2;
      setDiscount(disc);
      setPromoSuccess(`20% Discount Applied! (-$${disc.toFixed(2)})`);
    } else if (clean === "FREESHIP") {
      setDiscount(shipping);
      setPromoSuccess("Free Shipping Applied!");
    } else {
      setPromoError("Invalid promotional voucher code.");
    }
  };

  const finalTotal = Math.max(0, total - discount);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderReceipt({
        orderId,
        itemsCount: totalItems,
        totalAmount: finalTotal,
        date: new Date().toLocaleString(),
      });
      clearCart();
      setIsCheckingOut(false);
    }, 1000);
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
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review items stored in your active session state.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            ← Continue Shopping
          </Link>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* ── Order Complete Banner ── */}
      {orderReceipt && (
        <div className="p-8 rounded-3xl bg-[#12151d] border border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl text-emerald-400">
            ✓
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-white">
              Order Placed Successfully!
            </h3>
            <p className="text-sm text-slate-300">
              Mock transaction finalized for{" "}
              <span className="text-emerald-400 font-mono font-bold">
                ${orderReceipt.totalAmount.toFixed(2)}
              </span>
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Receipt ID: #{orderReceipt.orderId} · {orderReceipt.itemsCount}{" "}
              items · {orderReceipt.date}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/products"
              onClick={() => setOrderReceipt(null)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
            >
              <span>Return to Products Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Cart Workspace ── */}
      {!orderReceipt && items.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#12151d] border border-white/10 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
            🛒
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">
              Your Cart is Currently Empty
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              You haven't added any products to your shopping cart yet. Browse
              our simulated custom collection to add items.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
          >
            <span>Explore Products</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        !orderReceipt && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert Bar */}
              <div className="p-4 rounded-2xl bg-[#12151d] border border-white/10 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <span>🚚</span>
                    {remainingForFreeShipping === 0 ? (
                      <strong className="text-emerald-400">
                        You qualify for FREE Standard Delivery!
                      </strong>
                    ) : (
                      <span>
                        Add{" "}
                        <strong className="text-emerald-400 font-mono">
                          ${remainingForFreeShipping.toFixed(2)}
                        </strong>{" "}
                        more to get Free Shipping!
                      </span>
                    )}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-cyan-400 transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table Card */}
              <div className="rounded-3xl bg-[#12151d] border border-white/10 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Cart Items</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 text-[11px] font-mono">
                      {totalItems}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Pricing in USD ($)
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {items.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    const imgUrl = mediaApi.getThumbnailUrl(`prod-${item.id}`, {
                      width: 160,
                      height: 120,
                      text: item.name || "Product",
                    });

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors group"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <img
                            src={imgUrl}
                            alt={item.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                          />
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-white/10">
                                {item.category || "General"}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ID: #{String(item.id).slice(0, 10)}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/10 text-sm font-bold transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/10 text-sm font-bold transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-20">
                            <div className="text-sm font-extrabold text-emerald-400 font-mono">
                              ${itemTotal.toFixed(2)}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Subtotal
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove item from cart"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-[#12151d] border border-white/10 shadow-xl space-y-6">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cart Items ({totalItems})</span>
                    <span className="font-mono text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span>Discount Voucher</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Shipping & Delivery</span>
                    <span className="font-mono text-white">
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-extrabold text-white">
                    <span>Estimated Total</span>
                    <span className="text-emerald-400 font-mono text-lg">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <form
                  onSubmit={handleApplyPromo}
                  className="space-y-2 pt-2 border-t border-white/10"
                >
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Promo Code / Voucher
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try SAVE20 or FREESHIP"
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {promoError}
                    </p>
                  )}
                  {promoSuccess && (
                    <p className="text-[11px] text-emerald-400 font-medium">
                      {promoSuccess}
                    </p>
                  )}
                </form>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-xl shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <span>Processing Sandbox Order...</span>
                  ) : (
                    <span>
                      ⚡ Complete Simulated Checkout (${finalTotal.toFixed(2)})
                      →
                    </span>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Transactions operate in your isolated browser session sandbox.
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Cart;
