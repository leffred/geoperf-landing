import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Geoperf vs GetMint — quel choix pour votre marque ?",
  description:
    "Geoperf est l'alternative française à GetMint. Plus accessible (-20% en moyenne), plus spécialisée FR, avec un funnel intégré (étude → audit → SaaS). Comparaison honnête.",
  alternates: { canonical: "https://geoperf.com/saas/vs-getmint" },
  openGraph: {
    title: "Geoperf vs GetMint — comparaison honnête",
    description: "Alternative française à GetMint pour le monitoring de visibilité dans les LLM.",
    url: "https://geoperf.com/saas/vs-getmint",
    type: "article",
  },
};

type Cell = {
  feature: string;
  getmint: string;
  geoperf: string;
  edge?: "geoperf" | "getmint" | "tie";
};

const FEATURES: Cell[] = [
  { feature: "Prix de base mensuel", getmint: "$99/mois", geoperf: "79€ HT/mois", edge: "geoperf" },
  { feature: "Prix de base annuel (équiv. mensuel)", getmint: "$79/mois (-20%)", geoperf: "59€ HT/mois (-25%, ~50% moins cher)", edge: "geoperf" },
  { feature: "Plan le plus cher", getmint: "$499+/mois (Enterprise)", geoperf: "799€ HT/mois (Agency, 599€ HT en annuel)", edge: "geoperf" },
  { feature: "Marché cible", getmint: "US/UK enterprise", geoperf: "France + Europe francophone", edge: "tie" },
  { feature: "Langues prompts", getmint: "EN principal", geoperf: "FR principal (EN à venir)", edge: "tie" },
  { feature: "LLMs supportés", getmint: "9 (incl. AI Overviews, Copilot, Meta AI)", geoperf: "7 (AI Overviews/Copilot à venir S14)", edge: "getmint" },
  { feature: "Topics par marque", getmint: "1-9 selon plan", geoperf: "1-∞ selon plan", edge: "geoperf" },
  { feature: "Sentiment analysis", getmint: "✅", geoperf: "✅", edge: "tie" },
  { feature: "Brand Alignment", getmint: "✅", geoperf: "✅", edge: "tie" },
  { feature: "Content Studio", getmint: "✅", geoperf: "✅ (10 drafts/mois Pro, ∞ Agency)", edge: "tie" },
  { feature: "Citations Flow Sankey", getmint: "✅", geoperf: "✅", edge: "tie" },
  { feature: "Multi-seats", getmint: "2-∞ selon plan", geoperf: "1-∞ selon plan", edge: "tie" },
  { feature: "API publique REST", getmint: "Enterprise only ($499+)", geoperf: "Agency (599€ HT en annuel)", edge: "geoperf" },
  { feature: "Webhooks Slack/Teams", getmint: "✅", geoperf: "✅ (Slack Growth+, Teams Pro+)", edge: "tie" },
  { feature: "Publisher Network", getmint: "✅ (150k+ médias indexés)", geoperf: "❌ (à investiguer via aggrégateur)", edge: "getmint" },
  { feature: "Études sectorielles gratuites", getmint: "❌", geoperf: "✅ (lead-magnet trimestriel)", edge: "geoperf" },
  { feature: "Audit GEO consulting", getmint: "❌", geoperf: "✅ (offre 500€ à la mission)", edge: "geoperf" },
  { feature: "Support FR", getmint: "❌", geoperf: "✅", edge: "geoperf" },
  { feature: "Hébergement données", getmint: "US (AWS us-east-1 a priori)", geoperf: "UE (Frankfurt, Supabase)", edge: "geoperf" },
  { feature: "Conformité RGPD native", getmint: "DPA sur demande", geoperf: "✅ DPA standard, données EU only", edge: "geoperf" },
  { feature: "Plan Free permanent", getmint: "❌ (trial 14j seulement)", geoperf: "✅ (1 marque, 1 LLM, monthly)", edge: "geoperf" },
];

const REASONS_GEOPERF = [
  {
    title: "Spécialisation française",
    body: "Prompts en FR rédigés par des marketeurs français, secteurs mappés sur la nomenclature française (asset management, banque retail, fintech B2B, mutuelles santé, etc.). Détection brand-name fine sur les variantes francophones (BNP Paribas vs BNP Real Estate, AXA vs AXA IM).",
  },
  {
    title: "Prix accessibles, ~50% moins cher en annuel",
    body: "79€ HT/mois en mensuel (vs $99 chez GetMint), et seulement 59€ HT/mois en annuel grâce aux 3 mois offerts (vs ~$79 chez GetMint avec leur réduction annuelle 20%). Sur le plan Pro : 299€ HT/mois en annuel chez Geoperf vs ~$399 chez GetMint. Plan Free permanent (vs trial 14j seulement chez GetMint).",
  },
  {
    title: "Funnel intégré (étude → audit → SaaS)",
    body: "Geoperf est édité par Jourdechance, cabinet de conseil GEO. On vend un parcours complet : étude sectorielle gratuite (lead-magnet trimestriel) → audit consulting one-shot 500€ → SaaS récurrent. GetMint vend juste le SaaS.",
  },
];

const REASONS_GETMINT = [
  "Vous êtes une enterprise US/UK avec budget illimité et avez besoin de l'écosystème GetMint complet.",
  "Vous avez besoin du Publisher Network 150k+ médias indexés (notre roadmap : Q3 26).",
  "Vous voulez une UI 100% en anglais et vos équipes ne lisent pas le français.",
  "Vous avez déjà des contrats DPA US-friendly et l'hébergement EU n'est pas une contrainte.",
];

function EdgeBadge({ edge }: { edge?: "geoperf" | "getmint" | "tie" }) {
  if (edge === "geoperf") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600">
        Geoperf
      </span>
    );
  }
  if (edge === "getmint") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-surface text-ink-muted">
        GetMint
      </span>
    );
  }
  return (
    <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded-md bg-surface-2 text-ink-subtle">
      égal
    </span>
  );
}

export default function VsGetMintPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header
        logo="monitoring"
        rightSlot={
          <div className="flex items-center gap-4">
            <Link href="/saas/faq" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">FAQ</Link>
            <Link href="/login" className="font-mono text-xs text-ink-muted hover:text-ink transition-colors">Connexion</Link>
            <Button href="/signup" variant="primary" size="sm">Créer un compte</Button>
          </div>
        }
      />

      <Section py="lg" tone="white">
        <div className="max-w-4xl">
          <Eyebrow className="mb-3">Comparaison honnête</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-ink text-balance mb-6">
            Geoperf <span className="text-ink-subtle">vs</span> <span className="text-brand-500">GetMint</span> — quel choix pour votre marque&nbsp;?
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed max-w-2xl">
            Geoperf est l&apos;alternative française à GetMint. Plus accessible (-20% en moyenne), plus spécialisée sur le marché européen francophone, avec un funnel intégré <strong className="text-ink">étude sectorielle → audit consulting → SaaS récurrent</strong>.
          </p>
          <p className="mt-4 text-sm text-ink-subtle font-mono">
            Ce comparatif est rédigé par l&apos;équipe Geoperf. On documente nos points forts ET les cas où GetMint reste meilleur — pas d&apos;astroturfing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">Tester Geoperf gratuit</Button>
            <Button href="#table" variant="secondary" size="lg">Voir le tableau complet</Button>
          </div>
        </div>
      </Section>

      <Section py="lg" tone="surface">
        <Eyebrow className="mb-3">Pourquoi choisir Geoperf</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-10 max-w-2xl text-balance leading-tight">
          3 raisons fortes pour les marques européennes francophones.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {REASONS_GEOPERF.map((r, i) => (
            <Card key={r.title} variant="default">
              <span className="font-mono text-xs text-brand-500 tracking-eyebrow uppercase">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium text-ink leading-tight tracking-tightish">{r.title}</h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{r.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section py="lg" tone="white" className="scroll-mt-20">
        <a id="table" />
        <Eyebrow className="mb-3">Comparatif détaillé · 20 critères</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3 leading-tight max-w-2xl">
          Feature par feature, sans filtre.
        </h2>
        <p className="text-sm text-ink-muted mb-8 max-w-2xl leading-relaxed">
          Sources : page tarifs publique GetMint au {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })} + documentation API + tests internes Geoperf. Si une donnée est obsolète, écrivez-nous : <a href="mailto:hello@geoperf.com" className="text-brand-500 hover:underline">hello@geoperf.com</a>.
        </p>

        <div className="bg-white rounded-lg border border-DEFAULT shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-subtle border-b border-DEFAULT">
              <tr>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Critère</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">GetMint</th>
                <th className="text-left py-3 px-4 font-mono uppercase tracking-eyebrow">Geoperf</th>
                <th className="text-right py-3 px-4 font-mono uppercase tracking-eyebrow">Avantage</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={i} className="border-b border-DEFAULT last:border-b-0 hover:bg-surface transition-colors">
                  <td className="py-3 px-4 text-ink font-medium">{f.feature}</td>
                  <td className="py-3 px-4 text-ink-muted">{f.getmint}</td>
                  <td className={`py-3 px-4 ${f.edge === "geoperf" ? "text-ink font-medium" : "text-ink-muted"}`}>
                    {f.geoperf}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <EdgeBadge edge={f.edge} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-ink-subtle font-mono">
          Score : Geoperf {FEATURES.filter(f => f.edge === "geoperf").length} · Égalité {FEATURES.filter(f => f.edge === "tie").length} · GetMint {FEATURES.filter(f => f.edge === "getmint").length}
        </p>
      </Section>

      <Section py="lg" tone="surface">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">Quand choisir GetMint plutôt</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mb-6 leading-tight">
            On est honnêtes : GetMint reste le meilleur choix dans 4 cas.
          </h2>
          <ul className="space-y-3">
            {REASONS_GETMINT.map((r, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-lg border border-DEFAULT p-4 shadow-card">
                <span className="font-mono text-xs text-ink-subtle tabular-nums shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-ink leading-relaxed">{r}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted leading-relaxed">
            Sinon, pour 80% des marques européennes francophones, Geoperf est le bon choix. C&apos;est pour cela qu&apos;on l&apos;a construit.
          </p>
        </div>
      </Section>

      <Section py="lg" tone="dark">
        <div className="max-w-2xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">Prêt à tester ?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4 leading-tight">
            Essayez Geoperf — gratuit, permanent, sans CB.
          </h2>
          <p className="text-base text-white/85 mb-6 leading-relaxed">
            Plan Free permanent (1 marque, 1 LLM, snapshot mensuel). Upgrade Starter à 79€ HT/mois (ou 59€ HT/mois en annuel — 3 mois offerts) si vous voulez 4 LLMs et la cadence hebdo. Annulation en 1 clic.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">Créer mon compte</Button>
            <Button href="/contact" variant="outline-light" size="lg">Parler à un humain</Button>
            <Button href="/saas" variant="outline-light" size="lg">Voir tous les plans</Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
