import React from "react";
import "./Loading.css";

export default function Loading({ message = "Carregando..." }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-box">
        <div className="spinner" />
        {message && <div className="loading-message">{message}</div>}
      </div>
    </div>
  );
}
