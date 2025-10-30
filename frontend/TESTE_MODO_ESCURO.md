# 🌓 TESTE RÁPIDO DO MODO ESCURO

## Como Testar:

### Método 1: Via Console do Navegador
1. Abra o sistema no navegador
2. Aperte `F12` para abrir DevTools  
3. Vá na aba **Console**
4. Cole este comando:

```javascript
// Ativar modo escuro
document.documentElement.setAttribute('data-theme', 'escuro');
```

5. Para voltar ao claro:
```javascript
// Desativar modo escuro
document.documentElement.removeAttribute('data-theme');
```

### Método 2: Via Preferências (quando funcionar)
1. Clique em **Preferências** (⚙️)
2. Vá para aba **Aparência**
3. Clique em **🌙 Escuro**
4. Clique em **Salvar**

## O que deve acontecer:

### ✅ Já funciona:
- Fundo da página principal (deve ficar cinza escuro)
- Cards/containers das páginas (deve ficar cinza médio)
- Textos (devem ficar claros/brancos)

### ⚠️ Ainda não funciona (cores hardcoded):
- Menu lateral
- TopBar
- Modais
- Formulários
- Tabelas

## Teste Visual:

Execute no console:
```javascript
// Loop que alterna entre claro e escuro
let dark = false;
setInterval(() => {
  dark = !dark;
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'escuro');
    console.log('🌙 Modo ESCURO');
  } else {
    document.documentElement.removeAttribute('data-theme');
    console.log('☀️ Modo CLARO');
  }
}, 2000);
```

Isso vai alternar automaticamente a cada 2 segundos para você ver a diferença!

## Próximos Arquivos a Converter:

1. **Menu.css** - ~100+ cores hardcoded
2. **TopBar.css** - ~50+ cores hardcoded  
3. **SettingsModal.css** - ~30+ cores hardcoded
4. Páginas individuais

## Debug:

Ver valor atual das variáveis CSS:
```javascript
const root = document.documentElement;
const computedStyle = getComputedStyle(root);

console.log('--bg-body:', computedStyle.getPropertyValue('--bg-body'));
console.log('--card-bg:', computedStyle.getPropertyValue('--card-bg'));
console.log('--text-primary:', computedStyle.getPropertyValue('--text-primary'));
console.log('--menu-bg:', computedStyle.getPropertyValue('--menu-bg'));
```
