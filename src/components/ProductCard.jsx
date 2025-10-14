import logo from '../images/codejsonss.png';
import Button from './Button';

//All place holder Items
export default function ProductCard() {
	return (
		<div>
			<img src={logo} alt="Product" width="200" />
			<p>placeholder product text</p>
			<p>placeholder prduct price</p>
			<Button></Button>
		</div>
	);
}
