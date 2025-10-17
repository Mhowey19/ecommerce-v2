import { useEffect, useState } from 'react';
import Button from './Button';

export default function ProductCard() {
	const [products, setProducts] = useState([]);
	const [currentImageIndex, setCurrentImageIndex] = useState({});

	useEffect(() => {
		async function fetchProducts() {
			try {
				//fetch db data and convert into json data
				const res = await fetch('/products/api'); // or deployed URL
				const data = await res.json();

				const initialIndex = {};
				data.forEach((product) => {
					initialIndex[product.id] = 0;
				});

				setProducts(data); //sets current state to the db data
				setCurrentImageIndex(initialIndex); //Used to change the image when button is selected
			} catch (err) {
				console.error(`Error, ${err}`);
			}
		}
		fetchProducts(); // runs the fetchProducts async funtion to fetch the db data
	}, []);

	const handleNextImage = (productId) => {
		setCurrentImageIndex((prev) => {
			const current = prev[productId]; //Used to be able to go back to the previous image
			const product = products.find((p) => p.id === productId); //Finds the product with the matching ID
			const next = (current + 1) % (product.images?.length || 1); //Finds the next product image with the same id type
			return { ...prev, [productId]: next };
		});
	};

	if (!products.length) return <p>Loading products...</p>; //handle if there is no data

	return (
		<div className="product-list">
			{products.map((product) => (
				<div key={product.id} className="product-card">
					<img src={product.images?.[currentImageIndex[product.id]] || 'fallback.png'} alt={product.name} width="200" />
					<h3>{product.name}</h3>
					<p>${parseFloat(product.price).toFixed(2)}</p>
					<p>{product.description}</p>
					<Button />
					<button text="Change Color" onClick={() => handleNextImage(product.id)}>
						Change Button
					</button>
				</div>
			))}
		</div>
	);
}
