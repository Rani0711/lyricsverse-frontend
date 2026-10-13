import { useState } from "react";
import { api } from "../services/api";
import "./ForgotPassword.css";

export default function ForgotPassword({ navigate }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await api.forgotPassword(email.trim());
      setMessage(
        data.message ||
          "If this email is registered, password-reset instructions will be sent."
      );
    } catch (err) {
      setError(err.message || "Unable to request a password reset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">♫</div>
        <p className="auth-kicker">ACCOUNT RECOVERY</p>
        <h1>Forgot Password?</h1>
        <p className="auth-description">
          Enter your registered email address to request password-reset
          instructions.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="resetEmail">Email address</label>
          <input
            id="resetEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <button
            className="button-primary full-width"
            type="submit"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Send Reset Instructions"}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <button
          className="back-link centered"
          onClick={() => navigate("login")}
        >
          ← Back to Login
        </button>
      </div>
    </section>
  );
}
