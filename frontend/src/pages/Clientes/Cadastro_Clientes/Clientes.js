import React, { useState, useEffect, useCallback } from "react";
import "./Clientes.css";
import ClienteForm from "./ClienteForm";
import Pagination from "../../../components/Pagination/Pagination";
import ActionButtons from "../../../components/ActionButtons";

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

  const totalPages = Math.max(1, Math.ceil(clientes.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClients = clientes.slice(startIndex, endIndex);

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
        <h1>Clientes</h1>

        {isMock && (
          <div style={{ marginBottom: 8, color: "#666" }}>
            Exibindo dados fictícios (apenas para visualização). Integre o backend para ver dados reais.
          </div>
        )}

        {/* Resumo Rápido full-width acima da lista */}
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

        <div className="page-actions" style={{ marginBottom: 12 }}>
          <button className="btn-primary" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>Novo Cliente</button>
        </div>
      </div>

      <div className="home-content">
        <div className="product-list-block recent-activity">

          {loading ? (
            <div>Carregando clientes...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="card table-wrapper">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Data de Cadastro</th>
                    <th className="col-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentClients.length === 0 ? (
                    <tr>
                      <td colSpan={6}>Nenhum cliente encontrado.</td>
                    </tr>
                  ) : (
                    currentClients.map((cliente) => {
                      const id = cliente.ID_Cliente ?? cliente.id ?? cliente.ID;
                      const nome = cliente.NM_Cliente ?? cliente.nome ?? cliente.name;
                      const tel = cliente.Tel_Cliente ?? cliente.tel ?? cliente.telefone ?? "";
                      const email = cliente.Email ?? cliente.email ?? "";
                      const dt = cliente.DT_Cad_Cliente ?? cliente.dtCadCliente ?? cliente.createdAt ?? "";

                      return (
                        <tr key={id}>
                          <td>{id}</td>
                          <td>{nome}</td>
                          <td>{tel}</td>
                          <td>{email}</td>
                          <td>{dt ? new Date(dt).toLocaleString() : ""}</td>
                          <td className="actions-cell">
                              <div className="action-buttons">
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

          {clientes.length > 0 && (
            <Pagination
              totalItems={clientes.length}
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