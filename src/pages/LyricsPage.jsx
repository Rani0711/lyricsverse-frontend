import "./LyricsPage.css";

export default function LyricsPage({ song, navigate }) {
  if (!song) {
    return (
      <section className="lyrics-page">
        <h2>Song not selected</h2>
        <button className="button-primary" onClick={() => navigate("home")}>
          Browse Songs
        </button>
      </section>
    );
  }

  return (
    <section className="lyrics-page">
      <button className="back-link" onClick={() => navigate("home")}>
        ← Back to song library
      </button>

      <article className="lyrics-sheet">
        <div className="lyrics-cover">♫</div>
        <span className="song-tag">{song.language}</span>
        <h1>{song.title}</h1>
        <p className="lyrics-byline">Performed by {song.artist}</p>

        <div className="lyrics-divider" />

        <h2>Lyrics</h2>
        <div className="lyrics-content">
          {song.lyrics || "Lyrics are not available yet."}
        </div>

        <button className="button-secondary" onClick={() => navigate("home")}>
          Explore More Songs
        </button>
      </article>
    </section>
  );
}
