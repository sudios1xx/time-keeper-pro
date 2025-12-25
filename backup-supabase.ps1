# Script de Backup do Supabase
# Uso: .\backup-supabase.ps1

Write-Host "=== Backup do Supabase ===" -ForegroundColor Cyan

# Verifica se o arquivo de configuração existe
$configFile = "backup-config.txt"
if (-not (Test-Path $configFile)) {
    Write-Host "ERRO: Arquivo '$configFile' não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Crie o arquivo '$configFile' com a connection string do Supabase:" -ForegroundColor Yellow
    Write-Host "postgresql://postgres:SUA_SENHA@db.SEU_PROJECT_ID.supabase.co:5432/postgres" -ForegroundColor Gray
    exit 1
}

# Lê a connection string
$dbUrl = Get-Content $configFile -Raw | ForEach-Object { $_.Trim() }

if ([string]::IsNullOrWhiteSpace($dbUrl)) {
    Write-Host "ERRO: Connection string vazia no arquivo '$configFile'!" -ForegroundColor Red
    exit 1
}

# Verifica se pg_dump está instalado
$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDump) {
    Write-Host "ERRO: pg_dump não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale o PostgreSQL para Windows:" -ForegroundColor Yellow
    Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ou use o instalador via winget:" -ForegroundColor Yellow
    Write-Host "winget install PostgreSQL.PostgreSQL" -ForegroundColor Gray
    exit 1
}

# Cria pasta de backups se não existir
$backupDir = "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Pasta 'backups' criada." -ForegroundColor Green
}

# Gera timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$backupDir\supabase_backup_$timestamp.dump"

Write-Host ""
Write-Host "Fazendo backup..." -ForegroundColor Yellow
Write-Host "Arquivo: $backupFile" -ForegroundColor Gray

# Faz o backup completo (schema + dados)
try {
    & pg_dump "$dbUrl" `
        --format=custom `
        --no-owner `
        --no-privileges `
        --file="$backupFile" `
        --verbose

    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Host ""
        Write-Host "✓ Backup concluído com sucesso!" -ForegroundColor Green
        Write-Host "  Arquivo: $backupFile" -ForegroundColor Gray
        Write-Host "  Tamanho: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Dica: Faça backup regularmente e guarde em local seguro (Google Drive, HD externo, etc.)" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "ERRO: Falha ao fazer backup (código: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "Verifique a connection string e sua conexão com a internet." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}






