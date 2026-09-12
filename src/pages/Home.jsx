import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.filter((product) => product.rating >= 4.8);

  if (loading) {
    return <div className="loading">Loading ShopSphere...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <p className="hero-label">🇪🇹 SHOP LOCAL • SHOP SMART</p>

            <h1>
              Everything You Need,
              <span> Delivered Across Ethiopia</span>
            </h1>

            <p>
              Discover electronics, fashion, beauty products, Ethiopian coffee,
              groceries and more.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>

              <Link to="/categories" className="btn btn-secondary">
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div>🛍️</div>
            <h2>ShopSphere Ethiopia</h2>
            <p>Your online marketplace for everyday shopping.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Featured Products</h2>

            <Link to="/products">View All →</Link>
          </div>

          <ProductGrid products={featuredProducts.slice(0, 4)} />
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <h2 className="center">Shop by Category</h2>

          <div className="category-grid">
            <Link to="/products?category=Electronics">
              📱
              <span>Electronics</span>
            </Link>

            <Link to="/products?category=Clothing">
              👕
              <span>Clothing</span>
            </Link>

            <Link to="/products?category=Beauty">
              💄
              <span>Beauty</span>
            </Link>

            <Link to="/products?category=Groceries">
              🛒
              <span>Groceries</span>
            </Link>

            <Link to="/products?category=Home">
              🏠
              <span>Home</span>
            </Link>

            <Link to="/products?category=Fashion">
              👜
              <span>Fashion</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="promo">
        <div className="container">
          <h2>🇪🇹 Made for Ethiopian Shoppers</h2>

          <p>
            Shop conveniently from Addis Ababa and discover products that fit
            your everyday needs.
          </p>

          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
