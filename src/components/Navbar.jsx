import React from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="navbar">
      <div className="container nav-content">
        <NavLink to="/" className="logo">
          🛍️ ShopSphere
        </NavLink>

        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">Products</NavLink>

          <NavLink to="/categories">Categories</NavLink>

          <NavLink to="/cart">
            Cart
            <span className="cart-badge">{cartCount}</span>
          </NavLink>

          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
