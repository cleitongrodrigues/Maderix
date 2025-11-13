import React, { useState, useMemo, useEffect } from "react";
import "./Vendas.css";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";
import Highlight from "../../components/Highlight/Highlight";
import NovaVenda from "./NovaVenda/NovaVenda";
import { vendasAPI } from "../../services/api";

function formatCurrency(v) {
	return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getPaymentIcon(payment) {
	const icons = {
		"PIX": "📲",
		"Cartão": "💳",
		"Dinheiro": "💰",
		"Boleto": "📄"
	};
	return icons[payment] || "💵";
}

function Vendas() {

	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [selected, setSelected] = useState(null);
	const [isNovaVendaOpen, setIsNovaVendaOpen] = useState(false);
	const [vendaParaEditar, setVendaParaEditar] = useState(null);

	// pagination fixed
	const [page, setPage] = useState(1);
	const pageSize = 10;

	// Buscar vendas da API
	useEffect(() => {
		async function fetchVendas() {
			try {
				setLoading(true);
				console.log("🔵 Buscando vendas...");
				const data = await vendasAPI.listar();
				console.log("✅ Vendas carregadas:", data.length);
				setSales(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("❌ Erro ao buscar vendas:", err);
				setSales([]);
			} finally {
				setLoading(false);
			}
		}
		fetchVendas();
	}, []);

	const filtered = useMemo(() => {
		return sales.filter((s) => {
			if (filter) {
				const q = filter.toLowerCase();
				if (!(
					String(s.id).includes(q) ||
					s.customer.toLowerCase().includes(q) ||
					s.seller.toLowerCase().includes(q)
				)) return false;
			}
			if (statusFilter && s.status !== statusFilter) return false;
			const sd = new Date(s.date);
			if (dateFrom) {
				const df = new Date(dateFrom);
				if (sd < df) return false;
			}
			if (dateTo) {
				const dt = new Date(dateTo);
				dt.setHours(23, 59, 59, 999);
				if (sd > dt) return false;
			}
			return true;
		});
	}, [sales, filter, statusFilter, dateFrom, dateTo]);

	// reset page when filters change
	useEffect(() => { setPage(1); }, [filter, statusFilter, dateFrom, dateTo]);

	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * pageSize;
	const visible = filtered.slice(startIndex, startIndex + pageSize);

	const handleSaveVenda = (vendaData, isEdicao) => {
		if (isEdicao) {
			setSales(sales.map(venda => 
				venda.id === vendaData.id ? vendaData : venda
			));
			alert("Venda atualizada com sucesso!");
		} else {
			setSales([vendaData, ...sales]);
			alert("Venda cadastrada com sucesso!");
		}
		setVendaParaEditar(null);
	};

	const handleEditarVenda = (venda) => {
		setVendaParaEditar(venda);
		setIsNovaVendaOpen(true);
	};

	const handleCloseModal = () => {
		setIsNovaVendaOpen(false);
		setVendaParaEditar(null);
	};

	const handleConcluirVenda = (id) => {
		setSales(sales.map(venda => 
			venda.id === id ? { ...venda, status: "CONCLUÍDA" } : venda
		));
		alert("Venda marcada como CONCLUÍDA!");
	};

	const handleCancelarVenda = (id, isEstorno = false) => {
		const vendaAtual = sales.find(v => v.id === id);
		const titulo = isEstorno ? "estorno" : "cancelamento";
		const motivo = prompt(`Digite o motivo do ${titulo}:`);
		
		if (motivo && motivo.trim() !== "") {
			setSales(sales.map(venda => 
				venda.id === id ? { 
					...venda, 
					status: isEstorno ? "ESTORNADA" : "CANCELADA",
					motivoCancelamento: motivo.trim(),
					dataCancelamento: new Date().toISOString(),
					tipoEstorno: isEstorno
				} : venda
			));
			alert(`Venda ${isEstorno ? 'estornada' : 'cancelada'} com sucesso!`);
		} else if (motivo !== null) {
			alert(`É necessário informar o motivo do ${titulo}.`);
		}
	};

	// Calcular estatísticas
	const totalVendas = filtered.length;
	const vendasConcluidas = filtered.filter(v => v.status === "CONCLUÍDA").length;
	const vendasPendentes = filtered.filter(v => v.status === "PENDENTE").length;
	const totalFaturamento = filtered
		.filter(v => v.status === "CONCLUÍDA")
		.reduce((sum, v) => sum + v.total, 0);

	return (
			<div className="pagina vendas-page">
				<div className="vendas-container">
					<div className="barra-filtros">
						<div className="titulo-vendas">
							<h1>💰 Vendas</h1>
						</div>
					
					<div className="vendas-controles card">
						<div className="vendas-toolbar">
							<div className="linha-filtros filters-row">
								<label>
									Status
									<select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
										<option value="">Todos</option>
										<option value="CONCLUÍDA">Concluída</option>
										<option value="PENDENTE">Pendente</option>
										<option value="CANCELADA">Cancelada</option>
										<option value="ESTORNADA">Estornada</option>
									</select>
								</label>

								<label>
									De
									<input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
								</label>

								<label>
									Ate
									<input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
								</label>
							</div>

							<div className="vendas-actions">
								<SearchBar value={filter} onChange={(v) => setFilter(v)} placeholder="Buscar por ID, cliente ou vendedor..." inputClassName="header-search" />
								<div className="acoes-vendas">
									<button className="btn-primary" onClick={() => setIsNovaVendaOpen(true)}>
										<span className="btn-icon">+</span> Nova Venda
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Summary Cards */}
					<div className="summary-row card">
						<div className="card-summary clickable">
							<span className="card-icon">📊</span>
							<div className="card-content">
								<h3>Total de Vendas</h3>
								<p>{totalVendas}</p>
							</div>
						</div>
						<div className="card-summary clickable">
							<span className="card-icon">✅</span>
							<div className="card-content">
								<h3>Concluídas</h3>
								<p>{vendasConcluidas}</p>
							</div>
						</div>
						<div className="card-summary clickable">
							<span className="card-icon">⏳</span>
							<div className="card-content">
								<h3>Pendentes</h3>
								<p>{vendasPendentes}</p>
							</div>
						</div>
						<div className="card-summary clickable">
							<span className="card-icon">💵</span>
							<div className="card-content">
								<h3>Faturamento</h3>
								<p>{formatCurrency(totalFaturamento)}</p>
							</div>
						</div>
					</div>
				</div>

			<table className="tabela-vendas">
				<thead>
					<tr>
						<th>ID</th>
						<th>Data</th>
						<th>Cliente</th>
						<th>Itens</th>
						<th>Total</th>
						<th>Pagamento</th>
						<th>Vendedor</th>
						<th>Status</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
					{visible.length === 0 ? (
						<tr>
							<td colSpan="9">Nenhuma venda encontrada.</td>
						</tr>
					) : (
						visible.map((s) => (
							<tr key={s.id} className={s.status === "CANCELADA" ? "muted" : ""}>
								<td><Highlight text={String(s.id)} query={filter} /></td>
								<td>{new Date(s.date).toLocaleString()}</td>
								<td><Highlight text={s.customer} query={filter} /></td>
								<td>{s.itemsCount}</td>
								<td>{formatCurrency(s.total)}</td>
								<td>
									<span className="payment-method">
										{getPaymentIcon(s.payment)} {s.payment}
									</span>
								</td>
								<td>{s.seller}</td>
								<td>
									<span className={`status status-${s.status.toLowerCase()}`}>
										{s.status}
									</span>
								</td>
								<td>
									<div style={{ display: 'flex', gap: '8px' }}>
										<button className="btn-ver" onClick={() => setSelected(s)}>Ver</button>
										{s.status === "PENDENTE" && (
											<>
												<button className="btn-editar" onClick={() => handleEditarVenda(s)} title="Editar venda">✏️</button>
												<button className="btn-concluir" onClick={() => handleConcluirVenda(s.id)} title="Concluir venda">✓</button>
												<button className="btn-cancelar" onClick={() => handleCancelarVenda(s.id, false)} title="Cancelar venda">✕</button>
											</>
										)}
										{s.status === "CONCLUÍDA" && (
											<button className="btn-estornar" onClick={() => handleCancelarVenda(s.id, true)} title="Estornar venda">↩</button>
										)}
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			<Pagination
				totalItems={totalItems}
				pageSize={pageSize}
				currentPage={currentPage}
				onPageChange={(p) => setPage(p)}
			/>

			{selected && (
				<div className="modal-overlay" onClick={() => setSelected(null)}>
					<div className="modal-container visualizar-venda-modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Detalhes da Venda #{selected.id}</h2>
							<button className="btn-close-modal" onClick={() => setSelected(null)}>&times;</button>
						</div>
						
						<div className="modal-body-visualizar">
							<div className="venda-info-grid">
								<div className="info-item">
									<span className="info-label">Cliente</span>
									<span className="info-value">{selected.customer}</span>
								</div>
								<div className="info-item">
									<span className="info-label">Data</span>
									<span className="info-value">{new Date(selected.date).toLocaleString('pt-BR')}</span>
								</div>
								<div className="info-item">
									<span className="info-label">Vendedor</span>
									<span className="info-value">{selected.seller}</span>
								</div>
								<div className="info-item">
									<span className="info-label">Pagamento</span>
									<span className="info-value">
										{getPaymentIcon(selected.payment)} {selected.payment}
									</span>
								</div>
								<div className="info-item">
									<span className="info-label">Status</span>
									<span className={`status status-${selected.status.toLowerCase()}`}>{selected.status}</span>
								</div>
								<div className="info-item">
									<span className="info-label">Total</span>
									<span className="info-value info-total">{formatCurrency(selected.total)}</span>
								</div>
							</div>

							{selected.notes && (
								<div className="observacoes-box">
									<strong>Observações:</strong>
									<p>{selected.notes}</p>
								</div>
							)}

							{(selected.status === "CANCELADA" || selected.status === "ESTORNADA") && selected.motivoCancelamento && (
								<div className="cancelamento-info">
									<p>
										<strong>{selected.status === "ESTORNADA" ? '🔄 Motivo do Estorno:' : '❌ Motivo do Cancelamento:'}</strong> {selected.motivoCancelamento}
									</p>
									<p>
										<strong>Data:</strong> {new Date(selected.dataCancelamento).toLocaleString('pt-BR')}
									</p>
									{selected.status === "ESTORNADA" && (
										<p style={{ fontStyle: 'italic', fontSize: '13px', marginTop: '8px' }}>
											⚠️ Esta venda foi estornada após conclusão
										</p>
									)}
								</div>
							)}

							<div className="itens-venda-section">
								<h3>Itens da Venda ({selected.items.length})</h3>
								{selected.items.length > 0 ? (
									<table className="tabela-itens-modal">
										<thead>
											<tr>
												<th>SKU</th>
												<th>Produto</th>
												<th>Qtd</th>
												<th>Preço Unit.</th>
												<th>Subtotal</th>
											</tr>
										</thead>
										<tbody>
											{selected.items.map((it, idx) => (
												<tr key={idx}>
													<td>{it.sku || '-'}</td>
													<td>{it.name}</td>
													<td>{it.qty}</td>
													<td>{formatCurrency(it.unitPrice)}</td>
													<td>{formatCurrency(it.qty * it.unitPrice)}</td>
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<p className="empty-items">Nenhum item cadastrado nesta venda.</p>
								)}
							</div>
						</div>

						<div className="modal-footer">
							<button className="btn-secondary" onClick={() => setSelected(null)}>Fechar</button>
						</div>
					</div>
				</div>
			)}
			</div> {/* Fecha vendas-container */}

			<NovaVenda 
				isOpen={isNovaVendaOpen} 
				onClose={handleCloseModal} 
				onSave={handleSaveVenda}
				vendaParaEditar={vendaParaEditar}
			/>
		</div>
	);
}

export default Vendas;
