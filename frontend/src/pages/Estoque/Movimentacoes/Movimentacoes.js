import React, { useState, useEffect } from "react";
import "./Movimentacoes.css";
import Pagination from "../../../components/Pagination/Pagination";
import ActionButtons from "../../../components/ActionButtons";
import sampleMovimentacoes from "./sampleMovimentacoes";
import MovimentacoesForm from "./MovimentacoesForm";
import { estoqueAPI } from "../../../services/api";

const PAGE_SIZE = 10;

function Movimentacoes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("🔵 Buscando movimentações de estoque...");
        const data = await estoqueAPI.listar();
        console.log("✅ Movimentações carregadas:", data.length);
        // Mapeia os campos da API para os nomes esperados pelo frontend
        const mapped = Array.isArray(data) ? data.map(mov => ({
          ID_Mov: mov.idMovimentacao || mov.id || mov.ID_Mov,
          Tipo: mov.tipoMovimento,
          Produto: mov.nomeMaterial || mov.material || mov.nome || '',
          Quantidade: mov.quantidade,
          Data: mov.dataMovimentacao,
          Usuario: mov.usuarioMovimentacao,
          Observacao: mov.observacao,
        })) : [];
        setItems(mapped);
      } catch (err) {
        console.error("❌ Erro ao buscar movimentações:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const openCreate = () => { setEditing(null); setIsOpen(true); };
  const openEdit = (it) => { setEditing(it); setIsOpen(true); };

  const handleSave = async (saved) => {
    try {
      // Envia para a API
      const result = await estoqueAPI.registrar(saved);
      // Atualiza a lista local exibida
      setItems(prev => [{
        ID_Mov: result.idMovimentacao,
        Tipo: result.tipoMovimento,
        Produto: result.nomeMaterial || result.material?.nmMaterial || result.material?.nome || '',
        Quantidade: result.quantidade,
        Data: result.dataMovimentacao,
        Usuario: result.usuarioMovimentacao || result.usuario?.nome || '',
        Observacao: result.observacao,
      }, ...prev]);
    } catch (err) {
      alert('Erro ao registrar movimentação: ' + (err?.response?.data?.message || err.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão da movimentação?')) return;
    try {
      console.log("🔵 Excluindo movimentação ID:", id);
      // Nota: estoqueAPI não tem método deletar definido ainda
      // await estoqueAPI.deletar(id);
      console.warn("⚠️ API de exclusão de movimentação ainda não implementada");
      alert('⚠️ Funcionalidade de exclusão ainda não disponível na API');
    } catch (err) {
      console.error("❌ Erro ao excluir movimentação:", err);
      alert('❌ Erro: ' + (err.message || 'Erro desconhecido'));
    }
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
          <div className="card-summary clickable">
            <span className="card-icon">📦</span>
            <div className="card-content">
              <h3>Total</h3>
              <p>{total}</p>
            </div>
          </div>
          <div className="card-summary clickable">
            <span className="card-icon">📥</span>
            <div className="card-content">
              <h3>Entradas</h3>
              <p>{entradas}</p>
            </div>
          </div>
          <div className="card-summary clickable">
            <span className="card-icon">📤</span>
            <div className="card-content">
              <h3>Saídas</h3>
              <p>{saidas}</p>
            </div>
          </div>
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
