import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Nav.css';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 🔍 Verifica se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true se existir token
  }, []);

  return (
    <div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <nav className={`menu ${menuOpen ? 'open' : ''}`}>
        <a href="/">Home</a>
        <a href="/Mapa">Mapa</a>
        <a href="/getdenuncia">Pesquisar</a>

        {/* 🔒 Só aparece se estiver logado */}
        {isLoggedIn && <a href="/cdenuncia">Cadastrar Denúncias</a>}

        <a href="/sobre">Sobre</a>
      </nav>
    </div>
  );
}