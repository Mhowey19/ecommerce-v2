import { useState, useEffect } from 'react';
import '../styles/Slider.css';
import Button from './Button';

export default function ProductSlider() {
	const [products, setProducts] = useState([]);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		async function fetchProducts() {
			try {
				const res = await fetch('http://localhost:5000/products/api');
				const data = await res.json();
				setProducts(data.productCardData || []);
			} catch (err) {
				console.error('Failed to fetch products:', err);
			}
		}
		fetchProducts();
	}, []);

	const nextSlide = () => setCurrent((prev) => (prev + 1) % products.length);

	const prevSlide = () => setCurrent((prev) => (prev - 1 + products.length) % products.length);

	if (!products.length) return <p>Loading products...</p>;

	const { name, price, description, img_path } = products[current];

	return (
		<div className="slider">
			<button className="slider-btn prev" onClick={prevSlide}>
				&#10094;
			</button>

			<div className="slide">
				<div className="slide-image">
					<img src={img_path} alt={name} />
				</div>

				<div className="slide-details">
					<h2>{name}</h2>
					<p className="description">{description}</p>
					<p className="price">${parseFloat(price).toFixed(2)}</p>
					<Button />
				</div>
			</div>

			<button className="slider-btn next" onClick={nextSlide}>
				&#10095;
			</button>
		</div>
	);
}
