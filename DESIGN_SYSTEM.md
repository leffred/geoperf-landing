# Geoperf — Design System (Direction B "Tech crisp")

> Référence interne. Tous les fichiers ci-dessous sont prêts à coller dans `landing/`. Migration en 1 seul commit recommandée pour éviter un site mi-ancien mi-nouveau.

---

## Philosophie

**Moderne, rassurant, technologique** — référence : Linear, Vercel, Mercury, Stripe.

3 principes :
1. **Blanc dominant + grands espaces** → réassure les décideurs B2B FR (asset mgmt, banque, assurance).
2. **Mono pour la donnée** → JetBrains Mono signe le côté "moteur d'analyse" sans tomber dans le hacker-look.
3. **Un seul accent fort** → bleu électrique pour l'action ; tout le reste est neutre. Pas de cocktail de couleurs.

**À conserver de l'identité actuelle** : le glyphe `·` ambré dans le wordmark (signature mémorable) — déplacé dans une version plus tech (variante B+) si tu veux garder l'amber comme accent dominant.

---

## Tokens

### Palette

| Token | Hex | Usage |
|---|---|---|
| `bg-base` | `#FFFFFF` | Background principal |
| `bg-surface` | `#F7F8FA` | Cards, sections alternées |
| `bg-surface-2` | `#EEF1F5` | Hover sur surface |
| `ink` | `#0A0E1A` | Texte primaire, boutons solides |
| `ink-muted` | `#5B6478` | Texte secondaire, sous-titres |
| `ink-subtle` | `#8C94A6` | Hints, captions, eyebrows non-mono |
| `border-base` | `rgba(10,14,26,0.08)` | Bordures par défaut (0.5px effect) |
| `border-strong` | `rgba(10,14,26,0.14)` | Hover, focus rings discrets |
| `brand-500` | `#2563EB` | Action primaire, liens, accents data |
| `brand-600` | `#1D4ED8` | Hover sur brand-500 |
| `brand-50` | `#EFF4FE` | Background tinted (banner info, badge brand) |
| `success` | `#059669` | Validation, état OK |
| `warning` | `#D97706` | Avertissement, état à surveiller |
| `danger` | `#DC2626` | Erreur, suppression |
| `amber` (legacy) | `#EF9F27` | Conservé pour `Ge·perf` wordmark dot uniquement |

### Variante B+ (si tu veux garder l'ambre comme accent dominant)
Remplace `brand-500` → `#C77D2C` · `brand-600` → `#A05F1F` · `brand-50` → `#FAF1E4`. Tout le reste identique. Le `glyphe ·` ambré devient cohérent avec le CTA et les liens.

### Typographie

| Famille | Usage | Poids |
|---|---|---|
| Inter | UI, body, headings | 400, 500, 600 |
| JetBrains Mono | Eyebrows, data labels, code, valeurs numériques | 400, 500 |

Échelle (Tailwind) :
- `text-xs` 12px / `text-sm` 14px / `text-base` 16px / `text-lg` 18px
- `text-xl` 20px / `text-2xl` 24px / `text-3xl` 30px / `text-4xl` 36px / `text-5xl` 48px / `text-6xl` 60px
- H1 hero : `text-5xl md:text-6xl tracking-tight font-medium leading-[1.05]`
- H2 section : `text-3xl md:text-4xl tracking-tight font-medium leading-[1.15]`
- H3 sous-section : `text-xl font-medium`
- Body : `text-base text-ink-muted leading-relaxed`
- Eyebrow : `font-mono text-xs uppercase tracking-[0.18em] text-brand-500`

### Spacing & Radius

- Sections : `py-20 md:py-28` (vertical) / `px-6 md:px-8` (horizontal)
- Container : `max-w-6xl mx-auto`
- Radius : `rounded-md` (6px) inputs/buttons · `rounded-lg` (10px) cards · `rounded-xl` (14px) hero illustrations · `rounded-2xl` (16px) dashboards mockups
- Shadow : `shadow-card` (custom, voir tailwind.config) — très subtil, jamais flou ni teinté

### Motion

- Durée : `duration-150` par défaut, `duration-200` pour transitions de couleur
- Easing : `ease-out` partout
- Pas de bounce, pas de spring exagéré

---

## Fichiers à appliquer

### 1. `landing/tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0E1A",
          muted: "#5B6478",
          subtle: "#8C94A6",
        },
        surface: {
          DEFAULT: "#F7F8FA",
          2: "#EEF1F5",
        },
        brand: {
          50: "#EFF4FE",
          500: "#2563EB",
          600: "#1D4ED8",
        },
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
        // Legacy — pour le glyphe `·` du wordmark uniquement
        amber: { DEFAULT: "#EF9F27" },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderColor: {
        DEFAULT: "rgba(10,14,26,0.08)",
        strong: "rgba(10,14,26,0.14)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,14,26,0.04), 0 0 0 0.5px rgba(10,14,26,0.06)",
        cardHover: "0 4px 12px rgba(10,14,26,0.06), 0 0 0 0.5px rgba(10,14,26,0.10)",
      },
      letterSpacing: {
        tightish: "-0.015em",
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
```

### 2. `landing/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geoperf — Études sectorielles de visibilité LLM",
  description: "Mesurez la perception de votre marque par ChatGPT, Gemini, Claude et Perplexity.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://geoperf.com"),
  openGraph: { type: "website", siteName: "Geoperf" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
```

### 3. `landing/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    font-feature-settings: "ss01", "cv11";
  }
  ::selection {
    background-color: #2563EB;
    color: #FFFFFF;
  }
}

@layer utilities {
  .border-hairline {
    border-width: 0.5px;
  }
  .text-balance {
    text-wrap: balance;
  }
  /* Pulse discret pour le glyphe · du wordmark */
  @keyframes amber-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  .amber-pulse {
    animation: amber-pulse 2.4s ease-in-out infinite;
  }
}
```

### 4. `landing/components/ui/Button.tsx`

```tsx
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 shadow-card hover:shadow-cardHover",
  secondary:
    "bg-white text-ink border border-strong hover:bg-surface focus-visible:ring-ink/30",
  ghost:
    "bg-transparent text-ink hover:bg-surface focus-visible:ring-ink/20",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2.5 text-sm rounded-md",
  lg: "px-5 py-3 text-base rounded-md",
};

const BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out " +
  "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type LinkProps = CommonProps & ComponentProps<typeof Link> & { href: string };
type ButtonProps = CommonProps & ComponentProps<"button"> & { href?: undefined };

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", children, className = "", ...rest } = props;
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps;
    const isExternal = typeof href === "string" && (href.startsWith("http") || href.startsWith("mailto:"));
    if (isExternal) {
      return (
        <a href={href as string} className={cls} {...(linkRest as any)}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(linkRest as any)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonProps)}>
      {children}
    </button>
  );
}
```

### 5. `landing/components/ui/Card.tsx`

```tsx
import { ReactNode } from "react";

type Variant = "default" | "surface" | "accent" | "dark";

const VARIANTS: Record<Variant, string> = {
  default: "bg-white border border-DEFAULT shadow-card",
  surface: "bg-surface border border-DEFAULT",
  accent: "bg-white border border-DEFAULT border-l-2 border-l-brand-500 shadow-card",
  dark: "bg-ink text-white",
};

export function Card({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div className={`rounded-lg p-6 ${VARIANTS[variant]} ${className}`}>{children}</div>
  );
}

export function Stat({
  label,
  value,
  hint,
  variant = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  variant?: "default" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div className={`rounded-lg p-5 ${isDark ? "bg-ink text-white" : "bg-surface"}`}>
      <div className={`font-mono text-xs uppercase tracking-eyebrow ${isDark ? "text-white/60" : "text-ink-subtle"}`}>
        {label}
      </div>
      <div className={`mt-2 text-3xl font-medium leading-none tracking-tightish ${isDark ? "text-white" : "text-ink"}`}>
        {value}
      </div>
      {hint && (
        <div className={`mt-2 text-xs ${isDark ? "text-white/60" : "text-ink-muted"}`}>{hint}</div>
      )}
    </div>
  );
}
```

### 6. `landing/components/ui/Header.tsx`

```tsx
import Link from "next/link";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "Études", href: "/etudes" },
  { label: "Méthodologie", href: "/methodologie" },
  { label: "Tarifs", href: "/tarifs" },
];

export function Header({ variant = "on-light" }: { variant?: "on-light" | "on-dark" }) {
  const onDark = variant === "on-dark";
  const text = onDark ? "text-white" : "text-ink";
  const navMuted = onDark ? "text-white/70 hover:text-white" : "text-ink-muted hover:text-ink";
  const border = onDark ? "border-white/10" : "border-DEFAULT";
  const bg = onDark ? "bg-ink/85" : "bg-white/85";

  return (
    <header className={`sticky top-0 z-40 border-b ${border} ${bg} backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 ${text}`}>
          <span className="grid place-items-center w-6 h-6 rounded-md bg-brand-500 text-white text-[11px] font-medium">
            G
          </span>
          <span className="text-[15px] font-medium tracking-tightish">
            Geoperf<span className="text-amber amber-pulse">·</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`${navMuted} transition-colors`}>
              {n.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-ink text-white text-sm font-medium px-3.5 py-2 rounded-md hover:bg-ink/90 transition-colors"
          >
            Demander une étude
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

### 7. `landing/components/ui/Eyebrow.tsx` (nouveau)

```tsx
import { ReactNode } from "react";

export function Eyebrow({
  children,
  variant = "brand",
  className = "",
}: {
  children: ReactNode;
  variant?: "brand" | "muted" | "code";
  className?: string;
}) {
  const colors = {
    brand: "text-brand-500",
    muted: "text-ink-subtle",
    code: "text-ink-muted",
  };
  const prefix = variant === "code" ? <span className="opacity-60">// </span> : null;
  return (
    <p className={`font-mono text-xs uppercase tracking-eyebrow ${colors[variant]} ${className}`}>
      {prefix}
      {children}
    </p>
  );
}
```

### 8. `landing/components/ui/Badge.tsx` (nouveau)

```tsx
import { ReactNode } from "react";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface text-ink-muted",
  brand: "bg-brand-50 text-brand-600",
  success: "bg-emerald-50 text-success",
  warning: "bg-amber-50 text-warning",
  danger: "bg-red-50 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
```

### 9. `landing/components/ui/Input.tsx` (nouveau)

```tsx
import { ComponentProps, ReactNode, forwardRef } from "react";

type Props = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, leadingIcon, className = "", ...rest },
  ref
) {
  const hasError = Boolean(error);
  const inputCls = [
    "w-full bg-white border rounded-md px-3.5 py-2.5 text-sm text-ink placeholder-ink-subtle",
    "transition-colors duration-150 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white",
    hasError
      ? "border-danger focus:ring-danger"
      : "border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-brand-500/30",
    leadingIcon ? "pl-9" : "",
    className,
  ].join(" ");

  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <span className="relative block">
        {leadingIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input ref={ref} className={inputCls} {...rest} />
      </span>
      {hint && !hasError && <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>}
      {hasError && <span className="mt-1.5 block text-xs text-danger">{error}</span>}
    </label>
  );
});
```

---

## Patterns de composition

### Hero (page d'accueil)

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function Hero() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-28">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
        <div>
          <Eyebrow variant="code" className="mb-5">LLM visibility research</Eyebrow>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance">
            Mesurez la perception de votre marque par les LLM.
          </h1>
          <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-xl">
            Études sectorielles trimestrielles. ChatGPT, Gemini, Claude, Perplexity.
            Gratuit pour les décideurs marketing.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/contact" size="lg">Recevoir l'étude</Button>
            <Button href="/sample" variant="secondary" size="lg">Voir un exemple</Button>
          </div>
        </div>

        {/* Mini dashboard preview */}
        <Card variant="surface" className="p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-ink">Top mentions · Asset Mgmt</span>
            <span className="font-mono text-[11px] text-ink-subtle">Q2 26</span>
          </div>
          <BrandBars />
        </Card>
      </div>
    </section>
  );
}

function BrandBars() {
  const data = [
    { name: "Amundi", v: 78 },
    { name: "BNP AM", v: 62 },
    { name: "AXA IM", v: 48 },
    { name: "CA AM", v: 34 },
  ];
  return (
    <div className="space-y-2.5">
      {data.map((b, i) => (
        <div key={b.name} className="flex items-center gap-3">
          <span className="text-xs text-ink-muted w-16 truncate">{b.name}</span>
          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${i < 3 ? "bg-brand-500" : "bg-brand-500/40"}`}
              style={{ width: `${b.v}%` }}
            />
          </div>
          <span className="font-mono text-xs text-ink tabular-nums w-8 text-right">{b.v}</span>
        </div>
      ))}
    </div>
  );
}
```

### Feature grid (3 piliers de la méthodo)

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    label: "01",
    title: "4 LLM, 1 200 prompts",
    body: "ChatGPT, Gemini, Claude, Perplexity interrogés en miroir avec un protocole identique. Comparaison stricte des réponses.",
  },
  {
    label: "02",
    title: "Update trimestriel",
    body: "Les LLM évoluent vite. Études re-roulées tous les 3 mois pour capturer les variations de visibilité par marque.",
  },
  {
    label: "03",
    title: "Benchmark concurrentiel",
    body: "Pas que ta marque : tous les acteurs du secteur, classés par mentions, sentiment, et part de voix LLM.",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-6 md:px-8 py-20 md:py-28 bg-surface border-y border-DEFAULT">
      <div className="max-w-6xl mx-auto">
        <Eyebrow className="mb-3">Méthodologie</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink max-w-2xl">
          Trois piliers pour mesurer la visibilité LLM avec rigueur.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <Card key={f.label} variant="default">
              <span className="font-mono text-xs text-brand-500">{f.label}</span>
              <h3 className="mt-4 text-xl font-medium text-ink leading-tight">{f.title}</h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Lead-capture form (remplace le mailto)

```tsx
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const SECTORS = ["Asset Management", "Assurance", "Banque retail", "Fintech B2B"];

export function LeadForm() {
  return (
    <form className="grid gap-4 max-w-lg">
      <Input label="Email professionnel" type="email" placeholder="vous@entreprise.com" required />
      <div>
        <span className="block text-sm font-medium text-ink mb-2">Votre secteur</span>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              className="px-3 py-1.5 text-sm rounded-full border border-DEFAULT hover:border-brand-500 hover:text-brand-600 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" size="lg">Recevoir l'étude</Button>
      <p className="text-xs text-ink-subtle">
        Nous n'envoyons pas plus d'un email par trimestre. Désabonnement en un clic.
      </p>
    </form>
  );
}
```

---

## Migration : checklist

1. **Backup** : `git checkout -b redesign-direction-b` avant tout
2. **Remplacer** les 9 fichiers ci-dessus dans l'ordre listé
3. **Grep** les références aux anciens tokens à nettoyer :
   - `bg-cream` → `bg-white` ou `bg-surface`
   - `text-navy` → `text-ink` (parfois `text-brand-500` selon contexte)
   - `text-ink-muted` (existe encore — bouge juste sa valeur)
   - `font-serif` → `font-sans` (avec `tracking-tight font-medium` pour titres)
   - `text-amber` → `text-brand-500` (sauf le `·` du wordmark)
4. **Lancer** `npm run build` pour vérifier que rien ne casse
5. **Test visuel** : `/`, `/about`, `/contact`, `/sample`, `/saas`, `/admin`, `/portal`
6. **Push** via `push_update.ps1` quand ça compile clean

### Pages qui vont demander un retravail visuel après le swap

| Page | Effort | Note |
|---|---|---|
| `/` | Moyen | Hero à reconstruire avec nouveau pattern (Hero + FeatureGrid + LeadForm) |
| `/about`, `/contact`, `/privacy`, `/terms` | Faible | Mostly typography swap |
| `/sample` | Moyen | Page d'extrait étude — bon endroit pour pousser le côté data viz |
| `/profile/[domain]` | Élevé | Page SEO produit, mérite un design dédié (à traiter après) |
| `/admin/*`, `/app/*`, `/portal` | Faible | UI interne — rester très neutre, beaucoup de surface gris |
| `/saas` | Moyen | Landing du SaaS monitoring — refaire avec mêmes patterns |

---

## Anti-patterns à éviter

1. **Pas de mix serif** — On bascule full sans-serif. Réintroduire un serif sur certaines pages = incohérence visuelle.
2. **Pas plus d'un accent par écran** — Le bleu brand est le seul accent. Pas de "ajout d'orange ici, de vert là". Les semantic colors (success/warning/danger) sont réservées aux états réels.
3. **Pas de drop-shadow lourd** — Seulement `shadow-card` (presque invisible). Les ombres flashy datent.
4. **Pas de gradient** — Sauf cas exceptionnel motivé (rarement justifié).
5. **Pas de border > 1px** — Sauf accent de Card (border-l-2) ou featured item.
6. **Eyebrows toujours en mono** — JetBrains Mono uppercase tracking-eyebrow. C'est la signature.
