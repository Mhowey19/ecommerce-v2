import { Link } from 'react-router-dom';
import logo from '../images/TinyJoy-newLogo.jpg';
import { useState } from 'react';
import '../styles/Shared.css';

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="main-header">
			<a href="/">
				<div className="nav-left">
					<img src={logo} alt="Tiny Joy Logo" className="nav-logo" />
					<h1 className="nav-text">Tiny Joy</h1>
				</div>
			</a>

			<img src="../public/image/menu.png" alt="Menu" className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />

			<nav className={`nav-list ${menuOpen ? 'show' : ''}`}>
				<Link to="/" className="nav-link">
					Home
				</Link>
				<Link to="/products" className="nav-link">
					Products
				</Link>
				<Link to="/contact" className="nav-link">
					Contact
				</Link>
			</nav>
		</header>
	);
}
