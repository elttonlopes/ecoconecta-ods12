import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

export default function App() {
  const [cep, setCep] = useState('');
  const [tipoResiduo, setTipoResiduo] = useState('0');
  const [endereco, setEndereco] = useState(null);
  const [ecopontos, setEcopontos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [formContato, setFormContato] = useState({ nome: '', email: '', interesse: 'Cadastrar Ponto de Coleta', mensagem: '' });
  const [feedbackForm, setFeedbackForm] = useState(null);

  const handleBuscarEcopontos = async (e) => {
    e.preventDefault();
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErro('Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    setCarregando(true);
    setErro(null);
    setEndereco(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!response.ok) throw new Error('Falha na conexão com a API de CEP.');
      
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado na base de dados.');

      setEndereco(data);

      const resultadosSimulados = [
        {
          id: 1,
          nome: `Cooperativa Recicla ${data.localidade}`,
          distancia: '1.2 km',
          endereco: `${data.logradouro || 'Rua Principal'}, ${data.bairro || 'Centro'} - ${data.localidade}/${data.uf}`,
          horario: 'Seg a Sex: 08h às 17h',
          materiais: ['Plástico e Metal', 'Orgânicos / Compostagem'],
          categoriaId: '1'
        },
        {
          id: 2,
          nome: `PEV E-Lixo & Baterias - ${data.bairro || 'Unidade Central'}`,
          distancia: '2.5 km',
          endereco: `Av. Universitária, Bairro ${data.bairro || 'Centro'} - ${data.localidade}/${data.uf}`,
          horario: 'Seg a Sáb: 09h às 19h',
          materiais: ['Eletrônicos (E-lixo)', 'Óleo de Cozinha'],
          categoriaId: '2'
        }
      ];

      if (tipoResiduo !== '0') {
        setEcopontos(resultadosSimulados.filter(item => item.categoriaId === tipoResiduo));
      } else {
        setEcopontos(resultadosSimulados);
      }

    } catch (err) {
      setErro(err.message);
      setEcopontos([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleEnviarCadastro = (e) => {
    e.preventDefault();
    if (!formContato.nome || !formContato.email) {
      setFeedbackForm({ tipo: 'danger', texto: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    setFeedbackForm({ tipo: 'success', texto: `Obrigado, ${formContato.nome}! Seu cadastro foi enviado com sucesso.` });
    setFormContato({ nome: '', email: '', interesse: 'Cadastrar Ponto de Coleta', mensagem: '' });
  };

  return (
    <div className="bg-light min-vh-100">
      <header className="sticky-top bg-white shadow-sm">
        <nav className="navbar navbar-expand-lg navbar-light container">
          <a className="navbar-brand d-flex align-items-center fw-bold text-success fs-4" href="#home">
            <i className="bi bi-recycle me-2 fs-3"></i> EcoConecta
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacao">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menuNavegacao">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fw-semibold">
              <li className="nav-item"><a className="nav-link active" href="#home">Início</a></li>
              <li className="nav-item"><a className="nav-link" href="#ods">ODS 12</a></li>
              <li className="nav-item"><a className="nav-link" href="#guia">Guia de Descarte</a></li>
              <li className="nav-item"><a className="nav-link" href="#pontos">Pontos de Coleta</a></li>
              <li className="nav-item"><a className="nav-link" href="#contato">Participar</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="bg-success text-white py-5">
          <div className="container py-4">
            <div className="row align-items-center gy-4">
              <div className="col-lg-7">
                <span className="badge bg-light text-success fw-bold px-3 py-2 mb-3">ODS 12 • Consumo Responsável</span>
                <h1 className="display-4 fw-bold mb-3">Transforme seu resíduo em impacto positivo</h1>
                <p className="lead mb-4">Aprenda a descartar corretamente materiais recicláveis, orgânicos e e-lixo. Encontre ecopontos na sua região e ajude a fortalecer a economia circular local.</p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="#pontos" className="btn btn-warning btn-lg fw-bold text-dark">Buscar Ponto de Coleta</a>
                  <a href="#guia" className="btn btn-outline-light btn-lg">Aprender a Separar</a>
                </div>
              </div>
              <div className="col-lg-5 text-center">
                <img src="/img/hero-banner.jpg" alt="Reciclagem e Sustentabilidade" className="img-fluid rounded-4 shadow-lg border border-3 border-white" />
              </div>
            </div>
          </div>
        </section>

        <section id="ods" className="py-5 bg-light">
          <div className="container">
            <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
              <h2 className="h1 fw-bold text-dark mb-3">O Compromisso com o ODS 12</h2>
              <p className="text-secondary fs-5">O Objetivo de Desenvolvimento Sustentável 12 busca assegurar padrões de produção e de consumo sustentáveis.</p>
            </div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card">
                  <div className="feature-icon bg-success-subtle text-success rounded-circle mx-auto mb-3">
                    <i className="bi bi-trash3-fill fs-2"></i>
                  </div>
                  <h3 className="h5 fw-bold mb-2">Redução de Resíduos</h3>
                  <p className="text-secondary small mb-0">Incentivo à diminuição da geração de lixo por meio da prevenção, reciclagem e reuso.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card">
                  <div className="feature-icon bg-success-subtle text-success rounded-circle mx-auto mb-3">
                    <i className="bi bi-house-heart-fill fs-2"></i>
                  </div>
                  <h3 className="h5 fw-bold mb-2">Educação e Consciência</h3>
                  <p className="text-secondary small mb-0">Capacitação da comunidade para escolhas de consumo mais sustentáveis no dia a dia.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-card">
                  <div className="feature-icon bg-success-subtle text-success rounded-circle mx-auto mb-3">
                    <i className="bi bi-diagram-3-fill fs-2"></i>
                  </div>
                  <h3 className="h5 fw-bold mb-2">Economia Circular</h3>
                  <p className="text-secondary small mb-0">Integração entre geradores de resíduos, cooperativas e indústrias de reciclagem.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="guia" className="py-5">
          <div className="container">
            <h2 className="h1 fw-bold text-center mb-5">Guia Rápido de Separação</h2>
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <img src="/img/coleta-seletiva.jpg" className="card-img-top" alt="Coleta Seletiva" />
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">Recicláveis</span>
                    <h3 className="h5 card-title fw-bold">Papel, Plástico e Metal</h3>
                    <p className="card-text text-secondary">Lave os recipientes para retirar resíduos orgânicos antes de encaminhar à coleta.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <img src="/img/compostagem.jpg" className="card-img-top" alt="Compostagem" />
                  <div className="card-body">
                    <span className="badge bg-success mb-2">Orgânicos</span>
                    <h3 className="h5 card-title fw-bold">Resíduos Orgânicos</h3>
                    <p className="card-text text-secondary">Restos de alimentos podem ser transformados em adubo natural por meio da compostagem.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <img src="/img/ponto-entrega.jpg" className="card-img-top" alt="Lixo Eletrônico" />
                  <div className="card-body">
                    <span className="badge bg-danger mb-2">Especiais</span>
                    <h3 className="h5 card-title fw-bold">Lixo Eletrônico e Óleo</h3>
                    <p className="card-text text-secondary">Pilhas, baterias e óleo de cozinha exigem pontos de entrega voluntária (PEV) específicos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pontos" className="py-5 bg-light">
          <div className="container">
            <div className="row align-items-start gy-4">
              <div className="col-lg-5">
                <h2 className="h1 fw-bold mb-3">Encontre o Ecoponto mais próximo</h2>
                <p className="text-secondary mb-4">Digite seu CEP para consultar dados reais via API RESTful e mapear ecopontos na sua cidade.</p>
                
                <form onSubmit={handleBuscarEcopontos}>
                  <div className="mb-3">
                    <label htmlFor="buscaCep" className="form-label fw-semibold">CEP da sua Região:</label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="buscaCep"
                        className="form-control form-control-lg"
                        placeholder="Ex: 65400000"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                      />
                      <button className="btn btn-success px-4" type="submit">
                        <i className="bi bi-search me-1"></i> Buscar
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="selectTipo" className="form-label fw-semibold">Filtrar por Material:</label>
                    <select
                      id="selectTipo"
                      className="form-select form-select-lg"
                      value={tipoResiduo}
                      onChange={(e) => setTipoResiduo(e.target.value)}
                    >
                      <option value="0">Todos os materiais</option>
                      <option value="1">Plástico e Metal</option>
                      <option value="2">Eletrônicos (E-lixo)</option>
                      <option value="3">Óleo de Cozinha</option>
                      <option value="4">Orgânicos / Compostagem</option>
                    </select>
                  </div>
                </form>

                {carregando && <div className="spinner-border text-success my-3" role="status"><span className="visually-hidden">Carregando...</span></div>}
                {erro && <div className="alert alert-danger my-3">{erro}</div>}
                
                {endereco && (
                  <div className="alert alert-success my-3">
                    <strong>Localização encontrada:</strong><br />
                    {endereco.logradouro ? `${endereco.logradouro}, ` : ''}{endereco.bairro} - {endereco.localidade}/{endereco.uf}
                  </div>
                )}
              </div>

              <div className="col-lg-7">
                <div className="bg-white p-4 rounded-4 shadow-sm">
                  <h3 className="h5 fw-bold mb-3 border-bottom pb-2">Ecopontos Mapeados Dinamicamente</h3>
                  <div className="list-group list-group-flush">
                    {ecopontos.length === 0 && !carregando && (
                      <p className="text-muted my-3">Nenhum ecoponto consultado. Digite um CEP no formulário ao lado para realizar a busca.</p>
                    )}
                    {ecopontos.map((ponto) => (
                      <div key={ponto.id} className="list-group-item py-3">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <h4 className="h6 mb-1 fw-bold text-success">{ponto.nome}</h4>
                          <span className="badge bg-success-subtle text-success">{ponto.distancia}</span>
                        </div>
                        <p className="mb-1 text-secondary small">{ponto.endereco}</p>
                        <small className="text-muted d-block mb-2"><i className="bi bi-clock me-1"></i> {ponto.horario}</small>
                        <div className="d-flex flex-wrap gap-1">
                          {ponto.materiais.map((mat, idx) => (
                            <span key={idx} className="badge bg-success">{mat}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="py-5">
          <div className="container" style={{ maxWidth: '700px' }}>
            <div className="card border-0 shadow-lg p-4 p-md-5 rounded-4">
              <h2 className="h2 fw-bold text-center mb-2">Cadastre seu Ponto ou Seja Voluntário</h2>
              <p className="text-center text-secondary mb-4">Mapeie novos pontos de coleta ou participe ativamente das ações ambientais.</p>
              
              {feedbackForm && (
                <div className={`alert alert-${feedbackForm.tipo} mb-4`}>{feedbackForm.texto}</div>
              )}

              <form onSubmit={handleEnviarCadastro}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nome" className="form-label fw-semibold">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nome"
                      value={formContato.nome}
                      onChange={(e) => setFormContato({ ...formContato, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formContato.email}
                      onChange={(e) => setFormContato({ ...formContato, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="interesse" className="form-label fw-semibold">Tipo de Interesse</label>
                    <select
                      className="form-select"
                      id="interesse"
                      value={formContato.interesse}
                      onChange={(e) => setFormContato({ ...formContato, interesse: e.target.value })}
                    >
                      <option>Cadastrar Ponto de Coleta</option>
                      <option>Ser Voluntário em Ações</option>
                      <option>Dúvidas e Sugestões</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="mensagem" className="form-label fw-semibold">Mensagem / Endereço do Ponto</label>
                    <textarea
                      className="form-control"
                      id="mensagem"
                      rows="3"
                      value={formContato.mensagem}
                      onChange={(e) => setFormContato({ ...formContato, mensagem: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-success btn-lg w-100 fw-bold">Enviar Cadastro</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dark text-white py-4 border-top border-success border-4">
        <div className="container">
          <div className="row gy-3 align-items-center">
            <div className="col-md-8 text-center text-md-start">
              <p className="mb-1 fw-semibold">&copy; 2026 EcoConecta — Projeto Acadêmico de Desenvolvimento Web</p>
              <p className="mb-1 small text-white-50">
                <strong>Desenvolvido por:</strong> Elton Antonio Lopes e Silva &bull; Lucas Costa Martins[cite: 1]
              </p>
              <small className="text-secondary">Alinhado aos Objetivos de Desenvolvimento Sustentável (ODS 12 - ONU)[cite: 1]</small>
            </div>
            <div className="col-md-4 text-center text-md-end">
              <a href="#home" className="text-white text-decoration-none fw-semibold">
                <i className="bi bi-arrow-up-circle fs-5 me-1"></i> Voltar ao topo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}