import "./style.scss";

// ─── Star Rating ─────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span className="pcStars">
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    <span className="pcStarsNum">({rating})</span>
  </span>
);

// ─── ProductCard Component ────────────────────────────────────
// Props:
// product     — product object from data
// onClick     — function to open ProductDetail
// onWishlist  — function to toggle wishlist (optional)
// isWishlisted— boolean (optional)

export default function ProductCard({ product, onClick, onWishlist, isWishlisted = false }) {
  if (!product) return null;

  const handleWishlist = (e) => {
    e.stopPropagation(); // card click prevent karo
    if (onWishlist) onWishlist(product.id);
  };

  return (
    <div className="productCard" onClick={() => onClick && onClick(product.id)}>

      {/* ── Badges ─────────────────────────────────── */}
      <div className="pcBadges">
        {product.discountPercent > 0 && (
          <div className="pcDiscountBadge">{product.discountPercent}% OFF</div>
        )}
        {product.isService && (
          <div className="pcServiceBadge">SERVICE</div>
        )}
        {product.stock <= 10 && !product.isService && (
          <div className="pcLowStockBadge">Only {product.stock} left</div>
        )}
      </div>

      {/* ── Wishlist Button ─────────────────────────── */}
      <button
        className={`pcWishlistBtn ${isWishlisted ? "pcWishlistBtnActive" : ""}`}
        onClick={handleWishlist}
        title={isWishlisted ? "Wishlist se hatao" : "Wishlist mein daalo"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* ── Image Box ──────────────────────────────── */}
      <div className={`pcImageBox ${product.isService ? "pcImageBoxService" : ""}`}>
        <span className="pcImageEmoji">
          {product.isService ? "🖨️" : "🛍️"}
        </span>
      </div>

      {/* ── Info ───────────────────────────────────── */}
      <div className="pcInfo">

        <div className="pcBrandRow">
          <span className="pcBrand">{product.brand}</span>
          <span className="pcSubCat">{product.subCategory}</span>
        </div>

        <h3 className="pcName">{product.name}</h3>

        <Stars rating={product.rating} />

        <div className="pcPricing">
          <span className="pcPrice">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="pcMrp">₹{product.mrp}</span>
          )}
          {product.isService && product.priceType === "variable" && (
            <span className="pcOnwards">onwards</span>
          )}
        </div>

        <div className="pcFooter">
          {!product.isService ? (
            <span className={`pcStock ${product.stock > 20 ? "pcStockIn" : "pcStockLow"}`}>
              {product.stock > 20 ? "✓ In Stock" : `⚠ ${product.stock} left`}
            </span>
          ) : (
            <span className="pcProcessing">🕐 {product.processingTime?.split(";")[0]}</span>
          )}
          {product.deliveryAvailable && (
            <span className="pcDelivery">🚚 Delivery</span>
          )}
        </div>

      </div>

      {/* ── Hover CTA ──────────────────────────────── */}
      <div className="pcHoverCta">
        <span>{product.isService ? "Book Now" : "View Details"} →</span>
      </div>

    </div>
  );
}