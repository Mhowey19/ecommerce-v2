import { useEffect, useState } from 'react';
import '../styles/CategoryFilter.css';

export default function CategoryFilter({ onCategoryChange, onPriceChange }) {
	const [categories] = useState(['All', 'Shoes', 'Clothing', 'Supplies', 'Seats']);
	const [price, setPrice] = useState('');

	const handlePriceChange = (e) => {
		setPrice(e.target.value);
		onPriceChange(e.target.value);
	};

	return (
		<div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl w-64 shadow-sm">
			{/* Category Dropdown */}
			<div>
				<label htmlFor="category" className="text-sm font-semibold text-gray-600">
					Filter by Category
				</label>
				<select
					id="category"
					onChange={(e) => onCategoryChange(e.target.value)}
					className="border border-gray-300 rounded-lg p-2 text-gray-700 w-full"
				>
					{categories.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			{/* Price Dropdown */}
			<div>
				<label htmlFor="price" className="text-sm font-semibold text-gray-600">
					Filter by Price
				</label>
				<select
					id="price"
					value={price}
					onChange={handlePriceChange}
					className="border border-gray-300 rounded-lg p-2 text-gray-700 w-full"
				>
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
