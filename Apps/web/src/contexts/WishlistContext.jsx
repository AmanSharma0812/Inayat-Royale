/**
 * @deprecated NOT IN USE
 * This context was created for a standalone wishlist feature but is NOT currently
 * imported or used anywhere in the app. The CartContext (CartContext.jsx) is being
 * used as the wishlist instead (the "cart" IS the wishlist in Inayat Royale's UX).
 *
 * If you want to switch to a separate wishlist in the future, you can:
 * 1. Import WishlistProvider in App.jsx and wrap the tree
 * 2. Replace `useCart` with `useWishlist` in WishlistPage.jsx, ProductCard.jsx, etc.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';


const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('inayat_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inayat_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isItemInWishlist = prev.some((item) => item.id === product.id);
      
      if (isItemInWishlist) {
        toast.info(`${product.name} removed from wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success(`${product.name} added to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
