import "./Navbar.css";

export default function Navbar({ user, isAdmin, navigate, onLogout }) {
  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={() => navigate("home")}
        type="button"
      >
        <span className="brand-icon">♫</span>
        LyricsVerse
      </button>

      <nav className="nav-actions">
        <button
          className="nav-link"
          onClick={() => navigate("home")}
          type="button"
        >
          Home
        </button>

        {user ? (
          <>
            {isAdmin ? (
              <button
                className="nav-primary"
                onClick={() => navigate("admin")}
                type="button"
              >
                Admin Dashboard
              </button>
            ) : (
              <button
                className="nav-primary"
                onClick={() => navigate("user")}
                type="button"
              >
                My Dashboard
              </button>
            )}

            <button
              className="nav-link"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-link"
              onClick={() => navigate("login")}
              type="button"
            >
              Login
            </button>

            <button
              className="nav-primary"
              onClick={() => navigate("register")}
              type="button"
            >
              Register
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
