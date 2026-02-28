import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.scss';
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">SL Cart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>Products</Link>
          <Link to="/categories" className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}>Categories</Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </nav>

        {/* Search */}
        <div className="search-box">
          <input type="text" placeholder="Search products, brands..." className="search-input" />
          <button className="search-button">🔍</button>
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="header-actions">
          {/* <a href="https://wa.me/919431234567?text=Hi%20Shoppy!%20I%20want%20to%20buy" 
             className="whatsapp-cta" 
             target="_blank" rel="noopener noreferrer">
            Order Now
          </a> */}
          <button className={`mobile-toggle ${mobileOpen ? 'open' : ''}`} onClick={toggleMobile}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
        <Link to="/products" className="mobile-link" onClick={() => setMobileOpen(false)}>🛒 Products</Link>
        <Link to="/categories" className="mobile-link" onClick={() => setMobileOpen(false)}>📂 Categories</Link>
        <Link to="/services" className="mobile-link" onClick={() => setMobileOpen(false)}>💻 Services</Link>
        <Link to="/contact" className="mobile-link" onClick={() => setMobileOpen(false)}>📞 Contact</Link>
        {/* <a href="https://wa.me/919431234567?text=Hi%20Shoppy!" className="mobile-whatsapp" target="_blank" rel="noopener noreferrer">
          💬 Order on WhatsApp
        </a> */}
      </div>
    </header>
  );
};

export default Header;
