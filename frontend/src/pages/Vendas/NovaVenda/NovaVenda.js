import React from "react";
import "./NovaVenda.css";

function NovaVenda() {
  return (
    <div className="page nova-venda">
      <h1>Nova Venda</h1>
      <p>Formulário para adicionar itens, escolher cliente e finalizar a venda.</p>
      {/* Campos: cliente, itens (autocomplete), quantidade, preço unitário, total */}
    </div>
  );
}

export default NovaVenda;
