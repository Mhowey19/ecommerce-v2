export default function Header() {
	return (
		<header className="p-4 bg-gray-800 text-white flex justify-between">
			<h1 className="text-xl font-bold">My E-Commerce</h1>
			<nav className="flex gap-4">
				<a href="/">Home</a>
				<a href="/products">Products</a>
				<a href="/about">About</a>
			</nav>
		</header>
	);
}
