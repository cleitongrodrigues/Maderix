import React from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../contexts/MenuContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { openEstoqueSubmenu, openFinanceiroSubmenu, openConfigSubmenu } = useMenu();

  // Função helper para abrir o submenu apropriado baseado na rota
  const handleNavigateWithSubmenu = (rota) => {
    if (rota.startsWith('/estoque')) {
      openEstoqueSubmenu();
    } else if (rota === '/vendas' || rota === '/contas') {
      openFinanceiroSubmenu();
    } else if (rota === '/usuarios' || rota === '/unidades' || rota === '/perfis') {
      openConfigSubmenu();
    }
    navigate(rota);
  };

  // Dados estáticos para demonstração (prontos para integração futura com backend)
  const estatisticas = {
    vendasHoje: 2850.50,
    produtosEstoque: 150,
    produtosCriticos: 8,
    contasReceber: 4320.00
  };

  const atividadesRecentes = [
    { tipo: "venda", descricao: "Venda #1245 concluída", valor: "R$ 450,00", tempo: "há 15 minutos", icone: "💰" },
    { tipo: "estoque", descricao: "Produto 'Caneta Azul' reabastecido", valor: "+50 unidades", tempo: "há 32 minutos", icone: "📦" },
    { tipo: "alerta", descricao: "Produto 'Caderno A4' abaixo do mínimo", valor: "Apenas 3 unidades", tempo: "há 1 hora", icone: "⚠️" },
    { tipo: "pagamento", descricao: "Pagamento recebido de João Silva", valor: "R$ 850,00", tempo: "há 2 horas", icone: "💵" },
    { tipo: "estoque", descricao: "Nova movimentação de estoque registrada", valor: "Produto: Régua 30cm", tempo: "há 3 horas", icone: "📋" }
  ];

  const produtosCriticos = [
    { nome: "Caderno A4", estoque: 3, minimo: 10, percentual: 30 },
    { nome: "Caneta Preta", estoque: 5, minimo: 15, percentual: 33 },
    { nome: "Papel A4", estoque: 8, minimo: 20, percentual: 40 },
    { nome: "Lápis HB", estoque: 4, minimo: 12, percentual: 33 }
  ];

  const acoesRapidas = [
    { titulo: "Vendas", icone: "💰", rota: "/vendas", cor: "green" },
    { titulo: "Estoque", icone: "📦", rota: "/estoque", cor: "blue" },
    { titulo: "Movimentações", icone: "📊", rota: "/estoque/movimentacoes", cor: "orange" },
    { titulo: "Clientes", icone: "👨‍💼", rota: "/clientes", cor: "purple" },
    { titulo: "Contas a Receber", icone: "💵", rota: "/contas", cor: "teal" },
    { titulo: "Empresas", icone: "🏢", rota: "/empresas", cor: "pink" },
    { titulo: "Usuários", icone: "👨", rota: "/usuarios", cor: "indigo" },
    { titulo: "Unidades", icone: "📏", rota: "/unidades", cor: "cyan" }
  ];

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="page home-page">
      <div className="home-container">
        <div className="home-cabecalho-fixo">
          <div className="page-header">
            <h1>🏠 Dashboard</h1>
            <p className="home-subtitle">Bem-vindo ao Sistema de Gestão Maderix</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="home-stats-grid">
        <div className="stat-card stat-card-green">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Vendas Hoje</div>
            <div className="stat-value">{formatarMoeda(estatisticas.vendasHoje)}</div>
            <div className="stat-change positive">+12.5% vs ontem</div>
          </div>
        </div>

        <div className="stat-card stat-card-blue">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Produtos em Estoque</div>
            <div className="stat-value">{estatisticas.produtosEstoque}</div>
            <div className="stat-change neutral">Total de produtos</div>
          </div>
        </div>

        <div className="stat-card stat-card-red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-label">Produtos Críticos</div>
            <div className="stat-value">{estatisticas.produtosCriticos}</div>
            <div className="stat-change negative">Abaixo do estoque mínimo</div>
          </div>
        </div>

        <div className="stat-card stat-card-teal">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <div className="stat-label">Contas a Receber</div>
            <div className="stat-value">{formatarMoeda(estatisticas.contasReceber)}</div>
            <div className="stat-change neutral">Vencimento hoje</div>
          </div>
        </div>
      </div>

      {/* Grid Principal com 2 Colunas */}
      <div className="home-content-grid">
        {/* Coluna Esquerda */}
        <div className="home-column">
          {/* Atividades Recentes */}
          <div className="home-section">
            <div className="section-header">
              <h2>📋 Atividades Recentes</h2>
            </div>
            <div className="atividades-lista">
              {atividadesRecentes.map((atividade, index) => (
                <div key={index} className={`atividade-item atividade-${atividade.tipo}`}>
                  <div className="atividade-icone">{atividade.icone}</div>
                  <div className="atividade-conteudo">
                    <div className="atividade-descricao">{atividade.descricao}</div>
                    <div className="atividade-detalhes">
                      <span className="atividade-valor">{atividade.valor}</span>
                      <span className="atividade-tempo">{atividade.tempo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Produtos Críticos */}
          <div className="home-section">
            <div className="section-header">
              <h2>⚠️ Produtos Críticos</h2>
              <button className="btn-ver-todos" onClick={() => handleNavigateWithSubmenu('/estoque')}>
                Ver Todos
              </button>
            </div>
            <div className="produtos-criticos-lista">
              {produtosCriticos.map((produto, index) => (
                <div key={index} className="produto-critico-item">
                  <div className="produto-info">
                    <div className="produto-nome">{produto.nome}</div>
                    <div className="produto-qtd">
                      {produto.estoque} de {produto.minimo} unidades
                    </div>
                  </div>
                  <div className="produto-barra-container">
                    <div 
                      className="produto-barra-progresso" 
                      style={{ width: `${produto.percentual}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="home-column">
          {/* Ações Rápidas */}
          <div className="home-section">
            <div className="section-header">
              <h2>⚡ Ações Rápidas</h2>
            </div>
            <div className="acoes-rapidas-grid">
              {acoesRapidas.map((acao, index) => (
                <button
                  key={index}
                  className={`acao-rapida-btn acao-${acao.cor}`}
                  onClick={() => handleNavigateWithSubmenu(acao.rota)}
                >
                  <span className="acao-icone">{acao.icone}</span>
                  <span className="acao-titulo">{acao.titulo}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resumo do Dia */}
          <div className="home-section">
            <div className="section-header">
              <h2>📊 Resumo do Dia</h2>
            </div>
            <div className="resumo-dia">
              <div className="resumo-item">
                <div className="resumo-icone">🛒</div>
                <div className="resumo-info">
                  <div className="resumo-label">Vendas Realizadas</div>
                  <div className="resumo-valor">15 vendas</div>
                </div>
              </div>
              <div className="resumo-item">
                <div className="resumo-icone">👥</div>
                <div className="resumo-info">
                  <div className="resumo-label">Novos Clientes</div>
                  <div className="resumo-valor">3 cadastros</div>
                </div>
              </div>
              <div className="resumo-item">
                <div className="resumo-icone">📦</div>
                <div className="resumo-info">
                  <div className="resumo-label">Produtos Movimentados</div>
                  <div className="resumo-valor">28 itens</div>
                </div>
              </div>
              <div className="resumo-item">
                <div className="resumo-icone">💵</div>
                <div className="resumo-info">
                  <div className="resumo-label">Pagamentos Recebidos</div>
                  <div className="resumo-valor">R$ 1.850,00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div> {/* Fecha home-container */}
    </div>
  );
}

export default Home;