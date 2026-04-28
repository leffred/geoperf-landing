# GEOPERF Landing - push des updates vers GitHub
# Usage : powershell -ExecutionPolicy Bypass -File .\push_update.ps1

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

$msgLines = @(
  "Night build : front complet + features bonus",
  "",
  "Front :",
  "- 7 pages publiques + 2 noindex (admin, merci)",
  "- Composants UI reutilisables",
  "- Routes API : /og, /pixel, /click, /track",
  "- Sitemap + robots auto-generes",
  "- generateMetadata sur landings personnalisees",
  "- Backoffice admin token-protected",
  "",
  "Backend (deploye sur Supabase) :",
  "- Edge Function v5 (PDFShift fix)",
  "- Trigger pg_net auto-chain Phase 1 vers Synthesis",
  "- Trigger engagement auto sur prospect_events",
  "- Score saturation IA",
  "",
  "Quality : Build local valide (16 routes, 0 erreur). Next.js 15.5.",
  "Test mode : aucun envoi email."
)
$commitMsg = ($msgLines -join "`n")

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
