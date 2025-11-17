import React from 'react';

export default function Button({ color = '#ff914d', text = 'Add to Cart', fontSize = 16, alignSelf = 'flex-start' }) {
	const buttonStyle = {
		background: color, // replaces background color
		color: '#fff',
		padding: '0.75rem 1.5rem',
		border: 'none',
		borderRadius: '8px',
		fontSize: fontSize + 'px',
		fontWeight: 600,
		cursor: 'pointer',
		transition: 'background 0.3s ease, transform 0.1s ease',
		alignSelf: alignSelf,
	};

	return (
		<button className="main-button" style={buttonStyle}>
			{text}
		</button>
	);
}
