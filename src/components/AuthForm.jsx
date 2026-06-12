import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

export default function AuthForm({ mode = "login" }) {
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (isSignup && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setMessage("");

    if (!validate()) {
      return;
    }

    const endpoint = isSignup ? `${apiUrl}/api/signup` : `${apiUrl}/api/login`;
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || "Authentication failed.");
        return;
      }

      localStorage.setItem("jwtToken", data.token);
      // notify other components (navbar) that auth state changed
      try {
        window.dispatchEvent(new Event("authChanged"));
      } catch {}
      setMessage(
        isSignup
          ? "Account created successfully. Redirecting..."
          : "Login successful. Redirecting...",
      );
      setFormData({ email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      console.error(error);
      setServerError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-container">
        <section className="auth-header">
          <h2>{isSignup ? "Create your account" : "Log in to Tiny Joy"}</h2>
          <p>
            {isSignup
              ? "Start shopping with a new account."
              : "Enter your email and password to continue."}
          </p>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <section>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ borderColor: errors.email ? "#e74c3c" : "#ccc" }}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </section>

          <section>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ borderColor: errors.password ? "#e74c3c" : "#ccc" }}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </section>

          {isSignup && (
            <section>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  borderColor: errors.confirmPassword ? "#e74c3c" : "#ccc",
                }}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </section>
          )}

          <button className="auth-button" type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {serverError && <div className="field-error">{serverError}</div>}
        {message && <div className="auth-message">{message}</div>}

        <div className="auth-switch">
          {isSignup ? (
            <>
              Already have an account? <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              New here? <Link to="/signup">Create an account</Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
