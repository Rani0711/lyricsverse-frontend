import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import "./Home.css";

const PREFERRED_LANGUAGES = [
  "Telugu",
  "Hindi",
  "English",
  "Tamil",
  "Kannada",
  "Malayalam",
];

function Home({ navigate, onOpenLyrics }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const favoriteKey = user?.email
    ? `lyricsverse_favorites_${user.email.toLowerCase()}`
    : null;

  // Load songs from the backend.
  useEffect(() => {
    let active = true;

    async function loadSongs() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getSongs();

        if (active) {
          setSongs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Unable to load songs. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSongs();

    return () => {
      active = false;
    };
  }, []);

  // Load this user's saved favourites.
  useEffect(() => {
    if (!favoriteKey) {
      setFavorites([]);
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(favoriteKey) || "[]"
      );

      setFavorites(Array.isArray(saved) ? saved : []);
    } catch {
      setFavorites([]);
    }
  }, [favoriteKey]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => String(item.id))),
    [favorites]
  );

  function toggleFavorite(song) {
    if (!user || !favoriteKey) {
      alert("Please log in to save your favourite songs.");
      navigate("login");
      return;
    }

    const alreadyFavorite = favoriteIds.has(String(song.id));

    const updated = alreadyFavorite
      ? favorites.filter(
          (item) => String(item.id) !== String(song.id)
        )
      : [...favorites, song];

    setFavorites(updated);
    localStorage.setItem(favoriteKey, JSON.stringify(updated));
  }

  // Search song title, artist, language, movie name and song type.
  const filteredSongs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return songs.filter((song) => {
      const songLanguage = String(song.language || "Other")
        .trim()
        .toLowerCase();

      const selectedLanguage = language.toLowerCase();

      const matchesLanguage =
        language === "All" ||
        songLanguage === selectedLanguage;

      const searchableFields = [
        song.title,
        song.artist,
        song.language,
        song.movieName,
        song.movie_name,
        song.songType,
        song.song_type,
      ];

      const matchesSearch =
        !query ||
        searchableFields.some((field) =>
          String(field || "").toLowerCase().includes(query)
        );

      return matchesLanguage && matchesSearch;
    });
  }, [songs, search, language]);

  // Group matching songs by language.
  const groupedSongs = useMemo(() => {
    const groups = new Map();

    filteredSongs.forEach((song) => {
      const actualLanguage = String(
        song.language || "Other"
      ).trim();

      const languageName = actualLanguage || "Other";
      const key = languageName.toLowerCase();

      if (!groups.has(key)) {
        groups.set(key, {
          name: languageName,
          songs: [],
        });
      }

      groups.get(key).songs.push(song);
    });

    return [...groups.values()].sort((a, b) => {
      const aIndex = PREFERRED_LANGUAGES.findIndex(
        (item) => item.toLowerCase() === a.name.toLowerCase()
      );

      const bIndex = PREFERRED_LANGUAGES.findIndex(
        (item) => item.toLowerCase() === b.name.toLowerCase()
      );

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [filteredSongs]);

  const extraLanguages = useMemo(() => {
    return [
      ...new Set(
        songs
          .map((song) => String(song.language || "").trim())
          .filter(Boolean)
          .filter(
            (item) =>
              !PREFERRED_LANGUAGES.some(
                (preferred) =>
                  preferred.toLowerCase() === item.toLowerCase()
              )
          )
      ),
    ];
  }, [songs]);

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">YOUR MUSIC. YOUR WORDS.</p>

          <h1>
            Every Song Has
            <br />
            <span>A Story.</span>
          </h1>

          <p className="hero-description">
            Discover lyrics from your favourite songs and explore
            music in different languages, all in one place.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("song-library")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Lyrics
            </button>

            {!user && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("login")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="library-section" id="song-library">
        <div className="library-heading">
          <div>
            <p className="section-label">THE COLLECTION</p>
            <h2>Explore the Library</h2>
            <p className="section-description">
              Search by song, artist, language or movie name.
            </p>
          </div>

          <span className="song-count">
            {filteredSongs.length}{" "}
            {filteredSongs.length === 1 ? "song" : "songs"}
          </span>
        </div>

        <div className="library-controls">
          <input
            type="search"
            className="song-search"
            placeholder="Search song, artist, language or movie..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search songs by title, artist, language or movie"
          />

          <select
            className="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Filter songs by language"
          >
            <option value="All">All Languages</option>

            {PREFERRED_LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

            {extraLanguages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="library-message">Loading songs...</p>
        )}

        {!loading && error && (
          <div className="library-message error-message">
            <p>{error}</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredSongs.length === 0 && (
          <div className="library-message">
            <h3>No songs found</h3>
            <p>
              Try another search, check the movie name, or select
              All Languages.
            </p>
            {search && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setLanguage("All");
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {!loading && !error && groupedSongs.length > 0 && (
          <div className="language-sections">
            {groupedSongs.map((group) => (
              <section
                className="language-section"
                key={group.name.toLowerCase()}
              >
                <div className="language-section-heading">
                  <div>
                    <p className="section-label">
                      EXPLORE BY LANGUAGE
                    </p>
                    <h2>{group.name} Songs</h2>
                  </div>

                  <span className="song-count">
                    {group.songs.length}
                  </span>
                </div>

                <div className="song-grid">
                  {group.songs.map((song) => {
                    const isFavorite = favoriteIds.has(
                      String(song.id)
                    );

                    const movieName =
                      song.movieName || song.movie_name || "";

                    const songType =
                      song.songType || song.song_type || "";

                    const isMovieSong =
                      songType.toUpperCase() === "MOVIE" ||
                      songType.toUpperCase() === "MOVIE SONG";

                    return (
                      <article className="song-card" key={song.id}>
                        <div className="song-card-top">
                          <span className="song-language">
                            {song.language || "Other"}
                          </span>

                          <button
                            type="button"
                            className={`favorite-button ${
                              isFavorite ? "is-favorite" : ""
                            }`}
                            aria-label={
                              isFavorite
                                ? "Remove from favourites"
                                : "Add to favourites"
                            }
                            title={
                              isFavorite
                                ? "Remove from favourites"
                                : "Add to favourites"
                            }
                            onClick={() => toggleFavorite(song)}
                          >
                            {isFavorite ? "♥" : "♡"}
                          </button>
                        </div>

                        <h3>{song.title}</h3>

                        <p className="song-artist">
                          {song.artist || "Unknown Artist"}
                        </p>

                        {isMovieSong && movieName && (
                          <p className="song-movie">
                            Movie: {movieName}
                          </p>
                        )}

                        {!isMovieSong && (
                          <p className="song-movie">
                            Private Song
                          </p>
                        )}

                        <button
                          type="button"
                          className="open-lyrics-button"
                          onClick={() => onOpenLyrics(song)}
                        >
                          Open Lyrics <span>→</span>
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;