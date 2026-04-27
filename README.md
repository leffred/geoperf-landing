# Geoperf — Landing pages

Next.js 15 (App Router) avec Supabase. Sert les landing pages personnalisées par sous-catégorie + token prospect.

## Routes

- `/` — page publique générique
- `/[sous_cat]?t=<token>` — landing personnalisée (résolution token → prospect → company → report)
  - Exemple : `/asset-management?t=ab12cd34ef56...`
- `POST /api/download?prospect_id=...&format=pdf|html` — log + signed URL fraîche
- `POST /api/track` — beacon tracking côté client

## Variables d'environnement

Voir `.env.example`. Variables requises :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `NEXT_PUBLIC_CALENDLY_URL`
- `NEXT_PUBLIC_SITE_URL`

## Local dev

```bash
cd landing
cp .env.example .env.local
# Renseigner les valeurs Supabase + Calendly
npm install
npm run dev
# Ouvrir http://localhost:3000/asset-management?t=<un_token_existant>
```

Pour tester : créer un prospect manuel en SQL :
```sql
INSERT INTO prospects (report_id, first_name, last_name, full_name, email)
VALUES ('61be49be-8e19-48b4-b50a-9a59f3cb987a', 'Test', 'User', 'Test User', 'test@example.com')
RETURNING id, tracking_token;
```

Puis utiliser le `tracking_token` retourné pour ouvrir `/asset-management?t=<token>`.

## Déploiement Vercel

1. Push le dossier `landing/` sur GitHub (ou monorepo)
2. Vercel → New Project → Import → choisir le repo + sub-directory `landing`
3. Configurer les variables d'environnement (cf `.env.example`)
4. Build command : `npm run build` · Output : `.next` · Node : 20.x
5. Domain : `geoperf.com` + wildcard `*.geoperf.com`

### Wildcard subdomain (futur — sub-cats par sous-domaine)

Si plus tard tu veux `asset-management.geoperf.com` au lieu de `geoperf.com/asset-management`, il faudra :
1. Ajouter un middleware Next qui lit le host header et réécrit l'URL
2. DNS OVH : `*.geoperf.com  CNAME  cname.vercel-dns.com.`
3. Vercel → Domains → ajouter `*.geoperf.com`

Pour le pilote v1, on reste en path-based (plus simple, même fonctionnalité).

## Structure

```
landing/
├── app/
│   ├── [sous_cat]/
│   │   ├── page.tsx           # Server component, résout token
│   │   └── DownloadButton.tsx # Client component, déclenche /api/download
│   ├── api/
│   │   ├── download/route.ts  # Log + signed URL fraîche
│   │   └── track/route.ts     # Beacon tracking
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Home publique
├── lib/
│   ├── supabase.ts            # Service client + anon client
│   └── tracking.ts            # resolveToken + logEvent
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Sécurité

- `SUPABASE_SERVICE_ROLE_KEY` n'est utilisée que dans `lib/supabase.ts:getServiceClient()` qui n'est appelée que dans les server components et route handlers. **Ne jamais l'importer dans un component avec `"use client"`**.
- Les tokens font 24 hex chars (12 bytes) → 96 bits d'entropie → bruteforce impossible.
- Pas de cookies, pas de session — chaque visite est tracée par token.

## Sprint 2.2 — TODO

- [ ] Middleware host-rewrite pour wildcard subdomain
- [ ] Page `/[sous_cat]/merci?bookedAt=...` après Calendly booking (Calendly webhook → POST /api/calendly-booked)
- [ ] Tracking pixel pour les emails Apollo (image 1x1 tracking open)
- [ ] OG image dynamique par prospect (Vercel OG)
- [ ] Variantes EN auto-détectées par locale
