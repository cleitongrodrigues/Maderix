import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {
  const [estoqueOpen, setEstoqueOpen] = useState(false);

  return (
    <div className="menu">
      <h1>Menu</h1>
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Home
      </NavLink>
      <NavLink to="/clientes" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Clientes
      </NavLink>

      {/* Estoque com submenu */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Clique em 'Estoque' agora alterna o submenu */}
          <NavLink
            to="/estoque"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => setEstoqueOpen((v) => !v)}
          >
            Estoque
          </NavLink>
        </div>

        {estoqueOpen && (
          <div className="submenu">
            <NavLink to="/estoque" end className={({ isActive }) => (isActive ? "active-link sub-active" : "sub-link")}>
              Lista de Estoque
            </NavLink>
            <NavLink to="/estoque/movimentacoes" end className={({ isActive }) => (isActive ? "active-link sub-active" : "sub-link")}>
              Movimentações
            </NavLink>
          </div>
        )}
      </div>

      <hr />

      <NavLink to="/vendas" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Vendas
      </NavLink>
      <NavLink to="/contas" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Contas a Receber
      </NavLink>
      <NavLink to="/empresas" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Empresas
      </NavLink>
      <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Usuários
      </NavLink>
      <NavLink to="/perfis" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Perfis
      </NavLink>
      <NavLink to="/unidades" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Unidades
      </NavLink>

      <hr />

      <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Sair
      </NavLink>
    </div>
  );
}

export default Menu;