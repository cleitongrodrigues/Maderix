import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import SearchModal from '../SearchModal';
import HelpModal from '../HelpModal';
import ReportsModal from '../ReportsModal';
import CompanySelector from '../CompanySelector';

function TopBar({ menuCollapsed, onToggleMenu, empresaAtual, onOpenCompanySelector }) {
  const navigate = useNavigate();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  // Keyboard shortcut para abrir busca global (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dados de notificações (mock - pode vir de API)
  const notificacoes = {
    produtosCriticos: [
      { id: 1, produto: 'Caderno A4', estoque: 3, minimo: 10, tempo: 'há 2 horas', lida: false },
      { id: 2, produto: 'Caneta Preta', estoque: 5, minimo: 15, tempo: 'há 5 horas', lida: false },
      { id: 3, produto: 'Papel A4', estoque: 8, minimo: 20, tempo: 'há 1 dia', lida: true },
    ],
    contasVencer: [
      { id: 1, cliente: 'João Silva', valor: 850.00, vencimento: 'Hoje', status: 'vencendo', lida: false },
      { id: 2, cliente: 'Maria Santos', valor: 1200.00, vencimento: 'Amanhã', status: 'vencendo', lida: false },
      { id: 3, cliente: 'Pedro Costa', valor: 450.00, vencimento: 'Ontem', status: 'vencida', lida: true },
    ],
    atividades: [
      { id: 1, tipo: 'venda', mensagem: 'Nova venda realizada #1245', valor: 'R$ 450,00', tempo: 'há 15 min', lida: false },
      { id: 2, tipo: 'estoque', mensagem: 'Produto reabastecido: Caneta Azul', valor: '+50 unidades', tempo: 'há 32 min', lida: false },
    ]
  };

  const totalNotificacoesNaoLidas = 
    notificacoes.produtosCriticos.filter(n => !n.lida).length +
    notificacoes.contasVencer.filter(n => !n.lida).length +
    notificacoes.atividades.filter(n => !n.lida).length;

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          {/* Logo e Toggle à esquerda */}
          <div className="top-bar-left">
            <button 
              className="menu-toggle-btn-top"
              onClick={onToggleMenu}
              title={menuCollapsed ? "Expandir Menu" : "Recolher Menu"}
            >
              {menuCollapsed ? "▶" : "◀"}
            </button>
            <div className="brand-area">
              <div className="brand-icon-top">📦</div>
              {!menuCollapsed && (
                <div className="brand-text-top">
                  <h1>Maderix</h1>
                  <span>Sistema de Gestão</span>
                </div>
              )}
            </div>
          </div>

          {/* Centro - Barra de Busca */}
          <div className="top-bar-center">
            <div className="search-bar-top">
              <span className="search-icon-top">🔍</span>
              <input
                type="text"
                className="search-input-top"
                placeholder="Buscar produtos, clientes, vendas... (Ctrl+K)"
                onFocus={() => setSearchModalOpen(true)}
                readOnly
              />
              <kbd className="search-kbd">Ctrl+K</kbd>
            </div>
          </div>

          {/* Ações à direita */}
          <div className="top-bar-actions">
            {/* Empresa */}
            <button
              className="top-bar-btn company-btn"
              onClick={onOpenCompanySelector}
              title={`Empresa Atual: ${empresaAtual?.nome || 'Selecionar Empresa'}`}
            >
              <span className="top-bar-icon">🏢</span>
            </button>

            {/* Relatórios */}
            <button
              className="top-bar-btn"
              onClick={() => setReportsModalOpen(true)}
              title="Relatórios"
            >
              <span className="top-bar-icon">📊</span>
            </button>

            {/* Ajuda */}
            <button
              className="top-bar-btn"
              onClick={() => setHelpModalOpen(true)}
              title="Ajuda"
            >
              <span className="top-bar-icon">❓</span>
            </button>

            {/* Notificações */}
            <button
              className="top-bar-btn notification-btn"
              onClick={() => setNotificationsModalOpen(true)}
              title="Notificações"
            >
              <span className="top-bar-icon">🔔</span>
              {totalNotificacoesNaoLidas > 0 && (
                <span className="top-bar-badge">{totalNotificacoesNaoLidas}</span>
              )}
            </button>

            {/* Logout */}
            <button
              className="top-bar-btn logout-btn"
              onClick={() => {
                if (window.confirm('Deseja realmente sair do sistema?')) {
                  localStorage.removeItem('token');
                  navigate('/');
                }
              }}
              title="Sair do Sistema"
            >
              <span className="top-bar-icon">🚪</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      <SearchModal 
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <HelpModal 
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      <ReportsModal 
        isOpen={reportsModalOpen}
        onClose={() => setReportsModalOpen(false)}
      />

      {/* Modal de Notificações */}
      {notificationsModalOpen && (
        <div className="modal-overlay" onClick={() => setNotificationsModalOpen(false)}>
          <div className="notifications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
              <h2>🔔 Notificações</h2>
              <button 
                className="modal-close"
                onClick={() => setNotificationsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="notifications-body">
              {/* Produtos Críticos */}
              {notificacoes.produtosCriticos.length > 0 && (
                <div className="notification-section">
                  <h3 className="notification-section-title">⚠️ Produtos Críticos</h3>
                  {notificacoes.produtosCriticos.map(n => (
                    <div key={n.id} className={`notification-item ${n.lida ? 'lida' : 'nao-lida'}`}>
                      <div className="notification-content">
                        <strong>{n.produto}</strong>
                        <p>Estoque: {n.estoque} un (mínimo: {n.minimo})</p>
                        <span className="notification-time">{n.tempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contas a Vencer */}
              {notificacoes.contasVencer.length > 0 && (
                <div className="notification-section">
                  <h3 className="notification-section-title">💰 Contas a Vencer</h3>
                  {notificacoes.contasVencer.map(n => (
                    <div key={n.id} className={`notification-item ${n.lida ? 'lida' : 'nao-lida'}`}>
                      <div className="notification-content">
                        <strong>{n.cliente}</strong>
                        <p>R$ {n.valor.toFixed(2)} - Vence {n.vencimento}</p>
                        <span className="notification-time">{n.tempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Atividades Recentes */}
              {notificacoes.atividades.length > 0 && (
                <div className="notification-section">
                  <h3 className="notification-section-title">📋 Atividades Recentes</h3>
                  {notificacoes.atividades.map(n => (
                    <div key={n.id} className={`notification-item ${n.lida ? 'lida' : 'nao-lida'}`}>
                      <div className="notification-content">
                        <strong>{n.mensagem}</strong>
                        <p>{n.valor}</p>
                        <span className="notification-time">{n.tempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="notifications-footer">
              <button 
                className="btn-mark-all-read"
                onClick={() => console.log('Marcar todas como lidas')}
              >
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopBar;
