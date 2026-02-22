import { useState, useMemo } from "react";
import { allProducts, categories } from "../../data";
import "./style.scss";

// ─── Star Rating ─────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span className="stars">
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    <span className="starsCount">({rating})</span>
  </span>
);

// ─── Product Card ─────────────────────────────────────────────
const ProductCard = ({ product }) => (
  <div className="productCard">
    {product.discountPercent > 0 && (
      <div className="discountBadge">{product.discountPercent}% OFF</div>
    )}
    {product.isService && (
      <div className="serviceBadge">SERVICE</div>
    )}
    <div className={`productImageBox ${product.isService ? "serviceImageBox" : ""}`}>
      {product.isService ? "🖨️" : "🛍️"}
    </div>
    <div className="productInfo">
      <div className="productBrand">{product.brand}</div>
      <div className="productName">{product.name}</div>
      <div className="productSubCat">{product.subCategory}</div>
      <Stars rating={product.rating} />
      <div className="productPricing">
        <span className="productPrice">₹{product.price}</span>
        {product.mrp > product.price && (
          <span className="productMrp">₹{product.mrp}</span>
        )}
        {product.isService && (
          <span className="priceType">
            {product.priceType === "variable" ? "onwards" : "fixed"}
          </span>
        )}
      </div>
      {!product.isService && (
        <div className="stockRow">
          <span className={product.stock > 20 ? "inStock" : "lowStock"}>
            {product.stock > 20 ? "✓ In Stock" : `Only ${product.stock} left`}
          </span>
          {product.deliveryAvailable && (
            <span className="delivery">🚚 Delivery</span>
          )}
        </div>
      )}
    </div>
  </div>
);

// ─── Main Products Page ───────────────────────────────────────
export default function Products() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("default");
  const [showServices, setShowServices]     = useState(true);
  const [showProducts, setShowProducts]     = useState(true);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (!showServices) list = list.filter((p) => !p.isService);
    if (!showProducts) list = list.filter((p) => p.isService);

    if (activeCategory !== "all")
      list = list.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.subCategory.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "discount")   list.sort((a, b) => b.discountPercent - a.discountPercent);

    return list;
  }, [activeCategory, searchQuery, sortBy, showServices, showProducts]);

  return (
    <div className="productsPage">

      {/* ── PAGE HEADER ──────────────────────────────── */}
      <div className="pageHeader">
        <div className="pageHeaderInner">
          <div className="breadcrumb">🏠 Home &rsaquo; Products</div>
          <h1 className="pageTitle">Hamare Saare Products 🛍️</h1>
          <p className="pageSubtitle">
            {filtered.length} items mile — groceries se lekar digital services tak!
          </p>
        </div>
      </div>

      <div className="productsLayout">

        {/* ── SIDEBAR ──────────────────────────────────── */}
        <aside className="sidebar">

          {/* Search */}
          <div className="sideCard">
            <div className="sideCardTitle">🔍 Search</div>
            <div className="searchBox">
              <input
                type="text"
                placeholder="Product ya brand dhundo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="searchInput"
              />
              {searchQuery && (
                <button className="searchClear" onClick={() => setSearchQuery("")}>✕</button>
              )}
            </div>
          </div>

          {/* Type Toggle */}
          <div className="sideCard">
            <div className="sideCardTitle">📦 Type</div>
            <label className="toggleRow">
              <input
                type="checkbox"
                checked={showProducts}
                onChange={(e) => setShowProducts(e.target.checked)}
                className="checkbox"
              />
              <span>Physical Products</span>
            </label>
            <label className="toggleRow">
              <input
                type="checkbox"
                checked={showServices}
                onChange={(e) => setShowServices(e.target.checked)}
                className="checkbox"
              />
              <span>Services</span>
            </label>
          </div>

          {/* Categories */}
          <div className="sideCard">
            <div className="sideCardTitle">🗂️ Categories</div>
            <button
              className={`catBtn ${activeCategory === "all" ? "catBtnActive" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              <span>All Items</span>
              <span className="catCount">{allProducts.length}</span>
            </button>
            {categories.map((cat) => {
              const count = allProducts.filter((p) => p.category === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  className={`catBtn ${activeCategory === cat.slug ? "catBtnActive" : ""}`}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="catCount">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="sideCard">
            <div className="sideCardTitle">↕️ Sort By</div>
            {[
              { val: "default",    label: "Default" },
              { val: "rating",     label: "⭐ Top Rated" },
              { val: "price-asc",  label: "💰 Price: Low to High" },
              { val: "price-desc", label: "💰 Price: High to Low" },
              { val: "discount",   label: "🏷️ Max Discount" },
            ].map((opt) => (
              <button
                key={opt.val}
                className={`sortBtn ${sortBy === opt.val ? "sortBtnActive" : ""}`}
                onClick={() => setSortBy(opt.val)}
              >
                {opt.label}
              </button>
            ))}
          </div>

        </aside>

        {/* ── PRODUCT GRID ─────────────────────────────── */}
        <main className="productsMain">

          {/* Toolbar */}
          <div className="toolbar">
            <span className="resultCount">
              <strong>{filtered.length}</strong> products mile
            </span>
            <div className="activeFilters">
              {activeCategory !== "all" && (
                <span className="filterTag">
                  {categories.find((c) => c.slug === activeCategory)?.name}
                  <button onClick={() => setActiveCategory("all")}>✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="filterTag">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>✕</button>
                </span>
              )}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="productGrid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptyEmoji">🔍</div>
              <h3>Koi product nahi mila!</h3>
              <p>Search ya filter change karo</p>
              <button
                className="resetBtn"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setSortBy("default");
                  setShowProducts(true);
                  setShowServices(true);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}