# 🌓 Implementação do Modo Escuro - Maderix

## ✅ O que foi implementado

### 1. **Variáveis CSS Completas** (`App.css`)
Criamos um sistema completo de variáveis CSS dividido em dois temas:

#### **Modo Claro (`:root`)**
- Cores de fundo: `--bg-body`, `--bg-color`, `--bg-secondary`, `--bg-elevated`
- Cards: `--card-bg`, `--card-border`, `--card-shadow`
- Textos: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
- Menu: `--menu-bg`, `--menu-text`, `--menu-hover-bg`
- Inputs: `--input-bg`, `--input-border`, `--input-text`
- Tabelas: `--table-bg`, `--table-header-bg`, `--table-border`
- Modais: `--modal-bg`, `--modal-overlay`, `--modal-border`
- Estados: `--success-color`, `--danger-color`, `--warning-color`, `--info-color`

#### **Modo Escuro (`[data-theme="escuro"]`)**
Todas as mesmas variáveis, mas com cores adaptadas para o modo escuro:
- Fundos escuros: `#0d1117`, `#161b22`, `#1c2128`
- Textos claros: `#e6edf3`, `#8b949e`, `#6e7681`
- Bordas sutis: `#30363d`
- Estados com cores ajustadas para melhor contraste

### 2. **Theme Manager Expandido** (`themeManager.js`)
Novas funções adicionadas:

```javascript
// Aplica o tema (claro/escuro/auto)
applyTheme(theme)

// Salva o tema escolhido
saveTheme(theme)

// Monitora mudanças do sistema (para modo auto)
watchSystemTheme()

// Carrega tema E cor primária
loadThemeFromStorage()
```

### 3. **Settings Modal Conectado**
O modal de preferências agora:
- ✅ Aplica preview em tempo real ao trocar o tema
- ✅ Salva a escolha do usuário
- ✅ Restaura o tema anterior ao cancelar
- ✅ Suporta 3 modos: Claro, Escuro e Auto

### 4. **App.js Inicialização**
- ✅ Carrega tema e cor ao iniciar o app
- ✅ Monitora preferências do sistema operacional
- ✅ Aplica automaticamente se o usuário escolheu modo "Auto"

### 5. **Body com Variáveis** (`index.css`)
- ✅ Background usa `--bg-body`
- ✅ Cor de texto usa `--text-default`
- ✅ Transição suave ao trocar temas

## 📋 Como funciona

### Toggle de Tema
1. Usuário abre **Preferências** → **Aparência**
2. Escolhe entre: ☀️ Claro / 🌙 Escuro / 🔄 Auto
3. Preview é aplicado instantaneamente
4. Ao salvar, a escolha é persistida no `localStorage`
5. Na próxima vez que abrir o sistema, o tema é restaurado

### Modo Auto
- Detecta a preferência do sistema operacional
- Se o SO está em modo escuro → aplica tema escuro
- Se o SO muda para claro → atualiza automaticamente
- Monitora mudanças em tempo real

## ⚠️ O que ainda precisa ser feito

### 🔴 CRÍTICO - Substituir cores hardcoded

Muitos arquivos CSS ainda têm cores fixas que **não respeitam** as variáveis CSS. Precisamos:

1. **Procurar por cores hardcoded** como:
   - `background: #ffffff` → `background: var(--bg-color)`
   - `color: #333` → `color: var(--text-primary)`
   - `border: 1px solid #ddd` → `border: 1px solid var(--card-border)`

2. **Arquivos prioritários para revisar:**
   - `Menu.css` - Menu lateral
   - `TopBar.css` - Barra superior
   - `Vendas.css`, `Clientes.css`, `Estoque.css` - Páginas principais
   - `NovaVenda.css`, `Produto.css` - Modais
   - Todos os arquivos em `pages/*/` e `components/*/`

3. **Cores que DEVEM usar variáveis:**
   ```css
   /* ❌ ERRADO */
   background: #ffffff;
   color: #333;
   border: 1px solid #ddd;
   
   /* ✅ CORRETO */
   background: var(--bg-color);
   color: var(--text-primary);
   border: 1px solid var(--card-border);
   ```

### 📊 Status da Conversão

| Componente | Status | Prioridade |
|------------|--------|-----------|
| `App.css` | ✅ Completo | - |
| `index.css` | ✅ Completo | - |
| `Menu.css` | ⚠️ Parcial | 🔴 Alta |
| `TopBar.css` | ⚠️ Parcial | 🔴 Alta |
| `SettingsModal.css` | ❌ Pendente | 🔴 Alta |
| `HelpModal.css` | ❌ Pendente | 🟡 Média |
| Páginas (`pages/**/*.css`) | ❌ Pendente | 🔴 Alta |
| Modais (`components/**/*.css`) | ❌ Pendente | 🟡 Média |

## 🎯 Próximos Passos

### Passo 1: Auditar Cores (RECOMENDADO)
Execute o script que criamos para encontrar cores hardcoded:

```powershell
cd c:\Users\User\Documents\GitHub\Maderix\frontend
.\analyze-buttons.ps1
```

### Passo 2: Converter Arquivos Prioritários
Ordem sugerida:
1. ✅ `Menu.css` - Menu lateral
2. ✅ `TopBar.css` - Barra superior  
3. ✅ `SettingsModal.css` - Modal de preferências
4. ✅ Páginas principais (Vendas, Clientes, Estoque)
5. ✅ Modais de formulário

### Passo 3: Testar Modo Escuro
1. Abrir Preferências → Aparência
2. Alternar entre Claro e Escuro
3. Verificar se **todos** os elementos mudam de cor
4. Procurar por textos ilegíveis ou contrastes ruins

### Passo 4: Ajustes Finos
- Ajustar contrastes se necessário
- Verificar acessibilidade (WCAG)
- Testar em diferentes navegadores

## 🛠️ Ferramentas de Teste

### Teste Manual
```javascript
// No console do navegador:

// Ativar modo escuro
document.documentElement.setAttribute('data-theme', 'escuro');

// Voltar para modo claro
document.documentElement.removeAttribute('data-theme');
```

### Inspecionar Variáveis
```javascript
// Ver valor atual de uma variável CSS
getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
```

## 📝 Checklist Completo

- [x] Criar variáveis CSS para modo claro
- [x] Criar variáveis CSS para modo escuro
- [x] Implementar função `applyTheme()`
- [x] Conectar com SettingsModal
- [x] Salvar preferência no localStorage
- [x] Carregar tema ao iniciar app
- [x] Implementar modo "Auto"
- [x] Monitorar preferências do sistema
- [ ] **Converter Menu.css**
- [ ] **Converter TopBar.css**
- [ ] **Converter SettingsModal.css**
- [ ] **Converter páginas principais**
- [ ] **Converter modais**
- [ ] **Testar todas as telas**
- [ ] **Ajustar contrastes**
- [ ] **Validar acessibilidade**

## 💡 Dicas

1. **Sempre use variáveis CSS** ao invés de cores hardcoded
2. **Teste em modo escuro** após cada alteração
3. **Mantenha contraste adequado** para acessibilidade
4. **Use transições** para mudanças suaves (`transition: background-color 0.3s ease`)

## 🎨 Paleta de Cores

### Modo Claro
- Background principal: `#ffffff`
- Background secundário: `#f8f9fa`
- Texto principal: `#1a1a1a`
- Texto secundário: `#666666`
- Bordas: `#e6e6e6`

### Modo Escuro
- Background principal: `#161b22`
- Background secundário: `#0d1117`
- Texto principal: `#e6edf3`
- Texto secundário: `#8b949e`
- Bordas: `#30363d`

## 📚 Referências

- [GitHub Dark Theme](https://github.com/settings/appearance) - Inspiração para paleta escura
- [Material Design Dark Theme](https://material.io/design/color/dark-theme.html)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
