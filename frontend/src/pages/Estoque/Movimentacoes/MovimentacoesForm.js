import React, { useState, useEffect } from "react";
import "./Movimentacoes.css";

function MovimentacoesForm({ isOpen = true, onClose, onSave, initialData = null }) {
  const [tipo, setTipo] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [data, setData] = useState("");
  const [usuario, setUsuario] = useState("");
  const [observacao, setObservacao] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTipo(initialData.Tipo || "");
      setProduto(initialData.Produto || "");
      setQuantidade(initialData.Quantidade ?? initialData.quantidade ?? 0);
      setData(initialData.Data ? new Date(initialData.Data).toISOString().slice(0, 16) : "");
      setUsuario(initialData.Usuario || "");
      setObservacao(initialData.Observacao || "");
    } else {
      setTipo(""); setProduto(""); setQuantidade(0); setData(""); setUsuario(""); setObservacao(""); setError("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!tipo || !produto || !usuario || !quantidade) {
      setError("Preencha Tipo, Produto, Quantidade e Usuário.");
      return;
    }

    const payload = {
      Tipo: tipo,
      Produto: produto,
      Quantidade: Number(quantidade),
      Data: data ? new Date(data).toISOString() : new Date().toISOString(),
      Usuario: usuario,
      Observacao: observacao,
    };

    // preserve ID when editing
    if (initialData && (initialData.ID_Mov ?? initialData.id)) payload.ID_Mov = initialData.ID_Mov ?? initialData.id;

    onSave && onSave(payload);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content movimentacoes-form modal-content-small">
        <div className="modal-header">
          <h3>{initialData ? 'Editar Movimentação' : 'Nova Movimentação'}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <form className="empresa-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">-- selecione --</option>
                <option value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
                <option value="Ajuste">Ajuste</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label>Produto</label>
              <input value={produto} onChange={(e) => setProduto(e.target.value)} />
            </div>
            <div style={{ width: 120 }}>
              <label>Quantidade</label>
              <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Data</label>
              <input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Usuário</label>
              <input value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Observação</label>
              <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={3} />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn-small" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovimentacoesForm;
