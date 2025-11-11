import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../../components/Loading/Loading";
import { login as apiLogin, forgotPassword as apiForgotPassword } from "../../services/auth";

function Login() {
  const [nmLogin, setNmLogin] = useState("");
  const [senhaPura, setSenhaPura] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    try {
      console.log("🔵 Tentando login com:", { nmLogin });
      
      // Chama API real
      const response = await apiLogin(nmLogin, senhaPura);
      
      console.log("✅ Login bem-sucedido:", response);
      
      // Salva token JWT
      if (response.token) {
        localStorage.setItem("token", response.token);
        console.log("✅ Token salvo no localStorage");
      } else {
        console.warn("⚠️ Resposta sem token:", response);
      }
      
      // Opcional: salvar dados do usuário
      if (response.usuario) {
        localStorage.setItem("usuario", JSON.stringify(response.usuario));
        console.log("✅ Dados do usuário salvos:", response.usuario);
      }
      
      navigate("/home");
    } catch (err) {
      console.error("❌ Erro ao fazer login:", err);
      console.error("❌ Status:", err.status);
      console.error("❌ Data:", err.data);
      
      // Mensagens de erro mais específicas
      let errorMessage = "Erro ao fazer login. ";
      
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        errorMessage = "❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080";
      } else if (err.status === 401) {
        errorMessage = "❌ Usuário ou senha incorretos. Verifique suas credenciais.";
      } else if (err.status === 400) {
        errorMessage = "❌ Dados inválidos: " + (err.data?.message || err.message);
      } else if (err.status === 500) {
        errorMessage = "❌ Erro no servidor. Tente novamente em alguns instantes.";
      } else {
        errorMessage = "❌ " + (err.message || "Erro desconhecido");
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  function openForgot(e) {
    e.preventDefault();
    setForgotMessage("");
    setForgotEmail("");
    setForgotOpen(true);
  }

  function closeForgot() {
    if (forgotSubmitting) return;
    setForgotOpen(false);
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotMessage("Informe um email válido.");
      return;
    }
    try {
      setForgotSubmitting(true);
      setForgotMessage("");
      setRecoveryToken("");
      
      const response = await apiForgotPassword(forgotEmail);
      
      // Mostra token retornado (apenas em desenvolvimento)
      if (response.token) {
        setRecoveryToken(response.token);
        setForgotMessage(`✅ ${response.mensagem}\n\n🔑 Token (copie para resetar senha):\n${response.token}`);
      } else {
        setForgotMessage(response.mensagem || "Instruções enviadas com sucesso.");
      }
    } catch (err) {
      console.error("Erro ao solicitar recuperação:", err);
      setForgotMessage(err.message || "Erro ao solicitar recuperação de senha.");
    } finally {
      setForgotSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      {submitting && <Loading message={"Validando credenciais..."} />}
      <div className="login-container" aria-busy={submitting}>
      <h1>Login</h1>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={nmLogin}
          onChange={(e) => setNmLogin(e.target.value)}
          disabled={submitting}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senhaPura}
          onChange={(e) => setSenhaPura(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting}>Entrar</button>
        {error && <div className="login-error">{error}</div>}
      </form>
      <div className="extra-links">
        <a href="#" onClick={openForgot}>Esqueci minha senha</a> | <a href="#">Criar conta</a>
      </div>
      </div>

      {forgotOpen && (
        <div className="forgot-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="forgot-title" onClick={closeForgot}>
          <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="forgot-modal-header">
              <h2 id="forgot-title">Redefinir senha</h2>
              <button className="forgot-close" onClick={closeForgot} aria-label="Fechar">✕</button>
            </div>
            <div className="forgot-modal-content">
              <p className="forgot-hint">Informe seu email e enviaremos instruções para redefinir sua senha.</p>
              <form onSubmit={handleForgotSubmit}>
                <input
                  type="email"
                  placeholder="Seu email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={forgotSubmitting}
                  className="forgot-input"
                  autoFocus
                />
                <button type="submit" className="forgot-submit" disabled={forgotSubmitting}>
                  {forgotSubmitting ? "Enviando..." : "Enviar instruções"}
                </button>
              </form>
              {forgotMessage && (
                <div className="forgot-message" style={{ whiteSpace: 'pre-wrap' }}>
                  {forgotMessage}
                </div>
              )}
              {recoveryToken && (
                <button 
                  className="forgot-submit" 
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(recoveryToken);
                    alert('Token copiado para a área de transferência!');
                  }}
                >
                  📋 Copiar Token
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
