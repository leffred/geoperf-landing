# CLAUDE.md — landing (frontend Geoperf)

> Sous-projet `frontend` de GEOPERF. Repo séparé `leffred/geoperf-landing`, déployé sur Vercel à `geoperf.com`.

---

## TL;DR

Next.js 15 App Router + Tailwind + TypeScript strict. Server-rendered, no client state global, auth = `tracking_token` URL. Branding Editorial (navy + amber).

---

## Routes (25 total)

### Publiques (indexées)
- `/` — home générique
- `/sample` — aperçu LB Asset Management (lead capture indirect via /contact)
- `/about` — pitch méthodo
- `/contact` — email + Calendly
- `/privacy` — politique RGPD
- `/terms` — CGU + mentions légales
- `/profile/[domain]` — page SEO générative par société (score IA, gap, citations LLMs, CTA audit). Sitemap dynamique enumère toutes les companies du DB.

### Personnalisées (noindex)
- `/[sous_cat]?t=<token>` — landing perso prospect (ex : `/asset-management?t=...`)
- `/portal?t=<token>` — dashboard client perso
- `/merci?p=<prospect_id>&format=...` — post-download

### Admin (Supabase Auth session)
- `/admin/login` — form email/mdp
- `/admin` — backoffice principal (KPIs + actions + prospects)
- `/admin/profiles` — index des pages SEO `/profile/[domain]`
- `/admin/prospects/[id]` — page détail prospect (events, copy email, liens portal/profile/LinkedIn)
- `/admin/logout` — POST signOut

### API
- `POST /api/download` — log + signed URL fraîche
- `POST /api/track` — beacon générique
- `GET /api/pixel/[token].png` — tracking pixel emails (200 + log async)
- `GET /api/click?t=&u=&l=` — redirect tracker (allowlist hosts)
- `GET /api/og?t=` — OG image dynamique (Edge runtime, fetch direct PostgREST)
- `POST /api/admin/trigger` — proxy webhooks n8n. Auth = session Supabase OU Bearer token. Actions : `extract`, `synthesis`, `sourcing`, `sequence_load`.
- `POST /api/calendly-webhook` — handler Calendly (HMAC-SHA256 verif)

### Auto
- `/sitemap.xml` (généré par `app/sitemap.ts`)
- `/robots.txt` (généré par `app/robots.ts`)

---

## Conventions code

### TypeScript
- `strict: true` activé — pas de `any` implicite
- Cast explicite `(data as any)` autorisé pour les retours Supabase quand le typage embed est complexe
- Utiliser optional chaining `?.` et nullish `??` plutôt que `&&` chains

### React Server Components vs Client
- **Server par défaut** (`async function ...`) pour toute page qui lit la DB
- **Client only si interaction** (`"use client"` au top du fichier) — ex : `DownloadButton.tsx`, `AdminActions.tsx`
- `lib/supabase.ts:getServiceClient()` ne JAMAIS importer dans un client component (leak service_role)

### Naming
- Routes API : `app/api/<route>/route.ts`
- Pages : `app/<segment>/page.tsx`
- Components UI réutilisables : `components/ui/<Name>.tsx` (PascalCase)
- Lib server-only : `lib/<name>.ts` (camelCase)

### Imports
- Alias `@/` pointe vers la racine `landing/` (configuré dans `tsconfig.json` `paths`)
- Préférer `import { Foo } from "@/components/ui/Bar"` à `"../../components/..."`

---

## Branding Editorial — couleurs Tailwind

```ts
// tailwind.config.ts
navy:   "#042C53"  // primaire
navy-light: "#0C447C"
amber:  "#EF9F27"  // accent (le "·" du logo, CTAs primaires sur fond navy)
cream:  "#F1EFE8"  // backgrounds doux
ink:    "#2C2C2A"  // texte principal
ink-muted: "#5F5E5A"  // texte secondaire
```

```ts
// fonts
font-serif: 'Source Serif Pro' (Google Fonts) — titres, h1-h4
font-sans:  'Inter' — corps de texte
font-mono:  'IBM Plex Mono' — eyebrow text, données techniques
```

### Patterns visuels
- **Eyebrow** : `<p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-3">SECTION 01</p>` au-dessus des h2
- **CTA primaire** sur fond navy : amber background `bg-amber text-navy hover:bg-amber/90`
- **CTA secondaire** sur fond navy : outline `border border-white/40 hover:bg-white/10`
- **Border-left** ambre 2px pour les blocs accent : `border-l-2 border-amber pl-4`
- **Section pattern** : `<Section eyebrow="..." tone="navy|cream|white" py="sm|md|lg">`

---

## Composants UI réutilisables

Toujours préférer ces components avant de coder du HTML brut :

| Component | Fichier | Quand l'utiliser |
|---|---|---|
| `Button` | `components/ui/Button.tsx` | Tout CTA (variants : primary, secondary, ghost, outline-light) |
| `Section` | `components/ui/Section.tsx` | Section de page avec padding + tone + eyebrow |
| `Header` | `components/ui/Header.tsx` | Top de chaque page (logo + slot droit) |
| `Footer` | `components/ui/Footer.tsx` | Bas de chaque page (mentions légales + nav links) |
| `Card` | `components/ui/Card.tsx` | Container générique 3 variants (default/highlight/bordered) |
| `Stat` | `components/ui/Card.tsx` | KPI carré avec valeur + label |

---

## Auth pattern

**Mix : tokens pour les flows publics + Supabase Auth (email/mdp) pour l'admin.**

| Auth | Source | Usage |
|---|---|---|
| `tracking_token` (24 hex) | Auto-généré sur `prospects.tracking_token` | URL `?t=...` pour landing perso + portal client |
| **Supabase Auth session cookie** | `signInWithPassword` via `/admin/login` | Pages `/admin/*` (middleware redirect si pas loggué) |
| `GEOPERF_ADMIN_TOKEN` | Env var Vercel | Backdoor `Authorization: Bearer ...` pour appels externes (cron, GitHub Actions) sur `/api/admin/*` |
| `CALENDLY_WEBHOOK_SECRET` | Env var Vercel | Vérif HMAC-SHA256 du header `Calendly-Webhook-Signature` |

`/api/admin/trigger` accepte session OU Bearer token (les deux marchent). La session est utilisée par le browser, le token reste pour l'automation externe.

### Fichiers auth admin
- `lib/supabase-server-auth.ts` — `getSupabaseServerClient()` + `getAdminUser()`
- `middleware.ts` — refresh session sur `/admin/*`, redirect login si absent
- `app/admin/login/page.tsx` + `actions.ts` — form login (server action)
- `app/admin/logout/route.ts` — POST handler signOut

---

## Données live

Toutes les pages SSR query Supabase via `lib/supabase.ts:getServiceClient()` :

```ts
const sb = getServiceClient();
const { data } = await sb.from("v_portal_dashboard").select("*").eq("tracking_token", token).maybeSingle();
```

**Vues SQL utilisées** (toutes dans schema `public`) :
- `v_prospect_landing_context` — pour `/[sous_cat]`
- `v_portal_dashboard` — pour `/portal`
- `v_portal_company_activity` — agg équipe d'une boîte
- `v_portal_competitors` — top-5 concurrents par report
- `v_ai_saturation_opportunities` — pour `/admin` (opportunités HOT/WARM)

Si une page a besoin d'un nouveau pattern de query, créer une vue SQL plutôt qu'un join dans `lib/`. Plus simple, plus performant, plus cacheable.

---

## Tracking events

Tous les events utilisateur passent par `lib/tracking.ts:logEvent()` :

```ts
await logEvent({
  prospect_id: ctx.prospect_id,
  event_type: "landing_visited",  // string union, voir EventType
  channel: "web",                 // optional, default "web"
  metadata: { ... }               // libre
});
```

**Status transitions** (engaged, converted, opted_out, bounced) sont gérées AUTOMATIQUEMENT par le trigger Postgres `handle_prospect_engagement` côté DB, pas en TS. Ne pas dupliquer la logique.

---

## Edge runtime (`/api/og`)

Le seul fichier qui utilise `export const runtime = "edge"` est `app/api/og/route.tsx` (`next/og` requiert edge).

**En edge** :
- ❌ `@supabase/supabase-js` ne marche pas bien
- ✅ Utiliser `fetch` direct vers `${SUPABASE_URL}/rest/v1/...` avec headers `apikey` + `Authorization`
- ❌ Pas d'accès aux Node APIs (`crypto`, `fs`, etc.)
- ✅ Web APIs (`fetch`, `URL`, `URLSearchParams`, `crypto.subtle`) OK

---

## Build & déploiement

### Local
```bash
cd landing
cp .env.example .env.local  # remplir les 6 vars
npm install
npm run dev   # http://localhost:3000
npm run build # validation SSR + types — DOIT PASSER avant push
```

### Push
```powershell
powershell -ExecutionPolicy Bypass -File .\push_update.ps1
```

Le script :
1. `git add -A`
2. `git commit -m "<message>"`
3. `git push origin main`

Vercel auto-redeploy en 1-2 min.

### Vercel env vars (6 + 1 optionnel)
```
NEXT_PUBLIC_SUPABASE_URL=https://qfdvdcvqknoqfxetttch.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
SUPABASE_SERVICE_ROLE_KEY=<service_role>      # Sensitive
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/jourdechance/audit-geo
NEXT_PUBLIC_SITE_URL=https://geoperf.com
GEOPERF_ADMIN_TOKEN=<random 32 hex>            # Sensitive
CALENDLY_WEBHOOK_SECRET=<from Calendly>        # Sensitive, optionnel jusqu'à brancher Calendly
```

---

## Anti-patterns / pas faire

1. **Importer `getServiceClient()` dans un component avec `"use client"`** — leak du service_role
2. **Hardcoder le token admin / service role** dans le code — toujours via env vars
3. **Dupliquer la logique de status transition** — c'est dans le trigger Postgres
4. **Faire un `.then()` chain dans un Server Component** — utiliser `async/await`
5. **Embarquer Supabase URL en SSG** — toutes les pages avec données live doivent être `dynamic`
6. **Écrire un fichier .tsx > 150 lignes via Write tool** (mount Windows tronque) — passer par bash heredoc ou découper en sub-components
7. **Imports relatifs profonds** (`../../../foo`) — utiliser l'alias `@/`

---

## Structure dossier

```
landing/
├── app/
│   ├── [sous_cat]/        Landing perso (page.tsx + DownloadButton.tsx)
│   ├── admin/             Backoffice (page.tsx + AdminActions.tsx)
│   ├── portal/            Dashboard client (page.tsx)
│   ├── api/
│   │   ├── admin/trigger/
│   │   ├── calendly-webhook/
│   │   ├── click/
│   │   ├── download/
│   │   ├── og/            (Edge runtime)
│   │   ├── pixel/[token]/
│   │   └── track/
│   ├── about|contact|privacy|terms|sample|merci/
│   ├── globals.css        (Tailwind import)
│   ├── layout.tsx         (Google Fonts, html/body)
│   ├── page.tsx           (home)
│   ├── robots.ts          (auto-gen /robots.txt)
│   └── sitemap.ts         (auto-gen /sitemap.xml)
├── components/ui/         Button, Card, Footer, Header, Section
├── lib/
│   ├── supabase.ts        getServiceClient + getAnonClient
│   ├── tracking.ts        resolveToken + logEvent
│   └── portal.ts          loadPortalData + buildRecommendations
├── public/                favicon.svg
├── .env.example
├── next.config.mjs
├── package.json           (Next 15.5, React 19, Tailwind 3.4)
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json            (force framework: nextjs)
```

---

## Comment briefer Claude pour ce sous-projet

```
Frontend — ajoute X dans /portal section recommandations
Frontend — bug : OG image affiche pas le score, regarde /api/og
Frontend — refacto : extraire le KPI grid de /admin en composant réutilisable
```

Si tu touches au backend ou aux migrations SQL, dis-le explicitement (`reporting-engine` ou `outreach-engine`) car ce sont d'autres sous-projets.
