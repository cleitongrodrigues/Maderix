import React, { useState, useEffect } from 'react';
import './ContasReceber.css';

function ContasReceberForm({ isOpen, onClose, onSave, initialData = null }) {
  const [numero, setNumero] = useState('');
  const [cliente, setCliente] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [saving, setSaving] = useState(false);

  function formatCurrency(v) {
    const nums = String(v || '').replace(/[^0-9\-,.]/g, '').replace(/,/g, '.');
    if (!nums) return '';
    const num = parseFloat(nums);
    if (Number.isNaN(num)) return '';
    return num.toFixed(2).replace('.', ',');
  }

  function parseCurrency(v) {
    if (!v) return 0;
    return Number(String(v).replace(/\./g, '').replace(/,/g, '.')) || 0;
  }

  useEffect(() => {
    if (initialData) {
      setNumero(initialData.Numero || '');
      setCliente(initialData.Cliente || '');
      setValor(initialData.Valor != null ? formatCurrency(initialData.Valor) : '');
      setVencimento(initialData.Vencimento ? new Date(initialData.Vencimento).toISOString().slice(0,10) : '');
    } else {
      setNumero(''); setCliente(''); setValor(''); setVencimento('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numero.trim() || !cliente.trim() || !valor) return alert('Número, Cliente e Valor são obrigatórios');
    setSaving(true);
    try {
      const payload = { Numero: numero, Cliente: cliente, Valor: parseCurrency(valor), Vencimento: new Date(vencimento).toISOString() };
      const url = initialData ? `/api/contas/${initialData.ID_Conta ?? initialData.id}` : '/api/contas';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('no-api');
      const saved = await res.json();
      onSave && onSave(saved);
      onClose && onClose();
    } catch (err) {
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const obj = { ID_Conta: initialData ? (initialData.ID_Conta ?? initialData.id) : fakeId, Numero: numero, Cliente: cliente, Valor: parseCurrency(valor), Vencimento: new Date(vencimento).toISOString(), Pago: false, DT_Cad_Conta: new Date().toISOString() };
      onSave && onSave(obj);
      onClose && onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h1>{initialData ? 'Editar Conta' : 'Nova Conta'}</h1><button onClick={onClose}>×</button></div>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Número</label>
              <input value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
            <div style={{ flex: 1, marginLeft: 12 }}>
              <label>Cliente</label>
              <input value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>
          </div>

          <div className="input-row">
            <div style={{ flex: 1 }}>
              <label>Valor</label>
              <input value={valor} onChange={(e) => setValor(e.target.value)} onBlur={(e) => setValor(formatCurrency(e.target.value))} placeholder="0,00" />
            </div>
            <div style={{ flex: 1, marginLeft: 12 }}>
              <label>Vencimento</label>
              <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
            </div>
          </div>

          <div className="button-container" style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContasReceberForm;
