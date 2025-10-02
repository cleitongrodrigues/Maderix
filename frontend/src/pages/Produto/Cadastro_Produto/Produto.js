import React from "react";
import "./Produto.css";

function Produto({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>Cadastro de Produtos</h1>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="produto-container">
          <form>
            <div className="input-row">
              <div>
                <label htmlFor="codigo">Código do produto</label>
                <input id="codigo" type="text" placeholder="Código do produto" />
              </div>
              <div>
                <label htmlFor="nome">Nome do produto</label>
                <input id="nome" type="text" placeholder="Nome do produto" />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label htmlFor="fornecedor">Fornecedor</label>
                <input id="fornecedor" type="text" placeholder="Fornecedor" />           
              </div>
              <div>
                <label htmlFor="categoria">Categoria</label>
                <input id="categoria" type="text" placeholder="Categoria" />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label htmlFor="unidade">Unidade de medida</label>
                <input
                  id="unidade"
                  type="text"
                  placeholder="Unidade de medida (ex: UN, KG)"
                />
              </div>
              <div>
                <label htmlFor="estoque">Quantidade em estoque</label>
                <input
                  id="estoque"
                  type="number"
                  placeholder="Quantidade em estoque"
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label htmlFor="custo">Preço de custo</label>
                <input
                  id="custo"
                  type="number"
                  placeholder="Preço de custo"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="venda">Preço de venda</label>
                <input
                  id="venda"
                  type="number"
                  placeholder="Preço de venda"
                  step="0.01"
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" placeholder="Descrição" rows="3"></textarea>
              </div>
            </div>
            <div className="button-container">
              <button type="submit">Salvar Produto</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Produto;