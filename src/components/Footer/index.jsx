// src/components/Footer.jsx - Home Delivery REMOVED
import { Link } from 'react-router-dom';
import './style.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Sections */}
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">

            <p className="brand-tagline">
              Everything you need. One place. Visit us today!
            </p>
            <div className="contact-quick">
              <a href="tel:+919431234567" className="contact-link">📞 94312 34567</a>
              <span className="store-info">🛒 Visit Our Store</span>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-section">
            <h3 className="section-title">Shop</h3>
            <Link to="/cosmetics" className="link-item">💄 Cosmetics</Link>
            <Link to="/snacks" className="link-item">🍫 Snacks</Link>
            <Link to="/daily-use" className="link-item">🧴 Daily Use</Link>
            <Link to="/grocery" className="link-item">🛒 Grocery</Link>
            <Link to="/home-care" className="link-item">🏠 Home Care</Link>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="section-title">Services</h3>
            <Link to="/track" className="link-item">📋 Order Status</Link>
            <Link to="/offers" className="link-item">🎉 Today's Offers</Link>
            <a href="/contact" className="link-item">📞 Contact Us</a>
            <Link to="/store" className="link-item">📍 Store Location</Link>
          </div>

          {/* Account */}
          <div className="footer-section">
            <h3 className="section-title">Account</h3>
            <a href="/login" className="link-item">👤 Login</a>
            <a href="/orders" className="link-item">📋 My Orders</a>
            <a href="/returns" className="link-item">↩️ Returns</a>
            <a href="/wishlist" className="link-item">❤️ Wishlist</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright">
            © 2026 SL Cart. Made in Patna with ❤️
          </div>
          <div className="payment-methods">
            💳 Cards • 📱 UPI • 💰 Cash Payment
          </div>
          <div className="legal-links">
            <a href="/privacy" className="legal-link">Privacy</a>
            <a href="/terms" className="legal-link">Terms</a>
            <a href="/returns" className="legal-link">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
