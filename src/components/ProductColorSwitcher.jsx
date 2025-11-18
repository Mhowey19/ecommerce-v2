export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];

	const base = import.meta.env.VITE_API_URL;

	return (
		<div className={`color-switcher flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-2`}>
			{/* Main preview image */}
			{!compact && (
				<img
					src={`${base}/${images[currentImageIndex]}`}
					alt={product.name || 'Product'}
					onError={(e) => (e.target.src = `${base}/image/fallback.jpg`)}
				/>
			)}

			{/* Thumbnail buttons */}
			{images.length > 1 && (
				<div className="product-choice-container">
					{images.map((img, index) => (
						<button
							key={index}
							className="choice-button"
							onClick={() => onImageSelect?.(index)}
							style={{
								backgroundImage: `url(${base}/${img})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
}
