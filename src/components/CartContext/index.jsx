// ============================================================
// src/components/CartContext/index.jsx
// Global cart state — puri app mein use hota hai
// ============================================================

import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

// ─── Hook ────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [items, setItems]   = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ── Unique key per item+variant combo ─────────────────────
  function itemKey(id, variants = {}) {
    const v = Object.entries(variants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    return v ? `${id}__${v}` : id;
  }

  // ── Add to cart ────────────────────────────────────────────
  const addToCart = useCallback((product, quantity = 1, variants = {}) => {
    const key = itemKey(product.id, variants);
    setItems(prev => {
      const exists = prev.find(i => itemKey(i.id, i.variants) === key);
      if (exists) {
        // already hai — qty badha do
        return prev.map(i =>
          itemKey(i.id, i.variants) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      // naya item add karo
      return [...prev, { ...product, quantity, variants }];
    });
    setIsOpen(true); // cart khol do
  }, []);

  // ── Remove from cart ───────────────────────────────────────
  const removeFromCart = useCallback((id, variants = {}) => {
    const key = itemKey(id, variants);
    setItems(prev => prev.filter(i => itemKey(i.id, i.variants) !== key));
  }, []);

  // ── Update quantity ────────────────────────────────────────
  const updateQty = useCallback((id, variants = {}, newQty) => {
    if (newQty <= 0) { removeFromCart(id, variants); return; }
    const key = itemKey(id, variants);
    setItems(prev =>
      prev.map(i =>
        itemKey(i.id, i.variants) === key ? { ...i, quantity: newQty } : i
      )
    );
  }, [removeFromCart]);

  // ── Clear cart ─────────────────────────────────────────────
  const clearCart = useCallback(() => setItems([]), []);

  // ── Check if item is in cart ───────────────────────────────
  const isInCart = useCallback((id, variants = {}) => {
    const key = itemKey(id, variants);
    return items.some(i => itemKey(i.id, i.variants) === key);
  }, [items]);

  // ── Get quantity of specific item ──────────────────────────
  const getQty = useCallback((id, variants = {}) => {
    const key = itemKey(id, variants);
    return items.find(i => itemKey(i.id, i.variants) === key)?.quantity || 0;
  }, [items]);

  // ── Computed values ────────────────────────────────────────
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalMrp   = items.reduce((s, i) => s + (i.mrp || i.price) * i.quantity, 0);
  const totalSaved = totalMrp - totalPrice;

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addToCart, removeFromCart, updateQty, clearCart,
      isInCart, getQty,
      totalItems, totalPrice, totalMrp, totalSaved,
    }}>
      {children}
    </CartContext.Provider>
  );
}