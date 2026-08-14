import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { mediaApi } from '@/api/media';

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
    }, 1000);
  };

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0f172a] border-l border-[#1e293b] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-lg">
              🛒
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Shopping Cart</h3>
              <p className="text-xs text-slate-400 font-mono">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in session
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(false);
              setOrderComplete(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e293b] text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {items.length > 0 && !orderComplete && (
          <div className="px-5 py-3 bg-[#080e1a] border-b border-[#1e293b] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-bold">🎉 You unlocked FREE Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-amber-400 font-mono">${remainingForFreeShipping.toFixed(2)}</strong> for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-slate-500 font-mono">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderComplete ? (
            /* Order Success State */
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Order Simulated Successfully!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Receipt generated under ID <span className="text-emerald-400 font-mono font-bold">{orderComplete.orderId}</span> for <span className="text-white font-mono font-bold">${orderComplete.totalAmount.toFixed(2)}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderComplete(null);
                  setIsCartOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/60 border border-[#1e293b] flex items-center justify-center text-2xl">
                🛍️
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Your cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore the products catalog and click "+ Add to Cart" to start filling your basket.
                </p>
              </div>
            </div>
          ) : (
            /* Items List */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#080e1a] border border-[#1e293b] flex items-center gap-3.5 group hover:border-slate-700 transition-colors"
                >
                  <img
                    src={mediaApi.getThumbnailUrl(`prod-${item.id}`, {
                      width: 120,
                      height: 120,
                      text: item.name || 'Item',
                    })}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#1e293b] shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs p-0.5 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <span className="text-xs font-extrabold text-emerald-400 font-mono">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800 text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800 text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && !orderComplete && (
          <div className="p-5 border-t border-[#1e293b] bg-[#080e1a]/95 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-mono text-white">
                  {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-sm font-bold text-white">
                <span>Total Due</span>
                <span className="font-mono text-amber-400 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="px-3 py-2.5 rounded-xl bg-[#0f172a] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-[#1e293b] text-xs font-semibold transition-colors cursor-pointer"
                title="Empty Cart"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Mock Order...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Complete Checkout (${total.toFixed(2)})</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
