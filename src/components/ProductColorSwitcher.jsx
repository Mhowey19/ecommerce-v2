export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	const images = Array.isArray(product.images)
		? product.images.map((img) => img.img_path) // grab the API path directly
		: product.image
		? [product.image]
		: [];

	return (
		<div className={`color-switcher flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-2`}>
			{!compact && (
				<img
					src={
						images[currentImageIndex]
							? `${import.meta.env.VITE_API_URL}/${images[currentImageIndex]}`
							: `${import.meta.env.VITE_API_URL}/image/fallback.jpg`
					}
					alt={product.name || 'Product'}
					onError={(e) => (e.target.src = `${import.meta.env.VITE_API_URL}/image/fallback.jpg`)}
				/>
			)}

			{images.length > 1 && (
				<div className="product-choice-container">
					{images.map((img, index) => (
						<button
							key={index}
							className="choice-button"
							onClick={() => onImageSelect?.(index)}
							style={{
								backgroundImage: `url(${import.meta.env.VITE_API_URL}/${img})`,
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
