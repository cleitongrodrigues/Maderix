import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useMenu } from "../../contexts/MenuContext";
import SettingsModal from "../../components/SettingsModal";
import "./Menu.css";

function Menu({ onToggleCollapse }) {
  // Usa o contexto do menu
  const {
    estoqueOpen, 
    setEstoqueOpen, 
    financeiroOpen, 
    setFinanceiroOpen, 
    configOpen, 
    setConfigOpen, 
    menuCollapsed, 
    setMenuCollapsed 
  } = useMenu();
  const location = useLocation();
  
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0 });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Estados para os formulários
  const [profileData, setProfileData] = useState({
    nome: 'Administrador',
    email: 'admin@maderix.com',
    perfil: 'Admin',
    foto: null
  });

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const fileInputRef = useRef(null);

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

  // Verifica se estamos em uma rota de estoque
  const isEstoqueRoute = location.pathname.startsWith('/estoque');
  const isFinanceiroRoute = location.pathname === '/contas' || location.pathname === '/vendas';
  const isConfigRoute = location.pathname === '/usuarios' || location.pathname === '/unidades' || location.pathname === '/perfis';

  const toggleSubmenu = (setter) => {
    // Fecha todos os outros submenus antes de abrir o atual
    if (setter === setEstoqueOpen) {
      setFinanceiroOpen(false);
      setConfigOpen(false);
    } else if (setter === setFinanceiroOpen) {
      setEstoqueOpen(false);
      setConfigOpen(false);
    } else if (setter === setConfigOpen) {
      setEstoqueOpen(false);
      setFinanceiroOpen(false);
    }
    // Alterna o submenu atual
    setter((prev) => !prev);
  };

  const handleMouseEnter = (ref, setter) => {
    if (menuCollapsed && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setFlyoutPosition({ top: rect.top });
      setter(true);
    }
  };

  const closeAllSubmenus = () => {
    setEstoqueOpen(false);
    setFinanceiroOpen(false);
    setConfigOpen(false);
  };

  // Event listeners para abrir modais via busca
  useEffect(() => {
    const handleOpenSettings = () => setSettingsModalOpen(true);

    window.addEventListener('openSettingsModal', handleOpenSettings);

    return () => {
      window.removeEventListener('openSettingsModal', handleOpenSettings);
    };
  }, []);

  const handleEditProfile = () => {
    setProfileModalOpen(false);
    setEditProfileModalOpen(true);
  };

  const handleChangePassword = () => {
    setProfileModalOpen(false);
    setChangePasswordModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log('Salvando perfil:', profileData);
    alert('Perfil atualizado com sucesso!');
    setEditProfileModalOpen(false);
    setProfileModalOpen(true);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (passwordData.novaSenha.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres!');
      return;
    }

    console.log('Alterando senha');
    alert('Senha alterada com sucesso!');
    setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    setChangePasswordModalOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfileData({ ...profileData, foto: null });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`menu ${menuCollapsed ? 'menu-collapsed' : ''}`}>
      {/* Perfil do Usuário */}
      <div 
        className="menu-user"
        onClick={() => setProfileModalOpen(true)}
        style={{ cursor: 'pointer' }}
        title="Meu Perfil"
      >
        <div className="user-avatar">
          {profileData.foto ? (
            <img src={profileData.foto} alt="Foto de perfil" className="user-avatar-image" />
          ) : (
            <span>👨‍💼</span>
          )}
        </div>
        {!menuCollapsed && (
          <div className="user-info">
            <div className="user-name">{profileData.nome}</div>
            <div className="user-role">{profileData.perfil}</div>
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
            onClick={closeAllSubmenus}
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
            onClick={closeAllSubmenus}
          >
            <span className="menu-icon">👨‍💼</span>
            {!menuCollapsed && <span className="menu-text">Clientes</span>}
          </NavLink>
          <NavLink 
            to="/empresas" 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            title="Empresas"
            onClick={closeAllSubmenus}
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
              className={`menu-item menu-item-toggle ${estoqueOpen ? 'open' : ''} ${menuCollapsed && isEstoqueRoute ? 'active' : ''}`}
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
              className={`menu-item menu-item-toggle ${financeiroOpen ? 'open' : ''} ${menuCollapsed && isFinanceiroRoute ? 'active' : ''}`}
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
              className={`menu-item menu-item-toggle ${configOpen ? 'open' : ''} ${menuCollapsed && isConfigRoute ? 'active' : ''}`}
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
          onClick={closeAllSubmenus}
        >
          <span className="menu-icon">🚪</span>
          {!menuCollapsed && <span className="menu-text">Sair</span>}
        </NavLink>
      </div>

      {/* Modal de Perfil */}
      {profileModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setProfileModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Meu Perfil</h2>
              <button 
                className="profile-modal-close"
                onClick={() => setProfileModalOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="profile-modal-content">
              <div className="profile-avatar-large">
                {profileData.foto ? (
                  <img src={profileData.foto} alt="Foto de perfil" className="avatar-image" />
                ) : (
                  <span>👨‍💼</span>
                )}
              </div>
              
              <div className="profile-info-section">
                <div className="profile-info-item">
                  <label>Nome:</label>
                  <span>{profileData.nome}</span>
                </div>
                <div className="profile-info-item">
                  <label>Email:</label>
                  <span>{profileData.email}</span>
                </div>
                <div className="profile-info-item">
                  <label>Perfil:</label>
                  <span className="profile-badge">{profileData.perfil}</span>
                </div>
                <div className="profile-info-item">
                  <label>Último acesso:</label>
                  <span>28/10/2025 14:30</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button 
                  className="btn-profile-action btn-edit"
                  onClick={handleEditProfile}
                >
                  <span>✏️</span>
                  Editar Perfil
                </button>
                <button 
                  className="btn-profile-action btn-password"
                  onClick={handleChangePassword}
                >
                  <span>🔒</span>
                  Alterar Senha
                </button>
                <button 
                  className="btn-profile-action btn-settings"
                  onClick={() => {
                    setProfileModalOpen(false);
                    setSettingsModalOpen(true);
                  }}
                >
                  <span>⚙️</span>
                  Preferências
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Perfil */}
      {editProfileModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setEditProfileModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Editar Perfil</h2>
              <button 
                className="profile-modal-close"
                onClick={() => setEditProfileModalOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="profile-modal-content">
              <form onSubmit={handleSaveProfile}>
                <div className="profile-photo-section">
                  <div className="profile-avatar-large">
                    {profileData.foto ? (
                      <img src={profileData.foto} alt="Foto de perfil" className="avatar-image" />
                    ) : (
                      <span>👨‍💼</span>
                    )}
                    <div className="avatar-overlay">
                      <button 
                        type="button" 
                        className="btn-change-photo"
                        onClick={triggerFileInput}
                        title="Alterar foto"
                      >
                        📷
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div className="photo-actions">
                    <button 
                      type="button" 
                      className="btn-upload-photo"
                      onClick={triggerFileInput}
                    >
                      📤 Carregar Foto
                    </button>
                    {profileData.foto && (
                      <button 
                        type="button" 
                        className="btn-remove-photo"
                        onClick={handleRemovePhoto}
                      >
                        🗑️ Remover
                      </button>
                    )}
                  </div>
                  <p className="photo-hint">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-input"
                    value={profileData.nome}
                    onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="perfil">Perfil</label>
                  <input
                    type="text"
                    id="perfil"
                    className="form-input"
                    value={profileData.perfil}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    O perfil não pode ser alterado pelo usuário
                  </small>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setEditProfileModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Senha */}
      {changePasswordModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setChangePasswordModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Alterar Senha</h2>
              <button 
                className="profile-modal-close"
                onClick={() => setChangePasswordModalOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="profile-modal-content">
              <form onSubmit={handleSavePassword}>
                <div className="form-group">
                  <label htmlFor="senhaAtual">Senha Atual</label>
                  <input
                    type="password"
                    id="senhaAtual"
                    className="form-input"
                    value={passwordData.senhaAtual}
                    onChange={(e) => setPasswordData({ ...passwordData, senhaAtual: e.target.value })}
                    required
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="novaSenha">Nova Senha</label>
                  <input
                    type="password"
                    id="novaSenha"
                    className="form-input"
                    value={passwordData.novaSenha}
                    onChange={(e) => setPasswordData({ ...passwordData, novaSenha: e.target.value })}
                    required
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    className="form-input"
                    value={passwordData.confirmarSenha}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmarSenha: e.target.value })}
                    required
                    placeholder="Digite a senha novamente"
                  />
                </div>

                <div className="password-requirements">
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    <strong>Requisitos da senha:</strong>
                  </p>
                  <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px', margin: 0 }}>
                    <li>Mínimo de 6 caracteres</li>
                    <li>As senhas devem coincidir</li>
                  </ul>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setChangePasswordModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Alterar Senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Preferências */}
      <SettingsModal 
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSave={(preferences) => {
          console.log('Preferências salvas:', preferences);
          // Aqui você pode aplicar as preferências ao sistema
        }}
      />
    </div>
  );
}

export default Menu;
