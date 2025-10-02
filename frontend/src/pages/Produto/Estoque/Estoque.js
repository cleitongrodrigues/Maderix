import React, { useState, useCallback } from "react";
import Produto from "../Cadastro_Produto/Produto"; // Adicione esta importação
import "./Estoque.css";

const ITEMS_PER_PAGE = 10; 

function Estoque() {
  const [currentPage, setCurrentPage] = useState(1);
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

  // --- Dados e Paginação ---
  const [produtos] = useState(() => 
    Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      nome: `Produto ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      quantidade: Math.floor(Math.random() * 100),
      preco: `R$ ${(Math.random() * 100 + 10).toFixed(2).replace('.', ',')}`,
    }))
  );

  const totalPages = Math.ceil(produtos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
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

      <div className="home-content"> 
        <div className="product-list-block recent-activity">
          <div className="quick-actions" style={{ marginBottom: "20px" }}>
            <button onClick={() => setIsModalOpen(true)}>
              Cadastrar Produto
            </button>
          </div>
          
          <div className="card table-wrapper"> 
            <table className="stock-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th style={{ width: '80px' }}>Ações</th>
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
                      <div className="action-dropdown-container">
                        <button 
                          className="btn-action-trigger" 
                          onClick={() => toggleMenu(produto.id)}
                        >
                          &#x22EE; 
                        </button>
                        {openMenuId === produto.id && (
                          <div className="action-dropdown-menu">
                            <button onClick={() => handleEdit(produto.id)}>
                              Editar
                            </button>
                            <button onClick={() => handleDelete(produto.id)} className="delete-btn">
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button nav-button"
              >
                Anterior
              </button>
              {renderPaginationButtons()}
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button nav-button"
              >
                Próxima
              </button>
            </div>
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
          <button>Gerar Relatório de Estoque</button>
        </div>
      </div>

      {/* Modal do Produto */}
      <Produto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default Estoque;