import { useState } from 'react';
import './Contato.css';

export default function Contato() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        tel: '',
        denuncia: '',
        bairro: '',
        endereco: '',
        descricao: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3000/contato', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('Mensagem enviada com sucesso!');
                setFormData({
                    nome: '',
                    email: '',
                    tel: '',
                    denuncia: '',
                    bairro: '',
                    endereco: '',
                    descricao: ''
                });
            } else {
                alert(data.msg || 'Erro ao enviar mensagem.');
            }
        } catch (err) {
            alert('Não foi possível enviar a mensagem.');
            console.error(err);
        }
    };

    return (
        <section id="form">
            <article id="img">
                <h2>Entre em Contato</h2>
                <p>Faça sua denúncia ou entre em contato conosco. Sua participação é fundamental para preservar o meio ambiente.</p>
            </article>

            <article id="formulario">
                <h3>Fazer uma Denúncia</h3>

                <section id="contatos">
                    <form onSubmit={handleSubmit}>
                        <div className="campos">
                            <h4>Nome Completo *</h4>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>

                        <div className="campos">
                            <h4>E-mail *</h4>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Seu e-mail"
                                required
                            />
                        </div>

                        <div className="campos">
                            <h4>Telefone *</h4>
                            <input
                                type="tel"
                                name="tel"
                                value={formData.tel}
                                onChange={handleChange}
                                placeholder="(83) 99999-9999"
                                required
                            />
                        </div>

                        <div className="campos">
                            <h4>Tipo de Denúncia *</h4>
                            <input
                                type="text"
                                name="denuncia"
                                value={formData.denuncia}
                                onChange={handleChange}
                                placeholder="Tipo da denúncia"
                                required
                            />
                        </div>

                        <div className="campos">
                            <h4>Bairro *</h4>
                            <input
                                type="text"
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                                placeholder="Bairro da denúncia"
                                required
                            />
                        </div>

                        <div className="campos">
                            <h4>Endereço *</h4>
                            <input
                                type="text"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                placeholder="Rua, número, referência"
                                required
                            />
                        </div>

                        <div className="campos" id="descricao">
                            <h4>Descrição da Denúncia *</h4>
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                placeholder="Descreva detalhadamente a denúncia ambiental"
                                required
                            />
                        </div>

                        <button type="submit">Enviar Denúncia</button>
                    </form>

                    <section id="info">
                        <aside id="contato">
                            <h3>Informações de Contato</h3>

                            <h4>Endereço</h4>
                            <p>Av. João Machado, 789<br />Centro - João Pessoa/PB<br />CEP: 58013-000</p>

                            <h4>Telefones</h4>
                            <p>(83) 3218-9000 - Centro<br />(83) 3218-9001 - Emergências<br />0800-283-9000 - Denúncias</p>

                            <h4>E-mail</h4>
                            <p>contato@semam.joaopessoa.pb.gov.br<br />denuncias@semam.joaopessoa.pb.gov.br</p>

                            <h4>Horário de Funcionamento</h4>
                            <p>Segunda a Sexta: 7h às 17h<br />Sábado: 7h às 12h<br />Emergências: 24h</p>
                        </aside>

                        <aside id="local">
                            <h4>Localização</h4>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3958.6234622572265!2d-34.86604852628486!3d-7.169451792835301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1761245073913!5m2!1spt-BR!2sbr"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização SEMAM"
                            ></iframe>
                        </aside>
                    </section>
                </section>
            </article>
        </section>
    );
}