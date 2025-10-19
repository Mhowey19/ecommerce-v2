import { useState } from 'react';

export default function ProductColorSwitcher({ product }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	if (!product?.images?.length) return null; // No images, nothing to show

	const handleNextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
	};

	const currentImage = `/image/product/${product.images[currentImageIndex].split('/').pop()}`;

	return (
		<div className="color-switcher">
			<img src={currentImage} alt={product.name} width="150" onError={(e) => (e.target.src = '/image/fallback.jpg')} />
			<div>
				<p>{product.name}</p>
				<button onClick={handleNextImage}>Next Color</button>
			</div>
		</div>
	);
}
