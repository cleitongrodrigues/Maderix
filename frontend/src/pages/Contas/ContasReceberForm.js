import React, { useState, useEffect } from 'react';
import './ContasReceber.css';

function ContasReceberForm({ isOpen, onClose, onSave, initialData = null }) {
  const [numero, setNumero] = useState('');
  const [cliente, setCliente] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);

  // Função para formatar valor como moeda brasileira
  const formatarMoeda = (valor) => {
    if (!valor) return '';
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) : valor;
    if (isNaN(numero)) return '';
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Função para converter moeda formatada para número
  const parseMoneyToNumber = (valorFormatado) => {
    if (!valorFormatado) return 0;
    return parseFloat(valorFormatado.replace(/\./g, '').replace(',', '.'));
  };

  // Handler para mudanças no campo de valor
  const handleValorChange = (valor) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros === '') {
      setValor('');
      return;
    }
    // Converte para número e formata
    const numero = parseFloat(apenasNumeros) / 100;
    setValor(formatarMoeda(numero));
  };

  useEffect(() => {
    if (initialData) {
      setNumero(initialData.Numero || '');
      setCliente(initialData.Cliente || '');
      setValor(initialData.Valor != null ? formatarMoeda(initialData.Valor) : '');
      setVencimento(initialData.Vencimento ? new Date(initialData.Vencimento).toISOString().slice(0,10) : '');
      setObservacoes(initialData.Observacoes || '');
    } else {
      setNumero('');
      setCliente('');
      setValor('');
      setVencimento('');
      setObservacoes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!numero.trim()) {
      alert('❌ Número da conta é obrigatório!');
      return;
    }
    if (!cliente.trim()) {
      alert('❌ Nome do cliente é obrigatório!');
      return;
    }
    if (!valor) {
      alert('❌ Valor da conta é obrigatório!');
      return;
    }
    
    const valorNumerico = parseMoneyToNumber(valor);
    if (valorNumerico <= 0) {
      alert('❌ Valor deve ser maior que zero!');
      return;
    }
    
    if (!vencimento) {
      alert('❌ Data de vencimento é obrigatória!');
      return;
    }

    setSaving(true);
    try {
      const payload = { 
        Numero: numero, 
        Cliente: cliente, 
        Valor: valorNumerico, 
        Vencimento: new Date(vencimento).toISOString(),
        Observacoes: observacoes
      };
      const url = initialData ? `/api/contas/${initialData.ID_Conta ?? initialData.id}` : '/api/contas';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('no-api');
      const saved = await res.json();
      onSave && onSave(saved);
      onClose && onClose();
    } catch (err) {
      const fakeId = Math.floor(Math.random() * 100000) + 1000;
      const obj = { 
        ID_Conta: initialData ? (initialData.ID_Conta ?? initialData.id) : fakeId, 
        Numero: numero, 
        Cliente: cliente, 
        Valor: valorNumerico, 
        Vencimento: new Date(vencimento).toISOString(), 
        Observacoes: observacoes,
        Pago: initialData?.Pago || false, 
        DT_Cad_Conta: initialData?.DT_Cad_Conta || new Date().toISOString() 
      };
      onSave && onSave(obj);
      onClose && onClose();
    } finally { setSaving(false); }
  };

  const isEdicao = !!initialData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container conta-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdicao ? '✏️ Editar Conta a Receber' : '💰 Nova Conta a Receber'}</h2>
          <button className="btn-close" onClick={onClose} disabled={saving}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Informação de cadastro (apenas na edição) */}
            {isEdicao && initialData.DT_Cad_Conta && (
              <div className="info-box">
                📅 Cadastrada em: {new Date(initialData.DT_Cad_Conta).toLocaleDateString('pt-BR')} às {new Date(initialData.DT_Cad_Conta).toLocaleTimeString('pt-BR')}
              </div>
            )}

            {/* Status da conta (apenas na edição) */}
            {isEdicao && (
              <div className={`info-box-status ${initialData.Pago ? 'status-paga-box' : 'status-aberta-box'}`}>
                <strong>Status:</strong> {initialData.Pago ? '✅ Conta Paga' : '🕐 Conta em Aberto'}
              </div>
            )}

            {/* Linha 1: Número e Cliente */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numero">Número da Conta *</label>
                <input
                  id="numero"
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ex: 001/2025"
                  disabled={saving}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cliente">Nome do Cliente *</label>
                <input
                  id="cliente"
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Ex: João Silva"
                  disabled={saving}
                  required
                />
              </div>
            </div>

            {/* Linha 2: Valor e Vencimento */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="valor">Valor (R$) *</label>
                <div className="preco-wrapper">
                  <span className="preco-prefix">R$</span>
                  <input
                    id="valor"
                    type="text"
                    className="input-preco"
                    value={valor}
                    onChange={(e) => handleValorChange(e.target.value)}
                    placeholder="0,00"
                    disabled={saving}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="vencimento">Data de Vencimento *</label>
                <input
                  id="vencimento"
                  type="date"
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            {/* Observações */}
            <div className="form-group">
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais sobre a conta..."
                rows="3"
                disabled={saving}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-small"></span> Salvando...
                </>
              ) : (
                isEdicao ? "💾 Salvar Alterações" : "💰 Cadastrar Conta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContasReceberForm;
