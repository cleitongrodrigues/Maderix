import React, { useState, useEffect } from "react";
import "./Produto.css";

function Produto({ isOpen, onClose, onSave, produtoParaEditar }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    fornecedor: '',
    categoria: '',
    unidadeMedida: '',
    quantidade: '',
    precoCusto: '',
    precoVenda: '',
    descricao: ''
  });

  // Preenche o formulário quando está editando
  useEffect(() => {
    if (produtoParaEditar) {
      setFormData({
        codigo: produtoParaEditar.codigo || '',
        nome: produtoParaEditar.nome || '',
        fornecedor: produtoParaEditar.fornecedor || '',
        categoria: produtoParaEditar.categoria || '',
        unidadeMedida: produtoParaEditar.unidadeMedida || '',
        quantidade: produtoParaEditar.quantidade || '',
        precoCusto: formatarMoeda(produtoParaEditar.precoCusto) || '',
        precoVenda: formatarMoeda(produtoParaEditar.precoVenda) || '',
        descricao: produtoParaEditar.descricao || ''
      });
    } else {
      // Limpa o formulário para novo cadastro
      setFormData({
        codigo: '',
        nome: '',
        fornecedor: '',
        categoria: '',
        unidadeMedida: '',
        quantidade: '',
        precoCusto: '',
        precoVenda: '',
        descricao: ''
      });
    }
  }, [produtoParaEditar, isOpen]);

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

  // Handler para mudanças nos campos de preço
  const handlePrecoChange = (campo, valor) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros === '') {
      setFormData({ ...formData, [campo]: '' });
      return;
    }
    // Converte para número e formata
    const numero = parseFloat(apenasNumeros) / 100;
    setFormData({ ...formData, [campo]: formatarMoeda(numero) });
  };

  // Handler para mudanças nos campos normais
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validações
  const validarFormulario = () => {
    // Campos obrigatórios
    if (!formData.nome.trim()) {
      alert('❌ Nome do produto é obrigatório!');
      return false;
    }
    if (!formData.codigo.trim()) {
      alert('❌ Código do produto é obrigatório!');
      return false;
    }
    if (!formData.quantidade) {
      alert('❌ Quantidade em estoque é obrigatória!');
      return false;
    }

    // Validação de quantidade
    const quantidade = parseInt(formData.quantidade);
    if (isNaN(quantidade) || quantidade < 0) {
      alert('❌ Quantidade em estoque deve ser um número válido e não negativo!');
      return false;
    }

    // Validação de preços
    const precoCusto = parseMoneyToNumber(formData.precoCusto);
    const precoVenda = parseMoneyToNumber(formData.precoVenda);

    if (!formData.precoCusto || precoCusto <= 0) {
      alert('❌ Preço de custo é obrigatório e deve ser maior que zero!');
      return false;
    }

    if (!formData.precoVenda || precoVenda <= 0) {
      alert('❌ Preço de venda é obrigatório e deve ser maior que zero!');
      return false;
    }

    if (precoVenda < precoCusto) {
      const confirmar = window.confirm(
        '⚠️ O preço de venda é menor que o preço de custo!\n' +
        `Custo: R$ ${formData.precoCusto}\n` +
        `Venda: R$ ${formData.precoVenda}\n\n` +
        'Deseja continuar mesmo assim?'
      );
      if (!confirmar) return false;
    }

    return true;
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const produtoData = {
        id: produtoParaEditar?.id || Date.now(),
        codigo: formData.codigo,
        nome: formData.nome,
        fornecedor: formData.fornecedor,
        categoria: formData.categoria,
        unidadeMedida: formData.unidadeMedida,
        quantidade: parseInt(formData.quantidade),
        precoCusto: parseMoneyToNumber(formData.precoCusto),
        precoVenda: parseMoneyToNumber(formData.precoVenda),
        descricao: formData.descricao,
        dataCadastro: produtoParaEditar?.dataCadastro || new Date().toISOString()
      };

      if (onSave) {
        onSave(produtoData);
      }

      alert(produtoParaEditar ? '✅ Produto atualizado com sucesso!' : '✅ Produto cadastrado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('❌ Erro ao salvar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEdicao = !!produtoParaEditar;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-produto" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdicao ? '✏️ Editar Produto' : '📦 Cadastrar Novo Produto'}</h2>
          <button className="btn-close" onClick={onClose} disabled={loading}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Informação de cadastro (apenas na edição) */}
            {isEdicao && produtoParaEditar.dataCadastro && (
              <div className="info-box">
                📅 Cadastrado em: {new Date(produtoParaEditar.dataCadastro).toLocaleDateString('pt-BR')}
              </div>
            )}

            {/* Linha 1: Código e Nome */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigo">Código do Produto *</label>
                <input
                  id="codigo"
                  name="codigo"
                  type="text"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ex: PROD001"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nome">Nome do Produto *</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Cadeira Escritório"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Linha 2: Fornecedor e Categoria */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fornecedor">Fornecedor</label>
                <input
                  id="fornecedor"
                  name="fornecedor"
                  type="text"
                  value={formData.fornecedor}
                  onChange={handleChange}
                  placeholder="Ex: Fornecedor XYZ"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoria">Categoria</label>
                <input
                  id="categoria"
                  name="categoria"
                  type="text"
                  value={formData.categoria}
                  onChange={handleChange}
                  placeholder="Ex: Móveis"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Linha 3: Unidade de Medida e Quantidade */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unidadeMedida">Unidade de Medida</label>
                <input
                  id="unidadeMedida"
                  name="unidadeMedida"
                  type="text"
                  value={formData.unidadeMedida}
                  onChange={handleChange}
                  placeholder="Ex: UN, KG, CX"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantidade">📦 Quantidade em Estoque *</label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Linha 4: Preços com máscara */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precoCusto">💰 Preço de Custo *</label>
                <div className="preco-wrapper">
                  <span className="preco-prefix">R$</span>
                  <input
                    id="precoCusto"
                    name="precoCusto"
                    type="text"
                    className="input-preco"
                    value={formData.precoCusto}
                    onChange={(e) => handlePrecoChange('precoCusto', e.target.value)}
                    placeholder="0,00"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="precoVenda">💵 Preço de Venda *</label>
                <div className="preco-wrapper">
                  <span className="preco-prefix">R$</span>
                  <input
                    id="precoVenda"
                    name="precoVenda"
                    type="text"
                    className="input-preco"
                    value={formData.precoVenda}
                    onChange={(e) => handlePrecoChange('precoVenda', e.target.value)}
                    placeholder="0,00"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Margem de lucro (informativo) */}
            {formData.precoCusto && formData.precoVenda && (
              <div className="info-box-margem">
                {(() => {
                  const custo = parseMoneyToNumber(formData.precoCusto);
                  const venda = parseMoneyToNumber(formData.precoVenda);
                  const margem = ((venda - custo) / custo * 100).toFixed(2);
                  const margemValor = venda - custo;
                  const isNegativa = margem < 0;
                  return (
                    <span style={{ color: isNegativa ? '#dc3545' : '#28a745' }}>
                      {isNegativa ? '⚠️' : '📊'} Margem de Lucro: {margem}% (R$ {margemValor.toFixed(2).replace('.', ',')})
                    </span>
                  );
                })()}
              </div>
            )}

            {/* Linha 5: Descrição */}
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição detalhada do produto..."
                rows="3"
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Salvando...
                </>
              ) : (
                <>{isEdicao ? '✓ Salvar Alterações' : '✓ Cadastrar Produto'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Produto;