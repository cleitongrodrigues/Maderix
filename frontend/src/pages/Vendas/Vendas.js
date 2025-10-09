import React, { useState, useMemo } from "react";
import "./Vendas.css";
import Pagination from "../../components/Pagination/Pagination";

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

function Vendas() {
	const [sales] = useState(mockSales);
	const [filter, setFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [selected, setSelected] = useState(null);

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

	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * pageSize;
	const visible = filtered.slice(startIndex, startIndex + pageSize);

	return (
		<div className="page vendas-page">
			<h1>Vendas</h1>

			<div className="vendas-toolbar">
				<input
					placeholder="Buscar por ID, cliente ou vendedor..."
					value={filter}
					onChange={(e) => { setFilter(e.target.value); setPage(1); }}
				/>

				<div className="filters-row">
					<label>
						Status
						<select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
							<option value="">Todos</option>
							<option value="CONCLUÍDA">Concluída</option>
							<option value="PENDENTE">Pendente</option>
							<option value="CANCELADA">Cancelada</option>
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
			</div>

			<table className="vendas-table">
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
					{visible.map((s) => (
						<tr key={s.id} className={s.status === "CANCELADA" ? "muted" : ""}>
							<td>{s.id}</td>
							<td>{new Date(s.date).toLocaleString()}</td>
							<td>{s.customer}</td>
							<td>{s.itemsCount}</td>
							<td>{formatCurrency(s.total)}</td>
							<td>{s.payment}</td>
							<td>{s.seller}</td>
							<td>
								<span className={`status status-${s.status.toLowerCase()}`}>
									{s.status}
								</span>
							</td>
							<td>
								<button onClick={() => setSelected(s)}>Ver</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination
				totalItems={totalItems}
				pageSize={pageSize}
				currentPage={currentPage}
				onPageChange={(p) => setPage(p)}
			/>

			{selected && (
				<div className="modal" onClick={() => setSelected(null)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<h2>Venda #{selected.id}</h2>
						<p>
							<strong>Cliente:</strong> {selected.customer}
						</p>
						<p>
							<strong>Data:</strong> {new Date(selected.date).toLocaleString()}
						</p>
						<p>
							<strong>Total:</strong> {formatCurrency(selected.total)}
						</p>
						<h3>Itens</h3>
						<ul>
							{selected.items.map((it, idx) => (
								<li key={idx}>
									{it.qty}x {it.name} — {formatCurrency(it.unitPrice)}
								</li>
							))}
						</ul>
						<button onClick={() => setSelected(null)}>Fechar</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Vendas;
