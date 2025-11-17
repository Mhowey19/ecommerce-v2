import { useState } from 'react';
import '../styles/ProductCard.css';
export default function CategoryFilter({ onCategoryChange, onPriceChange }) {
	const [categories] = useState(['All', 'Shoes', 'Clothing', 'Supplies', 'Seats']);
	const [price, setPrice] = useState('');

	const handlePriceChange = (e) => {
		setPrice(e.target.value);
		onPriceChange(e.target.value);
	};

	return (
		<div className="category-filter">
			{/* Category Dropdown */}
			<div className="filter-group">
				<label htmlFor="category" className="filter-label">
					Filter by Category
				</label>
				<select id="category" onChange={(e) => onCategoryChange(e.target.value)} className="filter-select">
					{categories.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			{/* Price Dropdown */}
			<div className="filter-group">
				<label htmlFor="price" className="filter-label">
					Filter by Price
				</label>
				<select id="price" value={price} onChange={handlePriceChange} className="filter-select">
					<option value="">All Prices</option>
					<option value="0-25">$0 - $25</option>
					<option value="25-50">$25 - $50</option>
					<option value="50-100">$50 - $100</option>
					<option value="100+">$100+</option>
				</select>
			</div>
		</div>
	);
}
