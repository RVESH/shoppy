// src/components/OrderHistory/index.jsx
// Order history — localStorage mein store hoti hai
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const OrderHistory = createContext(null);
const KEY = "slcart_orders";

export function useOrders() {
  const ctx = useContext(OrderHistory);
  if (!ctx) throw new Error("useOrders must be inside OrderProvider");
  return ctx;
}

// Order ID generator: SLC-YYYYMMDD-XXXX
export function generateOrderId() {
  const d    = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SLC-${date}-${rand}`;
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch {}
  }, [orders]);

  const saveOrder = useCallback((orderData) => {
    const order = {
      ...orderData,
      orderId:   orderData.orderId || generateOrderId(),
      createdAt: new Date().toISOString(),
      status:    "placed",
    };
    setOrders(prev => [order, ...prev]); // latest pehle
    return order;
  }, []);

  const getOrder      = useCallback((id) => orders.find(o => o.orderId === id), [orders]);
  const clearOrders   = useCallback(() => setOrders([]), []);

  return (
    <OrderHistory.Provider value={{ orders, saveOrder, getOrder, clearOrders, totalOrders: orders.length }}>
      {children}
    </OrderHistory.Provider>
  );
}