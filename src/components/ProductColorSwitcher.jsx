export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];

	return (
		<div className={`color-switcher flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-2`}>
			{!compact && (
				<img
					src={
						images[currentImageIndex]
							? `${import.meta.env.VITE_API_URL}/image/product/${images[currentImageIndex].split('/').pop()}`
							: `${import.meta.env.VITE_API_URL}/image/fallback.jpg`
					}
					alt={product.name || 'Product'}
					onError={(e) => (e.target.src = `${import.meta.env.VITE_API_URL}/image/fallback.jpg`)}
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
								backgroundImage: `url(${import.meta.env.VITE_API_URL}/${img})`,
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
