import { Link, useLocation } from "react-router-dom";
import logo from "../images/TinyJoy-newLogo.jpg";
import { useEffect, useState } from "react";
import "../styles/Shared.css";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const decodeJwt = (jwtToken) => {
      try {
        const base64Url = jwtToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join(""),
        );
        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    };

    const updateFromToken = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setUserInitial("");
        setCartCount(0);
        return;
      }

      const payload = decodeJwt(token);
      if (payload?.email) {
        setUserInitial(payload.email.trim().charAt(0).toUpperCase());
      } else {
        setUserInitial("");
      }

      // fetch cart count
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setCartCount(0);
          return;
        }
        const data = await res.json();
        const count = (data.items || []).reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0,
        );
        setCartCount(count);
      } catch (err) {
        setCartCount(0);
      }
    };

    updateFromToken();

    const onAuth = () => updateFromToken();
    const onStorage = (e) => {
      if (e.key === "jwtToken") updateFromToken();
    };

    window.addEventListener("authChanged", onAuth);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuth);
      window.removeEventListener("storage", onStorage);
    };
  }, [location.pathname]);

  return (
    <header className="main-header">
      <a href="/">
        <div className="nav-left">
          <img src={logo} alt="Tiny Joy Logo" className="nav-logo" />
          <h1 className="nav-text">Tiny Joy</h1>
        </div>
      </a>

      <img
        src="../public/image/menu.png"
        alt="Menu"
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <nav className={`nav-list ${menuOpen ? "show" : ""}`}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/products" className="nav-link">
          Products
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        {!userInitial && (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </nav>
      {userInitial && (
        <>
          <Link to="/cart" className="cart-link" title="View cart">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <Link
            to="/settings"
            className="user-badge"
            title="Open account settings"
          >
            {userInitial}
          </Link>
        </>
      )}
    </header>
  );
}
