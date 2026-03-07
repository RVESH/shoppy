// src/components/RecentlyViewed/index.jsx
// Recently viewed — last 10 products
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const RecentlyViewed = createContext(null);
const KEY   = "slcart_recent";
const LIMIT = 10;

export function useRecent() {
  const ctx = useContext(RecentlyViewed);
  if (!ctx) throw new Error("useRecent must be inside RecentProvider");
  return ctx;
}

export function RecentProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  // Product view karne pe call karo
  const addToRecent = useCallback((product) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== product.id); // duplicate hata do
      return [product, ...filtered].slice(0, LIMIT);           // front mein add, max 10
    });
  }, []);

  const clearRecent = useCallback(() => setItems([]), []);

  return (
    <RecentlyViewed.Provider value={{ items, addToRecent, clearRecent }}>
      {children}
    </RecentlyViewed.Provider>
  );
}