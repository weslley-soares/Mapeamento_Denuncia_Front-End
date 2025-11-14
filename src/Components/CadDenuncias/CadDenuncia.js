import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

  const [markerPos, setMarkerPos] = useState(null);
  const [message, setMessage] = useState("");

  // 👉 Função que reage ao clique no mapa
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Atualiza marcador
        setMarkerPos([lat, lng]);

        // Atualiza o formulário
        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
    });

    return null;
  }

  const icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42], 
  popupAnchor: [0, -40],
  shadowAnchor: [13, 40]
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8081/denuncias", {
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
        setMarkerPos(null);
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
      <p>Clique no mapa para selecionar a localização da denúncia.</p>

      {/* 🟢 MAPA AQUI */}
<div className="map-container">
  <MapContainer
    center={[-7.12, -34.88]}
    zoom={13}
    className="mapa"
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    <MapClickHandler />

    {markerPos && (
      <Marker position={markerPos} icon={icon}>
        <Popup>
          📍 Local selecionado <br />
          Lat: {markerPos[0].toFixed(6)} <br />
          Lng: {markerPos[1].toFixed(6)}
        </Popup>
      </Marker>
    )}
  </MapContainer>
</div>

      <form onSubmit={handleSubmit} className="form-denuncia">
        <div className="input-group">
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="input-group">
          <label>Tipo de Denúncia</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
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
            value={form.bairro}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
          />
        </div>

        <div className="coord-grid">
          <div className="input-group">
            <label>Latitude</label>
            <input type="number" name="latitude" value={form.latitude} readOnly />
          </div>

          <div className="input-group">
            <label>Longitude</label>
            <input type="number" name="longitude" value={form.longitude} readOnly />
          </div>
        </div>

        <button type="submit" className="btn-enviar">Cadastrar Denúncia</button>

        {message && <p className="msg">{message}</p>}
      </form>
    </section>
  );
}