import { useState, useEffect } from "react";
import "./CadDenuncia.css";

export default function CadastrarDenuncia() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    bairro: "",
    endereco: "",
    latitude: "",
    longitude: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3333/api/denuncias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Denúncia cadastrada com sucesso!");
        setForm({
          titulo: "",
          descricao: "",
          tipo: "",
          bairro: "",
          endereco: "",
          latitude: "",
          longitude: "",
        });
      } else {
        setMessage("❌ " + (data.message || "Erro ao cadastrar denúncia"));
      }
    } catch (err) {
      setMessage("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <section className="denuncia-section">
      <h1>Cadastrar Nova Denúncia</h1>
      <p>Preencha os dados abaixo para registrar uma nova denúncia ambiental.</p>

      <form onSubmit={handleSubmit} className="form-denuncia">
        <div className="input-group">
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            placeholder="Ex: Lixo acumulado em via pública"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            placeholder="Descreva o problema ambiental..."
            value={form.descricao}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="input-group">
          <label>Tipo de Denúncia</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="Descarte Irregular de Lixo">Descarte Irregular de Lixo</option>
            <option value="Poluição Sonora">Poluição Sonora</option>
            <option value="Queimada Irregular">Queimada Irregular</option>
            <option value="Desmatamento Ilegal">Desmatamento Ilegal</option>
            <option value="Poluição de Água">Poluição de Água</option>
            <option value="Maus Tratos a Animais">Maus Tratos a Animais</option>
            <option value="Construção Irregular">Construção Irregular</option>
          </select>
        </div>

        <div className="input-group">
          <label>Bairro</label>
          <input
            type="text"
            name="bairro"
            placeholder="Informe o bairro"
            value={form.bairro}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Endereço</label>
          <input
            type="text"
            name="endereco"
            placeholder="Rua, número, ponto de referência..."
            value={form.endereco}
            onChange={handleChange}
          />
        </div>

        <div className="coord-grid">
          <div className="input-group">
            <label>Latitude</label>
            <input
              type="number"
              name="latitude"
              step="0.000001"
              value={form.latitude}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Longitude</label>
            <input
              type="number"
              name="longitude"
              step="0.000001"
              value={form.longitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-enviar">
          Cadastrar Denúncia
        </button>

        {message && <p className="msg">{message}</p>}
      </form>
    </section>
  );
}