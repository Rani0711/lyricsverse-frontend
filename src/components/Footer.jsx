import "./Footer.css";
export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <button className="footer-brand" onClick={() => navigate("home")}>
        ♫ LyricsVerse
      </button>
      <span>Made for the love of music.</span>
      <span>Telugu · Hindi · English</span>
    </footer>
  );
}