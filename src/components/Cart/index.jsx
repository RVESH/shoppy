// src/components/Cart/index.jsx
// Fix: Order button pe cart pehle band ho, phir modal khule
import { useState, useEffect, useRef, useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import OrderModal from "../OrderModal";
import "./style.scss";

function getItemImg(item) {
  if (item.image) return item.image;
  return `https://placehold.co/80x80/fff7ed/ea580c?text=${encodeURIComponent(item.name.slice(0,5))}`;
}

function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart();
  const [imgErr, setImgErr] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const startX = useRef(null);

  const variantStr = Object.entries(item.variants || {})
    .filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(", ");
  const discount = item.mrp > item.price
    ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

  function onTouchStart(e) { startX.current = e.touches[0].clientX; }
  function onTouchMove(e) {
    if (startX.current === null) return;
    const diff = e.touches[0].clientX - startX.current;
    if (diff < 0) setSwipeX(Math.max(diff, -80));
  }
  function onTouchEnd() {
    setSwipeX(swipeX < -50 ? -80 : 0);
    startX.current = null;
  }

  return (
    <div className="cartItemWrap">
      <div className="cartItemDeleteBg" onClick={() => removeFromCart(item.id, item.variants)}>
        <span>🗑️</span><span>Hatao</span>
      </div>
      <div className="cartItem" style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="cartItemImg">
          <img src={imgErr ? getItemImg({...item,image:""}) : getItemImg(item)}
            alt={item.name} onError={() => setImgErr(true)} />
          {item.isService && <span className="cartItemServiceTag">Service</span>}
        </div>
        <div className="cartItemInfo">
          <div className="cartItemName">{item.name}</div>
          {item.brand   && <div className="cartItemBrand">{item.brand}</div>}
          {variantStr   && <div className="cartItemVariant">{variantStr}</div>}
          <div className="cartItemBottom">
            <div className="cartItemPriceRow">
              <span className="cartItemPrice">₹{(item.price * item.quantity).toLocaleString()}</span>
              {discount > 0 && <span className="cartItemDisc">{discount}% off</span>}
              {item.mrp > item.price && <span className="cartItemMrp">₹{(item.mrp * item.quantity).toLocaleString()}</span>}
            </div>
            {!item.isService ? (
              <div className="cartItemQty">
                <button className="cartQtyBtn" onClick={() => updateQty(item.id, item.variants, item.quantity - 1)}>−</button>
                <span className="cartQtyNum">{item.quantity}</span>
                <button className="cartQtyBtn" onClick={() => updateQty(item.id, item.variants, item.quantity + 1)}>+</button>
              </div>
            ) : (
              <div className="cartItemServiceNote">1 booking</div>
            )}
          </div>
        </div>
        <button className="cartItemRemove" onClick={() => removeFromCart(item.id, item.variants)}>✕</button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, isOpen, setIsOpen, totalItems, totalPrice, totalMrp, totalSaved, clearCart } = useCart();
  const [showOrder, setShowOrder] = useState(false);
  const [closing,   setClosing]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = (isOpen || showOrder) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, showOrder]);


  const handleClose = useCallback(() => {
  setClosing(true);
  setTimeout(() => { setClosing(false); setIsOpen(false); }, 280);
}, [setIsOpen]);

  // ✅ FIX: Cart band karo → animation khatam ho → PHIR modal khulo
  function handleOrderClick() {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setIsOpen(false);
      setShowOrder(true);   // ← drawer poora band hone ke BAAD
    }, 300);
  }

  function goToProducts() {
    handleClose();
    setTimeout(() => navigate("/products"), 300);
  }

  if (!isOpen && !showOrder) return (
    showOrder ? <OrderModal onClose={() => setShowOrder(false)} /> : null
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className={`cartBackdrop ${closing ? "cartBackdrop--out" : ""}`} onClick={handleClose} />
      )}

      {/* Drawer */}
      {isOpen && (
        <div className={`cartDrawer ${closing ? "cartDrawer--out" : ""}`}>

          <div className="cartHandle" />

          {/* Header */}
          <div className="cartHeader">
            <div className="cartHeaderLeft">
              <span className="cartHeaderIcon">🛒</span>
              <div>
                <span className="cartHeaderTitle">Mera Cart</span>
                {totalItems > 0 && <span className="cartHeaderSub">{totalItems} item{totalItems > 1 ? "s" : ""}</span>}
              </div>
            </div>
            <div className="cartHeaderRight">
              {items.length > 0 && (
                <button className="cartClearBtn" onClick={clearCart}>Clear All</button>
              )}
              <button className="cartCloseBtn" onClick={handleClose} title="Band karo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="cartSwipeHint">← Item pe left swipe karke hatao</div>
          )}

          {/* Body */}
          <div className="cartBody">
            {items.length === 0 ? (
              <div className="cartEmpty">
                <div className="cartEmptyIcon">🛍️</div>
                <div className="cartEmptyTitle">Cart Khaali Hai!</div>
                <div className="cartEmptyMsg">Apne pasand ke products daalo cart mein</div>
                <button className="cartEmptyBtn" onClick={goToProducts}>🔍 Products Dekho</button>
              </div>
            ) : (
              <div className="cartItemsList">
                {items.map((item, idx) => (
                  <CartItem key={`${item.id}-${idx}`} item={item} />
                ))}
                <button className="cartMoreBtn" onClick={goToProducts}>
                  <span className="cartMorePlus">+</span>
                  <span>Aur Products Daalo</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="cartFooter">
              {totalSaved > 0 && (
                <div className="cartSavingsStrip">🎉 ₹{totalSaved.toLocaleString()} ki bachat ho rahi hai!</div>
              )}
              <div className="cartSummary">
                <div className="cartSummaryRow">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalMrp.toLocaleString()}</span>
                </div>
                {totalSaved > 0 && (
                  <div className="cartSummaryRow cartSummaryDiscount">
                    <span>Discount</span><span>−₹{totalSaved.toLocaleString()}</span>
                  </div>
                )}
                <div className="cartSummaryRow">
                  <span>Delivery</span>
                  <span className="cartFreeTag">FREE</span>
                </div>
                <div className="cartSummaryDivider" />
                <div className="cartSummaryRow cartSummaryTotal">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* ✅ Ye button use karo — handleOrderClick */}
              <button className="cartOrderBtn" onClick={handleOrderClick}>
                📋 Order Details Bharo
              </button>
              <p className="cartOrderNote">WhatsApp pe order confirm hoga</p>
            </div>
          )}
        </div>
      )}

      {/* Order Modal — drawer band hone ke baad dikhta hai */}
      {showOrder && <OrderModal onClose={() => setShowOrder(false)} />}
    </>
  );
}