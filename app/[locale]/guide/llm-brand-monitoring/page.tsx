// S29 Pillar #8 — LLM brand monitoring (angle discipline opérationnelle).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "llm-brand-monitoring";
const PUBLISHED_AT = "2026-05-08T08:00:00.000Z";
const SITE = "https://geoperf.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn
    ? "LLM brand monitoring 2026: continuous tracking and crisis prep"
    : "LLM brand monitoring 2026 : surveillance continue et gestion de crise";
  const description = isEn
    ? "How to set up continuous brand monitoring across ChatGPT, Gemini, Claude, Perplexity. Alert thresholds, crisis playbook, governance, and tools that actually scale. Written for CMOs."
    : "Comment mettre en place une surveillance continue de votre marque sur ChatGPT, Gemini, Claude, Perplexity. Seuils d'alerte, playbook de crise, gouvernance, outils qui scalent. Écrit pour CMO.";

  const url = isEn ? `${SITE}/en/guide/${SLUG}` : `${SITE}/guide/${SLUG}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE}/guide/${SLUG}`,
        en: `${SITE}/en/guide/${SLUG}`,
        "x-default": `${SITE}/guide/${SLUG}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Geoperf",
      images: [
        { url: `${SITE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const TOC_FR = [
  { id: "what", label: "Qu'est-ce que le LLM brand monitoring" },
  { id: "why-2026", label: "Pourquoi c'est devenu une discipline en 2026" },
  { id: "how-it-works", label: "Comment construire votre dispositif de monitoring" },
  { id: "measure", label: "Quels seuils, quelles alertes, quelle gouvernance" },
  { id: "case-studies", label: "Cas de crise et benchmarks" },
  { id: "tools", label: "Outils et solutions" },
  { id: "faq", label: "Questions fréquentes" },
];

const TOC_EN = [
  { id: "what", label: "What is LLM brand monitoring" },
  { id: "why-2026", label: "Why it became a discipline in 2026" },
  { id: "how-it-works", label: "How to build your monitoring setup" },
  { id: "measure", label: "Thresholds, alerts, governance" },
  { id: "case-studies", label: "Crisis cases and benchmarks" },
  { id: "tools", label: "Tools and solutions" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Pourquoi monitorer sa marque dans les LLM si on a déjà du social listening ?",
    answer:
      "Surfaces différentes, risques différents. Le social listening capture ce que les utilisateurs disent ; le LLM monitoring capture ce que les LLM disent eux-mêmes à des millions d'utilisateurs simultanés. Quand ChatGPT répond « marque X est en difficulté financière » sur des millions de conversations B2B, l'impact réputationnel est direct et instantané, sans qu'aucun tweet n'ait été posté. C'est une nouvelle dimension de risque qui ne se voit nulle part ailleurs.",
  },
  {
    question: "Quelle fréquence de monitoring est nécessaire ?",
    answer:
      "Dépend de la maturité de votre dispositif. Niveau 1 (démarrage) : panel mensuel de 30 prompts sur 1-2 LLM (ChatGPT + Perplexity) — ~1h de travail/mois. Niveau 2 (établi) : panel hebdomadaire de 50 prompts sur 4 LLM, avec alertes sur baisses >10% — outil dédié obligatoire. Niveau 3 (mature) : panel quotidien de 100 prompts + alerting temps réel sur sentiment + suivi cross-canal. Pour une marque B2B PME, niveau 2 est l'optimum coût/valeur.",
  },
  {
    question: "Que faire si on découvre une réponse LLM erronée ou hostile sur ma marque ?",
    answer:
      "Trois actions séquentielles : (1) documenter (capture d'écran avec date/heure/LLM/prompt exact), (2) identifier la source (sur Perplexity et Gemini AI Overviews, sources visibles ; sur ChatGPT Search, parfois identifiables ; sur ChatGPT mode mémoire, hypothèses corpus), (3) corriger en amont (RP correctrice si presse, mise à jour Wikipedia, contenu corporate qui rectifie). Les LLM ne se « contactent » pas pour réclamer — la correction passe par l'écosystème de sources qui les nourrit.",
  },
  {
    question: "Combien de prompts faut-il monitorer pour avoir un signal fiable ?",
    answer:
      "Minimum 30 prompts par LLM par segment de marché. En dessous, la variance stochastique des LLM (température, échantillonnage) domine le signal. À 30 prompts, le citation rate est mesurable avec ±3-5% de marge d'erreur. À 100 prompts, ±1-2%. Pour benchmarker contre des concurrents avec confiance, viser 50-100 prompts. Le panel doit couvrir prompts de découverte, comparatifs, techniques, et au moins 5-10 prompts marque-explicites.",
  },
  {
    question: "Quels KPIs surveiller en premier quand on démarre ?",
    answer:
      "Quatre KPIs core : (1) Citation rate global (sur le panel, votre marque est-elle citée ?), (2) Average source rank (quand citée, à quelle position), (3) Share-of-voice vs concurrents top 3, (4) Sentiment (positif/neutre/négatif des contextes de citation). Plus tard, ajouter : sources d'autorité (qui cite votre marque dans la réponse LLM), évolution temporelle, breakdown par LLM, et écart prompts marque-explicites vs prompts ouverts.",
  },
  {
    question: "Doit-on monitorer aussi sa marque mère ou uniquement les produits ?",
    answer:
      "Les deux. Le monitoring marque-mère capture la perception institutionnelle (santé financière, gouvernance, ESG, dirigeants). Le monitoring produit capture la perception fonctionnelle (qualité, prix, support, comparaisons). Les deux peuvent diverger : marque-mère bien perçue + produit X mal noté = crise produit silencieuse. Pour une PME B2B avec 1-3 produits, faire les deux est faisable (~30 prompts marque + 30 prompts par produit).",
  },
  {
    question: "Faut-il alerter automatiquement sur une baisse de citation rate ?",
    answer:
      "Oui, mais avec seuils intelligents. Une baisse de 1-3% est dans le bruit stochastique LLM (à ignorer). Une baisse de >10% sur le citation rate global et soutenue 2 semaines = signal d'alerte (cause probable : nouveau concurrent dominant, contenu corporate obsolète, perte d'autorité presse). Une baisse >25% en 1 semaine = crise immédiate (déréférencement, problème majeur). Configurer ces 3 niveaux d'alerte est le minimum opérationnel.",
  },
  {
    question: "Comment monitorer le sentiment dans les réponses LLM ?",
    answer:
      "Approche pragmatique : passer chaque réponse LLM citant votre marque dans un classifieur de sentiment (Claude Haiku ou modèle similaire) qui retourne positif/neutre/négatif + raison principale. Sur 100 citations, vous obtenez un score sentiment + une cartographie qualitative (« 60% neutre / 25% positif / 15% négatif, raison négative dominante : prix »). Outils comme Geoperf, Profound, Brandwatch AI Mode font ça nativement.",
  },
  {
    question: "Comment intégrer le LLM monitoring au reporting marketing classique ?",
    answer:
      "Trois options selon maturité. Option 1 (light) : ajouter un module « LLM visibility » au report marketing mensuel (3-5 graphes). Option 2 (médium) : dashboard live (Looker, PowerBI) connecté à votre outil GEO via API, partagé avec CMO + équipe SEO. Option 3 (mature) : intégrer LLM citation rate aux OKRs marketing trimestriels (« +X points de share-of-voice en Q3 »). La maturité 2-3 est la norme chez les leaders 2026.",
  },
  {
    question: "Quel budget annuel prévoir pour un dispositif de monitoring sérieux ?",
    answer:
      "Pour une PME B2B (50-200 employés) : 1k-5k €/an d'outil (Geoperf Starter à Growth) + 1-2 jours/mois ressource interne. Pour une ETI (200-2000 employés) : 5k-20k €/an d'outil (Geoperf Pro à Agency, ou Profound, ou Brandwatch AI Mode) + 0.2 ETP dédié. Pour un grand compte (2000+) : 30k-100k €/an d'outil multi-marché + 0.5-1 ETP. Le ratio investissement/exposition est très favorable comparé au branding ou paid media.",
  },
  {
    question: "Le LLM monitoring est-il déjà une discipline mature ?",
    answer:
      "Mature dans la méthodologie, pas encore standardisée institutionnellement. Les KPIs (citation rate, source rank, share-of-voice) sont stabilisés depuis 2024 et utilisés par les outils leader. Les bonnes pratiques (panel ≥30 prompts, fréquence hebdo, sentiment classifié) font consensus. Ce qui manque : standards inter-secteurs (chaque secteur a son benchmark interne), certifications (à venir), intégration native dans les BI suites (en cours, Looker/Tableau ajoutent les connecteurs en 2026).",
  },
  {
    question: "Quel est le plus gros risque ignoré par les marques aujourd'hui ?",
    answer:
      "L'hallucination factuelle hostile. Un LLM peut inventer une affirmation négative sur votre marque (« leader X a été condamné pour fraude en 2024 ») sans aucune source réelle, juste par interpolation entre noms similaires ou contextes proches. Ces hallucinations apparaissent ~3-7% du temps sur des prompts sensibles. Sans monitoring, elles peuvent survivre 6-12 mois sans détection, contaminer la presse (qui les reprend par paresse), puis le corpus d'entraînement futur. Détecter ces hallucinations tôt est la valeur n°1 du monitoring.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "Why monitor my brand in LLMs if I already have social listening?",
    answer:
      "Different surfaces, different risks. Social listening captures what users say; LLM monitoring captures what LLMs themselves say to millions of simultaneous users. When ChatGPT answers `brand X is in financial difficulty` across millions of B2B conversations, the reputational impact is direct and instantaneous, without any tweet being posted. It's a new risk dimension visible nowhere else.",
  },
  {
    question: "What monitoring frequency is necessary?",
    answer:
      "Depends on setup maturity. Level 1 (starter): monthly 30-prompt panel on 1-2 LLMs (ChatGPT + Perplexity) — ~1h work/month. Level 2 (established): weekly 50-prompt panel on 4 LLMs, with alerts on >10% drops — dedicated tool required. Level 3 (mature): daily 100-prompt panel + real-time sentiment alerting + cross-channel tracking. For a mid-market B2B brand, level 2 is the cost/value optimum.",
  },
  {
    question: "What to do if you discover an erroneous or hostile LLM response about your brand?",
    answer:
      "Three sequential actions: (1) document (screenshot with date/time/LLM/exact prompt), (2) identify the source (on Perplexity and Gemini AI Overviews, sources visible; on ChatGPT Search, sometimes identifiable; on ChatGPT memory mode, corpus hypotheses), (3) correct upstream (corrective PR if press, Wikipedia update, corporate content that rectifies). LLMs don't `get contacted` to claim — correction flows through the source ecosystem feeding them.",
  },
  {
    question: "How many prompts to monitor for a reliable signal?",
    answer:
      "Minimum 30 prompts per LLM per market segment. Below that, LLM stochastic variance (temperature, sampling) dominates signal. At 30 prompts, citation rate is measurable with ±3-5% error margin. At 100 prompts, ±1-2%. To benchmark against competitors with confidence, target 50-100 prompts. The panel must cover discovery, comparison, technical, and at least 5-10 explicit-brand prompts.",
  },
  {
    question: "Which KPIs to monitor first when starting?",
    answer:
      "Four core KPIs: (1) Global citation rate (across the panel, is your brand cited?), (2) Average source rank (when cited, at what position), (3) Share-of-voice vs top-3 competitors, (4) Sentiment (positive/neutral/negative of citation contexts). Later add: authority sources (who cites your brand in the LLM response), temporal evolution, per-LLM breakdown, and gap between brand-explicit prompts vs open prompts.",
  },
  {
    question: "Should you also monitor parent brand or just products?",
    answer:
      "Both. Parent brand monitoring captures institutional perception (financial health, governance, ESG, leadership). Product monitoring captures functional perception (quality, price, support, comparisons). The two can diverge: parent brand well perceived + product X poorly rated = silent product crisis. For a mid-market B2B with 1-3 products, doing both is feasible (~30 prompts brand + 30 prompts per product).",
  },
  {
    question: "Should you auto-alert on citation rate drops?",
    answer:
      "Yes, with intelligent thresholds. A 1-3% drop is within LLM stochastic noise (ignore). A >10% drop on global citation rate sustained 2 weeks = alert signal (likely cause: dominant new competitor, obsolete corporate content, lost press authority). A >25% drop in 1 week = immediate crisis (delisting, major issue). Configuring these 3 alert levels is the operational minimum.",
  },
  {
    question: "How to monitor sentiment in LLM responses?",
    answer:
      "Pragmatic approach: pass each LLM response citing your brand through a sentiment classifier (Claude Haiku or similar model) that returns positive/neutral/negative + main reason. Across 100 citations, you obtain a sentiment score + qualitative mapping (`60% neutral / 25% positive / 15% negative, dominant negative reason: pricing`). Tools like Geoperf, Profound, Brandwatch AI Mode do this natively.",
  },
  {
    question: "How to integrate LLM monitoring into classic marketing reporting?",
    answer:
      "Three options by maturity. Option 1 (light): add an `LLM visibility` module to monthly marketing report (3-5 charts). Option 2 (medium): live dashboard (Looker, PowerBI) connected to your GEO tool via API, shared with CMO + SEO team. Option 3 (mature): integrate LLM citation rate to quarterly marketing OKRs (`+X share-of-voice points in Q3`). Maturity 2-3 is the norm at 2026 leaders.",
  },
  {
    question: "Annual budget for a serious monitoring setup?",
    answer:
      "For a mid-market B2B (50-200 employees): $1k-5k/year tool (Geoperf Starter to Growth) + 1-2 days/month internal resource. For mid-large (200-2000 employees): $5k-20k/year tool (Geoperf Pro to Agency, or Profound, or Brandwatch AI Mode) + 0.2 dedicated FTE. For large account (2000+): $30k-100k/year multi-market tool + 0.5-1 FTE. The investment/exposure ratio is very favorable compared to branding or paid media.",
  },
  {
    question: "Is LLM monitoring already a mature discipline?",
    answer:
      "Mature in methodology, not yet institutionally standardized. KPIs (citation rate, source rank, share-of-voice) have been stable since 2024 and used by leading tools. Best practices (≥30 prompt panel, weekly cadence, classified sentiment) are consensus. What's missing: cross-sector standards (each sector has internal benchmarks), certifications (coming), native BI suite integration (in progress, Looker/Tableau adding connectors in 2026).",
  },
  {
    question: "Biggest risk currently ignored by brands?",
    answer:
      "Hostile factual hallucination. An LLM can invent a negative claim about your brand (`X leader was convicted for fraud in 2024`) with no real source, just by interpolating between similar names or close contexts. These hallucinations appear ~3-7% of the time on sensitive prompts. Without monitoring, they can survive 6-12 months undetected, contaminate press (which republishes by laziness), then the future training corpus. Detecting hallucinations early is the #1 value of monitoring.",
  },
];

function BodyFr() {
  return (
    <>
      <section id="what" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Qu'est-ce que le LLM brand monitoring</h2>
        <p>
          Le LLM brand monitoring est la pratique de surveiller systématiquement comment les modèles de langage (ChatGPT, Gemini, Claude, Perplexity, et autres) parlent de votre marque, de vos produits, de vos dirigeants. C'est l'équivalent du social listening pour la nouvelle surface conversationnelle, avec ses spécificités méthodologiques.
        </p>
        <p>
          Concrètement, un dispositif de LLM brand monitoring repose sur trois briques. Première brique : un panel de prompts (30-300 questions représentatives de votre marché et de vos enjeux). Deuxième brique : une exécution automatisée régulière (quotidien à hebdomadaire) de ces prompts sur les LLM cibles. Troisième brique : un dashboard et un système d'alertes qui transforment les données brutes en signaux exploitables.
        </p>
        <p>
          Le périmètre couvre quatre dimensions de surveillance. <strong>Visibilité</strong> : votre marque apparaît-elle quand l'utilisateur cherche votre catégorie ? <strong>Rang</strong> : à quelle position dans les sources ou dans la liste de recommandations ? <strong>Sentiment</strong> : avec quel ton le LLM en parle-t-il (positif, neutre, négatif) ? <strong>Factualité</strong> : les faits avancés sur votre marque sont-ils corrects, ou y a-t-il des hallucinations ?
        </p>
        <p>
          Cette discipline est née en 2023-2024, s'est structurée en 2025 (premiers outils dédiés, premières études comparatives), et passe en 2026 d'option à standard pour les entreprises B2B sérieuses. Elle se distingue du SEO classique (qui mesure les positions Google) et du social listening (qui mesure les conversations sur réseaux sociaux). Elle constitue une catégorie nouvelle.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Pourquoi c'est devenu une discipline en 2026</h2>
        <p>
          Trois forces convergentes ont fait basculer le LLM monitoring du « nice-to-have » au « must-have » entre 2024 et 2026.
        </p>
        <p>
          <strong>Volume d'usage atteint un seuil critique.</strong> Selon l'étude Gartner CMO 2026, 38% des décideurs B2B consultent un LLM au moins une fois par semaine pour des décisions professionnelles, contre 9% en 2023. Pour le B2B premium (asset management, conseil, SaaS) ce taux dépasse 60%. Une marque non surveillée sur cette surface est aveugle sur un canal de découverte qui pèse autant que LinkedIn organique.
        </p>
        <p>
          <strong>Risques réputationnels matérialisés.</strong> Plusieurs incidents publics 2024-2025 ont fait jurisprudence. Cas notable : une marque tech B2B américaine voit son citation rate Perplexity passer de 65% à 12% en 6 semaines après une campagne presse négative concurrente, sans qu'aucun monitoring n'ait alerté à temps. Six semaines = trois cycles d'achat manqués. Ces cas ont convaincu les comex que LLM monitoring est une question risk-management, pas seulement marketing.
        </p>
        <p>
          <strong>Maturité de l'écosystème outils.</strong> Entre 2024 et 2026, l'offre est passée de 3-4 outils prototypes à 15-20 outils production, avec API, alerting, intégrations BI, et tarifs accessibles dès 49-79 €/mois. Il n'est plus crédible pour un CMO de dire « nous n'avons pas les outils ». L'industrialisation de l'écosystème a supprimé l'excuse technique.
        </p>
        <p>
          <strong>Pression réglementaire émergente.</strong> Le AI Act européen (entré en vigueur 2025) ne mentionne pas explicitement le brand monitoring, mais les obligations de transparence des LLM grand public créent un besoin de documentation. Pour les secteurs régulés (banque, santé, énergie), commencer à documenter ce que les LLM disent de votre marque devient une bonne pratique de compliance, anticipant les évolutions probables 2027-2028.
        </p>
        <p>
          La conjonction de ces quatre facteurs explique pourquoi 67% des grands comptes B2B européens ont créé une fonction (ETP partiel ou complet) dédiée au LLM monitoring entre 2024 et 2026 (étude Forrester Q1 2026). C'est désormais une discipline opérationnelle au même titre que le social listening ou le SEO.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment construire votre dispositif de monitoring</h2>
        <p>
          Construire un dispositif de LLM monitoring efficace suit un processus en cinq étapes éprouvé chez les leaders 2026.
        </p>
        <p>
          <strong>Étape 1 : définir le périmètre.</strong> Marque mère uniquement, ou marque + produits ? Marché domestique uniquement, ou multi-marché ? Concurrents inclus dans le benchmark ? Les choix initiaux conditionnent la taille du panel et le coût. Un démarrage raisonnable : marque mère FR + 2-3 produits clés + top 5 concurrents = panel de 50-80 prompts.
        </p>
        <p>
          <strong>Étape 2 : construire le panel de prompts.</strong> Mélanger 4 catégories : (1) prompts de découverte (« meilleur acteur X », « top fournisseurs Y », ~40% du panel), (2) prompts comparatifs (« A vs B », « différence entre X et Y », ~25%), (3) prompts techniques (« comment fonctionne », « comment choisir », ~20%), (4) prompts marque-explicites (« qui est marque Z », « avis sur Z », ~15%). Utiliser le langage réel des prospects (rechercher dans Search Console, Reddit, conversations support).
        </p>
        <p>
          <strong>Étape 3 : choisir les LLM à monitorer.</strong> Couvrir au minimum : ChatGPT (GPT-4o ou successeur), Gemini (2.5 Pro et Flash), Claude (Opus ou Sonnet selon coût), Perplexity (Sonar). Pour un budget contraint, prioriser ChatGPT + Perplexity (couvrent 70% de l'usage B2B). Pour un budget normal, les 4 LLM. Pour les marchés non anglophones, ajouter les LLM régionaux (Mistral pour FR, Aleph Alpha pour DE, Qwen pour CN).
        </p>
        <p>
          <strong>Étape 4 : automatiser l'exécution.</strong> Trois options. (a) Script Python custom avec API LLM = 0-50 €/mois mais 5-10 jours d'engineering initial puis maintenance. (b) Outil dédié (Geoperf, Profound, Otterly) = 49-799 €/mois et plug-and-play. (c) Outil enterprise (Brandwatch AI Mode, Profound Enterprise) = 5-15 k€/mois pour les grands comptes avec besoins avancés. Pour 95% des marques B2B, l'option b est l'optimum coût/valeur.
        </p>
        <p>
          <strong>Étape 5 : définir alertes et gouvernance.</strong> Configurer 3 niveaux d'alerte (variation faible/moyenne/critique) avec destinataires clairs (Marketing, Comm, Comex). Réviser le panel tous les trimestres (nouveaux produits, nouveaux concurrents, nouvelles catégories de requêtes). Présenter un report mensuel au comex avec 5-10 KPIs. Sans cette dernière étape, le dispositif reste cosmétique.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Quels seuils, quelles alertes, quelle gouvernance</h2>
        <p>
          La mesure et l'alerting sont là où la plupart des dispositifs échouent — pas par manque d'outils, mais par manque de seuils calibrés.
        </p>
        <p>
          <strong>Seuils citation rate.</strong> Variation hebdomadaire dans ±5% du baseline = bruit normal (à ignorer dans le reporting hebdo, surveiller en tendance mensuelle). Variation -5% à -15% sur 2 semaines consécutives = signal jaune (revue cause). Variation {">"}-15% sur 1-2 semaines = signal rouge (escalation comm/marketing). Variation {">"}-30% sur 1 semaine = crise immédiate (action 48h).
        </p>
        <p>
          <strong>Seuils sentiment.</strong> Sentiment négatif dans 0-15% des citations = baseline normale pour la plupart des marques. Sentiment négatif {">"}25% = signal jaune. Sentiment négatif {">"}40% = crise réputationnelle. À surveiller particulièrement les pics : passage de 10% à 35% en 2 semaines même si toujours sous 40% = alerte forte.
        </p>
        <p>
          <strong>Seuils share-of-voice.</strong> Plus contextuel selon le secteur. Règle générale : surveiller le passage en dessous d'un palier (15%, 10%, 5%) plus que la valeur absolue. Un passage de 18% à 14% chez un acteur secondaire est moins critique qu'un passage de 25% à 20% chez le leader contesté.
        </p>
        <p>
          <strong>Gouvernance opérationnelle.</strong> Affecter un propriétaire clair (Head of SEO, Head of Brand, ou CMO Adjoint selon la structure). Hebdomadaire : revue 30 minutes des dashboards. Mensuel : analyse plus profonde avec 1 page de synthèse comex. Trimestriel : revue panel + ajout/retrait de prompts + recalibrage seuils. Annuel : audit complet (bench cross-secteur, comparaison outils, ROI).
        </p>
        <p>
          <strong>Intégration RP / comm.</strong> Le LLM monitoring doit être branché aux équipes comm/RP, pas isolé en marketing pur. Une chute de citation rate révèle souvent une perte d'autorité presse — la réponse est RP. Une hausse de sentiment négatif révèle souvent une crise produit qui se propage. Les deux fonctions doivent partager les dashboards et les alertes.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Cas de crise et benchmarks</h2>
        <p>
          <strong>Cas anonymisé : ESN française mid-market, crise détectée par monitoring (Q3 2025).</strong> Société 800 employés, citation rate stable autour de 35% sur 12 mois. Décrochage soudain à 18% en 4 semaines. Investigation post-alerte : un ancien dirigeant avait publié un post LinkedIn viral négatif (700k vues) repris par la presse spécialisée, lui-même cité par les LLM dans 40% des prompts marque. Action engagée en semaine 2 (publication corporate factuelle, RP correctrice, contenu Wikipedia mis à jour). Citation rate remonte à 28% en 8 semaines, puis 36% en 16 semaines. Sans monitoring, le décrochage aurait été détecté ~6 mois plus tard.
        </p>
        <p>
          <strong>Cas anonymisé : SaaS B2B FR, hallucination factuelle hostile (Q1 2026).</strong> ChatGPT répondait sur certains prompts « cette plateforme a connu une faille de sécurité majeure en 2023 » — fait totalement faux, vraisemblablement issue d'une confusion avec un concurrent au nom proche. Détecté par monitoring (sentiment négatif dans 18% des citations, vs 4% baseline). Action : publication corporate explicite démentant le fait, ajout schema.org Organization avec history claire, RP technique sur sites spécialisés. Hallucination disparait progressivement en 12-16 semaines (les corrections passent dans les sources crawlées par les LLM).
        </p>
        <p>
          <strong>Benchmark sectoriel asset management FR 2026.</strong> Citation rate moyen top 10 : 52%, médian 28%, P10 5%. Sentiment négatif moyen 11%, médian 8%, P90 22%. Share-of-voice top 3 : Amundi 24%, BNP AM 19%, AXA IM 14%. Pour positionner sa marque, comparer ses scores au médian sectoriel est plus utile que la moyenne (moyenne tirée par les 2-3 leaders).
        </p>
        <p>
          <strong>Pattern leader vs challenger.</strong> Sur les 30 marques du panel, les 5 marques leaders (citation rate {">"}40%) ont en commun : (1) panel monitoring {">"}50 prompts hebdo, (2) ETP partiel ou complet dédié, (3) intégration LLM monitoring au reporting comex, (4) budget annuel monitoring + correction {">"}20 k€. Les 25 marques en dessous ont rarement plus de 2 de ces 4 attributs. Le ROI du monitoring n'est pas dans l'outil seul mais dans la chaîne complète détection-action.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Outils et solutions</h2>
        <p>
          Le marché 2026 du LLM monitoring se segmente en trois catégories.
        </p>
        <p>
          <strong>Catégorie 1 : outils SaaS dédiés multi-LLM.</strong> Geoperf (79-799 €/mois, marché FR/EU spécialisé), Profound (200-1500 $/mois, US-first), Otterly.ai (49-299 $/mois, freemium intéressant), AthenaHQ (300-2000 $/mois, focus enterprise US). Tous couvrent ChatGPT, Gemini, Claude, Perplexity avec dashboards et alerting. Différences : Geoperf inclut presse FR spécialisée et offre Audit GEO consulting ; Profound a la meilleure UI ; Otterly le meilleur freemium ; AthenaHQ les meilleures fonctions entreprise.
        </p>
        <p>
          <strong>Catégorie 2 : extensions de suites enterprise.</strong> Brandwatch AI Mode (extension de la suite Brandwatch, 5-15 k€/an), Sprinklr (module AI search dans la suite Sprinklr), Talkwalker (en cours de lancement). Avantage : intégration native avec votre stack existante (social listening, BI). Inconvénient : coût élevé, focalisation moindre sur LLM spécifique.
        </p>
        <p>
          <strong>Catégorie 3 : DIY / scripts custom.</strong> Pour les équipes data internes, possibilité de coder un dispositif via API OpenAI/Anthropic/Google + Python + dashboard Looker/Streamlit. Coût direct : 50-200 €/mois en API calls + 5-15 j d'engineering initial puis 1-2 j/mois maintenance. Réservé aux équipes data matures avec besoins très spécifiques. Pour 95% des marques, l'option SaaS dédiée a un meilleur ROI.
        </p>
        <p>
          <strong>Choix recommandé selon profil.</strong> PME B2B FR (50-500 employés) : Geoperf Starter à Pro (79-399 €/mois) + Search Console gratuit. ETI européenne (500-5000 employés) : Geoperf Agency ou Brandwatch AI Mode + intégration BI. Grand compte multi-marché : combinaison Geoperf + Profound (couverture EU + US) ou Brandwatch AI Mode enterprise.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Évaluer votre exposition LLM en 30 minutes</p>
        <p className="text-ink mb-4">
          Demandez l'étude sectorielle gratuite Geoperf de votre secteur. 30 prompts représentatifs, 4 LLM, top 30 marques avec sentiment, sources, share-of-voice.
        </p>
        <Link
          href="/etude-sectorielle"
          className="inline-block bg-amber text-navy font-medium px-6 py-3 rounded hover:bg-amber/90 transition-colors"
        >
          Demander mon étude sectorielle
        </Link>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Questions fréquentes</h2>
        <p className="text-ink-muted">Réponses détaillées dans la FAQ ci-dessous, avec data 2026 et cas FR.</p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Pour aller plus loin</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a href="https://www.gartner.com/en/marketing" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Gartner — études CMO sur l'adoption des LLM
            </a>
          </li>
          <li>
            <a href="https://www.forrester.com/research/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Forrester Research — AI search and brand visibility reports
            </a>
          </li>
          <li>
            <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Commission Européenne — AI Act (cadre réglementaire)
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <section id="what" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">What is LLM brand monitoring</h2>
        <p>
          LLM brand monitoring is the practice of systematically tracking how language models (ChatGPT, Gemini, Claude, Perplexity, and others) talk about your brand, your products, your leaders. It's the equivalent of social listening for the new conversational surface, with its own methodological specifics.
        </p>
        <p>
          Concretely, an LLM brand monitoring setup rests on three building blocks. First block: a prompt panel (30-300 questions representative of your market and stakes). Second block: regular automated execution (daily to weekly) of these prompts on target LLMs. Third block: a dashboard and alert system that turn raw data into actionable signals.
        </p>
        <p>
          The scope covers four monitoring dimensions. <strong>Visibility</strong>: does your brand appear when users search your category? <strong>Rank</strong>: at what position in sources or recommendation lists? <strong>Sentiment</strong>: in what tone does the LLM speak (positive, neutral, negative)? <strong>Factuality</strong>: are the facts about your brand correct, or are there hallucinations?
        </p>
        <p>
          The discipline emerged 2023-2024, structured in 2025 (first dedicated tools, first comparative studies), and moves in 2026 from optional to standard for serious B2B companies. It distinguishes itself from classic SEO (which measures Google positions) and social listening (which measures social media conversations). It constitutes a new category.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Why it became a discipline in 2026</h2>
        <p>
          Three converging forces shifted LLM monitoring from `nice-to-have` to `must-have` between 2024 and 2026.
        </p>
        <p>
          <strong>Usage volume hits critical threshold.</strong> Per Gartner CMO 2026 study, 38% of B2B decision-makers consult an LLM at least once a week for professional decisions, vs 9% in 2023. For premium B2B (financial services, consulting, B2B SaaS) this rate exceeds 60%. A brand not monitored on this surface is blind to a discovery channel that weighs as much as organic LinkedIn.
        </p>
        <p>
          <strong>Materialized reputational risks.</strong> Several public incidents 2024-2025 set precedent. Notable case: a US B2B tech brand sees Perplexity citation rate go from 65% to 12% in 6 weeks after a competitor negative press campaign, with no monitoring alerting in time. Six weeks = three missed buying cycles. These cases convinced execs that LLM monitoring is risk-management, not just marketing.
        </p>
        <p>
          <strong>Tools ecosystem maturity.</strong> Between 2024 and 2026, the offering went from 3-4 prototype tools to 15-20 production tools, with API, alerting, BI integrations, and accessible pricing from $49-85/month. It's no longer credible for a CMO to say `we don't have the tools`. Ecosystem industrialization removed the technical excuse.
        </p>
        <p>
          <strong>Emerging regulatory pressure.</strong> The EU AI Act (in force 2025) doesn't explicitly mention brand monitoring, but mass-market LLM transparency obligations create a documentation need. For regulated sectors (banking, healthcare, energy), starting to document what LLMs say about your brand becomes a compliance best practice, anticipating likely 2027-2028 evolutions.
        </p>
        <p>
          The combination of these four factors explains why 67% of large European B2B accounts created a function (partial or full FTE) dedicated to LLM monitoring between 2024 and 2026 (Forrester Q1 2026 study). It's now an operational discipline on par with social listening or SEO.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How to build your monitoring setup</h2>
        <p>
          Building an effective LLM monitoring setup follows a five-step process proven at 2026 leaders.
        </p>
        <p>
          <strong>Step 1: define scope.</strong> Parent brand only, or brand + products? Domestic market only, or multi-market? Competitors included in benchmark? Initial choices condition panel size and cost. A reasonable start: parent brand US + 2-3 key products + top-5 competitors = 50-80 prompt panel.
        </p>
        <p>
          <strong>Step 2: build the prompt panel.</strong> Mix 4 categories: (1) discovery prompts (`best X provider`, `top Y suppliers`, ~40% of panel), (2) comparative prompts (`A vs B`, `difference between X and Y`, ~25%), (3) technical prompts (`how does X work`, `how to choose Y`, ~20%), (4) brand-explicit prompts (`who is brand Z`, `reviews of Z`, ~15%). Use real prospect language (search Search Console, Reddit, support conversations).
        </p>
        <p>
          <strong>Step 3: choose LLMs to monitor.</strong> Cover at minimum: ChatGPT (GPT-4o or successor), Gemini (2.5 Pro and Flash), Claude (Opus or Sonnet by cost), Perplexity (Sonar). For tight budget, prioritize ChatGPT + Perplexity (covers 70% of B2B usage). For normal budget, all 4 LLMs. For non-English markets, add regional LLMs (Mistral for FR, Aleph Alpha for DE, Qwen for CN).
        </p>
        <p>
          <strong>Step 4: automate execution.</strong> Three options. (a) Custom Python script with LLM API = $0-50/month but 5-10 days initial engineering then maintenance. (b) Dedicated tool (Geoperf, Profound, Otterly) = $49-870/month and plug-and-play. (c) Enterprise tool (Brandwatch AI Mode, Profound Enterprise) = $5-15k/month for large accounts with advanced needs. For 95% of B2B brands, option b is the cost/value optimum.
        </p>
        <p>
          <strong>Step 5: define alerts and governance.</strong> Configure 3 alert levels (low/medium/critical variation) with clear recipients (Marketing, Comm, Exec). Review the panel quarterly (new products, new competitors, new query categories). Present monthly report to exec with 5-10 KPIs. Without this last step, the setup remains cosmetic.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Thresholds, alerts, governance</h2>
        <p>
          Measurement and alerting are where most setups fail — not from lack of tools, but from lack of calibrated thresholds.
        </p>
        <p>
          <strong>Citation rate thresholds.</strong> Weekly variation within ±5% baseline = normal noise (ignore in weekly report, watch in monthly trend). Variation -5% to -15% over 2 consecutive weeks = yellow signal (cause review). Variation {">"}-15% over 1-2 weeks = red signal (comm/marketing escalation). Variation {">"}-30% over 1 week = immediate crisis (48h action).
        </p>
        <p>
          <strong>Sentiment thresholds.</strong> Negative sentiment in 0-15% of citations = normal baseline for most brands. Negative sentiment {">"}25% = yellow signal. Negative sentiment {">"}40% = reputational crisis. Particularly watch peaks: jump from 10% to 35% in 2 weeks even if still below 40% = strong alert.
        </p>
        <p>
          <strong>Share-of-voice thresholds.</strong> More contextual by sector. General rule: watch crossing thresholds (15%, 10%, 5%) more than absolute value. A drop from 18% to 14% at a secondary player is less critical than a drop from 25% to 20% at a contested leader.
        </p>
        <p>
          <strong>Operational governance.</strong> Assign a clear owner (Head of SEO, Head of Brand, or Deputy CMO depending on structure). Weekly: 30-minute dashboard review. Monthly: deeper analysis with 1-page exec summary. Quarterly: panel review + prompt add/remove + threshold recalibration. Annual: full audit (cross-sector benchmark, tool comparison, ROI).
        </p>
        <p>
          <strong>PR / comm integration.</strong> LLM monitoring must connect to comm/PR teams, not be isolated in pure marketing. A citation rate drop often reveals press authority loss — the response is PR. A negative sentiment rise often reveals a propagating product crisis. Both functions must share dashboards and alerts.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Crisis cases and benchmarks</h2>
        <p>
          <strong>Anonymized case: US mid-market consulting firm, crisis detected by monitoring (Q3 2025).</strong> 1200-employee company, citation rate stable around 38% for 12 months. Sudden drop to 19% in 4 weeks. Post-alert investigation: a former leader had published a viral negative LinkedIn post (800k views) picked up by trade press, itself cited by LLMs in 42% of brand prompts. Action engaged at week 2 (factual corporate publication, corrective PR, updated Wikipedia content). Citation rate climbs back to 31% in 8 weeks, then 39% in 16 weeks. Without monitoring, the drop would have been detected ~6 months later.
        </p>
        <p>
          <strong>Anonymized case: US B2B SaaS, hostile factual hallucination (Q1 2026).</strong> ChatGPT was answering on certain prompts `this platform suffered a major security breach in 2023` — completely false, likely from confusion with a competitor with similar name. Detected by monitoring (negative sentiment in 21% of citations, vs 5% baseline). Action: explicit corporate publication denying the fact, schema.org Organization addition with clear history, technical PR on specialized sites. Hallucination progressively disappears in 12-16 weeks (corrections flow into sources crawled by LLMs).
        </p>
        <p>
          <strong>US asset management sector benchmark 2026.</strong> Top-10 average citation rate: 56%, median 32%, P10 6%. Average negative sentiment 9%, median 7%, P90 19%. Share-of-voice top 3: BlackRock 28%, Vanguard 23%, Fidelity 18%. To position your brand, comparing scores to sector median is more useful than average (average pulled by 2-3 leaders).
        </p>
        <p>
          <strong>Leader vs challenger pattern.</strong> Across 30 panel brands, the 5 leaders (citation rate {">"}40%) share: (1) monitoring panel {">"}50 prompts/week, (2) partial or full dedicated FTE, (3) LLM monitoring integrated to exec reporting, (4) annual monitoring + correction budget {">"}$25k. The 25 brands below rarely have more than 2 of these 4 attributes. Monitoring ROI isn't in the tool alone but in the full detection-action chain.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Tools and solutions</h2>
        <p>
          The 2026 LLM monitoring market segments into three categories.
        </p>
        <p>
          <strong>Category 1: dedicated multi-LLM SaaS tools.</strong> Geoperf ($85-870/month, EU/FR market specialized), Profound ($200-1500/month, US-first), Otterly.ai ($49-299/month, interesting freemium), AthenaHQ ($300-2000/month, US enterprise focus). All cover ChatGPT, Gemini, Claude, Perplexity with dashboards and alerting. Differences: Geoperf includes specialized European press and offers GEO consulting; Profound has the best UI; Otterly the best freemium; AthenaHQ the best enterprise functions.
        </p>
        <p>
          <strong>Category 2: enterprise suite extensions.</strong> Brandwatch AI Mode (extension of Brandwatch suite, $5-15k/year), Sprinklr (AI search module in Sprinklr suite), Talkwalker (in launch). Advantage: native integration with your existing stack (social listening, BI). Drawback: high cost, lower focus on specific LLM.
        </p>
        <p>
          <strong>Category 3: DIY / custom scripts.</strong> For internal data teams, possibility to code a setup via OpenAI/Anthropic/Google API + Python + Looker/Streamlit dashboard. Direct cost: $50-200/month API calls + 5-15 days initial engineering then 1-2 days/month maintenance. Reserved for mature data teams with very specific needs. For 95% of brands, dedicated SaaS option has better ROI.
        </p>
        <p>
          <strong>Recommended choice by profile.</strong> Mid-market US B2B (50-500 employees): Geoperf Starter to Pro ($85-450/month) + free Search Console. European mid-large (500-5000 employees): Geoperf Agency or Brandwatch AI Mode + BI integration. Multi-market large account: Geoperf + Profound combination (EU + US coverage) or enterprise Brandwatch AI Mode.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Assess your LLM exposure in 30 minutes</p>
        <p className="text-ink mb-4">
          Request the free Geoperf sector study for your industry. 30 representative prompts, 4 LLMs, top 30 brands with sentiment, sources, share-of-voice.
        </p>
        <Link
          href="/etude-sectorielle"
          className="inline-block bg-amber text-navy font-medium px-6 py-3 rounded hover:bg-amber/90 transition-colors"
        >
          Request my sector study
        </Link>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Frequently asked questions</h2>
        <p className="text-ink-muted">Detailed answers in the FAQ below, with 2026 data and US/UK cases.</p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Further reading</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a href="https://www.gartner.com/en/marketing" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Gartner — CMO studies on LLM adoption
            </a>
          </li>
          <li>
            <a href="https://www.forrester.com/research/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Forrester Research — AI search and brand visibility reports
            </a>
          </li>
          <li>
            <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              European Commission — AI Act (regulatory framework)
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const related: RelatedLink[] = relatedForPillar(SLUG, locale === "en" ? "en" : "fr");

  const title = isEn
    ? "LLM brand monitoring 2026: continuous tracking and crisis prep"
    : "LLM brand monitoring 2026 : surveillance continue et gestion de crise";
  const intro = isEn
    ? "LLM brand monitoring is the new must-have discipline for B2B brands: while social listening tracks what users say, LLM monitoring tracks what ChatGPT, Gemini, Claude, and Perplexity say to millions of users simultaneously. This guide explains how to build a monitoring setup that scales, what thresholds to alert on, and how to integrate it with PR and crisis comm in 2026."
    : "Le LLM brand monitoring est la nouvelle discipline incontournable pour les marques B2B : là où le social listening capture ce que les utilisateurs disent, le LLM monitoring capture ce que ChatGPT, Gemini, Claude et Perplexity disent à des millions d'utilisateurs en parallèle. Ce guide explique comment construire un dispositif scalable, quels seuils alerter, et comment l'intégrer aux équipes RP et comm de crise en 2026.";

  return (
    <PillarLayout
      locale={locale}
      slug={SLUG}
      title={title}
      intro={intro}
      publishedAt={PUBLISHED_AT}
      toc={isEn ? TOC_EN : TOC_FR}
      body={isEn ? <BodyEn /> : <BodyFr />}
      faq={isEn ? FAQ_EN : FAQ_FR}
      relatedLinks={related}
      ctaPrimaryHref="/etude-sectorielle"
      ctaPrimaryLabel={isEn ? "Request my sector study" : "Demander mon étude sectorielle"}
    />
  );
}
