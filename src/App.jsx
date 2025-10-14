// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/ContactUs';
import Cart from './pages/Cart';
import Error from './pages/Error';
export default function App() {
	return (
		<Router>
			{/* Layout wraps around all routes so Header/Footer stay visible */}
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/products" element={<Products />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="*" element={<Error />} />
				</Routes>
			</Layout>
		</Router>
	);
}
