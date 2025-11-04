import { useState } from 'react';
import './Mapa.css';

export default function Mapa() {
  const [filter, setFilter] = useState({
    bairro: '',
    tipo: '',
    status: '',
    dataIn: '',
    dataFim: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8081/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter),
      });

      const data = await res.json();
      alert(data.msg || 'Filtro aplicado com sucesso');
    } catch (err) {
      console.error('Erro ao buscar informações:', err);
    }
  };

  return (
    <section className="mapa-section">
      <h1>Mapa de Denúncias Ambientais</h1>
      <p>
        Visualize as denúncias ambientais em João Pessoa e acompanhe o status de cada uma.
      </p>

      <form id="form" onSubmit={handleSubmit}>
        <h3>Filtros</h3>

        <FilterSelect
          label="Bairro"
          name="bairro"
          value={filter.bairro}
          onChange={handleChange}
          options={[
            'Todos os Bairros',
            'Centro',
            'Tambaú',
            'Mangabeira',
            'Cabo Branco',
            'Manaíra',
            'Bancários',
            'Bessa',
            'Torre',
          ]}
        />

        <FilterSelect
          label="Tipo de Denúncia"
          name="tipo"
          value={filter.tipo}
          onChange={handleChange}
          options={[
            'Todos os Tipos',
            'Descarte Irregular de Lixo',
            'Poluição Sonora',
            'Queimada Irregular',
            'Poluição do Ar',
            'Desmatamento Ilegal',
            'Poluição de Água',
            'Maus Tratos a Animais',
            'Construção Irregular',
          ]}
        />

        <FilterSelect
          label="Status"
          name="status"
          value={filter.status}
          onChange={handleChange}
          options={[
            'Todos os Status',
            'Pendentes',
            'Em Andamento',
            'Resolvidas',
            'Arquivadas',
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

        <button type="submit" className="btn-filtrar">Aplicar Filtros</button>
      </form>

      <div id="mapa">
        <h3>Mapa Interativo</h3>
        <div id="status">
          <StatusLabel cor="red" texto="Pendente" />
          <StatusLabel cor="yellow" texto="Em Andamento" />
          <StatusLabel cor="green" texto="Resolvida" />
          <StatusLabel cor="gray" texto="Arquivada" />
        </div>
      </div>

      <div id="mapeamento">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15836.13129252998!2d-34.983713808609934!3d-7.122194079498792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1760226859869!5m2!1spt-BR!2sbr"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
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
          <option key={opt} value={opt}>
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