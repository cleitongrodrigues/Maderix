import React from 'react';
import './VendedorDetailModal.css';

const VendedorDetailModal = ({ isOpen, onClose, vendedor }) => {
  if (!isOpen || !vendedor) return null;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Dados mockados expandidos do vendedor
  const detalhesVendedor = {
    ...vendedor,
    email: `${vendedor.nome.toLowerCase().replace(/\s+/g, '.')}@maderix.com`,
    telefone: '(11) 9 8765-4321',
    dataAdmissao: '15/03/2023',
    perfil: 'Vendedor Senior',
    status: 'Ativo',
    comissao: vendedor.receita * 0.05, // 5% de comissão
    metaMensal: 50000.00,
    ticketMedio: vendedor.receita / vendedor.vendas,
    clientesAtendidos: vendedor.vendas * 0.8, // aproximadamente
    produtosMaisVendidos: [
      { nome: 'Móvel Planejado Premium', quantidade: 12 },
      { nome: 'Armário Cozinha Completo', quantidade: 8 },
      { nome: 'Mesa Jantar 8 lugares', quantidade: 7 }
    ],
    vendasPorSemana: [
      { semana: 'Semana 1', vendas: 18, receita: 9200.00 },
      { semana: 'Semana 2', vendas: 22, receita: 11500.00 },
      { semana: 'Semana 3', vendas: 25, receita: 13100.00 },
      { semana: 'Semana 4', vendas: 24, receita: 11430.00 }
    ]
  };

  const calcularPercentualMeta = () => {
    return ((detalhesVendedor.receita / detalhesVendedor.metaMensal) * 100).toFixed(1);
  };

  return (
    <div className="vendedor-detail-overlay" onClick={onClose}>
      <div className="vendedor-detail-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vendedor-detail-header">
          <div className="header-content">
            <div className="vendedor-avatar-large">
              {detalhesVendedor.nome.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="vendedor-title-group">
              <h2>{detalhesVendedor.nome}</h2>
              <div className="vendedor-subtitle">
                <span className="perfil-badge">{detalhesVendedor.perfil}</span>
                <span className="status-badge status-ativo">{detalhesVendedor.status}</span>
              </div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="vendedor-detail-body">
          {/* Informações de Contato */}
          <div className="info-section">
            <h3>📋 Informações Básicas</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">📧 Email</span>
                <span className="info-value">{detalhesVendedor.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📱 Telefone</span>
                <span className="info-value">{detalhesVendedor.telefone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📅 Data de Admissão</span>
                <span className="info-value">{detalhesVendedor.dataAdmissao}</span>
              </div>
              <div className="info-item">
                <span className="info-label">👤 Perfil</span>
                <span className="info-value">{detalhesVendedor.perfil}</span>
              </div>
            </div>
          </div>

          {/* Métricas de Performance */}
          <div className="info-section">
            <h3>📊 Performance do Mês</h3>
            <div className="performance-cards">
              <div className="perf-card">
                <div className="perf-icon">🎯</div>
                <div className="perf-content">
                  <span className="perf-label">Total de Vendas</span>
                  <span className="perf-value">{detalhesVendedor.vendas}</span>
                  <span className="perf-trend positive">+15% vs mês anterior</span>
                </div>
              </div>

              <div className="perf-card">
                <div className="perf-icon">💰</div>
                <div className="perf-content">
                  <span className="perf-label">Receita Gerada</span>
                  <span className="perf-value">{formatarMoeda(detalhesVendedor.receita)}</span>
                  <span className="perf-trend positive">+12% vs mês anterior</span>
                </div>
              </div>

              <div className="perf-card">
                <div className="perf-icon">💵</div>
                <div className="perf-content">
                  <span className="perf-label">Comissão Estimada</span>
                  <span className="perf-value">{formatarMoeda(detalhesVendedor.comissao)}</span>
                  <span className="perf-trend neutral">5% sobre vendas</span>
                </div>
              </div>

              <div className="perf-card">
                <div className="perf-icon">🎫</div>
                <div className="perf-content">
                  <span className="perf-label">Ticket Médio</span>
                  <span className="perf-value">{formatarMoeda(detalhesVendedor.ticketMedio)}</span>
                  <span className="perf-trend positive">+8% vs média</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Mensal */}
          <div className="info-section">
            <h3>🏆 Meta Mensal</h3>
            <div className="meta-progress">
              <div className="meta-header">
                <span className="meta-label">Meta: {formatarMoeda(detalhesVendedor.metaMensal)}</span>
                <span className="meta-percentage">{calcularPercentualMeta()}%</span>
              </div>
              <div className="meta-bar">
                <div 
                  className="meta-bar-fill" 
                  style={{ width: `${Math.min(calcularPercentualMeta(), 100)}%` }}
                ></div>
              </div>
              <div className="meta-info">
                <span>Realizado: {formatarMoeda(detalhesVendedor.receita)}</span>
                <span>Faltam: {formatarMoeda(Math.max(0, detalhesVendedor.metaMensal - detalhesVendedor.receita))}</span>
              </div>
            </div>
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="info-section">
            <h3>🏅 Produtos Mais Vendidos</h3>
            <div className="produtos-list">
              {detalhesVendedor.produtosMaisVendidos.map((produto, index) => (
                <div key={index} className="produto-item">
                  <div className="produto-rank">#{index + 1}</div>
                  <div className="produto-info">
                    <span className="produto-nome">{produto.nome}</span>
                    <span className="produto-quantidade">{produto.quantidade} vendas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendas por Semana */}
          <div className="info-section">
            <h3>📈 Evolução Semanal</h3>
            <div className="semanas-chart">
              {detalhesVendedor.vendasPorSemana.map((semana, index) => {
                const maxVendas = Math.max(...detalhesVendedor.vendasPorSemana.map(s => s.vendas));
                const altura = (semana.vendas / maxVendas) * 100;
                
                return (
                  <div key={index} className="semana-item">
                    <div className="semana-bar-container">
                      <div 
                        className="semana-bar" 
                        style={{ height: `${altura}%` }}
                        title={`${semana.vendas} vendas`}
                      >
                        <span className="semana-value">{semana.vendas}</span>
                      </div>
                    </div>
                    <span className="semana-label">{semana.semana}</span>
                    <span className="semana-receita">{formatarMoeda(semana.receita)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="vendedor-detail-footer">
          <div className="footer-note">
            💡 <strong>Dica:</strong> Os dados apresentados são do período atual e podem ser atualizados em tempo real.
          </div>
          <button className="btn-fechar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default VendedorDetailModal;
