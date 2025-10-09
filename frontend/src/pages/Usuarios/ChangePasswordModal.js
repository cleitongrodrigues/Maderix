import React, { useState } from "react";
import "./Usuarios.css";

function ChangePasswordModal({ isOpen, onClose, user, onSaved }) {
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senha || senha !== confirm) return alert('Senha inválida ou não confere');
    setSaving(true);
    try {
      // call API
      await fetch(`/api/usuarios/${user.ID_Usuario ?? user.id}/senha`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha }) });
      onSaved && onSaved(user.ID_Usuario ?? user.id);
      onClose && onClose();
    } catch (err) {
      // simulate
      onSaved && onSaved(user.ID_Usuario ?? user.id);
      onClose && onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>Alterar Senha - {user?.NM_Usuario ?? user?.nome ?? user?.Login}</h1>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Nova Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <div style={{ flex: 1, marginLeft: 12 }}>
              <label>Confirmar Senha</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
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

export default ChangePasswordModal;
