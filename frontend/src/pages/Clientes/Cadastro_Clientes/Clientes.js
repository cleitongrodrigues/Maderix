import React, { useState, useEffect, useCallback } from "react";
import "./Clientes.css";
import ClienteForm from "./ClienteForm";
import Pagination from "../../../components/Pagination/Pagination";
import ActionButtons from "../../../components/ActionButtons";
import useDelayedLoader from "../../../hooks/useDelayedLoader";
import InlineSpinner from "../../../components/InlineSpinner/InlineSpinner";
import TableSkeleton from "../../../components/TableSkeleton/TableSkeleton";
import SearchBar from "../../../components/SearchBar/SearchBar";
import formatPhone from "../../../utils/formatPhone";
import Highlight from "../../../components/Highlight/Highlight";
import { clientesAPI } from "../../../services/api";

const ITEMS_PER_PAGE = 10;

function generateMockClientes(count = 30) {
  const lista = [];
  for (let i = 1; i <= count; i++) {
    const id = i;
    const nome = `Cliente ${i}`;
    const tel = `(11) 9${String(10000000 + i).slice(-8, -0)}`; // gera números variados
    const email = `cliente${i}@exemplo.com`;
    const dt = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
    lista.push({ ID_Cliente: id, NM_Cliente: nome, Tel_Cliente: tel, Email: email, DT_Cad_Cliente: dt });
  }
  return lista;
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsMock(false);
    try {
      console.log("🔵 Buscando clientes da API...");
      const data = await clientesAPI.listar();
      console.log("✅ Clientes carregados:", data.length);
      setClientes(data);
    } catch (err) {
      console.error("❌ Erro ao buscar clientes:", err);
      setError("Erro ao carregar clientes: " + (err.message || "Erro desconhecido"));
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const showLoader = useDelayedLoader(loading, { delay: 200 });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clientes.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const id = String(c.idCliente ?? c.ID_Cliente ?? "").toLowerCase();
    const nome = (c.nmCliente ?? c.NM_Cliente ?? "").toLowerCase();
    const email = (c.email ?? c.Email ?? "").toLowerCase();
    return id.includes(q) || nome.includes(q) || email.includes(q);
  });

  // reset to first page when search changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const filteredCurrent = filteredClients.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleMenu = useCallback((id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const handleEdit = (id) => {
    const found = clientes.find((c) => (c.idCliente ?? c.ID_Cliente) === id);
    setEditingItem(found || null);
    setIsFormOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!ok) {
      setOpenMenuId(null);
      return;
    }

    try {
      console.log("🔵 Excluindo cliente ID:", id);
      await clientesAPI.deletar(id);
      console.log("✅ Cliente excluído com sucesso");
      setClientes((prev) => prev.filter((c) => (c.idCliente ?? c.ID_Cliente) !== id));
      alert("Cliente excluído com sucesso.");
    } catch (err) {
      console.error("❌ Erro ao excluir cliente:", err);
      alert("Erro ao excluir cliente: " + (err.message || "Erro desconhecido"));
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleSave = (saved) => {
    // Atualiza lista local com o item salvo (criação ou edição)
    const id = saved.idCliente ?? saved.ID_Cliente;
    setClientes((prev) => {
      const exists = prev.some((c) => (c.idCliente ?? c.ID_Cliente) === id);
      if (exists) {
        return prev.map((c) => ((c.idCliente ?? c.ID_Cliente) === id ? saved : c));
      }
      return [saved, ...prev];
    });
  };

  // Handlers para cards de resumo - preparados para navegação a relatórios
  const handleCardClick = (cardType) => {
    // TODO: Implementar navegação para tela de relatórios
    // Quando a tela de relatórios for criada, descomentar uma das opções abaixo:
    
    // Opção 1: Usando React Router
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // if (cardType === 'total') {
    //   navigate('/relatorios?tipo=todos-clientes');
    // } else if (cardType === 'recentes') {
    //   navigate('/relatorios?tipo=clientes-recentes');
    // }
    
    // Opção 2: Filtrar tabela atual (solução temporária)
    // if (cardType === 'recentes') {
    //   // Filtrar para mostrar apenas últimos 7 dias
    //   console.log('Filtrar para últimos 7 dias');
    // } else if (cardType === 'total') {
    //   // Remover filtros
    //   console.log('Mostrar todos');
    // }
    
    console.log(`Card clicado: ${cardType}`);
    alert(`Funcionalidade em desenvolvimento!\n\nEste card redirecionará para a tela de relatórios quando implementada.\n\nTipo: ${cardType === 'total' ? 'Todos os Clientes' : 'Clientes Recentes (7 dias)'}`);
  };

  return (
    <div className="clientes-page">
      <div className="clientes-container">
        <div className="clientes-cabecalho-fixo">
          <div className="titulo-clientes">
            <h1>👥 CLIENTES</h1>
          </div>
          <div className="summary-row card">
          <div 
            className="card-summary clickable" 
            onClick={() => handleCardClick('total')}
            title="Clique para ver relatório completo"
          >
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>Total de Clientes</h3>
              <p>{clientes.length}</p>
            </div>
          </div>
          <div 
            className="card-summary clickable" 
            onClick={() => handleCardClick('recentes')}
            title="Clique para ver relatório de clientes recentes"
          >
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Clientes últimos 7 dias</h3>
              <p>{clientes.filter(c => {
                const dt = new Date(c.dataCadCliente ?? c.DT_Cad_Cliente ?? null);
                if (!dt || isNaN(dt)) return false;
                const diff = (Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24);
                return diff <= 7;
              }).length}</p>
            </div>
          </div>
        </div>
        <div className="acoes-pagina">
          <SearchBar value={searchQuery} onChange={setSearchQuery} inputClassName="header-search" />
          <div style={{ marginLeft: 12 }}>
            <button className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>
              <span className="btn-icon">+</span> Novo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="conteudo-pagina">
        <div className="bloco-lista atividade-recente">
          

          {loading ? (
            // layout: ID (0.6), Nome (2), Tel (1), Email (1.5), Data (1), Ações (0.8)
            <TableSkeleton rows={8} layout={[0.6,2,1,1.5,1,0.8]} />
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="card area-tabela">
              <table className="tabela-clientes">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Data de Cadastro</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCurrent.length === 0 ? (
                    <tr>
                      <td colSpan={6}>Nenhum cliente encontrado.</td>
                    </tr>
                  ) : (
                    filteredCurrent.map((cliente) => {
                      const id = cliente.idCliente ?? cliente.ID_Cliente;
                      const nome = cliente.nmCliente ?? cliente.NM_Cliente;
                      const tel = cliente.telCliente ?? cliente.Tel_Cliente ?? "";
                      const email = cliente.email ?? cliente.Email ?? "";
                      const dt = cliente.dataCadCliente ?? cliente.DT_Cad_Cliente ?? "";

                      return (
                        <tr key={id}>
                          <td><Highlight text={String(id)} query={searchQuery} /></td>
                          <td><Highlight text={nome} query={searchQuery} /></td>
                          <td>{formatPhone(tel)}</td>
                          <td><Highlight text={email} query={searchQuery} /></td>
                          <td>{dt ? new Date(dt).toLocaleString() : ""}</td>
                          <td className="celula-acoes">
                              <div className="botoes-acao">
                                <ActionButtons onEdit={() => handleEdit(id)} onDelete={() => handleDelete(id)} />
                              </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {filteredClients.length > 0 && (
            <Pagination
              totalItems={filteredClients.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={(p) => setCurrentPage(p)}
              showCount={true}
            />
          )}
        </div>
      </div>
      </div> {/* Fecha clientes-container */}

      <ClienteForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}

export default Clientes;