import { useEffect, useState } from 'react';
import Button from './Button';
import '../styles/ProductCard.css';

export default function ProductCard() {
	const [products, setProducts] = useState([]);

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

	if (!products.length) return <p>Loading products...</p>;

	return (
		<div className="product-list">
			{products.map((product) => (
				<div key={product.id} className="product-card">
					<div className="product-card-image">
						<img
							src={
								product.images?.[0]
									? `${import.meta.env.VITE_API_URL}/image/product/${product.images[0].split('/').pop()}`
									: `${import.meta.env.VITE_API_URL}/image/fallback.jpg`
							}
							alt={product.name}
							onError={(e) => (e.target.src = `${import.meta.env.VITE_API_URL}/image/fallback.jpg`)}
						/>
					</div>

					<div className="product-card-info">
						<h3>{product.name}</h3>
						<p className="price">${parseFloat(product.price).toFixed(2)}</p>
						<p className="description">{product.description}</p>
						<Button />
					</div>
				</div>
			))}
		</div>
	);
}
