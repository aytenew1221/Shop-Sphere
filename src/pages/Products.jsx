import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

function Products() {
  // Store all products loaded from products.json
  const [products, setProducts] = useState([]);

  // Read and update URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Search state
  const [search, setSearch] = useState("");

  // Category state
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );

  // Sorting state
  const [sort, setSort] = useState("default");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/products.json", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        return response.json();
      })
      .then((data) => {
        // Make sure the JSON contains an array
        if (!Array.isArray(data)) {
          throw new Error("Product data must be an array.");
        }

        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        // Ignore error caused by cancelling the request
        if (err.name === "AbortError") {
          return;
        }

        setError(err.message);
        setLoading(false);
      });

    // Cancel fetch when component is removed
    return () => {
      controller.abort();
    };
  }, []);

  // CREATE CATEGORY LIST AUTOMATICALLY

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // HANDLE CATEGORY CHANGE

  function handleCategoryChange(value) {
    setCategory(value);

    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams);

    if (value === "All") {
      // Remove category from URL
      params.delete("category");
    } else {
      // Add category to URL
      params.set("category", value);
    }

    setSearchParams(params);
  }

  // FILTER PRODUCTS

  let filteredProducts = products.filter((product) => {
    // Convert product name to lowercase
    const productName = product.name?.toLowerCase() || "";

    // Convert category to lowercase
    const productCategory = product.category?.toLowerCase() || "";

    // Convert search text to lowercase
    const searchText = search.toLowerCase();

    /*
      Search works with:

      Product name
      OR
      Product category
    */
    const matchesSearch =
      productName.includes(searchText) || productCategory.includes(searchText);

    // Check category
    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // SORT PRODUCTS

  /*
    [...filteredProducts]

    creates a copy before sorting.

    This prevents us from changing the original
    products array stored in state.
  */

  filteredProducts = [...filteredProducts];

  // Lowest price first
  if (sort === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  // Highest price first
  if (sort === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Highest rating first
  if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // LOADING SCREEN

  if (loading) {
    return (
      <div className="loading">
        <p>Loading products...</p>
      </div>
    );
  }

  // ERROR SCREEN

  if (error) {
    return (
      <div className="error">
        <h2>Unable to Load Products</h2>
        <p>{error}</p>
      </div>
    );
  }

  // PAGE

  return (
    <section className="section">
      <div className="container">
        {/* PAGE HEADER */}
        <div className="page-heading">
          <h1>Shop Products</h1>

          <p>Find products available through ShopSphere Ethiopia.</p>
        </div>

        {/* FILTERS */}

        <div className="filters">
          {/* SEARCH */}
          <div className="filter-group">
            <label htmlFor="search">Search Products</label>

            <input
              id="search"
              name="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              autoComplete="off"
            />
          </div>

          {/* CATEGORY */}
          <div className="filter-group">
            <label htmlFor="category">Category</label>

            <select
              id="category"
              name="category"
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* SORT */}
          <div className="filter-group">
            <label htmlFor="sort">Sort</label>

            <select
              id="sort"
              name="sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="default">Default</option>

              <option value="low-high">Price Low → High</option>

              <option value="high-low">Price High → Low</option>

              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* RESULTS INFORMATION */}

        <div className="results-header">
          <p className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </p>

          {category !== "All" && (
            <p className="active-category">
              Category: <strong>{category}</strong>
            </p>
          )}
        </div>

        {/*PRODUCTS*/}

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="empty-state">
            <h2>No Products Found</h2>

            <p>No products match your search or selected category.</p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                handleCategoryChange("All");
                setSort("default");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
