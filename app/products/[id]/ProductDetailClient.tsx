"use client";

import {
  ArrowLeft,
  PackageX,
  RefreshCcw,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { AuthGuard } from "../../components/AuthGuard";
import { ProductDetailSkeleton } from "../../components/LoadingSkeletons";
import { ApiError, fetchProduct } from "../../lib/api";
import type { Product } from "../../types/product";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    // Reset request state synchronously whenever the product id changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError("");
    fetchProduct(productId)
      .then((result) => {
        if (isCurrent) setProduct(result);
      })
      .catch((requestError) => {
        if (!isCurrent) return;
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : "We could not load this product.",
        );
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [productId, requestKey]);

  return (
    <AuthGuard>
      <AppHeader />
      <main className="detail-shell">
        <Link className="back-link" href="/products">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to collection
        </Link>
        {isLoading ? <ProductDetailSkeleton /> : null}
        {!isLoading && error ? (
          <div className="state-panel">
            <div>
              {error.toLowerCase().includes("not found")
                ? <PackageX size={40} aria-hidden="true" />
                : <RefreshCcw size={38} aria-hidden="true" />}
              <h2>Product unavailable</h2>
              <p>{error}</p>
              <button className="button" type="button" onClick={() => setRequestKey((key) => key + 1)} style={{ marginTop: "1.2rem" }}>
                Try again
              </button>
            </div>
          </div>
        ) : null}
        {!isLoading && !error && product ? (
          <article className="product-detail">
            <div className="detail-media">
              {product.badge ? <span className="product-badge">{product.badge}</span> : null}
              {/* Mock product artwork is a remote SVG placeholder allowed by the brief. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} />
            </div>
            <div className="detail-content">
              <div className="detail-kicker">{product.category} · {product.brand}</div>
              <h1>{product.name}</h1>
              <div className="rating">
                <Star size={17} fill="currentColor" aria-hidden="true" />
                <strong>{product.rating.toFixed(1)}</strong>
                <span>({product.reviews} reviews)</span>
              </div>
              <p className="detail-description">{product.description}</p>
              <div className="detail-price-row">
                <span className="detail-price">{money.format(product.price)}</span>
                <span className="original-price">{money.format(product.originalPrice)}</span>
              </div>
              <dl className="detail-specs">
                <div className="spec"><dt>Color</dt><dd>{product.color}</dd></div>
                <div className="spec"><dt>SKU</dt><dd>{product.sku}</dd></div>
                <div className="spec"><dt>Brand</dt><dd>{product.brand}</dd></div>
                <div className="spec"><dt>Category</dt><dd>{product.category}</dd></div>
              </dl>
              <div className="stock-note">
                <span className={`stock-dot${product.inStock ? "" : " out"}`} aria-hidden="true" />
                {product.inStock ? `${product.stock} units ready to ship` : "Currently out of stock"}
              </div>
              <button className="button button-accent" type="button" disabled={!product.inStock}>
                <ShieldCheck size={18} aria-hidden="true" />
                {product.inStock ? "Reserve this object" : "Unavailable"}
              </button>
            </div>
          </article>
        ) : null}
      </main>
    </AuthGuard>
  );
}
