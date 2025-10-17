import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Mock data - em produção viria da API
  const mockData = {
    produtos: [
      { id: 1, nome: 'Mesa de Jantar 8 lugares', codigo: 'MJ-001', categoria: 'Mesas', estoque: 15, preco: 1200.00 },
      { id: 2, nome: 'Cadeira Escritório Executiva', codigo: 'CE-002', categoria: 'Cadeiras', estoque: 45, preco: 350.00 },
      { id: 3, nome: 'Armário Cozinha Completo', codigo: 'AC-003', categoria: 'Armários', estoque: 8, preco: 1500.00 },
      { id: 4, nome: 'Rack TV Suspenso', codigo: 'RT-004', categoria: 'Racks', estoque: 22, preco: 500.00 },
      { id: 5, nome: 'Guarda-roupa Casal 6 Portas', codigo: 'GR-005', categoria: 'Guarda-roupas', estoque: 12, preco: 1100.00 }
    ],
    clientes: [
      { id: 1, nome: 'João Silva', cpf: '123.456.789-00', cidade: 'São Paulo', telefone: '(11) 98888-7777' },
      { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00', cidade: 'Rio de Janeiro', telefone: '(21) 97777-6666' },
      { id: 3, nome: 'Carlos Oliveira', cpf: '456.789.123-00', cidade: 'Curitiba', telefone: '(41) 96666-5555' },
      { id: 4, nome: 'Ana Paula Costa', cpf: '789.123.456-00', cidade: 'Belo Horizonte', telefone: '(31) 95555-4444' }
    ],
    vendas: [
      { id: 1, numero: 'VD-2025-001', cliente: 'João Silva', data: '2025-10-25', valor: 3500.00, status: 'Concluída' },
      { id: 2, numero: 'VD-2025-002', cliente: 'Maria Santos', data: '2025-10-26', valor: 2100.00, status: 'Em Processamento' },
      { id: 3, numero: 'VD-2025-003', cliente: 'Carlos Oliveira', data: '2025-10-27', valor: 4200.00, status: 'Concluída' }
    ],
    contas: [
      { id: 1, numero: 'CR-2025-001', cliente: 'João Silva', vencimento: '2025-11-05', valor: 1200.00, status: 'Em Aberto' },
      { id: 2, numero: 'CR-2025-002', cliente: 'Maria Santos', vencimento: '2025-10-30', valor: 800.00, status: 'Vencida' },
      { id: 3, numero: 'CR-2025-003', cliente: 'Ana Paula Costa', vencimento: '2025-11-15', valor: 1500.00, status: 'Em Aberto' }
    ],
    paginas: [
      { id: 1, nome: 'Dashboard', rota: '/home', descricao: 'Visão geral do sistema', icon: '🏠' },
      { id: 2, nome: 'Estoque', rota: '/estoque', descricao: 'Gerenciar produtos', icon: '📦' },
      { id: 3, nome: 'Vendas', rota: '/vendas', descricao: 'Gerenciar vendas', icon: '💰' },
      { id: 4, nome: 'Contas a Receber', rota: '/contas-receber', descricao: 'Contas financeiras', icon: '💳' },
      { id: 5, nome: 'Clientes', rota: '/clientes', descricao: 'Cadastro de clientes', icon: '👥' },
      { id: 6, nome: 'Relatórios', rota: '#', descricao: 'Relatórios e estatísticas', icon: '📊', action: 'relatorios' },
      { id: 7, nome: 'Preferências', rota: '#', descricao: 'Configurações do sistema', icon: '⚙️', action: 'preferencias' }
    ]
  };

  // Filtra resultados
  const filterResults = () => {
    if (!searchTerm.trim()) return { produtos: [], clientes: [], vendas: [], contas: [], paginas: [] };

    const term = searchTerm.toLowerCase();
    
    return {
      produtos: mockData.produtos.filter(p => 
        p.nome.toLowerCase().includes(term) || 
        p.codigo.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
      ),
      clientes: mockData.clientes.filter(c => 
        c.nome.toLowerCase().includes(term) || 
        c.cpf.includes(term) ||
        c.cidade.toLowerCase().includes(term)
      ),
      vendas: mockData.vendas.filter(v => 
        v.numero.toLowerCase().includes(term) || 
        v.cliente.toLowerCase().includes(term)
      ),
      contas: mockData.contas.filter(c => 
        c.numero.toLowerCase().includes(term) || 
        c.cliente.toLowerCase().includes(term)
      ),
      paginas: mockData.paginas.filter(p => 
        p.nome.toLowerCase().includes(term) || 
        p.descricao.toLowerCase().includes(term)
      )
    };
  };

  const results = filterResults();
  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  // Resultados filtrados por categoria
  const getCategoryResults = () => {
    if (selectedCategory === 'todos') {
      return [
        ...results.paginas.map(item => ({ ...item, type: 'pagina' })),
        ...results.produtos.map(item => ({ ...item, type: 'produto' })),
        ...results.clientes.map(item => ({ ...item, type: 'cliente' })),
        ...results.vendas.map(item => ({ ...item, type: 'venda' })),
        ...results.contas.map(item => ({ ...item, type: 'conta' }))
      ];
    }
    return results[selectedCategory].map(item => ({ ...item, type: selectedCategory === 'paginas' ? 'pagina' : selectedCategory.slice(0, -1) }));
  };

  const filteredResults = getCategoryResults();

  // Focus no input quando abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchTerm('');
      setSelectedIndex(0);
      setSelectedCategory('todos');
    }
  }, [isOpen]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(filteredResults.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? Math.max(filteredResults.length - 1, 0) : prev - 1);
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        e.preventDefault();
        handleSelectResult(filteredResults[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Reset index quando muda categoria ou busca
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm, selectedCategory]);

  const handleSelectResult = (item) => {
    if (item.type === 'pagina') {
      if (item.action === 'relatorios') {
        // Trigger para abrir modal de relatórios
        window.dispatchEvent(new CustomEvent('openReportsModal'));
      } else if (item.action === 'preferencias') {
        // Trigger para abrir modal de preferências
        window.dispatchEvent(new CustomEvent('openSettingsModal'));
      } else {
        navigate(item.rota);
      }
    } else if (item.type === 'produto') {
      navigate('/estoque', { state: { highlightId: item.id } });
    } else if (item.type === 'cliente') {
      navigate('/clientes', { state: { highlightId: item.id } });
    } else if (item.type === 'venda') {
      navigate('/vendas', { state: { highlightId: item.id } });
    } else if (item.type === 'conta') {
      navigate('/contas-receber', { state: { highlightId: item.id } });
    }
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const renderResultItem = (item, index) => {
    const isSelected = index === selectedIndex;

    switch (item.type) {
      case 'pagina':
        return (
          <div
            key={`pagina-${item.id}`}
            className={`search-result-item ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectResult(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="result-icon">{item.icon}</div>
            <div className="result-content">
              <div className="result-title">{item.nome}</div>
              <div className="result-meta">{item.descricao}</div>
            </div>
            <div className="result-badge badge-pagina">Página</div>
          </div>
        );

      case 'produto':
        return (
          <div
            key={`produto-${item.id}`}
            className={`search-result-item ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectResult(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="result-icon">📦</div>
            <div className="result-content">
              <div className="result-title">{item.nome}</div>
              <div className="result-meta">
                <span>{item.codigo}</span>
                <span>•</span>
                <span>{item.categoria}</span>
                <span>•</span>
                <span>Estoque: {item.estoque}</span>
              </div>
            </div>
            <div className="result-price">{formatCurrency(item.preco)}</div>
          </div>
        );

      case 'cliente':
        return (
          <div
            key={`cliente-${item.id}`}
            className={`search-result-item ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectResult(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="result-icon">👤</div>
            <div className="result-content">
              <div className="result-title">{item.nome}</div>
              <div className="result-meta">
                <span>{item.cpf}</span>
                <span>•</span>
                <span>{item.cidade}</span>
                <span>•</span>
                <span>{item.telefone}</span>
              </div>
            </div>
            <div className="result-badge badge-cliente">Cliente</div>
          </div>
        );

      case 'venda':
        return (
          <div
            key={`venda-${item.id}`}
            className={`search-result-item ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectResult(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="result-icon">💰</div>
            <div className="result-content">
              <div className="result-title">{item.numero}</div>
              <div className="result-meta">
                <span>{item.cliente}</span>
                <span>•</span>
                <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="result-info">
              <div className="result-price">{formatCurrency(item.valor)}</div>
              <div className={`result-status status-${item.status.toLowerCase().replace(' ', '-')}`}>
                {item.status}
              </div>
            </div>
          </div>
        );

      case 'conta':
        return (
          <div
            key={`conta-${item.id}`}
            className={`search-result-item ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectResult(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="result-icon">💳</div>
            <div className="result-content">
              <div className="result-title">{item.numero}</div>
              <div className="result-meta">
                <span>{item.cliente}</span>
                <span>•</span>
                <span>Vence em {new Date(item.vencimento).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="result-info">
              <div className="result-price">{formatCurrency(item.valor)}</div>
              <div className={`result-status status-${item.status.toLowerCase().replace(' ', '-')}`}>
                {item.status}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="search-input-section">
          <div className="search-input-wrapper">
            <span className="search-input-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Buscar produtos, clientes, vendas, páginas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <kbd className="search-kbd">Esc</kbd>
          </div>
        </div>

        {/* Category Filters */}
        {searchTerm && (
          <div className="search-categories">
            <button
              className={`category-btn ${selectedCategory === 'todos' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('todos')}
            >
              Todos ({totalResults})
            </button>
            {results.paginas.length > 0 && (
              <button
                className={`category-btn ${selectedCategory === 'paginas' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('paginas')}
              >
                Páginas ({results.paginas.length})
              </button>
            )}
            {results.produtos.length > 0 && (
              <button
                className={`category-btn ${selectedCategory === 'produtos' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('produtos')}
              >
                Produtos ({results.produtos.length})
              </button>
            )}
            {results.clientes.length > 0 && (
              <button
                className={`category-btn ${selectedCategory === 'clientes' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('clientes')}
              >
                Clientes ({results.clientes.length})
              </button>
            )}
            {results.vendas.length > 0 && (
              <button
                className={`category-btn ${selectedCategory === 'vendas' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('vendas')}
              >
                Vendas ({results.vendas.length})
              </button>
            )}
            {results.contas.length > 0 && (
              <button
                className={`category-btn ${selectedCategory === 'contas' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('contas')}
              >
                Contas ({results.contas.length})
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="search-results">
          {!searchTerm ? (
            <div className="search-empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Busca Rápida</h3>
              <p>Digite para buscar em produtos, clientes, vendas, contas e páginas</p>
              <div className="search-tips">
                <div className="tip">
                  <kbd>↑</kbd> <kbd>↓</kbd> para navegar
                </div>
                <div className="tip">
                  <kbd>Enter</kbd> para selecionar
                </div>
                <div className="tip">
                  <kbd>Esc</kbd> para fechar
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="search-no-results">
              <div className="empty-icon">😕</div>
              <h3>Nenhum resultado encontrado</h3>
              <p>Tente buscar por outros termos</p>
            </div>
          ) : (
            <div className="search-results-list">
              {filteredResults.map((item, index) => renderResultItem(item, index))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchTerm && filteredResults.length > 0 && (
          <div className="search-modal-footer">
            <div className="footer-hint">
              <kbd>↑</kbd> <kbd>↓</kbd> Navegar • <kbd>Enter</kbd> Selecionar • <kbd>Esc</kbd> Fechar
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
