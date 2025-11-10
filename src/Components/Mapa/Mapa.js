import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Mapa.css";

const API_URL = "http://localhost:8081/denuncias"; // backend Node.js

export default function Mapa() {
  const [filter, setFilter] = useState({
    bairro: "",
    tipo: "",
    status: "",
    dataIn: "",
    dataFim: "",
  });

  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(false);

  // corrigir ícone padrão do Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  // carregar denúncias ao abrir
  useEffect(() => {
    carregarDenuncias();
  }, []);

  const carregarDenuncias = async (filters = {}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}?${query}`);
      const data = await res.json();
      setDenuncias(data);
    } catch (err) {
      console.error("Erro ao carregar denúncias:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    carregarDenuncias(filter);
  };

  return (
    <section className="mapa-section">
      <h1>Mapa de Denúncias Ambientais</h1>
      <p>
        Visualize as denúncias ambientais em João Pessoa e acompanhe o status de
        cada uma.
      </p>

      <form id="form" onSubmit={handleSubmit}>
        <h3>Filtros</h3>

        <FilterSelect
          label="Bairro"
          name="bairro"
          value={filter.bairro}
          onChange={handleChange}
          options={[
            "Todos os Bairros",
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
          label="Tipo de Denúncia"
          name="tipo"
          value={filter.tipo}
          onChange={handleChange}
          options={[
            "Todos os Tipos",
            "Descarte Irregular de Lixo",
            "Poluição Sonora",
            "Queimada Irregular",
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
          options={[
            "Todos os Status",
            "Pendente",
            "Em Andamento",
            "Concluído",
            "Arquivado",
          ]}
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

      <div id="mapa">
        <h3>Mapa Interativo</h3>
        <div id="status">
          <StatusLabel cor="red" texto="Pendente" />
          <StatusLabel cor="orange" texto="Em Andamento" />
          <StatusLabel cor="green" texto="Concluído" />
          <StatusLabel cor="gray" texto="Arquivado" />
        </div>

        {loading ? (
          <p>Carregando denúncias...</p>
        ) : (
          <MapContainer
            center={[-7.1153, -34.861]} // João Pessoa
            zoom={12}
            style={{ height: "500px", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {denuncias.map((d) => (
              <Marker
                key={d.id}
                position={[d.latitude, d.longitude]}
                icon={getMarkerIcon(d.status)}
              >
                <Popup>
                  <strong>{d.titulo}</strong>
                  <br />
                  <b>Status:</b> {d.status}
                  <br />
                  <b>Bairro:</b> {d.bairro || "Não informado"}
                  <br />
                  <b>Tipo:</b> {d.tipo || "Não especificado"}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </section>
  );
}

function FilterSelect({ label, name, value, onChange, options }) {
  return (
    <div className="filter">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt} value={opt === "Todos os Bairros" ? "" : opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusLabel({ cor, texto }) {
  return (
    <div className="status-item">
      <span style={{ backgroundColor: cor }}></span>
      <p>{texto}</p>
    </div>
  );
}

function getMarkerIcon(status) {
  let color = "gray";
  if (status === "Pendente") color = "red";
  if (status === "Em Andamento") color = "orange";
  if (status === "Concluído") color = "green";

  return new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });
}