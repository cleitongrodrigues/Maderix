import React, { useState, useCallback } from "react";
import Produto from "../Cadastro_Produto/Produto"; // Adicione esta importação
import Pagination from "../../../components/Pagination/Pagination";
import ActionButtons from "../../../components/ActionButtons";
import { Outlet } from "react-router-dom";
import "./Estoque.css";

const ITEMS_PER_PAGE = 10; 

function Estoque() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;
  const [openMenuId, setOpenMenuId] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState(null); // 'falta', 'total', ou null
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);
  const [ordenacao, setOrdenacao] = useState({ campo: 'id', direcao: 'asc' }); // Ordenação da tabela

  // --- Funções de Lógica ---
  const toggleMenu = useCallback((id) => {
    setOpenMenuId(prevOpenMenuId => prevOpenMenuId === id ? null : id);
  }, []);
    
  const handleEdit = (id) => {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      // Converter formato de exibição para formato do modal
      const produtoFormatado = {
        ...produto,
        codigo: `PROD${String(id).padStart(3, '0')}`,
        fornecedor: 'Fornecedor Exemplo',
        categoria: 'Categoria Exemplo',
        unidadeMedida: 'UN',
        precoCusto: parseFloat(produto.preco.replace('R$ ', '').replace(',', '.')) * 0.7, // 70% do preço
        precoVenda: parseFloat(produto.preco.replace('R$ ', '').replace(',', '.')),
        descricao: `Descrição do produto ${produto.nome}`,
        dataCadastro: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      };
      setProdutoParaEditar(produtoFormatado);
      setIsModalOpen(true);
    }
    setOpenMenuId(null); 
  };

  const handleDelete = (id) => {
    if(window.confirm(`Tem certeza que deseja excluir o produto ${id}?`)) {
      alert(`Produto ${id} excluído!`);
    }
    setOpenMenuId(null); 
  };

  // novo: ação de gerar relatório (placeholder)
  const handleGenerateReport = () => {
    // implementar integração real com backend/gerador de PDF/CSV aqui
    alert('Gerando relatório de estoque...');
  };

  // --- Dados e Paginação ---
  const [produtos] = useState(() => 
    Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      nome: `Produto ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      quantidade: Math.floor(Math.random() * 100),
      preco: `R$ ${(Math.random() * 100 + 10).toFixed(2).replace('.', ',')}`,
    }))
  );

  // filter products by search query (case-insensitive) e filtro de cards
  let filteredProdutos = produtos.filter(p => p.nome.toLowerCase().includes(searchQuery.trim().toLowerCase()));
  
  // Aplica filtro dos cards se houver
  if (filtroAtivo === 'falta') {
    filteredProdutos = filteredProdutos.filter(p => p.quantidade < 5);
  }
  // Se filtroAtivo === 'total', mostra todos (não precisa filtrar)

  // Aplica ordenação
  const produtosOrdenados = [...filteredProdutos].sort((a, b) => {
    let valorA, valorB;

    switch (ordenacao.campo) {
      case 'id':
        valorA = a.id;
        valorB = b.id;
        break;
      case 'nome':
        valorA = a.nome.toLowerCase();
        valorB = b.nome.toLowerCase();
        break;
      case 'quantidade':
        valorA = a.quantidade;
        valorB = b.quantidade;
        break;
      case 'preco':
        valorA = parseFloat(a.preco.replace('R$ ', '').replace(',', '.'));
        valorB = parseFloat(b.preco.replace('R$ ', '').replace(',', '.'));
        break;
      default:
        return 0;
    }

    if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(produtosOrdenados.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = produtosOrdenados.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={i === currentPage ? 'pagination-button active' : 'pagination-button'} 
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  // Handler para os cards clicáveis - filtra a tabela
  const handleCardClick = (cardType) => {
    if (filtroAtivo === cardType) {
      // Se clicar no mesmo card, remove o filtro
      setFiltroAtivo(null);
    } else {
      // Aplica o novo filtro
      setFiltroAtivo(cardType);
    }
    setCurrentPage(1); // Volta para primeira página ao filtrar
    setSearchQuery(''); // Limpa busca ao aplicar filtro de card
  };

  // Função para limpar filtro
  const limparFiltro = () => {
    setFiltroAtivo(null);
    setCurrentPage(1);
  };

  // Função para salvar produto (novo ou editado)
  const handleSaveProduto = (produtoData) => {
    console.log('Produto salvo:', produtoData);
    // Aqui você integraria com a API para salvar no backend
    // Por enquanto, apenas fecha o modal
  };

  // Função para abrir modal de novo cadastro
  const handleNovoProduto = () => {
    setProdutoParaEditar(null);
    setIsModalOpen(true);
  };

  // Função para alterar ordenação
  const handleOrdenar = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="pagina-estoque">
      <div className="estoque-container">
        <div className="estoque-cabecalho-fixo">
          <div className="pagina-inner">
            {/* título agora faz parte do header fixo para permanecer visível ao rolar */}
            <div className="titulo-estoque">
              <h1>📦 ESTOQUE DE PRODUTOS</h1>
            </div>

          {/* mover a área de botões para o cabeçalho sticky */}
          <div className="container-botoes acoes-cabecalho">
            <div className="botoes-internos">
              <div className="buttons-left">
                <div className="acoes-internas">
                  <input
                    className="search-input header-search"
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    aria-label="Buscar produto"
                />
                  <button onClick={handleNovoProduto}>
                    <span className="btn-icon">+</span> Cadastrar Produto
                  </button>
                  <button onClick={handleGenerateReport}>
                    <span className="btn-icon">📄</span> Gerar Relatório
                  </button>
                </div>
              </div>
              <div className="buttons-actions">
                {/* espaço para ações relacionadas aos botões (filtros rápidos, export, etc.) */}
              </div>
            </div>
          </div>

          <div className="quick-actions top-quick-actions">
            <div className="acoes-rapidas-interna">
              <div className="cards-resumo">
                <div 
                  className={`card-resumo clickable ${filtroAtivo === 'total' ? 'ativo' : ''}`} 
                  onClick={() => handleCardClick('total')} 
                  title="Clique para ver todos os produtos"
                >
                  <div className="card-icon">📦</div>
                  <div className="card-content">
                    <h3>Total de Produtos</h3>
                    <p>{produtos.length}</p>
                  </div>
                </div>
                <div 
                  className={`card-resumo clickable alerta ${filtroAtivo === 'falta' ? 'ativo' : ''}`} 
                  onClick={() => handleCardClick('falta')} 
                  title="Produtos com estoque menor que 5 unidades - Clique para filtrar"
                >
                  <div className="card-icon">⚠️</div>
                  <div className="card-content">
                    <h3>Produtos em Falta</h3>
                    <p>{produtos.filter(p => p.quantidade < 5).length}</p>
                  </div>
                </div>
              </div>
              <div className="acoes-rapidas-acoes">
                {/* Badge de filtro ativo */}
                {filtroAtivo && (
                  <div className="badge-filtro-ativo">
                    <span className="badge-texto">
                      {filtroAtivo === 'falta' ? '⚠️ Mostrando: Produtos em Falta' : '📦 Mostrando: Todos os Produtos'}
                    </span>
                    <button className="btn-limpar-filtro" onClick={limparFiltro} title="Limpar filtro">
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="conteudo-pagina"> 
        <div className="bloco-lista atividade-recente">
          
          
          <div className="card area-tabela"> 
            <table className="tabela-estoque">
              <thead>
                <tr>
                  <th onClick={() => handleOrdenar('id')} className="th-ordenavel">
                    ID 
                    {ordenacao.campo === 'id' && (
                      <span className="seta-ordem">{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th onClick={() => handleOrdenar('nome')} className="th-ordenavel">
                    Nome 
                    {ordenacao.campo === 'nome' && (
                      <span className="seta-ordem">{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th onClick={() => handleOrdenar('quantidade')} className="th-ordenavel">
                    Quantidade 
                    {ordenacao.campo === 'quantidade' && (
                      <span className="seta-ordem">{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th onClick={() => handleOrdenar('preco')} className="th-ordenavel">
                    Preço 
                    {ordenacao.campo === 'preco' && (
                      <span className="seta-ordem">{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="col-acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="mensagem-vazia">
                      {filtroAtivo === 'falta' ? (
                        <div className="empty-state">
                          <span className="empty-icon">✅</span>
                          <p>Nenhum produto em falta no momento!</p>
                          <small>Todos os produtos estão com estoque adequado</small>
                        </div>
                      ) : searchQuery ? (
                        <div className="empty-state">
                          <span className="empty-icon">🔍</span>
                          <p>Nenhum produto encontrado</p>
                          <small>Tente buscar com outros termos</small>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <span className="empty-icon">📦</span>
                          <p>Nenhum produto cadastrado</p>
                          <small>Clique em "Cadastrar Produto" para começar</small>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((produto) => (
                    <tr key={produto.id} className={produto.quantidade < 5 ? 'baixo-estoque' : ''}>
                      <td>{produto.id}</td>
                      <td>{produto.nome}</td>
                      <td>
                        {produto.quantidade < 5 && <span className="icone-alerta">⚠️</span>}
                        {produto.quantidade}
                      </td>
                      <td>{produto.preco}</td>
                      <td className="celula-acoes">
                        <ActionButtons onEdit={() => handleEdit(produto.id)} onDelete={() => handleDelete(produto.id)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {produtos.length > 0 && (
            <Pagination
              totalItems={produtos.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={(p) => setCurrentPage(p)}
              showCount={true}
            />
          )}
        </div>

        
      </div>

      {/* Modal do Produto */}
      </div> {/* Fecha estoque-container */}

      <Produto 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setProdutoParaEditar(null);
        }}
        onSave={handleSaveProduto}
        produtoParaEditar={produtoParaEditar}
      />

      {/* Outlet para rotas-filhas, ex.: /estoque/movimentacoes */}
      <Outlet />
    </div>
  );
}

export default Estoque;