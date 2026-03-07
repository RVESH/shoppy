// src/components/CartContext/index.jsx
// addToCart — cart auto open NAHI hoga
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext(null);
const KEY = "slcart_cart";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  function itemKey(id, variants = {}) {
    const v = Object.entries(variants)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([k,v]) => `${k}:${v}`).join("|");
    return v ? `${id}__${v}` : String(id);
  }

  const addToCart = useCallback((product, quantity = 1, variants = {}) => {
    const key = itemKey(product.id, variants);
    setItems(prev => {
      const exists = prev.find(i => itemKey(i.id, i.variants) === key);
      if (exists) return prev.map(i =>
        itemKey(i.id, i.variants) === key ? { ...i, quantity: i.quantity + quantity } : i
      );
      return [...prev, { ...product, quantity, variants }];
    });
    // ← setIsOpen(true) HATA DIYA — cart auto open nahi hoga
  }, []);

  const removeFromCart = useCallback((id, variants = {}) => {
    const key = itemKey(id, variants);
    setItems(prev => prev.filter(i => itemKey(i.id, i.variants) !== key));
  }, []);

  const updateQty = useCallback((id, variants = {}, newQty) => {
    if (newQty <= 0) { removeFromCart(id, variants); return; }
    const key = itemKey(id, variants);
    setItems(prev => prev.map(i =>
      itemKey(i.id, i.variants) === key ? { ...i, quantity: newQty } : i
    ));
  }, [removeFromCart]);

  const clearCart  = useCallback(() => setItems([]), []);
  const isInCart   = useCallback((id, variants = {}) => items.some(i => itemKey(i.id, i.variants) === itemKey(id, variants)), [items]);
  const getQty     = useCallback((id, variants = {}) => items.find(i => itemKey(i.id, i.variants) === itemKey(id, variants))?.quantity || 0, [items]);

  const totalItems = items.reduce((s,i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s,i) => s + i.price * i.quantity, 0);
  const totalMrp   = items.reduce((s,i) => s + (i.mrp || i.price) * i.quantity, 0);
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