import React, { useState, useEffect } from "react";
import "./ContasReceber.css";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import sampleContasReceber from "./sampleContasReceber";
import ContasReceberForm from "./ContasReceberForm";

const USE_MOCK = true;
const PAGE_SIZE = 10;

function ContasReceber() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('mock_contas_receber');
      if (stored) { try { setContas(JSON.parse(stored)); } catch (e) { setContas(sampleContasReceber); localStorage.setItem('mock_contas_receber', JSON.stringify(sampleContasReceber)); } }
      else { setContas(sampleContasReceber); localStorage.setItem('mock_contas_receber', JSON.stringify(sampleContasReceber)); }
      setLoading(false);
      return;
    }

    async function fetchData() {
      try { const res = await fetch('/api/contas/receber'); if (!res.ok) throw new Error('no-api'); const data = await res.json(); setContas(Array.isArray(data) ? data : sampleContasReceber); }
      catch (err) { setContas(sampleContasReceber); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const openCreate = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (c) => { setEditing(c); setIsOpen(true); };

  const handleSave = (saved) => {
    if (USE_MOCK) {
      setContas(prev => {
        const sid = saved.ID_Conta ?? saved.id;
        if (sid) {
          const updated = prev.map(p => ((p.ID_Conta ?? p.id) === sid ? { ...p, ...saved } : p));
          localStorage.setItem('mock_contas_receber', JSON.stringify(updated));
          return updated;
        }
        const maxId = prev.reduce((m, x) => Math.max(m, (x.ID_Conta ?? x.id) || 0), 0);
        const newItem = { ...saved, ID_Conta: maxId + 1, DT_Cad_Conta: new Date().toISOString(), Pago: false };
        const next = [newItem, ...prev]; localStorage.setItem('mock_contas_receber', JSON.stringify(next)); return next;
      });
      return;
    }
    setContas(prev => {
      const exists = prev.find(p => (p.ID_Conta ?? p.id) === (saved.ID_Conta ?? saved.id));
      if (exists) return prev.map(p => ((p.ID_Conta ?? p.id) === (saved.ID_Conta ?? saved.id) ? { ...p, ...saved } : p));
      return [saved, ...prev];
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirma exclusão da conta?')) return;
    if (USE_MOCK) { setContas(prev => { const next = prev.filter(u => (u.ID_Conta ?? u.id) !== id); localStorage.setItem('mock_contas_receber', JSON.stringify(next)); return next; }); return; }
    fetch(`/api/contas/${id}`, { method: 'DELETE' }).then(() => setContas(prev => prev.filter(u => (u.ID_Conta ?? u.id) !== id))).catch(() => {});
  };

  const togglePago = (c) => {
    const id = c.ID_Conta ?? c.id;
    const newVal = !c.Pago;
    setContas(prev => { const updated = prev.map(p => ((p.ID_Conta ?? p.id) === id ? { ...p, Pago: newVal } : p)); localStorage.setItem('mock_contas_receber', JSON.stringify(updated)); return updated; });
    if (!USE_MOCK) fetch(`/api/contas/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Pago: newVal }) }).catch(() => {});
  };

  // summary stats
  const total = contas.length;
  const abertas = contas.filter(c => !c.Pago).length;
  const vencidas = contas.filter(c => !c.Pago && c.Vencimento && new Date(c.Vencimento) < new Date()).length;

  const totalPages = Math.max(1, Math.ceil(contas.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = contas.slice(start, start + PAGE_SIZE);

  return (
    <div className="page contas-page">
      <div className="page-header"><h1>Contas a Receber</h1><div className="page-actions"><button onClick={openCreate}>Nova Conta</button></div></div>

      <div className="summary-row card">
        <div className="card-summary"><h3>Total</h3><p>{total}</p></div>
        <div className="card-summary"><h3>Vencidas</h3><p>{vencidas}</p></div>
        <div className="card-summary"><h3>Abertas</h3><p>{abertas}</p></div>
      </div>

      <div className="card table-wrapper">
        {loading ? <div>Carregando...</div> : (
          <>
            <table className="clients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Pago</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(c => (
                  <tr key={c.ID_Conta ?? c.id}>
                    <td>{c.ID_Conta ?? c.id}</td>
                    <td>{c.Numero}</td>
                    <td>{c.Cliente}</td>
                    <td>{typeof c.Valor === 'number' ? c.Valor.toFixed(2) : c.Valor}</td>
                    <td>{c.Vencimento ? new Date(c.Vencimento).toLocaleDateString() : '-'}</td>
                    <td>{c.Pago ? 'Sim' : 'Não'}</td>
                    <td className="actions-cell">
                      <div className="action-btns-group">
                        <ActionButtons onEdit={() => openEdit(c)} onDelete={() => handleDelete(c.ID_Conta ?? c.id)} />
                      </div>
                      <div className="toggle-group">
                        <button
                          className="btn-action-trigger toggle-btn"
                          onClick={() => togglePago(c)}
                          title={c.Pago ? 'Marcar Não Pago' : 'Marcar Pago'}
                          aria-label={c.Pago ? 'Marcar Não Pago' : 'Marcar Pago'}
                        >
                          {c.Pago ? 'Paga' : 'Pagar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {contas.length > 0 && <Pagination totalItems={contas.length} pageSize={PAGE_SIZE} currentPage={page} onPageChange={(p) => setPage(p)} showCount />}
          </>
        )}
      </div>

      {isOpen && <ContasReceberForm isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={(s) => { handleSave(s); setIsOpen(false); }} initialData={editing} />}
    </div>
  );
}

export default ContasReceber;
