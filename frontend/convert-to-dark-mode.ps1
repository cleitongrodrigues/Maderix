# Script de Conversão Automática para Modo Escuro
# Substitui cores hardcoded por variáveis CSS

Write-Host "🌓 CONVERSÃO PARA MODO ESCURO" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Gray
Write-Host ""

$basePath = "c:\Users\User\Documents\GitHub\Maderix\frontend\src"

# Mapeamento de cores para variáveis CSS
$colorMap = @{
    # Backgrounds brancos/claros
    'background:\s*#ffffff' = 'background: var(--bg-color)'
    'background:\s*#fff\b' = 'background: var(--bg-color)'
    'background:\s*white' = 'background: var(--bg-color)'
    'background:\s*#f8f9fa' = 'background: var(--bg-secondary)'
    'background:\s*#f9fafb' = 'background: var(--bg-secondary)'
    'background:\s*#f5f6fa' = 'background: var(--bg-body)'
    'background:\s*#f3f4f6' = 'background: var(--input-disabled-bg)'
    'background:\s*#f1f1f1' = 'background: var(--scrollbar-track)'
    'background-color:\s*#ffffff' = 'background-color: var(--bg-color)'
    'background-color:\s*#fff\b' = 'background-color: var(--bg-color)'
    'background-color:\s*#f8f9fa' = 'background-color: var(--bg-secondary)'
    'background-color:\s*#f3f4f6' = 'background-color: var(--input-disabled-bg)'
    
    # Textos escuros
    'color:\s*#1a1a1a' = 'color: var(--text-primary)'
    'color:\s*#1f2937' = 'color: var(--text-primary)'
    'color:\s*#333333' = 'color: var(--text-primary)'
    'color:\s*#333\b' = 'color: var(--text-primary)'
    'color:\s*#374151' = 'color: var(--text-primary)'
    'color:\s*#2f353a' = 'color: var(--text-default)'
    'color:\s*#666666' = 'color: var(--text-secondary)'
    'color:\s*#666\b' = 'color: var(--text-secondary)'
    'color:\s*#6b7280' = 'color: var(--text-secondary)'
    'color:\s*#999999' = 'color: var(--text-muted)'
    'color:\s*#999\b' = 'color: var(--text-muted)'
    'color:\s*#94a3b8' = 'color: var(--text-muted)'
    'color:\s*#a0a6b1' = 'color: var(--menu-text-muted)'
    'color:\s*#8b949e' = 'color: var(--text-secondary)'
    
    # Textos claros (para menus escuros)
    'color:\s*#e2e8f0' = 'color: var(--menu-text)'
    'color:\s*#cbd5e1' = 'color: var(--menu-text)'
    'color:\s*#ffffff' = 'color: var(--text-inverse)'
    'color:\s*white' = 'color: var(--text-inverse)'
    
    # Bordas
    'border:\s*1px solid #e6e6e6' = 'border: 1px solid var(--card-border)'
    'border:\s*1px solid #ddd' = 'border: 1px solid var(--input-border)'
    'border:\s*1px solid #e5e7eb' = 'border: 1px solid var(--card-border)'
    'border:\s*1px solid #d1d5db' = 'border: 1px solid var(--input-border)'
    'border-bottom:\s*1px solid #e6e6e6' = 'border-bottom: 1px solid var(--card-border)'
    'border-bottom:\s*1px solid #e5e7eb' = 'border-bottom: 1px solid var(--card-border)'
    'border-bottom:\s*1px solid #ddd' = 'border-bottom: 1px solid var(--input-border)'
    'border-bottom:\s*2px solid #e5e7eb' = 'border-bottom: 2px solid var(--card-border)'
    'border-left:\s*4px solid #f59e0b' = 'border-left: 4px solid var(--warning-color)'
    'border-color:\s*#e6e6e6' = 'border-color: var(--card-border)'
    'border-color:\s*#ddd' = 'border-color: var(--input-border)'
    
    # Estados - Success (mantém cores específicas)
    # Estados - Danger (mantém cores específicas)  
    # Estados - Warning (mantém cores específicas)
    
    # Scrollbar
    'background:\s*#f1f1f1' = 'background: var(--scrollbar-track)'
    'background:\s*#c1c1c1' = 'background: var(--scrollbar-thumb)'
}

# Arquivos prioritários para converter
$priorityFiles = @(
    "pages\Menu\Menu.css",
    "components\TopBar\TopBar.css",
    "components\SettingsModal\SettingsModal.css",
    "App.css"
)

Write-Host "📝 Arquivos prioritários a converter:" -ForegroundColor Yellow
foreach ($file in $priorityFiles) {
    $fullPath = Join-Path $basePath $file
    if (Test-Path $fullPath) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (não encontrado)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "⚠️  Este script substituirá cores hardcoded por variáveis CSS" -ForegroundColor Yellow
Write-Host "    Deseja continuar? (S/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -ne 'S' -and $response -ne 's') {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔄 Iniciando conversão..." -ForegroundColor Cyan
Write-Host ""

$totalReplacements = 0

foreach ($file in $priorityFiles) {
    $fullPath = Join-Path $basePath $file
    
    if (!(Test-Path $fullPath)) {
        continue
    }
    
    Write-Host "📄 Processando: $file" -ForegroundColor White
    
    $content = Get-Content $fullPath -Raw
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($pattern in $colorMap.Keys) {
        $replacement = $colorMap[$pattern]
        $matches = [regex]::Matches($content, $pattern, 'IgnoreCase')
        
        if ($matches.Count -gt 0) {
            $content = [regex]::Replace($content, $pattern, $replacement, 'IgnoreCase')
            $fileReplacements += $matches.Count
            Write-Host "   ✓ Substituiu '$pattern' → '$replacement' ($($matches.Count)x)" -ForegroundColor Green
        }
    }
    
    if ($fileReplacements -gt 0) {
        Set-Content -Path $fullPath -Value $content -NoNewline
        $totalReplacements += $fileReplacements
        Write-Host "   💾 Salvo com $fileReplacements substituições" -ForegroundColor Cyan
    } else {
        Write-Host "   ℹ️  Nenhuma substituição necessária" -ForegroundColor Gray
    }
    
    Write-Host ""
}

Write-Host "=" * 80 -ForegroundColor Gray
Write-Host "✅ Conversão concluída!" -ForegroundColor Green
Write-Host "   Total de substituições: $totalReplacements" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Teste o modo escuro no sistema" -ForegroundColor White
Write-Host "   2. Ajuste manualmente cores especiais (badges, estados, etc.)" -ForegroundColor White
Write-Host "   3. Verifique contraste e legibilidade" -ForegroundColor White
Write-Host ""
