import React from "react";
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h2>No products found</h2>
        <p>Try another search or select a different category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
