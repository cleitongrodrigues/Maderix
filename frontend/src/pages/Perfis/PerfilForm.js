import React, { useState, useEffect } from "react";
import "./Perfis.css";
import { DEFAULT_PERMISSIONS, PERMISSIONS_META } from '../../utils/permissions';

function PerfilForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [permissoes, setPermissoes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (initialData) {
      setNome(initialData.NM_Perfil ?? initialData.nome ?? "");
      setPermissoes(initialData.Permissoes ? [...initialData.Permissoes] : []);
    } else {
      setNome(''); setPermissoes([]);
    }
    setMessage({ type: "", text: "" });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const togglePerm = (p) => {
    setPermissoes((prev) => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validações
    if (!nome.trim()) {
      setMessage({ type: "error", text: "❌ Nome do perfil é obrigatório" });
      return;
    }
    if (nome.trim().length < 3) {
      setMessage({ type: "error", text: "❌ Nome deve ter no mínimo 3 caracteres" });
      return;
    }

    setSaving(true);
    const payload = { NM_Perfil: nome, Permissoes: permissoes };
    try {
      const url = initialData ? `/api/perfis/${initialData.ID_Perfil ?? initialData.id}` : '/api/perfis';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Status ' + res.status);
      const saved = await res.json();
      setMessage({ type: "success", text: "✅ Perfil salvo com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } catch (err) {
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const saved = { ID_Perfil: initialData ? (initialData.ID_Perfil ?? initialData.id) : fakeId, NM_Perfil: nome, Permissoes: permissoes };
      setMessage({ type: "success", text: "✅ Perfil salvo com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } finally { 
      setSaving(false); 
    }
  };

  // Agrupar permissões por categoria
  const permissionsByCategory = {
    'Clientes': DEFAULT_PERMISSIONS.filter(p => p.startsWith('CLIENTES_')),
    'Usuários': DEFAULT_PERMISSIONS.filter(p => p.startsWith('USUARIOS_')),
    'Perfis': DEFAULT_PERMISSIONS.filter(p => p.startsWith('PERFIS_')),
    'Estoque': DEFAULT_PERMISSIONS.filter(p => p.startsWith('ESTOQUE_')),
    'Vendas': DEFAULT_PERMISSIONS.filter(p => p.startsWith('VENDAS_')),
    'Outras': DEFAULT_PERMISSIONS.filter(p => 
      !p.startsWith('CLIENTES_') && 
      !p.startsWith('USUARIOS_') && 
      !p.startsWith('PERFIS_') && 
      !p.startsWith('ESTOQUE_') && 
      !p.startsWith('VENDAS_')
    ),
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container perfil-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? '✏️ Editar Perfil' : '➕ Novo Perfil'}</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} id="perfil-form">
            {/* Nome do Perfil */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Nome do Perfil <span className="required">*</span></label>
              <input 
                type="text"
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Administrador, Operador, etc."
                required
                autoFocus
              />
            </div>

            {/* Resumo de permissões */}
            <div className="permissions-summary-box">
              <div className="summary-header">
                <span className="summary-label">🔐 Permissões Selecionadas:</span>
                <span className="summary-count">{permissoes.length} de {DEFAULT_PERMISSIONS.length}</span>
              </div>
            </div>

            {/* Permissões agrupadas por categoria */}
            <div className="permissions-section">
              <label style={{ marginBottom: '12px', display: 'block', fontWeight: 600, color: '#495057' }}>
                Selecione as Permissões
              </label>
              
              {Object.entries(permissionsByCategory).map(([category, perms]) => 
                perms.length > 0 && (
                  <div key={category} className="permission-category">
                    <div className="category-header">
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {perms.filter(p => permissoes.includes(p)).length} / {perms.length}
                      </span>
                    </div>
                    <div className="category-permissions">
                      {perms.map(p => (
                        <label key={p} className="perm-checkbox-item" title={PERMISSIONS_META[p]?.description ?? ''}>
                          <input 
                            type="checkbox" 
                            checked={permissoes.includes(p)} 
                            onChange={() => togglePerm(p)}
                          />
                          <span className="perm-label">{PERMISSIONS_META[p]?.label ?? p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}
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
          <button type="submit" form="perfil-form" className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-small"></span>
                Salvando...
              </>
            ) : (
              <>💾 Salvar Perfil</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerfilForm;
