import DonationDrive from './DonationDrive';
import { useState } from 'react';
import '../styles/ContactForm.css';

export default function ContactForm() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		comment: '',
	});
	const [message, setMessage] = useState('');
	const [errors, setErrors] = useState({});

	const phoneRegex = /^\+?[1-9][0-9]{7,14}$/;
	const textRegex = /^[a-zA-Z\s]{2,50}$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validate = () => {
		const newErrors = {};

		if (!textRegex.test(formData.name)) newErrors.name = true;
		if (!emailRegex.test(formData.email)) newErrors.email = true;
		if (!phoneRegex.test(formData.phone)) newErrors.phone = true;

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setMessage(`Thank you ${formData.name}, for your concern. Our contact number is 123-456-7890`);
		} else {
			setMessage('');
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		validate();
	};

	return (
		<div className="contact-page">
			<DonationDrive />
			<main className="container">
				<form className="form-container" onSubmit={handleSubmit}>
					<section>
						<label htmlFor="name">Name</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							style={{ borderColor: errors.name ? 'red' : '#ccc' }}
						/>
					</section>

					<section>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							style={{ borderColor: errors.email ? 'red' : '#ccc' }}
						/>
					</section>

					<section>
						<label htmlFor="phone">Phone Number</label>
						<input
							type="text"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							style={{ borderColor: errors.phone ? 'red' : '#ccc' }}
						/>
					</section>

					<section>
						<label htmlFor="comment">Comment</label>
						<input type="text" id="comment" name="comment" value={formData.comment} onChange={handleChange} />
					</section>

					<button className="contact-button" type="submit" id="submitButton">
						Submit
					</button>
				</form>

				{message && (
					<div className="product-donation" id="message">
						{message}
					</div>
				)}
			</main>
		</div>
	);
}
