import { useState } from 'react';

export default function ProductColorSwitcher({ product, onImageSelect, currentImageIndex = 0, compact = false }) {
	if (!product) return null;

	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];

	return (
		<div className={`color-switcher flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-2`}>
			{/* Optional large preview image (hidden in compact mode) */}
			{!compact && (
				<img
					src={
						images[currentImageIndex]
							? `${import.meta.env.VITE_API_URL}/image/product/${images[currentImageIndex].split('/').pop()}`
							: `${import.meta.env.VITE_API_URL}/image/fallback.jpg`
					}
					alt={product.name || 'Product'}
					className="w-64 h-64 object-cover rounded-xl shadow-md border"
					onError={(e) => (e.target.src = `${import.meta.env.VITE_API_URL}/image/fallback.jpg`)}
				/>
			)}

			{/* Color dots / image thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-2 mt-2">
					{images.map((img, index) => (
						<button
							key={index}
							onClick={() => onImageSelect?.(index)}
							className={`w-6 h-6 rounded-full border-2 ${
								currentImageIndex === index ? 'border-black scale-110' : 'border-gray-300'
							} transition-transform`}
							style={{
								backgroundImage: `url(${import.meta.env.VITE_API_URL}/image/product/${img.split('/').pop()})`,
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
