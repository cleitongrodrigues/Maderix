import React, { useState, useEffect } from "react";
import "./Clientes.css";

function ClienteForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [idEmpresa, setIdEmpresa] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Busca empresas para preencher select; fallback caso não haja backend
    async function fetchEmpresas() {
      try {
        const res = await fetch("/api/empresas");
        if (!res.ok) throw new Error("no-api");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setEmpresas(data);
        } else {
          setEmpresas([{ ID_Empresa: 1, NM_Fantasia: "Empresa Exemplo" }]);
        }
      } catch (err) {
        setEmpresas([{ ID_Empresa: 1, NM_Fantasia: "Empresa Exemplo" }]);
      }
    }

    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.NM_Cliente ?? initialData.nome ?? "");
      setTelefone(initialData.Tel_Cliente ?? initialData.tel ?? "");
      setEmail(initialData.Email ?? initialData.email ?? "");
      setIdEmpresa(initialData.ID_Empresa ?? initialData.idEmpresa ?? "");
    } else {
      setNome("");
      setTelefone("");
      setEmail("");
      setIdEmpresa(empresas[0]?.ID_Empresa ?? "");
    }
  }, [initialData, isOpen, empresas]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }
    if (!idEmpresa) {
      alert("Selecione uma empresa");
      return;
    }
    // Validação de email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Email inválido. Por favor, insira um email válido.");
      return;
    }

    setSaving(true);
    const payload = { ID_Empresa: idEmpresa, NM_Cliente: nome, Tel_Cliente: telefone, Email: email };

    try {
      const url = initialData ? `/api/clientes/${initialData.ID_Cliente ?? initialData.id ?? initialData.ID}` : "/api/clientes";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const created = await res.json();
      onSave && onSave(created);
      onClose && onClose();
    } catch (err) {
      // fallback: simulate created object
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const created = {
        ID_Cliente: initialData ? (initialData.ID_Cliente ?? initialData.id ?? fakeId) : fakeId,
        ID_Empresa: idEmpresa,
        NM_Cliente: nome,
        Tel_Cliente: telefone,
        Email: email,
        DT_Cad_Cliente: new Date().toISOString(),
      };
      onSave && onSave(created);
      onClose && onClose();
    } finally {
      setSaving(false);
    }
  };

  function formatPhone(v) {
    const nums = (v || "").replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container cliente-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "Editar Cliente" : "Novo Cliente"}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="empresa">Empresa *</label>
            <select 
              id="empresa" 
              value={idEmpresa} 
              onChange={(e) => setIdEmpresa(Number(e.target.value))}
              disabled={saving}
              required
            >
              <option value="">-- Selecione uma empresa --</option>
              {empresas.map((emp) => (
                <option key={emp.ID_Empresa ?? emp.id} value={emp.ID_Empresa ?? emp.id}>
                  {emp.NM_Fantasia ?? emp.nmFantasia ?? emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input 
              id="nome" 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              placeholder="Nome completo do cliente"
              disabled={saving}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input 
                id="telefone" 
                type="text" 
                value={telefone} 
                onChange={(e) => setTelefone(formatPhone(e.target.value))} 
                onBlur={(e) => setTelefone(formatPhone(e.target.value))} 
                placeholder="(11) 99999-9999"
                disabled={saving}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@exemplo.com"
                disabled={saving}
              />
            </div>
          </div>

          {initialData && initialData.DT_Cad_Cliente && (
            <div className="info-box">
              <strong>📅 Data de Cadastro:</strong> {new Date(initialData.DT_Cad_Cliente).toLocaleString('pt-BR')}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-small"></span> Salvando...
                </>
              ) : (
                initialData ? "Salvar Alterações" : "Cadastrar Cliente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteForm;
