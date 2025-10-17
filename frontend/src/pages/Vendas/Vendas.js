import React, { useState, useMemo, useEffect } from "react";
import "./Vendas.css";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import TableSkeleton from "../../components/TableSkeleton/TableSkeleton";
import Highlight from "../../components/Highlight/Highlight";
import NovaVenda from "./NovaVenda/NovaVenda";

const mockSales = [
	{ id: 1001, date: "2025-10-01T09:12:00", customer: "João Silva", itemsCount: 3, total: 125.5, payment: "PIX", seller: "Maria", status: "CONCLUÍDA", notes: "Entrega rápida", items: [{ sku: "PEN-01", name: "Caneta Azul", qty: 2, unitPrice: 2.5 }, { sku: "NB-01", name: "Caderno 100 folhas", qty: 1, unitPrice: 120.5 }] },
	{ id: 1002, date: "2025-10-01T10:30:00", customer: "Empresa XYZ", itemsCount: 1, total: 450.0, payment: "Cartão", seller: "Carlos", status: "PENDENTE", notes: "Pagamento a confirmar", items: [{ sku: "MAT-10", name: "Tinta 1L", qty: 10, unitPrice: 45.0 }] },
	{ id: 1003, date: "2025-10-02T15:05:00", customer: "Ana Paula", itemsCount: 2, total: 39.9, payment: "Dinheiro", seller: "João", status: "CONCLUÍDA", notes: "", items: [{ sku: "GR-01", name: "Giz de cera", qty: 3, unitPrice: 9.9 }, { sku: "LB-02", name: "Lápis HB", qty: 2, unitPrice: 5.1 }] },
	{ id: 1004, date: "2025-10-03T08:50:00", customer: "Loja ABC", itemsCount: 5, total: 980.0, payment: "Boleto", seller: "Maria", status: "CANCELADA", notes: "Cancelada pelo cliente", items: [] },
	{ id: 1005, date: "2025-10-03T09:15:00", customer: "Pedro Rocha", itemsCount: 1, total: 19.99, payment: "PIX", seller: "Carlos", status: "CONCLUÍDA", notes: "Retirar no local", items: [{ sku: "BT-01", name: "Borracha", qty: 1, unitPrice: 19.99 }] },
	{ id: 1006, date: "2025-10-04T10:00:00", customer: "Cliente 6", itemsCount: 2, total: 49.5, payment: "PIX", seller: "Maria", status: "CONCLUÍDA", notes: "", items: [] },
	{ id: 1007, date: "2025-10-05T14:20:00", customer: "Cliente 7", itemsCount: 4, total: 200.0, payment: "Cartão", seller: "João", status: "PENDENTE", notes: "", items: [] },
	{ id: 1008, date: "2025-10-06T16:45:00", customer: "Cliente 8", itemsCount: 1, total: 9.99, payment: "Dinheiro", seller: "Carlos", status: "CONCLUÍDA", notes: "", items: [] },
	{ id: 1009, date: "2025-10-06T18:00:00", customer: "Cliente 9", itemsCount: 10, total: 1500.0, payment: "Boleto", seller: "Maria", status: "CONCLUÍDA", notes: "Pedido grande", items: [] },
	{ id: 1010, date: "2025-10-07T09:30:00", customer: "Cliente 10", itemsCount: 3, total: 75.25, payment: "PIX", seller: "Carlos", status: "CANCELADA", notes: "Estornada", items: [] }
];

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

	const [sales, setSales] = useState(mockSales);
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
