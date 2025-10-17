import React, { useState, useEffect } from "react";
import PerfilForm from "./PerfilForm";
import { PERMISSIONS_META } from '../../utils/permissions';
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import SearchBar from "../../components/SearchBar/SearchBar";
import Highlight from "../../components/Highlight/Highlight";
import useDelayedLoader from "../../hooks/useDelayedLoader";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";
import "./Perfis.css";

const ITEMS_PER_PAGE = 10;

function generateMockPerfis(count = 6) {
  const base = [
    { ID_Perfil: 1, NM_Perfil: "Administrador", Permissoes: ["CLIENTES_MANAGE","USUARIOS_MANAGE","PERFIS_MANAGE","ESTOQUE_MANAGE","VENDAS_MANAGE"] },
    { ID_Perfil: 2, NM_Perfil: "Operador", Permissoes: ["CLIENTES_VIEW","ESTOQUE_MOV","VENDAS_VIEW"] },
    { ID_Perfil: 3, NM_Perfil: "Conferente", Permissoes: ["ESTOQUE_VIEW","ESTOQUE_MOV"] },
  ];
  return Array.from({ length: count }).map((_, i) => ({ ...base[i % base.length], ID_Perfil: i + 1 }));
}

function Perfis() {
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isPermsOpen, setIsPermsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPerfis() {
      try {
        const res = await fetch("/api/perfis");
        if (!res.ok) throw new Error("no-api");
        const data = await res.json();
        if (Array.isArray(data) && data.length) setPerfis(data);
        else setPerfis(generateMockPerfis(6));
      } catch (err) {
        setPerfis(generateMockPerfis(6));
      } finally {
        setLoading(false);
      }
    }
    fetchPerfis();
  }, []);

  // Filtrar perfis pela busca
  const filtered = perfis.filter((p) => {
    const nome = (p.NM_Perfil ?? p.nome ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return nome.includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filtered.slice(startIndex, startIndex + pageSize);

  const openCreate = () => { setEditing(null); setIsFormOpen(true); };
  const handleEdit = (p) => { setEditing(p); setIsFormOpen(true); };

  // Calcular estatísticas
  const totalPermissoes = Array.from(new Set(perfis.flatMap(p => p.Permissoes || []))).length;
  const mediaPermissoesPorPerfil = perfis.length > 0 
    ? Math.round(perfis.reduce((acc, p) => acc + (p.Permissoes?.length || 0), 0) / perfis.length) 
    : 0;

  const handleSave = (saved) => {
    setPerfis((prev) => {
      const exists = prev.find((x) => (x.ID_Perfil ?? x.id) === (saved.ID_Perfil ?? saved.id));
      if (exists) return prev.map((x) => ((x.ID_Perfil ?? x.id) === (saved.ID_Perfil ?? saved.id) ? { ...x, ...saved } : x));
      return [saved, ...prev];
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirma exclusão do perfil?')) return;
    fetch(`/api/perfis/${id}`, { method: 'DELETE' }).then(() => {
      setPerfis((s) => s.filter((p) => (p.ID_Perfil ?? p.id) !== id));
    }).catch(() => {
      setPerfis((s) => s.filter((p) => (p.ID_Perfil ?? p.id) !== id));
    });
  };

  const goToPage = (p) => { if (p < 1 || p > totalPages) return; setCurrentPage(p); };

  return (
    <div className="page perfis-page">
      <div className="perfis-container">
        <div className="perfis-cabecalho-fixo">
          <div className="cabecalho-pagina">
            <div className="titulo-perfis">
              <h1>🛡️ Perfis de Acesso</h1>
            {useDelayedLoader(loading, { delay: 200 }) && <InlineSpinner />}
          </div>
          <div className="acoes-pagina">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Buscar por nome do perfil..."
            />
            <button className="btn-primary btn-icon" onClick={openCreate}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
              Novo Perfil
            </button>
          </div>
        </div>

        {/* Cards informativos */}
        <div className="summary-row card">
          <div className="card-summary">
            <div className="card-icon">📊</div>
            <div className="card-info">
              <h3>Total de Perfis</h3>
              <p>{perfis.length}</p>
            </div>
          </div>
          <div className="card-summary">
            <div className="card-icon">🔐</div>
            <div className="card-info">
              <h3>Permissões Únicas</h3>
              <p>{totalPermissoes}</p>
            </div>
          </div>
          <div className="card-summary">
            <div className="card-icon">📈</div>
            <div className="card-info">
              <h3>Média de Permissões</h3>
              <p>{mediaPermissoesPorPerfil}</p>
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

      <div className="conteudo-pagina perfis-content">

        <div className="area-tabela card">
          {loading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <>
              <table className="tabela-perfis">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome do Perfil</th>
                    <th>Permissões</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                        {searchQuery ? '🔍 Nenhum perfil encontrado para sua busca.' : '📋 Nenhum perfil cadastrado ainda.'}
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((p) => (
                      <tr key={p.ID_Perfil ?? p.id}>
                        <td><Highlight text={String(p.ID_Perfil ?? p.id)} query={searchQuery} /></td>
                        <td>
                          <strong><Highlight text={p.NM_Perfil ?? p.nome} query={searchQuery} /></strong>
                        </td>
                        <td className="permissions-cell">
                          <div className="permissions-badges">
                            {(p.Permissoes || []).length === 0 ? (
                              <span className="no-permissions">Sem permissões</span>
                            ) : (
                              <>
                                {(p.Permissoes || []).slice(0, 3).map((perm) => (
                                  <span 
                                    key={perm} 
                                    className="permission-badge" 
                                    title={PERMISSIONS_META[perm]?.description ?? perm}
                                  >
                                    {PERMISSIONS_META[perm]?.label ?? perm}
                                  </span>
                                ))}
                                {(p.Permissoes || []).length > 3 && (
                                  <span className="permission-badge more-badge">
                                    +{(p.Permissoes || []).length - 3}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="celula-acoes">
                          <ActionButtons 
                            onEdit={() => handleEdit(p)} 
                            onDelete={() => handleDelete(p.ID_Perfil ?? p.id)} 
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {filtered.length > pageSize && (
                <Pagination
                  totalItems={filtered.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={(p) => setCurrentPage(p)}
                  showCount={true}
                />
              )}
            </>
          )}
        </div>
      </div>

      {isFormOpen && (
        <PerfilForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} initialData={editing} />
      )}

      {isPermsOpen && (
        <div className="modal-overlay" onClick={() => setIsPermsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h1>Permissões</h1>
              <button className="modal-close-btn" onClick={() => setIsPermsOpen(false)}>×</button>
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto', marginTop: 8 }}>
              <div className="permissions-grid all-perms">
                {Array.from(new Set(perfis.flatMap(p => p.Permissoes || []))).map((perm) => (
                  <span key={perm} className="perm-pill" title={PERMISSIONS_META[perm]?.description ?? ''}>{PERMISSIONS_META[perm]?.label ?? perm}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button onClick={() => setIsPermsOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
      </div> {/* Fecha perfis-container */}
    </div>
  );
}

export default Perfis;
