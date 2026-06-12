import { useEffect, useState } from "react";
import Button from "./Button";
import CategoryFilter from "./CategoryFilter";
import "../styles/ProductCard.css";
import ProductColorSwitcher from "./ProductColorSwitcher";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        let url = `${import.meta.env.VITE_API_URL}/products/api`;

        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }
        if (selectedPrice) {
          params.append("price", selectedPrice);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("API URL:", import.meta.env.VITE_API_URL);

        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, [selectedCategory, selectedPrice]);

  if (!products.length) {
    return (
      <>
        <p>No Matching Products</p>
        <CategoryFilter
          onCategoryChange={setSelectedCategory}
          onPriceChange={setSelectedPrice}
        />
      </>
    );
  }

  return (
    <>
      <CategoryFilter
        onCategoryChange={setSelectedCategory}
        onPriceChange={setSelectedPrice}
      />
      <div className="product-page">
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <ProductCardItem product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* --- Subcomponent for single product --- */
function ProductCardItem({ product }) {
  const images = Array.isArray(product.images)
    ? product.images
    : product.image
      ? [product.image]
      : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className="product-image">
        <img
          src={
            images[currentImageIndex]
              ? `${import.meta.env.VITE_API_URL}/${images[currentImageIndex]}`
              : `${import.meta.env.VITE_API_URL}/image/fallback.jpg`
          }
          alt={product.name}
          onError={(e) =>
            (e.target.src = `${import.meta.env.VITE_API_URL}/image/fallback.jpg`)
          }
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${parseFloat(product.price).toFixed(2)}</p>
        <p className="description">{product.description}</p>
        <div className="product-actions">
          <Button
            text="Add to Cart"
            onClick={async () => {
              const token = localStorage.getItem("jwtToken");
              if (!token) {
                window.location.href = "/login";
                return;
              }

              try {
                const res = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/cart`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      productId: product.id,
                      quantity: 1,
                    }),
                  },
                );

                if (!res.ok) {
                  const data = await res.json();
                  alert(data.message || "Unable to add to cart.");
                  return;
                }

                alert("Added to cart");
              } catch (err) {
                console.error(err);
                alert("Unable to add to cart.");
              }
            }}
          />
          <ProductColorSwitcher
            product={product}
            onImageSelect={handleImageChange}
            currentImageIndex={currentImageIndex}
            compact
          />
        </div>
      </div>
    </>
  );
}
