# Análise Completa de Botões - Sistema Maderix
# Data: 29/10/2025

Write-Host "🔍 ANÁLISE COMPLETA DE BOTÕES E ESTADOS INTERATIVOS" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Gray
Write-Host ""

$basePath = "c:\Users\User\Documents\GitHub\Maderix\frontend\src"
$problemasEncontrados = @()

# Padrões problemáticos
$patterns = @(
    @{Name="Hover com cor hardcoded"; Pattern=':\s*hover.*background.*#[0-9a-fA-F]{6}'},
    @{Name="Active com cor hardcoded"; Pattern=':\s*active.*background.*#[0-9a-fA-F]{6}'},
    @{Name="Focus com cor hardcoded"; Pattern=':\s*focus.*background.*#[0-9a-fA-F]{6}'},
    @{Name="Border-color hardcoded"; Pattern='border-color:\s*#[0-9a-fA-F]{6}(?!\s*;?\s*\/\*.*var)'},
    @{Name="Background hardcoded"; Pattern='background:\s*#[0-9a-fA-F]{6}(?!\s*;?\s*\/\*)'},
    @{Name="Color hardcoded"; Pattern='(?<!--)color:\s*#[0-9a-fA-F]{6}(?!\s*;?\s*\/\*)'}
)

# Buscar em todos os CSS
$cssFiles = Get-ChildItem -Path $basePath -Recurse -Filter "*.css" | Where-Object { 
    $_.FullName -notlike "*node_modules*" 
}

Write-Host "📁 Arquivos CSS encontrados: $($cssFiles.Count)" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $cssFiles) {
    $relativePath = $file.FullName.Replace($basePath, "").TrimStart('\')
    $content = Get-Content $file.FullName -Raw
    
    $hasProblems = $false
    $fileProblems = @()
    
    foreach ($pattern in $patterns) {
        if ($content -match $pattern.Pattern) {
            $matches = [regex]::Matches($content, $pattern.Pattern)
            foreach ($match in $matches) {
                # Ignora se for dentro de comentário ou se já usa var()
                if ($match.Value -notlike "*var(*" -and $match.Value -notlike "*//*") {
                    $hasProblems = $true
                    $fileProblems += "  ⚠️  $($pattern.Name): $($match.Value.Trim())"
                }
            }
        }
    }
    
    if ($hasProblems) {
        Write-Host "❌ $relativePath" -ForegroundColor Red
        foreach ($problem in $fileProblems) {
            Write-Host $problem -ForegroundColor Yellow
        }
        Write-Host ""
        
        $problemasEncontrados += @{
            File = $relativePath
            Problems = $fileProblems
        }
    }
}

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Gray

if ($problemasEncontrados.Count -eq 0) {
    Write-Host "✅ NENHUM PROBLEMA ENCONTRADO!" -ForegroundColor Green
    Write-Host "Todos os botões e estados interativos estão usando variáveis CSS!" -ForegroundColor Green
} else {
    Write-Host "⚠️  TOTAL DE ARQUIVOS COM PROBLEMAS: $($problemasEncontrados.Count)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Arquivos que precisam de correção:" -ForegroundColor Yellow
    foreach ($item in $problemasEncontrados) {
        Write-Host "  - $($item.File)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Gray
Write-Host "✨ Análise concluída!" -ForegroundColor Cyan
