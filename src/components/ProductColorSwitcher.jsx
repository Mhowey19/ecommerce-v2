import { useState } from 'react';

export default function ProductColorSwitcher({ product }) {
	if (!product) return null;

	// Ensure we have a valid images array
	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];

	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handleImageSelect = (index) => {
		setCurrentImageIndex(index);
	};

	return (
		<div className="color-switcher flex flex-col items-center gap-2">
			{/* Main Product Image */}
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

			{/* Color Dots / Thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-2 mt-2">
					{images.map((img, index) => (
						<button
							key={index}
							onClick={() => handleImageSelect(index)}
							className={`w-6 h-6 rounded-full border-2 ${
								currentImageIndex === index ? 'border-black scale-110' : 'border-gray-300'
							} transition-transform`}
							style={{
								backgroundImage: `url(${import.meta.env.VITE_API_URL}/image/product/${img.split('/').pop()})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
							title={`View option ${index + 1}`}
						></button>
					))}
				</div>
			)}
		</div>
	);
}
