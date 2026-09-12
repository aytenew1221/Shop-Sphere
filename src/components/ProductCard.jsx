import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-card-body">
        <span className="category">{product.category}</span>

        <h3>{product.name}</h3>

        <p className="rating">⭐ {product.rating}</p>

        <p className="price">{product.price.toLocaleString()} ETB</p>

        <div className="card-actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary">
            View Details
          </Link>

          <button
            onClick={() => addToCart(product)}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
