// src/components/Header/index.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CartIcon from '../CartIcon';
import './style.scss';

const CATEGORIES = [
  { emoji: '💄', label: 'Women Essentials',          sub: 'Cosmetics, hair care & jewellery',       slug: 'women-essentials'    },
  { emoji: '🛒', label: 'Grocery & FMCG',            sub: 'Snacks, staples & daily items',           slug: 'grocery-fmcg'        },
  { emoji: '🏠', label: 'Household Essentials',       sub: 'Cleaning, containers & home utilities',  slug: 'household-essentials'},
  { emoji: '📱', label: 'Mobile Accessories',         sub: 'Chargers, earphones & cables',           slug: 'mobile-accessories'  },
  { emoji: '🖨️', label: 'Service Hub',               sub: 'Printing, govt services & digital help', slug: 'service-hub'         },
  { emoji: '🧵', label: 'Tailoring & Accessories',   sub: 'Threads, buttons, zips & stitching',      slug: 'tailoring-accessories'},
];

export default function Header() {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [catOpen,       setCatOpen]       = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [searchVal,     setSearchVal]     = useState('');
  const [searchFocus,   setSearchFocus]   = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const catRef   = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    setMobileCatOpen(false);
  }, [location.pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMobileOpen(false);
    }
  }

  function goToCategory(slug) {
    navigate(`/products?category=${slug}`);
    setCatOpen(false);
    setMobileOpen(false);
    setMobileCatOpen(false);
  }

  const active = (path) => location.pathname === path;

  return (
    <>
      <header className={`hdr ${scrolled ? 'hdr--up' : ''}`}>

        {/* ── Top accent line ── */}
        <div className="hdr-topline" />

        <div className="hdr-wrap">

          {/* ── Logo ─────────────────────────────── */}
          <Link to="/" className="hdr-logo">
            <div className="hdr-logo-mark">
              <span>🛍️</span>
            </div>
            <div className="hdr-logo-words">
              <span className="hdr-logo-sl">SL</span>
              <span className="hdr-logo-cart">Cart</span>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────── */}
          <nav className="hdr-nav" aria-label="Main navigation">

            <Link to="/" className={`hdr-navlink ${active('/') ? 'hdr-navlink--on' : ''}`}>
              Home
            </Link>

            <Link to="/products" className={`hdr-navlink ${active('/products') ? 'hdr-navlink--on' : ''}`}>
              Products
            </Link>

            {/* Categories mega dropdown */}
            <div className="hdr-drop" ref={catRef}>
              <button
                className={`hdr-navlink hdr-navlink--btn ${catOpen || active('/categories') ? 'hdr-navlink--on' : ''}`}
                onClick={() => setCatOpen(o => !o)}
                aria-expanded={catOpen}
              >
                Categories
                <svg className={`hdr-chevron ${catOpen ? 'hdr-chevron--flip' : ''}`}
                  width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              <div className={`hdr-mega ${catOpen ? 'hdr-mega--open' : ''}`} role="menu">
                <div className="hdr-mega-grid">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.slug}
                      className="hdr-mega-item"
                      onClick={() => goToCategory(cat.slug)}
                      role="menuitem"
                    >
                      <span className="hdr-mega-emoji">{cat.emoji}</span>
                      <div className="hdr-mega-text">
                        <span className="hdr-mega-name">{cat.label}</span>
                        <span className="hdr-mega-sub">{cat.sub}</span>
                      </div>
                      <svg className="hdr-mega-arr" width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="hdr-mega-footer">
                  <Link to="/categories" onClick={() => setCatOpen(false)} className="hdr-mega-all">
                    Saari Categories Dekho
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/services" className={`hdr-navlink ${active('/services') ? 'hdr-navlink--on' : ''}`}>
              Services
            </Link>

            <Link to="/contact" className={`hdr-navlink ${active('/contact') ? 'hdr-navlink--on' : ''}`}>
              Contact
            </Link>

          </nav>

          {/* ── Search bar ────────────────────────── */}
          <form
            className={`hdr-search ${searchFocus ? 'hdr-search--focus' : ''}`}
            onSubmit={handleSearch}
          >
            <svg className="hdr-search-ico" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="hdr-search-input"
              placeholder="Search products, brands…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              aria-label="Search"
            />
            {searchVal && (
              <button type="button" className="hdr-search-clear" onClick={() => setSearchVal('')}>×</button>
            )}
          </form>

          {/* ── Right actions ─────────────────────── */}
          <div className="hdr-right">
            <CartIcon />
            <button
              className={`hdr-burger ${mobileOpen ? 'hdr-burger--x' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Menu band karo' : 'Menu kholo'}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile backdrop ───────────────────────── */}
      <div
        className={`hdr-veil ${mobileOpen ? 'hdr-veil--show' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ─────────────────────────── */}
      <aside className={`hdr-drawer ${mobileOpen ? 'hdr-drawer--open' : ''}`} aria-label="Mobile menu">

        {/* Drawer header */}
        <div className="hdr-drawer-top">
          <div className="hdr-drawer-brand">
            <span>🛍️</span>
            <span>SL <em>Cart</em></span>
          </div>
          <button className="hdr-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Band karo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Mobile search */}
        <form className="hdr-drawer-search" onSubmit={handleSearch}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Products search karo…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
          {searchVal
            ? <button type="button" onClick={() => setSearchVal('')}>×</button>
            : <button type="submit">→</button>
          }
        </form>

        {/* Mobile links */}
        <nav className="hdr-drawer-nav">

          <Link to="/"         className={`hdr-dlink ${active('/')         ? 'hdr-dlink--on' : ''}`}>
            <span className="hdr-dlink-emoji">🏠</span> Home
          </Link>

          <Link to="/products" className={`hdr-dlink ${active('/products') ? 'hdr-dlink--on' : ''}`}>
            <span className="hdr-dlink-emoji">🛍️</span> Products
          </Link>

          {/* Categories accordion */}
          <div className="hdr-dacc">
            <button
              className={`hdr-dlink hdr-dlink--acc ${mobileCatOpen ? 'hdr-dlink--on' : ''}`}
              onClick={() => setMobileCatOpen(o => !o)}
            >
              <span><span className="hdr-dlink-emoji">📂</span> Categories</span>
              <svg className={`hdr-chevron ${mobileCatOpen ? 'hdr-chevron--flip' : ''}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            <div className={`hdr-dacc-body ${mobileCatOpen ? 'hdr-dacc-body--open' : ''}`}>
              {CATEGORIES.map(cat => (
                <button key={cat.slug} className="hdr-dcat" onClick={() => goToCategory(cat.slug)}>
                  <span className="hdr-dcat-emoji">{cat.emoji}</span>
                  <span className="hdr-dcat-name">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Link to="/services" className={`hdr-dlink ${active('/services') ? 'hdr-dlink--on' : ''}`}>
            <span className="hdr-dlink-emoji">💻</span> Services
          </Link>

          <Link to="/contact"  className={`hdr-dlink ${active('/contact')  ? 'hdr-dlink--on' : ''}`}>
            <span className="hdr-dlink-emoji">📞</span> Contact
          </Link>

        </nav>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/919999999999"
          target="_blank" rel="noopener noreferrer"
          className="hdr-drawer-wa"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp Pe Baat Karo
        </a>

      </aside>
    </>
  );
}