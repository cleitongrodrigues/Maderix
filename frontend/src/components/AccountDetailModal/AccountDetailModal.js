import React, { useState, useRef, useEffect } from 'react';
import './AccountDetailModal.css';

function AccountDetailModal({ conta, onClose, onEdit, onRegisterPayment }) {
  const valorPagoInputRef = useRef(null);
  // Utilitário para formatar moeda
  function formatarMoeda(valor) {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (!valor) return 'R$ 0,00';
    const num = parseFloat((valor + '').replace(',', '.'));
    if (isNaN(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Utilitário para formatar data
  function formatarData(data) {
    if (!data) return '-';
    const d = new Date(data);
    if (isNaN(d)) return '-';
    return d.toLocaleDateString('pt-BR');
  }
  const paymentFormRef = useRef(null);
  const [activeTab, setActiveTab] = useState('detalhes'); // detalhes, parcelas, historico
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [pagamentoData, setPagamentoData] = useState({
    valorPago: '',
    dataPagamento: new Date().toISOString().split('T')[0],
    formaPagamento: 'dinheiro',
    observacoes: ''
  });

  useEffect(() => {
    if (showPaymentForm) {
      if (paymentFormRef.current) {
        paymentFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (valorPagoInputRef.current) {
        valorPagoInputRef.current.focus();
      }
    }
  }, [showPaymentForm]);

  if (!conta) return null;

  // Dados de exemplo de parcelas (pronto para integração com backend)
  const parcelas = [
    { 
      id: 1, 
      numero: 1, 
      valor: conta.Valor / 3, 
      vencimento: conta.Vencimento, 
      pago: false, 
      dataPagamento: null,
      valorPago: null 
    },
    { 
      id: 2, 
      numero: 2, 
      valor: conta.Valor / 3, 
      vencimento: new Date(new Date(conta.Vencimento).setMonth(new Date(conta.Vencimento).getMonth() + 1)).toISOString().split('T')[0], 
      pago: false, 
      dataPagamento: null,
      valorPago: null 
    },
    { 
      id: 3, 
      numero: 3, 
      valor: conta.Valor / 3, 
      vencimento: new Date(new Date(conta.Vencimento).setMonth(new Date(conta.Vencimento).getMonth() + 2)).toISOString().split('T')[0], 
      pago: false, 
      dataPagamento: null,
      valorPago: null 
    },
  ];

  // Histórico de pagamentos (exemplo)
  const historicoPagamentos = [
    { 
      id: 1, 
      data: '2024-10-25', 
      valor: 150.00, 
      formaPagamento: 'Pix', 
      usuario: 'João Silva',
      observacao: 'Pagamento parcial da parcela 1'
    },
    { 
      id: 2, 
      data: '2024-10-20', 
      valor: 200.00, 
      formaPagamento: 'Cartão', 
      usuario: 'Maria Santos',
      observacao: 'Entrada da conta'
    },
  ];

  const isVencida = (data) => {
    if (!data) return false;
    return new Date(data) < new Date();
  };

  const getStatusConta = () => {
    if (conta.Pago) return { text: 'Pago', class: 'pago' };
    if (isVencida(conta.Vencimento)) return { text: 'Vencida', class: 'vencida' };
    return { text: 'Em Aberto', class: 'aberto' };
  };

  const status = getStatusConta();

  const valorTotal = typeof conta.Valor === 'number' ? conta.Valor : parseFloat(conta.Valor) || 0;
  const valorPago = historicoPagamentos.reduce((sum, p) => sum + p.valor, 0);
  const valorRestante = valorTotal - valorPago;

  const handleSubmitPagamento = (e) => {
    e.preventDefault();
    // Converte vírgula para ponto só ao submeter
    const valorPagoConvertido = pagamentoData.valorPago.replace(/,/g, '.');
    const dataParaEnviar = { ...pagamentoData, valorPago: valorPagoConvertido, contaId: conta.ID_Conta || conta.id };
    console.log('Registrando pagamento:', dataParaEnviar);
    if (onRegisterPayment) {
      onRegisterPayment(dataParaEnviar);
    }
    alert('Pagamento registrado com sucesso!');
    setShowPaymentForm(false);
    setPagamentoData({
      valorPago: '',
      dataPagamento: new Date().toISOString().split('T')[0],
      formaPagamento: 'dinheiro',
      observacoes: ''
    });
  };

  return (
    <div className="account-modal-overlay" onClick={onClose}>
      <div className="account-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div className="account-modal-header">
          <div className="account-modal-title-section">
            <h2>💰 Detalhes da Conta</h2>
            <span className={`status-badge ${status.class}`}>{status.text}</span>
          </div>
          <button className="account-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="account-modal-content">
          {/* Resumo da Conta */}
          <div className="account-summary-section">
            <div className="summary-card">
              <div className="summary-item">
                <span className="summary-label">Cliente:</span>
                <span className="summary-value large">{conta.Cliente || 'N/A'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Número da Conta:</span>
                <span className="summary-value">{conta.Numero || 'N/A'}</span>
              </div>
            </div>
            
            <div className="value-cards">
              <div className="value-card total">
                <span className="value-label">Valor Total</span>
                <span className="value-amount">{formatarMoeda(valorTotal)}</span>
              </div>
              <div className="value-card pago">
                <span className="value-label">Valor Pago</span>
                <span className="value-amount">{formatarMoeda(valorPago)}</span>
              </div>
              <div className="value-card restante">
                <span className="value-label">Saldo Restante</span>
                <span className="value-amount">{formatarMoeda(valorRestante)}</span>
              </div>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="account-tabs">
            <button
              className={`account-tab ${activeTab === 'detalhes' ? 'active' : ''}`}
              onClick={() => setActiveTab('detalhes')}
            >
              📋 Detalhes
            </button>
            <button
              className={`account-tab ${activeTab === 'parcelas' ? 'active' : ''}`}
              onClick={() => setActiveTab('parcelas')}
            >
              📊 Parcelas
            </button>
            <button
              className={`account-tab ${activeTab === 'historico' ? 'active' : ''}`}
              onClick={() => setActiveTab('historico')}
            >
              📅 Histórico de Pagamentos
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="account-tab-content">
            {/* Aba: Detalhes */}
            {activeTab === 'detalhes' && (
              <div className="tab-panel">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Número da Conta:</span>
                    <span className="info-value">{conta.Numero || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cliente:</span>
                    <span className="info-value">{conta.Cliente || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Valor Total:</span>
                    <span className="info-value highlight">{formatarMoeda(valorTotal)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Data de Vencimento:</span>
                    <span className="info-value">{formatarData(conta.Vencimento)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Data de Cadastro:</span>
                    <span className="info-value">{formatarData(conta.DT_Cad_Conta)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`status-indicator ${status.class}`}>{status.text}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Observações:</span>
                    <span className="info-value">
                      {conta.Observacoes || 'Sem observações adicionais.'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Aba: Parcelas */}
            {activeTab === 'parcelas' && (
              <div className="tab-panel">
                <div className="parcelas-header">
                  <h4>Parcelas da Conta</h4>
                  <span className="parcelas-count">{parcelas.length} parcela(s)</span>
                </div>
                <div className="parcelas-list">
                  {parcelas.map(parcela => (
                    <div key={parcela.id} className={`parcela-item ${parcela.pago ? 'paga' : isVencida(parcela.vencimento) ? 'vencida' : 'aberta'}`}>
                      <div className="parcela-numero">
                        <span className="numero-badge">{parcela.numero}/{parcelas.length}</span>
                      </div>
                      <div className="parcela-info">
                        <div className="parcela-header-row">
                          <span className="parcela-valor">{formatarMoeda(parcela.valor)}</span>
                          <span className={`parcela-status ${parcela.pago ? 'paga' : isVencida(parcela.vencimento) ? 'vencida' : 'aberta'}`}>
                            {parcela.pago ? '✓ Paga' : isVencida(parcela.vencimento) ? '⚠ Vencida' : '⏳ Em aberto'}
                          </span>
                        </div>
                        <div className="parcela-detalhes">
                          <span className="parcela-vencimento">
                            📅 Vencimento: {formatarData(parcela.vencimento)}
                          </span>
                          {parcela.pago && parcela.dataPagamento && (
                            <span className="parcela-pagamento">
                              ✓ Pago em: {formatarData(parcela.dataPagamento)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aba: Histórico */}
            {activeTab === 'historico' && (
              <div className="tab-panel">
                <div className="historico-header">
                  <h4>Histórico de Pagamentos</h4>
                  <span className="historico-count">{historicoPagamentos.length} pagamento(s)</span>
                </div>
                {historicoPagamentos.length > 0 ? (
                  <div className="historico-list">
                    {historicoPagamentos.map(pag => (
                      <div key={pag.id} className="historico-item">
                        <div className="historico-icon">💵</div>
                        <div className="historico-info">
                          <div className="historico-header-row">
                            <span className="historico-valor">{formatarMoeda(pag.valor)}</span>
                            <span className="historico-data">{formatarData(pag.data)}</span>
                          </div>
                          <div className="historico-detalhes">
                            <span className="historico-forma">💳 {pag.formaPagamento}</span>
                            <span className="historico-usuario">👤 {pag.usuario}</span>
                          </div>
                          {pag.observacao && (
                            <div className="historico-obs">{pag.observacao}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Nenhum pagamento registrado ainda.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Formulário de Pagamento (quando ativado) */}
          {showPaymentForm && (
            <div className="payment-form-section" ref={paymentFormRef}>
              <div className="payment-form-header">
                <h4>💵 Registrar Pagamento</h4>
                <button 
                  className="btn-close-form" 
                  onClick={() => setShowPaymentForm(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmitPagamento} className="payment-form">
                <div className="form-row">
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <label htmlFor="valorPago">Valor Pago *</label>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary, #aaa)' }}>
                        Saldo restante: <b>{formatarMoeda(valorRestante)}</b>
                      </span>
                    </div>
                    <input
                      type="text"
                      id="valorPago"
                      className="form-input"
                      ref={valorPagoInputRef}
                      value={pagamentoData.valorPago}
                      onChange={(e) => {
                        // Permite vírgula, mostra vírgula, só converte ao submeter
                        setPagamentoData({ ...pagamentoData, valorPago: e.target.value });
                      }}
                      inputMode="decimal"
                      pattern="[0-9,.]*"
                      required
                      placeholder="0,00"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dataPagamento">Data do Pagamento *</label>
                    <input
                      type="date"
                      id="dataPagamento"
                      className="form-input"
                      value={pagamentoData.dataPagamento}
                      onChange={(e) => setPagamentoData({ ...pagamentoData, dataPagamento: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="formaPagamento">Forma de Pagamento *</label>
                  <select
                    id="formaPagamento"
                    className="form-input"
                    value={pagamentoData.formaPagamento}
                    onChange={(e) => setPagamentoData({ ...pagamentoData, formaPagamento: e.target.value })}
                    required
                  >
                    <option value="dinheiro">💵 Dinheiro</option>
                    <option value="pix">📱 Pix</option>
                    <option value="cartao">💳 Cartão</option>
                    <option value="boleto">📄 Boleto</option>
                    <option value="transferencia">🏦 Transferência</option>
                    <option value="cheque">📝 Cheque</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    className="form-input"
                    value={pagamentoData.observacoes}
                    onChange={(e) => setPagamentoData({ ...pagamentoData, observacoes: e.target.value })}
                    rows="3"
                    placeholder="Adicione observações sobre o pagamento (opcional)"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    ✓ Confirmar Pagamento
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="account-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <div className="footer-actions">
            {!conta.Pago && !showPaymentForm && (
              <button 
                className="btn-payment" 
                onClick={() => setShowPaymentForm(true)}
              >
                💵 Registrar Pagamento
              </button>
            )}
            <button className="btn-primary" onClick={() => onEdit(conta)}>
              ✏️ Editar Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailModal;
