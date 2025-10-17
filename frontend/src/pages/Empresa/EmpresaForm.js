import React, { useEffect, useState } from "react";
import "./Empresa.css";

export default function EmpresaForm({ empresa = null, onClose, onSaved, mock = false }) {
  const [nmFantasia, setNmFantasia] = useState("");
  const [rzSocial, setRzSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (empresa) {
      setNmFantasia(empresa.NM_Fantasia ?? empresa.nmFantasia ?? "");
      setRzSocial(empresa.RZ_Social ?? empresa.rz_Social ?? "");
      setCnpj(empresa.CNPJ ?? empresa.cnpj ?? "");
      setEndereco(empresa.Endereco ?? empresa.endereco ?? "");
      setTelefone(empresa.Telefone ?? empresa.telefone ?? "");
      setEmail(empresa.Email ?? empresa.email ?? "");
    } else {
      setNmFantasia("");
      setRzSocial("");
      setCnpj("");
      setEndereco("");
      setTelefone("");
      setEmail("");
    }
  }, [empresa]);

  function validarCnpj(valor) {
    // Validação simples apenas para formato e dígitos: remove não-dígitos e checa comprimento
    const nums = (valor || "").replace(/\D/g, "");
    return nums.length === 14;
  }

  function formatCnpj(value) {
    const nums = (value || "").replace(/\D/g, "").slice(0, 14);
    let v = nums;
    if (v.length > 12) v = v.replace(/^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2}).*$/, "$1.$2.$3/$4-$5");
    else if (v.length > 8) v = v.replace(/^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{0,4}).*$/, "$1.$2.$3/$4");
    else if (v.length > 5) v = v.replace(/^([0-9]{2})([0-9]{3})([0-9]{0,3}).*$/, "$1.$2.$3");
    else if (v.length > 2) v = v.replace(/^([0-9]{2})([0-9]{0,3}).*$/, "$1.$2");
    return v;
  }

  function formatTelefone(v) {
    const nums = (v || "").replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validações
    if (!nmFantasia.trim()) {
      alert("❌ Nome fantasia é obrigatório!");
      return;
    }
    if (!rzSocial.trim()) {
      alert("❌ Razão social é obrigatória!");
      return;
    }
    if (cnpj && !validarCnpj(cnpj)) {
      alert("❌ CNPJ inválido! Deve conter 14 dígitos.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("❌ Email inválido!");
      return;
    }

    setSaving(true);
    const payload = { 
      NM_Fantasia: nmFantasia.trim(), 
      RZ_Social: rzSocial.trim(), 
      CNPJ: cnpj.replace(/\D/g, '') || null,
      Endereco: endereco.trim() || null,
      Telefone: telefone.replace(/\D/g, '') || null,
      Email: email.trim() || null
    };

    try {
      const url = empresa ? `/api/empresas/${empresa.ID_Empresa ?? empresa.id}` : "/api/empresas";
      const method = empresa ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }
      const saved = await res.json();
      alert(empresa ? "✅ Empresa atualizada com sucesso!" : "✅ Empresa cadastrada com sucesso!");
      onSaved && onSaved(saved);
      onClose && onClose();
    } catch (err) {
      alert("❌ Erro ao salvar: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  const isEdicao = !!empresa;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container empresa-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdicao ? "✏️ Editar Empresa" : "🏢 Nova Empresa"}</h2>
          <button className="btn-close" onClick={onClose} disabled={saving}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Informação de cadastro (apenas na edição) */}
            {isEdicao && empresa.DT_Cad_Empresa && (
              <div className="info-box">
                📅 Cadastrada em: {new Date(empresa.DT_Cad_Empresa).toLocaleDateString('pt-BR')} às {new Date(empresa.DT_Cad_Empresa).toLocaleTimeString('pt-BR')}
              </div>
            )}

            {/* Linha 1: Nome Fantasia e Razão Social */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nmFantasia">Nome Fantasia *</label>
                <input
                  id="nmFantasia"
                  type="text"
                  value={nmFantasia}
                  onChange={(e) => setNmFantasia(e.target.value)}
                  placeholder="Ex: Maderix Ltda"
                  maxLength={150}
                  disabled={saving}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="rzSocial">Razão Social *</label>
                <input
                  id="rzSocial"
                  type="text"
                  value={rzSocial}
                  onChange={(e) => setRzSocial(e.target.value)}
                  placeholder="Ex: Maderix Comércio Ltda"
                  maxLength={150}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            {/* Linha 2: CNPJ */}
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                id="cnpj"
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                onBlur={(e) => setCnpj(formatCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                disabled={saving}
              />
            </div>

            {/* Linha 3: Endereço */}
            <div className="form-group">
              <label htmlFor="endereco">Endereço Completo</label>
              <input
                id="endereco"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro, cidade - UF"
                disabled={saving}
              />
            </div>

            {/* Linha 4: Telefone e Email */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                  onBlur={(e) => setTelefone(formatTelefone(e.target.value))}
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
                  placeholder="contato@empresa.com"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

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
                isEdicao ? "💾 Salvar Alterações" : "🏢 Cadastrar Empresa"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
