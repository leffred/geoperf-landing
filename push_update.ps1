# GEOPERF Landing - push des updates vers GitHub
# Usage :
#   powershell -ExecutionPolicy Bypass -File .\push_update.ps1 -Msg "S14: dashboard refonte"
#   powershell -ExecutionPolicy Bypass -File .\push_update.ps1                  (utilise message par defaut)

param(
  [string]$Msg = ""
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "=== Verification du repo ===" -ForegroundColor Cyan
if (-not (Test-Path .git)) {
  Write-Host "ERREUR : pas de .git dans ce dossier. Lance setup_github.ps1 dabord." -ForegroundColor Red
  exit 1
}
Write-Host "  Repo OK." -ForegroundColor Green
git status --short
Write-Host ""

Write-Host "=== Add tous les changements ===" -ForegroundColor Cyan
git add -A
git status --short
Write-Host ""

Write-Host "=== Commit ===" -ForegroundColor Cyan

if ([string]::IsNullOrWhiteSpace($Msg)) {
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $commitMsg = "chore(landing): update $stamp"
  Write-Host "  Pas de -Msg fourni, utilisation message par defaut : $commitMsg" -ForegroundColor Yellow
} else {
  $commitMsg = $Msg
  Write-Host "  Message commit : $commitMsg" -ForegroundColor Green
}

git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
  Write-Host "Note : nothing to commit, passage a push direct." -ForegroundColor Yellow
}
git log --oneline -3
Write-Host ""

Write-Host "=== Push vers origin/main ===" -ForegroundColor Cyan
git push origin main
$pushExit = $LASTEXITCODE
if ($pushExit -ne 0) {
  Write-Host "ECHEC du push." -ForegroundColor Red
  Write-Host "Causes : pas de credentials GitHub, conflit, ou branch protection."
  exit 1
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Push reussi vers github.com/leffred/geoperf-landing" -ForegroundColor Green
Write-Host ""
Write-Host "Si Vercel est connecte au repo, le deploy se declenche automatiquement." -ForegroundColor Cyan
