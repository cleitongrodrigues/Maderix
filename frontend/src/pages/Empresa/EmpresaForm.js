import React, { useEffect, useState } from "react";
import "./Empresa.css";
import { empresasAPI } from "../../services/api";

export default function EmpresaForm({ empresa = null, onClose, onSaved }) {
  const [nmFantasia, setNmFantasia] = useState("");
  const [rzSocial, setRzSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (empresa) {
      setNmFantasia(empresa.nmFantasia ?? empresa.NM_Fantasia ?? "");
      setRzSocial(empresa.rzSocial ?? empresa.RZ_Social ?? "");
      setCnpj(empresa.cnpj ?? empresa.CNPJ ?? "");
    } else {
      setNmFantasia("");
      setRzSocial("");
      setCnpj("");
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

    setSaving(true);
    const payload = { 
      nmFantasia: nmFantasia.trim(), 
      rzSocial: rzSocial.trim(), 
      cnpj: cnpj.replace(/\D/g, '') || null
    };

    try {
      console.log("🔵 Salvando empresa:", payload);
      
      let saved;
      if (empresa) {
        const id = empresa.idEmpresa ?? empresa.ID_Empresa;
        saved = await empresasAPI.atualizar(id, payload);
        console.log("✅ Empresa atualizada:", saved);
      } else {
        saved = await empresasAPI.criar(payload);
        console.log("✅ Empresa criada:", saved);
      }
      
      alert(empresa ? "✅ Empresa atualizada com sucesso!" : "✅ Empresa cadastrada com sucesso!");
      onSaved && onSaved(saved);
      onClose && onClose();
    } catch (err) {
      console.error("❌ Erro ao salvar empresa:", err);
      alert("❌ Erro ao salvar: " + (err.message || "Erro desconhecido"));
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
            {isEdicao && (empresa.dataCadEmpresa ?? empresa.DT_Cad_Empresa) && (
              <div className="info-box">
                📅 Cadastrada em: {new Date(empresa.dataCadEmpresa ?? empresa.DT_Cad_Empresa).toLocaleDateString('pt-BR')} às {new Date(empresa.dataCadEmpresa ?? empresa.DT_Cad_Empresa).toLocaleTimeString('pt-BR')}
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
              <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Opcional - Deixe em branco se não houver CNPJ
              </small>
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
