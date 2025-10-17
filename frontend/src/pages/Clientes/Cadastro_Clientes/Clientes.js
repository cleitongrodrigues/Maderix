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
      const res = await fetch("/api/clientes");
      if (!res.ok) {
        // fallback para mock caso backend não responda corretamente
        console.warn("GET /api/clientes retornou status", res.status, "— carregando dados fictícios");
        const mock = generateMockClientes(30);
        setClientes(mock);
        setIsMock(true);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        // usa mock se retorno estiver vazio
        const mock = generateMockClientes(30);
        setClientes(mock);
        setIsMock(true);
      } else {
        setClientes(data);
      }
    } catch (err) {
      console.warn("Erro ao buscar clientes, usando dados fictícios:", err);
      setError(null);
      const mock = generateMockClientes(30);
      setClientes(mock);
      setIsMock(true);
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
    const id = String(c.ID_Cliente ?? c.id ?? c.ID ?? "").toLowerCase();
    const nome = (c.NM_Cliente ?? c.nome ?? c.name ?? "").toLowerCase();
    const email = (c.Email ?? c.email ?? "").toLowerCase();
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
    const found = clientes.find((c) => (c.ID_Cliente ?? c.id ?? c.ID) === id);
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

    // Tenta excluir no backend; se falhar, remove localmente
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setClientes((prev) => prev.filter((c) => (c.ID_Cliente ?? c.id ?? c.ID) !== id));
      alert("Cliente excluído com sucesso.");
    } catch (err) {
      // fallback: remover da lista local para efeito visual
      setClientes((prev) => prev.filter((c) => (c.ID_Cliente ?? c.id ?? c.ID) !== id));
      alert("Cliente removido localmente. Verifique o backend: " + (err.message || err));
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleSave = (saved) => {
    // Atualiza lista local com o item salvo (criação ou edição)
    const id = saved.ID_Cliente ?? saved.id ?? saved.ID;
    setClientes((prev) => {
      const exists = prev.some((c) => (c.ID_Cliente ?? c.id ?? c.ID) === id);
      if (exists) {
        return prev.map((c) => ((c.ID_Cliente ?? c.id ?? c.ID) === id ? saved : c));
      }
      return [saved, ...prev];
    });
  };

  return (
    <div className="clientes-page">
      <div className="clientes-cabecalho-fixo">
        <div className="titulo-clientes">
          <h1>CLIENTES</h1>
        </div>
        <div className="summary-row card">
          <div className="card-summary">
            <h3>Total de Clientes</h3>
            <p>{clientes.length}</p>
          </div>
          <div className="card-summary">
            <h3>Clientes últimos 7 dias</h3>
            <p>{clientes.filter(c => {
              const dt = new Date(c.DT_Cad_Cliente ?? c.dtCadCliente ?? c.createdAt ?? null);
              if (!dt || isNaN(dt)) return false;
              const diff = (Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24);
              return diff <= 7;
            }).length}</p>
          </div>
        </div>
        <div className="acoes-pagina">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div style={{ marginLeft: 12 }}>
            <button className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>Novo Cliente</button>
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
                      const id = cliente.ID_Cliente ?? cliente.id ?? cliente.ID;
                      const nome = cliente.NM_Cliente ?? cliente.nome ?? cliente.name;
                      const tel = cliente.Tel_Cliente ?? cliente.tel ?? cliente.telefone ?? "";
                      const email = cliente.Email ?? cliente.email ?? "";
                      const dt = cliente.DT_Cad_Cliente ?? cliente.dtCadCliente ?? cliente.createdAt ?? "";

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