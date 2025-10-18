import { useState, useEffect } from 'react';
import Button from './Button';
import '../styles/Slider.css';

export default function ProductSlider() {
	const [products, setProducts] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState({});
	const [currentSlide, setCurrentSlide] = useState(0);

	const API_URL = import.meta.env.VITE_API_URL; // ✅ works for dev & prod

	useEffect(() => {
		async function fetchProducts() {
			try {
				const res = await fetch(`${API_URL}/products/api`);
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				console.error('Failed to fetch products:', err);
			}
		}
		fetchProducts();
	}, [API_URL]);

	const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % products.length);
	const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);

	const handleNextImage = (productId) => {
		setCurrentImageIndex((prev) => {
			const current = prev[productId] || 0;
			const product = products.find((p) => p.id === productId);
			const next = (current + 1) % (product?.images?.length || 1);
			return { ...prev, [productId]: next };
		});
	};

	if (!products.length) return <p>Loading products...</p>;

	return (
		<div className="slider-container">
			<button className="slider-btn prev" onClick={prevSlide}>
				Prev
			</button>
			<div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
				{products.map((product) => {
					const currentIdx = currentImageIndex[product.id] || 0;
					const imagePath = product.images?.[currentIdx]
						? `/image/product/${product.images[currentIdx].split('/').pop()}`
						: '/image/fallback.jpg';

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
			<button className="slider-btn next" onClick={nextSlide}>
				Next
			</button>
		</div>
	);
}
