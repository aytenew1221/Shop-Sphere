import React from "react";
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      name: "Electronics",
      icon: "📱",
      description: "Phones, laptops, headphones and other technology.",
    },
    {
      name: "Clothing",
      icon: "👕",
      description: "Clothes and Ethiopian-inspired fashion.",
    },
    {
      name: "Beauty",
      icon: "💄",
      description: "Beauty and personal care products.",
    },
    {
      name: "Fashion",
      icon: "👜",
      description: "Bags and fashion accessories.",
    },
    {
      name: "Home",
      icon: "🏠",
      description: "Home products and Ethiopian coffee items.",
    },
    {
      name: "Groceries",
      icon: "🛒",
      description: "Coffee, teff and everyday grocery products.",
    },
    {
      name: "Accessories",
      icon: "🎒",
      description: "Useful accessories for school, work and travel.",
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading">
          <h1>Product Categories</h1>

          <p>Explore ShopSphere's product categories.</p>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>

              <h2>{category.name}</h2>

              <p>{category.description}</p>

              <span>Browse →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
