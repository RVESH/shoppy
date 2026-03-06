import { useState, useEffect } from "react";
import { fetchProducts, fetchCategories } from "../../api/api.js";
import styles from "./index.module.scss";
import ProductView from "../../components/ProductView";

// ─── Star Rating ─────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span className={styles.stars}>
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    <span className={styles.starsCount}>({rating})</span>
  </span>
);

// ─── Product Card ─────────────────────────────────────────────
const ProductCard = ({ product, onClick }) => (
  <div className={styles.productCard} onClick={() => onClick && onClick(product)}>
    {product.discountPercent > 0 && (
      <div className={styles.discountBadge}>{product.discountPercent}% OFF</div>
    )}
    <div className={styles.productImageBox}>🛍️</div>
    <div className={styles.productInfo}>
      <div className={styles.productBrand}>{product.brand}</div>
      <div className={styles.productName}>{product.name}</div>
      <Stars rating={product.rating} />
      <div className={styles.productPricing}>
        <span className={styles.productPrice}>₹{product.price}</span>
        {product.mrp > product.price && (
          <span className={styles.productMrp}>₹{product.mrp}</span>
        )}
      </div>
    </div>
  </div>
);

// ─── Category Card ────────────────────────────────────────────
const colorKeys = ["catOrange","catBlue","catGreen","catPurple","catPink","catTeal"];

const CategoryCard = ({ cat, index }) => (
  <div className={`${styles.categoryCard} ${styles[colorKeys[index % 6]]}`}>
    <div className={styles.categoryIcon}>{cat.icon}</div>
    <div className={styles.categoryName}>{cat.name}</div>
    <div className={styles.categoryDesc}>{cat.description}</div>
  </div>
);

// ─── Service Card ─────────────────────────────────────────────
const ServiceCard = ({ service, onClick }) => (
  <div className={styles.serviceCard} onClick={() => onClick && onClick(service)}>
    <div className={styles.serviceIconBox}>🖨️</div>
    <div className={styles.serviceName}>{service.name}</div>
    <div className={styles.serviceDesc}>{service.description}</div>
    <div className={styles.servicePrice}>
      Starting ₹{service.price}
      {service.priceType === "variable" ? "+" : ""}
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────
const SectionHeader = ({ label, title, sub }) => (
  <div className={styles.sectionHeader}>
    <span className={styles.sectionLabel}>{label}</span>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <p className={styles.sectionSub}>{sub}</p>
  </div>
);

// ─── WhatsApp SVG ─────────────────────────────────────────────
const WaSvg = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Main Home Page ───────────────────────────────────────────
export default function Home() {
  const [heroVisible, setHeroVisible]   = useState(false);
  const [allProducts, setAllProducts]   = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [popupProduct, setPopupProduct] = useState(null);
  const [wishlist, setWishlist]         = useState([]);

  const toggleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, cats] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setAllProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setHeroVisible(true), 100);
      }
    }
    loadData();
  }, []);

  const featuredProducts = allProducts
    .filter((p) => !p.isService)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const topServices = allProducts
    .filter((p) => p.isService)
    .slice(0, 4);

  return (
    <div className={styles.page}>

      {/* ── PRODUCT POPUP ────────────────────────────── */}
      {popupProduct && (
        <ProductView
          product={popupProduct}
          onClose={() => setPopupProduct(null)}
          onWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(popupProduct?.id)}
        />
      )}

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBgCircles}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${styles.bgCircle} ${styles["bgCircle" + i]}`} />
          ))}
        </div>

        <div className={`${styles.heroInner} ${heroVisible ? styles.heroVisible : ""}`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>🏪 Local Store + Online Shop</div>
            <h1 className={styles.heroTitle}>
              Apna{" "}
              <span className={styles.heroHighlight}>
                SL Cart
                <svg className={styles.underlineSvg} viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 Q50 2 100 6 Q150 10 198 4" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />Sabka Dukan! 🛒
            </h1>
            <p className={styles.heroSubtext}>
              Groceries se lekar tailoring tak — sab ek hi jagah! Physical store
              aur online dono available. Apne ghar baithe order karo ya seedha aao!
            </p>
            <div className={styles.heroBtns}>
              <button className={styles.btnPrimary}>🛍️ Products Dekho</button>
              <button className={styles.btnOutline}>📞 Contact Karo</button>
            </div>
            <div className={styles.heroStats}>
              {[
                { num: "75+", label: "Products" },
                { num: "6",   label: "Categories" },
                { num: "10+", label: "Services" },
              ].map((s) => (
                <div key={s.label} className={styles.statItem}>
                  <div className={styles.statNum}>{s.num}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.orbitWrapper}>
              <div className={styles.orbitCore}>🛒</div>
              {["💄","🥗","🏠","📱","🖨️","🧵"].map((icon, i) => {
                const angle = (i / 6) * 2 * Math.PI;
                const x = 145 * Math.cos(angle);
                const y = 145 * Math.sin(angle);
                return (
                  <div key={i} className={styles.orbitBadge} style={{ "--tx": `${x}px`, "--ty": `${y}px` }}>
                    {icon}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <div className={styles.marqueeStrip}>
        <div className={styles.marqueeTrack}>
          {[...Array(2)].map((_, ri) =>
            ["🛒 Free Delivery","💄 Women Essentials","🥗 Fresh Grocery",
             "📱 Mobile Accessories","🖨️ Printing & Services",
             "🧵 Tailoring","🏠 Household Items","⭐ Top Rated Products"
            ].map((t, i) => (
              <span key={`${ri}-${i}`} className={styles.marqueeItem}>
                {t} <span className={styles.marqueeSep}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader label="Browse Categories" title="Kya Dhundh Rahe Ho? 🔍" sub="Apni zaroorat ke hisaab se category chuniye" />
          {loading ? (
            <div className={styles.loadingRow}>Loading categories...</div>
          ) : (
            <div className={styles.categoryGrid}>
              {categories.map((cat, i) => (
                <CategoryCard key={cat.id} cat={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────── */}
      <section className={`${styles.section} ${styles.bgWhite}`}>
        <div className={styles.container}>
          <SectionHeader label="Featured Products" title="Top Picks Tumhare Liye ⭐" sub="Sabse zyada pasand kiye gaye products" />
          {loading ? (
            <div className={styles.loadingRow}>Loading products...</div>
          ) : (
            <div className={styles.productGrid}>
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={(product) => setPopupProduct(product)}
                />
              ))}
            </div>
          )}
          <div className={styles.centerBtn}>
            <button className={styles.btnOutlineDark}>Sab Products Dekho →</button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader label="Our Services" title="Digital Seva Hub 🖨️" sub="PAN card se resume tak — sab kuch ek hi jagah" />
          {loading ? (
            <div className={styles.loadingRow}>Loading services...</div>
          ) : (
            <div className={styles.serviceGrid}>
              {topServices.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  onClick={(service) => setPopupProduct(service)}
                />
              ))}
            </div>
          )}
          <div className={styles.centerBtn}>
            <button className={styles.btnPrimary}>Sab Services Dekho →</button>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA ─────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaEmoji}>💬</div>
          <h2 className={styles.ctaTitle}>Seedha WhatsApp Karo!</h2>
          <p className={styles.ctaSub}>
            Koi bhi sawaal ho, order karna ho, ya koi service chahiye — hum
            WhatsApp pe available hain. Turat reply guarantee!
          </p>
          <a href="https://wa.me/919798855030" target="_blank" rel="noreferrer" className={styles.ctaWaBtn}>
            <WaSvg size={22} />
            WhatsApp pe Message Karo
          </a>
        </div>
      </section>

      {/* ── FLOATING WA BUTTON ───────────────────────── */}
      <a href="https://wa.me/919798855030" target="_blank" rel="noreferrer" className={styles.floatingWa}>
        <div className={styles.floatingPulse} />
        <WaSvg size={30} />
      </a>

    </div>
  );
}