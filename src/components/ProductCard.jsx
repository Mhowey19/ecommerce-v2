import { useEffect, useState } from 'react';
import Button from './Button';

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
					<img
						src={product.images?.[0] ? `/image/product/${product.images[0].split('/').pop()}` : '/image/fallback.jpg'}
						alt={product.name}
						width="200"
						onError={(e) => (e.target.src = '/image/fallback.jpg')}
					/>
					<h3>{product.name}</h3>
					<p>${parseFloat(product.price).toFixed(2)}</p>
					<p>{product.description}</p>
					<Button />
				</div>
			))}
		</div>
	);
}
