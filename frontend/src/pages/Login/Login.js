import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../../components/Loading/Loading";
import { forgotPassword as apiForgotPassword } from "../../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const navigate = useNavigate();
  
  // Ao entrar na tela de login, garantimos que a sessão seja limpa
  useEffect(() => {
    try { localStorage.removeItem('token'); } catch {}
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // Autenticação stub: usuário admin / senha admin
    // Simula um pequeno delay de rede para mostrar o spinner
    setTimeout(() => {
      if ((email === "admin" || email === "admin@admin.com") && password === "admin") {
        localStorage.setItem("token", "stub-admin");
        navigate("/home");
      } else {
        setError("Usuário ou senha inválidos. Use admin/admin para entrar.");
      }
      setSubmitting(false);
    }, 700);
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
      await apiForgotPassword(forgotEmail);
      setForgotMessage("Se existir uma conta com este email, enviaremos instruções para redefinir a senha.");
    } catch (err) {
      // Mantém mensagem genérica para não vazar existência do email
      setForgotMessage("Se existir uma conta com este email, enviaremos instruções para redefinir a senha.");
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
              {forgotMessage && <div className="forgot-message">{forgotMessage}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
