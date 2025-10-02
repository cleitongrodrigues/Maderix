import React from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {
  return (
    <div className="menu">
      <h1>Menu</h1>
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Home
      </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Clientes
      </NavLink>
      <NavLink to="/estoque" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Estoque
      </NavLink>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Sair
      </NavLink>
    </div>
  );
}

export default Menu;