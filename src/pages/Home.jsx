import { Link } from 'react-router-dom';
import ProductSlider from '../components/Slider';
import '../styles/Home.css';
import Button from '../components/Button';

export default function Home() {
	return (
		<main className="main-content">
			{/* Full-width CTA section */}
			<div className="cta">
				<p className="cta-text">Join Our Donation Drive</p>
				<Link to="/contact">
					<Button fontSize={24} text="Join" alignSelf="center" />
				</Link>
			</div>

			{/* Two-column section below CTA */}
			<div className="content-row">
				<div className="left-column">
					<h2 className="section-title">Our Products</h2>
					<ProductSlider />
				</div>

				<Link className="right-column contact-us" to="/contact">
					<div className="contact-inner">
						<h2>Contact Us</h2>
						<p>Questions or donations? Get in touch today!</p>
					</div>
				</Link>
			</div>
		</main>
	);
}
