// src/components/Layout.jsx
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
	return (
		<>
			<Navbar />

			<main>{children}</main>

			<footer>
				<p>© {new Date().getFullYear()} My E-Commerce Store</p>
			</footer>
		</>
	);
}
