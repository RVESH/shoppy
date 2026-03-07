// src/components/CartIcon/index.jsx
import { useEffect, useRef, useState } from "react";
import { useCart } from "../CartContext";
import "./style.scss";

export default function CartIcon() {
  const { totalItems, setIsOpen } = useCart();
  const prevCount = useRef(totalItems);
  const [animate, setAnimate] = useState(false);

  // Item add hone pe badge bounce karo
  useEffect(() => {
    if (totalItems > prevCount.current) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
    
    prevCount.current = totalItems;
  }, [totalItems]);

  return (
    <button
      className={`cartIcon ${animate ? "cartIcon--pop" : ""}`}
      onClick={() => setIsOpen(true)}
      title="Cart kholo"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {totalItems > 0 && (
        <span className={`cartIconBadge ${animate ? "cartIconBadge--pop" : ""}`}>
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}