import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Nav.css";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <nav className={`menu ${menuOpen ? "open" : ""}`}>
        <a href="/">Home</a>

        {isLoggedIn && <a href="/mapa">Mapa</a>}
        <a href="/getdenuncia">Pesquisar</a>

        {isLoggedIn && <a href="/cdenuncia">Cadastrar Denúncias</a>}
        <a href="/sobre">Sobre</a>
      </nav>
    </div>
  );
}