import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'playground_shopping_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // ignore
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => String(item.id) === String(productId)),
    [wishlistItems]
  );

  const addToWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => String(item.id) === String(product.id))) {
        return prev;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name || product.title || 'Product',
          title: product.name || product.title || 'Product',
          price: Number(product.price || 0),
          category: product.category || 'General',
          stock: Number(product.stock || 0),
          rating: Number(product.rating || 5),
          description: product.description || '',
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        return false;
      } else {
        addToWishlist(product);
        return true;
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const totalWishlistItems = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    totalWishlistItems,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
