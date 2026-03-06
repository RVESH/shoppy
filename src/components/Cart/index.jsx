// ============================================================
// src/components/Cart/index.jsx
// Slide-in cart drawer — right side se aata hai
// ============================================================

import { useState } from "react";
import { useCart } from "../CartContext";
import OrderModal from "../OrderModal";
import "./style.scss";

// ─── Placeholder image ────────────────────────────────────────
function getItemImg(item) {
  if (item.image) return item.image;
  return `https://placehold.co/80x80/fff7ed/ea580c?text=${encodeURIComponent(
    item.name.slice(0, 6)
  )}`;
}

// ─── Single Cart Row ──────────────────────────────────────────
function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart();
  const [imgErr, setImgErr] = useState(false);

  const variantStr = Object.entries(item.variants || {})
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const discount =
    item.mrp > item.price
      ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
      : 0;

  return (
    <div className="cartItem">
      {/* Product Image */}
      <div className="cartItemImg">
        <img
          src={imgErr ? getItemImg({ ...item, image: "" }) : getItemImg(item)}
          alt={item.name}
          onError={() => setImgErr(true)}
        />
        {item.isService && (
          <span className="cartItemServiceTag">Service</span>
        )}
      </div>

      {/* Product Info */}
      <div className="cartItemInfo">
        <div className="cartItemName">{item.name}</div>
        {item.brand && (
          <div className="cartItemBrand">{item.brand}</div>
        )}
        {variantStr && (
          <div className="cartItemVariant">{variantStr}</div>
        )}

        {/* Price Row */}
        <div className="cartItemPriceRow">
          <span className="cartItemPrice">
            ₹{(item.price * item.quantity).toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="cartItemMrp">
                ₹{(item.mrp * item.quantity).toLocaleString()}
              </span>
              <span className="cartItemDisc">{discount}% off</span>
            </>
          )}
        </div>

        {/* Qty Controls — only for products, not services */}
        {!item.isService ? (
          <div className="cartItemQty">
            <button
              className="cartQtyBtn"
              onClick={() =>
                updateQty(item.id, item.variants, item.quantity - 1)
              }
            >
              −
            </button>
            <span className="cartQtyNum">{item.quantity}</span>
            <button
              className="cartQtyBtn"
              onClick={() =>
                updateQty(item.id, item.variants, item.quantity + 1)
              }
            >
              +
            </button>
          </div>
        ) : (
          <div className="cartItemServiceNote">1 booking</div>
        )}
      </div>

      {/* Remove Button */}
      <button
        className="cartItemRemove"
        onClick={() => removeFromCart(item.id, item.variants)}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Cart Drawer ─────────────────────────────────────────
export default function Cart() {
  const {
    items,
    isOpen,
    setIsOpen,
    totalItems,
    totalPrice,
    totalMrp,
    totalSaved,
    clearCart,
  } = useCart();

  const [showOrder, setShowOrder] = useState(false);

  // Drawer band hai — kuch render mat karo
  if (!isOpen) return null;

  return (
    <>
      {/* Dark backdrop */}
      <div className="cartBackdrop" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="cartDrawer">

        {/* Header */}
        <div className="cartHeader">
          <div className="cartHeaderLeft">
            <span className="cartHeaderIcon">🛒</span>
            <span className="cartHeaderTitle">Mera Cart</span>
            {totalItems > 0 && (
              <span className="cartHeaderBadge">{totalItems}</span>
            )}
          </div>
          <div className="cartHeaderRight">
            {items.length > 0 && (
              <button className="cartClearBtn" onClick={clearCart}>
                Clear All
              </button>
            )}
            <button
              className="cartCloseBtn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cartBody">
          {items.length === 0 ? (
            /* Empty State */
            <div className="cartEmpty">
              <div className="cartEmptyIcon">🛍️</div>
              <div className="cartEmptyTitle">Cart Khaali Hai!</div>
              <div className="cartEmptyMsg">
                Koi product daalo cart mein
              </div>
              <button
                className="cartEmptyBtn"
                onClick={() => setIsOpen(false)}
              >
                Shopping Karo
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="cartItemsList">
              {items.map((item, idx) => (
                <CartItem key={`${item.id}-${idx}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div className="cartFooter">

            {/* Savings strip */}
            {totalSaved > 0 && (
              <div className="cartSavingsStrip">
                🎉 ₹{totalSaved.toLocaleString()} ki bachat!
              </div>
            )}

            {/* Price Summary */}
            <div className="cartSummary">
              <div className="cartSummaryRow">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalMrp.toLocaleString()}</span>
              </div>
              {totalSaved > 0 && (
                <div className="cartSummaryRow cartSummaryDiscount">
                  <span>Discount</span>
                  <span>−₹{totalSaved.toLocaleString()}</span>
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

            {/* CTA Button */}
            <button
              className="cartOrderBtn"
              onClick={() => {
                setIsOpen(false);
                setShowOrder(true);
              }}
            >
              📋 Order Details Bharo
            </button>
            <p className="cartOrderNote">
              WhatsApp pe order confirm hoga
            </p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrder && (
        <OrderModal onClose={() => setShowOrder(false)} />
      )}
    </>
  );
}