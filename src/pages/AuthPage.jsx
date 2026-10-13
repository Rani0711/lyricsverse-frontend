import { useState } from "react";
import { api } from "../services/api";
import "./AuthPage.css";

export default function AuthPage({ mode, navigate, onLogin }) {
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = isRegister
        ? await api.register({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await api.login({
            email: email.trim(),
            password,
          });

      if (isRegister) {
        setMessage(data.message || "Registration successful. Please log in.");
        setPassword("");
        setConfirmPassword("");
      } else {
        const token = data.token || data.accessToken;

        if (!token) {
          throw new Error("The backend did not return an authentication token.");
        }

        const user = data.user || {
          name: data.name || email.split("@")[0],
          email,
          role: data.role || "USER",
        };

        onLogin({ user, token });
      }
    } catch (err) {
      setError(err.message || "Unable to complete your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">♫</div>

        <p className="auth-kicker">
          {isRegister ? "JOIN THE COMMUNITY" : "WELCOME BACK"}
        </p>

        <h1>{isRegister ? "Create Your Account" : "Welcome Back"}</h1>

        <p className="auth-description">
          {isRegister
            ? "Join LyricsVerse and discover the words behind the music."
            : "Sign in to explore your favourite lyrics."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="authName">Full name</label>
              <input
                id="authName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </>
          )}

          <label htmlFor="authEmail">Email address</label>
          <input
            id="authEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="authPassword">Password</label>
          <div className="password-field">
            <input
              id="authPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isRegister ? "Create a password" : "Your password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {isRegister && (
            <>
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="password-field">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </>
          )}

          {!isRegister && (
            <div className="forgot-row">
              <button
                type="button"
                onClick={() => navigate("forgot")}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            className="button-primary full-width"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to LyricsVerse?"}{" "}
          <button
            onClick={() => navigate(isRegister ? "login" : "register")}
          >
            {isRegister ? "Login" : "Create an account"}
          </button>
        </p>

        <button
          className="back-link centered"
          onClick={() => navigate("home")}
        >
          ← Back to Home
        </button>
      </div>
    </section>
  );
}
