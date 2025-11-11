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
import { unidadesAPI } from "../../services/api";

const PAGE_SIZE = 10;

function Unidades() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Buscar unidades da API
  useEffect(() => {
    async function fetchUnidades() {
      try {
        setLoading(true);
        console.log("🔵 Buscando unidades de medida...");
        const data = await unidadesAPI.listar();
        console.log("✅ Unidades carregadas:", data.length);
        setUnidades(data);
      } catch (err) {
        console.error("❌ Erro ao buscar unidades:", err);
        setUnidades([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUnidades();
  }, []);

  const openCreate = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (u) => { setEditing(u); setIsOpen(true); };

  const handleSave = (saved) => {
    console.log('✅ Unidade salva:', saved);
    const id = saved.idUnidade;
    setUnidades((prev) => {
      const exists = prev.some((u) => (u.idUnidade || u.ID_Unidade) === id);
      if (exists) {
        return prev.map((u) => ((u.idUnidade || u.ID_Unidade) === id ? saved : u));
      }
      return [saved, ...prev];
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão da unidade de medida?')) return;
    try {
      console.log("🔵 Excluindo unidade ID:", id);
      await unidadesAPI.deletar(id);
      console.log("✅ Unidade excluída");
      setUnidades(prev => prev.filter(u => (u.idUnidade || u.ID_Unidade) !== id));
      alert('✅ Unidade excluída com sucesso!');
    } catch (err) {
      console.error("❌ Erro ao excluir unidade:", err);
      alert('❌ Erro ao excluir unidade: ' + (err.message || 'Erro desconhecido'));
    }
  };

  // Filtrar unidades pela busca
  const filtered = unidades.filter((u) => {
    const sigla = (u.sigla ?? u.Sigla ?? "").toLowerCase();
    const descricao = (u.descricao ?? u.Descricao ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return sigla.includes(query) || descricao.includes(query);
  });

  // Calcular estatísticas
  const totalUnidades = unidades.length;
  const unidadesComDescricao = unidades.filter(u => {
    const desc = u.descricao ?? u.Descricao;
    return desc && desc.trim();
  }).length;
  const unidadesRecentes = 0; // API não retorna data de cadastro no model atual

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
                    <th>Status</th>
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
                      <tr key={u.idUnidade ?? u.ID_Unidade}>
                        <td><Highlight text={String(u.idUnidade ?? u.ID_Unidade ?? u.id)} query={searchQuery} /></td>
                        <td>
                          <span className="sigla-badge">
                            <Highlight text={u.sigla ?? u.Sigla} query={searchQuery} />
                          </span>
                        </td>
                        <td>
                          <strong><Highlight text={u.descricao ?? u.Descricao ?? '-'} query={searchQuery} /></strong>
                        </td>
                        <td>
                          <span className={`status-badge ${(u.ativo ?? u.Ativo) ? 'ativo' : 'inativo'}`}>
                            {(u.ativo ?? u.Ativo) ? '✅ Ativo' : '❌ Inativo'}
                          </span>
                        </td>
                        <td className="celula-acoes">
                          <ActionButtons 
                            onEdit={() => openEdit(u)} 
                            onDelete={() => handleDelete(u.idUnidade ?? u.ID_Unidade ?? u.id)} 
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
