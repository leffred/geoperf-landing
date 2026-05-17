// S36-D — OnboardingChecklist : guide les nouveaux abonnés Content en 3 étapes.
// Composant pur (pas de fetch) — les données sont passées depuis content/page.tsx.
// S'affiche tant que les 3 étapes ne sont pas toutes complétées, disparaît ensuite.

import Link from "next/link";
import { Check, ChevronRight, Plug, Sparkles, Rocket } from "lucide-react";

interface Props {
  hasCms: boolean;
  hasArticle: boolean;
  hasPublished: boolean;
}

interface Step {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  done: boolean;
}

export function OnboardingChecklist({ hasCms, hasArticle, hasPublished }: Props) {
  const allDone = hasCms && hasArticle && hasPublished;
  if (allDone) return null;

  const steps: Step[] = [
    {
      key: "cms",
      icon: <Plug size={14} strokeWidth={2} />,
      title: "Connecter votre CMS",
      description: "WordPress, Shopify, Webflow, Wix ou PrestaShop — pour publier en un clic.",
      cta: "Configurer →",
      href: "/app/settings/cms",
      done: hasCms,
    },
    {
      key: "article",
      icon: <Sparkles size={14} strokeWidth={2} />,
      title: "Générer votre premier article",
      description: "Donnez un sujet à l'IA, elle rédige un article optimisé pour les LLM.",
      cta: "Générer →",
      href: "/app/content/new",
      done: hasArticle,
    },
    {
      key: "publish",
      icon: <Rocket size={14} strokeWidth={2} />,
      title: "Publier sur votre CMS",
      description: "Un clic pour envoyer l'article sur votre site et déclencher le scan de visibilité IA.",
      cta: "Voir mes articles →",
      href: "/app/content",
      done: hasPublished,
    },
  ];

  const doneCount = steps.filter(s => s.done).length;

  return (
    <div className="mb-6 bg-white border border-DEFAULT rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-DEFAULT flex items-center justify-between gap-4">
        <div>
          <div
            className="font-mono uppercase text-brand-500 mb-0.5"
            style={{ fontSize: 10, letterSpacing: "0.14em" }}
          >
            // Démarrage
          </div>
          <h2 className="text-ink" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Configurez GEO Content Writer
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className="h-1.5 rounded-full"
                style={{
                  width: 24,
                  background: i < doneCount ? "#2563EB" : "#E2E6EF",
                }}
              />
            ))}
          </div>
          <span className="text-ink-muted font-mono" style={{ fontSize: 11 }}>
            {doneCount}/{steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-DEFAULT">
        {steps.map((step) => (
          <div
            key={step.key}
            className={`flex items-start gap-4 px-5 py-4 transition-colors ${
              step.done ? "bg-surface/50" : "hover:bg-surface/30"
            }`}
          >
            {/* Checkmark / index */}
            <div
              className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
              style={{
                width: 28,
                height: 28,
                background: step.done ? "#D1FAE5" : "#EFF1F6",
                color: step.done ? "#065F46" : "#5B6478",
              }}
            >
              {step.done ? (
                <Check size={13} strokeWidth={2.5} />
              ) : (
                <span style={{ opacity: 0.7 }}>{step.icon}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div
                className="text-ink"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: step.done ? "line-through" : "none",
                  color: step.done ? "#8C94A6" : undefined,
                }}
              >
                {step.title}
              </div>
              {!step.done && (
                <div className="text-ink-muted mt-0.5" style={{ fontSize: 12 }}>
                  {step.description}
                </div>
              )}
            </div>

            {/* CTA */}
            {!step.done && (
              <Link
                href={step.href}
                className="inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 transition-colors shrink-0 mt-0.5"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                {step.cta}
                <ChevronRight size={12} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
