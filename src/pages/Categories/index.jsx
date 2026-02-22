import { useState } from "react";
import { allProducts, categories } from "../../data";
import "./style.scss";

// ─── Product Mini Card ────────────────────────────────────────
const MiniCard = ({ product }) => (
  <div className="miniCard">
    {product.discountPercent > 0 && (
      <div className="miniDiscount">{product.discountPercent}% OFF</div>
    )}
    <div className={`miniImage ${product.isService ? "miniImageService" : ""}`}>
      {product.isService ? "🖨️" : "🛍️"}
    </div>
    <div className="miniInfo">
      <div className="miniBrand">{product.brand}</div>
      <div className="miniName">{product.name}</div>
      <div className="miniPrice">
        ₹{product.price}
        {product.mrp > product.price && (
          <span className="miniMrp">₹{product.mrp}</span>
        )}
      </div>
    </div>
  </div>
);

// ─── Category Section ─────────────────────────────────────────
const colorMap = {
  "women-essentials":   { bg: "#fff7ed", accent: "#ea580c", light: "#ffedd5", badge: "#fed7aa" },
  "grocery-fmcg":       { bg: "#f0fdf4", accent: "#16a34a", light: "#dcfce7", badge: "#bbf7d0" },
  "household-essentials":{ bg: "#eff6ff", accent: "#2563eb", light: "#dbeafe", badge: "#bfdbfe" },
  "mobile-accessories": { bg: "#fdf4ff", accent: "#9333ea", light: "#f3e8ff", badge: "#e9d5ff" },
  "service-hub":        { bg: "#fff1f2", accent: "#e11d48", light: "#ffe4e6", badge: "#fecdd3" },
  "tailoring-accessories":{ bg: "#f0fdfa", accent: "#0d9488", light: "#ccfbf1", badge: "#99f6e4" },
};

const CategorySection = ({ cat, products, isActive, onToggle }) => {
  const colors = colorMap[cat.slug] || colorMap["women-essentials"];
  const subCats = [...new Set(products.map((p) => p.subCategory))];

  return (
    <div className="catSection" style={{ "--accent": colors.accent, "--bg": colors.bg, "--light": colors.light, "--badge": colors.badge }}>

      {/* Category Header */}
      <div className="catSectionHeader" onClick={onToggle}>
        <div className="catSectionLeft">
          <div className="catSectionIcon">{cat.icon}</div>
          <div className="catSectionText">
            <h2 className="catSectionName">{cat.name}</h2>
            <p className="catSectionDesc">{cat.description}</p>
            <div className="catSectionSubcats">
              {subCats.map((s) => (
                <span key={s} className="subcatTag">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="catSectionRight">
          <div className="catSectionCount">
            <span className="countNum">{products.length}</span>
            <span className="countLabel">Items</span>
          </div>
          <div className={`toggleIcon ${isActive ? "toggleIconOpen" : ""}`}>▼</div>
        </div>
      </div>

      {/* Products Grid - shown when expanded */}
      {isActive && (
        <div className="catSectionBody">
          {subCats.map((sub) => {
            const subProducts = products.filter((p) => p.subCategory === sub);
            return (
              <div key={sub} className="subCatGroup">
                <div className="subCatLabel">
                  <span className="subCatDot" />
                  {sub}
                  <span className="subCatCount">{subProducts.length}</span>
                </div>
                <div className="miniGrid">
                  {subProducts.map((p) => (
                    <MiniCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

// ─── Main Categories Page ─────────────────────────────────────
export default function Categories() {
  const [openCats, setOpenCats] = useState(
    Object.fromEntries(categories.map((c) => [c.slug, true]))
  );
  const [search, setSearch] = useState("");

  const toggleCat = (slug) => {
    setOpenCats((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const expandAll  = () => setOpenCats(Object.fromEntries(categories.map((c) => [c.slug, true])));
  const collapseAll= () => setOpenCats(Object.fromEntries(categories.map((c) => [c.slug, false])));

  // Filter products per category based on search
  const getProducts = (slug) => {
    let list = allProducts.filter((p) => p.category === slug);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  };

  const totalVisible = categories.reduce((acc, c) => acc + getProducts(c.slug).length, 0);

  return (
    <div className="categoriesPage">

      {/* ── PAGE HEADER ──────────────────────────────── */}
      <div className="catPageHeader">
        <div className="catPageHeaderInner">
          <div className="breadcrumb">🏠 Home &rsaquo; Categories</div>
          <h1 className="catPageTitle">Sab Categories 🗂️</h1>
          <p className="catPageSubtitle">
            {categories.length} categories • {allProducts.length} total items
          </p>

          {/* Search */}
          <div className="catSearchWrap">
            <span className="catSearchIcon">🔍</span>
            <input
              type="text"
              placeholder="Category mein search karo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="catSearchInput"
            />
            {search && (
              <button className="catSearchClear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          {search && (
            <p className="catSearchResult">{totalVisible} items mile "{search}" ke liye</p>
          )}
        </div>
      </div>

      {/* ── QUICK JUMP PILLS ─────────────────────────── */}
      <div className="quickJump">
        <div className="quickJumpInner">
          <span className="quickJumpLabel">Jump to:</span>
          {categories.map((cat) => (
            <a key={cat.id} href={`#${cat.slug}`} className="quickJumpPill">
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* ── EXPAND / COLLAPSE ALL ────────────────────── */}
      <div className="catControls">
        <div className="catControlsInner">
          <span className="catControlsInfo">
            <strong>{totalVisible}</strong> items dikh rahe hain
          </span>
          <div className="catControlsBtns">
            <button className="ctrlBtn" onClick={expandAll}>↓ Sab Kholna</button>
            <button className="ctrlBtn" onClick={collapseAll}>↑ Sab Band</button>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES LIST ──────────────────────────── */}
      <div className="catList">
        {categories.map((cat) => {
          const products = getProducts(cat.slug);
          if (products.length === 0 && search) return null;
          return (
            <div key={cat.id} id={cat.slug}>
              <CategorySection
                cat={cat}
                products={products}
                isActive={openCats[cat.slug]}
                onToggle={() => toggleCat(cat.slug)}
              />
            </div>
          );
        })}

        {totalVisible === 0 && search && (
          <div className="catEmptyState">
            <div className="catEmptyEmoji">🔍</div>
            <h3>Koi item nahi mila!</h3>
            <p>"{search}" ke liye kuch nahi mila</p>
            <button className="catResetBtn" onClick={() => setSearch("")}>
              Search Clear Karo
            </button>
          </div>
        )}
      </div>

    </div>
  );
}