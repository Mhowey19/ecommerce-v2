import { Link } from 'react-router-dom';

export default function Navbar() {
	return (
		<>
			<header>
				<nav>
					<Link to="/">Home</Link>
					<Link to="/products">Products</Link>
					<Link to="/contact">Contact Us</Link>
					<Link to="/cart">Cart</Link>
				</nav>
			</header>
		</>
	);
}
