import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./ResetPassword.css";
import { resetPassword as apiResetPassword } from "../../services/auth";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit = token && password.length >= 6 && password === confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido ou ausente.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas devem coincidir.");
      return;
    }

    try {
      setSubmitting(true);
      await apiResetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setError(err?.message || "Não foi possível redefinir a senha. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container" aria-busy={submitting}>
        <h1>Redefinir Senha</h1>

        {!token && (
          <div className="reset-warning">Link inválido ou expirado. Solicite novamente a recuperação de senha.</div>
        )}

        {success ? (
          <div className="reset-success">
            Senha alterada com sucesso! Redirecionando para o login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting || !token}
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={submitting || !token}
            />
            <button type="submit" disabled={submitting || !canSubmit}>
              {submitting ? "Salvando..." : "Salvar nova senha"}
            </button>
            {error && <div className="login-error">{error}</div>}
          </form>
        )}

        <div className="extra-links">
          <Link to="/" onClick={() => { try { localStorage.removeItem('token'); } catch {} }}>Voltar ao login</Link>
        </div>
      </div>
    </div>
  );
}
