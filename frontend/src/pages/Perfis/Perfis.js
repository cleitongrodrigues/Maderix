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
import { perfisAPI } from "../../services/api";
import "./Perfis.css";

const ITEMS_PER_PAGE = 10;

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
        console.log("🔵 Buscando perfis...");
        const data = await perfisAPI.listar();
        console.log("✅ Perfis carregados:", data);
        setPerfis(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erro ao buscar perfis:", err);
        setPerfis([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPerfis();
  }, []);

  // Filtrar perfis pela busca
  const filtered = perfis.filter((p) => {
    const nome = (p.nmPerfil ?? p.NM_Perfil ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return nome.includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filtered.slice(startIndex, startIndex + pageSize);

  const openCreate = () => { setEditing(null); setIsFormOpen(true); };
  const handleEdit = (p) => { setEditing(p); setIsFormOpen(true); };

  // Calcular estatísticas
  const totalPermissoes = Array.from(new Set(perfis.flatMap(p => p.permissoes || p.Permissoes || []))).length;
  const mediaPermissoesPorPerfil = perfis.length > 0 
    ? Math.round(perfis.reduce((acc, p) => acc + ((p.permissoes?.length ?? p.Permissoes?.length) || 0), 0) / perfis.length) 
    : 0;

  const handleSave = (saved) => {
    console.log("🔵 Perfil salvo, atualizando lista:", saved);
    setPerfis((prev) => {
      const id = saved.idPerfil ?? saved.ID_Perfil;
      const exists = prev.find((x) => (x.idPerfil ?? x.ID_Perfil) === id);
      if (exists) {
        return prev.map((x) => ((x.idPerfil ?? x.ID_Perfil) === id ? { ...x, ...saved } : x));
      }
      return [saved, ...prev];
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão do perfil?')) return;
    try {
      console.log("🔵 Deletando perfil:", id);
      await perfisAPI.deletar(id);
      console.log("✅ Perfil deletado com sucesso");
      setPerfis((prev) => prev.filter((p) => (p.idPerfil ?? p.ID_Perfil) !== id));
      alert("Perfil excluído com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao deletar perfil:", err);
      alert("Erro ao excluir perfil: " + (err.message || "Erro desconhecido"));
    }
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
                      <tr key={p.idPerfil ?? p.ID_Perfil}>
                        <td><Highlight text={String(p.idPerfil ?? p.ID_Perfil)} query={searchQuery} /></td>
                        <td>
                          <strong><Highlight text={p.nmPerfil ?? p.NM_Perfil} query={searchQuery} /></strong>
                        </td>
                        <td className="permissions-cell">
                          <div className="permissions-badges">
                            {((p.permissoes ?? p.Permissoes) || []).length === 0 ? (
                              <span className="no-permissions">Sem permissões</span>
                            ) : (
                              <>
                                {((p.permissoes ?? p.Permissoes) || []).slice(0, 3).map((perm) => (
                                  <span 
                                    key={perm.idPermissoes ?? perm} 
                                    className="permission-badge" 
                                    title={PERMISSIONS_META[perm.nmPermissoes ?? perm]?.description ?? (perm.nmPermissoes ?? perm)}
                                  >
                                    {PERMISSIONS_META[perm.nmPermissoes ?? perm]?.label ?? (perm.nmPermissoes ?? perm)}
                                  </span>
                                ))}
                                {((p.permissoes ?? p.Permissoes) || []).length > 3 && (
                                  <span className="permission-badge more-badge">
                                    +{((p.permissoes ?? p.Permissoes) || []).length - 3}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="celula-acoes">
                          <ActionButtons 
                            onEdit={() => handleEdit(p)} 
                            onDelete={() => handleDelete(p.idPerfil ?? p.ID_Perfil)} 
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
                {Array.from(new Set(perfis.flatMap(p => (p.permissoes ?? p.Permissoes) || []))).map((perm) => (
                  <span key={perm.idPermissoes ?? perm} className="perm-pill" title={PERMISSIONS_META[perm.nmPermissoes ?? perm]?.description ?? ''}>
                    {PERMISSIONS_META[perm.nmPermissoes ?? perm]?.label ?? (perm.nmPermissoes ?? perm)}
                  </span>
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
