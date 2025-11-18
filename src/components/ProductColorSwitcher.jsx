export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];

	const base = import.meta.env.VITE_API_URL;
	console.log(base);
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
			{console.log(`${base}/${product.images[1]}`)}

			{/* Thumbnail buttons */}
			{images.length > 1 && (
				<div className="product-choice-container">
					{images.map((img, index) => {
						console.log('img:', img); // Works!
						return (
							<button
								key={index}
								className="choice-button"
								onClick={() => onImageSelect?.(index)}
								style={{
									backgroundSize: 'cover',
									backgroundImage: `url(${base}/${img})`,
									backgroundPosition: 'center',
								}}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
