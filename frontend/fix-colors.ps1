# Script para substituir cores hardcoded por variáveis CSS
# Executa: .\fix-colors.ps1

Write-Host "🎨 Substituindo cores hardcoded por variáveis CSS..." -ForegroundColor Cyan

$files = @(
    "src\components\ReportsModal\ReportsModal.css",
    "src\components\HelpModal\HelpModal.css",
    "src\components\SearchModal\SearchModal.css",
    "src\components\ProductDetailModal\ProductDetailModal.css",
    "src\components\AccountDetailModal\AccountDetailModal.css",
    "src\components\VendedorDetailModal\VendedorDetailModal.css",
    "src\components\CompanySelector\CompanySelector.css",
    "src\components\TopBar\TopBar.css",
    "src\pages\Menu\Menu.css"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "📝 Processando: $file" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        $original = $content
        
        # Substituições
        $content = $content -replace 'linear-gradient\(135deg, #FF6B35 0%, #FF8C42 100%\)', 'var(--gradient-primary)'
        $content = $content -replace 'linear-gradient\(180deg, #FF6B35 0%, #FF8C42 100%\)', 'var(--gradient-primary-vertical)'
        $content = $content -replace 'linear-gradient\(90deg, #FF6B35 0%, #FF8C42 100%\)', 'var(--gradient-primary-horizontal)'
        
        $content = $content -replace 'background:\s*#FF6B35', 'background: var(--primary-color)'
        $content = $content -replace 'color:\s*#FF6B35', 'color: var(--primary-color)'
        $content = $content -replace 'border-color:\s*#FF6B35', 'border-color: var(--primary-color)'
        $content = $content -replace 'border:\s*([0-9]+px\s+solid\s+)#FF6B35', 'border: $1var(--primary-color)'
        $content = $content -replace 'border-top:\s*([0-9]+px\s+solid\s+)#FF6B35', 'border-top: $1var(--primary-color)'
        $content = $content -replace 'border-bottom-color:\s*#FF6B35', 'border-bottom-color: var(--primary-color)'
        $content = $content -replace 'accent-color:\s*#FF6B35', 'accent-color: var(--primary-color)'
        
        # Substituições com rgba
        $content = $content -replace 'rgba\(255,\s*107,\s*53,\s*([0-9.]+)\)', 'rgba(var(--primary-color-rgb), $1)'
        
        # Variações de escrita
        $content = $content -replace '#FF8C42', 'var(--primary-color-light)'
        $content = $content -replace '#E55A2B', 'var(--primary-color-dark)'
        
        if ($content -ne $original) {
            Set-Content $fullPath $content -NoNewline
            Write-Host "  ✅ Atualizado!" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  Nenhuma alteração necessária" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠️  Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Concluído!" -ForegroundColor Green
