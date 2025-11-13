
import React, { useState, useEffect } from "react";
import "./NovaVenda.css";
import { clientesAPI, materiaisAPI } from "../../../services/api";

function NovaVenda({ isOpen, onClose, onSave, vendaParaEditar }) {
  const [clienteId, setClienteId] = useState("");
  const [clientes, setClientes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [itens, setItens] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [observacoes, setObservacoes] = useState("");

  // Carregar clientes da API ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      console.log('[NovaVenda] Buscando clientes...');
      clientesAPI.listar()
        .then((data) => {
          console.log('[NovaVenda] Clientes recebidos:', data);
          setClientes(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error('[NovaVenda] Erro ao buscar clientes:', err);
          setClientes([]);
        });
      console.log('[NovaVenda] Buscando materiais...');
      materiaisAPI.listar()
        .then((data) => {
          console.log('[NovaVenda] Materiais recebidos:', data);
          setMateriais(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error('[NovaVenda] Erro ao buscar materiais:', err);
          setMateriais([]);
        });
    }
  }, [isOpen]);

  // Função para formatar valor como moeda
  const formatarMoeda = (valor) => {
    if (!valor) return "";
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(/\D/g, '')) / 100 : valor;
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Função para converter moeda formatada em número
  const parseMoneyToNumber = (valorFormatado) => {
    if (!valorFormatado) return 0;
    const numero = valorFormatado.replace(/\./g, '').replace(',', '.');
    return parseFloat(numero) || 0;
  };
  
  // Preencher dados se estiver editando
  useEffect(() => {
    if (vendaParaEditar) {
      setClienteId(vendaParaEditar.customer && vendaParaEditar.customer.id ? vendaParaEditar.customer.id : "");
      setItens(vendaParaEditar.items || []);
      setFormaPagamento(vendaParaEditar.payment);
      setObservacoes(vendaParaEditar.notes || "");
    } else {
      // Limpar formulário ao abrir para nova venda
      setClienteId("");
      setItens([]);
      setFormaPagamento("PIX");
      setObservacoes("");
    }
  }, [vendaParaEditar, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validações
    const itensInvalidos = itens.filter(item =>
      !item.name.trim() || item.qty <= 0 || item.unitPrice <= 0
    );
    if (itensInvalidos.length > 0) {
      alert("Por favor, preencha todos os campos dos itens com valores válidos (quantidade e preço devem ser maiores que zero).");
      return;
    }
    if (!clienteId) {
      alert("Selecione um cliente.");
      return;
    }
    const vendaData = {
      idCliente: Number(clienteId),
      idEmpresa: 1, // Ajuste aqui se necessário para multi-empresa
      itens: itens.map(item => ({
        idMaterial: item.idMaterial || item.sku || null, // Ajuste conforme origem do idMaterial
        quantidade: Number(item.qty),
        valorUnitario: Number(item.unitPrice)
      }))
    };
    if (onSave) onSave(vendaData, !!vendaParaEditar);
    onClose();
  };

  const adicionarItem = () => {
    setItens([...itens, { idMaterial: "", nome: "", qty: 1, unitPrice: 0 }]);
  };

  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const atualizarItem = (index, field, value) => {
    const novosItens = [...itens];
    if (field === 'idMaterial') {
      // Ao selecionar um material, preenche nome e unitPrice automaticamente
      const material = materiais.find(m => String(m.idMaterial) === String(value));
      if (material) {
        novosItens[index] = {
          ...novosItens[index],
          idMaterial: material.idMaterial,
          nome: material.nmMaterial,
          unitPrice: material.precoVenda || 0
        };
      } else {
        novosItens[index] = { ...novosItens[index], idMaterial: value };
      }
    } else if (field === 'qty') {
      value = Math.max(1, parseInt(value) || 1);
      novosItens[index] = { ...novosItens[index], qty: value };
    } else if (field === 'unitPrice') {
      value = Math.max(0, parseFloat(value) || 0);
      novosItens[index] = { ...novosItens[index], unitPrice: value };
    } else if (field === 'nome') {
      novosItens[index] = { ...novosItens[index], nome: value };
    }
    setItens(novosItens);
  };

  const handlePrecoChange = (index, valorDigitado) => {
    // Remove tudo exceto dígitos
    const apenasNumeros = valorDigitado.replace(/\D/g, '');
    
    // Converte para número dividindo por 100 (centavos)
    const valorNumerico = parseFloat(apenasNumeros) / 100;
    
    // Atualiza o item com o valor numérico
    atualizarItem(index, 'unitPrice', valorNumerico);
  };

  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container nova-venda-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{vendaParaEditar ? 'Editar Venda' : 'Nova Venda'}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Cliente *
              <select
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.idCliente} value={cliente.idCliente}>
                    {cliente.nmCliente || cliente.nome || cliente.name || cliente.razaoSocial || cliente.cnpj || cliente.idCliente}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>Forma de Pagamento *</label>
            <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} required>
              <option value="PIX">PIX</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Observações
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais sobre a venda..."
                rows="3"
              />
            </label>
          </div>

          <div className="itens-section">
            <div className="itens-header">
              <h3>Itens da Venda</h3>
              <button type="button" className="btn-secondary" onClick={adicionarItem}>
                + Adicionar Item
              </button>
            </div>

            {itens.length === 0 ? (
              <p className="empty-message">Nenhum item adicionado. Clique em "Adicionar Item" para começar.</p>
            ) : (
              <div className="itens-list">
                {itens.map((item, index) => (
                  <div key={index} className="item-row">
                    <select
                      value={item.idMaterial}
                      onChange={e => atualizarItem(index, 'idMaterial', e.target.value)}
                      required
                    >
                      <option value="">Selecione o produto</option>
                      {materiais.map(mat => (
                        <option key={mat.idMaterial} value={mat.idMaterial}>
                          {mat.idMaterial}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={item.nome}
                      readOnly
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qtd"
                      min="1"
                      value={item.qty}
                      onChange={e => atualizarItem(index, 'qty', e.target.value)}
                      required
                    />
                    <div className="preco-wrapper">
                      <span className="preco-prefix">R$</span>
                      <input
                        type="text"
                        placeholder="0,00"
                        className="input-preco"
                        value={formatarMoeda(item.unitPrice)}
                        onChange={e => handlePrecoChange(index, e.target.value)}
                        required
                      />
                    </div>
                    <span className="item-total">
                      R$ {(item.qty * item.unitPrice).toFixed(2)}
                    </span>
                    <button type="button" className="btn-remove" onClick={() => removerItem(index)}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="total-section">
            <strong>Total da Venda: R$ {calcularTotal().toFixed(2)}</strong>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={!clienteId || itens.length === 0}>
              {vendaParaEditar ? '💾 Salvar Alterações' : '💾 Finalizar Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaVenda;
