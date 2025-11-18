import { useEffect, useState } from 'react';
import Button from './Button';
import CategoryFilter from './CategoryFilter';
import '../styles/ProductCard.css';
import ProductColorSwitcher from './ProductColorSwitcher';

export default function ProductCard() {
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedPrice, setSelectedPrice] = useState('');

	useEffect(() => {
		async function fetchProducts() {
			try {
				let url = `${import.meta.env.VITE_API_URL}/products/api`;

				const params = new URLSearchParams();
				if (selectedCategory && selectedCategory !== 'All') {
					params.append('category', selectedCategory);
				}
				if (selectedPrice) {
					params.append('price', selectedPrice);
				}

				if (params.toString()) {
					url += `?${params.toString()}`;
				}

				const res = await fetch(url);
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				console.error('Failed to fetch products:', err);
			}
		}
		fetchProducts();
	}, [selectedCategory, selectedPrice]);

	if (!products.length) {
		return (
			<>
				<p>No Matching Products</p>
				<CategoryFilter onCategoryChange={setSelectedCategory} onPriceChange={setSelectedPrice} />
			</>
		);
	}

	return (
		<>
			<CategoryFilter onCategoryChange={setSelectedCategory} onPriceChange={setSelectedPrice} />
			<div className="product-page">
				<div className="product-grid">
					{products.map((product) => (
						<div key={product.id} className="product-card">
							<ProductCardItem product={product} />
						</div>
					))}
				</div>
			</div>
		</>
	);
}

/* --- Subcomponent for single product --- */
function ProductCardItem({ product }) {
	const images = Array.isArray(product.images) ? product.images : product.image ? [product.image] : [];
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handleImageChange = (index) => {
		setCurrentImageIndex(index);
	};

	return (
		<>
			<div className="product-image">
				<img
					src={
						images[currentImageIndex]
							? `${import.meta.env.VITE_API_URL}/${images[currentImageIndex]}`
							: `${import.meta.env.VITE_API_URL}/image/fallback.jpg`
					}
					alt={product.name}
					onError={(e) => (e.target.src = `${import.meta.env.VITE_API_URL}/image/fallback.jpg`)}
				/>
			</div>
			<div className="product-info">
				<h3>{product.name}</h3>
				<p className="price">${parseFloat(product.price).toFixed(2)}</p>
				<p className="description">{product.description}</p>
				<div className="product-actions">
					<Button />
					<ProductColorSwitcher
						product={product}
						onImageSelect={handleImageChange}
						currentImageIndex={currentImageIndex}
						compact
					/>
				</div>
			</div>
		</>
	);
}
