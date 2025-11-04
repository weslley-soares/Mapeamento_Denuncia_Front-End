import './Sobre.css';

export default function Sobre() {
  const valores = [
    {
      id: 'missao',
      titulo: 'Missão',
      texto:
        'Proteger, preservar e promover a qualidade ambiental de João Pessoa, garantindo o desenvolvimento sustentável e a qualidade de vida da população.',
      cor: 'rgb(148, 255, 219)',
    },
    {
      id: 'visao',
      titulo: 'Visão',
      texto:
        'Ser referência nacional em gestão ambiental urbana, promovendo uma cidade sustentável e ambientalmente equilibrada.',
      cor: 'rgb(107, 234, 248)',
    },
    {
      id: 'valor',
      titulo: 'Valores',
      texto:
        'Transparência, sustentabilidade, inovação, participação social e compromisso com as futuras gerações.',
      cor: 'rgb(249, 236, 119)',
    },
  ];

  const historia = [
    {
      ano: '2023',
      titulo: 'Redução de 35% nas Infrações Ambientais',
      descricao: 'Implementação de programa intensivo de fiscalização e educação ambiental',
    },
    {
      ano: '2022',
      titulo: 'Plantio de 5.000 Mudas',
      descricao: 'Programa de arborização urbana em parceria com escolas e comunidades',
    },
    {
      ano: '2021',
      titulo: 'Sistema Digital de Denúncias',
      descricao: 'Lançamento da plataforma online para facilitar denúncias da população',
    },
    {
      ano: '2020',
      titulo: 'Criação de 3 Novas Áreas Protegidas',
      descricao: 'Ampliação das áreas de conservação ambiental no município',
    },
  ];

  const organizacao = [
    {
      id: 'fiscalizacao',
      titulo: 'Diretoria de Fiscalização',
      descricao: 'Monitoramento e controle ambientais',
      icon: '../../img/icone_fiscalizacao.png',
    },
    {
      id: 'licenciacao',
      titulo: 'Coordenação de Licenciamento',
      descricao: 'Análise e concessão de licenças',
      icon: '../../img/icone_licenca.png',
    },
    {
      id: 'educar',
      titulo: 'Educação Ambiental',
      descricao: 'Conscientização e capacitação',
      icon: '../../img/icone_educacao.png',
    },
    {
      id: 'arvores',
      titulo: 'Arborização Urbana',
      descricao: 'Gestão do verde urbano',
      icon: '../../img/icone_arbo.png',
    },
  ];

  return (
    <section className="sobre">
      <div className="img-sobre">
        <h2>Sobre a SEMAM</h2>
        <p>
          Comprometidos com a preservação ambiental e o desenvolvimento sustentável de João Pessoa
        </p>
      </div>

      {/* --- Valores --- */}
      <div className="valores">
        <div className="valores-container">
          {valores.map(({ id, titulo, texto, cor }) => (
            <div key={id} className="card">
              <div style={{ backgroundColor: cor }}></div>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- História --- */}
      <div className="historia">
        <h2>Nossa História</h2>
        <p className="subtitulo">Conheça os principais marcos da SEMAM João Pessoa</p>

        <div className="historia-lista">
          {historia.map(({ ano, titulo, descricao }) => (
            <div key={ano} className="historia-item">
              <div className="ano">{ano}</div>
              <div className="texto">
                <h3>{titulo}</h3>
                <p>{descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Organização --- */}
      <div className="organizacao">
        <h2>Estrutura Organizacional</h2>
        <p>Divisões especializadas para atender todas as demandas ambientais</p>

        <div className="organizacao-grid">
          {organizacao.map(({ id, titulo, descricao, icon }) => (
            <div key={id} className="org-card">
              <div
                className="org-icon"
                style={{
                  background: `#81F181 url(${icon}) no-repeat center center / cover`,
                }}
              ></div>
              <h4>{titulo}</h4>
              <p>{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}