import React, { useState, useEffect } from "react";
import "./Perfis.css";
import { DEFAULT_PERMISSIONS, PERMISSIONS_META } from '../../utils/permissions';

function PerfilForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [permissoes, setPermissoes] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.NM_Perfil ?? initialData.nome ?? "");
      setPermissoes(initialData.Permissoes ? [...initialData.Permissoes] : []);
    } else {
      setNome(''); setPermissoes([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const togglePerm = (p) => {
    setPermissoes((prev) => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return alert('Nome do perfil é obrigatório');
    setSaving(true);
    const payload = { NM_Perfil: nome, Permissoes: permissoes };
    try {
      const url = initialData ? `/api/perfis/${initialData.ID_Perfil ?? initialData.id}` : '/api/perfis';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Status ' + res.status);
      const saved = await res.json();
      onSave && onSave(saved);
      onClose && onClose();
    } catch (err) {
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const saved = { ID_Perfil: initialData ? (initialData.ID_Perfil ?? initialData.id) : fakeId, NM_Perfil: nome, Permissoes: permissoes };
      onSave && onSave(saved);
      onClose && onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>{initialData ? 'Editar Perfil' : 'Novo Perfil'}</h1>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Permissões</label>
              <div className="permissions-grid">
                {DEFAULT_PERMISSIONS.map(p => (
                  <label key={p} className="perm-item" title={PERMISSIONS_META[p]?.description ?? ''}>
                    <input type="checkbox" checked={permissoes.includes(p)} onChange={() => togglePerm(p)} /> {PERMISSIONS_META[p]?.label ?? p}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="button-container" style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PerfilForm;
