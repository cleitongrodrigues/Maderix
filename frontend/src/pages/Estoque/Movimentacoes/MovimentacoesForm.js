import React, { useState, useEffect } from "react";
import { materiaisAPI, usuariosAPI } from "../../../services/api";
import "./Movimentacoes.css";

function MovimentacoesForm({ isOpen = true, onClose, onSave, initialData = null }) {
  const [tipo, setTipo] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [data, setData] = useState("");
  const [usuario, setUsuario] = useState("");
  const [observacao, setObservacao] = useState("");
  const [error, setError] = useState("");
  const [produtosList, setProdutosList] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);
    // Carrega lista de usuários ao abrir o modal
    useEffect(() => {
      async function fetchUsuarios() {
        try {
          const data = await usuariosAPI.listar();
          setUsuariosList(Array.isArray(data) ? data : []);
        } catch (err) {
          setUsuariosList([]);
        }
      }
      if (isOpen) fetchUsuarios();
    }, [isOpen]);
  // Carrega lista de produtos ao abrir o modal
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await materiaisAPI.listar();
        setProdutosList(Array.isArray(data) ? data : []);
      } catch (err) {
        setProdutosList([]);
      }
    }
    if (isOpen) fetchProdutos();
  }, [isOpen]);

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


    // Monta o payload conforme esperado pela API
    const payload = {
      tipoMovimento: tipo,
      idMaterial: produto ? Number(produto) : undefined,
      quantidade: Number(quantidade),
      dataMovimentacao: data ? new Date(data).toISOString() : new Date().toISOString(),
      idUsuario: usuario ? Number(usuario) : undefined,
      observacao: observacao,
    };

    // preserve ID when editing
    if (initialData && (initialData.ID_Mov ?? initialData.id)) payload.ID_Mov = initialData.ID_Mov ?? initialData.id;

    onSave && onSave(payload);
  }

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div className="product-modal-header">
          <h2>{initialData ? '✏️ Editar Movimentação' : '➕ Nova Movimentação'}</h2>
          <button className="product-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Conteúdo do Modal com Scroll */}
        <div className="product-modal-content">
          <form className="movimentacao-form" onSubmit={handleSubmit}>
            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label>📦 Tipo *</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="">Selecione o tipo...</option>
                  <option value="Entrada">📥 Entrada</option>
                  <option value="Saída">📤 Saída</option>
                  <option value="Ajuste">⚙️ Ajuste</option>
                </select>
              </div>
              <div style={{ flex: 2 }}>
                <label>🏷️ Produto *</label>
                <select value={produto} onChange={e => setProduto(e.target.value)}>
                  <option value="">Selecione o produto...</option>
                  {produtosList.map((p) => (
                    <option key={p.idMaterial || p.id} value={p.idMaterial || p.id}>
                      {p.nmMaterial || p.nome || p.codigo || `ID ${p.idMaterial || p.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: 140 }}>
                <label>🔢 Quantidade *</label>
                <input 
                  type="number" 
                  value={quantidade} 
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label>📅 Data e Hora</label>
                <input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label>👤 Usuário *</label>
                <select value={usuario} onChange={e => setUsuario(e.target.value)}>
                  <option value="">Selecione o usuário...</option>
                  {usuariosList.map((u) => (
                    <option key={u.idUsuario || u.id} value={u.idUsuario || u.id}>
                      {u.nome || u.nomeUsuario || u.email || `ID ${u.idUsuario || u.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label>📝 Observação</label>
                <textarea 
                  value={observacao} 
                  onChange={(e) => setObservacao(e.target.value)} 
                  rows={3}
                  placeholder="Adicione observações sobre esta movimentação..."
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
          </form>
        </div>

        {/* Footer com Ações */}
        <div className="product-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" onClick={handleSubmit}>
            {initialData ? 'Salvar Alterações' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovimentacoesForm;
