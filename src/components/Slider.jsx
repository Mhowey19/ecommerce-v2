import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import ProductColorSwitcher from './ProductColorSwitcher';
import '../styles/Slider.css';
import { Link } from 'react-router-dom';
export default function ProductSlider() {
	const [products, setProducts] = useState([]);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const intervalRef = useRef(null);

	// Fetch products from backend
	useEffect(() => {
		async function fetchProducts() {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/products/api`);
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				console.error('Failed to fetch products:', err);
			}
		}
		fetchProducts();
	}, []);

	// Auto-slide effect
	useEffect(() => {
		if (isPaused || products.length === 0) return;

		intervalRef.current = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % products.length);
		}, 5000); // ⏱️ change slide every 5 seconds

		return () => clearInterval(intervalRef.current);
	}, [products, isPaused]);

	const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % products.length);
	const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);

	if (!products.length) return <p>Loading products...</p>;

	return (
		<div className="slider-container" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
			<button className="slider-btn prev" onClick={prevSlide}>
				‹
			</button>

			<div className="slider-wrapper">
				{products.map((product, index) => (
					<div
						key={product.id}
						className={`slide ${index === currentSlide ? 'active' : ''}`}
						style={{ display: index === currentSlide ? 'flex' : 'none' }}
					>
						{/* Left: Product Image + Color Switcher */}
						<div className="slide-image">
							<ProductColorSwitcher product={product} />
						</div>

						{/* Right: Product Info */}

						<div className="slide-info">
							<Link to="/products">
								<h3>{product.name}</h3>
								<p className="price">${parseFloat(product.price).toFixed(2)}</p>
								<p className="description">{product.description}</p>
							</Link>
							<Button />
						</div>
					</div>
				))}
			</div>

			<button className="slider-btn next" onClick={nextSlide}>
				›
			</button>
		</div>
	);
}
