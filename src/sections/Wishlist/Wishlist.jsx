import { useState } from 'react';
import { Link } from 'react-router';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { mediaApi } from '@/api/media';

function Toast({ message, type = 'success', onClose }) {
  const bg =
    type === 'success'
      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
      : 'bg-amber-500/20 border-emerald-500/40 text-emerald-300';

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

export function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist, totalWishlistItems } = useWishlist();
  const { addToCart } = useCart();
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Saved Wishlist</h1>
          <p className="text-xs sm:text-sm text-slate-400">Products bookmarked in your active browser session.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            ← Explore Catalog
          </Link>
          {wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Move All to Cart 🛒
            </button>
          )}
        </div>
      </div>

      {/* ── Wishlist Grid ── */}
      {wishlistItems.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#12151d] border border-white/10 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
            ❤️
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Explore the e-commerce store catalog to bookmark products you love.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistItems.map((product) => {
            const displayName = product.name || product.title || 'Product Item';
            const imgUrl = mediaApi.getThumbnailUrl(`wish-${product.id}`, {
              width: 400,
              height: 250,
              text: product.category || displayName,
            });

            return (
              <div
                key={product.id}
                className="rounded-3xl bg-[#12151d] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all shadow-lg group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-black/40">
                    <img
                      src={imgUrl}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-white/10">
                        {product.category || 'General'}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-emerald-400">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {displayName}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description || 'Simulated dynamic custom item in session overlay.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Add to Cart 🛒</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Wishlist;
