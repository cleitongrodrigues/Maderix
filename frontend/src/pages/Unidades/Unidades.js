import React, { useState, useEffect } from "react";
import "./Unidades.css";
import UnidadeForm from "./UnidadeForm";
import sampleUnidades from "./sampleUnidades";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";

const USE_MOCK = true;
const PAGE_SIZE = 10;

function Unidades() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('mock_unidades');
      if (stored) {
        try { setUnidades(JSON.parse(stored)); }
        catch (e) { setUnidades(sampleUnidades); localStorage.setItem('mock_unidades', JSON.stringify(sampleUnidades)); }
      } else { setUnidades(sampleUnidades); localStorage.setItem('mock_unidades', JSON.stringify(sampleUnidades)); }
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch('/api/unidades');
        if (!res.ok) throw new Error('no-api');
        const data = await res.json();
        setUnidades(Array.isArray(data) ? data : sampleUnidades);
      } catch (err) { setUnidades(sampleUnidades); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const openCreate = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (u) => { setEditing(u); setIsOpen(true); };

  const handleSave = (saved) => {
    if (USE_MOCK) {
      setUnidades(prev => {
        const idKey = 'ID_Unidade';
        const sid = saved[idKey] ?? saved.id;
        if (sid) {
          const updated = prev.map(p => ((p.ID_Unidade ?? p.id) === sid ? { ...p, ...saved } : p));
          localStorage.setItem('mock_unidades', JSON.stringify(updated));
          return updated;
        }
        const maxId = prev.reduce((m, x) => Math.max(m, (x.ID_Unidade ?? x.id) || 0), 0);
        const newItem = { ...saved, ID_Unidade: maxId + 1, DT_Cad_Unidade: new Date().toISOString() };
        const next = [newItem, ...prev];
        localStorage.setItem('mock_unidades', JSON.stringify(next));
        return next;
      });
      return;
    }
    setUnidades(prev => {
      const exists = prev.find(p => (p.ID_Unidade ?? p.id) === (saved.ID_Unidade ?? saved.id));
      if (exists) return prev.map(p => ((p.ID_Unidade ?? p.id) === (saved.ID_Unidade ?? saved.id) ? { ...p, ...saved } : p));
      return [saved, ...prev];
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirma exclusão da unidade?')) return;
    if (USE_MOCK) {
      setUnidades(prev => { const next = prev.filter(u => (u.ID_Unidade ?? u.id) !== id); localStorage.setItem('mock_unidades', JSON.stringify(next)); return next; });
      return;
    }
    fetch(`/api/unidades/${id}`, { method: 'DELETE' }).then(() => setUnidades(prev => prev.filter(u => (u.ID_Unidade ?? u.id) !== id))).catch(() => {});
  };

  const totalPages = Math.max(1, Math.ceil(unidades.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = unidades.slice(start, start + PAGE_SIZE);

  return (
    <div className="pagina unidades-page">
      <div className="cabecalho-pagina">
        <h1>Unidades</h1>
        <div className="acoes-pagina"><button onClick={openCreate}>Nova Unidade</button></div>
      </div>

      <div className="area-tabela card">
        {loading ? <div>Carregando...</div> : (
          <>
            <table className="tabela-unidades">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sigla</th>
                  <th>Descrição</th>
                  <th>DT_Cad</th>
                  <th className="col-acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(u => (
                  <tr key={u.ID_Unidade ?? u.id}>
                    <td>{u.ID_Unidade ?? u.id}</td>
                    <td>{u.Sigla}</td>
                    <td>{u.Descricao}</td>
                    <td>{u.DT_Cad_Unidade ? new Date(u.DT_Cad_Unidade).toLocaleDateString() : '-'}</td>
                    <td className="celula-acoes">
                      <div className="botoes-acao">
                        <ActionButtons onEdit={() => openEdit(u)} onDelete={() => handleDelete(u.ID_Unidade ?? u.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {unidades.length > 0 && (
              <Pagination totalItems={unidades.length} pageSize={PAGE_SIZE} currentPage={page} onPageChange={(p) => setPage(p)} showCount />
            )}
          </>
        )}
      </div>

      {isOpen && <UnidadeForm isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={(s) => { handleSave(s); setIsOpen(false); }} initialData={editing} />}
    </div>
  );
}

export default Unidades;
