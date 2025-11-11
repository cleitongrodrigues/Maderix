import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import "./Usuarios.css";
import useDelayedLoader from "../../hooks/useDelayedLoader";
import InlineSpinner from "../../components/InlineSpinner/InlineSpinner";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";
import SearchBar from "../../components/SearchBar/SearchBar";
import Highlight from "../../components/Highlight/Highlight";
import { usuariosAPI } from "../../services/api";


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
  const [filtroAtivo, setFiltroAtivo] = useState(null); // 'ativos' ou 'inativos'

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        console.log("🔵 Buscando usuários...");
        const data = await usuariosAPI.listar();
        console.log("✅ Usuários carregados:", data);
        setUsuarios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erro ao buscar usuários:", err);
        setUsuarios([]);
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
    // Filtro de busca
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const match = (String(u.idUsuario ?? u.ID_Usuario ?? "").toLowerCase().includes(q) ||
        (u.nmUsuario ?? u.NM_Usuario ?? "").toLowerCase().includes(q) ||
        (u.nmLogin ?? u.Login ?? "").toLowerCase().includes(q) ||
        (u.email ?? u.Email ?? "").toLowerCase().includes(q));
      if (!match) return false;
    }

    // Filtro de status ativo/inativo
    if (filtroAtivo === 'ativos') {
      return u.ativo === true;
    } else if (filtroAtivo === 'inativos') {
      return u.ativo === false;
    }

    return true;
  });

  useEffect(() => { setCurrentPage(1); }, [searchQuery, filtroAtivo]);

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
    console.log("🔵 Usuário salvo, atualizando lista:", saved);
    setUsuarios((prev) => {
      const id = saved.idUsuario ?? saved.ID_Usuario;
      const exists = prev.find((p) => (p.idUsuario ?? p.ID_Usuario) === id);
      if (exists) {
        return prev.map((p) => ((p.idUsuario ?? p.ID_Usuario) === id ? { ...p, ...saved } : p));
      }
      return [saved, ...prev];
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirma exclusão do usuário?")) return;
    try {
      console.log("🔵 Deletando usuário:", id);
      await usuariosAPI.deletar(id);
      console.log("✅ Usuário deletado com sucesso");
      setUsuarios((prev) => prev.filter((u) => (u.idUsuario ?? u.ID_Usuario) !== id));
      alert("Usuário excluído com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao deletar usuário:", err);
      alert("Erro ao excluir usuário: " + (err.message || "Erro desconhecido"));
    }
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  // Handler para clicar nos cards
  const handleCardClick = (tipo) => {
    if (filtroAtivo === tipo) {
      // Se clicar no mesmo card, remove filtro
      setFiltroAtivo(null);
    } else {
      // Aplica filtro do card
      setFiltroAtivo(tipo);
    }
    setCurrentPage(1); // Reset página
  };

  const uniqueProfiles = Array.from(new Set(usuarios.map(u => u.perfil?.nmPerfil ?? u.PerfilNome).filter(Boolean)));
  const totalAtivos = usuarios.filter(u => u.ativo ?? u.Ativo).length;
  const percentualAtivos = usuarios.length > 0 ? Math.round((totalAtivos / usuarios.length) * 100) : 0;

  return (
    <div className="page usuarios-page">
      <div className="usuarios-container">
        <div className="usuarios-cabecalho-fixo">
          <div className="cabecalho-pagina">
            <div className="titulo-usuarios">
              <h1>👥 Usuários</h1>
            {useDelayedLoader(loading, { delay: 200 }) && <InlineSpinner />}
          </div>
          <div className="acoes-pagina">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar usuário..." />
            <button className="btn-primary" onClick={openCreate}>
              <span className="btn-icon">+</span>
              Novo Usuário
            </button>
          </div>
        </div>

        <div className="summary-row card">
          <div 
            className={`card-summary clickable ${filtroAtivo === 'ativos' ? 'ativo' : ''}`}
            onClick={() => handleCardClick('ativos')}
            title="Clique para filtrar usuários ativos"
          >
            <span className="card-icon">✅</span>
            <div className="card-content">
              <h3>Usuários Ativos</h3>
              <p>{totalAtivos}</p>
              <small>{percentualAtivos}% do total</small>
            </div>
          </div>
          <div 
            className={`card-summary clickable ${filtroAtivo === 'inativos' ? 'ativo' : ''}`}
            onClick={() => handleCardClick('inativos')}
            title="Clique para filtrar usuários inativos"
          >
            <span className="card-icon">⭕</span>
            <div className="card-content">
              <h3>Usuários Inativos</h3>
              <p>{usuarios.length - totalAtivos}</p>
              <small>Desativados no sistema</small>
            </div>
          </div>
          <div className="card-summary">
            <span className="card-icon">👔</span>
            <div className="card-content">
              <h3>Perfis Cadastrados</h3>
              <p>{uniqueProfiles.length}</p>
              <small>{uniqueProfiles.join(', ') || 'Nenhum'}</small>
            </div>
          </div>
        </div>

        {/* Badge de filtro ativo */}
        {filtroAtivo && (
          <div className="badge-filtro-ativo">
            Filtro ativo: {filtroAtivo === 'ativos' ? 'Usuários Ativos' : 'Usuários Inativos'}
            <button 
              className="btn-limpar-filtro" 
              onClick={() => setFiltroAtivo(null)}
              title="Limpar filtro"
            >
              ✕
            </button>
          </div>
        )}

      </div>

  <div className="area-tabela card">
          {loading ? (
            // layout: ID(0.6), Nome(1.5), Login(1), Perfil(1), Email(1.6), Ativo(0.6), DT(1), Ações(0.8)
            <TableSkeleton rows={8} layout={[0.6,1.5,1,1,1.6,0.6,1,0.8]} />
          ) : (
            <>
              <table className="tabela-usuarios">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Login</th>
                    <th>Perfil</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsFiltered.length === 0 ? (
                    <tr>
                      <td colSpan="8">Nenhum usuário encontrado.</td>
                    </tr>
                  ) : (
                    currentItemsFiltered.map((u) => (
                      <tr key={u.idUsuario ?? u.ID_Usuario}>
                        <td><Highlight text={String(u.idUsuario ?? u.ID_Usuario)} query={searchQuery} /></td>
                        <td><strong><Highlight text={u.nmUsuario ?? u.NM_Usuario} query={searchQuery} /></strong></td>
                        <td><Highlight text={u.nmLogin ?? u.Login} query={searchQuery} /></td>
                        <td>
                          <span className="perfil-badge">
                            <Highlight text={u.perfil?.nmPerfil ?? u.PerfilNome ?? "-"} query={searchQuery} />
                          </span>
                        </td>
                        <td><Highlight text={u.email ?? u.Email} query={searchQuery} /></td>
                        <td className="telefone-cell">{u.telUsuario ?? u.Tel_Usuario ?? "-"}</td>
                        <td>
                          {(u.ativo ?? u.Ativo) ? (
                            <span className="status-badge status-ativo">✅ Ativo</span>
                          ) : (
                            <span className="status-badge status-inativo">⭕ Inativo</span>
                          )}
                        </td>
                        <td className="celula-acoes">
                          <div className="botoes-acao">
                            <ActionButtons
                              onEdit={() => handleEdit(u)}
                              onDelete={() => handleDelete(u.idUsuario ?? u.ID_Usuario)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
        </div> {/* Fecha area-tabela */}
      </div> {/* Fecha usuarios-container */}

      {isFormOpen && (
        <UsuarioForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} initialData={editing} />
      )}
    </div>
  );
}

export default Usuarios;
