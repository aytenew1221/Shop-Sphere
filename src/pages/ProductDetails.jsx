import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load product.");
        }

        return response.json();
      })
      .then((data) => {
        const foundProduct = data.find((item) => item.id === Number(id));

        if (!foundProduct) {
          throw new Error("Product not found.");
        }

        setProduct(foundProduct);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Product not found</h2>
        <p>{error}</p>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="details">
          <div className="details-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="details-content">
            <span className="category">{product.category}</span>

            <h1>{product.name}</h1>

            <p className="rating">⭐ {product.rating} / 5</p>

            <p className="details-price">
              {product.price.toLocaleString()} ETB
            </p>

            <p className="description">{product.description}</p>

            <div className="delivery-box">
              🚚 Delivery available in Addis Ababa
              <br />
              💳 Payment options available at checkout
            </div>

            <button
              className="btn btn-primary large-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
