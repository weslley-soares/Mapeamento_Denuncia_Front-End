import React, { useEffect, useState } from 'react';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, invest: 0, autuadas: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/denuncias.json');
        const data = await response.json();

        const total = data.length;
        const invest = data.filter(d => d.status === 'Em investigação').length;
        const autuadas = data.filter(d => d.status === 'Autuado').length;

        setStats({ total, invest, autuadas });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  const { total, invest, autuadas } = stats;

  return (
    <section className="home">
      <div className="hero">
        <h2>Secretaria do Meio Ambiente</h2>
        <p>
          Protegendo e preservando o meio ambiente de João Pessoa através de ações
          transparentes e eficazes.
        </p>
      </div>

      <div className="info">
        <h3>Estatísticas de Denúncias</h3>
        <p>Acompanhe os números das denúncias ambientais registradas em João Pessoa</p>
      </div>

      <div className="cards">
        <Card title="Total de Denúncias" value={total} />
        <Card title="Em Andamento" value={invest} />
        <Card title="Resolvidas" value={autuadas} />
        <Card title="Pendentes" value={total - (invest + autuadas)} />
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}