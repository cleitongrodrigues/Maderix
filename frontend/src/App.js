import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Login from "./pages/Login/Login";
import Menu from "./pages/Menu/Menu";
import AppRoutes from "./AppRoutes";
import "./App.css";

function App() {
  const location = useLocation(); // Hook para obter a rota atual

  // Verifica se está na rota de login
  const isLoginPage = location.pathname === "/";

  return isLoginPage ? (
    // Renderiza apenas o login sem o layout geral
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  ) : (
    // Renderiza o layout geral com o menu e conteúdo
    <div className="app-layout">
      <aside className="sidebar">
        <Menu />
      </aside>
      <main className="content">
        <AppRoutes />
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}