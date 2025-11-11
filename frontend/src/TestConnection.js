import React, { useState } from "react";
import { API_BASE_URL } from "./services/http";

/**
 * Componente de teste de conexão com o backend
 * Adicione ao App.js temporariamente: import TestConnection from './TestConnection';
 * E use: <TestConnection />
 */
function TestConnection() {
  const [result, setResult] = useState("");
  const [testing, setTesting] = useState(false);

  async function testConnection() {
    setTesting(true);
    setResult("Testando conexão...");

    try {
      // Teste 1: Ping básico
      console.log("🔵 URL da API:", API_BASE_URL);
      setResult(`🔵 Testando conexão com: ${API_BASE_URL}\n\n`);

      // Teste 2: Tentar acessar endpoint público (se houver)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "teste@teste.com", senha: "teste123" }),
      });

      const data = await response.json().catch(() => null);

      let message = `✅ Servidor respondeu!\n`;
      message += `Status: ${response.status}\n`;
      message += `Status Text: ${response.statusText}\n`;
      message += `Response: ${JSON.stringify(data, null, 2)}\n\n`;

      if (response.status === 401) {
        message += "✅ Backend está funcionando! (Credenciais inválidas, mas servidor respondeu)\n";
      } else if (response.status === 200) {
        message += "✅ Backend está funcionando!\n";
      }

      setResult(message);
    } catch (err) {
      console.error("❌ Erro ao testar conexão:", err);
      let message = `❌ Erro ao conectar:\n\n`;
      message += `Erro: ${err.message}\n\n`;

      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        message += `⚠️ PROBLEMA IDENTIFICADO:\n`;
        message += `O backend não está respondendo em ${API_BASE_URL}\n\n`;
        message += `SOLUÇÕES:\n`;
        message += `1. Verifique se o backend está rodando (mvn spring-boot:run)\n`;
        message += `2. Verifique se está rodando na porta 8080\n`;
        message += `3. Verifique CORS no backend (WebSecurityConfig.java)\n`;
        message += `4. Verifique o firewall/antivírus\n`;
      }

      setResult(message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#fff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🔧 Teste de Conexão</h3>
      <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
        URL: <strong>{API_BASE_URL}</strong>
      </p>
      <button 
        onClick={testConnection} 
        disabled={testing}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {testing ? "Testando..." : "Testar Conexão"}
      </button>
      {result && (
        <pre style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '11px',
          maxHeight: '300px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {result}
        </pre>
      )}
    </div>
  );
}

export default TestConnection;
