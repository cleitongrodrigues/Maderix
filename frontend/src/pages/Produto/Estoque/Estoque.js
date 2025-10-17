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

  // --- Funções de Lógica ---
  const toggleMenu = useCallback((id) => {
    setOpenMenuId(prevOpenMenuId => prevOpenMenuId === id ? null : id);
  }, []);
    
  const handleEdit = (id) => {
    alert(`Editar produto ${id}`);
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

  // filter products by search query (case-insensitive)
  const filteredProdutos = produtos.filter(p => p.nome.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filteredProdutos.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProdutos.slice(startIndex, endIndex);

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

  return (
    <div className="pagina-estoque"> 
      <div className="estoque-cabecalho-fixo">
        <div className="pagina-inner">
          {/* título agora faz parte do header fixo para permanecer visível ao rolar */}
          <div className="titulo-estoque">
            <h1>ESTOQUE DE PRODUTOS</h1>
          </div>

          <div className="quick-actions top-quick-actions">
            <div className="acoes-rapidas-interna">
              <div className="cards-resumo">
                <div className="card-resumo">
                  <h3>Total de Produtos</h3>
                  <p>{produtos.length}</p>
                </div>
                <div className="card-resumo">
                  <h3>Produtos em Falta</h3>
                  <p>{produtos.filter(p => p.quantidade < 5).length}</p>
                </div>
              </div>
              <div className="acoes-rapidas-acoes">
                {/* espaço reservado para ações rápidas separadas (export, filtros rápidos, etc.) */}
              </div>
            </div>
          </div>

          {/* mover a área de botões para o cabeçalho sticky */}
          <div className="container-botoes acoes-cabecalho">
            <div className="botoes-internos">
              <div className="buttons-left">
                <div className="acoes-internas">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    aria-label="Buscar produto"
                />
                  <button onClick={() => setIsModalOpen(true)}>
                    Cadastrar Produto
                  </button>
                  <button onClick={handleGenerateReport}>
                    Gerar Relatório
                  </button>
                </div>
              </div>
              <div className="buttons-actions">
                {/* espaço para ações relacionadas aos botões (filtros rápidos, export, etc.) */}
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
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th className="col-acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.preco}</td>
                    <td className="celula-acoes">
                      <ActionButtons onEdit={() => handleEdit(produto.id)} onDelete={() => handleDelete(produto.id)} />
                    </td>
                  </tr>
                ))}
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
      <Produto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Outlet para rotas-filhas, ex.: /estoque/movimentacoes */}
      <Outlet />
    </div>
  );
}

export default Estoque;