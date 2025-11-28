import { useState } from "react";
import "./Cadastro.css";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "fiscal",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8081/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Cadastro realizado com sucesso!");
        setTimeout(() => (window.location.href = "/login"), 1500);
      } else {
        setMessage("❌ " + (data.message || "Erro ao cadastrar usuário"));
      }
    } catch (err) {
      setMessage("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <section className="cadastro-section">
        <div id="imagem-cadastro"></div>
        <form onSubmit={handleSubmit} className="form-cadastro">
          <h1>Cadastro de Funcionário SEMAM</h1>
          <p>Crie uma conta para acessar o painel administrativo</p>
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email institucional"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Crie uma senha segura"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Cargo</label>
            <select name="cargo" value={form.cargo} onChange={handleChange}>
              <option value="fiscal">Fiscal</option>
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <button type="submit" className="btn-cadastro">
            Cadastrar
          </button>

          {message && <p className="msg">{message}</p>}

          <p className="login-link">
            Já tem conta? <a href="/login">Entrar</a>
          </p>

          <p className="login-link">
            Voltar: <a href="/">Página Inicial</a>
          </p>
        </form>
      </section>
  );
}