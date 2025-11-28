import { useState, useEffect } from "react";
import MapSelector from "./MapSelector";
import "./CadDenuncia.css";

const API_URL = "http://localhost:8081/denuncias";

export default function CadastroDenuncia({ protocolo }) {
  const [form, setForm] = useState({
    titulo: "",
    tipo: "",
    bairro: "",
    descricao: "",
    latitude: "",
    longitude: "",
    status: "",
    endereco: "",
    estado: "", // ← novo
  });

  const [markerPos, setMarkerPos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");

  // Buscar dados pelo protocolo
  useEffect(() => {
    async function fetchData() {
      if (!protocolo) return;

      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${protocolo}`);
        const data = await res.json();

        if (!data || data.error) {
          setMsg("Nenhuma denúncia encontrada.");
          return;
        }

        const lat = data.latitude || "";
        const lng = data.longitude || "";

        setForm({
          titulo: data.titulo || "",
          tipo: data.tipo || "",
          bairro: data.bairro || "",
          descricao: data.descricao || "",
          latitude: lat,
          longitude: lng,
          status: data.status || "",
          endereco: data.endereco || "",
          estado: data.estado || "",
        });

        // Se já vier latitude/longitude, posiciona o marcador no mapa
        if (lat && lng) {
          const latNum = parseFloat(lat);
          const lngNum = parseFloat(lng);
          if (!isNaN(latNum) && !isNaN(lngNum)) {
            setMarkerPos([latNum, lngNum]);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [protocolo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // função passada para o mapa atualizar latitude/longitude E fazer reverse geocoding
  const handleCoordsChange = async (lat, lng) => {
    // Atualiza lat/lng sempre
    setForm((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "pt-BR", // tenta trazer info em PT
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      const addr = data.address || {};

      const bairro =
        addr.suburb ||
        addr.neighbourhood ||
        addr.city_district ||
        "";

      const estado = addr.state || "";

      const logradouro = [
        addr.road,
        addr.house_number,
      ]
        .filter(Boolean)
        .join(", ");

      const cidade = addr.city || addr.town || addr.village || "";

      // Monta um endereço amigável
      const enderecoStr =
        logradouro && (bairro || cidade)
          ? `${logradouro} - ${bairro || cidade}`
          : data.display_name || "";

      // Atualiza formulário sem apagar o que o usuário já escreveu
      setForm((prev) => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString(),
        bairro: bairro || prev.bairro,
        estado: estado || prev.estado,
        endereco: prev.endereco || enderecoStr,
      }));
    } catch (err) {
      console.error("Erro no reverse geocoding:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Você precisa estar autenticado.");
      return;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao cadastrar");
      return;
    }

    alert("Denúncia cadastrada com sucesso!");
  };

  return (
    <section className="denuncia-section">
      <h1>Cadastrar denúncia</h1>

      {msg && <p className="msg">{msg}</p>}
      {loading && <p className="msg">Carregando...</p>}

      {/* MAPA */}
      <div className="map-container">
        <MapSelector
          markerPos={markerPos}
          setMarkerPos={setMarkerPos}
          setCoords={handleCoordsChange}
        />
      </div>

      {/* FORMULÁRIO */}
      <form className="form-grid" onSubmit={handleSubmit}>
        {/* TÍTULO */}
        <div className="input-group">
          <label>Título</label>
          <select
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Queimada">Queimada</option>
            <option value="Descarte Irregular de Lixo">Descarte Irregular de Lixo</option>
            <option value="Poluição sonora">Poluição sonora</option>
            <option value="Poluição do Ar">Poluição do Ar</option>
            <option value="Desmatamento Ilegal">Desmatamento Ilegal</option>
            <option value="Poluição de Água">Poluição de Água</option>
            <option value="Maus Tratos a Animais">Maus Tratos a Animais</option>
            <option value="Construção Irregular">Construção Irregular</option>
          </select>
        </div>

        {/* TIPO */}
        <div className="input-group">
          <label>Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Crítica">Crítica</option>
            <option value="Alerta">Alerta</option>
            <option value="Informativa">Informativa</option>
          </select>
        </div>

        {/* BAIRRO */}
        <div className="input-group">
          <label>Bairro</label>
          <select
            name="bairro"
            value={form.bairro}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o bairro</option>
            <option value="Centro">Centro</option>
            <option value="Tambaú">Tambaú</option>
            <option value="Mangabeira">Mangabeira</option>
            <option value="Cabo Branco">Cabo Branco</option>
            <option value="Manaíra">Manaíra</option>
            <option value="Bancários">Bancários</option>
            <option value="Bessa">Bessa</option>
            <option value="Torre">Torre</option>
          </select>
        </div>

        {/* ESTADO (novo campo) */}
        <div className="input-group">
          <label>Estado</label>
          <input
            name="estado"
            value={form.estado}
            onChange={handleChange}
            placeholder="Preenchido automaticamente"
          />
        </div>

        {/* STATUS */}
        <div className="input-group full">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Arquivado">Arquivado</option>
          </select>
        </div>

        {/* DESCRIÇÃO */}
        <div className="input-group full">
          <label>Descrição</label>
          <textarea
            name="descricao"
            id="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Digite a descrição completa da denúncia..."
            required
          />
        </div>


        {/* COORDENADAS */}
        <div className="coord-grid full">
          <div className="input-group">
            <label>Latitude</label>
            <input
              name="latitude"
              value={form.latitude}
              readOnly
              placeholder="Clique no mapa para preencher"
            />
          </div>

          <div className="input-group">
            <label>Longitude</label>
            <input
              name="longitude"
              value={form.longitude}
              readOnly
              placeholder="Clique no mapa para preencher"
            />
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="input-group full">
          <label>Endereço</label>
          <input
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Digite ou use o mapa para preencher"
            required
          />
        </div>

        <div className="input-group full">
          <button type="submit" className="btn-enviar">
            Cadastrar
          </button>
        </div>
      </form>
    </section>
  );
}