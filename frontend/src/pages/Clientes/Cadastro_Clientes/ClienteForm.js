import React, { useState, useEffect } from "react";
import "./Clientes.css";
import { clientesAPI } from "../../../services/api";
import { empresasAPI } from "../../../services/api";

function ClienteForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [idEmpresa, setIdEmpresa] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Busca empresas para preencher select
    async function fetchEmpresas() {
      try {
        console.log("🔵 Buscando empresas...");
        const data = await empresasAPI.listar();
        console.log("✅ Empresas carregadas:", data.length);
        if (Array.isArray(data) && data.length > 0) {
          setEmpresas(data);
        } else {
          // Fallback caso não haja empresas
          setEmpresas([{ idEmpresa: 1, nmFantasia: "Empresa Padrão" }]);
        }
      } catch (err) {
        console.error("❌ Erro ao buscar empresas:", err);
        setEmpresas([{ idEmpresa: 1, nmFantasia: "Empresa Padrão" }]);
      }
    }

    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nmCliente ?? initialData.NM_Cliente ?? "");
      setTelefone(initialData.telCliente ?? initialData.Tel_Cliente ?? "");
      setEmail(initialData.email ?? initialData.Email ?? "");
      setIdEmpresa(initialData.idEmpresa ?? initialData.ID_Empresa ?? "");
    } else {
      setNome("");
      setTelefone("");
      setEmail("");
      setIdEmpresa(empresas[0]?.idEmpresa ?? empresas[0]?.ID_Empresa ?? "");
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
    const payload = { idEmpresa: idEmpresa, nmCliente: nome, telCliente: telefone, email: email };

    try {
      console.log("🔵 Salvando cliente:", payload);
      
      let saved;
      if (initialData) {
        // Editando cliente existente
        const id = initialData.idCliente ?? initialData.ID_Cliente;
        saved = await clientesAPI.atualizar(id, payload);
        console.log("✅ Cliente atualizado:", saved);
      } else {
        // Criando novo cliente
        saved = await clientesAPI.criar(payload);
        console.log("✅ Cliente criado:", saved);
      }
      
      onSave && onSave(saved);
      onClose && onClose();
      alert(initialData ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao salvar cliente:", err);
      alert("Erro ao salvar cliente: " + (err.message || "Erro desconhecido"));
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
                <option key={emp.idEmpresa ?? emp.ID_Empresa} value={emp.idEmpresa ?? emp.ID_Empresa}>
                  {emp.nmFantasia ?? emp.NM_Fantasia ?? emp.name}
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

          {initialData && initialData.dataCadCliente && (
            <div className="info-box">
              <strong>📅 Data de Cadastro:</strong> {new Date(initialData.dataCadCliente).toLocaleString('pt-BR')}
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
