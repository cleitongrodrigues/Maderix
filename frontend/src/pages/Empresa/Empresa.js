import React, { useEffect, useState } from "react";
import EmpresaForm from "./EmpresaForm";
import "./Empresa.css";
import sampleEmpresas from "./sampleEmpresas";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";

const USE_MOCK = true;

function Empresa() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpj) => {
    if (!cnpj) return '-';
    const apenasNumeros = cnpj.replace(/\D/g, '');
    if (apenasNumeros.length !== 14) return cnpj;
    return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  useEffect(() => {
    if (USE_MOCK) {
      setEmpresas(sampleEmpresas);
    } else {
      fetchList();
    }
  }, []);

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/empresas");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      // if backend returns empty array, use sample data so UI shows records during frontend dev
      setEmpresas(Array.isArray(data) && data.length > 0 ? data : sampleEmpresas);
    } catch (err) {
      setError("Não foi possível carregar empresas. (fallback)");
      // fallback sample data
      setEmpresas(sampleEmpresas);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setSelected(null);
    setOpenForm(true);
  }

  function openEdit(empresa) {
    setSelected(empresa);
    setOpenForm(true);
  }

  async function handleDelete(emp) {
    if (!window.confirm(`Excluir empresa "${emp.NM_Fantasia}"?`)) return;
    if (USE_MOCK) {
      setEmpresas((prev) => prev.filter((p) => (p.ID_Empresa ?? p.id) !== (emp.ID_Empresa ?? emp.id)));
      return;
    }

    try {
      const res = await fetch(`/api/empresas/${emp.ID_Empresa ?? emp.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      alert("Empresa excluída com sucesso");
      fetchList();
    } catch (err) {
      alert("Erro ao excluir. (remova manualmente se necessário)");
    }
  }

  // default server-side saved handler
  function handleSaved() {
    setOpenForm(false);
    setSelected(null);
    fetchList();
  }

  // local/mock save handler (create or update in-memory)
  function handleSavedLocal(obj) {
    if (!obj) return;
    setEmpresas((prev) => {
      const id = obj.ID_Empresa ?? obj.id;
      if (id) {
        // update existing
        return prev.map((p) => ((p.ID_Empresa ?? p.id) === id ? { ...p, ...obj } : p));
      }
      // create new: generate next ID
      const nextId = prev.reduce((max, cur) => Math.max(max, cur.ID_Empresa ?? cur.id ?? 0), 0) + 1;
      const created = { ID_Empresa: nextId, ...obj, DT_Cad_Empresa: new Date().toISOString() };
      return [created, ...prev];
    });
    setOpenForm(false);
    setSelected(null);
  }

  const filtered = empresas.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      String(e.NM_Fantasia ?? e.nmFantasia ?? "").toLowerCase().includes(s) ||
      String(e.CNPJ ?? e.cnpj ?? "").toLowerCase().includes(s) ||
      String(e.RZ_Social ?? e.rz_Social ?? "").toLowerCase().includes(s)
    );
  });

  // Stats para os cards
  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.length; // Pode ser filtrado por status no futuro

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  return (
    <div className="pagina empresa-page">
      <div className="empresa-container">
        {/* Cabeçalho fixo */}
        <div className="empresa-cabecalho-fixo">
          <div className="titulo-empresa">
            <h1>🏢 Empresas</h1>
          </div>
        <div className="acoes-pagina">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome, CNPJ ou razão social..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn-primary" onClick={openNew}>
            <span className="btn-icon">+</span>
            Nova Empresa
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="linha-resumo card">
          <div className="card-summary">
            <span className="card-icon">🏢</span>
            <div className="card-content">
              <h3>Total de Empresas</h3>
              <p>{totalEmpresas}</p>
              <small>Cadastradas no sistema</small>
            </div>
          </div>
          <div className="card-summary">
            <span className="card-icon">✅</span>
            <div className="card-content">
              <h3>Empresas Ativas</h3>
              <p>{empresasAtivas}</p>
              <small>Em operação</small>
            </div>
          </div>
          <div className="card-summary">
            <span className="card-icon">📊</span>
            <div className="card-content">
              <h3>Resultados da Busca</h3>
              <p>{filtered.length}</p>
              <small>Empresas filtradas</small>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="loading-message">⏳ Carregando empresas...</div>}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* table wrapper like Clientes page to keep exact alignment and spacing */}
      <div className="card area-tabela">
        <table className="tabela-empresas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome Fantasia</th>
              <th>CNPJ</th>
              <th>Razão Social</th>
              <th>Data Cadastro</th>
              <th className="col-acoes">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="6">Nenhuma empresa encontrada.</td>
              </tr>
            ) : (
              pageData.map((e) => (
                <tr key={e.ID_Empresa ?? e.id}>
                  <td>{e.ID_Empresa ?? e.id}</td>
                  <td><strong>{e.NM_Fantasia ?? e.nmFantasia}</strong></td>
                  <td className="cnpj-cell">{formatarCNPJ(e.CNPJ ?? e.cnpj)}</td>
                  <td>{e.RZ_Social ?? e.rz_Social}</td>
                  <td>
                    {e.DT_Cad_Empresa 
                      ? new Date(e.DT_Cad_Empresa).toLocaleDateString('pt-BR') 
                      : "-"}
                  </td>
                  <td className="celula-acoes">
                    <div className="botoes-acao">
                      <ActionButtons
                        onEdit={() => openEdit(e)}
                        onDelete={() => handleDelete(e)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filtered.length}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        showCount={true}
      />
      </div> {/* Fecha empresa-container */}

      {openForm && (
        <EmpresaForm
          empresa={selected}
          mock={USE_MOCK}
          onClose={() => setOpenForm(false)}
          onSaved={USE_MOCK ? handleSavedLocal : handleSaved}
        />
      )}
    </div>
  );
}

export default Empresa;
