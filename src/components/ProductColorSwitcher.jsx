export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	// Ensure images is always an array
	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];

	const base = import.meta.env.VITE_API_URL;

	// Helper to build full URL
	const getImageUrl = (img) => `${base}/${img}`; // img should be "image/product/filename.jpg"

	return (
		<div className={`color-switcher flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-2`}>
			{/* Main product image */}
			{!compact && images[currentImageIndex] && (
				<img
					src={getImageUrl(images[currentImageIndex])}
					alt={product.name || 'Product'}
					onError={(e) => (e.target.src = `${base}/image/fallback.jpg`)}
				/>
			)}

			{/* Thumbnail buttons */}
			{images.length > 1 && (
				<div className="product-choice-container flex gap-2">
					{images.map((img, index) => (
						<button
							key={index}
							className="choice-button w-10 h-10 rounded border"
							onClick={() => onImageSelect?.(index)}
							style={{
								backgroundImage: `url(${getImageUrl(img)})`,
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
