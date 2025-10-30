/**
 * Theme Manager - Gerencia as cores e temas do sistema
 */

/**
 * Converte HEX para RGB
 * @param {string} hex - Cor em hexadecimal (#RRGGBB)
 * @returns {string} - Valores RGB separados por vírgula (r, g, b)
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255, 107, 53'; // fallback para laranja padrão
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `${r}, ${g}, ${b}`;
};

/**
 * Ajusta o brilho de uma cor hexadecimal
 * @param {string} hex - Cor em hexadecimal
 * @param {number} percent - Porcentagem de ajuste (-100 a 100)
 * @returns {string} - Nova cor em hexadecimal
 */
export const adjustBrightness = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1).toUpperCase();
};

/**
 * Aplica o tema (claro/escuro/auto)
 * @param {string} theme - 'claro', 'escuro' ou 'auto'
 */
export const applyTheme = (theme) => {
  console.log('🌓 Aplicando tema:', theme);
  
  let finalTheme = theme;
  
  // Se for 'auto', detecta a preferência do sistema
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    finalTheme = prefersDark ? 'escuro' : 'claro';
    console.log('🔄 Modo auto detectado:', finalTheme);
  }
  
  // Aplica o atributo data-theme no elemento raiz
  if (finalTheme === 'escuro') {
    document.documentElement.setAttribute('data-theme', 'escuro');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  console.log('✅ Tema aplicado:', finalTheme);
};

/**
 * Aplica uma cor primária ao sistema
 * @param {string} primaryColor - Cor primária em hexadecimal
 */
export const applyPrimaryColor = (primaryColor) => {
  console.log('🎨 Aplicando cor primária:', primaryColor);
  const root = document.documentElement;
  
  // Cor primária
  root.style.setProperty('--primary-color', primaryColor);
  
  // Variação clara (+15% brilho)
  const lightColor = adjustBrightness(primaryColor, 15);
  root.style.setProperty('--primary-color-light', lightColor);
  
  // Variação escura (-15% brilho)
  const darkColor = adjustBrightness(primaryColor, -15);
  root.style.setProperty('--primary-color-dark', darkColor);
  
  // RGB para uso com opacity
  const rgbColor = hexToRgb(primaryColor);
  root.style.setProperty('--primary-color-rgb', rgbColor);
  
  // Atualiza accent-color para compatibilidade
  root.style.setProperty('--accent-color', lightColor);
  
  // Atualiza gradientes
  root.style.setProperty('--gradient-primary', 
    `linear-gradient(135deg, ${primaryColor} 0%, ${lightColor} 100%)`);
  root.style.setProperty('--gradient-primary-vertical', 
    `linear-gradient(180deg, ${primaryColor} 0%, ${lightColor} 100%)`);
  root.style.setProperty('--gradient-primary-horizontal', 
    `linear-gradient(90deg, ${primaryColor} 0%, ${lightColor} 100%)`);
  
  console.log('✅ Cores aplicadas:', {
    primary: primaryColor,
    light: lightColor,
    dark: darkColor,
    rgb: rgbColor
  });
};

/**
 * Carrega as preferências de tema do localStorage
 */
export const loadThemeFromStorage = () => {
  try {
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
      const parsed = JSON.parse(preferences);
      
      // Aplica o tema (claro/escuro/auto)
      if (parsed.tema) {
        applyTheme(parsed.tema);
      }
      
      // Aplica a cor primária
      if (parsed.corPrimaria) {
        applyPrimaryColor(parsed.corPrimaria);
      }
    } else {
      // Se não houver preferências salvas, aplica tema escuro como padrão
      console.log('⚙️ Nenhuma preferência encontrada, aplicando tema escuro padrão');
      applyTheme('escuro');
    }
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
    // Em caso de erro, também aplica tema escuro
    applyTheme('escuro');
  }
};

/**
 * Salva a cor primária no localStorage
 * @param {string} color - Cor em hexadecimal
 */
export const savePrimaryColor = (color) => {
  try {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    preferences.corPrimaria = color;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    applyPrimaryColor(color);
  } catch (error) {
    console.error('Erro ao salvar cor:', error);
  }
};

/**
 * Salva o tema escolhido no localStorage
 * @param {string} theme - 'claro', 'escuro' ou 'auto'
 */
export const saveTheme = (theme) => {
  try {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    preferences.tema = theme;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    applyTheme(theme);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
};

/**
 * Observer para mudanças na preferência de cor do sistema (modo auto)
 */
export const watchSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Só reage se o usuário estiver usando o modo 'auto'
    if (preferences.tema === 'auto') {
      const newTheme = e.matches ? 'escuro' : 'claro';
      console.log('🔄 Sistema mudou para:', newTheme);
      applyTheme('auto');
    }
  });
};

/**
 * Cores predefinidas para seleção rápida
 */
export const PRESET_COLORS = [
  { name: 'Laranja Maderix', value: '#FF6B35' },
  { name: 'Azul Profissional', value: '#2196F3' },
  { name: 'Verde Natureza', value: '#4CAF50' },
  { name: 'Roxo Moderno', value: '#9C27B0' },
  { name: 'Vermelho Energia', value: '#F44336' },
  { name: 'Turquesa Fresco', value: '#00BCD4' },
  { name: 'Laranja Vibrante', value: '#FF9800' },
  { name: 'Índigo Elegante', value: '#3F51B5' }
];

export default {
  hexToRgb,
  adjustBrightness,
  applyTheme,
  applyPrimaryColor,
  loadThemeFromStorage,
  savePrimaryColor,
  saveTheme,
  watchSystemTheme,
  PRESET_COLORS
};
