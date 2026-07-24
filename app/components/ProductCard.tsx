import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import type { Product } from "../types/product";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        className="product-media"
        href={`/products/${product.id}`}
        aria-label={`View ${product.name}`}
      >
        {product.badge ? (
          <span className="product-badge">{product.badge}</span>
        ) : null}
        {/* Mock product artwork is a remote SVG placeholder allowed by the brief. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span className="rating">
            <Star size={13} fill="currentColor" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h2>
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h2>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="price">{money.format(product.price)}</span>
          <Link className="view-link" href={`/products/${product.id}`}>
            View detail <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
