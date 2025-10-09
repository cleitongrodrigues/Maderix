import React, { useState, useCallback } from "react";
import Produto from "../Cadastro_Produto/Produto"; // Adicione esta importação
import Pagination from "../../../components/Pagination/Pagination";
import ActionButtons from "../../../components/ActionButtons";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Estoque.css";

const ITEMS_PER_PAGE = 10; 

function Estoque() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [openMenuId, setOpenMenuId] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const totalPages = Math.ceil(produtos.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = produtos.slice(startIndex, endIndex);

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
    <div className="home"> 
      <h1>Estoque de Produtos</h1>

      <div style={{ marginBottom: 12 }}>
        <NavLink to="/estoque/movimentacoes">Ver Movimentações</NavLink>
      </div>

      <div className="home-content"> 
        <div className="product-list-block recent-activity">
          <div className="quick-actions" style={{ marginBottom: "20px", display: 'flex', gap: 12 }}>
            <div className="actions-inner">
              <button onClick={() => setIsModalOpen(true)}>
                Cadastrar Produto
              </button>
              <button onClick={() => navigate('/estoque/movimentacoes')}>
                Ver Movimentações
              </button>
              <button onClick={handleGenerateReport}>
                Gerar Relatório
              </button>
            </div>
          </div>
          
          <div className="card table-wrapper"> 
            <table className="stock-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.preco}</td>
                    <td className="actions-cell">
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

        <div className="quick-actions">
          <h2>Resumo Rápido</h2>
          <div className="card-summary">
            <h3>Total de Produtos</h3>
            <p>{produtos.length}</p>
          </div>
          <div className="card-summary">
            <h3>Produtos em Falta</h3>
            <p>{produtos.filter(p => p.quantidade < 5).length}</p>
          </div>
          {/* botão de gerar relatório foi movido para ações rápidas */}
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