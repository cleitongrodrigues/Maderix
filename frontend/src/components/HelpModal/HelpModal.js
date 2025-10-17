import React, { useState } from 'react';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('guia');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Dados do guia rápido
  const guideSteps = [
    {
      id: 1,
      icon: '🏠',
      title: 'Página Inicial',
      description: 'Dashboard com visão geral do sistema, resumos de vendas, estoque e contas a receber.',
      tips: [
        'Use os cards de ação rápida para navegar diretamente',
        'O gráfico mostra as vendas dos últimos 7 dias',
        'Indicadores destacam informações que precisam de atenção'
      ]
    },
    {
      id: 2,
      icon: '📦',
      title: 'Gerenciar Estoque',
      description: 'Controle completo de produtos, entradas, saídas e níveis de estoque.',
      tips: [
        'Use o botão 🔍 para ver detalhes completos do produto',
        'Produtos em vermelho estão com estoque crítico',
        'Configure alertas de estoque mínimo nas preferências'
      ]
    },
    {
      id: 3,
      icon: '💰',
      title: 'Contas a Receber',
      description: 'Acompanhe pagamentos, vencimentos e registre recebimentos.',
      tips: [
        'Contas vencidas aparecem em destaque vermelho',
        'Use filtros rápidos para ver apenas abertas ou vencidas',
        'Registre pagamentos parciais através do modal de detalhes'
      ]
    },
    {
      id: 4,
      icon: '📊',
      title: 'Relatórios',
      description: 'Visualize gráficos, estatísticas de vendas e performance da equipe.',
      tips: [
        'Acesse via botão 📊 no cabeçalho',
        'Altere o período (mês/trimestre/ano) para comparações',
        'Exporte relatórios em PDF ou imprima diretamente'
      ]
    },
    {
      id: 5,
      icon: '🏢',
      title: 'Multi-Empresa',
      description: 'Trabalhe com múltiplas empresas e filiais no mesmo sistema.',
      tips: [
        'Clique no indicador de empresa no menu para trocar',
        'Todos os dados são filtrados pela empresa selecionada',
        'Empresas inativas não podem ser selecionadas'
      ]
    },
    {
      id: 6,
      icon: '⚙️',
      title: 'Preferências',
      description: 'Personalize o sistema com temas, idiomas e configurações.',
      tips: [
        'Acesse via perfil → Preferências',
        'Configure notificações por tipo de alerta',
        'Ajuste formato de data/hora para sua região'
      ]
    }
  ];

  // Atalhos de teclado
  const shortcuts = [
    { category: 'Navegação', items: [
      { keys: ['Alt', '1'], description: 'Ir para Home' },
      { keys: ['Alt', '2'], description: 'Ir para Estoque' },
      { keys: ['Alt', '3'], description: 'Ir para Vendas' },
      { keys: ['Alt', '4'], description: 'Ir para Contas a Receber' }
    ]},
    { category: 'Ações Rápidas', items: [
      { keys: ['Ctrl', 'K'], description: 'Busca Global' },
      { keys: ['Ctrl', 'N'], description: 'Novo Registro' },
      { keys: ['Ctrl', 'S'], description: 'Salvar Formulário' },
      { keys: ['Esc'], description: 'Fechar Modal/Cancelar' }
    ]},
    { category: 'Sistema', items: [
      { keys: ['F1'], description: 'Abrir Ajuda (este modal)' },
      { keys: ['Ctrl', 'M'], description: 'Recolher/Expandir Menu' },
      { keys: ['Ctrl', ','], description: 'Abrir Preferências' }
    ]}
  ];

  // FAQ
  const faqItems = [
    {
      id: 1,
      category: 'Geral',
      question: 'Como faço para adicionar um novo produto?',
      answer: 'Navegue até a página de Estoque e clique no botão "+ Novo Produto". Preencha os campos obrigatórios (nome, código, categoria, preço) e clique em Salvar. O produto estará disponível imediatamente.'
    },
    {
      id: 2,
      category: 'Geral',
      question: 'Como alterar minha senha?',
      answer: 'Clique no seu avatar no menu lateral, depois em "Alterar Senha". Digite sua senha atual, a nova senha e confirme. A alteração é feita imediatamente e você não será desconectado.'
    },
    {
      id: 3,
      category: 'Estoque',
      question: 'O que significa produto em status crítico?',
      answer: 'Um produto entra em status crítico quando a quantidade em estoque atinge ou fica abaixo do nível mínimo configurado. Isso gera uma notificação automática para reposição.'
    },
    {
      id: 4,
      category: 'Estoque',
      question: 'Como registro entrada/saída de produtos?',
      answer: 'Na página de Estoque, clique no botão 🔍 do produto desejado. Na aba "Histórico de Movimentações", você pode registrar entradas (compras, devoluções) ou saídas (vendas, perdas).'
    },
    {
      id: 5,
      category: 'Financeiro',
      question: 'Como registro um pagamento parcial?',
      answer: 'No modal de detalhes da conta (botão 🔍), vá para a aba "Parcelas" ou "Histórico". Clique em "Registrar Pagamento", informe o valor pago (pode ser menor que o total) e a forma de pagamento.'
    },
    {
      id: 6,
      category: 'Financeiro',
      question: 'Como filtro contas vencidas?',
      answer: 'Na página de Contas a Receber, use os cards de resumo no topo. Clique em "Contas Vencidas" para filtrar apenas as contas com vencimento passado. Use "Limpar filtro" para voltar à visualização completa.'
    },
    {
      id: 7,
      category: 'Sistema',
      question: 'Como trocar de empresa/filial?',
      answer: 'Clique no indicador de empresa no menu lateral (logo abaixo do cabeçalho). Selecione a empresa desejada na lista. Todos os dados serão atualizados automaticamente.'
    },
    {
      id: 8,
      category: 'Sistema',
      question: 'Minhas configurações são salvas?',
      answer: 'Sim! Todas as preferências (tema, idioma, notificações) são salvas localmente no seu navegador. Ao retornar, suas configurações estarão preservadas.'
    },
    {
      id: 9,
      category: 'Relatórios',
      question: 'Como exporto relatórios?',
      answer: 'No modal de Relatórios (botão 📊 no cabeçalho), você encontra botões "Exportar PDF" e "Imprimir" no rodapé. Selecione a aba desejada antes de exportar.'
    },
    {
      id: 10,
      category: 'Relatórios',
      question: 'Posso ver dados de períodos anteriores?',
      answer: 'Sim! Na aba "Top Produtos" dos relatórios, use o seletor de período (Mês/Trimestre/Ano) para visualizar dados históricos e fazer comparações.'
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  if (!isOpen) return null;

  const renderGuiaTab = () => (
    <div className="help-tab-content">
      <div className="help-intro">
        <h3>👋 Bem-vindo ao Maderix!</h3>
        <p>Este guia rápido vai te ajudar a aproveitar ao máximo todas as funcionalidades do sistema.</p>
      </div>

      <div className="guide-steps">
        {guideSteps.map((step) => (
          <div key={step.id} className="guide-step">
            <div className="step-header">
              <div className="step-icon">{step.icon}</div>
              <div className="step-title-group">
                <h4>{step.title}</h4>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
            <div className="step-tips">
              <strong>💡 Dicas:</strong>
              <ul>
                {step.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="help-footer-note">
        <span className="note-icon">ℹ️</span>
        <p>Precisa de ajuda específica? Consulte as abas "Atalhos" e "FAQ" para mais informações.</p>
      </div>
    </div>
  );

  const renderAtalhosTab = () => (
    <div className="help-tab-content">
      <div className="help-intro">
        <h3>⌨️ Atalhos de Teclado</h3>
        <p>Acelere seu trabalho com esses atalhos úteis:</p>
      </div>

      <div className="shortcuts-grid">
        {shortcuts.map((category, index) => (
          <div key={index} className="shortcut-category">
            <h4 className="category-title">{category.category}</h4>
            <div className="shortcuts-list">
              {category.items.map((shortcut, idx) => (
                <div key={idx} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key, keyIdx) => (
                      <React.Fragment key={keyIdx}>
                        <kbd className="key">{key}</kbd>
                        {keyIdx < shortcut.keys.length - 1 && <span className="plus">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="shortcut-description">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="help-footer-note">
        <span className="note-icon">💡</span>
        <p>Dica: A maioria dos atalhos funcionam em qualquer página do sistema!</p>
      </div>
    </div>
  );

  const renderFaqTab = () => (
    <div className="help-tab-content">
      <div className="help-intro">
        <h3>❓ Perguntas Frequentes</h3>
        <p>Encontre respostas rápidas para as dúvidas mais comuns:</p>
      </div>

      <div className="faq-search">
        <input
          type="text"
          className="faq-search-input"
          placeholder="🔍 Buscar nas perguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
        )}
      </div>

      {filteredFaq.length === 0 ? (
        <div className="faq-empty">
          <span className="empty-icon">🔍</span>
          <p>Nenhuma pergunta encontrada para "{searchTerm}"</p>
        </div>
      ) : (
        <div className="faq-list">
          {filteredFaq.map((faq) => (
            <div key={faq.id} className={`faq-item ${expandedFaqId === faq.id ? 'expanded' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                <div className="question-content">
                  <span className="faq-category">{faq.category}</span>
                  <h4>{faq.question}</h4>
                </div>
                <span className="faq-toggle">{expandedFaqId === faq.id ? '▼' : '▶'}</span>
              </div>
              {expandedFaqId === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="help-footer-note">
        <span className="note-icon">💬</span>
        <p>Não encontrou sua resposta? Entre em contato com o suporte pelo e-mail <strong>suporte@maderix.com</strong></p>
      </div>
    </div>
  );

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <div className="header-title">
            <span className="title-icon">📚</span>
            <h2>Central de Ajuda</h2>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="help-modal-tabs">
          <button
            className={`tab-button ${activeTab === 'guia' ? 'active' : ''}`}
            onClick={() => setActiveTab('guia')}
          >
            📖 Guia Rápido
          </button>
          <button
            className={`tab-button ${activeTab === 'atalhos' ? 'active' : ''}`}
            onClick={() => setActiveTab('atalhos')}
          >
            ⌨️ Atalhos
          </button>
          <button
            className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            ❓ FAQ
          </button>
        </div>

        <div className="help-modal-body">
          {activeTab === 'guia' && renderGuiaTab()}
          {activeTab === 'atalhos' && renderAtalhosTab()}
          {activeTab === 'faq' && renderFaqTab()}
        </div>

        <div className="help-modal-footer">
          <div className="footer-info">
            <span>📧 <strong>suporte@maderix.com</strong></span>
            <span>📞 <strong>(11) 9999-9999</strong></span>
          </div>
          <button className="btn-close" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
