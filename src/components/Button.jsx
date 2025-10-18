export default function Button({ color = 'red', text = 'Add to Cart', fontSize = 12 }) {
	const buttonStyle = {
		color: color,
		text: text,
		fontSize: fontSize + 'px',
	};
	return (
		<>
			<button style={buttonStyle}>{text}</button>
		</>
	);
}
