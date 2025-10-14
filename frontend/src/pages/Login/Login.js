import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../../components/Loading/Loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
        <a href="#">Esqueci minha senha</a> | <a href="#">Criar conta</a>
      </div>
      </div>
    </div>
  );
}

export default Login;
