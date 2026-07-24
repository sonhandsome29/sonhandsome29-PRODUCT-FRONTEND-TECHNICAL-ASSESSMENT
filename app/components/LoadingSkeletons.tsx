const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`skeleton-block ${className}`} aria-hidden="true" />;
}

export function SessionSkeleton() {
  return (
    <main className="session-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Checking your session...</span>
      <div className="session-skeleton-header" aria-hidden="true">
        <div className="session-skeleton-brand">
          <SkeletonBlock className="skeleton-circle skeleton-logo" />
          <SkeletonBlock className="skeleton-line skeleton-line-brand" />
        </div>
        <div className="session-skeleton-user">
          <SkeletonBlock className="skeleton-circle" />
          <SkeletonBlock className="skeleton-line skeleton-line-user" />
          <SkeletonBlock className="skeleton-pill skeleton-action" />
        </div>
      </div>
      <div className="session-skeleton-content" aria-hidden="true">
        <SkeletonBlock className="skeleton-line skeleton-line-kicker" />
        <SkeletonBlock className="skeleton-line skeleton-line-heading" />
        <SkeletonBlock className="skeleton-line skeleton-line-heading-short" />
      </div>
    </main>
  );
}

export function CatalogSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      <span className="sr-only" role="status">
        Loading products...
      </span>
      {skeletonRows.slice(0, count).map((index) => (
        <article
          className="product-card product-card-skeleton"
          key={index}
          aria-hidden="true"
        >
          <div className="product-skeleton-media">
            <SkeletonBlock className="skeleton-product-shape" />
          </div>
          <div className="product-card-body product-skeleton-body">
            <div className="product-skeleton-meta">
              <SkeletonBlock className="skeleton-line skeleton-line-meta" />
              <SkeletonBlock className="skeleton-line skeleton-line-rating" />
            </div>
            <SkeletonBlock className="skeleton-line skeleton-line-title" />
            <SkeletonBlock className="skeleton-line skeleton-line-copy" />
            <SkeletonBlock className="skeleton-line skeleton-line-copy-short" />
            <div className="product-skeleton-footer">
              <SkeletonBlock className="skeleton-line skeleton-line-price" />
              <SkeletonBlock className="skeleton-pill skeleton-link" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

export function ProductDetailSkeleton() {
  return (
    <article
      className="product-detail detail-skeleton"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading product details...</span>
      <div className="detail-skeleton-media" aria-hidden="true">
        <SkeletonBlock className="skeleton-product-shape skeleton-product-shape-large" />
      </div>
      <div className="detail-content detail-skeleton-content" aria-hidden="true">
        <SkeletonBlock className="skeleton-line skeleton-line-kicker" />
        <SkeletonBlock className="skeleton-line skeleton-detail-title" />
        <SkeletonBlock className="skeleton-line skeleton-detail-title-short" />
        <SkeletonBlock className="skeleton-line skeleton-line-rating-detail" />
        <div className="detail-skeleton-copy">
          <SkeletonBlock className="skeleton-line skeleton-line-copy" />
          <SkeletonBlock className="skeleton-line skeleton-line-copy" />
          <SkeletonBlock className="skeleton-line skeleton-line-copy-short" />
        </div>
        <SkeletonBlock className="skeleton-line skeleton-detail-price" />
        <div className="detail-specs">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="spec skeleton-spec" key={index}>
              <SkeletonBlock className="skeleton-line skeleton-line-spec-label" />
              <SkeletonBlock className="skeleton-line skeleton-line-spec-value" />
            </div>
          ))}
        </div>
        <SkeletonBlock className="skeleton-pill skeleton-detail-action" />
      </div>
    </article>
  );
}
