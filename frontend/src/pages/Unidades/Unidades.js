import React, { useState, useEffect } from "react";
import "./Unidades.css";
import UnidadeForm from "./UnidadeForm";
import sampleUnidades from "./sampleUnidades";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import SearchBar from "../../components/SearchBar/SearchBar";
import Highlight from "../../components/Highlight/Highlight";
import useDelayedLoader from "../../hooks/useDelayedLoader";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";

const USE_MOCK = true;
const PAGE_SIZE = 10;

function Unidades() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filtrar unidades pela busca
  const filtered = unidades.filter((u) => {
    const sigla = (u.Sigla ?? "").toLowerCase();
    const descricao = (u.Descricao ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return sigla.includes(query) || descricao.includes(query);
  });

  // Calcular estatísticas
  const totalUnidades = unidades.length;
  const unidadesComDescricao = unidades.filter(u => u.Descricao && u.Descricao.trim()).length;
  const unidadesRecentes = unidades.filter(u => {
    if (!u.DT_Cad_Unidade) return false;
    const diffDays = Math.floor((Date.now() - new Date(u.DT_Cad_Unidade)) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="page unidades-page">
      <div className="unidades-container">
        <div className="unidades-cabecalho-fixo">
          <div className="cabecalho-pagina">
            <div className="titulo-unidades">
              <h1>📏 Unidades de Medida</h1>
            {useDelayedLoader(loading, { delay: 200 }) && <InlineSpinner />}
          </div>
          <div className="acoes-pagina">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Buscar por sigla ou descrição..."
            />
            <button className="btn-primary btn-icon" onClick={openCreate}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
              Nova Unidade
            </button>
          </div>
        </div>

        {/* Cards informativos */}
        <div className="summary-row card">
          <div className="card-summary">
            <div className="card-icon">📊</div>
            <div className="card-info">
              <h3>Total de Unidades</h3>
              <p>{totalUnidades}</p>
            </div>
          </div>
          <div className="card-summary">
            <div className="card-icon">📝</div>
            <div className="card-info">
              <h3>Com Descrição</h3>
              <p>{unidadesComDescricao}</p>
            </div>
          </div>
          <div className="card-summary">
            <div className="card-icon">🆕</div>
            <div className="card-info">
              <h3>Recentes (30 dias)</h3>
              <p>{unidadesRecentes}</p>
            </div>
          </div>
          <div className="card-summary">
            <div className="card-icon">🔍</div>
            <div className="card-info">
              <h3>Resultados</h3>
              <p>{filtered.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="conteudo-pagina">
        <div className="area-tabela card">
          {loading ? (
            <TableSkeleton rows={7} columns={5} />
          ) : (
            <>
              <table className="tabela-unidades">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sigla</th>
                    <th>Descrição</th>
                    <th>Data de Cadastro</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                        {searchQuery ? '🔍 Nenhuma unidade encontrada para sua busca.' : '📋 Nenhuma unidade cadastrada ainda.'}
                      </td>
                    </tr>
                  ) : (
                    pageItems.map(u => (
                      <tr key={u.ID_Unidade ?? u.id}>
                        <td><Highlight text={String(u.ID_Unidade ?? u.id)} query={searchQuery} /></td>
                        <td>
                          <span className="sigla-badge">
                            <Highlight text={u.Sigla} query={searchQuery} />
                          </span>
                        </td>
                        <td>
                          <strong><Highlight text={u.Descricao || '-'} query={searchQuery} /></strong>
                        </td>
                        <td className="data-cell">
                          {u.DT_Cad_Unidade ? new Date(u.DT_Cad_Unidade).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="celula-acoes">
                          <ActionButtons 
                            onEdit={() => openEdit(u)} 
                            onDelete={() => handleDelete(u.ID_Unidade ?? u.id)} 
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {filtered.length > PAGE_SIZE && (
                <Pagination 
                  totalItems={filtered.length} 
                  pageSize={PAGE_SIZE} 
                  currentPage={page} 
                  onPageChange={(p) => setPage(p)} 
                  showCount 
                />
              )}
            </>
          )}
        </div>
      </div>
      </div> {/* Fecha unidades-container */}

      {isOpen && (
        <UnidadeForm 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          onSave={(s) => { handleSave(s); setIsOpen(false); }} 
          initialData={editing}
          existingUnidades={unidades}
        />
      )}
    </div>
  );
}

export default Unidades;
