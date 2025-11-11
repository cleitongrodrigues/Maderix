import React, { useEffect, useState } from "react";
import EmpresaForm from "./EmpresaForm";
import "./Empresa.css";
import sampleEmpresas from "./sampleEmpresas";
import Pagination from "../../components/Pagination/Pagination";
import ActionButtons from "../../components/ActionButtons";
import { empresasAPI } from "../../services/api";

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
    fetchEmpresas();
  }, []);

  async function fetchEmpresas() {
    setLoading(true);
    setError(null);
    try {
      console.log("🔵 Buscando empresas...");
      const data = await empresasAPI.listar();
      console.log("✅ Empresas carregadas:", data.length);
      setEmpresas(data);
    } catch (err) {
      console.error("❌ Erro ao buscar empresas:", err);
      setError("Não foi possível carregar empresas.");
      setEmpresas([]);
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
    const nome = emp.nmFantasia ?? emp.NM_Fantasia ?? 'esta empresa';
    if (!window.confirm(`Excluir empresa "${nome}"?`)) return;

    try {
      const id = emp.idEmpresa ?? emp.ID_Empresa;
      console.log("🔵 Excluindo empresa ID:", id);
      await empresasAPI.deletar(id);
      console.log("✅ Empresa excluída");
      setEmpresas((prev) => prev.filter((p) => (p.idEmpresa ?? p.ID_Empresa) !== id));
      alert("✅ Empresa excluída com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao excluir empresa:", err);
      alert("❌ Erro ao excluir empresa: " + (err.message || "Erro desconhecido"));
    }
  }

  // Handler para empresa salva
  function handleSaved(saved) {
    console.log('✅ Empresa salva:', saved);
    const id = saved.idEmpresa;
    setEmpresas((prev) => {
      const exists = prev.some((e) => (e.idEmpresa || e.ID_Empresa) === id);
      if (exists) {
        return prev.map((e) => ((e.idEmpresa || e.ID_Empresa) === id ? saved : e));
      }
      return [saved, ...prev];
    });
    setOpenForm(false);
    setSelected(null);
  }

  const filtered = empresas.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      String(e.nmFantasia ?? e.NM_Fantasia ?? "").toLowerCase().includes(s) ||
      String(e.cnpj ?? e.CNPJ ?? "").toLowerCase().includes(s) ||
      String(e.rzSocial ?? e.RZ_Social ?? "").toLowerCase().includes(s)
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
                <tr key={e.idEmpresa ?? e.ID_Empresa ?? e.id}>
                  <td>{e.idEmpresa ?? e.ID_Empresa ?? e.id}</td>
                  <td><strong>{e.nmFantasia ?? e.NM_Fantasia}</strong></td>
                  <td className="cnpj-cell">{formatarCNPJ(e.cnpj ?? e.CNPJ)}</td>
                  <td>{e.rzSocial ?? e.RZ_Social ?? '-'}</td>
                  <td>
                    {e.dataCadEmpresa ?? e.DT_Cad_Empresa 
                      ? new Date(e.dataCadEmpresa ?? e.DT_Cad_Empresa).toLocaleDateString('pt-BR') 
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
          onClose={() => setOpenForm(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default Empresa;
