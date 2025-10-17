import logo from '../images/codejsonss.png';
import Button from './Button';
import { useEffect, useState } from 'react';

export default function ProductCard() {
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchProductData() {
			try {
				const res = await fetch('http://localhost:5000/products/api');
				if (!res.ok) throw new Error('Network response was not ok');
				const data = await res.json();
				setProducts(data.productCardData); // <-- access array here
			} catch (err) {
				console.error(err);
				setError(err.message);
			}
		}
		fetchProductData();
	}, []);

	if (error) return <p>Error: {error}</p>;
	if (!products.length) return <p>Loading products...</p>;

	return (
		<div className="product-list">
			{products.map((product) => (
				<div key={product.id} className="product-card">
					<img src={product.img_path || logo} alt={product.name} width="200" />
					<h3>{product.name}</h3>
					<p>${parseFloat(product.price).toFixed(2)}</p>
					<p>{product.description}</p>
					<Button />
				</div>
			))}
		</div>
	);
}
