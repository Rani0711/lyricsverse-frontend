import { useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import LyricsPage from "./pages/LyricsPage";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || ""
  );

  const [selectedSong, setSelectedSong] = useState(null);

  const isAdmin =
    user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogin(data) {
    const loggedInUser = data.user || {
      name: data.name,
      email: data.email,
      role: data.role || "USER",
    };

    const accessToken = data.token || data.accessToken || "";

    setUser(loggedInUser);
    setToken(accessToken);

    sessionStorage.setItem("user", JSON.stringify(loggedInUser));
    sessionStorage.setItem("token", accessToken);

    navigate(
      loggedInUser.role === "ADMIN" ||
      loggedInUser.role === "ROLE_ADMIN"
        ? "admin"
        : "user"
    );
  }

  function handleLogout() {
    setUser(null);
    setToken("");
    setSelectedSong(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    navigate("home");
  }

  function openLyrics(song) {
    setSelectedSong(song);
    navigate("lyrics");
  }

  function renderPage() {
    switch (page) {
      case "login":
      case "register":
        return (
          <AuthPage
            key={page}
            mode={page}
            navigate={navigate}
            onLogin={handleLogin}
          />
        );

      case "forgot":
        return <ForgotPassword navigate={navigate} />;

      case "lyrics":
        return (
          <LyricsPage
            song={selectedSong}
            navigate={navigate}
          />
        );

      case "user":
        if (!user) {
          return (
            <AuthPage
              mode="login"
              navigate={navigate}
              onLogin={handleLogin}
            />
          );
        }

        if (isAdmin) {
          return (
            <AdminDashboard
              token={token}
              navigate={navigate}
            />
          );
        }

        return (
          <UserDashboard
            user={user}
            navigate={navigate}
            onOpenLyrics={openLyrics}
          />
        );

      case "admin":
        if (!user) {
          return (
            <AuthPage
              mode="login"
              navigate={navigate}
              onLogin={handleLogin}
            />
          );
        }

        if (!isAdmin) {
          return (
            <UserDashboard
              user={user}
              navigate={navigate}
              onOpenLyrics={openLyrics}
            />
          );
        }

        return (
          <AdminDashboard
            token={token}
            navigate={navigate}
          />
        );

      default:
        return (
          <Home
            navigate={navigate}
            onOpenLyrics={openLyrics}
          />
        );
    }
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        isAdmin={isAdmin}
        navigate={navigate}
        onLogout={handleLogout}
      />

      <main>{renderPage()}</main>

      <Footer />
    </div>
  );
}



