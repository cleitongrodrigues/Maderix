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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODAS"); // TODAS, ABERTAS, PAGAS, VENCIDAS
  const [filtroAtivo, setFiltroAtivo] = useState(null); // para controle de cards clicados

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

  // Função para verificar se conta está vencida
  const isVencida = (conta) => {
    if (conta.Pago) return false;
    if (!conta.Vencimento) return false;
    return new Date(conta.Vencimento) < new Date();
  };

  // Função para formatar valor monetário
  const formatarMoeda = (valor) => {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return `R$ ${valor}`;
  };

  // Filtros aplicados
  const filteredContas = contas.filter(c => {
    // Filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const cliente = (c.Cliente || '').toLowerCase();
      const numero = (c.Numero || '').toString().toLowerCase();
      if (!cliente.includes(query) && !numero.includes(query)) {
        return false;
      }
    }

    // Filtro de status
    if (statusFilter === "ABERTAS") {
      return !c.Pago;
    } else if (statusFilter === "PAGAS") {
      return c.Pago;
    } else if (statusFilter === "VENCIDAS") {
      return isVencida(c);
    }
    // TODAS - retorna tudo
    return true;
  });

  // summary stats (sobre contas filtradas ou todas)
  const total = contas.length;
  const abertas = contas.filter(c => !c.Pago).length;
  const vencidas = contas.filter(c => isVencida(c)).length;
  const totalValorAberto = contas
    .filter(c => !c.Pago)
    .reduce((sum, c) => sum + (typeof c.Valor === 'number' ? c.Valor : parseFloat(c.Valor) || 0), 0);

  // Handler para clicar nos cards
  const handleCardClick = (tipo) => {
    if (filtroAtivo === tipo) {
      // Se clicar no mesmo card, remove filtro
      setFiltroAtivo(null);
      setStatusFilter("TODAS");
    } else {
      // Aplica filtro do card
      setFiltroAtivo(tipo);
      if (tipo === 'abertas') {
        setStatusFilter("ABERTAS");
      } else if (tipo === 'vencidas') {
        setStatusFilter("VENCIDAS");
      }
    }
    setPage(1); // Reset página
  };

  const totalPages = Math.max(1, Math.ceil(filteredContas.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filteredContas.slice(start, start + PAGE_SIZE);

  return (
    <div className="page contas-page">
      <div className="contas-container">
        {/* Cabeçalho fixo com título, busca e ações */}
        <div className="contas-cabecalho-fixo">
          <div className="titulo-contas">
            <h1>💰 Contas a Receber</h1>
          </div>
        <div className="acoes-pagina">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por cliente ou número..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset página ao buscar
            }}
          />
          <button className="btn-primary" onClick={openCreate}>
            <span className="btn-icon">+</span>
            Nova Conta
          </button>
        </div>

        {/* Cards de resumo com ícones */}
        <div className="linha-resumo card">
          <div 
            className={`card-summary clickable ${filtroAtivo === 'abertas' ? 'ativo' : ''}`}
            onClick={() => handleCardClick('abertas')}
            title="Clique para filtrar contas em aberto"
          >
            <span className="card-icon">📋</span>
            <div className="card-content">
              <h3>Contas Abertas</h3>
              <p>{abertas}</p>
              <small>{formatarMoeda(totalValorAberto)}</small>
            </div>
          </div>
          <div 
            className={`card-summary clickable ${filtroAtivo === 'vencidas' ? 'ativo' : ''}`}
            onClick={() => handleCardClick('vencidas')}
            title="Clique para filtrar contas vencidas"
          >
            <span className="card-icon">⚠️</span>
            <div className="card-content">
              <h3>Contas Vencidas</h3>
              <p className="texto-perigo">{vencidas}</p>
              <small>Requer atenção!</small>
            </div>
          </div>
          <div className="card-summary">
            <span className="card-icon">💰</span>
            <div className="card-content">
              <h3>Total de Contas</h3>
              <p>{total}</p>
              <small>Cadastradas no sistema</small>
            </div>
          </div>
        </div>

        {/* Badge de filtro ativo */}
        {filtroAtivo && (
          <div className="badge-filtro-ativo">
            Filtro ativo: {filtroAtivo === 'abertas' ? 'Contas Abertas' : 'Contas Vencidas'}
            <button 
              className="btn-limpar-filtro" 
              onClick={() => { setFiltroAtivo(null); setStatusFilter("TODAS"); }}
              title="Limpar filtro"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="card area-tabela">
        {loading ? <div className="loading-message">⏳ Carregando contas...</div> : (
          <>
            <table className="tabela-contas">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th className="col-acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="7">Nenhuma conta encontrada.</td>
                  </tr>
                ) : (
                  pageItems.map(c => {
                    const contaVencida = isVencida(c);
                    return (
                      <tr key={c.ID_Conta ?? c.id} className={contaVencida ? 'linha-vencida' : ''}>
                        <td>{c.ID_Conta ?? c.id}</td>
                        <td>{c.Numero}</td>
                        <td>{c.Cliente}</td>
                        <td className="valor-monetario">{formatarMoeda(c.Valor)}</td>
                        <td>
                          {c.Vencimento ? (
                            <span className={contaVencida ? 'data-vencida' : ''}>
                              {contaVencida && '⚠️ '}
                              {new Date(c.Vencimento).toLocaleDateString('pt-BR')}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          {c.Pago ? (
                            <span className="status-badge status-paga">✅ Paga</span>
                          ) : (
                            <span className={`status-badge ${contaVencida ? 'status-vencida' : 'status-aberta'}`}>
                              {contaVencida ? '⚠️ Vencida' : '🕐 Em Aberto'}
                            </span>
                          )}
                        </td>
                        <td className="celula-acoes">
                          <div className="grupo-botoes-acao">
                            <ActionButtons onEdit={() => openEdit(c)} onDelete={() => handleDelete(c.ID_Conta ?? c.id)} />
                          </div>
                          <div className="grupo-toggle">
                            <button
                              className={`btn-receber ${c.Pago ? 'btn-paga' : 'btn-receber-ativo'}`}
                              onClick={() => togglePago(c)}
                              title={c.Pago ? 'Marcar como Não Paga' : 'Receber Pagamento'}
                            >
                              {c.Pago ? '↩️ Reabrir' : '💵 Receber'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {filteredContas.length > 0 && (
              <Pagination 
                totalItems={filteredContas.length} 
                pageSize={PAGE_SIZE} 
                currentPage={page} 
                onPageChange={(p) => setPage(p)} 
                showCount 
              />
            )}
          </>
        )}
      </div>
      </div> {/* Fecha contas-container */}

      {isOpen && <ContasReceberForm isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={(s) => { handleSave(s); setIsOpen(false); }} initialData={editing} />}
    </div>
  );
}

export default ContasReceber;
