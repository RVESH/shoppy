import { HashRouter, Routes, Route } from "react-router-dom";
import * as pages from './../pages';
import Header from './../components/Header';
import Footer from './../components/Footer';

function App() {

return (
    <HashRouter>
                <Header />

    <Routes>
        <Route path="/" element={<pages.Home />} />
        <Route path="/products" element={<pages.Products />} />
        <Route path="/categories" element={<pages.Categories />} />
        <Route path="/product/:id" element={<pages.ProductDetail />} />
        <Route path="/services" element={<pages.Services />} />
    </Routes>
    <Footer />
    </HashRouter>
);



}
export default App;