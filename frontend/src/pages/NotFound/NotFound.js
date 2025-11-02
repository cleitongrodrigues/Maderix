import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const handleGoLogin = () => {
    try { localStorage.removeItem("token"); } catch {}
  };
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-code">404</div>
        <h1>Página não encontrada</h1>
        <p>
          A rota <code>{location.pathname}</code> não existe.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn-link primary" onClick={handleGoLogin}>Ir para Login</Link>
          {isAuthenticated && (
            <Link to="/home" className="btn-link">Ir para Home</Link>
          )}
        </div>
      </div>
    </div>
  );
}
