import React, { useState, useEffect } from "react";
import "./Clientes.css";

function ClienteForm({ isOpen, onClose, onSave, initialData = null }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [idEmpresa, setIdEmpresa] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Busca empresas para preencher select; fallback caso não haja backend
    async function fetchEmpresas() {
      try {
        const res = await fetch("/api/empresas");
        if (!res.ok) throw new Error("no-api");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setEmpresas(data);
        } else {
          setEmpresas([{ ID_Empresa: 1, NM_Fantasia: "Empresa Exemplo" }]);
        }
      } catch (err) {
        setEmpresas([{ ID_Empresa: 1, NM_Fantasia: "Empresa Exemplo" }]);
      }
    }

    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.NM_Cliente ?? initialData.nome ?? "");
      setTelefone(initialData.Tel_Cliente ?? initialData.tel ?? "");
      setEmail(initialData.Email ?? initialData.email ?? "");
      setIdEmpresa(initialData.ID_Empresa ?? initialData.idEmpresa ?? "");
    } else {
      setNome("");
      setTelefone("");
      setEmail("");
      setIdEmpresa(empresas[0]?.ID_Empresa ?? "");
    }
  }, [initialData, isOpen, empresas]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }
    if (!idEmpresa) {
      alert("Selecione uma empresa");
      return;
    }

    setSaving(true);
    const payload = { ID_Empresa: idEmpresa, NM_Cliente: nome, Tel_Cliente: telefone, Email: email };

    try {
      const url = initialData ? `/api/clientes/${initialData.ID_Cliente ?? initialData.id ?? initialData.ID}` : "/api/clientes";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const created = await res.json();
      onSave && onSave(created);
      onClose && onClose();
    } catch (err) {
      // fallback: simulate created object
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const created = {
        ID_Cliente: initialData ? (initialData.ID_Cliente ?? initialData.id ?? fakeId) : fakeId,
        ID_Empresa: idEmpresa,
        NM_Cliente: nome,
        Tel_Cliente: telefone,
        Email: email,
        DT_Cad_Cliente: new Date().toISOString(),
      };
      onSave && onSave(created);
      onClose && onClose();
    } finally {
      setSaving(false);
    }
  };

  function formatPhone(v) {
    const nums = (v || "").replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 6) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
    if (nums.length <= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
    return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>{initialData ? "Editar Cliente" : "Novo Cliente"}</h1>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="produto-container">
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label htmlFor="empresa">Empresa</label>
                <select id="empresa" value={idEmpresa} onChange={(e) => setIdEmpresa(Number(e.target.value))}>
                  <option value="">-- selecione --</option>
                  {empresas.map((emp) => (
                    <option key={emp.ID_Empresa ?? emp.id} value={emp.ID_Empresa ?? emp.id}>
                      {emp.NM_Fantasia ?? emp.nmFantasia ?? emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label htmlFor="nome">Nome</label>
                <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do cliente" />
              </div>
            </div>

            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label htmlFor="telefone">Telefone</label>
                <input id="telefone" type="text" value={telefone} onChange={(e) => setTelefone(formatPhone(e.target.value))} onBlur={(e) => setTelefone(formatPhone(e.target.value))} placeholder="(11) 99999-9999" />
              </div>
              <div style={{ flex: 1, marginLeft: 12 }}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
              </div>
            </div>

            {initialData && (
              <div className="input-row">
                <div style={{ flex: 1 }}>
                  <label>Data de Cadastro</label>
                  <div>{initialData.DT_Cad_Cliente ? new Date(initialData.DT_Cad_Cliente).toLocaleString() : ""}</div>
                </div>
              </div>
            )}

            <div className="button-container" style={{ marginTop: 12 }}>
              <button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
              <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClienteForm;
