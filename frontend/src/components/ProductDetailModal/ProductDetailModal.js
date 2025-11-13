import React, { useState, useEffect } from 'react';
import { estoqueAPI } from '../../services/api';
import './ProductDetailModal.css';

function ProductDetailModal({ produto, onClose, onEdit, onViewMovements }) {
  const [activeTab, setActiveTab] = useState('geral'); // geral, historico, info
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loadingMov, setLoadingMov] = useState(false);

  useEffect(() => {
    async function fetchMovimentacoes() {
      if (produto && produto.id) {
        setLoadingMov(true);
        try {
          console.log('[MODAL] Buscando movimentações para produto id:', produto.id, produto);
          const data = await estoqueAPI.buscarPorMaterial(produto.id);
          console.log('[MODAL] Resposta da API de movimentações:', data);
          setMovimentacoes(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('[MODAL] Erro ao buscar movimentações:', err);
          setMovimentacoes([]);
        } finally {
          setLoadingMov(false);
        }
      }
    }
    if (activeTab === 'historico') {
      fetchMovimentacoes();
    }
  }, [produto, activeTab]);

  if (!produto) return null;

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor) => {
    if (typeof valor === 'string') {
      return valor;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Calcula status do estoque
  const getStatusEstoque = () => {
    if (produto.quantidade === 0) return { text: 'Sem Estoque', class: 'critico' };
    if (produto.quantidade < 5) return { text: 'Estoque Baixo', class: 'alerta' };
    if (produto.quantidade < 20) return { text: 'Estoque Normal', class: 'normal' };
    return { text: 'Estoque Bom', class: 'bom' };
  };

  const status = getStatusEstoque();

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div className="product-modal-header">
          <div className="product-modal-title-section">
            <h2>📦 Detalhes do Produto</h2>
            <span className={`status-badge ${status.class}`}>{status.text}</span>
          </div>
          <button className="product-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="product-modal-content">
          {/* Seção de Foto e Info Básica */}
          <div className="product-header-section">
            <div className="product-image-container">
              {produto.foto ? (
                <img src={produto.foto} alt={produto.nome} className="product-image" />
              ) : (
                <div className="product-image-placeholder">
                  <span className="placeholder-icon">📦</span>
                  <span className="placeholder-text">Sem imagem</span>
                </div>
              )}
            </div>
            <div className="product-basic-info">
              <h3 className="product-name">{produto.nome}</h3>
              <div className="product-code">Código: PROD{String(produto.id).padStart(3, '0')}</div>
              <div className="product-price-section">
                <div className="price-item">
                  <span className="price-label">Preço:</span>
                  <span className="price-value">{formatarMoeda(produto.preco)}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Quantidade:</span>
                  <span className="quantity-value">{produto.quantidade} unidades</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="product-tabs">
            <button
              className={`product-tab ${activeTab === 'geral' ? 'active' : ''}`}
              onClick={() => setActiveTab('geral')}
            >
              📋 Informações Gerais
            </button>
            <button
              className={`product-tab ${activeTab === 'historico' ? 'active' : ''}`}
              onClick={() => setActiveTab('historico')}
            >
              📊 Histórico de Movimentações
            </button>
            <button
              className={`product-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              ℹ️ Informações Adicionais
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="product-tab-content">
            {/* Aba: Informações Gerais */}
            {activeTab === 'geral' && (
              <div className="tab-panel">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Nome do Produto:</span>
                    <span className="info-value">{produto.nome}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Código:</span>
                    <span className="info-value">PROD{String(produto.id).padStart(3, '0')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Quantidade em Estoque:</span>
                    <span className="info-value highlight">{produto.quantidade} unidades</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Preço Unitário:</span>
                    <span className="info-value">{formatarMoeda(produto.preco)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Valor Total em Estoque:</span>
                    <span className="info-value highlight">
                      {formatarMoeda(
                        produto.quantidade * 
                        (typeof produto.preco === 'string' 
                          ? parseFloat(produto.preco.replace('R$ ', '').replace(',', '.'))
                          : produto.preco)
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status do Estoque:</span>
                    <span className={`status-indicator ${status.class}`}>{status.text}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Aba: Histórico de Movimentações */}
            {activeTab === 'historico' && (
              <div className="tab-panel">
                <div className="movements-header">
                  <h4>Últimas Movimentações</h4>
                  <button className="btn-view-all" onClick={onViewMovements}>
                    Ver Todas →
                  </button>
                </div>
                <div className="movements-list">
                  {loadingMov ? (
                    <div>Carregando movimentações...</div>
                  ) : movimentacoes.length === 0 ? (
                    <div>Nenhuma movimentação encontrada.</div>
                  ) : (
                    movimentacoes.map(mov => (
                      <div key={mov.idMovimentacao || mov.id} className={`movement-item ${mov.tipoMovimento}`}>
                        <div className="movement-icon">
                          {mov.tipoMovimento === 'ENTRADA' ? '📥' : '📤'}
                        </div>
                        <div className="movement-info">
                          <div className="movement-header-row">
                            <span className={`movement-type ${mov.tipoMovimento}`}>{mov.tipoMovimento === 'ENTRADA' ? 'Entrada' : 'Saída'}</span>
                            <span className="movement-date">{formatarData(mov.dataMovimentacao)}</span>
                          </div>
                          <div className="movement-details">
                            <span className="movement-quantity">
                              {mov.tipoMovimento === 'ENTRADA' ? '+' : '-'}{mov.quantidade} un
                            </span>
                            <span className="movement-user">👤 {mov.usuarioMovimentacao || '---'}</span>
                          </div>
                          {mov.observacao && (
                            <div className="movement-obs">{mov.observacao}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Aba: Informações Adicionais */}
            {activeTab === 'info' && (
              <div className="tab-panel">
                <div className="info-grid">
                  <div className="info-item full-width">
                    <span className="info-label">Descrição:</span>
                    <span className="info-value">
                      {produto.descricao || 'Produto de alta qualidade, ideal para uso comercial e residencial.'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fornecedor:</span>
                    <span className="info-value">{produto.fornecedor || 'Fornecedor Exemplo Ltda'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Categoria:</span>
                    <span className="info-value">{produto.categoria || 'Material de Escritório'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Unidade de Medida:</span>
                    <span className="info-value">{produto.unidadeMedida || 'UN (Unidade)'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Data de Cadastro:</span>
                    <span className="info-value">
                      {produto.dataCadastro ? formatarData(produto.dataCadastro) : formatarData(new Date())}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estoque Mínimo:</span>
                    <span className="info-value">{produto.estoqueMinimo || 10} unidades</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Localização:</span>
                    <span className="info-value">{produto.localizacao || 'Prateleira A-12'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer com Ações */}
        <div className="product-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <div className="footer-actions">
            <button className="btn-action" onClick={onViewMovements}>
              📊 Ver Movimentações
            </button>
            <button className="btn-primary" onClick={() => onEdit(produto.id)}>
              ✏️ Editar Produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
