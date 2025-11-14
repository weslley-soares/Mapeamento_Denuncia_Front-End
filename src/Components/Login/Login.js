import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    senha: "",
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
      const res = await fetch("http://localhost:8081/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Login realizado com sucesso!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage("❌ " + (data.message || "Erro ao fazer login"));
      }
    } catch (err) {
      setMessage("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <div id="log">
      <form onSubmit={handleSubmit} className="form-login">
        <h1>Login do Sistema SEMAM</h1>
        <p>Acesse o painel de denúncias ambientais</p>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Digite seu email institucional"
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
            placeholder="Digite sua senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-login">
          Entrar
        </button>

        {message && <p className="msg">{message}</p>}

        <p className="cadastro-link">
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </form>
      </div>
  );
}