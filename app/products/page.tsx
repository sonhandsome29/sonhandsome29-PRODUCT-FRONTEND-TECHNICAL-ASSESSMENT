"use client";

import {
  ArrowLeft,
  ArrowRight,
  PackageSearch,
  RefreshCcw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { AuthGuard } from "../components/AuthGuard";
import { CatalogSkeleton } from "../components/LoadingSkeletons";
import { ProductCard } from "../components/ProductCard";
import { ApiError, fetchProducts } from "../lib/api";
import type { Product } from "../types/product";

const PAGE_SIZE = 12;
const categories = ["Audio", "Computing", "Desk", "Gaming", "Mobile", "Photography", "Smart Home", "Wearables"];
const brands = ["Auralab", "Forma", "Kite", "Monogram", "Nexa", "Orbit"];
type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("name_like", search);
    if (category) params.set("category_eq", category);
    if (brand) params.set("brand_eq", brand);
    if (availability) params.set("inStock_eq", availability);
    if (sort !== "featured") {
      const [field, order] = sort.split("-");
      params.set("sort", field);
      params.set("order", order);
    }
    return params;
  }, [availability, brand, category, page, search, sort]);

  useEffect(() => {
    let isCurrent = true;
    // Reset request state synchronously whenever the server query changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError("");
    fetchProducts(query)
      .then((result) => {
        if (!isCurrent) return;
        setProducts(result.items);
        setTotal(result.total);
      })
      .catch((requestError) => {
        if (!isCurrent) return;
        setError(requestError instanceof ApiError ? requestError.message : "We could not load the collection.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [query, requestKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(search || category || brand || availability);

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setBrand("");
    setAvailability("");
    setSort("featured");
    setPage(1);
  }

  return (
    <AuthGuard>
      <AppHeader />
      <main className="page-shell">
        <section className="catalog-hero">
          <div>
            <p className="eyebrow">The 2026 edit</p>
            <h1>Objects with purpose.</h1>
          </div>
          <div className="catalog-intro">
            <strong>{total || "120"} pieces</strong>
            A considered collection of technology that earns its place in your
            day. Useful, durable, and quietly distinctive.
          </div>
        </section>

        <section aria-labelledby="catalog-heading">
          <h2 className="sr-only" id="catalog-heading">Product catalog</h2>
          <div className="catalog-toolbar">
            <label className="search-field">
              <span className="sr-only">Search product name</span>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by product name..."
              />
            </label>
            <label>
              <span className="sr-only">Filter by category</span>
              <select
                className="filter-select"
                value={category}
                onChange={(event) => { setCategory(event.target.value); setPage(1); }}
              >
                <option value="">All categories</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by brand</span>
              <select
                className="filter-select"
                value={brand}
                onChange={(event) => { setBrand(event.target.value); setPage(1); }}
              >
                <option value="">All brands</option>
                {brands.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by availability</span>
              <select
                className="filter-select"
                value={availability}
                onChange={(event) => { setAvailability(event.target.value); setPage(1); }}
              >
                <option value="">Any availability</option>
                <option value="true">In stock</option>
                <option value="false">Out of stock</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Sort products</span>
              <select
                className="filter-select"
                value={sort}
                onChange={(event) => { setSort(event.target.value as SortOption); setPage(1); }}
              >
                <option value="featured">Featured first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating-desc">Highest rated</option>
              </select>
            </label>
          </div>

          <div className="active-filters" aria-live="polite">
            {hasFilters ? (
              <>
                <span>Showing {total} result{total === 1 ? "" : "s"}</span>
                <button className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button>
              </>
            ) : <span>Browse the complete collection</span>}
          </div>

          <div className="catalog-grid" aria-busy={isLoading}>
            {isLoading ? <CatalogSkeleton /> : null}
            {!isLoading && error ? (
              <div className="state-panel">
                <div>
                  <RefreshCcw size={36} aria-hidden="true" />
                  <h2>Connection interrupted</h2>
                  <p>{error}</p>
                  <button className="button" type="button" onClick={() => setRequestKey((key) => key + 1)} style={{ marginTop: "1.2rem" }}>
                    Try again
                  </button>
                </div>
              </div>
            ) : null}
            {!isLoading && !error && products.length === 0 ? (
              <div className="state-panel">
                <div>
                  <PackageSearch size={42} aria-hidden="true" />
                  <h2>No objects found</h2>
                  <p>Try a broader product name or clear one of the active filters.</p>
                  <button className="button button-ghost" type="button" onClick={clearFilters} style={{ marginTop: "1.2rem" }}>
                    Reset catalog
                  </button>
                </div>
              </div>
            ) : null}
            {!isLoading && !error
              ? products.map((product) => <ProductCard key={product.id} product={product} />)
              : null}
          </div>

          {!isLoading && !error && products.length > 0 ? (
            <nav className="pagination" aria-label="Product pagination">
              <button className="icon-button" type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <span>Page {page} of {totalPages}</span>
              <button className="icon-button" type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </nav>
          ) : null}
        </section>
      </main>
    </AuthGuard>
  );
}
