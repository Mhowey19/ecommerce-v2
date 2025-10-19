// src/components/Layout.jsx
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
	return (
		<>
			<Navbar />

			<main>{children}</main>

			<Footer />
		</>
	);
}
