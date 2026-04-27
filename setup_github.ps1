# GEOPERF Landing — push initial vers GitHub
# Usage : double-clic ou : powershell -ExecutionPolicy Bypass -File .\setup_github.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "=== Step 1/5 : Cleanup .git existant (si pourri) ===" -ForegroundColor Cyan
if (Test-Path .git) {
    Remove-Item -Path .git -Recurse -Force
    Write-Host "  .git supprimé." -ForegroundColor Green
} else {
    Write-Host "  Pas de .git, OK." -ForegroundColor Green
}

Write-Host "`n=== Step 2/5 : git init + config ===" -ForegroundColor Cyan
git init -q
git config user.email "flefebvre@jourdechance.com"
git config user.name "Fred Lefebvre"
git branch -M main
Write-Host "  Init OK, branch = main" -ForegroundColor Green

Write-Host "`n=== Step 3/5 : add + commit ===" -ForegroundColor Cyan
git add .
git commit -q -m "Initial scaffold: Next.js 15 landing pages with token tracking

- App Router routes /[sous_cat]?t=token + /api/download + /api/track
- Server-side token resolution via Supabase service_role
- Auto-tracking landing_visited / download_completed via prospect_events
- Editorial branding (Source Serif Pro + Inter + IBM Plex Mono, navy + amber)"
git log --oneline -1
Write-Host "  Commit OK." -ForegroundColor Green

Write-Host "`n=== Step 4/5 : remote ===" -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/leffred/geoperf-landing.git
git remote -v
Write-Host "  Remote OK." -ForegroundColor Green

Write-Host "`n=== Step 5/5 : push ===" -ForegroundColor Cyan
Write-Host "  Si ton terminal Windows a déjà un credential GitHub stocké (Git Credential Manager)," -ForegroundColor Yellow
Write-Host "  le push se fera silencieusement. Sinon une fenêtre browser s'ouvrira." -ForegroundColor Yellow
git push -u origin main

Write-Host "`n=== Done. ===" -ForegroundColor Green
Write-Host "Vérifie sur https://github.com/leffred/geoperf-landing" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaine étape : Vercel → New Project → Import depuis ce repo." -ForegroundColor Cyan
Write-Host "Variables d'environnement à configurer (cf .env.example):" -ForegroundColor Cyan
Write-Host "  - NEXT_PUBLIC_SUPABASE_URL = https://qfdvdcvqknoqfxetttch.supabase.co"
Write-Host "  - NEXT_PUBLIC_SUPABASE_ANON_KEY = (Supabase Dashboard → Settings → API → anon public)"
Write-Host "  - SUPABASE_SERVICE_ROLE_KEY = (idem → service_role)"
Write-Host "  - NEXT_PUBLIC_CALENDLY_URL = (ton URL Calendly)"
Write-Host "  - NEXT_PUBLIC_SITE_URL = https://geoperf.com"
