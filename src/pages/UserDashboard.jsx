import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./UserDashboard.css";

export default function UserDashboard({ user, navigate, onOpenLyrics }) {
  const [songs, setSongs] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const favoriteKey = user?.email
    ? `lyricsverse_favorites_${user.email.toLowerCase()}`
    : null;

  useEffect(() => {
    api.getSongs()
      .then((data) => setSongs(Array.isArray(data) ? data : []))
      .catch(() => setSongs([]));
  }, []);

  useEffect(() => {
    if (!favoriteKey) {
      setFavourites([]);
      return;
    }

    function loadFavourites() {
      try {
        const saved = JSON.parse(
          localStorage.getItem(favoriteKey) || "[]"
        );

        setFavourites(Array.isArray(saved) ? saved : []);
      } catch {
        setFavourites([]);
      }
    }

    loadFavourites();

    // Refresh favourites when returning to the dashboard
    window.addEventListener("focus", loadFavourites);

    return () => {
      window.removeEventListener("focus", loadFavourites);
    };
  }, [favoriteKey]);

  function toggleFavourite(song) {
    if (!favoriteKey) return;

    const alreadySaved = favourites.some(
      (item) => String(item.id) === String(song.id)
    );

    const updated = alreadySaved
      ? favourites.filter(
          (item) => String(item.id) !== String(song.id)
        )
      : [...favourites, song];

    setFavourites(updated);
    localStorage.setItem(favoriteKey, JSON.stringify(updated));
  }

  // Match saved song objects with the current database song list.
  const favouriteSongs = favourites
    .map((saved) =>
      songs.find((song) => String(song.id) === String(saved.id))
    )
    .filter(Boolean);

  return (
    <section className="user-dashboard">
      <div className="user-welcome">
        <div>
          <p className="user-kicker">YOUR PERSONAL SPACE</p>
          <h1>Welcome, {user.name || user.email}!</h1>
          <p>Keep your favourite music close.</p>
        </div>

        <div className="user-avatar">
          {(user.name || user.email || "U").charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="user-stats">
        <article>
          <span className="stat-icon">♫</span>
          <p>Available Songs</p>
          <h2>{songs.length}</h2>
        </article>

        <article>
          <span className="stat-icon">♥</span>
          <p>My Favourites</p>
          <h2>{favouriteSongs.length}</h2>
        </article>
      </div>

      <section className="user-section">
        <div className="user-section-heading">
          <div>
            <p className="user-kicker">SAVED MUSIC</p>
            <h2>My Favourite Songs</h2>
          </div>

          <button
            className="user-outline-button"
            onClick={() => navigate("home")}
          >
            Browse Songs →
          </button>
        </div>

        {favouriteSongs.length === 0 ? (
          <div className="user-empty">
            <span>♡</span>
            <h3>Your favourites will appear here</h3>
            <p>Browse the library and tap the heart on songs you love.</p>

            <button
              className="user-primary-button"
              onClick={() => navigate("home")}
            >
              Explore Lyrics
            </button>
          </div>
        ) : (
          <div className="user-song-grid">
            {favouriteSongs.map((song) => (
              <article className="user-song-card" key={song.id}>
                <div className="user-song-art">♫</div>
                <span className="user-song-language">{song.language}</span>
                <h3>{song.title}</h3>
                <p>{song.artist}</p>

                <div className="user-song-actions">
                  <button onClick={() => onOpenLyrics(song)}>
                    Open Lyrics →
                  </button>

                  <button
                    className="remove-favourite"
                    onClick={() => toggleFavourite(song)}
                    aria-label={`Remove ${song.title} from favourites`}
                    title="Remove from favourites"
                  >
                    ♥
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="user-profile">
        <p className="user-kicker">ACCOUNT DETAILS</p>
        <h2>My Profile</h2>

        <div className="profile-row">
          <span>Name</span>
          <strong>{user.name || "Not provided"}</strong>
        </div>

        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-row">
          <span>Account type</span>
          <strong>Registered User</strong>
        </div>

        <button
          className="user-outline-button"
          onClick={() => navigate("forgot")}
        >
          Reset Password
        </button>
      </section>
    </section>
  );
}

