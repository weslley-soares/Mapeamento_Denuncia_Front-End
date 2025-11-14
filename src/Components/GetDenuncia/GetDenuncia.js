import { useState } from "react";
import "./GetDenuncia.css";

export default function PesquisarDenuncias() {
  const [filtros, setFiltros] = useState({
    protocolo: "",
    tipo: "",
    status: "",
    bairro: "",
  });

  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const query = new URLSearchParams(filtros).toString();

    try {
      const res = await fetch(`http://localhost:8081/denuncias?${query}`);
      const data = await res.json();
      setDenuncias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pesquisar-section">
      <h1>Pesquisar Denúncias</h1>
      <p>Busque denúncias por protocolo, tipo, status ou bairro.</p>

      <form onSubmit={handleSearch} className="form-pesquisar">
        <input
          type="text"
          name="protocolo"
          placeholder="Protocolo"
          value={filtros.protocolo}
          onChange={handleChange}
        />

        <button type="submit" className="btn-buscar">
          Buscar
        </button>
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="lista-denuncias">
          {denuncias.length > 0 ? (
            denuncias.map((d) => (
              <div className="card-denuncia" key={d.id}>
                <h3>{d.titulo}</h3>
                <p><b>Protocolo:</b> {d.protocolo}</p>
                <p><b>Data:</b> {new Date(d.data_criacao).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma denúncia encontrada.</p>
          )}
        </div>
      )}
    </section>
  );
}