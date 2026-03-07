// src/components/WishlistSave/index.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const WishlistSave = createContext(null);
const KEY = "slcart_wishlist";

export function useWishlist() {
  const ctx = useContext(WishlistSave);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const toggleWishlist = useCallback((product) => {
    setItems(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)   // unlike → hata do
        : [...prev, product]                        // like → add karo
    );
  }, []);

  const isWishlisted      = useCallback((id) => items.some(i => i.id === id), [items]);
  const removeFromWishlist= useCallback((id) => setItems(prev => prev.filter(i => i.id !== id)), []);
  const clearWishlist     = useCallback(() => setItems([]), []);

  return (
    <WishlistSave.Provider value={{ items, toggleWishlist, isWishlisted, removeFromWishlist, clearWishlist, totalWishlist: items.length }}>
      {children}
    </WishlistSave.Provider>
  );
}