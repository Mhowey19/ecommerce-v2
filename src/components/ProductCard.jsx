import logo from '../images/codejsonss.png';
import Button from './Button';

const data = fetch('products/api');

//All place holder Items
export default function ProductCard() {
	return (
		<div>
			<img src={logo} alt="Product" width="200" />
			<p>{data[0]}</p>
			<p>placeholder prduct price</p>
			<Button></Button>
		</div>
	);
}
