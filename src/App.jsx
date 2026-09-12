import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="products" element={<Products />} />

        <Route path="products/:id" element={<ProductDetails />} />

        <Route path="categories" element={<Categories />} />

        <Route path="cart" element={<Cart />} />

        <Route path="checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="about" element={<About />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
