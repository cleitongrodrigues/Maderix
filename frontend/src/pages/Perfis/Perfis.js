import React, { useState, useEffect } from "react";
import PerfilForm from "./PerfilForm";
import { PERMISSIONS_META } from '../../utils/permissions';
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
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

  const totalPages = Math.max(1, Math.ceil(perfis.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = perfis.slice(startIndex, startIndex + pageSize);

  const openCreate = () => { setEditing(null); setIsFormOpen(true); };
  const handleEdit = (p) => { setEditing(p); setIsFormOpen(true); };

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
    <div className="pagina perfis-page">
      <div className="cabecalho-pagina">
        <h1>Perfis</h1>
        <div className="acoes-pagina">
          <button onClick={openCreate}>Novo Perfil</button>
        </div>
      </div>

      <div className="conteudo-pagina perfis-content">
        <div className="linha-resumo">
          <div className="card-summary">
            <h3>Total</h3>
            <p>{perfis.length}</p>
          </div>
          <div className="card-summary">
            <h3>Permissões distintas</h3>
            <p>
              <div className="permissions-summary">
                {Array.from(new Set(perfis.flatMap(p => p.Permissoes || []))).slice(0,6).map((perm) => (
                  <span key={perm} className="perm-pill" title={PERMISSIONS_META[perm]?.description ?? ''}>{PERMISSIONS_META[perm]?.label ?? perm}</span>
                ))}
                {Array.from(new Set(perfis.flatMap(p => p.Permissoes || []))).length > 6 && (
                  <button className="link-button" onClick={() => setIsPermsOpen(true)}>ver mais</button>
                )}
              </div>
            </p>
          </div>
        </div>

        <div className="area-tabela card">
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <>
              <table className="tabela-perfis">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Permissões</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((p) => (
                    <tr key={p.ID_Perfil ?? p.id}>
                      <td>{p.ID_Perfil ?? p.id}</td>
                      <td>{p.NM_Perfil ?? p.nome}</td>
                      <td className="permissions-cell">{(p.Permissoes || []).join(', ') || '-'}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <ActionButtons onEdit={() => handleEdit(p)} onDelete={() => handleDelete(p.ID_Perfil ?? p.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {perfis.length > 0 && (
                <Pagination
                  totalItems={perfis.length}
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
    </div>
  );
}

export default Perfis;
