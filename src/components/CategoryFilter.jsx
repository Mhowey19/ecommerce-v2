import '../styles/CategoryFilter.css';

export default function CategoryFilter({ onCategoryChange }) {
	const categories = ['All', 'Shoes', 'Clothing', 'Supplies', 'Seats'];

	return (
		<div className="category-filter">
			<label htmlFor="category" className="category-label">
				Filter by category:
			</label>
			<select
				id="category"
				onChange={(e) => {
					const selected = e.target.value.toLowerCase();
					onCategoryChange(selected);
				}}
				className="category-select"
			>
				{categories.map((cat) => (
					<option key={cat} value={cat}>
						{cat}
					</option>
				))}
			</select>
		</div>
	);
}
