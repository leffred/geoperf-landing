// S31 Session 1 — Page /presse : kit presse Geoperf, FR + EN.
// Hero + à propos + chiffres clés (live DB) + études dispo + logos + contact.
// Server component, force-static + revalidate 1d (les chiffres bougent peu).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getServiceClient } from "@/lib/supabase";

const SITE = "https://geoperf.com";

export const dynamic = "force-static";
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Press kit — Geoperf" : "Espace presse — Geoperf";
  const description = isEn
    ? "Geoperf press kit : key figures, available studies, logos, founder contact and quotes. Available for interviews on AI search, GEO, brand monitoring."
    : "Kit presse Geoperf : chiffres clés, études disponibles, logos, contact fondateur, quotes. Disponible pour interviews sur AI search, GEO, brand monitoring.";
  const url = isEn ? `${SITE}/en/presse` : `${SITE}/presse`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE}/presse`,
        en: `${SITE}/en/presse`,
        "x-default": `${SITE}/presse`,
      },
    },
    openGraph: { title, description, url, type: "website", siteName: "Geoperf" },
    twitter: { card: "summary_large_image", title, description },
  };
}

interface PressFigures {
  brandsTracked: number;
  sectorsAnalyzed: number;
  snapshotsCumulated: number;
  studiesReady: Array<{ slug: string; nom: string; pdfUrl: string | null }>;
}

async function loadFigures(): Promise<PressFigures> {
  const sb = getServiceClient();

  // Brands trackées (saas_tracked_brands actives) + tracked dans saas_companies (LB) — agrégat.
  const [brandsRes, sectorsRes, snapshotsRes, studiesRes] = await Promise.all([
    sb.from("saas_tracked_brands").select("id", { count: "exact", head: true }).eq("is_active", true),
    sb.from("categories").select("id", { count: "exact", head: true }).not("parent_id", "is", null),
    sb.from("saas_brand_snapshots").select("id", { count: "exact", head: true }).eq("status", "completed"),
    sb
      .from("reports")
      .select("slug_public, sous_categorie, pdf_url")
      .eq("status", "ready")
      .not("pdf_url", "is", null)
      .order("completed_at", { ascending: false })
      .limit(20),
  ]);

  type StudyRow = { slug_public: string | null; sous_categorie: string | null; pdf_url: string | null };
  const studies = ((studiesRes.data as StudyRow[] | null) ?? [])
    .filter((s) => s.slug_public)
    .map((s) => ({
      slug: String(s.slug_public),
      nom: String(s.sous_categorie ?? s.slug_public).replace(/[-_]/g, " "),
      pdfUrl: s.pdf_url,
    }));

  return {
    brandsTracked: brandsRes.count ?? 0,
    sectorsAnalyzed: sectorsRes.count ?? 0,
    snapshotsCumulated: snapshotsRes.count ?? 0,
    studiesReady: studies,
  };
}

export default async function PressePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const figures = await loadFigures();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      <Section py="lg" tone="white">
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{isEn ? "Press kit" : "Espace presse"}</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink mb-5 leading-tight">
            {isEn ? "Geoperf for journalists" : "Geoperf pour la presse"}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed mb-3">
            {isEn
              ? "Geoperf is a French SaaS that monitors how generative AI engines (ChatGPT, Gemini, Claude, Perplexity) cite, ignore or recommend brands. We're available for interviews, quotes and exclusive data on AI search, GEO (Generative Engine Optimization) and brand monitoring."
              : "Geoperf est un SaaS français qui surveille comment les moteurs d'IA générative (ChatGPT, Gemini, Claude, Perplexity) citent, ignorent ou recommandent les marques. Nous sommes disponibles pour interviews, quotes et data exclusives sur l'AI search, le GEO (Generative Engine Optimization) et le brand monitoring."}
          </p>
          <p className="text-base text-ink-muted leading-relaxed mb-3">
            {isEn
              ? "Geoperf is a product of Jourdechance SAS (Nanterre 838 114 619), a B2B media agency founded in 2018 and headquartered in France. Hosted on Supabase Frankfurt for native GDPR compliance."
              : "Geoperf est édité par Jourdechance SAS (RCS Nanterre 838 114 619), agence média B2B fondée en 2018, basée en France. Hébergé sur Supabase Frankfurt pour conformité RGPD native."}
          </p>
          <p className="text-base text-ink-muted leading-relaxed">
            {isEn
              ? "Founder Frédéric Lefebvre is available for interviews and analyses on the LLM marketing landscape, AI search trends, and brand visibility benchmarks per sector."
              : "Le fondateur Frédéric Lefebvre est disponible pour interviews et analyses sur le paysage LLM marketing, les tendances AI search, et les benchmarks de visibilité de marque par secteur."}
          </p>
        </div>
      </Section>

      <Section py="md" tone="surface">
        <Eyebrow className="mb-3">{isEn ? "Key figures (live)" : "Chiffres clés (live)"}</Eyebrow>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
          <FigureCard
            value={String(figures.brandsTracked)}
            label={isEn ? "Brands tracked weekly" : "Marques trackées chaque semaine"}
          />
          <FigureCard
            value={String(figures.sectorsAnalyzed)}
            label={isEn ? "B2B sectors analyzed" : "Secteurs B2B analysés"}
          />
          <FigureCard
            value={String(figures.snapshotsCumulated)}
            label={isEn ? "LLM snapshots executed" : "Snapshots LLM exécutés"}
          />
          <FigureCard value="4" label={isEn ? "LLMs monitored" : "LLM monitorés"} />
        </div>
        <p className="text-xs text-ink-subtle mt-4 max-w-2xl">
          {isEn
            ? "Updated live from our production database. Methodology details on geoperf.com/methodology."
            : "Mis à jour en direct depuis notre base de production. Détails méthodologiques sur geoperf.com/methodology."}
        </p>
      </Section>

      {figures.studiesReady.length > 0 && (
        <Section py="md" tone="white">
          <Eyebrow className="mb-3">{isEn ? "Available studies" : "Études disponibles"}</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-medium text-ink tracking-tight mb-3">
            {isEn
              ? `${figures.studiesReady.length} sectoral studies ready to download`
              : `${figures.studiesReady.length} études sectorielles téléchargeables`}
          </h2>
          <p className="text-sm text-ink-muted mb-5 max-w-2xl">
            {isEn
              ? "Branded PDF, ~30 brands per study, 4 LLMs, 30 prompts, sentiment + sources. Free for journalists, simply request via the form below."
              : "PDF brandé, ~30 marques par étude, 4 LLM, 30 prompts, sentiment + sources. Gratuit pour la presse, sur simple demande via le formulaire."}
          </p>
          <ul className="grid md:grid-cols-2 gap-3 max-w-4xl">
            {figures.studiesReady.slice(0, 12).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/etude-sectorielle?secteur=${encodeURIComponent(s.slug)}`}
                  className="block bg-surface border border-DEFAULT rounded-md px-4 py-3 hover:bg-surface-2 transition text-sm text-ink"
                >
                  <span className="capitalize">{s.nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section py="md" tone="surface">
        <Eyebrow className="mb-3">{isEn ? "Logos & visual assets" : "Logos & visuels"}</Eyebrow>
        <h2 className="text-2xl md:text-3xl font-medium text-ink tracking-tight mb-3">
          {isEn ? "Brand assets" : "Assets de marque"}
        </h2>
        <p className="text-sm text-ink-muted mb-5 max-w-2xl">
          {isEn
            ? "Logos in SVG and PNG (high resolution). Use in editorial context with credit Geoperf."
            : "Logos en SVG et PNG (haute résolution). Utilisation en contexte éditorial avec crédit Geoperf."}
        </p>
        <div className="grid md:grid-cols-2 gap-3 max-w-4xl">
          <div className="bg-white border border-DEFAULT rounded-md p-5">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-2">SVG</p>
            <p className="text-sm text-ink mb-3">{isEn ? "Master logo (SVG, vector)" : "Logo principal (SVG, vectoriel)"}</p>
            <a href="/logos/logo_master.svg" download className="text-sm text-brand-500 hover:underline">
              {isEn ? "Download SVG" : "Télécharger SVG"} →
            </a>
          </div>
          <div className="bg-white border border-DEFAULT rounded-md p-5">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 mb-2">PNG</p>
            <p className="text-sm text-ink mb-3">{isEn ? "Master logo (PNG 1024×512)" : "Logo principal (PNG 1024×512)"}</p>
            <a href="/logos/logo_master.png" download className="text-sm text-brand-500 hover:underline">
              {isEn ? "Download PNG" : "Télécharger PNG"} →
            </a>
          </div>
        </div>
      </Section>

      <Section py="md" tone="white">
        <Eyebrow className="mb-3">{isEn ? "Available quotes" : "Citations disponibles"}</Eyebrow>
        <h2 className="text-2xl md:text-3xl font-medium text-ink tracking-tight mb-3">
          {isEn ? "Frédéric Lefebvre — quotes ready to use" : "Frédéric Lefebvre — quotes prêtes à reprendre"}
        </h2>
        <div className="space-y-4 max-w-3xl">
          <Quote
            text={
              isEn
                ? "“In 2026, ignoring how ChatGPT and Perplexity cite your brand is the same as ignoring Google ranking in 2008. The early movers will gain a 3-5 year structural advantage.”"
                : "« En 2026, ignorer comment ChatGPT et Perplexity citent votre marque, c'est l'équivalent d'ignorer le ranking Google en 2008. Les early movers gagneront un avantage structurel de 3 à 5 ans. »"
            }
          />
          <Quote
            text={
              isEn
                ? "“73% of B2B French CMOs still don't have a formalized GEO strategy in 2026. They're 12-18 months behind their US counterparts. The catch-up cost will be 2-3x higher in 2028.”"
                : "« 73 % des CMO B2B français n'ont pas encore de stratégie GEO formalisée en 2026. C'est un retard de 12 à 18 mois sur les US. Le coût de rattrapage sera 2 à 3 fois supérieur en 2028. »"
            }
          />
          <Quote
            text={
              isEn
                ? "“Wikipedia accounts for 32% of cross-LLM citations on B2B brands in France. A brand without a Wikipedia page is structurally invisible to ChatGPT.”"
                : "« Wikipedia représente 32 % des citations cross-LLM sur les marques B2B en France. Une marque sans page Wikipedia est structurellement invisible à ChatGPT. »"
            }
          />
        </div>
      </Section>

      <Section py="md" tone="dark">
        <div className="max-w-3xl">
          <Eyebrow variant="muted" className="mb-3 text-amber">
            {isEn ? "Direct contact" : "Contact direct"}
          </Eyebrow>
          <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight mb-4">
            {isEn ? "Frédéric Lefebvre, Founder" : "Frédéric Lefebvre, fondateur"}
          </h2>
          <p className="text-base text-white/80 leading-relaxed mb-5 max-w-2xl">
            {isEn
              ? "Available for interviews (in-person Paris, video call) within 48h. French + English."
              : "Disponible pour interviews (Paris en personne ou visio) sous 48h. Français + anglais."}
          </p>
          <ul className="space-y-2 text-sm text-white">
            <li>
              <span className="font-mono text-xs uppercase tracking-eyebrow text-amber mr-2">Email</span>
              <a href="mailto:flefebvre@jourdechance.com" className="hover:underline">
                flefebvre@jourdechance.com
              </a>
            </li>
            <li>
              <span className="font-mono text-xs uppercase tracking-eyebrow text-amber mr-2">LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/frederic-lefebvre"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                linkedin.com/in/frederic-lefebvre
              </a>
            </li>
            <li>
              <span className="font-mono text-xs uppercase tracking-eyebrow text-amber mr-2">{isEn ? "Press requests" : "Demandes presse"}</span>
              <Link href="/contact" className="hover:underline">
                geoperf.com/contact
              </Link>
            </li>
          </ul>
          <div className="mt-6">
            <Button href="/etude-sectorielle" variant="primary" size="md">
              {isEn ? "Request a sectoral study" : "Demander une étude sectorielle"}
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}

function FigureCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-DEFAULT rounded-md p-4">
      <div className="text-3xl md:text-4xl font-medium text-navy tabular-nums tracking-tight">{value}</div>
      <p className="text-xs font-mono text-ink-subtle mt-1 uppercase tracking-eyebrow leading-tight">{label}</p>
    </div>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="border-l-2 border-amber pl-4 text-sm md:text-base text-ink leading-relaxed italic">
      {text}
    </blockquote>
  );
}
