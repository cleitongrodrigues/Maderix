import React, { useState, useEffect } from "react";
import "./ContasReceber.css";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import AccountDetailModal from "../../components/AccountDetailModal";
import sampleContasReceber from "./sampleContasReceber";
import { contasReceberAPI, pagamentosVendaAPI } from "../../services/api";

const PAGE_SIZE = 10;

function ContasReceber() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODAS"); // TODAS, ABERTAS, PAGAS, VENCIDAS
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [contaDetalhes, setContaDetalhes] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("🔵 Buscando contas a receber...");
        const data = await contasReceberAPI.listarPendentes();
        console.log("✅ Contas carregadas:", data.length);
        setContas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erro ao buscar contas:", err);
        setContas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão da conta?')) return;
    try {
      console.log("🔵 Excluindo conta ID:", id);
      await contasReceberAPI.deletar(id);
      console.log("✅ Conta excluída");
      setContas(prev => prev.filter(u => (u.idConta ?? u.ID_Conta ?? u.id) !== id));
      alert('✅ Conta excluída com sucesso!');
    } catch (err) {
      console.error("❌ Erro ao excluir conta:", err);
      alert('❌ Erro ao excluir: ' + (err.message || 'Erro desconhecido'));
    }
  };

  // Função para abrir modal de detalhes
  const handleViewDetails = (conta) => {
    setContaDetalhes(conta);
  };

  // Função para fechar modal de detalhes
  const handleCloseDetails = () => {
    setContaDetalhes(null);
  };

  // Função para registrar pagamento
  const handleRegisterPayment = async (paymentData) => {
    // Recupera usuário logado do localStorage (robusto para diferentes formatos)
    let usuario = null;
    try {
      usuario = JSON.parse(localStorage.getItem('usuario'));
    } catch (e) {
      usuario = null;
    }
    // Permite buscar idUsuario em diferentes formatos
    const idUsuario = usuario?.ID_Usuario || usuario?.idUsuario || usuario?.id || null;
    if (!idUsuario) {
      alert('Usuário não identificado. Faça login novamente.');
      return;
    }
    // Monta objeto no formato esperado pelo backend (camelCase)
    const pagamento = {
      idVenda: contaDetalhes.ID_Venda ?? contaDetalhes.idVenda ?? contaDetalhes.idVenda,
      idConta: contaDetalhes.ID_Conta ?? contaDetalhes.idConta ?? contaDetalhes.idConta,
      idUsuario: idUsuario,
      valor: paymentData.valorPago,
      tipoPagamento: paymentData.formaPagamento,
      observacao: paymentData.observacoes
    };
    try {
      await pagamentosVendaAPI.registrar(pagamento);
      alert('✅ Pagamento registrado com sucesso!');
      handleCloseDetails();
      // Atualiza status da conta e da venda no frontend
      setContas(prevContas => prevContas.map(c => {
        if ((c.idConta ?? c.ID_Conta ?? c.id) === pagamento.idConta) {
          return { ...c, pago: true };
        }
        return c;
      }));
      // Se houver componente/lista de vendas, pode disparar atualização aqui
    } catch (err) {
      alert('❌ Erro ao registrar pagamento: ' + (err.message || 'Erro desconhecido'));
    }
  };


  // Função para verificar se conta está vencida
  const isVencida = (conta) => {
    if (conta.pago) return false;
    if (!conta.dataVencimento) return false;
    return new Date(conta.dataVencimento) < new Date();
  };

  // Função para formatar valor monetário
  const formatarMoeda = (valor) => {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return `R$ ${valor}`;
  };

  // Função para formatar data no padrão brasileiro
  const formatarDataBR = (data) => {
    if (!data) return '-';
    const d = new Date(data);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('pt-BR');
  };

  // Filtros aplicados
  const filteredContas = contas.filter(c => {
    // Filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const cliente = (c.cliente || "").toLowerCase();
      const numero = (c.numero || "").toString().toLowerCase();
      if (!cliente.includes(query) && !numero.includes(query)) {
        return false;
      }
    }
    // Filtro de status
    if (statusFilter === "ABERTAS") {
      return !c.pago;
    } else if (statusFilter === "PAGAS") {
      return c.pago;
    } else if (statusFilter === "VENCIDAS") {
      return isVencida(c);
    }
    // TODAS - retorna tudo
    return true;
  });

  // summary stats (sobre contas filtradas ou todas)
  const total = contas.length;
  const abertas = contas.filter(c => !c.pago).length;
  const vencidas = contas.filter(c => isVencida(c)).length;
  const totalValorAberto = contas
    .filter(c => !c.pago)
    .reduce((sum, c) => sum + (typeof c.valor === 'number' ? c.valor : parseFloat(c.valor) || 0), 0);

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
                      <tr key={c.idConta} className={contaVencida ? 'linha-vencida' : ''}>
                        <td>{c.idConta}</td>
                        <td>{c.numero}</td>
                        <td>{c.cliente || '-'}</td>
                        <td className="valor-monetario">{formatarMoeda(c.valor)}</td>
                        <td>
                          {c.dataVencimento ? (
                            <span className={contaVencida ? 'data-vencida' : ''}>
                              {contaVencida && '⚠️ '}
                              {formatarDataBR(c.dataVencimento)}
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          {c.pago ? (
                            <span className="status-badge status-paga">✅ Paga</span>
                          ) : (
                            <span className={`status-badge ${contaVencida ? 'status-vencida' : 'status-aberta'}`}>
                              {contaVencida ? '⚠️ Vencida' : '🕐 Em Aberto'}
                            </span>
                          )}
                        </td>
                        <td className="celula-acoes">
                          <div className="grupo-botoes-acao">
                            <ActionButtons 
                              showView={true}
                              showEdit={false}
                              showDelete={false}
                              onView={() => handleViewDetails(c)}
                            />
                            <button
                              className={`btn-receber ${c.pago ? 'btn-paga' : 'btn-receber-ativo'}`}
                              onClick={() => handleViewDetails(c)}
                              title={c.pago ? 'Marcar como Não Paga' : 'Receber Pagamento'}
                            >
                              {c.pago ? '↩️ Reabrir' : '💵 Receber'}
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

      {contaDetalhes && (
        <AccountDetailModal 
          conta={{
            idConta: contaDetalhes.idConta,
            numero: contaDetalhes.numero,
            cliente: contaDetalhes.cliente,
            valor: contaDetalhes.valor,
            dataVencimento: contaDetalhes.dataVencimento,
            pago: contaDetalhes.pago
          }}
          onClose={handleCloseDetails}
          onRegisterPayment={handleRegisterPayment}
        />
      )}
    </div>
  );
}

export default ContasReceber;
