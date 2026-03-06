// src/components/ProductView/index.jsx
import { useState, useEffect, useCallback } from "react";
import { useCart } from "../CartContext";
import "./style.scss";

const Stars = ({ rating }) => (
  <div className="pvStars">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={
        i <= Math.floor(rating) ? "pvStarOn" :
        i - 0.5 <= rating ? "pvStarHalf" : "pvStarOff"
      }>★</span>
    ))}
    <span className="pvStarsVal">{rating}</span>
    <span className="pvStarsCount">({Math.floor(rating * 47)} reviews)</span>
  </div>
);

const WaBtn = ({ product, variants }) => {
  const variantStr = Object.entries(variants || {}).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(", ");
  const msg = `Hi! *${product.name}*${variantStr ? ` (${variantStr})` : ""} - Rs.${product.price} order karna hai!`;
  return (
    <a href={`https://wa.me/919798855030?text=${encodeURIComponent(msg)}`}
      target="_blank" rel="noreferrer" className="pvWaBtn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      WhatsApp pe Order Karo
    </a>
  );
};

export default function ProductView({ product, onClose, onWishlist, isWishlisted = false }) {
  const { addToCart, isInCart, getQty, updateQty, removeFromCart } = useCart();
  const [variants, setVariants]   = useState({});
  const [tab, setTab]             = useState("desc");
  const [imgError, setImgError]   = useState(false);
  const [quantity, setQuantity]   = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleKey = useCallback((e) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [handleKey]);

  useEffect(() => {
    setVariants({}); setTab("desc"); setImgError(false); setQuantity(1); setJustAdded(false);
  }, [product?.id]);

  if (!product) return null;

  const inCart  = isInCart(product.id, variants);
  const cartQty = getQty(product.id, variants);
  const discount = product.discountPercent > 0 ? product.discountPercent
    : product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const savings = product.mrp > product.price ? product.mrp - product.price : 0;
  const variantEntries = product.variants
    ? Object.entries(product.variants).filter(([,v]) => Array.isArray(v) && v.length > 0) : [];
  const imgSrc = imgError || !product.image
    ? `https://placehold.co/500x500/fff7ed/ea580c?text=${encodeURIComponent(product.name.slice(0,10))}`
    : product.image;

  function handleAddToCart() {
    addToCart(product, quantity, variants);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="pvOverlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pvModal">
        <button className="pvClose" onClick={onClose}>✕</button>
        <div className="pvBody">

          {/* LEFT */}
          <div className="pvLeft">
            <div className="pvImageWrap">
              <img src={imgSrc} alt={product.name} className="pvImage" onError={() => setImgError(true)} />
              {discount > 0 && <div className="pvDiscBadge">{discount}% OFF</div>}
              {product.isService && <div className="pvServiceBadge">SERVICE</div>}
              {!product.isService && product.stock > 0 && product.stock <= 10 && (
                <div className="pvLowBadge">Only {product.stock} left!</div>
              )}
              <button className={`pvHeart ${isWishlisted ? "pvHeartActive" : ""}`}
                onClick={() => onWishlist?.(product.id)}>
                {isWishlisted ? "❤️" : "🤍"}
              </button>
            </div>
            <div className="pvDeliveryRow">
              {product.deliveryAvailable && <span className="pvDeliveryChip">🚚 Free Delivery</span>}
              {!product.isService && product.stock > 20 && <span className="pvStockChip">✓ In Stock</span>}
              {product.isService && product.processingTime && (
                <span className="pvTimeChip">🕐 {product.processingTime?.split(";")[0]}</span>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="pvRight">
            <div className="pvMeta">
              <span className="pvBrand">{product.brand}</span>
              <span className="pvDot">·</span>
              <span className="pvSubCat">{product.subCategory}</span>
            </div>
            <h2 className="pvName">{product.name}</h2>
            <Stars rating={product.rating} />
            <div className="pvDivider" />

            <div className="pvPricing">
              <span className="pvPrice">₹{product.price?.toLocaleString()}</span>
              {product.isService && product.priceType === "variable" && <span className="pvOnwards">onwards</span>}
              {product.mrp > product.price && (
                <div className="pvPricingRight">
                  <span className="pvMrp">₹{product.mrp?.toLocaleString()}</span>
                  <span className="pvSaving">Save ₹{savings} ({discount}%)</span>
                </div>
              )}
            </div>

            <p className="pvDesc">{product.description?.slice(0,180)}{product.description?.length > 180 ? "..." : ""}</p>

            {variantEntries.map(([key, values]) => (
              <div key={key} className="pvVariantGroup">
                <div className="pvVariantLabel">
                  {key}: {variants[key]
                    ? <strong className="pvVariantVal">{variants[key]}</strong>
                    : <span className="pvVariantHint">Select karo</span>}
                </div>
                <div className="pvVariantOptions">
                  {values.map(val => (
                    <button key={val}
                      className={`pvVariantBtn ${variants[key] === val ? "pvVariantBtnOn" : ""}`}
                      onClick={() => setVariants(p => ({ ...p, [key]: val }))}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {!product.isService && !inCart && (
              <div className="pvQtyRow">
                <span className="pvQtyLabel">Qty:</span>
                <div className="pvQtyControl">
                  <button className="pvQtyBtn" onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
                  <span className="pvQtyNum">{quantity}</span>
                  <button className="pvQtyBtn" onClick={() => setQuantity(q => Math.min(product.stock||99, q+1))}>+</button>
                </div>
              </div>
            )}

            {product.isService && product.documentsRequired?.length > 0 && (
              <div className="pvDocsBox">
                <div className="pvDocsTitle">📄 Documents Required:</div>
                <div className="pvDocsList">
                  {product.documentsRequired.map(d => <span key={d} className="pvDocChip">{d}</span>)}
                </div>
              </div>
            )}

            <div className="pvCta">
              {!product.isService ? (
                !inCart ? (
                  <button className={`pvBookBtn ${justAdded ? "pvBookBtnDone" : ""}`}
                    onClick={handleAddToCart} disabled={product.stock === 0}>
                    {product.stock === 0 ? "❌ Out of Stock" : justAdded ? "✓ Cart Mein Hai!" : "🛒 Cart Mein Daalo"}
                  </button>
                ) : (
                  <div className="pvInCartRow">
                    <span className="pvInCartLabel">✓ Cart Mein Hai</span>
                    <div className="pvQtyControl">
                      <button className="pvQtyBtn" onClick={() => updateQty(product.id, variants, cartQty-1)}>−</button>
                      <span className="pvQtyNum">{cartQty}</span>
                      <button className="pvQtyBtn" onClick={() => updateQty(product.id, variants, cartQty+1)}>+</button>
                    </div>
                    <button className="pvRemoveBtn" onClick={() => removeFromCart(product.id, variants)}>Remove</button>
                  </div>
                )
              ) : (
                <button className="pvBookBtn pvBookBtnService" onClick={() => addToCart(product, 1, {})}>
                  📋 Enquiry Cart Mein Daalo
                </button>
              )}
              <WaBtn product={product} variants={variants} />
            </div>

            {product.tags?.length > 0 && (
              <div className="pvTags">
                {product.tags.map(t => <span key={t} className="pvTag">#{t}</span>)}
              </div>
            )}

            <div className="pvTabs">
              <div className="pvTabNav">
                {[["desc","📝 Details"],["specs","📋 Specs"],
                  product.isService ? ["docs","📁 Docs"] : ["var","🎨 Variants"]
                ].map(([k,l]) => (
                  <button key={k} className={`pvTabBtn ${tab===k?"pvTabOn":""}`} onClick={() => setTab(k)}>{l}</button>
                ))}
              </div>
              <div className="pvTabBody">
                {tab==="desc" && <p className="pvTabText">{product.description || "Koi description nahi."}</p>}
                {tab==="specs" && (
                  <table className="pvSpecTable"><tbody>
                    <tr><td>Brand</td><td>{product.brand}</td></tr>
                    <tr><td>Category</td><td>{product.category?.replace(/-/g," ")}</td></tr>
                    <tr><td>Sub-Category</td><td>{product.subCategory}</td></tr>
                    {!product.isService && <tr><td>Stock</td><td>{product.stock} units</td></tr>}
                    <tr><td>Rating</td><td>⭐ {product.rating}/5</td></tr>
                    <tr><td>Delivery</td><td>{product.deliveryAvailable ? "✅ Available" : "❌ Not available"}</td></tr>
                    {product.isService && <tr><td>Processing</td><td>{product.processingTime}</td></tr>}
                  </tbody></table>
                )}
                {tab==="var" && variantEntries.length > 0 && (
                  <div className="pvTabVarList">
                    {variantEntries.map(([key,vals]) => (
                      <div key={key} className="pvTabVarRow">
                        <strong>{key}:</strong>
                        <div>{vals.map(v => <span key={v} className="pvTabVarChip">{v}</span>)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {tab==="docs" && product.documentsRequired && (
                  <ul className="pvTabDocList">
                    {product.documentsRequired.map((d,i) => <li key={i}>✓ {d}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}