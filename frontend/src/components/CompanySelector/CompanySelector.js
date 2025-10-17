import React, { useState, useEffect } from 'react';
import './CompanySelector.css';

const CompanySelector = ({ isOpen, onClose, onSelectCompany }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(1);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - em produção, viria da API
  const mockEmpresas = [
    {
      id: 1,
      nome: 'Maderix Móveis Ltda',
      cnpj: '12.345.678/0001-90',
      cidade: 'São Paulo',
      estado: 'SP',
      ativa: true,
      tipo: 'Matriz',
      logo: null,
      usuarios: 45,
      ultimoAcesso: '2025-10-28T14:30:00'
    },
    {
      id: 2,
      nome: 'Maderix Filial Rio',
      cnpj: '12.345.678/0002-71',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      ativa: true,
      tipo: 'Filial',
      logo: null,
      usuarios: 28,
      ultimoAcesso: '2025-10-28T13:15:00'
    },
    {
      id: 3,
      nome: 'Maderix Sul',
      cnpj: '12.345.678/0003-52',
      cidade: 'Curitiba',
      estado: 'PR',
      ativa: true,
      tipo: 'Filial',
      logo: null,
      usuarios: 19,
      ultimoAcesso: '2025-10-27T16:45:00'
    },
    {
      id: 4,
      nome: 'Maderix Nordeste',
      cnpj: '12.345.678/0004-33',
      cidade: 'Recife',
      estado: 'PE',
      ativa: true,
      tipo: 'Filial',
      logo: null,
      usuarios: 22,
      ultimoAcesso: '2025-10-26T10:20:00'
    },
    {
      id: 5,
      nome: 'Maderix MG',
      cnpj: '12.345.678/0005-14',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      ativa: false,
      tipo: 'Filial',
      logo: null,
      usuarios: 0,
      ultimoAcesso: '2025-09-15T09:00:00'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simula carregamento de dados
      setTimeout(() => {
        setEmpresas(mockEmpresas);
        setLoading(false);
      }, 300);

      // Carrega empresa atual do localStorage
      const empresaAtual = localStorage.getItem('empresaAtual');
      if (empresaAtual) {
        setSelectedCompanyId(parseInt(empresaAtual));
      }
    }
  }, [isOpen]);

  const handleSelectCompany = (empresa) => {
    if (!empresa.ativa) {
      alert('Esta empresa está inativa e não pode ser selecionada.');
      return;
    }

    setSelectedCompanyId(empresa.id);
    localStorage.setItem('empresaAtual', empresa.id.toString());
    
    // Notifica o componente pai
    if (onSelectCompany) {
      onSelectCompany(empresa);
    }

    // Fecha o modal após seleção
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    empresa.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const empresaAtual = empresas.find(e => e.id === selectedCompanyId);

  const formatarDataAcesso = (dataStr) => {
    const data = new Date(dataStr);
    const hoje = new Date();
    const diffDias = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
      const diffHoras = Math.floor((hoje - data) / (1000 * 60 * 60));
      if (diffHoras === 0) {
        const diffMinutos = Math.floor((hoje - data) / (1000 * 60));
        return `há ${diffMinutos} minutos`;
      }
      return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    } else if (diffDias === 1) {
      return 'ontem';
    } else if (diffDias < 7) {
      return `há ${diffDias} dias`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="company-selector-overlay" onClick={onClose}>
      <div className="company-selector-container" onClick={(e) => e.stopPropagation()}>
        <div className="company-selector-header">
          <div className="header-title">
            <span className="title-icon">🏢</span>
            <h2>Selecionar Empresa</h2>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* Empresa Atual */}
        {empresaAtual && (
          <div className="current-company-banner">
            <div className="banner-icon">✓</div>
            <div className="banner-content">
              <span className="banner-label">Empresa Atual</span>
              <span className="banner-company">{empresaAtual.nome}</span>
              <span className="banner-location">{empresaAtual.cidade} - {empresaAtual.estado}</span>
            </div>
          </div>
        )}

        {/* Barra de Busca */}
        <div className="company-search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="company-search-input"
              placeholder="Buscar por nome, CNPJ, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>
          <div className="search-info">
            {filteredEmpresas.length} empresa{filteredEmpresas.length !== 1 ? 's' : ''} encontrada{filteredEmpresas.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Lista de Empresas */}
        <div className="company-list-container">
          {loading ? (
            <div className="company-loading">
              <div className="spinner"></div>
              <p>Carregando empresas...</p>
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="company-empty">
              <span className="empty-icon">🔍</span>
              <p>Nenhuma empresa encontrada</p>
              <span className="empty-hint">Tente ajustar os termos de busca</span>
            </div>
          ) : (
            <div className="company-list">
              {filteredEmpresas.map((empresa) => {
                const isSelected = empresa.id === selectedCompanyId;
                const isInativa = !empresa.ativa;

                return (
                  <div
                    key={empresa.id}
                    className={`company-card ${isSelected ? 'selected' : ''} ${isInativa ? 'inactive' : ''}`}
                    onClick={() => handleSelectCompany(empresa)}
                  >
                    {isSelected && (
                      <div className="selected-badge">
                        <span>✓</span> Atual
                      </div>
                    )}

                    {isInativa && (
                      <div className="inactive-badge">
                        Inativa
                      </div>
                    )}

                    <div className="company-card-header">
                      <div className="company-logo">
                        {empresa.logo ? (
                          <img src={empresa.logo} alt={empresa.nome} />
                        ) : (
                          <span className="logo-placeholder">
                            {empresa.nome.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="company-info">
                        <h3 className="company-name">{empresa.nome}</h3>
                        <div className="company-meta">
                          <span className="company-tipo">{empresa.tipo}</span>
                          <span className="company-cnpj">{empresa.cnpj}</span>
                        </div>
                      </div>
                    </div>

                    <div className="company-card-body">
                      <div className="company-detail">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{empresa.cidade} - {empresa.estado}</span>
                      </div>
                      
                      {empresa.ativa && (
                        <>
                          <div className="company-detail">
                            <span className="detail-icon">👥</span>
                            <span className="detail-text">{empresa.usuarios} usuários ativos</span>
                          </div>
                          
                          <div className="company-detail">
                            <span className="detail-icon">🕐</span>
                            <span className="detail-text">Último acesso {formatarDataAcesso(empresa.ultimoAcesso)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {!isInativa && !isSelected && (
                      <div className="company-card-action">
                        <button className="btn-select-company">
                          Selecionar Empresa →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="company-selector-footer">
          <div className="footer-info">
            <span className="info-icon">ℹ️</span>
            <span>Ao trocar de empresa, os dados exibidos serão atualizados automaticamente</span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;
