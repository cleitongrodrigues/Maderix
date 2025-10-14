import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import ChangePasswordModal from "./ChangePasswordModal";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import sampleUsuarios from "./sampleUsuarios";
import "./Usuarios.css";
import useDelayedLoader from "../../hooks/useDelayedLoader";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";
import SearchBar from "../../components/SearchBar/SearchBar";
import Highlight from "../../components/Highlight/Highlight";


const USE_MOCK = true;
const ITEMS_PER_PAGE = 10;

function generateMockUsuarios(count = 30) {
  const perfis = ["Admin", "Operador", "Conferente"];
  return Array.from({ length: count }, (_, i) => ({
    ID_Usuario: i + 1,
    NM_Usuario: `Usuário ${i + 1}`,
    Login: `user${i + 1}`,
    Email: `user${i + 1}@exemplo.com`,
    Tel_Usuario: `(11) 9${String(100000000 + i).slice(1)}`,
    ID_Perfil: (i % perfis.length) + 1,
    PerfilNome: perfis[i % perfis.length],
    Ativo: i % 4 !== 0,
    DT_Cad_Usuario: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isPwdOpen, setIsPwdOpen] = useState(false);
  const [pwdTarget, setPwdTarget] = useState(null);

  useEffect(() => {
    async function fetchUsuarios() {
      if (USE_MOCK) {
        // load from localStorage if present, otherwise use sample data
        const stored = localStorage.getItem("mock_usuarios");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUsuarios(parsed);
          } catch (e) {
            setUsuarios(sampleUsuarios);
            localStorage.setItem("mock_usuarios", JSON.stringify(sampleUsuarios));
          }
        } else {
          setUsuarios(sampleUsuarios);
          localStorage.setItem("mock_usuarios", JSON.stringify(sampleUsuarios));
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/usuarios");
        if (!res.ok) throw new Error("no-api");
        const data = await res.json();
        if (Array.isArray(data) && data.length) setUsuarios(data);
        else setUsuarios(sampleUsuarios);
      } catch (err) {
        setUsuarios(sampleUsuarios);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  const totalPages = Math.max(1, Math.ceil(usuarios.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = usuarios.slice(startIndex, startIndex + pageSize);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = usuarios.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (String(u.ID_Usuario ?? u.id ?? "").toLowerCase().includes(q) ||
      (u.NM_Usuario ?? u.nome ?? "").toLowerCase().includes(q) ||
      (u.Login ?? "").toLowerCase().includes(q) ||
      (u.Email ?? "").toLowerCase().includes(q)
    );
  });

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const totalPagesFiltered = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndexFiltered = (currentPage - 1) * pageSize;
  const currentItemsFiltered = filtered.slice(startIndexFiltered, startIndexFiltered + pageSize);

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (u) => {
    setEditing(u);
    setIsFormOpen(true);
  };

  const handleSave = (saved) => {
    // saved is the user object returned from form
    if (USE_MOCK) {
      setUsuarios((prev) => {
        const idKey = 'ID_Usuario';
        const savedId = saved[idKey];
        if (savedId) {
          const updated = prev.map((p) => ((p.ID_Usuario ?? p.id) === savedId ? { ...p, ...saved } : p));
          localStorage.setItem('mock_usuarios', JSON.stringify(updated));
          return updated;
        }
        // create new
        const maxId = prev.reduce((m, x) => Math.max(m, (x.ID_Usuario ?? x.id) || 0), 0);
        const newItem = { ...saved, ID_Usuario: maxId + 1, DT_Cad_Usuario: new Date().toISOString(), Ativo: true };
        const newArr = [newItem, ...prev];
        localStorage.setItem('mock_usuarios', JSON.stringify(newArr));
        return newArr;
      });
      return;
    }

    setUsuarios((prev) => {
      const exists = prev.find((p) => (p.ID_Usuario ?? p.id) === (saved.ID_Usuario ?? saved.id));
      if (exists) return prev.map((p) => ((p.ID_Usuario ?? p.id) === (saved.ID_Usuario ?? saved.id) ? { ...p, ...saved } : p));
      return [saved, ...prev];
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Confirma exclusão do usuário?")) return;
    if (USE_MOCK) {
      setUsuarios((s) => {
        const next = s.filter((u) => (u.ID_Usuario ?? u.id) !== id);
        localStorage.setItem('mock_usuarios', JSON.stringify(next));
        return next;
      });
      return;
    }
    // try api then fallback
    fetch(`/api/usuarios/${id}`, { method: "DELETE" }).then(() => {
      setUsuarios((s) => s.filter((u) => (u.ID_Usuario ?? u.id) !== id));
    }).catch(() => {
      setUsuarios((s) => s.filter((u) => (u.ID_Usuario ?? u.id) !== id));
    });
  };

  const handleToggleActive = (u) => {
    const id = u.ID_Usuario ?? u.id;
    const newVal = !u.Ativo;
    // optimistic
    setUsuarios((prev) => {
      const updated = prev.map((p) => ((p.ID_Usuario ?? p.id) === id ? { ...p, Ativo: newVal } : p));
      if (USE_MOCK) localStorage.setItem('mock_usuarios', JSON.stringify(updated));
      return updated;
    });
    if (!USE_MOCK) {
      fetch(`/api/usuarios/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Ativo: newVal }) }).catch(() => {});
    }
  };

  const openChangePassword = (u) => {
    setPwdTarget(u);
    setIsPwdOpen(true);
  };

  const handlePwdChanged = (id) => {
    setIsPwdOpen(false);
    setPwdTarget(null);
    alert("Senha alterada com sucesso (simulado)");
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  const uniqueProfiles = Array.from(new Set(usuarios.map(u => u.PerfilNome).filter(Boolean)));

  return (
    <div className="page usuarios-page">
      <div className="usuarios-cabecalho-fixo">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1>Usuários</h1>
            {useDelayedLoader(loading, { delay: 200 }) && <InlineSpinner />}
          </div>
          <div className="page-actions">
            <button onClick={openCreate}>Novo Usuário</button>
          </div>
        </div>

        <div className="summary-row">
          <div className="card-summary">
            <h3>Total</h3>
            <p>{usuarios.length}</p>
          </div>
          <div className="card-summary">
            <h3>Ativos</h3>
            <p>{usuarios.filter(u => u.Ativo).length}</p>
          </div>
          <div className="card-summary">
            <h3>Perfis</h3>
            <p>{uniqueProfiles.length} perfil{uniqueProfiles.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

      </div>

      <div className="table-wrapper card">
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div />
          </div>
          {loading ? (
            // layout: ID(0.6), Nome(1.5), Login(1), Perfil(1), Email(1.6), Ativo(0.6), DT(1), Ações(0.8)
            <TableSkeleton rows={8} layout={[0.6,1.5,1,1,1.6,0.6,1,0.8]} />
          ) : (
            <>
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Login</th>
                    <th>Perfil</th>
                    <th>Email</th>
                    <th>Ativo</th>
                    <th>DT_Cad</th>
                    <th className="col-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsFiltered.map((u) => (
                    <tr key={u.ID_Usuario ?? u.id}>
                      <td><Highlight text={String(u.ID_Usuario ?? u.id)} query={searchQuery} /></td>
                      <td><Highlight text={u.NM_Usuario ?? u.nome} query={searchQuery} /></td>
                      <td><Highlight text={u.Login} query={searchQuery} /></td>
                      <td><Highlight text={u.PerfilNome ?? "-"} query={searchQuery} /></td>
                      <td><Highlight text={u.Email} query={searchQuery} /></td>
                      <td>{u.Ativo ? "Sim" : "Não"}</td>
                      <td>{u.DT_Cad_Usuario ? new Date(u.DT_Cad_Usuario).toLocaleDateString() : "-"}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <ActionButtons
                            onEdit={() => handleEdit(u)}
                            onDelete={() => handleDelete(u.ID_Usuario ?? u.id)}
                          />
                          <button className="btn-action-trigger pwd-btn" onClick={() => openChangePassword(u)}>🔑</button>
                          <button className="btn-action-trigger toggle-btn" onClick={() => handleToggleActive(u)}>{u.Ativo ? 'Desativar' : 'Ativar'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length > 0 && (
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

      {isFormOpen && (
        <UsuarioForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} initialData={editing} />
      )}

      {isPwdOpen && (
        <ChangePasswordModal isOpen={isPwdOpen} onClose={() => setIsPwdOpen(false)} user={pwdTarget} onSaved={() => handlePwdChanged(pwdTarget?.ID_Usuario ?? pwdTarget?.id)} />
      )}
    </div>
  );
}

export default Usuarios;
