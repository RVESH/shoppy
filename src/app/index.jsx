import { HashRouter, Routes, Route } from "react-router-dom";
import * as pages from './../pages';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Cart from '../components/Cart';
import { CartProvider } from '../components/CartContext';

function App() {

return (
        <CartProvider>

    <HashRouter>
                <Header />

    <Routes>

        <Route path="/" element={<pages.Home />} />
        <Route path="/products" element={<pages.Products />} />
        <Route path="/categories" element={<pages.Categories />} />
        <Route path="/product/:id" element={<pages.ProductDetail />} />
        <Route path="/services" element={<pages.Services />} />
        <Route path="/contact" element={<pages.Contact />} />
        <Route path="admin" element={<pages.Admin />} />
    </Routes>
              <Cart />

    <Footer />
    </HashRouter>
            </CartProvider>

);



}
export default App;