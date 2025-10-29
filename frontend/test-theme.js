/**
 * Script de teste para verificar se o Theme Manager está funcionando
 * 
 * COMO USAR:
 * 1. Abra o DevTools do navegador (F12)
 * 2. Cole este código no Console
 * 3. Execute
 */

console.log('🎨 Testando Theme Manager...\n');

// Verifica se as variáveis CSS existem
const root = document.documentElement;
const computedStyle = getComputedStyle(root);

const vars = [
  '--primary-color',
  '--primary-color-light',
  '--primary-color-dark',
  '--primary-color-rgb',
  '--gradient-primary'
];

console.log('📋 Variáveis CSS atuais:');
vars.forEach(varName => {
  const value = computedStyle.getPropertyValue(varName);
  console.log(`  ${varName}: ${value || '❌ NÃO DEFINIDA'}`);
});

// Testa mudança de cor
console.log('\n🔄 Testando mudança de cor para AZUL (#2196F3)...');
root.style.setProperty('--primary-color', '#2196F3');
root.style.setProperty('--primary-color-light', '#42A5F5');
root.style.setProperty('--primary-color-dark', '#1976D2');
root.style.setProperty('--primary-color-rgb', '33, 150, 243');
root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)');

setTimeout(() => {
  console.log('✅ Cor alterada! Verifique os elementos na tela.');
  console.log('   Se não mudou, significa que os CSS estão usando cores hardcoded.');
  
  console.log('\n🔄 Revertendo para LARANJA (#FF6B35) em 5 segundos...');
  
  setTimeout(() => {
    root.style.setProperty('--primary-color', '#FF6B35');
    root.style.setProperty('--primary-color-light', '#FF8C42');
    root.style.setProperty('--primary-color-dark', '#E55A2B');
    root.style.setProperty('--primary-color-rgb', '255, 107, 53');
    root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)');
    console.log('✅ Cor revertida para laranja!');
  }, 5000);
}, 1000);
