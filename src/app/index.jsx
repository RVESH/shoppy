import { HashRouter, Routes, Route } from "react-router-dom";
import * as pages from './../pages';
import Header  from './../components/Header';
import Footer  from './../components/Footer';
import Cart    from '../components/Cart';

import { CartProvider }     from '../components/CartContext';
import { WishlistProvider } from '../components/WishlistSave';
import { OrderProvider }    from '../components/OrderHistory';
import { RecentProvider }   from '../components/RecentlyViewed';
import { AuthProvider }     from '../components/AuthContext';

import Signup        from '../pages/Signup';
import Login         from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import UserDashboard from '../pages/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <RecentProvider>
              <HashRouter>
                <Header />
                <Routes>
                  <Route path="/"            element={<pages.Home />} />
                  <Route path="/products"    element={<pages.Products />} />
                  <Route path="/categories"  element={<pages.Categories />} />
                  <Route path="/product/:id" element={<pages.ProductDetail />} />
                  <Route path="/services"    element={<pages.Services />} />
                  <Route path="/contact"     element={<pages.Contact />} />
                  <Route path="/admin"       element={<pages.Admin />} />

                  <Route path="/signup"          element={<Signup />} />
                  <Route path="/login"           element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard"       element={<UserDashboard />} />
                </Routes>
                <Cart />
                <Footer />
              </HashRouter>
            </RecentProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;