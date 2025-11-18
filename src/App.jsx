import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from './ScrollToTop'; // Your new component

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Collection from "./pages/Collection";
import CheckoutPage from "./pages/CheckoutPage";
import Orders from "./pages/Orders";   // ✅ Re-enabled
import Logout from "./COMPONENTS/Logout";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Navbar from "./COMPONENTS/Navbar";
import Footer from "./COMPONENTS/Footer";
import SearchBar from "./COMPONENTS/SearchBar";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <SearchBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkoutPage" element={<CheckoutPage />} />
        <Route path="/orders" element={<Orders />} />  {/* ✅ Fixed route */}
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />      {/* optional catch-all */}
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

// Optional 404 fallback
const NotFound = () => (
  <div className="flex justify-center items-center h-[80vh] text-gray-500 text-2xl">
    404 – Page Not Found
  </div>
);

export default App;
