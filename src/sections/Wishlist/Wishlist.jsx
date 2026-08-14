import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { mediaApi } from '@/api/media';

function Toast({ message, type = 'success', onClose }) {
  const bg =
    type === 'success'
      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
      : 'bg-amber-500/20 border-amber-500/40 text-amber-300';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${bg}`}
    >
      <span>{type === 'success' ? '✓' : 'ℹ'}</span>
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-2 text-slate-400 hover:text-white">✕</button>
    </div>
  );
}

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, totalWishlistItems } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showToast(`Moved "${product.name || product.title}" to cart! 🛒`);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((product) => {
      addToCart(product, 1);
    });
    clearWishlist();
    showToast(`Moved all ${totalWishlistItems} items to your cart! 🛒`);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalVal = wishlistItems.reduce((acc, p) => acc + Number(p.price || 0), 0);
    const inStockCount = wishlistItems.filter((p) => Number(p.stock || 0) > 0).length;
    return { totalVal, inStockCount };
  }, [wishlistItems]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Header Banner ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 via-amber-500 to-purple-500 opacity-80" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Saved Items & Bookmarks
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Product Wishlist
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curate and save your favorite products. Transfer items directly to your shopping cart when you're ready to test checkout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2.5 rounded-xl bg-[#080e1a] hover:bg-[#131d33] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <span>← Browse Catalog</span>
            </Link>
            {wishlistItems.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>🛒 Move All to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear Wishlist
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Metrics Strip ── */}
      {wishlistItems.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Wishlist Items</div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono">{totalWishlistItems}</div>
            <div className="text-[11px] text-slate-400">Saved for later</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Valuation</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">${metrics.totalVal.toFixed(2)}</div>
            <div className="text-[11px] text-slate-400">Combined value</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stock Readiness</div>
            <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono">{metrics.inStockCount} / {totalWishlistItems}</div>
            <div className="text-[11px] text-slate-400">Ready to dispatch</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-1 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Cart Link</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono flex items-center gap-2">
              <span>🛒</span>
              <Link to="/cart" className="hover:underline text-base">View Cart ({cartItems.length})</Link>
            </div>
            <div className="text-[11px] text-slate-400">Ready for checkout</div>
          </div>
        </div>
      )}

      {/* ── Main Content Grid ── */}
      {wishlistItems.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-2xl bg-[#0f172a] border border-[#1e293b] text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-3xl">
            🤍
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              You haven't saved any items yet. Click the heart icon on any product in the catalog to bookmark items here.
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistItems.map((p) => {
            const qty = Number(p.stock) || 0;
            const displayName = p.name || p.title || 'Product Item';
            const imgUrl = mediaApi.getThumbnailUrl(`prod-${p.id}`, {
              width: 600,
              height: 400,
              text: displayName,
              description: `$${p.price} · ${p.category || 'Product'}`,
            });

            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div className="space-y-3">
                  {/* Thumbnail with remove button */}
                  <div className="rounded-xl overflow-hidden border border-[#1e293b] relative group-hover:shadow-lg transition-all">
                    <img
                      src={imgUrl}
                      alt={displayName}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                      ${Number(p.price || 0).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromWishlist(p.id);
                        showToast(`Removed "${displayName}" from wishlist`, 'warn');
                      }}
                      className="absolute top-2.5 left-2.5 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-500/80 backdrop-blur-md text-rose-400 hover:text-white border border-rose-500/30 text-xs transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Category & Stock */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                      {p.category || 'General'}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold ${
                        qty > 10 ? 'text-emerald-400' : qty > 0 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {qty > 0 ? `● ${qty} in stock` : '○ Out of stock'}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-rose-300 transition-colors">
                      {displayName}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.description || 'Saved in your personal testing wishlist.'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#1e293b] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">
                      {'★'.repeat(Math.round(p.rating || 5))} <span className="text-slate-500">({p.rating || 5}.0)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      #{String(p.id).slice(0, 10)}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={qty <= 0}
                    onClick={() => handleMoveToCart(p)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      qty <= 0
                        ? 'bg-slate-800/50 text-slate-500 border border-slate-700/30 cursor-not-allowed'
                        : 'bg-linear-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-extrabold shadow-sm shadow-amber-500/20'
                    }`}
                  >
                    <span>🛒</span>
                    <span>{qty <= 0 ? 'Out of Stock' : 'Move to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Feedback */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Wishlist;
