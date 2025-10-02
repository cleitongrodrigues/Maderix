import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
      <div className="extra-links">
        <a href="#">Esqueci minha senha</a> | <a href="#">Criar conta</a>
      </div>
    </div>
  );
}

export default Login;
