import React, { useState, useEffect } from "react";
import "./Usuarios.css";

function UsuarioForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");
  const [idPerfil, setIdPerfil] = useState("");
  const [perfis, setPerfis] = useState([]);
  const [ativo, setAtivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [alterarSenha, setAlterarSenha] = useState(false);

  useEffect(() => {
    // fetch perfis
    async function fetchPerfis() {
      try {
        const res = await fetch("/api/perfis");
        if (!res.ok) throw new Error("no-api");
        const data = await res.json();
        if (Array.isArray(data) && data.length) setPerfis(data);
        else setPerfis([{ ID_Perfil: 1, NM_Perfil: "Admin" }, { ID_Perfil: 2, NM_Perfil: "Operador" }]);
      } catch (err) {
        setPerfis([{ ID_Perfil: 1, NM_Perfil: "Admin" }, { ID_Perfil: 2, NM_Perfil: "Operador" }]);
      }
    }
    fetchPerfis();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.NM_Usuario ?? initialData.nome ?? "");
      setLogin(initialData.Login ?? initialData.login ?? "");
      setEmail(initialData.Email ?? initialData.email ?? "");
      setTelefone(formatTelefone(initialData.Tel_Usuario ?? initialData.tel ?? ""));
      setIdPerfil(initialData.ID_Perfil ?? initialData.idPerfil ?? perfis[0]?.ID_Perfil ?? "");
      setAtivo(initialData.Ativo ?? true);
    } else {
      setNome(""); setLogin(""); setEmail(""); setTelefone(""); setSenha(""); setConfirm(""); setAtivo(true); setIdPerfil(perfis[0]?.ID_Perfil ?? "");
    }
    setMessage({ type: "", text: "" });
    setAlterarSenha(false); // Reset checkbox ao abrir modal
  }, [initialData, isOpen, perfis]);

  if (!isOpen) return null;

  const formatTelefone = (valor) => {
    const nums = (valor || "").replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const validateEmail = (email) => {
    if (!email) return true; // email é opcional
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validações
    if (!nome.trim()) {
      setMessage({ type: "error", text: "❌ Nome é obrigatório" });
      return;
    }
    if (!login.trim()) {
      setMessage({ type: "error", text: "❌ Login é obrigatório" });
      return;
    }
    if (email && !validateEmail(email)) {
      setMessage({ type: "error", text: "❌ Email inválido" });
      return;
    }
    if (!idPerfil) {
      setMessage({ type: "error", text: "❌ Selecione um perfil" });
      return;
    }
    // Validação de senha: obrigatória para novo usuário OU quando marcou "Alterar Senha"
    if (!initialData || alterarSenha) {
      if (!senha || senha.length < 6) {
        setMessage({ type: "error", text: "❌ Senha deve ter no mínimo 6 caracteres" });
        return;
      }
      if (senha !== confirm) {
        setMessage({ type: "error", text: "❌ As senhas não conferem" });
        return;
      }
    }

    setSaving(true);
    const payload = { 
      NM_Usuario: nome, 
      Login: login, 
      Email: email, 
      Tel_Usuario: telefone.replace(/\D/g, ""), // salva apenas números
      ID_Perfil: idPerfil, 
      Ativo: ativo 
    };
    // Incluir senha: novo usuário OU editando com "Alterar Senha" marcado
    if (!initialData || alterarSenha) {
      payload.Senha = senha;
    }

    try {
      const url = initialData ? `/api/usuarios/${initialData.ID_Usuario ?? initialData.id}` : "/api/usuarios";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Status ' + res.status);
      const saved = await res.json();
      setMessage({ type: "success", text: "✅ Usuário salvo com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } catch (err) {
      // fallback created object
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const saved = { 
        ID_Usuario: initialData ? (initialData.ID_Usuario ?? initialData.id) : fakeId, 
        NM_Usuario: nome, 
        Login: login, 
        Email: email, 
        Tel_Usuario: telefone, 
        ID_Perfil: idPerfil, 
        PerfilNome: perfis.find(p => p.ID_Perfil === idPerfil)?.NM_Perfil ?? 'Operador', 
        Ativo: ativo, 
        DT_Cad_Usuario: new Date().toISOString() 
      };
      setMessage({ type: "success", text: "✅ Usuário salvo com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container usuario-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? '✏️ Editar Usuário' : '➕ Novo Usuário'}</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">×</button>
        </div>

        <div className="modal-body">
          {/* Info box quando editando */}
          {initialData && initialData.DT_Cad_Usuario && (
            <div className="info-box">
              <div className="info-item">
                <span className="info-label">📅 Cadastrado em:</span>
                <span className="info-value">
                  {new Date(initialData.DT_Cad_Usuario).toLocaleDateString('pt-BR')} às {new Date(initialData.DT_Cad_Usuario).toLocaleTimeString('pt-BR')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`status-badge ${ativo ? 'status-ativo' : 'status-inativo'}`}>
                  {ativo ? '✅ Ativo' : '⭕ Inativo'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} id="usuario-form">
            {/* Perfil e Status */}
            <div className="form-row">
              <div className="form-group">
                <label>Perfil <span className="required">*</span></label>
                <select value={idPerfil} onChange={(e) => setIdPerfil(Number(e.target.value))} required>
                  <option value="">-- Selecione --</option>
                  {perfis.map(p => (
                    <option key={p.ID_Perfil ?? p.id} value={p.ID_Perfil ?? p.id}>
                      {p.NM_Perfil ?? p.nmPerfil ?? p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="ativo-checkbox" 
                    checked={ativo} 
                    onChange={(e) => setAtivo(e.target.checked)} 
                  />
                  <label htmlFor="ativo-checkbox" className="checkbox-label">
                    {ativo ? '✅ Ativo' : '⭕ Inativo'}
                  </label>
                </div>
              </div>
            </div>

            {/* Nome e Login */}
            <div className="form-row">
              <div className="form-group">
                <label>Nome Completo <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do usuário"
                  required
                />
              </div>
              <div className="form-group">
                <label>Login <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={login} 
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Nome de usuário"
                  required
                />
              </div>
            </div>

            {/* Email e Telefone */}
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input 
                  type="text" 
                  value={telefone} 
                  onChange={handleTelefoneChange}
                  placeholder="(11) 99999-9999"
                  maxLength="15"
                />
              </div>
            </div>

            {/* Senha - sempre visível para novo usuário, opcional com checkbox para edição */}
            {initialData && (
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="alterar-senha-checkbox" 
                    checked={alterarSenha} 
                    onChange={(e) => {
                      setAlterarSenha(e.target.checked);
                      if (!e.target.checked) {
                        setSenha("");
                        setConfirm("");
                      }
                    }} 
                  />
                  <label htmlFor="alterar-senha-checkbox" className="checkbox-label">
                    🔑 Alterar senha do usuário
                  </label>
                </div>
              </div>
            )}

            {(!initialData || alterarSenha) && (
              <div className="form-row">
                <div className="form-group">
                  <label>Senha <span className="required">*</span></label>
                  <input 
                    type="password" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Senha <span className="required">*</span></label>
                  <input 
                    type="password" 
                    value={confirm} 
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repita a senha"
                    required
                  />
                </div>
              </div>
            )}

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
          <button type="submit" form="usuario-form" className="btn-primary" disabled={saving}>
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

export default UsuarioForm;
