import React, { useState, useEffect } from "react";
import "./Usuarios.css";
import { usuariosAPI, perfisAPI, empresasAPI } from "../../services/api";

function UsuarioForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirm, setConfirm] = useState("");
  const [idPerfil, setIdPerfil] = useState("");
  const [idEmpresa, setIdEmpresa] = useState("");
  const [perfis, setPerfis] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [ativo, setAtivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [alterarSenha, setAlterarSenha] = useState(false);

  useEffect(() => {
    // Busca perfis e empresas
    async function fetchData() {
      try {
        console.log("🔵 Buscando perfis...");
        const dataPerfis = await perfisAPI.listar();
        console.log("✅ Perfis carregados:", dataPerfis);
        setPerfis(Array.isArray(dataPerfis) ? dataPerfis : []);

        console.log("🔵 Buscando empresas...");
        const dataEmpresas = await empresasAPI.listar();
        console.log("✅ Empresas carregadas:", dataEmpresas);
        setEmpresas(Array.isArray(dataEmpresas) ? dataEmpresas : []);
      } catch (err) {
        console.error("❌ Erro ao buscar dados:", err);
        setPerfis([]);
        setEmpresas([]);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nmUsuario ?? initialData.NM_Usuario ?? "");
      setLogin(initialData.nmLogin ?? initialData.Login ?? "");
      setEmail(initialData.email ?? initialData.Email ?? "");
      setTelefone(formatTelefone(initialData.telUsuario ?? initialData.Tel_Usuario ?? ""));
      setIdPerfil(initialData.perfil?.idPerfil ?? initialData.ID_Perfil ?? perfis[0]?.idPerfil ?? perfis[0]?.ID_Perfil ?? "");
      setIdEmpresa(initialData.empresa?.idEmpresa ?? initialData.ID_Empresa ?? empresas[0]?.idEmpresa ?? empresas[0]?.ID_Empresa ?? "");
      setAtivo(initialData.ativo ?? initialData.Ativo ?? true);
    } else {
      setNome(""); 
      setLogin(""); 
      setEmail(""); 
      setTelefone(""); 
      setSenha(""); 
      setConfirm(""); 
      setAtivo(true); 
      setIdPerfil(perfis[0]?.idPerfil ?? perfis[0]?.ID_Perfil ?? "");
      setIdEmpresa(empresas[0]?.idEmpresa ?? empresas[0]?.ID_Empresa ?? "");
    }
    setMessage({ type: "", text: "" });
    setAlterarSenha(false); // Reset checkbox ao abrir modal
  }, [initialData, isOpen, perfis, empresas]);

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
    if (!idEmpresa) {
      setMessage({ type: "error", text: "❌ Selecione uma empresa" });
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
      nmUsuario: nome, 
      nmLogin: login, 
      email: email, 
      telUsuario: telefone.replace(/\D/g, ""), // salva apenas números
      idPerfil: idPerfil,
      idEmpresa: idEmpresa, 
      ativo: ativo 
    };
    // Incluir senha: novo usuário OU editando com "Alterar Senha" marcado
    if (!initialData || alterarSenha) {
      payload.senha = senha;
    }

    try {
      console.log("🔵 Salvando usuário:", payload);
      
      let saved;
      if (initialData) {
        // Editando usuário existente
        const id = initialData.idUsuario ?? initialData.ID_Usuario;
        saved = await usuariosAPI.atualizar(id, payload);
        console.log("✅ Usuário atualizado:", saved);
      } else {
        // Criando novo usuário
        saved = await usuariosAPI.criar(payload);
        console.log("✅ Usuário criado:", saved);
      }
      
      setMessage({ type: "success", text: "✅ Usuário salvo com sucesso!" });
      setTimeout(() => {
        onSave && onSave(saved);
        onClose && onClose();
      }, 1000);
    } catch (err) {
      console.error("❌ Erro ao salvar usuário:", err);
      setMessage({ type: "error", text: "❌ Erro ao salvar usuário: " + (err.message || "Erro desconhecido") });
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
          {initialData && initialData.dataCadUsuario && (
            <div className="info-box">
              <div className="info-item">
                <span className="info-label">📅 Cadastrado em:</span>
                <span className="info-value">
                  {new Date(initialData.dataCadUsuario).toLocaleDateString('pt-BR')} às {new Date(initialData.dataCadUsuario).toLocaleTimeString('pt-BR')}
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
            {/* Empresa, Perfil e Status */}
            <div className="form-row">
              <div className="form-group">
                <label>Empresa <span className="required">*</span></label>
                <select value={idEmpresa} onChange={(e) => setIdEmpresa(Number(e.target.value))} required>
                  <option value="">-- Selecione --</option>
                  {empresas.map(emp => (
                    <option key={emp.idEmpresa ?? emp.ID_Empresa} value={emp.idEmpresa ?? emp.ID_Empresa}>
                      {emp.nmFantasia ?? emp.NM_Fantasia ?? emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Perfil <span className="required">*</span></label>
                <select value={idPerfil} onChange={(e) => setIdPerfil(Number(e.target.value))} required>
                  <option value="">-- Selecione --</option>
                  {perfis.map(p => (
                    <option key={p.idPerfil ?? p.ID_Perfil} value={p.idPerfil ?? p.ID_Perfil}>
                      {p.nmPerfil ?? p.NM_Perfil ?? p.name}
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
