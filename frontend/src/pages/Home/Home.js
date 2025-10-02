import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao Sistema de Controle de Estoque</h1>
      <div className="home-overview">
        <div className="card">
          <h2>Total de Produtos</h2>
          <p>150</p>
        </div>
        <div className="card">
          <h2>Produtos em Falta</h2>
          <p>5</p>
        </div>
        <div className="card">
          <h2>Pedidos Pendentes</h2>
          <p>12</p>
        </div>
      </div>
      <div className="home-content">
        <div className="recent-activity">
          <h2>Atividades Recentes</h2>
          <ul>
            <li>Produto "Caneta Azul" adicionado ao estoque.</li>
            <li>Pedido #1234 foi enviado.</li>
            <li>Produto "Caderno" está em falta.</li>
          </ul>
        </div>
        <div className="quick-actions">
          <h2>Ações Rápidas</h2>
          <button>Adicionar Produto</button>
          <button>Ver Estoque</button>
          <button>Gerar Relatório</button>
        </div>
      </div>
    </div>
  );
}

export default Home;