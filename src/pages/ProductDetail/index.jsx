import { useState, useEffect } from "react";
import { fetchProducts, fetchProductById } from "../../api/api.js";
import "./style.scss";

// ─── Star Rating ─────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span className="stars">
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    <span className="starsCount">{rating} / 5</span>
  </span>
);

// ─── Related Product Card ─────────────────────────────────────
const RelatedCard = ({ product, onSelect }) => (
  <div className="relatedCard" onClick={() => onSelect(product.id)}>
    {product.discountPercent > 0 && (
      <div className="relatedDiscount">{product.discountPercent}% OFF</div>
    )}
    <div className={`relatedImage ${product.isService ? "relatedImageService" : ""}`}>
      {product.isService ? "🖨️" : "🛍️"}
    </div>
    <div className="relatedInfo">
      <div className="relatedBrand">{product.brand}</div>
      <div className="relatedName">{product.name}</div>
      <div className="relatedPrice">₹{product.price}</div>
    </div>
  </div>
);

// ─── Main ProductDetail Page ──────────────────────────────────
export default function ProductDetail({ productId: propId, onBack }) {
  const [currentId, setCurrentId]           = useState(propId || null);
  const [product, setProduct]               = useState(null);
  const [related, setRelated]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedVariantVal, setSelectedVariantVal] = useState({});
  const [quantity, setQuantity]             = useState(1);
  const [activeTab, setActiveTab]           = useState("description");
  const [wishlist, setWishlist]             = useState(false);
  const [addedToCart, setAddedToCart]       = useState(false);

  // ── Fetch product when ID changes ──────────────────────────
  useEffect(() => {
    if (!currentId) return;
    setLoading(true);
    setSelectedVariantVal({});
    setQuantity(1);
    setActiveTab("description");
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchProductById(currentId)
      .then((p) => {
        setProduct(p);
        return fetchProducts({ category: p.category });
      })
      .then((all) => {
        setRelated(all.filter((p) => p.id !== currentId).slice(0, 6));
      })
      .catch((err) => console.error("Product load error:", err))
      .finally(() => setLoading(false));
  }, [currentId]);

  // ── Update currentId if prop changes ──────────────────────
  useEffect(() => {
    if (propId) setCurrentId(propId);
  }, [propId]);

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="pdLoading">
        <div className="pdLoadingSpinner">⏳</div>
        <p>Product load ho raha hai...</p>
      </div>
    );
  }

  // ── Not Found ──────────────────────────────────────────────
  if (!product) {
    return (
      <div className="pdNotFound">
        <div className="pdNotFoundEmoji">😕</div>
        <h2>Product nahi mila!</h2>
        <p>Ye product available nahi hai</p>
        {onBack && <button className="pdBackBtn" onClick={onBack}>← Wapas Jao</button>}
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const variantKeys = product.variants ? Object.keys(product.variants) : [];

  // WhatsApp message with selected variants
  const waMsg = variantKeys.length > 0 && Object.keys(selectedVariantVal).length > 0
    ? `Hi! I want to order: *${product.name}* (${Object.entries(selectedVariantVal).map(([k,v])=>`${k}: ${v}`).join(", ")}) - ₹${product.price}`
    : `Hi! I want to order: *${product.name}* - ₹${product.price}`;

  return (
    <div className="pdPage">

      {/* ── BREADCRUMB ───────────────────────────────── */}
      <div className="pdBreadcrumb">
        <div className="pdBreadcrumbInner">
          {onBack && (
            <button className="pdBackBtn" onClick={onBack}>← Wapas Jao</button>
          )}
          🏠 Home &rsaquo; Products &rsaquo;
          <span className="pdBreadcrumbCat"> {product.category.replace(/-/g, " ")}</span>
          &rsaquo; <span className="pdBreadcrumbCurrent">{product.name}</span>
        </div>
      </div>

      {/* ── MAIN DETAIL SECTION ──────────────────────── */}
      <div className="pdMain">
        <div className="pdMainInner">

          {/* Left — Image */}
          <div className="pdImageSection">
            <div className={`pdImageBox ${product.isService ? "pdImageBoxService" : ""}`}>
              {product.isService ? "🖨️" : "🛍️"}
              {product.discountPercent > 0 && (
                <div className="pdDiscountRibbon">{product.discountPercent}% OFF</div>
              )}
              {product.isService && (
                <div className="pdServiceRibbon">SERVICE</div>
              )}
            </div>

            {/* Badges below image */}
            <div className="pdBadges">
              {product.deliveryAvailable && (
                <div className="pdBadge">🚚 Free Delivery</div>
              )}
              {product.stock > 0 && !product.isService && (
                <div className={`pdBadge ${product.stock <= 20 ? "pdBadgeLow" : "pdBadgeGreen"}`}>
                  {product.stock > 20 ? `✓ In Stock (${product.stock})` : `⚠ Only ${product.stock} left`}
                </div>
              )}
              {product.isService && (
                <div className="pdBadge pdBadgeBlue">🕐 {product.processingTime}</div>
              )}
            </div>
          </div>

          {/* Right — Info */}
          <div className="pdInfoSection">

            <div className="pdBrandRow">
              <span className="pdBrand">{product.brand}</span>
              <span className="pdSubCat">{product.subCategory}</span>
            </div>

            <h1 className="pdTitle">{product.name}</h1>

            <div className="pdRatingRow">
              <Stars rating={product.rating} />
            </div>

            {/* Price */}
            <div className="pdPriceBox">
              <span className="pdPrice">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="pdMrp">₹{product.mrp}</span>
                  <span className="pdSaving">₹{product.mrp - product.price} bachenge!</span>
                </>
              )}
              {product.isService && (
                <span className="pdPriceType">
                  {product.priceType === "variable" ? "Starting price" : "Fixed price"}
                </span>
              )}
            </div>

            <p className="pdDescription">{product.description}</p>

            {/* Variants */}
            {variantKeys.length > 0 && (
              <div className="pdVariants">
                {variantKeys.map((key) => (
                  <div key={key} className="pdVariantGroup">
                    <div className="pdVariantLabel">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                      {selectedVariantVal[key] && (
                        <span className="pdVariantSelected"> {selectedVariantVal[key]}</span>
                      )}
                    </div>
                    <div className="pdVariantOptions">
                      {product.variants[key].map((val) => (
                        <button
                          key={val}
                          className={`pdVariantBtn ${selectedVariantVal[key] === val ? "pdVariantBtnActive" : ""}`}
                          onClick={() => setSelectedVariantVal((prev) => ({ ...prev, [key]: val }))}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service docs required */}
            {product.isService && product.documentsRequired?.length > 0 && (
              <div className="pdDocsRequired">
                <div className="pdDocsTitle">📋 Documents Required:</div>
                <ul className="pdDocsList">
                  {product.documentsRequired.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity */}
            {!product.isService && (
              <div className="pdQtyRow">
                <div className="pdQtyLabel">Quantity:</div>
                <div className="pdQtyControl">
                  <button className="pdQtyBtn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <span className="pdQtyNum">{quantity}</span>
                  <button className="pdQtyBtn" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="pdActions">
              <button
                className={`pdCartBtn ${addedToCart ? "pdCartBtnSuccess" : ""}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? "✓ Cart Mein Add Ho Gaya!" : product.isService ? "🖨️ Service Book Karo" : "🛒 Cart Mein Daalo"}
              </button>

              <a
                href={`https://wa.me/916206869543?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="pdWaBtn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Karein !
              </a>

              <button
                className={`pdWishlistBtn ${wishlist ? "pdWishlistBtnActive" : ""}`}
                onClick={() => setWishlist((w) => !w)}
              >
                {wishlist ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="pdTags">
                {product.tags.map((tag) => (
                  <span key={tag} className="pdTag">#{tag}</span>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── TABS SECTION ─────────────────────────────── */}
      <div className="pdTabs">
        <div className="pdTabsInner">
          <div className="pdTabNav">
            {["description", "details", product.isService ? "documents" : "variants"].map((t) => (
              <button
                key={t}
                className={`pdTabBtn ${activeTab === t ? "pdTabBtnActive" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "description" && "📄 Description"}
                {t === "details"     && "📋 Details"}
                {t === "variants"    && "🎨 Variants"}
                {t === "documents"   && "📁 Documents"}
              </button>
            ))}
          </div>

          <div className="pdTabContent">
            {activeTab === "description" && (
              <div className="pdTabPane"><p>{product.description}</p></div>
            )}
            {activeTab === "details" && (
              <div className="pdTabPane">
                <table className="pdDetailsTable">
                  <tbody>
                    <tr><td>Brand</td><td>{product.brand}</td></tr>
                    <tr><td>Category</td><td>{product.category.replace(/-/g, " ")}</td></tr>
                    <tr><td>Sub Category</td><td>{product.subCategory}</td></tr>
                    <tr><td>Rating</td><td>⭐ {product.rating} / 5</td></tr>
                    <tr><td>Price</td><td>₹{product.price}</td></tr>
                    <tr><td>MRP</td><td>₹{product.mrp}</td></tr>
                    {product.discountPercent > 0 && <tr><td>Discount</td><td>{product.discountPercent}%</td></tr>}
                    {!product.isService && <tr><td>Stock</td><td>{product.stock} units</td></tr>}
                    <tr><td>Delivery</td><td>{product.deliveryAvailable ? "✓ Available" : "✗ Not Available"}</td></tr>
                    {product.isService && <>
                      <tr><td>Processing Time</td><td>{product.processingTime}</td></tr>
                      <tr><td>Price Type</td><td>{product.priceType}</td></tr>
                    </>}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "variants" && product.variants && (
              <div className="pdTabPane">
                {Object.entries(product.variants).map(([key, vals]) => (
                  <div key={key} className="pdTabVariantRow">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                    <div className="pdTabVariantList">
                      {vals.map((v) => <span key={v} className="pdTabVariantChip">{v}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "documents" && product.documentsRequired && (
              <div className="pdTabPane">
                <ul className="pdDocsList">
                  {product.documentsRequired.map((d, i) => <li key={i}>✓ {d}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ─────────────────────────── */}
      {related.length > 0 && (
        <div className="pdRelated">
          <div className="pdRelatedInner">
            <h2 className="pdRelatedTitle">Isi Category Ke Aur Products 👇</h2>
            <div className="relatedGrid">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} onSelect={setCurrentId} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}