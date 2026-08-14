import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '@/context/CartContext';
import { mediaApi } from '@/api/media';

const Cart = () => {
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

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const clean = promoCode.trim().toUpperCase();
    if (clean === 'SAVE20' || clean === 'PLAYGROUND') {
      const disc = subtotal * 0.2;
      setDiscount(disc);
      setPromoSuccess(`20% Discount Applied! (-$${disc.toFixed(2)})`);
    } else if (clean === 'FREESHIP') {
      setDiscount(shipping);
      setPromoSuccess('Free Shipping Applied!');
    } else {
      setPromoError('Invalid promotional voucher code.');
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
    }, 1200);
  };

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Header Banner ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-emerald-500 to-sky-500 opacity-80" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              E-Commerce Cart Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Shopping Cart Studio
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Review selected catalog products, adjust item quantities, apply promo codes, and simulate order dispatching.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2.5 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <span>← Continue Shopping</span>
            </Link>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Order Complete Banner ── */}
      {orderReceipt && (
        <div className="p-8 rounded-2xl bg-linear-to-b from-[#0f172a] to-[#080e1a] border border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
            ✓
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-white">Order Placed Successfully!</h3>
            <p className="text-sm text-slate-300">
              Mock transaction finalized for{' '}
              <span className="text-emerald-400 font-mono font-bold">${orderReceipt.totalAmount.toFixed(2)}</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Receipt ID: #{orderReceipt.orderId} · {orderReceipt.itemsCount} items · {orderReceipt.date}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/products"
              onClick={() => setOrderReceipt(null)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <span>📦 Return to Products Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Cart Workspace ── */}
      {!orderReceipt && items.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-2xl bg-[#0f172a] border border-[#1e293b] text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-3xl">
            🛒
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">Your Cart is Currently Empty</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              You haven't added any products to your shopping cart yet. Browse our simulated custom collection to add items.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <span>Explore Products</span>
            <span>→</span>
          </Link>
        </div>
      ) : !orderReceipt && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Alert Bar */}
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span>🚚</span>
                  {remainingForFreeShipping === 0 ? (
                    <strong className="text-emerald-400">You qualify for FREE Standard Delivery!</strong>
                  ) : (
                    <span>
                      Add <strong className="text-amber-400 font-mono">${remainingForFreeShipping.toFixed(2)}</strong> more to get Free Shipping!
                    </span>
                  )}
                </span>
                <span className="text-slate-500 font-mono">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#080e1a] overflow-hidden border border-[#1e293b]">
                <div
                  className="h-full bg-linear-to-r from-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items Table Card */}
            <div className="rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#1e293b] flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Cart Items</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono">
                    {totalItems}
                  </span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Pricing in USD ($)</span>
              </div>

              <div className="divide-y divide-[#1e293b]">
                {items.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const imgUrl = mediaApi.getThumbnailUrl(`prod-${item.id}`, {
                    width: 160,
                    height: 120,
                    text: item.name || 'Product',
                  });

                  return (
                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#131d33]/40 transition-colors group">
                      {/* Product Thumbnail & Meta */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <img
                          src={imgUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#1e293b] shrink-0"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold uppercase">
                              {item.category || 'General'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: #{String(item.id).slice(0, 10)}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Modifier & Line Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1e293b]/60">
                        {/* Stepper */}
                        <div className="flex items-center bg-[#080e1a] border border-[#1e293b] rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-sm font-bold transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-sm font-bold transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Total */}
                        <div className="text-right min-w-20">
                          <div className="text-sm font-extrabold text-emerald-400 font-mono">
                            ${itemTotal.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Subtotal</span>
                        </div>

                        {/* Remove */}
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
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl space-y-6">
              <h3 className="text-base font-bold text-white border-b border-[#1e293b] pb-4">
                Order Summary
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Cart Items ({totalItems})</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>Discount Voucher</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Shipping & Delivery</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between text-sm font-extrabold text-white">
                  <span>Estimated Total</span>
                  <span className="text-amber-400 font-mono text-lg">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-[#1e293b]">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Promo Code / Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try SAVE20 or FREESHIP"
                    className="flex-1 bg-[#080e1a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-amber-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-400 font-medium">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] text-emerald-400 font-medium">{promoSuccess}</p>}
              </form>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Sandbox Order...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Complete Simulated Checkout (${finalTotal.toFixed(2)})</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Transactions operate in your isolated browser session sandbox.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
