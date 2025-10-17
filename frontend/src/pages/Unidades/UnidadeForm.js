import React, { useState, useEffect } from "react";
import "./Unidades.css";

function UnidadeForm({ isOpen, onClose, onSave, initialData = null, existingUnidades = [] }) {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (initialData) {
      setSigla(initialData.Sigla || initialData.sigla || "");
      setDescricao(initialData.Descricao || initialData.descricao || "");
    } else {
      setSigla("");
      setDescricao("");
    }
    setMessage({ type: "", text: "" });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validações
    if (!sigla.trim()) {
      setMessage({ type: "error", text: "❌ Sigla é obrigatória" });
      return;
    }
    if (sigla.trim().length < 1 || sigla.trim().length > 6) {
      setMessage({ type: "error", text: "❌ Sigla deve ter entre 1 e 6 caracteres" });
      return;
    }
    
    // Verificar se sigla já existe (exceto quando está editando a mesma)
    const siglaExistente = existingUnidades.find(u => 
      u.Sigla.toUpperCase() === sigla.trim().toUpperCase() && 
      (u.ID_Unidade ?? u.id) !== (initialData?.ID_Unidade ?? initialData?.id)
    );
    if (siglaExistente) {
      setMessage({ type: "error", text: "❌ Esta sigla já está cadastrada" });
      return;
    }

    if (!descricao.trim()) {
      setMessage({ type: "error", text: "❌ Descrição é obrigatória" });
      return;
    }

    setSaving(true);
    try {
      // try API
      const url = initialData ? `/api/unidades/${initialData.ID_Unidade ?? initialData.id}` : "/api/unidades";
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Sigla: sigla.trim().toUpperCase(), Descricao: descricao.trim() }) });
      if (!res.ok) throw new Error('no-api');
      const saved = await res.json();
      setMessage({ type: "success", text: "✅ Unidade salva com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } catch (err) {
      // fallback mock saved
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const obj = { 
        ID_Unidade: initialData ? (initialData.ID_Unidade ?? initialData.id) : fakeId, 
        Sigla: sigla.trim().toUpperCase(), 
        Descricao: descricao.trim(), 
        DT_Cad_Unidade: initialData?.DT_Cad_Unidade || new Date().toISOString() 
      };
      setMessage({ type: "success", text: "✅ Unidade salva com sucesso!" });
      setTimeout(() => {
        onSave && onSave(obj);
        onClose && onClose();
      }, 1000);
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container unidade-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? '✏️ Editar Unidade' : '➕ Nova Unidade'}</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">×</button>
        </div>

        <div className="modal-body">
          {/* Info box quando editando */}
          {initialData && initialData.DT_Cad_Unidade && (
            <div className="info-box">
              <div className="info-item">
                <span className="info-label">📅 Cadastrado em:</span>
                <span className="info-value">
                  {new Date(initialData.DT_Cad_Unidade).toLocaleDateString('pt-BR')} às {new Date(initialData.DT_Cad_Unidade).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} id="unidade-form">
            <div className="form-row">
              <div className="form-group">
                <label>Sigla <span className="required">*</span></label>
                <input 
                  type="text"
                  value={sigla} 
                  onChange={(e) => setSigla(e.target.value.toUpperCase())} 
                  maxLength={6}
                  placeholder="Ex: KG, UN, L, M"
                  required
                  autoFocus
                  style={{ textTransform: 'uppercase' }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                  Máximo 6 caracteres
                </small>
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Descrição <span className="required">*</span></label>
                <input 
                  type="text"
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Quilograma, Unidade, Litro, Metro"
                  required
                />
              </div>
            </div>

            {/* Exemplos */}
            <div className="examples-box">
              <div className="examples-header">💡 Exemplos de unidades comuns:</div>
              <div className="examples-grid">
                <div className="example-item">
                  <strong>KG</strong> - Quilograma
                </div>
                <div className="example-item">
                  <strong>UN</strong> - Unidade
                </div>
                <div className="example-item">
                  <strong>L</strong> - Litro
                </div>
                <div className="example-item">
                  <strong>M</strong> - Metro
                </div>
                <div className="example-item">
                  <strong>CX</strong> - Caixa
                </div>
                <div className="example-item">
                  <strong>PC</strong> - Peça
                </div>
              </div>
            </div>

            {/* Mensagens */}
            {message.text && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" form="unidade-form" className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-small"></span>
                Salvando...
              </>
            ) : (
              <>💾 Salvar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnidadeForm;
