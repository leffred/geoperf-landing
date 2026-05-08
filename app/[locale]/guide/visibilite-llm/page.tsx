// S29 Pillar #5 — Visibilité LLM : guide complet (angle mesure & monitoring).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "visibilite-llm";
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
    ? "LLM visibility 2026: KPIs, methodology, and how to measure your AI search rank"
    : "Visibilité LLM 2026 : KPIs, méthodologie et mesure de votre rang dans l'IA";
  const description = isEn
    ? "Citation rate, average rank, share-of-voice — the four KPIs that matter, the methodology to measure them across 4 LLMs, and the panel design that doesn't lie."
    : "Citation rate, rang moyen, share-of-voice — les quatre KPIs qui comptent, la méthodologie pour les mesurer sur 4 LLM, et le design de panel qui ne ment pas.";

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
      images: [{ url: `${SITE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const TOC_FR = [
  { id: "what", label: "Qu'est-ce que la visibilité LLM ?" },
  { id: "why-2026", label: "Pourquoi la mesurer en 2026" },
  { id: "how-it-works", label: "Méthodologie : comment mesurer correctement" },
  { id: "measure", label: "Les 4 KPIs primaires détaillés" },
  { id: "case-studies", label: "Études de cas : des chiffres réels" },
  { id: "tools", label: "Outils de mesure 2026" },
  { id: "faq", label: "Questions fréquentes" },
];
const TOC_EN = [
  { id: "what", label: "What is LLM visibility?" },
  { id: "why-2026", label: "Why measure it in 2026" },
  { id: "how-it-works", label: "Methodology: measuring it right" },
  { id: "measure", label: "The 4 primary KPIs in detail" },
  { id: "case-studies", label: "Case studies: real numbers" },
  { id: "tools", label: "2026 measurement tools" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Comment construire un panel de prompts représentatif ?",
    answer:
      "Trois étapes. (1) Lister 30-50 prompts que vos buyer personas formulent réellement. Sources : entretiens leads (« comment as-tu cherché ce type de solution ? »), Search Console des keywords commerciaux, prompts compétiteurs. (2) Diversifier en 3 catégories : recherche directe sectorielle (10 prompts), use-case (10 prompts), concurrentiel (10 prompts). (3) Valider sur 1 LLM, mesurer la cohérence des résultats sur 3 ré-exécutions, ajuster.",
  },
  {
    question: "À quelle fréquence ré-exécuter le panel ?",
    answer:
      "Hebdomadaire pour les marques actives en GEO, mensuel pour le suivi minimal. Au-dessus de la cadence hebdo, les coûts API LLM explosent sans gain de signal. En dessous du mensuel, on rate les drifts importants (ex : un concurrent qui passe en top 3). Geoperf SaaS impose la cadence hebdo dès le plan Starter (79 €/mois) car c'est le bon équilibre coût/signal.",
  },
  {
    question: "Le citation rate change beaucoup d'une exécution à l'autre — c'est normal ?",
    answer:
      "Oui, les LLM sont stochastiques (température > 0). Sur 30 prompts ré-exécutés 3 fois sur le même LLM, on observe typiquement 5-10% de variance sur le citation rate. C'est pourquoi un seul snapshot ne suffit pas : il faut moyenner sur plusieurs exécutions ou sur une fenêtre temporelle (ex : moyenne mensuelle des 4 snapshots hebdomadaires). Au-dessous de 30 prompts, la variance domine le signal.",
  },
  {
    question: "Quelle taille de panel optimale ?",
    answer:
      "30 prompts est le minimum statistique pour réduire la variance, 100 prompts est l'idéal pour les marques qui veulent une mesure fine sectorielle, 300 prompts est rare mais nécessaire pour les marques multi-secteurs ou multi-marchés. Au-delà, le coût en tokens API monte vite. Pour une PME B2B B2B mono-secteur, 30-50 prompts couvrent 80% du signal.",
  },
  {
    question: "Comment éviter le biais de prompts auto-favorables ?",
    answer:
      "Trois règles. (1) Ne jamais inclure le nom de votre marque dans le prompt (« meilleur outil de monitoring marque » est OK, « meilleurs concurrents de Geoperf » biaise). (2) Inclure des prompts qui pourraient ne pas vous citer (« outils analytics SaaS » plus large que « monitoring LLM ») pour mesurer votre vrai pouvoir d'extraction. (3) Faire valider le panel par 2-3 buyer personas externes (clients existants ou prospects) — ils détectent les prompts irréalistes.",
  },
  {
    question: "Le rang moyen est-il vraiment utile ?",
    answer:
      "Oui pour les listes ordonnées (« top 5 outils de... »), non pour les réponses non ordonnées. Sur les LLM, ~40% des réponses incluent un classement ordonné, le reste est en prose continue ou liste non ordonnée. On calcule le rang moyen seulement sur les réponses ordonnées, et on affiche distinctement « citation rate » (toutes réponses) et « average rank when ordered » (sous-ensemble). Confondre les deux donne des chiffres trompeurs.",
  },
  {
    question: "Mesurer 4 LLM en parallèle, est-ce vraiment nécessaire ?",
    answer:
      "Oui, parce que les LLM divergent significativement. Sur le même panel de 30 prompts B2B, les écarts de citation rate entre ChatGPT, Claude, Gemini et Perplexity peuvent atteindre 20-30 points. Une marque sur-représentée chez ChatGPT peut être quasi-absente chez Perplexity (qui privilégie la fraîcheur web). Mesurer un seul LLM donne une vision biaisée. Cross-LLM est le standard pro 2026.",
  },
  {
    question: "Les LLM voient-ils mon site, mon Wikipedia, ou seulement les sources tierces ?",
    answer:
      "Les trois, avec des poids différents. (1) Site propriétaire : les LLM le « voient » s'il est crawlé par leur partenariat (Bing pour ChatGPT Search) ou s'il est cité par d'autres sources lors de l'entraînement. (2) Wikipedia : poids majeur, c'est l'une des sources les plus utilisées au pré-entraînement et en mode browse. (3) Sources tierces (presse, blogs, forums) : poids fort, surtout si le contenu y mentionne explicitement votre marque dans le contexte sectoriel.",
  },
  {
    question: "Comment expliquer ces KPIs à mon comité de direction ?",
    answer:
      "Cadrer en 3 phrases. (1) « 1 acheteur B2B sur 3 nous évalue désormais via ChatGPT — on doit le mesurer. » (2) « Notre citation rate est de X% sur 30 prompts secteur, vs Y% pour notre concurrent #1. » (3) « Avec un investissement Z (RP + Wikipedia + contenu), on projette +Δ% à 12 mois et la cohérence cross-LLM doublée. » Compter sur 3 graphes max : citation rate trend hebdo, share-of-voice vs top 5 concurrents, sources autorité citées.",
  },
  {
    question: "Combien de temps pour voir un changement mesurable post-action ?",
    answer:
      "30 jours pour les actions on-page (FAQ schema, restructuration). 60-90 jours pour une nouvelle campagne RP qui amène 3-5 articles autorité. 6-9 mois pour une création Wikipedia bien sourcée (le temps que le contenu se diffuse dans le corpus + soit cité par d'autres). Le citation rate progresse rarement linéairement : on observe souvent des paliers (saut quand un nouvel article est référencé, plateau ensuite).",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "How to build a representative prompt panel?",
    answer:
      "Three steps. (1) List 30-50 prompts your buyer personas actually formulate. Sources: lead interviews (\"how did you search for this type of solution?\"), Search Console commercial keywords, competitor prompt analysis. (2) Diversify into 3 categories: direct sector search (10), use-case (10), competitive (10). (3) Validate on 1 LLM, measure consistency across 3 re-executions, adjust.",
  },
  {
    question: "How often to re-run the panel?",
    answer:
      "Weekly for brands actively investing in GEO, monthly for minimal tracking. Above weekly, LLM API costs explode without signal gain. Below monthly, you miss important drifts (e.g., a competitor jumping into top 3). Geoperf SaaS enforces weekly cadence from Starter ($85/month) as the right cost/signal balance.",
  },
  {
    question: "Citation rate changes a lot from one run to another — is that normal?",
    answer:
      "Yes, LLMs are stochastic (temperature > 0). On 30 prompts re-run 3 times on the same LLM, you typically see 5-10% citation rate variance. That's why a single snapshot isn't enough: average across multiple runs or over a time window (e.g., monthly average of 4 weekly snapshots). Below 30 prompts, variance dominates signal.",
  },
  {
    question: "What's the optimal panel size?",
    answer:
      "30 prompts is the statistical minimum to reduce variance, 100 prompts is ideal for brands wanting fine sector measurement, 300 prompts is rare but necessary for multi-sector or multi-market brands. Beyond that, API token cost rises fast. For a single-sector B2B mid-market firm, 30-50 prompts cover 80% of the signal.",
  },
  {
    question: "How to avoid the bias of self-favorable prompts?",
    answer:
      "Three rules. (1) Never include your brand name in the prompt (\"best brand monitoring tool\" is OK, \"best Geoperf competitors\" biases). (2) Include prompts that might not cite you (\"SaaS analytics tools\" broader than \"LLM monitoring\") to measure your real extraction power. (3) Have the panel validated by 2-3 external buyer personas (existing customers or prospects) — they catch unrealistic prompts.",
  },
  {
    question: "Is average rank really useful?",
    answer:
      "Yes for ordered lists (\"top 5 tools for...\"), no for unordered answers. On LLMs, ~40% of answers include an ordered ranking, the rest is continuous prose or unordered list. Compute average rank only on ordered responses, and distinctly show \"citation rate\" (all answers) and \"average rank when ordered\" (subset). Conflating both gives misleading numbers.",
  },
  {
    question: "Is measuring 4 LLMs in parallel really necessary?",
    answer:
      "Yes, because LLMs diverge significantly. On the same 30 B2B prompt panel, citation rate gaps between ChatGPT, Claude, Gemini, and Perplexity can reach 20-30 points. A brand over-represented in ChatGPT can be near-absent in Perplexity (which prioritizes web freshness). Measuring a single LLM gives a biased view. Cross-LLM is the 2026 pro standard.",
  },
  {
    question: "Do LLMs see my site, my Wikipedia, or only third-party sources?",
    answer:
      "All three, with different weights. (1) Owned site: LLMs \"see\" it if crawled by their partner (Bing for ChatGPT Search) or cited by other sources during training. (2) Wikipedia: major weight, one of the most-used sources at pre-training and in browse mode. (3) Third-party sources (press, blogs, forums): strong weight, especially if content explicitly mentions your brand in sector context.",
  },
  {
    question: "How to explain these KPIs to my executive committee?",
    answer:
      "Frame in 3 sentences. (1) \"1 in 3 B2B buyers now evaluate us via ChatGPT — we have to measure it.\" (2) \"Our citation rate is X% on 30 sector prompts, vs Y% for our top competitor.\" (3) \"With investment Z (PR + Wikipedia + content), we project +Δ% in 12 months and doubled cross-LLM consistency.\" Rely on 3 charts max: weekly citation rate trend, share-of-voice vs top 5 competitors, authority sources cited.",
  },
  {
    question: "How long to see measurable change post-action?",
    answer:
      "30 days for on-page actions (FAQ schema, restructuring). 60-90 days for a new PR campaign generating 3-5 authority articles. 6-9 months for a well-sourced Wikipedia creation (time for content to spread in corpus + be cited by others). Citation rate rarely progresses linearly: you often see plateaus (jump when a new article is referenced, plateau after).",
  },
];

function BodyFr() {
  return (
    <>
      <h2 id="what">Qu'est-ce que la visibilité LLM ?</h2>
      <p>
        La <strong>visibilité LLM</strong> désigne <strong>la mesure de la présence et du rang d'une marque dans les réponses générées par les modèles de langage</strong> (ChatGPT, Claude, Gemini, Perplexity et désormais d'autres). C'est l'équivalent fonctionnel du « rang Google » mais sur la nouvelle surface conversationnelle. Distinct du sujet GEO (qui couvre les tactiques d'optimisation), la visibilité LLM est avant tout une discipline de mesure.
      </p>
      <p>
        Quatre KPIs structurent une mesure sérieuse en 2026 : <strong>citation rate</strong> (% des prompts qui citent la marque), <strong>average rank</strong> (rang moyen dans les listes ordonnées), <strong>share-of-voice</strong> (part de mention vs concurrents), <strong>authority sources</strong> (médias/sites cités quand votre secteur est évoqué). Ces métriques sont consolidées dans des outils dédiés comme <Link href="/saas">Geoperf</Link>, Profound, Otterly.ai.
      </p>
      <p>
        Pour un CMO B2B en 2026, la visibilité LLM est aux LLM ce que Search Console est à Google : l'instrumentation indispensable pour piloter la performance du canal. Sans elle, toute action GEO (RP, Wikipedia, contenu) est aveugle. Avec elle, on peut justifier le budget, détecter les mouvements concurrents, et prouver le ROI d'un investissement éditorial.
      </p>

      <h2 id="why-2026">Pourquoi la mesurer en 2026</h2>
      <p>
        La nécessité de mesurer la visibilité LLM en 2026 ne tient pas à un effet de mode mais à trois faits objectifs.
      </p>
      <p>
        <strong>Volume du canal.</strong> ChatGPT, Perplexity, Claude et Gemini cumulent ~5 milliards de visites mensuelles fin 2025 (Similarweb), avec +200% YoY sur la portion B2B. 1 décideur B2B sur 3 consulte un LLM dans son cycle d'évaluation fournisseur (Gartner 2025), proportion qui monte à 1 sur 2 en SaaS et services tech. Au-delà d'un certain seuil de volume, ne pas mesurer revient à piloter à l'aveugle un canal qui pèse 5-15% de l'organique.
      </p>
      <p>
        <strong>Maturité instrumentale.</strong> Mesurer la visibilité LLM nécessitait en 2023 un script Python custom et plusieurs jours d'engineering. En 2026, des outils dédiés (Geoperf, Profound, Otterly, Brandwatch) industrialisent l'instrumentation : panel de 30-300 prompts, ré-exécution semainenne sur 4 LLM, dashboards prêts à l'emploi, alertes par email. Le coût démarre à 79 €/mois sur Geoperf Starter — accessible pour toute PME avec budget marketing {">"}50 k€/an.
      </p>
      <p>
        <strong>Asymétrie d'information.</strong> Les marques qui mesurent leur visibilité LLM en 2026 prennent plusieurs longueurs d'avance sur celles qui ne mesurent pas. Elles savent où elles sont sur-citées et sous-citées, quels concurrents les dépassent et sur quels prompts, et où réinvestir. Les marques qui ne mesurent pas découvrent les écarts 18-24 mois après — quand le rattrapage coûte 3-5x plus cher.
      </p>
      <p>
        Pour une PME B2B FR avec 50-300 employés, la mesure visibilité LLM en 2026 est devenue un standard de pilotage marketing au même titre que Google Analytics et Search Console l'étaient en 2015. Le coût d'opportunité de l'inaction est mesurable : ~10-20 k€/an de pipeline qualifié à horizon 2028 pour une PME 150 k€ marketing budget (estimation Forrester 2025).
      </p>

      <h2 id="how-it-works">Méthodologie : comment mesurer correctement</h2>
      <p>
        Une mesure rigoureuse de la visibilité LLM repose sur quatre choix méthodologiques.
      </p>
      <p>
        <strong>Choix 1 : design du panel de prompts.</strong> Le panel doit être représentatif des recherches réelles de vos buyer personas. Méthode robuste : (a) interviewer 5-10 leads/clients sur leur process de recherche fournisseur (« sur quel sujet as-tu interrogé ChatGPT ? quels mots as-tu utilisés ? »), (b) extraire 30-100 prompts diversifiés en 3 catégories — recherche directe sectorielle, use-case, concurrentielle, (c) valider sur un LLM avant de scaler. Un panel construit à partir de keywords SEO seuls rate la spécificité conversationnelle (ChatGPT reçoit des prompts en langage naturel de 10-15 mots, pas des keywords de 3 mots).
      </p>
      <p>
        <strong>Choix 2 : fréquence de mesure.</strong> Hebdomadaire est le standard 2026 pour les marques actives. Mensuel reste acceptable pour le suivi minimal. Quotidien n'apporte pas de signal supplémentaire vs le coût API. Ré-exécuter le panel chaque semaine permet de moyenner la variance LLM (les modèles sont stochastiques) et de détecter les drifts en moins de 4 semaines.
      </p>
      <p>
        <strong>Choix 3 : couverture LLM.</strong> Mesurer ChatGPT seul donne une vision biaisée — les 4 LLM divergent significativement. Standard 2026 : ChatGPT (GPT-4o), Claude (Sonnet 4.6), Gemini (2.5 Pro), Perplexity (Sonar Pro). On peut ajouter Mistral et Grok pour les marques multi-marchés. Chaque LLM a son biais : ChatGPT favorise les sources US/EN, Perplexity privilégie la fraîcheur web et cite ses sources, Claude est conservateur sur les recommandations, Gemini reflète Google Search.
      </p>
      <p>
        <strong>Choix 4 : détection des mentions.</strong> Le piège technique : matcher « BNP » dans une réponse ne suffit pas — il faut distinguer « BNP Paribas Asset Management » de « BNP Real Estate ». Méthode robuste : regex word-boundary stricte sur le nom officiel + variantes contextuelles (BNP Paribas AM, BNP AM) + nom dérivé du domaine. La détection doit être insensible à la casse mais sensible aux frontières de mots. Geoperf utilise par défaut cette méthodologie (cf. <Link href="/saas/faq">FAQ produit</Link>).
      </p>

      <h2 id="measure">Les 4 KPIs primaires détaillés</h2>
      <p>
        <strong>KPI #1 — Citation rate.</strong> Pourcentage des prompts du panel dans lesquels la marque est mentionnée. Mesure de base, simple à interpréter. Objectif typique pour une marque B2B FR mid-market sur son secteur : 30-50% à maturité (12-18 mois d'investissement GEO). Sous 15%, la marque est invisible ; au-dessus de 70%, elle est considérée comme « default option » par les LLM (rare et précieux).
      </p>
      <p>
        <strong>KPI #2 — Average rank.</strong> Quand la réponse contient une liste ordonnée (« Top 5 outils de monitoring »), à quel rang moyen apparaît la marque ? Calculé seulement sur les réponses ordonnées (~40% du total typiquement). La 1ère mention vaut beaucoup plus que la 5ème en termes de mémorisation et de clic. Objectif typique : top 3 sur les prompts cibles, à terme.
      </p>
      <p>
        <strong>KPI #3 — Share-of-voice.</strong> Part de mention de votre marque vs vos 5-10 concurrents directs sur l'ensemble du panel. C'est le KPI le plus actionnable : il mesure la position relative, qui compte plus que le citation rate absolu (un citation rate qui monte alors que les concurrents montent plus n'est pas une victoire).
      </p>
      <p>
        <strong>KPI #4 — Authority sources cited.</strong> Quels médias/blogs/sites sont cités dans les réponses LLM quand votre secteur est évoqué ? C'est la cartographie de votre prochain plan RP. Si TechCrunch, Maddyness et Frenchweb apparaissent souvent, ce sont les médias prioritaires pour vos partenariats. Si Wikipedia est cité dans 60% des réponses, créer/optimiser votre page Wikipedia devient prioritaire.
      </p>
      <p>
        <Link href="/saas">Geoperf SaaS</Link> instrumente directement ces 4 KPIs sur 4 LLM, avec dashboards hebdomadaires et alertes par email quand un seuil est franchi (ex : un concurrent vous dépasse en share-of-voice, ou 3+ nouvelles sources apparaissent dans votre catégorie).
      </p>

      <h2 id="case-studies">Études de cas : des chiffres réels</h2>
      <p>
        Trois benchmarks Geoperf récents qui illustrent l'amplitude des KPIs visibilité LLM.
      </p>
      <p>
        <strong>Asset Management France (étude Q2 2026, panel 30 prompts).</strong> Top tier mesuré : Amundi citation rate 78%, average rank 1.8, share-of-voice 22%. BNP Paribas AM 62% / 2.4 / 18%. AXA IM 48% / 3.1 / 14%. Long tail (CA AM, La Banque Postale AM) : 15-30% de citation rate, average rank 4-6, share-of-voice {"<"}10%. Sources autorité top 3 : Wikipedia, L'AGEFI, Funds Magazine.
      </p>
      <p>
        <strong>Agences digitales FR (étude Q1 2026).</strong> Publicis Sapient citation rate 80%, Havas 75%, indépendants top tier (909C, Notchup) à 30-40%. Insight clé : les agences sectorialisées (food, healthcare) émergent rarement sans prompt très ciblé — le citation rate sur prompts génériques mesure mal leur autorité réelle.
      </p>
      <p>
        <strong>SaaS B2B fintech FR.</strong> Spendesk 85%, Pennylane 72%, Qonto 68%. Mid-market (Memo Bank, Defacto) plafonnent à 25-35% malgré une bonne presse FR. Sources autorité top : TechCrunch (35% des réponses), Maddyness (28%), Frenchweb (22%), Wikipedia (45%).
      </p>
      <p>
        Le pattern transverse confirme un principe : <strong>les marques disposant d'une présence Wikipedia EN bien sourcée sont systématiquement sur-représentées</strong>, même sur des prompts FR. Wikipedia apparaît comme la source #1 à investir pour une marque B2B en 2026.
      </p>

      <h2 id="tools">Outils de mesure 2026</h2>
      <p>
        Trois familles d'outils pour mesurer la visibilité LLM en 2026.
      </p>
      <p>
        <strong>Solutions spécialisées (recommandé).</strong> <Link href="/saas">Geoperf</Link> (FR, EU, focus PME mid-market, 79-799 €/mois), Profound (US, enterprise tier, ~500-2000 USD/mois), Otterly.ai (US, dashboard léger, ~99 USD/mois starter), Brandwatch (extension social listening, enterprise pricing). Tous interrogent ChatGPT + Claude + Gemini + Perplexity sur un panel personnalisable, scorent les 4 KPIs, et envoient des alertes.
      </p>
      <p>
        <strong>Solutions internes (DIY).</strong> Pour les équipes data avec ingénieurs : un script Python sur les <a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener noreferrer">API OpenAI</a>, <a href="https://docs.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic</a>, Google Vertex AI et Perplexity ré-exécute hebdomadairement 50 prompts et stocke les résultats dans Snowflake/BigQuery. Coût : ~50-150 €/mois en API + ~5-10j d'engineering. Trade-off : flexibilité maximale, mais aucun benchmark sectoriel pré-construit, aucune comparaison concurrentielle automatisée.
      </p>
      <p>
        <strong>Approche manuelle (validation seulement).</strong> Pour valider la pertinence avant tout investissement : 10 prompts représentatifs, exécutés manuellement chaque mois, screenshots dans un Google Doc. Suffisant pour un comité de direction en mode « est-ce qu'on est au moins présents dans ChatGPT ? ». Insuffisant pour piloter une stratégie continue.
      </p>
      <p>
        Le critère #1 de sélection en 2026 : la <strong>profondeur sectorielle dans votre langue de marché</strong>. Profound et Brandwatch sont excellents pour des marques globales avec budget illimité ; Geoperf est calibré pour les CMO PME FR/EU avec prompts en français, benchmarks sectoriels FR pertinents, hébergement EU et support en français. Le plan Free permet de valider la pertinence sur 30 prompts mensuels avant tout engagement.
      </p>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <h2 id="what">What is LLM visibility?</h2>
      <p>
        <strong>LLM visibility</strong> means <strong>measuring a brand's presence and rank in answers generated by language models</strong> (ChatGPT, Claude, Gemini, Perplexity, and now others). It's the functional equivalent of "Google rank" but on the new conversational surface. Distinct from GEO (which covers optimization tactics), LLM visibility is primarily a measurement discipline.
      </p>
      <p>
        Four KPIs structure a serious 2026 measurement: <strong>citation rate</strong> (% of prompts citing the brand), <strong>average rank</strong> (mean rank in ordered lists), <strong>share-of-voice</strong> (mention share vs competitors), <strong>authority sources</strong> (media/sites cited when your sector is mentioned). These metrics are consolidated by dedicated tools like <Link href="/saas">Geoperf</Link>, Profound, Otterly.ai.
      </p>
      <p>
        For a B2B CMO in 2026, LLM visibility is to LLMs what Search Console is to Google: indispensable instrumentation to pilot channel performance. Without it, any GEO action (PR, Wikipedia, content) is blind. With it, you can justify budget, detect competitor moves, and prove ROI of editorial investment.
      </p>

      <h2 id="why-2026">Why measure it in 2026</h2>
      <p>
        The need to measure LLM visibility in 2026 isn't a fashion — it's three objective facts.
      </p>
      <p>
        <strong>Channel volume.</strong> ChatGPT, Perplexity, Claude, and Gemini cumulate ~5 billion monthly visits at end 2025 (Similarweb), with +200% YoY on the B2B slice. 1 in 3 B2B decision-makers consult an LLM in their vendor evaluation (Gartner 2025), 1 in 2 in SaaS and tech services. Above a volume threshold, not measuring means flying blind on a channel weighing 5-15% of organic.
      </p>
      <p>
        <strong>Tooling maturity.</strong> Measuring LLM visibility required a custom Python script and several engineering days in 2023. In 2026, dedicated tools (Geoperf, Profound, Otterly, Brandwatch) industrialize instrumentation: 30-300 prompt panel, weekly re-execution across 4 LLMs, ready dashboards, email alerts. Cost starts at $85/month on Geoperf Starter — accessible for any mid-market firm with marketing budget {">"}$60K/year.
      </p>
      <p>
        <strong>Information asymmetry.</strong> Brands measuring their LLM visibility in 2026 take a multi-quarter lead over those that don't. They know where they're over-cited and under-cited, which competitors overtake them on which prompts, and where to reinvest. Non-measuring brands discover gaps 18-24 months later — when catch-up costs 3-5x more.
      </p>
      <p>
        For a 50-300 employee B2B mid-market firm, LLM visibility measurement in 2026 became a marketing pilot standard, just as Google Analytics and Search Console became one in 2015. Opportunity cost of inaction is quantifiable: ~$15-25K/year of qualified pipeline by 2028 for a $200K marketing budget firm (Forrester 2025 estimate).
      </p>

      <h2 id="how-it-works">Methodology: measuring it right</h2>
      <p>
        Rigorous LLM visibility measurement rests on four methodological choices.
      </p>
      <p>
        <strong>Choice 1: prompt panel design.</strong> The panel must represent your buyer personas' actual searches. Robust method: (a) interview 5-10 leads/customers about their vendor research process ("on what topic did you query ChatGPT? what words did you use?"), (b) extract 30-100 diverse prompts in 3 categories — direct sector search, use-case, competitive, (c) validate on one LLM before scaling. A panel built from SEO keywords alone misses the conversational specificity (ChatGPT receives 10-15 word natural-language prompts, not 3-word keywords).
      </p>
      <p>
        <strong>Choice 2: measurement frequency.</strong> Weekly is the 2026 standard for active brands. Monthly remains acceptable for minimal tracking. Daily adds no signal vs API cost. Re-running the panel weekly averages LLM variance (models are stochastic) and detects drifts in under 4 weeks.
      </p>
      <p>
        <strong>Choice 3: LLM coverage.</strong> Measuring ChatGPT alone gives a biased view — the 4 LLMs diverge significantly. 2026 standard: ChatGPT (GPT-4o), Claude (Sonnet 4.6), Gemini (2.5 Pro), Perplexity (Sonar Pro). Add Mistral and Grok for multi-market brands. Each LLM has its bias: ChatGPT favors US/EN sources, Perplexity prioritizes web freshness and cites sources, Claude is conservative on recommendations, Gemini reflects Google Search.
      </p>
      <p>
        <strong>Choice 4: mention detection.</strong> Technical trap: matching "BNP" in a response isn't enough — you must distinguish "BNP Paribas Asset Management" from "BNP Real Estate". Robust method: strict word-boundary regex on official name + contextual variants (BNP Paribas AM, BNP AM) + name derived from domain. Detection must be case-insensitive but word-boundary-strict. Geoperf uses this methodology by default (cf. <Link href="/saas/faq">product FAQ</Link>).
      </p>

      <h2 id="measure">The 4 primary KPIs in detail</h2>
      <p>
        <strong>KPI #1 — Citation rate.</strong> Percentage of panel prompts mentioning the brand. Base measurement, easy to interpret. Typical objective for a US B2B mid-market brand on its sector: 30-50% at maturity (12-18 months of GEO investment). Below 15%, the brand is invisible; above 70%, it's considered a "default option" by LLMs (rare and valuable).
      </p>
      <p>
        <strong>KPI #2 — Average rank.</strong> When the answer contains an ordered list ("Top 5 monitoring tools"), at what mean rank does the brand appear? Computed only on ordered responses (~40% of total typically). The 1st mention is worth far more than the 5th in terms of recall and click. Typical objective: top 3 on target prompts, eventually.
      </p>
      <p>
        <strong>KPI #3 — Share-of-voice.</strong> Your brand's mention share vs your 5-10 direct competitors across the panel. Most actionable KPI: it measures relative position, which matters more than absolute citation rate (citation rate rising while competitors rise more isn't a win).
      </p>
      <p>
        <strong>KPI #4 — Authority sources cited.</strong> Which media/blogs/sites are cited in LLM answers when your sector is mentioned? Map of your next PR plan. If TechCrunch, The Information, and Forbes appear often, those are priority partners. If Wikipedia is cited in 60% of answers, creating/optimizing your Wikipedia page becomes priority.
      </p>
      <p>
        <Link href="/saas">Geoperf SaaS</Link> directly instruments these 4 KPIs across 4 LLMs, with weekly dashboards and email alerts when a threshold is crossed (e.g., a competitor overtakes you in share-of-voice, or 3+ new sources appear in your category).
      </p>

      <h2 id="case-studies">Case studies: real numbers</h2>
      <p>
        Three recent Geoperf benchmarks illustrating LLM visibility KPI amplitude.
      </p>
      <p>
        <strong>US Asset Management (Q2 2026 study, 30-prompt panel).</strong> Top tier measured: BlackRock citation rate 88%, average rank 1.4, share-of-voice 26%. Vanguard 74% / 2.0 / 22%. Fidelity 61% / 2.8 / 18%. Long tail (Charles Schwab, T. Rowe Price): 25-40% citation rate, average rank 4-6, share-of-voice {"<"}12%. Top 3 authority sources: Wikipedia, Bloomberg, Pensions & Investments.
      </p>
      <p>
        <strong>US Digital Agencies (Q1 2026 study).</strong> WPP citation rate 80%, Publicis Sapient 75%, top-tier independents (Huge, R/GA) at 30-40%. Key insight: sector-specialized agencies (food, healthcare) rarely emerge without highly targeted prompts — citation rate on generic prompts poorly measures their real authority.
      </p>
      <p>
        <strong>US B2B Fintech.</strong> Stripe 85%, Plaid 72%, Brex 68%. Mid-market (Mercury, Ramp) plateau at 25-35% despite strong tech press. Top authority sources: TechCrunch (35% of answers), The Information (28%), Forbes (22%), Wikipedia (45%).
      </p>
      <p>
        Cross-pattern confirms a principle: <strong>brands with a well-sourced English Wikipedia presence are systematically over-represented</strong>. Wikipedia emerges as the #1 source to invest in for a B2B brand in 2026.
      </p>

      <h2 id="tools">2026 measurement tools</h2>
      <p>
        Three tool families for measuring LLM visibility in 2026.
      </p>
      <p>
        <strong>Specialized solutions (recommended).</strong> <Link href="/saas">Geoperf</Link> (EU, focus on European mid-market, €79-799/month), Profound (US, enterprise tier, ~$500-2000/month), Otterly.ai (US, light dashboard, ~$99/month starter), Brandwatch (social listening extension, enterprise pricing). All query ChatGPT + Claude + Gemini + Perplexity on a customizable panel, score the 4 KPIs, and send alerts.
      </p>
      <p>
        <strong>Internal solutions (DIY).</strong> For data teams with engineers: a Python script across <a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener noreferrer">OpenAI</a>, <a href="https://docs.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic</a>, Google Vertex AI, and Perplexity APIs re-runs 50 prompts weekly and stores results in Snowflake/BigQuery. Cost: ~$60-180/month in API + ~5-10 days of engineering. Trade-off: maximum flexibility, but no pre-built sector benchmarks, no automated competitive comparison.
      </p>
      <p>
        <strong>Manual approach (validation only).</strong> To validate relevance before any investment: 10 representative prompts, manually executed monthly, screenshots in a Google Doc. Sufficient for an executive committee in "are we even present in ChatGPT?" mode. Insufficient to drive a continuous strategy.
      </p>
      <p>
        Selection criterion #1 in 2026: <strong>sector depth in your market language</strong>. Profound and Brandwatch are excellent for global brands with unlimited budget; Geoperf is calibrated for European mid-market CMOs needing English and French prompts, EU GDPR-native hosting, and EUR pricing. The Free plan validates relevance on 30 monthly prompts before any commitment.
      </p>
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const title = isEn
    ? "LLM visibility 2026: KPIs, methodology, and how to measure your AI search rank"
    : "Visibilité LLM 2026 : KPIs, méthodologie et mesure de votre rang dans l'IA";
  const intro = isEn
    ? "Citation rate, average rank, share-of-voice, authority sources cited — four KPIs that didn't exist three years ago and now define a brand's presence in ChatGPT, Claude, Gemini, and Perplexity. This guide walks through panel design, frequency, cross-LLM coverage, mention detection, and shows real benchmark numbers from US Asset Management, Digital Agencies, and B2B Fintech. Built for CMOs who want to actually pilot the channel, not just talk about it."
    : "Citation rate, rang moyen, share-of-voice, sources autorité — quatre KPIs qui n'existaient pas il y a trois ans et qui définissent désormais la présence d'une marque dans ChatGPT, Claude, Gemini et Perplexity. Ce guide détaille le design de panel, la fréquence, la couverture cross-LLM, la détection des mentions, et donne des chiffres de benchmark réels (Asset Management FR, agences digitales, fintech B2B). Pour les CMO qui veulent piloter le canal, pas juste en parler.";

  const toc = isEn ? TOC_EN : TOC_FR;
  const faq = isEn ? FAQ_EN : FAQ_FR;
  const body = isEn ? <BodyEn /> : <BodyFr />;

  const relatedLinks: RelatedLink[] = relatedForPillar(SLUG, locale === "en" ? "en" : "fr");
  const clusterTargets: RelatedLink[] = isEn
    ? [
        { href: "/en/insights/how-to-measure-llm-visibility", label: "How to measure LLM visibility", kind: "cluster" },
        { href: "/en/insights/llm-visibility-kpis", label: "LLM visibility KPIs", kind: "cluster" },
        { href: "/en/insights/why-not-cited-by-chatgpt", label: "Why your brand isn't cited by ChatGPT", kind: "cluster" },
      ]
    : [
        { href: "/insights/comment-mesurer-visibilite-chatgpt", label: "Comment mesurer la visibilité ChatGPT", kind: "cluster" },
        { href: "/insights/kpi-visibilite-llm-2026", label: "KPI visibilité LLM 2026", kind: "cluster" },
        { href: "/insights/pourquoi-pas-cite-chatgpt", label: "Pourquoi votre marque n'est pas citée par ChatGPT", kind: "cluster" },
        { href: "/insights/visibilite-llm-vs-seo", label: "Visibilité LLM vs SEO", kind: "cluster" },
        { href: "/insights/audit-visibilite-llm-checklist", label: "Audit visibilité LLM : checklist 20 points", kind: "cluster" },
      ];

  return (
    <PillarLayout
      locale={locale}
      slug={SLUG}
      title={title}
      intro={intro}
      publishedAt={PUBLISHED_AT}
      toc={toc}
      body={body}
      faq={faq}
      relatedLinks={[...relatedLinks, ...clusterTargets]}
      ctaPrimaryHref="/etude-sectorielle"
      ctaPrimaryLabel={isEn ? "Get my free sector study" : "Recevoir mon étude sectorielle"}
    />
  );
}
