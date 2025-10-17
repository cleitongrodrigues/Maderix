import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu deve ser usado dentro de um MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [estoqueOpen, setEstoqueOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const openEstoqueSubmenu = () => {
    if (!menuCollapsed) {
      setEstoqueOpen(true);
    }
  };

  const openFinanceiroSubmenu = () => {
    if (!menuCollapsed) {
      setFinanceiroOpen(true);
    }
  };

  const openConfigSubmenu = () => {
    if (!menuCollapsed) {
      setConfigOpen(true);
    }
  };

  const value = {
    estoqueOpen,
    setEstoqueOpen,
    financeiroOpen,
    setFinanceiroOpen,
    configOpen,
    setConfigOpen,
    menuCollapsed,
    setMenuCollapsed,
    openEstoqueSubmenu,
    openFinanceiroSubmenu,
    openConfigSubmenu
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
