export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];
	const base = import.meta.env.VITE_API_URL;
	return (
		<div className={`color-switcher flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-2`}>
			{!compact && (
				<img
					src={`${base}${images[currentImageIndex].split('/').pop()}`}
					alt={product.name || 'Product'}
					onError={(e) => (e.target.src = `${base}/image/fallback.jpg`)}
				/>
			)}

			{/* Color dots / image thumbnails */}
			{images.length > 1 && (
				<div className="product-choice-container">
					{images.map((img, index) => (
						<button
							className="choice-button"
							key={index}
							onClick={() => onImageSelect?.(index)}
							style={{
								backgroundImage: `url(${base}/${img})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						></button>
					))}
				</div>
			)}
		</div>
	);
}
