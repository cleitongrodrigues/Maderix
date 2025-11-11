import React, { useState, useEffect } from "react";
import "./Unidades.css";
import { unidadesAPI } from "../../services/api";

function UnidadeForm({ isOpen, onClose, onSave, initialData = null, existingUnidades = [] }) {
  const [sigla, setSigla] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (initialData) {
      setSigla(initialData.sigla ?? initialData.Sigla ?? "");
      setDescricao(initialData.descricao ?? initialData.Descricao ?? "");
      setAtivo(initialData.ativo ?? initialData.Ativo ?? true);
    } else {
      setSigla("");
      setDescricao("");
      setAtivo(true);
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
    if (sigla.trim().length < 1 || sigla.trim().length > 10) {
      setMessage({ type: "error", text: "❌ Sigla deve ter entre 1 e 10 caracteres" });
      return;
    }
    
    // Verificar se sigla já existe (exceto quando está editando a mesma)
    const siglaExistente = existingUnidades.find(u => {
      const uSigla = u.sigla ?? u.Sigla;
      const uId = u.idUnidade ?? u.ID_Unidade ?? u.id;
      const currentId = initialData?.idUnidade ?? initialData?.ID_Unidade ?? initialData?.id;
      return uSigla.toUpperCase() === sigla.trim().toUpperCase() && uId !== currentId;
    });
    if (siglaExistente) {
      setMessage({ type: "error", text: "❌ Esta sigla já está cadastrada" });
      return;
    }

    if (!descricao.trim()) {
      setMessage({ type: "error", text: "❌ Descrição é obrigatória" });
      return;
    }

    setSaving(true);
    const payload = { 
      sigla: sigla.trim().toUpperCase(), 
      descricao: descricao.trim(),
      ativo: ativo
    };

    try {
      console.log("🔵 Salvando unidade de medida:", payload);
      
      let saved;
      if (initialData) {
        const id = initialData.idUnidade ?? initialData.ID_Unidade;
        saved = await unidadesAPI.atualizar(id, payload);
        console.log("✅ Unidade atualizada:", saved);
      } else {
        saved = await unidadesAPI.criar(payload);
        console.log("✅ Unidade criada:", saved);
      }
      
      setMessage({ type: "success", text: "✅ Unidade salva com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } catch (err) {
      console.error("❌ Erro ao salvar unidade:", err);
      setMessage({ type: "error", text: "❌ Erro ao salvar: " + (err.message || "Erro desconhecido") });
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
          {initialData && (
            <div className="info-box">
              <div className="info-item">
                <span className="info-label">🆔 ID:</span>
                <span className="info-value">#{initialData.idUnidade ?? initialData.ID_Unidade}</span>
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
                  maxLength={10}
                  placeholder="Ex: KG, UN, L, M"
                  required
                  autoFocus
                  disabled={saving}
                  style={{ textTransform: 'uppercase' }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                  Máximo 10 caracteres
                </small>
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Descrição <span className="required">*</span></label>
                <input 
                  type="text"
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Quilograma, Unidade, Litro, Metro"
                  maxLength={50}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  disabled={saving}
                />
                <span>Unidade ativa</span>
              </label>
              <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block', marginLeft: '24px' }}>
                Desmarque para desativar a unidade (ela não aparecerá em cadastros)
              </small>
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
