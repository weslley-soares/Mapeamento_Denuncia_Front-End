import { useEffect, useState } from "react";
import "./Link.css";

export default function Link() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <div id="nav">
      {isLoggedIn ? (
        <button id="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      ) : (
        <>
          <a href="/cadastro" className="nav-link">Cadastro</a>
          <span className="separator">|</span>
          <a href="/login" className="nav-link">Login</a>
        </>
      )}
    </div>
  );
}