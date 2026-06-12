export default function ProductColorSwitcher({
  product,
  onImageSelect,
  currentImageIndex = 0,
  compact = false,
}) {
  if (!product) return null;

  const images = Array.isArray(product.images)
    ? product.images
    : product.image
      ? [product.image]
      : [];
  const colors = Array.isArray(product.colors)
    ? product.colors
    : product.color
      ? [product.color]
      : [];

  const base = import.meta.env.VITE_API_URL || "";

  return (
    <div className={`color-switcher ${compact ? "compact" : "full"}`}>
      {/* Main preview image if available */}
      {!compact && images.length > 0 && (
        <img
          src={`${base}/${images[currentImageIndex]}`}
          alt={product.name || "Product"}
          onError={(e) => (e.target.src = `${base}/image/fallback.jpg`)}
        />
      )}

      {/* If product colors exist, show color swatches instead of image thumbnails */}
      {colors && colors.length > 0 ? (
        <div className="product-choice-container">
          {colors.map((c, index) => (
            <button
              key={index}
              className={`choice-button ${currentImageIndex === index ? "active" : ""}`}
              onClick={() => onImageSelect?.(index)}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      ) : (
        images.length > 1 && (
          <div className="product-choice-container">
            {images.map((img, index) => {
              // handle full URLs, absolute paths, and relative paths from the API
              const imageUrl = img
                ? img.startsWith("http") || img.startsWith("/")
                  ? img
                  : `${base}/${img.replace(/^\//, "")}`
                : "";

              return (
                <button
                  key={index}
                  className={`choice-button ${currentImageIndex === index ? "active" : ""}`}
                  onClick={() => onImageSelect?.(index)}
                  style={{
                    backgroundSize: "cover",
                    backgroundImage: imageUrl
                      ? `url("${imageUrl}")`
                      : undefined,
                    backgroundPosition: "center",
                    backgroundColor: imageUrl ? undefined : "#f5f5f5",
                  }}
                  aria-label={`Select image ${index + 1}`}
                />
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
