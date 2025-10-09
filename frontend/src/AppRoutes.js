import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Estoque from "./pages/Produto/Estoque/Estoque";
import Produto from "./pages/Produto/Cadastro_Produto/Produto";
import Clientes from "./pages/Clientes/Cadastro_Clientes/Clientes";
import Vendas from "./pages/Vendas/Vendas";
import NovaVenda from "./pages/Vendas/NovaVenda/NovaVenda";
import Movimentacoes from "./pages/Estoque/Movimentacoes/Movimentacoes";
import ContasReceber from "./pages/Contas/ContasReceber";
import Empresa from "./pages/Empresa/Empresa";
import Usuarios from "./pages/Usuarios/Usuarios";
import Perfis from "./pages/Perfis/Perfis";
import Unidades from "./pages/Unidades/Unidades";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/produto" element={<Produto />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/vendas" element={<Vendas />} />
      <Route path="/vendas/new" element={<NovaVenda />} />
      <Route path="/estoque/movimentacoes" element={<Movimentacoes />} />
      <Route path="/contas" element={<ContasReceber />} />
      <Route path="/empresas" element={<Empresa />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/perfis" element={<Perfis />} />
      <Route path="/unidades" element={<Unidades />} />
    </Routes>
  );
}
