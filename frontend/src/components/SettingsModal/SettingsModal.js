import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './SettingsModal.css';
import { applyPrimaryColor, PRESET_COLORS } from '../../utils/themeManager';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('aparencia');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Estado das preferências
  const [preferences, setPreferences] = useState({
    // Aparência
    tema: 'claro',
    corPrimaria: '#FF6B35',
    tamanhoFonte: 'medio',
    animacoes: true,
    
    // Regional
    idioma: 'pt-BR',
    fuso: 'America/Sao_Paulo',
    formatoData: 'DD/MM/YYYY',
    formatoHora: '24h',
    moeda: 'BRL',
    
    // Notificações
    notificacoesEmail: true,
    notificacoesSistema: true,
    notificacoesEstoqueBaixo: true,
    notificacoesContasVencer: true,
    notificacoesNovasVendas: false,
    somNotificacao: true,
    
    // Sistema
    autoSalvar: true,
    intervaloAutoSalvar: 5,
    confirmarAcoes: true,
    modoCompacto: false,
    exibirDicas: true
  });

  const [originalPreferences, setOriginalPreferences] = useState(null);

  // Carrega preferências do localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        setOriginalPreferences(parsed);
      } else {
        setOriginalPreferences(preferences);
      }
      setUnsavedChanges(false);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
    
    // Preview da cor primária em tempo real
    if (field === 'corPrimaria') {
      applyPrimaryColor(value);
    }
  };

  const handleSave = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setOriginalPreferences(preferences);
    setUnsavedChanges(false);
    
    // Aplica a cor primária permanentemente
    applyPrimaryColor(preferences.corPrimaria);
    
    if (onSave) {
      onSave(preferences);
    }

    // Mostra feedback de sucesso
    alert('Preferências salvas com sucesso! ✅');
  };

  const handleReset = () => {
    if (window.confirm('Deseja realmente restaurar as configurações padrão?')) {
      const defaults = {
        tema: 'claro',
        corPrimaria: '#FF6B35',
        tamanhoFonte: 'medio',
        animacoes: true,
        idioma: 'pt-BR',
        fuso: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY',
        formatoHora: '24h',
        moeda: 'BRL',
        notificacoesEmail: true,
        notificacoesSistema: true,
        notificacoesEstoqueBaixo: true,
        notificacoesContasVencer: true,
        notificacoesNovasVendas: false,
        somNotificacao: true,
        autoSalvar: true,
        intervaloAutoSalvar: 5,
        confirmarAcoes: true,
        modoCompacto: false,
        exibirDicas: true
      };
      setPreferences(defaults);
      setUnsavedChanges(true);
    }
  };

  const handleCancel = () => {
    if (unsavedChanges && originalPreferences) {
      if (window.confirm('Existem alterações não salvas. Deseja descartá-las?')) {
        setPreferences(originalPreferences);
        setUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const renderAparenciaTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3>🎨 Tema</h3>
        <div className="setting-item">
          <label>Modo de Exibição</label>
          <div className="theme-selector">
            <button
              className={`theme-option ${preferences.tema === 'claro' ? 'active' : ''}`}
              onClick={() => handleChange('tema', 'claro')}
            >
              ☀️ Claro
            </button>
            <button
              className={`theme-option ${preferences.tema === 'escuro' ? 'active' : ''}`}
              onClick={() => handleChange('tema', 'escuro')}
            >
              🌙 Escuro
            </button>
            <button
              className={`theme-option ${preferences.tema === 'auto' ? 'active' : ''}`}
              onClick={() => handleChange('tema', 'auto')}
            >
              🔄 Auto
            </button>
          </div>
        </div>

        <div className="setting-item">
          <label>Cor Primária</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              value={preferences.corPrimaria}
              onChange={(e) => handleChange('corPrimaria', e.target.value)}
              className="color-picker"
            />
            <span className="color-value">{preferences.corPrimaria}</span>
          </div>
          
          {/* Cores Predefinidas */}
          <div className="preset-colors">
            <label className="preset-label">Cores predefinidas:</label>
            <div className="preset-colors-grid">
              {PRESET_COLORS.map((preset, index) => (
                <button
                  key={index}
                  className={`preset-color ${preferences.corPrimaria.toUpperCase() === preset.value.toUpperCase() ? 'active' : ''}`}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => handleChange('corPrimaria', preset.value)}
                  title={preset.name}
                  aria-label={preset.name}
                >
                  {preferences.corPrimaria.toUpperCase() === preset.value.toUpperCase() && '✓'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>📐 Tamanho e Layout</h3>
        <div className="setting-item">
          <label>Tamanho da Fonte</label>
          <select
            value={preferences.tamanhoFonte}
            onChange={(e) => handleChange('tamanhoFonte', e.target.value)}
            className="settings-select"
          >
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
          </select>
        </div>

        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Modo Compacto</label>
            <span className="setting-description">Reduz espaçamentos para ver mais conteúdo</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.modoCompacto}
              onChange={(e) => handleChange('modoCompacto', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Animações</label>
            <span className="setting-description">Habilita transições e efeitos visuais</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.animacoes}
              onChange={(e) => handleChange('animacoes', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderRegionalTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3>🌍 Idioma e Região</h3>
        <div className="setting-item">
          <label>Idioma do Sistema</label>
          <select
            value={preferences.idioma}
            onChange={(e) => handleChange('idioma', e.target.value)}
            className="settings-select"
          >
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="es-ES">🇪🇸 Español</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Fuso Horário</label>
          <select
            value={preferences.fuso}
            onChange={(e) => handleChange('fuso', e.target.value)}
            className="settings-select"
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/Manaus">Manaus (GMT-4)</option>
            <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>📅 Formatos</h3>
        <div className="setting-item">
          <label>Formato de Data</label>
          <select
            value={preferences.formatoData}
            onChange={(e) => handleChange('formatoData', e.target.value)}
            className="settings-select"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (28/10/2025)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (10/28/2025)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-10-28)</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Formato de Hora</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="formatoHora"
                value="12h"
                checked={preferences.formatoHora === '12h'}
                onChange={(e) => handleChange('formatoHora', e.target.value)}
              />
              <span>12 horas (3:45 PM)</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="formatoHora"
                value="24h"
                checked={preferences.formatoHora === '24h'}
                onChange={(e) => handleChange('formatoHora', e.target.value)}
              />
              <span>24 horas (15:45)</span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <label>Moeda Padrão</label>
          <select
            value={preferences.moeda}
            onChange={(e) => handleChange('moeda', e.target.value)}
            className="settings-select"
          >
            <option value="BRL">R$ Real Brasileiro</option>
            <option value="USD">$ Dólar Americano</option>
            <option value="EUR">€ Euro</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificacoesTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3>🔔 Canais de Notificação</h3>
        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Notificações por E-mail</label>
            <span className="setting-description">Receber alertas importantes por e-mail</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notificacoesEmail}
              onChange={(e) => handleChange('notificacoesEmail', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Notificações do Sistema</label>
            <span className="setting-description">Alertas visuais dentro do sistema</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notificacoesSistema}
              onChange={(e) => handleChange('notificacoesSistema', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Som de Notificação</label>
            <span className="setting-description">Reproduzir som ao receber notificações</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.somNotificacao}
              onChange={(e) => handleChange('somNotificacao', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>📬 Tipos de Alertas</h3>
        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Estoque Baixo</label>
            <span className="setting-description">Quando produtos atingirem nível crítico</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notificacoesEstoqueBaixo}
              onChange={(e) => handleChange('notificacoesEstoqueBaixo', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Contas a Vencer</label>
            <span className="setting-description">Lembretes de contas próximas do vencimento</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notificacoesContasVencer}
              onChange={(e) => handleChange('notificacoesContasVencer', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Novas Vendas</label>
            <span className="setting-description">Alertas quando novos pedidos forem criados</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notificacoesNovasVendas}
              onChange={(e) => handleChange('notificacoesNovasVendas', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSistemaTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3>💾 Salvamento</h3>
        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Salvamento Automático</label>
            <span className="setting-description">Salva alterações automaticamente</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.autoSalvar}
              onChange={(e) => handleChange('autoSalvar', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {preferences.autoSalvar && (
          <div className="setting-item">
            <label>Intervalo de Auto-Salvamento</label>
            <select
              value={preferences.intervaloAutoSalvar}
              onChange={(e) => handleChange('intervaloAutoSalvar', parseInt(e.target.value))}
              className="settings-select"
            >
              <option value="1">A cada 1 minuto</option>
              <option value="5">A cada 5 minutos</option>
              <option value="10">A cada 10 minutos</option>
              <option value="15">A cada 15 minutos</option>
            </select>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>🛡️ Segurança e Confirmações</h3>
        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Confirmar Ações Importantes</label>
            <span className="setting-description">Pede confirmação antes de excluir ou alterar dados</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.confirmarAcoes}
              onChange={(e) => handleChange('confirmarAcoes', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>💡 Ajuda e Dicas</h3>
        <div className="setting-item setting-item-row">
          <div className="setting-label-group">
            <label>Exibir Dicas do Sistema</label>
            <span className="setting-description">Mostra tooltips e sugestões de uso</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.exibirDicas}
              onChange={(e) => handleChange('exibirDicas', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>🔄 Restaurar Configurações</h3>
        <button className="btn-reset" onClick={handleReset}>
          🔄 Restaurar Padrões
        </button>
        <p className="reset-warning">
          ⚠️ Isso irá reverter todas as configurações para os valores padrão do sistema.
        </p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    <div className="settings-modal-overlay" onClick={handleCancel}>
      <div className="settings-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <div className="header-title">
            <span className="title-icon">⚙️</span>
            <div className="title-group">
              <h2>Preferências do Sistema</h2>
              {unsavedChanges && <span className="unsaved-indicator">● Não salvo</span>}
            </div>
          </div>
          <button className="close-button" onClick={handleCancel}>✕</button>
        </div>

        <div className="settings-modal-tabs">
          <button
            className={`tab-button ${activeTab === 'aparencia' ? 'active' : ''}`}
            onClick={() => setActiveTab('aparencia')}
          >
            🎨 Aparência
          </button>
          <button
            className={`tab-button ${activeTab === 'regional' ? 'active' : ''}`}
            onClick={() => setActiveTab('regional')}
          >
            🌍 Regional
          </button>
          <button
            className={`tab-button ${activeTab === 'notificacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notificacoes')}
          >
            🔔 Notificações
          </button>
          <button
            className={`tab-button ${activeTab === 'sistema' ? 'active' : ''}`}
            onClick={() => setActiveTab('sistema')}
          >
            🖥️ Sistema
          </button>
        </div>

        <div className="settings-modal-body">
          {activeTab === 'aparencia' && renderAparenciaTab()}
          {activeTab === 'regional' && renderRegionalTab()}
          {activeTab === 'notificacoes' && renderNotificacoesTab()}
          {activeTab === 'sistema' && renderSistemaTab()}
        </div>

        <div className="settings-modal-footer">
          <div className="footer-info">
            {unsavedChanges ? (
              <span className="warning-text">⚠️ Você tem alterações não salvas</span>
            ) : (
              <span className="success-text">✅ Todas as alterações foram salvas</span>
            )}
          </div>
          <div className="footer-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Cancelar
            </button>
            <button 
              className="btn-save" 
              onClick={handleSave}
              disabled={!unsavedChanges}
            >
              💾 Salvar Preferências
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
