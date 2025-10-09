import React, { useState, useEffect } from "react";
import "./Unidades.css";

function UnidadeForm({ isOpen, onClose, onSave, initialData = null }) {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSigla(initialData.Sigla || initialData.sigla || "");
      setDescricao(initialData.Descricao || initialData.descricao || "");
    } else {
      setSigla("");
      setDescricao("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sigla.trim()) return alert('Sigla é obrigatória');
    setSaving(true);
    try {
      // try API
      const url = initialData ? `/api/unidades/${initialData.ID_Unidade ?? initialData.id}` : "/api/unidades";
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Sigla: sigla, Descricao: descricao }) });
      if (!res.ok) throw new Error('no-api');
      const saved = await res.json();
      onSave && onSave(saved);
      onClose && onClose();
    } catch (err) {
      // fallback mock saved
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const obj = { ID_Unidade: initialData ? (initialData.ID_Unidade ?? initialData.id) : fakeId, Sigla: sigla, Descricao: descricao, DT_Cad_Unidade: new Date().toISOString() };
      onSave && onSave(obj);
      onClose && onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>{initialData ? 'Editar Unidade' : 'Nova Unidade'}</h1>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Sigla</label>
              <input value={sigla} onChange={(e) => setSigla(e.target.value.toUpperCase())} maxLength={6} />
            </div>
            <div style={{ flex: 2, marginLeft: 12 }}>
              <label>Descrição</label>
              <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
          </div>

          {initialData && (
            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label>Data de Cadastro</label>
                <div>{initialData.DT_Cad_Unidade ? new Date(initialData.DT_Cad_Unidade).toLocaleString() : ''}</div>
              </div>
            </div>
          )}

          <div className="button-container" style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UnidadeForm;
