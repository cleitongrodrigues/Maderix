import React, { useState, useEffect } from 'react';
import './ReportsModal.css';
import VendedorDetailModal from '../VendedorDetailModal';

const ReportsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [periodo, setPeriodo] = useState('mes'); // mes, trimestre, ano
  const [loading, setLoading] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
  const [vendedorModalOpen, setVendedorModalOpen] = useState(false);

  // Mock data - em produção, viria da API
  const mockData = {
    vendasHoje: 12,
    vendasMes: 347,
    receitaMes: 145780.50,
    receitaAno: 1854320.00,
    metaMensal: 200000.00,
    produtosMaisFaturamento: [
      { nome: 'Móvel Planejado Premium', quantidade: 45, receita: 67500.00 },
      { nome: 'Armário Cozinha Completo', quantidade: 32, receita: 48000.00 },
      { nome: 'Mesa Jantar 8 lugares', quantidade: 28, receita: 33600.00 },
      { nome: 'Rack TV Suspenso', quantidade: 56, receita: 28000.00 },
      { nome: 'Guarda-roupa Casal', quantidade: 24, receita: 26400.00 }
    ],
    vendedoresMes: [
      { nome: 'João Silva', vendas: 89, receita: 45230.00 },
      { nome: 'Maria Santos', vendas: 76, receita: 38940.00 },
      { nome: 'Carlos Oliveira', vendas: 63, receita: 31500.00 },
      { nome: 'Ana Paula', vendas: 54, receita: 27800.00 }
    ],
    vendasPorMes: [
      { mes: 'Jun', vendas: 289, receita: 152340.00 },
      { mes: 'Jul', vendas: 312, receita: 168920.00 },
      { mes: 'Ago', vendas: 298, receita: 159440.00 },
      { mes: 'Set', vendas: 334, receita: 178650.00 },
      { mes: 'Out', vendas: 347, receita: 185780.00 }
    ],
    contasReceber: {
      emDia: 234,
      vencidas: 18,
      totalReceber: 89450.00,
      vencidasValor: 12340.00
    },
    estoque: {
      produtosCriticos: 8,
      produtosAlerta: 23,
      valorEstoque: 456780.00
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Simula carregamento de dados
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  }, [isOpen, periodo]);

  if (!isOpen) return null;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const calcularPercentualMeta = () => {
    return ((mockData.receitaMes / mockData.metaMensal) * 100).toFixed(1);
  };

  const renderOverview = () => (
    <div className="reports-overview">
      {/* Cards de Resumo */}
      <div className="reports-cards-grid">
        <div className="report-card card-vendas">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <span className="card-label">Vendas Hoje</span>
            <span 
              className="card-value"
              title={`Vendas Hoje: ${mockData.vendasHoje} vendas realizadas`}
            >
              {mockData.vendasHoje}
            </span>
            <span className="card-trend positive">+18% vs ontem</span>
          </div>
        </div>

        <div className="report-card card-receita">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <span className="card-label">Receita do Mês</span>
            <span 
              className="card-value" 
              title={`Receita do Mês: ${formatarMoeda(mockData.receitaMes)}`}
            >
              {formatarMoeda(mockData.receitaMes)}
            </span>
            <span className="card-trend positive">+12% vs mês anterior</span>
          </div>
        </div>

        <div className="report-card card-meta">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <span className="card-label">Meta Mensal</span>
            <span 
              className="card-value"
              title={`Meta Mensal: ${calcularPercentualMeta()}% (${formatarMoeda(mockData.receitaMes)} de ${formatarMoeda(mockData.metaMensal)})`}
            >
              {calcularPercentualMeta()}%
            </span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${calcularPercentualMeta()}%` }}></div>
            </div>
          </div>
        </div>

        <div className="report-card card-ano">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <span className="card-label">Receita Anual</span>
            <span 
              className="card-value" 
              title={`Receita Anual: ${formatarMoeda(mockData.receitaAno)}`}
            >
              {formatarMoeda(mockData.receitaAno)}
            </span>
            <span className="card-trend positive">+24% vs ano anterior</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Vendas por Mês */}
      <div className="report-section">
        <h3>📊 Vendas dos Últimos 5 Meses</h3>
        <div className="chart-container">
          <div className="bar-chart">
            {mockData.vendasPorMes.map((item, index) => {
              const maxReceita = Math.max(...mockData.vendasPorMes.map(v => v.receita));
              const altura = (item.receita / maxReceita) * 100;
              return (
                <div key={index} className="bar-wrapper">
                  <div className="bar-info">{formatarMoeda(item.receita)}</div>
                  <div className="bar" style={{ height: `${altura}%` }}>
                    <div className="bar-label">{item.vendas}</div>
                  </div>
                  <div className="bar-month">{item.mes}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Rápido */}
      <div className="reports-status-grid">
        <div className="status-card">
          <div className="status-header">
            <span className="status-icon">💳</span>
            <span className="status-title">Contas a Receber</span>
          </div>
          <div className="status-body">
            <div className="status-item">
              <span className="status-label">Em Dia</span>
              <span className="status-value good">{mockData.contasReceber.emDia} contas</span>
            </div>
            <div className="status-item">
              <span className="status-label">Vencidas</span>
              <span className="status-value warning">{mockData.contasReceber.vencidas} contas</span>
            </div>
            <div className="status-item">
              <span className="status-label">Total a Receber</span>
              <span className="status-value">{formatarMoeda(mockData.contasReceber.totalReceber)}</span>
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-header">
            <span className="status-icon">📦</span>
            <span className="status-title">Situação do Estoque</span>
          </div>
          <div className="status-body">
            <div className="status-item">
              <span className="status-label">Produtos Críticos</span>
              <span className="status-value critical">{mockData.estoque.produtosCriticos} itens</span>
            </div>
            <div className="status-item">
              <span className="status-label">Alertas</span>
              <span className="status-value warning">{mockData.estoque.produtosAlerta} itens</span>
            </div>
            <div className="status-item">
              <span className="status-label">Valor Total</span>
              <span className="status-value">{formatarMoeda(mockData.estoque.valorEstoque)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTopProdutos = () => (
    <div className="reports-top-produtos">
      <div className="section-header">
        <h3>🏆 Produtos com Maior Faturamento - {periodo === 'mes' ? 'Este Mês' : periodo === 'trimestre' ? 'Este Trimestre' : 'Este Ano'}</h3>
        <div className="periodo-selector">
          <button 
            className={periodo === 'mes' ? 'active' : ''} 
            onClick={() => setPeriodo('mes')}
          >
            Mês
          </button>
          <button 
            className={periodo === 'trimestre' ? 'active' : ''} 
            onClick={() => setPeriodo('trimestre')}
          >
            Trimestre
          </button>
          <button 
            className={periodo === 'ano' ? 'active' : ''} 
            onClick={() => setPeriodo('ano')}
          >
            Ano
          </button>
        </div>
      </div>

      <div className="top-produtos-list">
        {mockData.produtosMaisFaturamento.map((produto, index) => {
          const maxReceita = mockData.produtosMaisFaturamento[0].receita;
          const percentual = (produto.receita / maxReceita) * 100;
          return (
            <div key={index} className="produto-item">
              <div className="produto-rank">{index + 1}º</div>
              <div className="produto-info">
                <div className="produto-nome">{produto.nome}</div>
                <div className="produto-stats">
                  <span className="produto-qtd">{produto.quantidade} vendas</span>
                  <span className="produto-receita">{formatarMoeda(produto.receita)}</span>
                </div>
                <div className="produto-bar">
                  <div className="produto-bar-fill" style={{ width: `${percentual}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderVendedores = () => (
    <div className="reports-vendedores">
      <h3>👥 Performance dos Vendedores - Este Mês</h3>
      
      <div className="vendedores-list">
        {mockData.vendedoresMes.map((vendedor, index) => {
          const maxVendas = mockData.vendedoresMes[0].vendas;
          const percentualVendas = (vendedor.vendas / maxVendas) * 100;
          const maxReceita = mockData.vendedoresMes[0].receita;
          const percentualReceita = (vendedor.receita / maxReceita) * 100;

          return (
            <div key={index} className="vendedor-card">
              <div className="vendedor-header">
                <div className="vendedor-avatar">
                  {vendedor.nome.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="vendedor-info">
                  <div 
                    className="vendedor-nome clickable" 
                    onClick={() => {
                      setVendedorSelecionado(vendedor);
                      setVendedorModalOpen(true);
                    }}
                    title="Clique para ver detalhes"
                  >
                    {vendedor.nome}
                  </div>
                  <div className="vendedor-posicao">#{index + 1} em vendas</div>
                </div>
                {index === 0 && <div className="vendedor-badge">🏆 Top 1</div>}
              </div>
              
              <div className="vendedor-metrics">
                <div className="metric">
                  <span className="metric-label">Vendas</span>
                  <span className="metric-value">{vendedor.vendas}</span>
                  <div className="metric-bar">
                    <div className="metric-bar-fill vendas" style={{ width: `${percentualVendas}%` }}></div>
                  </div>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Receita</span>
                  <span className="metric-value">{formatarMoeda(vendedor.receita)}</span>
                  <div className="metric-bar">
                    <div className="metric-bar-fill receita" style={{ width: `${percentualReceita}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="reports-modal-overlay" onClick={onClose}>
      <div className="reports-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="reports-modal-header">
          <div className="header-title">
            <span className="title-icon">📊</span>
            <h2>Relatórios e Estatísticas</h2>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="reports-modal-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📈 Visão Geral
          </button>
          <button
            className={`tab-button ${activeTab === 'produtos' ? 'active' : ''}`}
            onClick={() => setActiveTab('produtos')}
          >
            🏆 Top Produtos
          </button>
          <button
            className={`tab-button ${activeTab === 'vendedores' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendedores')}
          >
            👥 Vendedores
          </button>
        </div>

        <div className="reports-modal-body">
          {loading ? (
            <div className="reports-loading">
              <div className="spinner"></div>
              <p>Carregando dados...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'produtos' && renderTopProdutos()}
              {activeTab === 'vendedores' && renderVendedores()}
            </>
          )}
        </div>

        <div className="reports-modal-footer">
          <span className="footer-info">📅 Atualizado em {new Date().toLocaleString('pt-BR')}</span>
          <div className="footer-actions">
            <button className="btn-export">📥 Exportar PDF</button>
            <button className="btn-print">🖨️ Imprimir</button>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Vendedor */}
      <VendedorDetailModal 
        isOpen={vendedorModalOpen}
        onClose={() => setVendedorModalOpen(false)}
        vendedor={vendedorSelecionado}
      />
    </div>
  );
};

export default ReportsModal;
