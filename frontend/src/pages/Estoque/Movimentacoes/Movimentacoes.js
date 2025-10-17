import React, { useState, useEffect } from "react";
import "./Movimentacoes.css";
import Pagination from "../../../components/Pagination/Pagination";
import ActionButtons from "../../../components/ActionButtons";
import sampleMovimentacoes from "./sampleMovimentacoes";
import MovimentacoesForm from "./MovimentacoesForm";

const USE_MOCK = true;
const PAGE_SIZE = 10;

function Movimentacoes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (USE_MOCK) {
      const stored = localStorage.getItem("mock_movimentacoes");
      if (stored) {
        try { setItems(JSON.parse(stored)); }
        catch (e) { setItems(sampleMovimentacoes); localStorage.setItem("mock_movimentacoes", JSON.stringify(sampleMovimentacoes)); }
      } else { setItems(sampleMovimentacoes); localStorage.setItem("mock_movimentacoes", JSON.stringify(sampleMovimentacoes)); }
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch('/api/estoque/movimentacoes');
        if (!res.ok) throw new Error('no-api');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : sampleMovimentacoes);
      } catch (err) {
        setItems(sampleMovimentacoes);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const openCreate = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (it) => { setEditing(it); setIsOpen(true); };

  const handleSave = (saved) => {
    if (USE_MOCK) {
      setItems(prev => {
        const sid = saved.ID_Mov ?? saved.id;
        if (sid) {
          const updated = prev.map(p => ((p.ID_Mov ?? p.id) === sid ? { ...p, ...saved } : p));
          localStorage.setItem('mock_movimentacoes', JSON.stringify(updated));
          return updated;
        }
        const maxId = prev.reduce((m, x) => Math.max(m, (x.ID_Mov ?? x.id) || 0), 0);
        const newItem = { ...saved, ID_Mov: maxId + 1, Data: saved.Data || new Date().toISOString() };
        const next = [newItem, ...prev]; localStorage.setItem('mock_movimentacoes', JSON.stringify(next)); return next;
      });
      return;
    }

    setItems(prev => {
      const exists = prev.find(p => (p.ID_Mov ?? p.id) === (saved.ID_Mov ?? saved.id));
      if (exists) return prev.map(p => ((p.ID_Mov ?? p.id) === (saved.ID_Mov ?? saved.id) ? { ...p, ...saved } : p));
      return [saved, ...prev];
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirma exclusão da movimentação?')) return;
    if (USE_MOCK) { setItems(prev => { const next = prev.filter(u => (u.ID_Mov ?? u.id) !== id); localStorage.setItem('mock_movimentacoes', JSON.stringify(next)); return next; }); return; }
    fetch(`/api/estoque/movimentacoes/${id}`, { method: 'DELETE' }).then(() => setItems(prev => prev.filter(u => (u.ID_Mov ?? u.id) !== id))).catch(() => {});
  };

  // filtering
  const lowered = filter.trim().toLowerCase();
  const filtered = lowered ? items.filter(i => (i.Produto || '').toLowerCase().includes(lowered) || (i.Usuario || '').toLowerCase().includes(lowered) || (i.Tipo || '').toLowerCase().includes(lowered)) : items;

  // summary
  const total = items.length;
  const entradas = items.filter(i => (i.Tipo || '').toLowerCase() === 'entrada').length;
  const saidas = items.filter(i => (i.Tipo || '').toLowerCase() === 'saída' || (i.Tipo || '').toLowerCase() === 'saida').length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  return (
    <div className="page movimentacoes-page">
      <div className="movimentacoes-container">
        <div className="movimentacoes-cabecalho-fixo">
          <div className="page-header">
            <h1>📊 Movimentações de Estoque</h1>
          <div className="page-actions">
            <input placeholder="Pesquisar por produto, usuário ou tipo" className="search-input header-search" value={filter} onChange={e => setFilter(e.target.value)} />
            <button className="btn-primary header-action-btn" onClick={openCreate}>Nova Movimentação</button>
          </div>
        </div>

        <div className="summary-row card">
          <div className="card-summary"><h3>Total</h3><p>{total}</p></div>
          <div className="card-summary"><h3>Entradas</h3><p>{entradas}</p></div>
          <div className="card-summary"><h3>Saídas</h3><p>{saidas}</p></div>
        </div>
      </div>

      <div className="card table-wrapper">
        {loading ? <div>Carregando...</div> : (
          <>
            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Data</th>
                  <th>Usuário</th>
                  <th>Observação</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="mensagem-vazia">
                      {filter ? (
                        <div className="empty-state">
                          <span className="empty-icon">🔍</span>
                          <p>Nenhuma movimentação encontrada</p>
                          <small>Tente buscar com outros termos</small>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <span className="empty-icon">📦</span>
                          <p>Nenhuma movimentação registrada</p>
                          <small>Clique em "Nova Movimentação" para registrar entrada ou saída de produtos</small>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  pageItems.map(it => (
                    <tr key={it.ID_Mov ?? it.id}>
                      <td>{it.ID_Mov ?? it.id}</td>
                      <td>{it.Tipo}</td>
                      <td>{it.Produto}</td>
                      <td>{it.Quantidade}</td>
                      <td>{it.Data ? new Date(it.Data).toLocaleDateString() : '-'}</td>
                      <td>{it.Usuario}</td>
                      <td className="cell-obs">{it.Observacao || '-'}</td>
                      <td className="actions-cell">
                        <div className="action-dropdown-container">
                          <ActionButtons onEdit={() => openEdit(it)} onDelete={() => handleDelete(it.ID_Mov ?? it.id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filtered.length > 0 && <Pagination totalItems={filtered.length} pageSize={PAGE_SIZE} currentPage={page} onPageChange={(p) => setPage(p)} showCount />}
          </>
        )}
      </div>
      </div> {/* Fecha movimentacoes-container */}

      {isOpen && <MovimentacoesForm isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={(s) => { handleSave(s); setIsOpen(false); }} initialData={editing} />}
    </div>
  );
}

export default Movimentacoes;
