import React, { useEffect, useState } from "react";
import "./Empresa.css";

export default function EmpresaForm({ empresa = null, onClose, onSaved }) {
  const [nmFantasia, setNmFantasia] = useState("");
  const [rzSocial, setRzSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (empresa) {
      setNmFantasia(empresa.NM_Fantasia ?? empresa.nmFantasia ?? "");
      setRzSocial(empresa.RZ_Social ?? empresa.rz_Social ?? "");
      setCnpj(empresa.CNPJ ?? empresa.cnpj ?? "");
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
    if (!nmFantasia.trim()) return alert("Nome fantasia é obrigatório");
    if (cnpj && !validarCnpj(cnpj)) return alert("CNPJ inválido (use 14 dígitos)");

    setSaving(true);
    const payload = { NM_Fantasia: nmFantasia.trim(), RZ_Social: rzSocial.trim() || null, CNPJ: cnpj || null };

    try {
      const url = empresa ? `/api/empresas/${empresa.ID_Empresa ?? empresa.id}` : "/api/empresas";
      const method = empresa ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }
      const saved = await res.json();
      onSaved && onSaved(saved);
      onClose && onClose();
    } catch (err) {
      alert("Erro ao salvar: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>{empresa ? "Editar Empresa" : "Nova Empresa"}</h1>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="empresa-form">
          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Nome fantasia*</label>
              <input value={nmFantasia} onChange={(e) => setNmFantasia(e.target.value)} maxLength={150} required />
            </div>
          </div>

          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Razão social</label>
              <input value={rzSocial} onChange={(e) => setRzSocial(e.target.value)} maxLength={150} />
            </div>
          </div>

          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>CNPJ</label>
              <input value={cnpj} onChange={(e) => setCnpj(formatCnpj(e.target.value))} onBlur={(e) => setCnpj(formatCnpj(e.target.value))} placeholder="Somente dígitos ou formatado" />
            </div>
          </div>

          {empresa && (
            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label>Data de cadastro</label>
                <div>{empresa.DT_Cad_Empresa ? new Date(empresa.DT_Cad_Empresa).toLocaleString() : ""}</div>
              </div>
            </div>
          )}

          <div className="button-container" style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
