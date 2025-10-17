import { useState, useEffect } from 'react';
import Button from './Button';
import '../styles/Slider.css';

export default function ProductSlider() {
	const [products, setProducts] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState({});
	const [currentSlide, setCurrentSlide] = useState(0);

	// ✅ Fetch products from backend
	useEffect(() => {
		async function fetchProducts() {
			try {
				const res = await fetch('http://localhost:5000/products/api');
				const data = await res.json();
				console.log('Fetched products:', data);
				setProducts(data);
			} catch (err) {
				console.error('❌ Failed to fetch products:', err);
			}
		}
		fetchProducts();
	}, []);

	// ✅ Move between products
	const nextSlide = () => {
		if (products.length === 0) return;
		setCurrentSlide((prev) => (prev + 1) % products.length);
	};

	const prevSlide = () => {
		if (products.length === 0) return;
		setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
	};

	// ✅ Change image within same product
	const handleNextImage = (productId) => {
		setCurrentImageIndex((prev) => {
			const current = prev[productId] || 0;
			const product = products.find((p) => p.id === productId);
			if (!product?.images?.length) return prev;
			const next = (current + 1) % product.images.length;
			return { ...prev, [productId]: next };
		});
	};

	if (!products.length) return <p>Loading products...</p>;

	return (
		<div className="slider-container">
			<button className="slider-btn prev" onClick={prevSlide}>
				&#10094; Prev
			</button>

			<div className="slider-viewport">
				<div
					className="slider-wrapper"
					style={{
						transform: `translateX(-${currentSlide * 100}%)`,
					}}
				>
					{products.map((product) => {
						const currentIdx = currentImageIndex[product.id] || 0;
						const imagePath = product.images?.[currentIdx] ? `/${product.images[currentIdx]}` : '/image/fallback.jpg';

						return (
							<div className="slide" key={product.id}>
								<div className="slide-content">
									<img
										src={imagePath}
										alt={product.name}
										width="300"
										onError={(e) => (e.target.src = '/image/fallback.jpg')}
									/>
									<div className="slide-info">
										<h3>{product.name}</h3>
										<p>${parseFloat(product.price).toFixed(2)}</p>
										<p>{product.description}</p>
										<Button />
										<button onClick={() => handleNextImage(product.id)}>Next Image</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<button className="slider-btn next" onClick={nextSlide}>
				Next &#10095;
			</button>
		</div>
	);
}
