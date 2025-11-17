export default function DonationDrive() {
	return (
		<section className="donation-drive">
			<h2 className="donation-title">Donation Drive for Children</h2>
			<p className="donation-text">
				We are collecting <strong>child supplies, clothing, and food</strong> to support families in need. Your
				contribution makes a real difference.
			</p>

			<div className="donation-items">
				<div className="donation-card">
					<h3>Child Supplies</h3>
					<p>Diapers, wipes, hygiene kits, baby formula, toys.</p>
				</div>

				<div className="donation-card">
					<h3>Clothes</h3>
					<p>New or gently worn children’s clothes, shoes, jackets.</p>
				</div>

				<div className="donation-card">
					<h3>Food Items</h3>
					<p>Non-perishables such as canned food, snacks, juice boxes.</p>
				</div>
			</div>

			<p className="donation-footer">
				Drop-off available at 901 Belmont Ave. For large donations, please contact us using the form below.
			</p>
		</section>
	);
}
