import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu({ onToggleCollapse }) {
  const [estoqueOpen, setEstoqueOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0 });

  // Notifica o componente pai quando o menu é recolhido/expandido
  useEffect(() => {
    if (onToggleCollapse) {
      onToggleCollapse(menuCollapsed);
    }
  }, [menuCollapsed, onToggleCollapse]);

  // Refs para os itens do menu
  const estoqueRef = useRef(null);
  const financeiroRef = useRef(null);
  const configRef = useRef(null);

  // Dados estáticos para badges (prontos para integração futura)
  const badges = {
    produtosCriticos: 8,
    contasHoje: 3
  };

  const toggleSubmenu = (setter) => {
    setter((prev) => !prev);
  };

  const handleMouseEnter = (ref, setter) => {
    if (menuCollapsed && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setFlyoutPosition({ top: rect.top });
      setter(true);
    }
  };

  return (
    <div className={`menu ${menuCollapsed ? 'menu-collapsed' : ''}`}>
      {/* Header do Menu */}
      <div className="menu-header">
        <div className="menu-brand">
          <div className="brand-icon">📦</div>
          {!menuCollapsed && (
            <div className="brand-text">
              <h1>Maderix</h1>
              <span>Sistema de Gestão</span>
            </div>
          )}
        </div>
        <button 
          className="menu-toggle-btn"
          onClick={() => setMenuCollapsed(!menuCollapsed)}
          title={menuCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {menuCollapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Perfil do Usuário */}
      <div className="menu-user">
        <div className="user-avatar">
          <span>👨‍💼</span>
        </div>
        {!menuCollapsed && (
          <div className="user-info">
            <div className="user-name">Administrador</div>
            <div className="user-role">Admin</div>
          </div>
        )}
      </div>

      {/* Navegação Principal */}
      <nav className="menu-nav">
        {/* Dashboard */}
        <div className="menu-section">
          {!menuCollapsed && <div className="section-label">Dashboard</div>}
          <NavLink 
            to="/home" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            title="Home"
          >
            <span className="menu-icon">🏠</span>
            {!menuCollapsed && <span className="menu-text">Home</span>}
          </NavLink>
        </div>

        {/* Gestão */}
        <div className="menu-section">
          {!menuCollapsed && <div className="section-label">Gestão</div>}
          <NavLink 
            to="/clientes" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            title="Clientes"
          >
            <span className="menu-icon">👨‍💼</span>
            {!menuCollapsed && <span className="menu-text">Clientes</span>}
          </NavLink>
          <NavLink 
            to="/empresas" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            title="Empresas"
          >
            <span className="menu-icon">🏢</span>
            {!menuCollapsed && <span className="menu-text">Empresas</span>}
          </NavLink>
        </div>

        {/* Estoque */}
        <div className="menu-section">
          {!menuCollapsed && <div className="section-label">Estoque</div>}
          <div className="menu-item-wrapper">
            <div
              ref={estoqueRef}
              className={`menu-item menu-item-toggle ${estoqueOpen ? 'open' : ''}`}
              onClick={() => toggleSubmenu(setEstoqueOpen)}
              onMouseEnter={() => handleMouseEnter(estoqueRef, setEstoqueOpen)}
              onMouseLeave={() => menuCollapsed && setEstoqueOpen(false)}
            >
              <span className="menu-icon">📦</span>
              {!menuCollapsed && (
                <>
                  <span className="menu-text">Estoque</span>
                  {badges.produtosCriticos > 0 && (
                    <span className="menu-badge badge-warning">{badges.produtosCriticos}</span>
                  )}
                  <span className="menu-arrow">{estoqueOpen ? '▼' : '▶'}</span>
                </>
              )}
            </div>
            {/* Submenu normal quando expandido */}
            {estoqueOpen && !menuCollapsed && (
              <div className="submenu">
                <NavLink 
                  to="/estoque" 
                  end
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">📊</span>
                  <span className="submenu-text">Lista de Estoque</span>
                </NavLink>
                <NavLink 
                  to="/estoque/movimentacoes"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">🔄</span>
                  <span className="submenu-text">Movimentações</span>
                </NavLink>
              </div>
            )}
            {/* Flyout menu quando recolhido */}
            {estoqueOpen && menuCollapsed && (
              <div 
                className="submenu-flyout"
                style={{ top: `${flyoutPosition.top}px` }}
                onMouseEnter={() => setEstoqueOpen(true)}
                onMouseLeave={() => setEstoqueOpen(false)}
              >
                <div className="flyout-header">📦 Estoque</div>
                <NavLink 
                  to="/estoque" 
                  end
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setEstoqueOpen(false)}
                >
                  <span className="submenu-icon">📊</span>
                  <span className="submenu-text">Lista de Estoque</span>
                </NavLink>
                <NavLink 
                  to="/estoque/movimentacoes"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setEstoqueOpen(false)}
                >
                  <span className="submenu-icon">🔄</span>
                  <span className="submenu-text">Movimentações</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Financeiro */}
        <div className="menu-section">
          {!menuCollapsed && <div className="section-label">Financeiro</div>}
          <div className="menu-item-wrapper">
            <div
              ref={financeiroRef}
              className={`menu-item menu-item-toggle ${financeiroOpen ? 'open' : ''}`}
              onClick={() => toggleSubmenu(setFinanceiroOpen)}
              onMouseEnter={() => handleMouseEnter(financeiroRef, setFinanceiroOpen)}
              onMouseLeave={() => menuCollapsed && setFinanceiroOpen(false)}
            >
              <span className="menu-icon">💰</span>
              {!menuCollapsed && (
                <>
                  <span className="menu-text">Financeiro</span>
                  <span className="menu-arrow">{financeiroOpen ? '▼' : '▶'}</span>
                </>
              )}
            </div>
            {/* Submenu normal quando expandido */}
            {financeiroOpen && !menuCollapsed && (
              <div className="submenu">
                <NavLink 
                  to="/vendas"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">🛒</span>
                  <span className="submenu-text">Vendas</span>
                </NavLink>
                <NavLink 
                  to="/contas"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">💵</span>
                  <span className="submenu-text">Contas a Receber</span>
                  {badges.contasHoje > 0 && (
                    <span className="menu-badge badge-info">{badges.contasHoje}</span>
                  )}
                </NavLink>
              </div>
            )}
            {/* Flyout menu quando recolhido */}
            {financeiroOpen && menuCollapsed && (
              <div 
                className="submenu-flyout"
                style={{ top: `${flyoutPosition.top}px` }}
                onMouseEnter={() => setFinanceiroOpen(true)}
                onMouseLeave={() => setFinanceiroOpen(false)}
              >
                <div className="flyout-header">💰 Financeiro</div>
                <NavLink 
                  to="/vendas"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setFinanceiroOpen(false)}
                >
                  <span className="submenu-icon">🛒</span>
                  <span className="submenu-text">Vendas</span>
                </NavLink>
                <NavLink 
                  to="/contas"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setFinanceiroOpen(false)}
                >
                  <span className="submenu-icon">💵</span>
                  <span className="submenu-text">Contas a Receber</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="menu-section">
          {!menuCollapsed && <div className="section-label">Configurações</div>}
          <div className="menu-item-wrapper">
            <div
              ref={configRef}
              className={`menu-item menu-item-toggle ${configOpen ? 'open' : ''}`}
              onClick={() => toggleSubmenu(setConfigOpen)}
              onMouseEnter={() => handleMouseEnter(configRef, setConfigOpen)}
              onMouseLeave={() => menuCollapsed && setConfigOpen(false)}
            >
              <span className="menu-icon">⚙️</span>
              {!menuCollapsed && (
                <>
                  <span className="menu-text">Configurações</span>
                  <span className="menu-arrow">{configOpen ? '▼' : '▶'}</span>
                </>
              )}
            </div>
            {/* Submenu normal quando expandido */}
            {configOpen && !menuCollapsed && (
              <div className="submenu">
                <NavLink 
                  to="/usuarios"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">👨</span>
                  <span className="submenu-text">Usuários</span>
                </NavLink>
                <NavLink 
                  to="/perfis"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">🛡️</span>
                  <span className="submenu-text">Perfis</span>
                </NavLink>
                <NavLink 
                  to="/unidades"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                >
                  <span className="submenu-icon">📏</span>
                  <span className="submenu-text">Unidades</span>
                </NavLink>
              </div>
            )}
            {/* Flyout menu quando recolhido */}
            {configOpen && menuCollapsed && (
              <div 
                className="submenu-flyout"
                style={{ top: `${flyoutPosition.top}px` }}
                onMouseEnter={() => setConfigOpen(true)}
                onMouseLeave={() => setConfigOpen(false)}
              >
                <div className="flyout-header">⚙️ Configurações</div>
                <NavLink 
                  to="/usuarios"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setConfigOpen(false)}
                >
                  <span className="submenu-icon">👨</span>
                  <span className="submenu-text">Usuários</span>
                </NavLink>
                <NavLink 
                  to="/perfis"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setConfigOpen(false)}
                >
                  <span className="submenu-icon">🛡️</span>
                  <span className="submenu-text">Perfis</span>
                </NavLink>
                <NavLink 
                  to="/unidades"
                  className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setConfigOpen(false)}
                >
                  <span className="submenu-icon">📏</span>
                  <span className="submenu-text">Unidades</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer - Sair */}
      <div className="menu-footer">
        <NavLink 
          to="/" 
          className="menu-item menu-item-logout"
          title="Sair"
        >
          <span className="menu-icon">🚪</span>
          {!menuCollapsed && <span className="menu-text">Sair</span>}
        </NavLink>
      </div>
    </div>
  );
}

export default Menu;