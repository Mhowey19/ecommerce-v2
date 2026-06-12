import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

const apiUrl = import.meta.env.VITE_API_URL || "";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileEmail, setProfileEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${apiUrl}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load profile.");
        }
        return response.json();
      })
      .then((data) => {
        setProfileEmail(data.user.email);
        setNewEmail(data.user.email);
      })
      .catch(() => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleUpdateEmail = async (event) => {
    event.preventDefault();
    setEmailError("");
    setEmailMessage("");
    setServerError("");

    if (!emailRegex.test(newEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/update-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || "Unable to update email.");
        return;
      }

      localStorage.setItem("jwtToken", data.token);
      try {
        window.dispatchEvent(new Event("authChanged"));
      } catch {}
      setProfileEmail(data.user.email);
      setEmailMessage("Your email has been updated successfully.");
    } catch (error) {
      setServerError("Unable to update your email. Please try again.");
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    setServerError("");

    if (!currentPassword || newPassword.length < 6) {
      setPasswordError(
        "Current password and a new password of at least 6 characters are required.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || "Unable to update password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Your password has been updated successfully.");
    } catch (error) {
      setServerError("Unable to update your password. Please try again.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    try {
      window.dispatchEvent(new Event("authChanged"));
    } catch {}
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <p className="settings-loading">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <section className="settings-header">
          <h2>Account Settings</h2>
          <p>
            Update your email, change your password, or sign out of your Tiny
            Joy account.
          </p>
        </section>

        <section className="settings-card">
          <h3>Profile</h3>
          <p>
            Current email: <strong>{profileEmail}</strong>
          </p>
        </section>

        <form className="settings-form" onSubmit={handleUpdateEmail}>
          <label htmlFor="newEmail">Change email</label>
          <input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            className="settings-input"
          />
          {emailError && <div className="settings-error">{emailError}</div>}
          <button type="submit" className="settings-button">
            Save new email
          </button>
          {emailMessage && (
            <div className="settings-success">{emailMessage}</div>
          )}
        </form>

        <form className="settings-form" onSubmit={handleUpdatePassword}>
          <h3>Change password</h3>
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="settings-input"
          />

          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="settings-input"
          />

          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="settings-input"
          />

          {passwordError && (
            <div className="settings-error">{passwordError}</div>
          )}
          <button type="submit" className="settings-button">
            Update password
          </button>
          {passwordMessage && (
            <div className="settings-success">{passwordMessage}</div>
          )}
        </form>

        {serverError && (
          <div className="settings-error settings-server-error">
            {serverError}
          </div>
        )}

        <div className="settings-actions">
          <button
            type="button"
            className="settings-secondary"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
