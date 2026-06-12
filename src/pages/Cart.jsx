import { useEffect, useState } from "react";
import "../styles/Settings.css";

const apiUrl = import.meta.env.VITE_API_URL || "";

export default function Cart() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    setError("");
    const token = localStorage.getItem("jwtToken");
    if (!token) return (window.location.href = "/login");

    try {
      const res = await fetch(`${apiUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, qty) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return (window.location.href = "/login");
    try {
      const res = await fetch(`${apiUrl}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Unable to update cart");
        return;
      }
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Unable to update cart");
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return (window.location.href = "/login");
    try {
      const res = await fetch(`${apiUrl}/api/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unable to remove item");
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Unable to remove item");
    }
  };

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = Number(item.quantity || 0);
    return sum + price * quantity;
  }, 0);

  if (loading)
    return (
      <div className="settings-page">
        <div className="settings-container">
          <p>Loading cart...</p>
        </div>
      </div>
    );

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Your Cart</h2>
        {error && <div className="settings-error">{error}</div>}
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div>
              {items.map((it) => (
                <div
                  key={it.product_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>{it.name || `Product ${it.product_id}`}</strong>
                    <div>
                      ${it.price ? parseFloat(it.price).toFixed(2) : "0.00"}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      value={it.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          it.product_id,
                          parseInt(e.target.value, 10) || 0,
                        )
                      }
                      style={{
                        width: 72,
                        padding: "0.5rem",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    />
                    <button
                      onClick={() => removeItem(it.product_id)}
                      className="settings-secondary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="cart-summary"
              style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                Total
              </span>
              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
