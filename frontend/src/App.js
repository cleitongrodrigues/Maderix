import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Login from "./pages/Login/Login";
import Menu from "./pages/Menu/Menu";
import TopBar from "./components/TopBar/TopBar";
import CompanySelector from "./components/CompanySelector";
import AppRoutes from "./AppRoutes";
import { MenuProvider, useMenu } from "./contexts/MenuContext";
import { loadThemeFromStorage } from "./utils/themeManager";
import "./App.css";

function App() {
  const location = useLocation();
  const { menuCollapsed, setMenuCollapsed } = useMenu();
  const [companySelectorOpen, setCompanySelectorOpen] = useState(false);
  const [empresaAtual, setEmpresaAtual] = useState({ nome: 'Maderix Móveis Ltda', estado: 'SP' });

  // Carrega o tema personalizado ao iniciar
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  const handleSelectCompany = (empresa) => {
    setEmpresaAtual(empresa);
    setCompanySelectorOpen(false);
  };

  // Verifica se está na rota de login
  const isLoginPage = location.pathname === "/";

  return isLoginPage ? (
    // Renderiza apenas o login sem o layout geral
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  ) : (
    // Renderiza o layout geral com o menu e conteúdo
    <>
      <div className={`app-layout ${menuCollapsed ? 'menu-collapsed' : ''}`}>
        <TopBar 
          menuCollapsed={menuCollapsed} 
          onToggleMenu={() => setMenuCollapsed(!menuCollapsed)}
          empresaAtual={empresaAtual}
          onOpenCompanySelector={() => setCompanySelectorOpen(true)}
        />
        <aside className="sidebar">
          <Menu onToggleCollapse={setMenuCollapsed} />
        </aside>
        <main className={`content ${menuCollapsed ? 'content-expanded' : ''}`}>
          <AppRoutes />
        </main>
      </div>

      {/* Modal de Seleção de Empresa */}
      <CompanySelector 
        isOpen={companySelectorOpen}
        onClose={() => setCompanySelectorOpen(false)}
        onSelectCompany={handleSelectCompany}
      />
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <MenuProvider>
        <App />
      </MenuProvider>
    </Router>
  );
}