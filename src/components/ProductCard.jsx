import { useEffect, useState } from 'react';
import Button from './Button';
import CategoryFilter from './CategoryFilter';
import '../styles/CategoryFilter.css';
import '../styles/ProductCard.css';
export default function ProductCard() {
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');

	useEffect(() => {
		console.log('Fetching for category:', selectedCategory);
		async function fetchProducts() {
			try {
				const url = selectedCategory
					? `${import.meta.env.VITE_API_URL}/products/api?category=${encodeURIComponent(selectedCategory)}`
					: `${import.meta.env.VITE_API_URL}/products/api`;
				const res = await fetch(url);
				const data = await res.json();
				setProducts(data);
			} catch (err) {
				console.error('Failed to fetch products:', err);
			}
		}
		fetchProducts();
	}, [selectedCategory]);

	if (!products.length) return <p>Loading products...</p>;

	return (
		<div className="product-page">
			<CategoryFilter onCategoryChange={setSelectedCategory} />

			<div className="product-grid">
				{products.map((product) => (
					<div key={product.id} className="product-card">
						<div className="product-image">
							<img
								src={
									product.images?.[0] ? `/image/product/${product.images[0].split('/').pop()}` : '/image/fallback.jpg'
								}
								alt={product.name}
								onError={(e) => (e.target.src = '/image/fallback.jpg')}
							/>
						</div>
						<div className="product-info">
							<h3>{product.name}</h3>
							<p className="price">${parseFloat(product.price).toFixed(2)}</p>
							<p className="description">{product.description}</p>
							<Button />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
