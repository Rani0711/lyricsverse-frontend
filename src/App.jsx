
import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#" onClick={() => setPage("home")}>
          <span className="music-icon">♫</span>
          LyricsVerse
        </a>

        <nav>
          <button className="nav-login" onClick={() => setPage("login")}>
            Login
          </button>
          <button className="nav-register" onClick={() => setPage("register")}>
            Register
          </button>
        </nav>
      </header>

      <main>
        {page === "home" && (
          <section className="hero">
            <div className="hero-badge">YOUR MUSIC, YOUR LANGUAGE</div>

            <h1>
              Every song has a story.
              <br />
              <span>Find yours here.</span>
            </h1>

            <p className="hero-description">
              Discover song lyrics in Telugu, Hindi, English and more.
              Search, read and feel the music.
            </p>

            <div className="search-box">
              <span>⌕</span>
              <input placeholder="Search for a song..." />
              <button onClick={() => setPage("login")}>Search</button>
            </div>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => setPage("login")}
              >
                Explore Lyrics →
              </button>
              <button
                className="secondary-button"
                onClick={() => setPage("register")}
              >
                Create Account
              </button>
            </div>

            <div className="language-section">
              <p>EXPLORE BY LANGUAGE</p>
              <div className="language-list">
                <span>తెలుగు · Telugu</span>
                <span>हिन्दी · Hindi</span>
                <span>English</span>
              </div>
            </div>

            <div className="hero-note">♫ &nbsp; Find. Read. Feel the Music.</div>
          </section>
        )}

        {page === "login" && (
          <section className="auth-card">
            <div className="auth-symbol">♫</div>
            <h2>Welcome Back</h2>
            <p>Sign in to explore your favourite lyrics.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />

              <label>Password</label>
              <input type="password" placeholder="Enter password" required />

              <button className="primary-button" type="submit">
                Login
              </button>
            </form>

            <p>
              Don't have an account?{" "}
              <button className="text-button" onClick={() => setPage("register")}>
                Register
              </button>
            </p>

            <button className="back-button" onClick={() => setPage("home")}>
              ← Back to Home
            </button>
          </section>
        )}

        {page === "register" && (
          <section className="auth-card">
            <div className="auth-symbol">♫</div>
            <h2>Create Account</h2>
            <p>Join LyricsVerse and explore the world of music.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <label>Full Name</label>
              <input type="text" placeholder="Your name" required />

              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />

              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                minLength="8"
                required
              />

              <button className="primary-button" type="submit">
                Register
              </button>
            </form>

            <p>
              Already registered?{" "}
              <button className="text-button" onClick={() => setPage("login")}>
                Login
              </button>
            </p>

            <button className="back-button" onClick={() => setPage("home")}>
              ← Back to Home
            </button>
          </section>
        )}
      </main>

      <footer>
        <span>♫ LyricsVerse</span>
        <span>Made for the love of music.</span>
        <span>Telugu · Hindi · English</span>
      </footer>
    </div>
  );
}

export default App;
