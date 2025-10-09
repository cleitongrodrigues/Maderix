import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Autenticação stub: usuário admin / senha admin
    if (
      (email === "admin" || email === "admin@admin.com") &&
      password === "admin"
    ) {
      // Salva flag simples no localStorage
      localStorage.setItem("token", "stub-admin");
      // Redireciona para /home
      navigate("/home");
    } else {
      setError("Usuário ou senha inválidos. Use admin/admin para entrar.");
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <div className="login-error">{error}</div>}
      </form>
      <div className="extra-links">
        <a href="#">Esqueci minha senha</a> | <a href="#">Criar conta</a>
      </div>
    </div>
  );
}

export default Login;
