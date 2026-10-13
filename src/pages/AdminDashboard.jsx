import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./AdminDashboard.css";

const EMPTY_SONG = {
  title: "",
  artist: "",
  language: "Telugu",
  lyrics: "",
  songType: "MOVIE",
  movieName: "",
};

const LANGUAGES = [
  "Telugu",
  "Hindi",
  "English",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Other",
];

function getSongType(item) {
  const value = item.songType || item.song_type || "PRIVATE";
  return String(value).toUpperCase() === "MOVIE" ? "MOVIE" : "PRIVATE";
}

function getMovieName(item) {
  return item.movieName || item.movie_name || "";
}

export default function AdminDashboard({ token, navigate }) {
  const [song, setSong] = useState(EMPTY_SONG);
  const [songs, setSongs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSongs() {
    setListLoading(true);
    setError("");

    try {
      const data = await api.getSongs();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load songs.");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadSongs();
  }, []);

  function updateSong(event) {
    const { name, value } = event.target;

    setSong((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "songType" && value === "PRIVATE"
        ? { movieName: "" }
        : {}),
    }));
  }

  function startEditing(item) {
    setEditingId(item.id);
    setSong({
      title: item.title || "",
      artist: item.artist || "",
      language: item.language || "Telugu",
      lyrics: item.lyrics || "",
      songType: getSongType(item),
      movieName: getMovieName(item),
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setSong(EMPTY_SONG);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!token) {
        throw new Error("Please log in again to continue.");
      }

      if (song.songType === "MOVIE" && !song.movieName.trim()) {
        throw new Error("Please enter the movie name.");
      }

      const payload = {
        ...song,
        title: song.title.trim(),
        artist: song.artist.trim(),
        language: song.language.trim(),
        lyrics: song.lyrics,
        songType: song.songType,
        movieName:
          song.songType === "MOVIE" ? song.movieName.trim() : null,
      };

      if (editingId !== null) {
        await api.updateSong(editingId, payload, token);
        setMessage("Song updated successfully!");
      } else {
        await api.addSong(payload, token);
        setMessage("Song added successfully!");
      }

      setEditingId(null);
      setSong(EMPTY_SONG);
      await loadSongs();
    } catch (err) {
      setError(err.message || "Operation failed. Check your admin permissions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}" by ${item.artist}? This cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      if (!token) {
        throw new Error("Please log in again to continue.");
      }

      await api.deleteSong(item.id, token);

      if (String(editingId) === String(item.id)) {
        setEditingId(null);
        setSong(EMPTY_SONG);
      }

      setMessage(`"${item.title}" was deleted.`);
      await loadSongs();
    } catch (err) {
      setError(err.message || "Could not delete the song.");
    }
  }

  return (
    <section className="admin-page section-width">
      <div className="admin-heading">
        <div>
          <p className="admin-kicker">CONTENT MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Add, edit and manage songs in LyricsVerse.</p>
        </div>
        <span className="admin-badge">Admin</span>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId !== null ? "Edit Song" : "Add New Song"}</h2>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="songTitle">Song title</label>
            <input
              id="songTitle"
              name="title"
              value={song.title}
              onChange={updateSong}
              placeholder="Enter song title"
              maxLength={200}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="songArtist">Artist</label>
            <input
              id="songArtist"
              name="artist"
              value={song.artist}
              onChange={updateSong}
              placeholder="Enter artist name"
              maxLength={150}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="songLanguage">Language</label>
            <select
              id="songLanguage"
              name="language"
              value={song.language}
              onChange={updateSong}
              required
            >
              {LANGUAGES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="songType">Song type</label>
            <select
              id="songType"
              name="songType"
              value={song.songType}
              onChange={updateSong}
              required
            >
              <option value="MOVIE">Movie Song</option>
              <option value="PRIVATE">Private Song / Non-movie</option>
            </select>
          </div>

          {song.songType === "MOVIE" && (
            <div className="admin-field">
              <label htmlFor="movieName">Movie name</label>
              <input
                id="movieName"
                name="movieName"
                value={song.movieName}
                onChange={updateSong}
                placeholder="Enter movie name"
                maxLength={255}
                required
              />
            </div>
          )}
        </div>

        <div className="admin-field">
          <label htmlFor="songLyrics">Lyrics</label>
          <textarea
            id="songLyrics"
            name="lyrics"
            value={song.lyrics}
            onChange={updateSong}
            placeholder="Enter lyrics or text you have permission to use..."
            rows={12}
            maxLength={100000}
            required
          />
        </div>

        <div className="admin-form-actions">
          <button
            className="button-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : editingId !== null
                ? "Update Song"
                : "Save Song"}
          </button>

          {editingId !== null && (
            <button
              className="admin-back"
              type="button"
              onClick={cancelEditing}
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {message && <p className="admin-success">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
      </form>

      <section className="admin-song-management">
        <div className="admin-heading">
          <div>
            <p className="admin-kicker">YOUR LIBRARY</p>
            <h2>Manage Songs ({songs.length})</h2>
          </div>

          <button
            type="button"
            className="admin-back"
            onClick={loadSongs}
            disabled={listLoading}
          >
            {listLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {listLoading ? (
          <p>Loading songs...</p>
        ) : songs.length === 0 ? (
          <p>No songs have been added yet.</p>
        ) : (
          <div className="admin-song-list">
            {songs.map((item) => (
              <article className="admin-song-item" key={item.id}>
                <div className="admin-song-info">
                  <h3>{item.title}</h3>
                  <p>
                    {item.artist} · {item.language} ·{" "}
                    {getSongType(item) === "MOVIE"
                      ? getMovieName(item) || "Movie"
                      : "Private Song"}
                  </p>
                </div>

                <div className="admin-song-actions">
                  <button
                    type="button"
                    className="admin-back"
                    onClick={() => startEditing(item)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        className="admin-back"
        onClick={() => navigate("home")}
      >
        ← Back to Home
      </button>
    </section>
  );
}