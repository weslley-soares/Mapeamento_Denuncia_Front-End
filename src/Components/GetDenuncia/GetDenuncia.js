import { useState } from "react";
import "./GetDenuncia.css";

export default function PesquisarDenuncias() {
  const [protocolo, setProtocolo] = useState("");
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    if (!protocolo.trim()) {
      setErro("Digite um protocolo válido.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/denuncias/${protocolo}`);

      if (!res.ok) {
        throw new Error("Erro ao buscar denúncia.");
      }

      const data = await res.json();

      setDenuncias(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      setErro("Nenhuma denúncia encontrada.");
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pesquisar-section">
      <h1>Pesquisar Denúncia</h1>
      <p>Busque uma denúncia informando o protocolo.</p>

      <form onSubmit={handleSearch} className="form-pesquisar">
        <input
          type="text"
          name="protocolo"
          placeholder="Digite o protocolo"
          value={protocolo}
          onChange={(e) => setProtocolo(e.target.value)}
        />

        <button type="submit" className="btn-buscar">
          Buscar
        </button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="lista-denuncias">
          {denuncias.length > 0 ? (
            denuncias.map((d) => (
              <div className="card-denuncia" key={d.id}>
                <h3>{d.titulo}</h3>
                <p><b>Status:</b> {d.status}</p>
                <p><b>Bairro:</b> {d.bairro}</p>
                <p><b>Endereço:</b> {d.endereco}</p>
                <p><b>Descrição:</b> {d.descricao}</p>
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