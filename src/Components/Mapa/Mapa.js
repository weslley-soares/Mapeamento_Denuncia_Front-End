import { useEffect, useState } from "react";
import "./Mapa.css";
import MapSelector from "../CadDenuncias/MapSelector";

const API_URL = "http://localhost:8081/denuncias";

export default function Mapa() {
  const [filter, setFilter] = useState({
    bairro: "",
    titulo: "",
    tipo: "",
    status: "",
    dataIn: "",
    dataFim: "",
  });

  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDenuncia, setSelectedDenuncia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarDenuncias({ limit: 20 });
  }, []);

  const carregarDenuncias = async (filters = {}) => {
    try {
      setLoading(true);

      const query = new URLSearchParams(filters).toString();

      const res = await fetch(`${API_URL}?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Erro na requisição:", res.status);
        setDenuncias([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setDenuncias(data);
      } else if (data && Array.isArray(data.denuncias)) {
        setDenuncias(data.denuncias);
      } else {
        setDenuncias([]);
      }
    } catch (err) {
      console.error("Erro ao carregar denúncias:", err);
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtrosAplicados = { ...filter };
    carregarDenuncias(filtrosAplicados);
  };

  const handleOpenModal = (denuncia) => {
    setSelectedDenuncia(denuncia);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDenuncia(null);
  };

  const handleDenunciaAtualizada = (denunciaAtualizada) => {
    setDenuncias((prev) =>
      prev.map((d) => (d.id === denunciaAtualizada.id ? denunciaAtualizada : d))
    );
  };

  return (
    <section className="mapa-section">
      <h1>Listagem de Denúncias Ambientais</h1>

      {!token && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          ⚠️ Você precisa estar logado para visualizar as denúncias.
        </p>
      )}

      {/* FORMULÁRIO DE FILTROS */}
      <form id="form" onSubmit={handleSubmit}>
        <FilterSelect
          label="Bairro"
          name="bairro"
          value={filter.bairro}
          onChange={handleChange}
          options={[
            "",
            "Centro",
            "Tambaú",
            "Mangabeira",
            "Cabo Branco",
            "Manaíra",
            "Bancários",
            "Bessa",
            "Torre",
          ]}
        />

        <FilterSelect
          label="Título"
          name="titulo"
          value={filter.titulo}
          onChange={handleChange}
          options={[
            "",
            "Descarte Irregular de Lixo",
            "Poluição Sonora",
            "Queimada",
            "Poluição do Ar",
            "Desmatamento Ilegal",
            "Poluição de Água",
            "Maus Tratos a Animais",
            "Construção Irregular",
          ]}
        />

        <FilterSelect
          label="Status"
          name="status"
          value={filter.status}
          onChange={handleChange}
          options={["", "Pendente", "Em Andamento", "Concluído", "Arquivado"]}
        />

        <FilterSelect
          label="Tipo"
          name="tipo"
          value={filter.tipo}
          onChange={handleChange}
          options={["", "Crítica", "Alerta", "Informativa"]}
        />

        <div className="filter">
          <label>Data de Início</label>
          <input
            type="date"
            name="dataIn"
            value={filter.dataIn}
            onChange={handleChange}
          />
        </div>

        <div className="filter">
          <label>Data de Fim</label>
          <input
            type="date"
            name="dataFim"
            value={filter.dataFim}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-filtrar">
          Aplicar Filtros
        </button>
      </form>

      {/* LISTAGEM DE DENÚNCIAS */}
      <div className="lista-cards">
        {loading ? (
          <p>Carregando denúncias...</p>
        ) : denuncias.length === 0 ? (
          <p>Nenhuma denúncia encontrada.</p>
        ) : (
          denuncias.map((d) => (
            <div className="card-denuncia" key={d.id}>
              <h2>{d.titulo}</h2>

              <p>
                <b>Protocolo:</b> {d.protocolo}
              </p>
              <p>
                <b>Status:</b> {d.status}
              </p>
              <p>
                <b>Tipo:</b> {d.tipo}
              </p>
              <p>
                <b>Bairro:</b> {d.bairro}
              </p>
              <p>
                <b>Endereço:</b> {d.endereco}
              </p>
              <p>
                <b>Descrição:</b> {d.descricao}
              </p>

              <p>
                <b>Data:</b>{" "}
                {d.data_criacao ? new Date(d.data).toLocaleDateString() : "Não informada"}
              </p>

              <p>
                <b>Latitude:</b> {d.latitude}
              </p>
              <p>
                <b>Longitude:</b> {d.longitude}
              </p>

              <button
                className="btn-atualizar"
                type="button"
                onClick={() => handleOpenModal(d)}
              >
                Atualizar
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && selectedDenuncia && (
        <UpdateDenunciaModal
          denuncia={selectedDenuncia}
          token={token}
          onClose={handleCloseModal}
          onUpdated={handleDenunciaAtualizada}
        />
      )}
    </section>
  );
}

function FilterSelect({ label, name, value, onChange, options }) {
  return (
    <div className="filter">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt || "todos"} value={opt}>
            {opt || "Todos"}
          </option>
        ))}
      </select>
    </div>
  );
}

/* 🔹 MODAL PARA ATUALIZAR STATUS / ENDEREÇO COM MAPA */
function UpdateDenunciaModal({ denuncia, token, onClose, onUpdated }) {
  const [form, setForm] = useState({
    status: denuncia.status || "",
    endereco: denuncia.endereco || "",
    bairro: denuncia.bairro || "",
    estado: denuncia.estado || "",
    latitude: denuncia.latitude || "",
    longitude: denuncia.longitude || "",
  });

  const [markerPos, setMarkerPos] = useState(() => {
    const lat = parseFloat(denuncia.latitude);
    const lng = parseFloat(denuncia.longitude);
    return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
  });

  const [saving, setSaving] = useState(false);

  // "status" ou "endereco"
  const [modo, setModo] = useState("status");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordsChange = async (lat, lng) => {
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
            "Accept-Language": "pt-BR",
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

      const logradouro = [addr.road, addr.house_number]
        .filter(Boolean)
        .join(", ");

      const cidade = addr.city || addr.town || addr.village || "";

      const enderecoStr =
        logradouro && (bairro || cidade)
          ? `${logradouro} - ${bairro || cidade}`
          : data.display_name || "";

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

    // ✅ Validações simples no front pra evitar 400 bobo
    if (modo === "status" && !form.status) {
      alert("Selecione um status antes de salvar.");
      return;
    }

    if (
      modo === "endereco" &&
      (!form.latitude || !form.longitude || !form.endereco)
    ) {
      alert(
        "Clique no mapa para preencher latitude/longitude e informe um endereço."
      );
      return;
    }

    try {
      setSaving(true);

      let url = "";
      let method = "";
      let payload = {};

      if (modo === "status") {
        // 🔹 Atualiza SÓ status: PATCH /:id/status
        url = `${API_URL}/${denuncia.id}/status`;
        method = "PATCH";
        payload = { status: form.status };
      } else if (modo === "endereco") {
        // 🔹 Atualiza SÓ localização/endereço: PATCH /:id/location
        url = `${API_URL}/${denuncia.id}/location`;
        method = "PATCH";
        payload = {
          endereco: form.endereco,
          bairro: form.bairro,
          estado: form.estado,
          latitude: form.latitude,
          longitude: form.longitude,
        };
      }

      console.log("[UPDATE DENÚNCIA] Enviando:", { url, method, payload });

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      console.log("[UPDATE DENÚNCIA] Resposta backend:", res.status, data || text);

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Erro ao atualizar denúncia (status ${res.status})`;
        alert(msg);
        return;
      }

      // backend pode devolver { denuncia: {...} } ou o objeto direto
      const updated = data && (data.denuncia || data);
      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar denúncia:", err);
      alert("Erro ao atualizar denúncia");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="modal-header">
          <h2>Atualizar Denúncia</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </header>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Escolha do que atualizar */}
          <div className="modal-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${modo === "status" ? "active" : ""}`}
              onClick={() => setModo("status")}
            >
              Atualizar status
            </button>
            <button
              type="button"
              className={`mode-btn ${modo === "endereco" ? "active" : ""}`}
              onClick={() => setModo("endereco")}
            >
              Atualizar endereço
            </button>
          </div>

          {modo === "status" && (
            <div className="modal-grid">
              <div className="modal-group full">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required={modo === "status"}
                >
                  <option value="">Selecione</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </div>
            </div>
          )}

          {modo === "endereco" && (
            <>
              <div className="modal-grid">
                <div className="modal-group">
                  <label>Bairro</label>
                  <input
                    name="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    placeholder="Preenchido automaticamente pelo mapa (ou edite)"
                  />
                </div>

                <div className="modal-group">
                  <label>Estado</label>
                  <input
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    placeholder="Preenchido automaticamente pelo mapa (ou edite)"
                  />
                </div>

                <div className="modal-group full">
                  <label>Endereço</label>
                  <input
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="modal-group">
                  <label>Latitude</label>
                  <input
                    name="latitude"
                    value={form.latitude}
                    readOnly
                    placeholder="Clique no mapa"
                  />
                </div>

                <div className="modal-group">
                  <label>Longitude</label>
                  <input
                    name="longitude"
                    value={form.longitude}
                    readOnly
                    placeholder="Clique no mapa"
                  />
                </div>
              </div>

              <div className="modal-map">
                <MapSelector
                  markerPos={markerPos}
                  setMarkerPos={setMarkerPos}
                  setCoords={handleCoordsChange}
                />
              </div>
            </>
          )}

          <footer className="modal-footer">
            <button
              type="button"
              className="btn-secundario"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}