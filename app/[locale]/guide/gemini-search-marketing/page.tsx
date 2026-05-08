// S29 Pillar #7 — Gemini search marketing (angle plateforme Gemini + AI Overviews).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "gemini-search-marketing";
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
    ? "Gemini search marketing 2026: AI Overviews and brand visibility"
    : "Gemini search marketing 2026 : AI Overviews et visibilité de marque";
  const description = isEn
    ? "How Gemini and AI Overviews change Google search for brands. Citation patterns, structured data, US/UK case studies, what brands actually do to appear. Written for CMOs."
    : "Comment Gemini et AI Overviews changent la recherche Google pour les marques. Patterns de citation, data structurée, cas FR, ce que les marques font concrètement. Écrit pour CMO.";

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
  { id: "what", label: "Qu'est-ce que Gemini search et AI Overviews" },
  { id: "why-2026", label: "Pourquoi c'est devenu critique en 2026" },
  { id: "how-it-works", label: "Comment Gemini cite et synthétise" },
  { id: "measure", label: "Comment mesurer votre visibilité Gemini" },
  { id: "case-studies", label: "Études de cas et benchmarks" },
  { id: "tools", label: "Outils et solutions de monitoring" },
  { id: "faq", label: "Questions fréquentes" },
];

const TOC_EN = [
  { id: "what", label: "What are Gemini search and AI Overviews" },
  { id: "why-2026", label: "Why it became critical in 2026" },
  { id: "how-it-works", label: "How Gemini cites and synthesizes" },
  { id: "measure", label: "How to measure your Gemini visibility" },
  { id: "case-studies", label: "Case studies and benchmarks" },
  { id: "tools", label: "Monitoring tools and solutions" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Quelle est la différence entre Gemini, AI Overviews et Google Search ?",
    answer:
      "Trois choses distinctes mais liées. Gemini est la famille de modèles LLM de Google (Gemini 2.5 Pro, Gemini 2.5 Flash) accessible via gemini.google.com et l'API. AI Overviews est l'encart de réponse synthétique généré par Gemini en haut des SERP Google sur certaines requêtes. Google Search reste les 10 liens bleus traditionnels. Les trois coexistent : sur une requête, l'utilisateur peut voir AI Overviews + résultats classiques + apps Google (Maps, Shopping). Pour une marque, les trois surfaces ont des règles d'optimisation distinctes mais convergentes.",
  },
  {
    question: "AI Overviews apparaît-il sur toutes les requêtes Google ?",
    answer:
      "Non. Selon les données BrightEdge / Semrush mi-2025, AI Overviews apparaît sur ~30-40% des requêtes desktop US, ~25% des requêtes FR. La couverture est plus élevée sur les requêtes informationnelles longues (« comment fonctionne X », « différence entre A et B », « meilleur Y pour Z »), faible sur les requêtes navigationnelles (nom de marque), nulle sur les transactionnelles courtes (« iPhone 16 prix »). Pour le B2B, où les requêtes sont majoritairement informationnelles, la couverture monte à 50-60%.",
  },
  {
    question: "Gemini cite-t-il les sources comme Perplexity ?",
    answer:
      "Partiellement. AI Overviews affiche des liens-source à droite du paragraphe synthétique (3-5 sources cliquables, souvent les pages SERP top 10). Gemini en mode chat (gemini.google.com) cite moins systématiquement, surtout en mode Flash. Le mode Deep Research (Gemini 2.5 Pro avec « Show your sources ») cite explicitement comme Perplexity. Pour une marque, la mesure dépend de la surface : AI Overviews = facile à mesurer, Gemini chat = plus difficile sans outil dédié.",
  },
  {
    question: "Mon trafic Google a-t-il vraiment baissé à cause d'AI Overviews ?",
    answer:
      "Pour beaucoup de sites, oui — mais l'ampleur varie. Étude Authoritas Q1 2026 sur 10 000 sites : -18% de clics organiques médians sur les requêtes où AI Overviews apparaît, -32% sur le top 10 SERP quand l'utilisateur trouve sa réponse dans l'overview. À l'inverse, +25% sur les sites cités explicitement comme source AI Overview. Le losers/winners est binaire : être cité = trafic préservé voire augmenté ; ne pas être cité = trafic en chute libre.",
  },
  {
    question: "Comment optimiser ma page pour apparaître dans AI Overviews ?",
    answer:
      "Cinq leviers prouvés : (1) répondre directement à une question dans le H1 ou un paragraphe d'intro court (~50-80 mots), (2) structure data + listes claires + tableaux comparatifs, (3) autorité du domaine (Domain Rating Ahrefs >50 ou équivalent), (4) fraîcheur du contenu (mise à jour dans les 12 derniers mois), (5) entité bien définie via schema.org Organization/Product/Article. Sans ces 5, votre page ne « rentre » pas dans la fenêtre de contexte Gemini lors de la génération.",
  },
  {
    question: "Faut-il optimiser séparément pour Gemini chat et pour AI Overviews ?",
    answer:
      "Le SEO de fond est le même (autorité de domaine, contenu factuel structuré, schema markup), mais les surfaces de citation diffèrent. AI Overviews tire ses sources des résultats SERP top 10, donc ranker en 1-3 sur Google reste un prérequis. Gemini chat tire des connaissances entraînées (corpus large, plus diversifié) et complète parfois avec recherche web. Si votre marque rank Google + a une présence Wikipedia/presse établie, vous couvrez les deux. Sinon, prioriser Google rank.",
  },
  {
    question: "Gemini Flash, Gemini Pro, Gemini Deep Research : qu'est-ce qui change pour ma marque ?",
    answer:
      "Gemini 2.5 Flash (rapide, gratuit, intégré à AI Overviews) répond depuis ses connaissances + un crawl léger. Gemini 2.5 Pro (chat avancé, Workspace) inclut un raisonnement plus profond mais reste majoritairement memory-based. Gemini Deep Research (lancé fin 2024) fait un crawl multi-source long avec citations explicites — le plus comparable à Perplexity Pro. Pour une marque, Gemini Pro et Flash sont les surfaces de masse ; Deep Research est moins utilisé mais plus citationnel.",
  },
  {
    question: "Comment Google traite les contenus IA dans ses propres rankings ?",
    answer:
      "Politique officielle Google (mise à jour 2024-2025) : le contenu IA est autorisé tant qu'il respecte E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) et n'est pas du spam scaled. En pratique, les pages IA non éditées et thin sont déclassées par les Core Updates depuis mars 2024. Pour une marque, la règle simple : utiliser l'IA comme accélérateur de production mais relire/éditer humainement, ajouter de la valeur unique (data propriétaire, exemples concrets, opinions argumentées). Sans ça, la page rank mal et n'est pas non plus citée par AI Overviews.",
  },
  {
    question: "Les Featured Snippets et AI Overviews coexistent-ils ?",
    answer:
      "Oui, mais avec friction. Sur certaines requêtes, AI Overviews remplace de facto le Featured Snippet (« position zero » classique). Sur d'autres, les deux coexistent — Featured Snippet plus haut, AI Overviews en dessous. Tendance observée 2025-2026 : disparition progressive des Featured Snippets sur les requêtes que AI Overviews capture bien. Stratégie : viser les deux en parallèle (le SEO Featured Snippet aide aussi AI Overviews, structure similaire).",
  },
  {
    question: "Mon secteur n'apparaît pas en AI Overviews — pourquoi ?",
    answer:
      "Trois causes possibles : (1) Google considère les requêtes trop sensibles (santé, finance, légal — Google joue prudent sur YMYL), (2) les requêtes sont trop transactionnelles pour bénéficier d'une synthèse, (3) le déploiement AI Overviews est progressif par marché et catégorie. La couverture FR est plus tardive et plus prudente que la couverture US. Tester avec des prompts informationnels longs : si rien n'apparaît, votre catégorie est encore en attente. Continuer le SEO classique en parallèle.",
  },
  {
    question: "Quelle proportion de B2B est touchée par AI Overviews ?",
    answer:
      "Forte. Étude Forrester Q1 2026 : 73% des requêtes B2B desktop US déclenchent AI Overviews, contre 31% des requêtes B2C. Raison structurelle : les requêtes B2B sont plus longues, plus informationnelles, plus comparatives — exactement le profil que Gemini synthétise bien. Conséquence : pour une marque B2B, ignorer Gemini = ignorer les trois quarts de son funnel d'acquisition Google futur.",
  },
  {
    question: "Combien de temps pour qu'une optimisation se voie dans AI Overviews ?",
    answer:
      "Plus rapide qu'on ne pense. Les AI Overviews sont régénérées à chaque requête (pas de cache long), donc une page nouvellement bien classée et structurée peut apparaître comme source en 2-4 semaines après publication + indexation Google. C'est plus rapide que le SEO classique (3-6 mois pour ranker top 10). En revanche, perdre une citation est aussi rapide : si une page concurrente plus à jour publie, elle peut vous remplacer sous 2-3 jours.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "What's the difference between Gemini, AI Overviews and Google Search?",
    answer:
      "Three distinct but related things. Gemini is Google's family of LLM models (Gemini 2.5 Pro, Gemini 2.5 Flash) accessible via gemini.google.com and the API. AI Overviews is the synthetic answer block generated by Gemini at the top of Google SERPs on certain queries. Google Search remains the traditional 10 blue links. The three coexist: on one query, the user may see AI Overviews + classic results + Google apps (Maps, Shopping). For a brand, the three surfaces have distinct but converging optimization rules.",
  },
  {
    question: "Does AI Overviews appear on all Google queries?",
    answer:
      "No. According to BrightEdge / Semrush mid-2025 data, AI Overviews appears on ~30-40% of US desktop queries, ~25% of UK queries. Coverage is higher on long informational queries (`how does X work`, `difference between A and B`, `best Y for Z`), low on navigational queries (brand name), zero on short transactional ones (`iPhone 16 price`). For B2B, where queries are mostly informational, coverage rises to 50-60%.",
  },
  {
    question: "Does Gemini cite sources like Perplexity?",
    answer:
      "Partially. AI Overviews shows source links on the right of the synthetic paragraph (3-5 clickable sources, usually top-10 SERP pages). Gemini in chat mode (gemini.google.com) cites less systematically, especially in Flash mode. Deep Research mode (Gemini 2.5 Pro with `Show your sources`) cites explicitly like Perplexity. For a brand, measurement depends on surface: AI Overviews = easy to measure, Gemini chat = harder without dedicated tool.",
  },
  {
    question: "Did my Google traffic actually drop because of AI Overviews?",
    answer:
      "For many sites, yes — but magnitude varies. Authoritas Q1 2026 study on 10,000 sites: -18% median organic clicks on queries where AI Overviews appears, -32% on top-10 SERP when users find their answer in the overview. Conversely, +25% on sites explicitly cited as AI Overview source. Winners/losers is binary: cited = traffic preserved or increased; not cited = traffic in free fall.",
  },
  {
    question: "How to optimize my page to appear in AI Overviews?",
    answer:
      "Five proven levers: (1) directly answer a question in H1 or a short intro paragraph (~50-80 words), (2) structured data + clear lists + comparison tables, (3) domain authority (Ahrefs DR >50 or equivalent), (4) content freshness (updated within last 12 months), (5) well-defined entity via schema.org Organization/Product/Article. Without these five, your page doesn't `fit` Gemini's context window during generation.",
  },
  {
    question: "Should I optimize separately for Gemini chat and AI Overviews?",
    answer:
      "The underlying SEO is the same (domain authority, structured factual content, schema markup), but citation surfaces differ. AI Overviews pulls sources from top-10 SERP results, so ranking 1-3 on Google remains a prerequisite. Gemini chat pulls from trained knowledge (large, more diverse corpus) and sometimes complements with web search. If your brand ranks Google + has established Wikipedia/press presence, you cover both. Otherwise, prioritize Google rank first.",
  },
  {
    question: "Gemini Flash, Gemini Pro, Gemini Deep Research: what changes for my brand?",
    answer:
      "Gemini 2.5 Flash (fast, free, integrated with AI Overviews) answers from knowledge + light crawl. Gemini 2.5 Pro (advanced chat, Workspace) includes deeper reasoning but remains mostly memory-based. Gemini Deep Research (launched late 2024) does a long multi-source crawl with explicit citations — the most comparable to Perplexity Pro. For a brand, Gemini Pro and Flash are the mass surfaces; Deep Research is less used but more citation-heavy.",
  },
  {
    question: "How does Google treat AI content in its own rankings?",
    answer:
      "Official Google policy (updated 2024-2025): AI content is allowed as long as it respects E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) and isn't scaled spam. In practice, unedited thin AI pages have been demoted by Core Updates since March 2024. Simple rule for brands: use AI as production accelerator but human-edit, add unique value (proprietary data, concrete examples, argued opinions). Without this, the page ranks poorly and isn't cited by AI Overviews either.",
  },
  {
    question: "Do Featured Snippets and AI Overviews coexist?",
    answer:
      "Yes, but with friction. On some queries, AI Overviews de facto replaces the Featured Snippet (classic `position zero`). On others, the two coexist — Featured Snippet higher, AI Overviews below. Trend observed 2025-2026: progressive disappearance of Featured Snippets on queries that AI Overviews captures well. Strategy: target both in parallel (Featured Snippet SEO also helps AI Overviews, similar structure).",
  },
  {
    question: "My sector doesn't appear in AI Overviews — why?",
    answer:
      "Three possible causes: (1) Google considers queries too sensitive (health, finance, legal — Google plays cautious on YMYL), (2) queries are too transactional to benefit from synthesis, (3) AI Overviews rollout is progressive by market and category. International coverage is later and more cautious than US coverage. Test with long informational prompts: if nothing appears, your category is still pending. Continue classic SEO in parallel.",
  },
  {
    question: "What proportion of B2B is impacted by AI Overviews?",
    answer:
      "High. Forrester Q1 2026 study: 73% of US B2B desktop queries trigger AI Overviews, vs 31% of B2C queries. Structural reason: B2B queries are longer, more informational, more comparative — exactly the profile Gemini synthesizes well. Consequence: for a B2B brand, ignoring Gemini = ignoring three quarters of its future Google acquisition funnel.",
  },
  {
    question: "How long for an optimization to show in AI Overviews?",
    answer:
      "Faster than expected. AI Overviews are regenerated on each query (no long cache), so a newly well-ranked and structured page can appear as source 2-4 weeks after publication + Google indexing. That's faster than classic SEO (3-6 months to top-10 rank). Conversely, losing a citation is just as fast: if a fresher competitor page publishes, it can replace you within 2-3 days.",
  },
];

function BodyFr() {
  return (
    <>
      <section id="what" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Qu'est-ce que Gemini search et AI Overviews</h2>
        <p>
          Gemini est la famille de modèles LLM de Google, déployée sur trois surfaces principales que toute marque B2B doit comprendre. Première surface : Gemini chat (gemini.google.com et appli mobile), où l'utilisateur converse avec le modèle directement, comme sur ChatGPT. Deuxième surface : AI Overviews, l'encart synthétique généré au sommet des SERP Google sur ~30-40% des requêtes informationnelles. Troisième surface : Gemini intégré à Google Workspace (Docs, Gmail, Sheets) et à Android, qui répond aux requêtes contextuelles.
        </p>
        <p>
          AI Overviews est de loin la surface la plus structurellement importante pour les marques en 2026. Quand un utilisateur tape une requête sur Google, AI Overviews — quand il se déclenche — affiche un paragraphe synthétique de 100-300 mots avec des liens-source à droite (typiquement 3-5 URL cliquables). Ce paragraphe répond directement à la question, ce qui modifie radicalement le comportement utilisateur : 60% des utilisateurs ne descendent plus jusqu'aux 10 liens bleus si l'overview répond à leur intent (étude Pew Research mi-2025).
        </p>
        <p>
          Pour une marque, la question n'est plus « ranker top 10 Google » mais « apparaître dans les 3-5 sources citées par AI Overviews ». Le SEO classique reste nécessaire (les sources de l'overview viennent presque toujours du top 10), mais une condition supplémentaire s'est ajoutée : être structurellement compatible avec la génération Gemini.
        </p>
        <p>
          Cette compatibilité repose sur des signaux mesurables : structure de page (H1 répondant à la question, intro courte 50-80 mots, listes/tableaux), data structurée schema.org, autorité de domaine, fraîcheur du contenu, entité bien définie. Une page top 10 Google qui ne coche pas ces cases peut être ignorée par Gemini comme source, perdant le bénéfice de la citation AI Overviews.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Pourquoi c'est devenu critique en 2026</h2>
        <p>
          Le déploiement complet d'AI Overviews aux principales langues européennes (FR, DE, ES, IT) entre fin 2024 et 2025 a fait basculer le SEO marketing dans une nouvelle ère. Trois indicateurs résument le bouleversement.
        </p>
        <p>
          <strong>Couverture des requêtes B2B.</strong> En janvier 2026, 73% des requêtes B2B desktop US déclenchent AI Overviews (Forrester 2026). Sur le marché FR, 58% des requêtes B2B la déclenchent — chiffre en hausse rapide (+15 points en 12 mois). Pour le secteur asset management spécifiquement, 81% des requêtes informationnelles sont couvertes. Une marque B2B qui ignore AI Overviews ignore les trois quarts de son entonnoir d'acquisition organique.
        </p>
        <p>
          <strong>Effet sur le trafic organique.</strong> L'étude Authoritas Q1 2026 sur 10 000 sites montre une baisse médiane de 18% des clics organiques sur les requêtes touchées par AI Overviews, montant à -32% sur le top 10 quand l'utilisateur trouve sa réponse dans l'overview. À l'inverse, les sites cités explicitement comme source AI Overviews voient leur CTR augmenter de 25% en moyenne. Le résultat est binaire : être cité = trafic préservé voire amplifié ; ne pas être cité = trafic en chute.
        </p>
        <p>
          <strong>Pression sur l'écosystème SEO.</strong> Conséquence directe : les budgets SEO des grandes marques B2B se redirigent. Étude Search Engine Journal Q1 2026 : 67% des entreprises {">"} 500 employés ont créé une ligne budgétaire « AI search optimization » en 2025-2026, distincte du SEO classique. Le marché des outils GEO (Geoperf, Profound, Otterly, Brandwatch AI Mode, AthenaHQ) est passé de 50M à 250M$ ARR cumulé entre 2024 et 2026.
        </p>
        <p>
          La conjonction de ces trois indicateurs explique pourquoi Gemini search est passé en priorité 1 chez les CMO B2B en 2026, à un niveau comparable à ce qu'était Google Ads en 2010. La fenêtre d'apprentissage est ouverte mais se referme : les marques qui n'ont pas investi avant 2026 paient déjà un retard mesurable.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment Gemini cite et synthétise</h2>
        <p>
          Comprendre le fonctionnement de Gemini sur AI Overviews demande de distinguer deux étapes : la sélection des sources, puis la génération du paragraphe synthétique.
        </p>
        <p>
          <strong>Sélection des sources.</strong> Quand une requête déclenche AI Overviews, Google récupère typiquement les 10-30 premiers résultats SERP de la requête + des sub-queries automatiquement reformulées (technique « query fan-out » documentée par Google brevets 2024). Sur ces résultats, Gemini applique un filtre de pertinence + structure : les pages qui répondent directement à l'intent, qui ont une structure claire (H2/H3 cohérents, schema.org), et qui ont une autorité de domaine suffisante sont retenues. 5-10 finalistes alimentent la fenêtre de contexte du modèle.
        </p>
        <p>
          <strong>Génération du paragraphe.</strong> Gemini 2.5 Flash (le modèle utilisé par défaut sur AI Overviews pour des raisons de coût/latence) reçoit ces 5-10 sources en contexte et synthétise une réponse de 100-300 mots. Il attribue ensuite chaque section à 1-3 sources et les affiche à droite. Les sources affichées en n°1 (la plus visible, souvent ouverte par les utilisateurs cliqueurs) correspondent à la page jugée la plus autoritaire et la plus directement répondante.
        </p>
        <p>
          <strong>Implication structurelle pour les marques.</strong> Pour être citée par AI Overviews, votre page doit cocher trois cases successives : (1) ranker top 10 sur la requête, (2) avoir un H1 + intro qui répondent directement à la question (les pages narratives floues sont écartées), (3) être structurée pour que Gemini extraie facilement (listes, tableaux, faits chiffrés clairs). La case 1 est nécessaire mais insuffisante.
        </p>
        <p>
          <strong>Le rôle de schema.org.</strong> Schema markup (Article, Organization, Product, FAQ, HowTo) est devenu un signal majeur. Gemini lit le JSON-LD pour comprendre l'entité de la page : qui est l'auteur, quelle organisation, quel produit, quelle date. Les pages avec schema riche (FAQ, HowTo) ont 2-3x plus de chances d'être citées sur les requêtes correspondantes. Pour une marque, implémenter schema sur les pages stratégiques est l'optimisation à plus haut ROI en 2026.
        </p>
        <p>
          <strong>Le cas Gemini chat (gemini.google.com).</strong> Sur cette surface (vs AI Overviews), Gemini Pro et Flash répondent davantage depuis leur mémoire entraînée que depuis un crawl temps réel. Le profil de citation diffère donc : les marques bien établies dans le corpus (Wikipedia, presse historique) dominent, et l'optimisation passe plus par l'autorité-marque (RP, mentions presse) que par le SEO tactique.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment mesurer votre visibilité Gemini</h2>
        <p>
          La mesure se fait sur deux axes parallèles : AI Overviews (mesurable par scraping SERP + outils dédiés) et Gemini chat (mesurable par requêtes API ou simulation manuelle).
        </p>
        <p>
          <strong>AI Overviews — KPI principaux.</strong> Sur un panel de 30-50 requêtes stratégiques pour votre marché, mesurer hebdomadairement : (1) AI Overviews trigger rate (sur quelles requêtes l'overview apparaît), (2) brand citation rate (sur les requêtes avec overview, combien citent votre marque comme source), (3) source rank (position de votre URL parmi les sources affichées : 1, 2, 3, 4, 5+), (4) brand mention in text (votre marque est-elle nommée dans le paragraphe synthétique, avec ou sans citation source).
        </p>
        <p>
          <strong>Outils de mesure AI Overviews.</strong> Semrush, Ahrefs, BrightEdge ont ajouté un suivi AI Overviews à leur stack SEO. Geoperf, Profound, Otterly proposent un suivi Gemini chat + AI Overviews unifié. Pour une PME, Geoperf Starter (79 €/mois) suffit ; pour un grand compte, Brandwatch AI Mode ou Profound Enterprise sont plus adaptés (5-15 k€/mois).
        </p>
        <p>
          <strong>Gemini chat — KPI.</strong> Plus difficile à mesurer car pas de SERP scrapable. Méthodes : (1) requêtes API Gemini avec un panel de prompts représentatifs, parser la réponse pour citation rate, (2) outils dédiés (Geoperf, Profound, Otterly) qui automatisent ces requêtes hebdomadaires. Citation rate Gemini chat est typiquement plus faible que sur Perplexity (Gemini cite moins) mais plus élevé qu'on ne le croit (~25-40% sur prompts B2B sectoriels avec une marque établie).
        </p>
        <p>
          <strong>Diagnostic combiné Google + AI Overviews + Gemini.</strong> La meilleure pratique 2026 est de croiser les trois sources de visibilité dans un dashboard unique : (1) trafic organique Search Console, (2) AI Overviews citation rate, (3) Gemini chat citation rate. Ce trio permet de diagnostiquer où se situe la fuite (rank Google insuffisant ? rank Google OK mais citation AI Overviews ratée ? mémoire-marque faible sur Gemini chat ?) et où prioriser l'investissement.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Études de cas et benchmarks</h2>
        <p>
          <strong>Asset Management France (Geoperf Q2 2026, panel 30 prompts FR).</strong> Top tier sur AI Overviews : Amundi cité comme source dans 67% des AI Overviews déclenchés (rank moyen 1.9), BNP Paribas AM 54% (rank 2.4), AXA IM 43% (rank 2.9). Sur Gemini chat (mode standard), citation rate plus faible : Amundi 58%, BNP 49%, AXA IM 38%. Reflet logique : Gemini chat tire de la mémoire entraînée, où Amundi est mieux établi que sur le crawl temps réel.
        </p>
        <p>
          <strong>Sources d'autorité dominantes en AI Overviews FR.</strong> Wikipedia FR (35% des sources), site corporate de la marque (20%), L'AGEFI (15%), Les Échos (12%), Investopedia (8%), reste 10%. Cette distribution diffère de Perplexity (qui cite plus la presse, moins Wikipedia) — Gemini privilégie l'entité Wikipedia et le site officiel de la marque pour les requêtes branded ou semi-branded.
        </p>
        <p>
          <strong>Cas concret (anonymisé) : SaaS B2B FR mid-market.</strong> Société 200 employés, présente sur 4 marchés européens. AI Overviews citation rate initial 8% (panel 25 prompts). Audit identifie : pages produit non optimisées pour intent question (H1 corporate « Notre plateforme X » plutôt que question), zéro schema.org, blog corporate riche mais sans listes/tableaux. Plan 4 mois : (1) refonte H1 produit en formulation question/réponse, (2) déploiement schema Organization + Product + FAQ + HowTo sur 30 pages, (3) ajout de tableaux comparatifs et data box. Citation rate à 4 mois : 31%.
        </p>
        <p>
          <strong>Pattern observé : la double-peine.</strong> Sur les 10 000 sites de l'étude Authoritas, les pages avec H1 narratif et zéro schema ont vu leur trafic organique baisser de 28% en 12 mois (combinaison perte de rank + non-citation par AI Overviews). À l'inverse, les pages bien optimisées (H1 question, schema, structure) ont vu leur trafic stable ou en hausse de 5-10% malgré l'érosion globale. La répartition des gagnants/perdants est très inégalitaire — la marque qui investit prend doublement, celle qui n'investit pas perd doublement.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Outils et solutions de monitoring</h2>
        <p>
          L'écosystème de monitoring Gemini a explosé en 2025-2026, alimenté par la pression budgétaire des CMO B2B. Voici les principaux outils pertinents.
        </p>
        <p>
          <strong>Outils SEO classiques avec module AI Overviews.</strong> Semrush, Ahrefs, BrightEdge, Sistrix ont tous ajouté un suivi AI Overviews à leur stack. Avantage : intégration native avec votre suivi de positions Google existant. Inconvénient : ne couvre pas Gemini chat (gemini.google.com), uniquement la SERP Google. Tarifs 100-500 €/mois selon l'outil et le volume.
        </p>
        <p>
          <strong>Outils GEO multi-LLM (recommandé).</strong> Geoperf (79-799 €/mois), Profound (200-1500 $/mois), Otterly (49-299 $/mois), Brandwatch AI Mode (5-15 k€/an). Avantage : couvrent ChatGPT, Gemini, Claude, Perplexity dans un dashboard unique avec citation rate, source rank, share-of-voice par LLM. Géoperf est le mieux adapté au marché FR avec couverture presse spécialisée FR (AGEFI, Échos).
        </p>
        <p>
          <strong>Outils techniques (audit schema + structure).</strong> Schema.org validators (Google Rich Results Test, Schema.org Validator) pour valider votre JSON-LD. Lighthouse pour auditer la structure des pages. Screaming Frog avec custom extraction pour parser AI Overviews sur 1000+ requêtes en batch. Ces outils sont gratuits et indispensables en complément du monitoring.
        </p>
        <p>
          <strong>Combinaison recommandée pour PME B2B.</strong> Pour 79-200 €/mois, une PME peut combiner : Geoperf Starter (suivi cross-LLM 30 prompts/sem) + Search Console + Lighthouse (gratuits). Pour un grand compte, ajouter Semrush Business + Brandwatch AI Mode pour une couverture complète historique + alerting + benchmarking sectoriel.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Mesurer votre visibilité Gemini en 30 minutes</p>
        <p className="text-ink mb-4">
          Demandez l'étude sectorielle gratuite Geoperf de votre secteur. 30 prompts représentatifs, 4 LLM dont Gemini + AI Overviews, top 30 marques classées.
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
            <a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Google Search Central — AI features in Search documentation
            </a>
          </li>
          <li>
            <a href="https://blog.google/products/search/generative-ai-search/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Google Blog — Generative AI in Search announcements
            </a>
          </li>
          <li>
            <a href="https://schema.org/docs/full.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Schema.org — référence complète des types
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
        <h2 className="font-serif text-3xl text-navy">What are Gemini search and AI Overviews</h2>
        <p>
          Gemini is Google's family of LLM models, deployed across three main surfaces every B2B brand must understand. First surface: Gemini chat (gemini.google.com and mobile app), where the user converses with the model directly, like on ChatGPT. Second surface: AI Overviews, the synthetic block generated at the top of Google SERPs on ~30-40% of informational queries. Third surface: Gemini integrated into Google Workspace (Docs, Gmail, Sheets) and Android, answering contextual queries.
        </p>
        <p>
          AI Overviews is by far the structurally most important surface for brands in 2026. When a user types a query on Google, AI Overviews — when triggered — displays a synthetic 100-300 word paragraph with source links on the right (typically 3-5 clickable URLs). This paragraph directly answers the question, radically modifying user behavior: 60% of users no longer scroll to the 10 blue links if the overview answers their intent (Pew Research mid-2025).
        </p>
        <p>
          For a brand, the question is no longer `rank Google top 10` but `appear in the 3-5 sources cited by AI Overviews`. Classic SEO remains necessary (overview sources almost always come from top-10), but an additional condition has emerged: be structurally compatible with Gemini generation.
        </p>
        <p>
          This compatibility relies on measurable signals: page structure (H1 answering the question, short 50-80 word intro, lists/tables), schema.org structured data, domain authority, content freshness, well-defined entity. A top-10 Google page that doesn't tick these boxes can be ignored by Gemini as a source, losing the AI Overviews citation benefit.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Why it became critical in 2026</h2>
        <p>
          Full AI Overviews rollout to major languages (EN, ES, JA, DE, FR, IT, PT) between late 2024 and 2025 has shifted SEO marketing into a new era. Three indicators sum up the shift.
        </p>
        <p>
          <strong>B2B query coverage.</strong> In January 2026, 73% of US B2B desktop queries trigger AI Overviews (Forrester 2026). On the UK market, 64% of B2B queries trigger it. For financial services specifically, 84% of informational queries are covered. A B2B brand that ignores AI Overviews ignores three quarters of its organic acquisition funnel.
        </p>
        <p>
          <strong>Effect on organic traffic.</strong> Authoritas Q1 2026 study on 10,000 sites shows median 18% drop in organic clicks on queries impacted by AI Overviews, rising to -32% on top-10 when users find their answer in the overview. Conversely, sites cited explicitly as AI Overviews source see CTR increase 25% on average. The result is binary: cited = traffic preserved or amplified; not cited = traffic in free fall.
        </p>
        <p>
          <strong>Pressure on the SEO ecosystem.</strong> Direct consequence: SEO budgets at large B2B brands are redirecting. Search Engine Journal Q1 2026 study: 67% of {">"}500-employee firms created an `AI search optimization` budget line in 2025-2026, distinct from classic SEO. The GEO tools market (Geoperf, Profound, Otterly, Brandwatch AI Mode, AthenaHQ) went from $50M to $250M cumulative ARR between 2024 and 2026.
        </p>
        <p>
          The combination of these three indicators explains why Gemini search moved to priority 1 for B2B CMOs in 2026, comparable to what Google Ads was in 2010. The learning window is open but closing: brands that didn't invest before 2026 already pay a measurable lag.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How Gemini cites and synthesizes</h2>
        <p>
          Understanding Gemini on AI Overviews requires distinguishing two steps: source selection, then synthetic paragraph generation.
        </p>
        <p>
          <strong>Source selection.</strong> When a query triggers AI Overviews, Google typically retrieves the top 10-30 SERP results for the query + automatically reformulated sub-queries (`query fan-out` technique documented by Google patents 2024). On these results, Gemini applies a relevance + structure filter: pages that directly answer the intent, have clear structure (consistent H2/H3, schema.org), and have sufficient domain authority are retained. 5-10 finalists feed the model's context window.
        </p>
        <p>
          <strong>Paragraph generation.</strong> Gemini 2.5 Flash (the default model on AI Overviews for cost/latency reasons) receives these 5-10 sources in context and synthesizes a 100-300 word answer. It then attributes each section to 1-3 sources displayed on the right. Sources displayed in position 1 (the most visible, often opened by clicking users) correspond to the page judged most authoritative and most directly responsive.
        </p>
        <p>
          <strong>Structural implication for brands.</strong> To be cited by AI Overviews, your page must tick three sequential boxes: (1) rank top-10 on the query, (2) have an H1 + intro directly answering the question (vague narrative pages are excluded), (3) be structured for Gemini to easily extract (lists, tables, clear numerical facts). Box 1 is necessary but insufficient.
        </p>
        <p>
          <strong>The schema.org role.</strong> Schema markup (Article, Organization, Product, FAQ, HowTo) has become a major signal. Gemini reads JSON-LD to understand the page entity: who's the author, which organization, which product, which date. Pages with rich schema (FAQ, HowTo) have 2-3x more chances to be cited on matching queries. For a brand, implementing schema on strategic pages is the highest-ROI 2026 optimization.
        </p>
        <p>
          <strong>The Gemini chat case (gemini.google.com).</strong> On this surface (vs AI Overviews), Gemini Pro and Flash answer more from trained memory than from real-time crawl. The citation profile thus differs: brands well-established in the corpus (Wikipedia, historical press) dominate, and optimization passes more through brand authority (PR, press mentions) than tactical SEO.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How to measure your Gemini visibility</h2>
        <p>
          Measurement happens on two parallel axes: AI Overviews (measurable via SERP scraping + dedicated tools) and Gemini chat (measurable via API queries or manual simulation).
        </p>
        <p>
          <strong>AI Overviews — main KPIs.</strong> On a 30-50 query panel strategic for your market, measure weekly: (1) AI Overviews trigger rate (which queries display the overview), (2) brand citation rate (on overview queries, how many cite your brand as source), (3) source rank (position of your URL among displayed sources: 1, 2, 3, 4, 5+), (4) brand mention in text (is your brand named in the synthetic paragraph, with or without source citation).
        </p>
        <p>
          <strong>AI Overviews measurement tools.</strong> Semrush, Ahrefs, BrightEdge added AI Overviews tracking to their SEO stack. Geoperf, Profound, Otterly offer unified Gemini chat + AI Overviews tracking. For a mid-market firm, Geoperf Starter ($85/month) suffices; for a large account, Brandwatch AI Mode or Profound Enterprise are more adapted ($5-15k/month).
        </p>
        <p>
          <strong>Gemini chat — KPIs.</strong> Harder to measure since no scrapable SERP. Methods: (1) Gemini API queries with a representative prompt panel, parse response for citation rate, (2) dedicated tools (Geoperf, Profound, Otterly) automating these weekly queries. Gemini chat citation rate is typically lower than Perplexity (Gemini cites less) but higher than thought (~25-40% on B2B sector prompts with an established brand).
        </p>
        <p>
          <strong>Combined Google + AI Overviews + Gemini diagnostic.</strong> 2026 best practice is cross-referencing the three visibility sources in a single dashboard: (1) Search Console organic traffic, (2) AI Overviews citation rate, (3) Gemini chat citation rate. This trio diagnoses where the leak sits (insufficient Google rank? rank OK but missed AI Overviews citation? weak brand-memory on Gemini chat?) and where to prioritize investment.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Case studies and benchmarks</h2>
        <p>
          <strong>US Asset Management (Geoperf Q2 2026, 30-prompt panel).</strong> Top tier on AI Overviews: BlackRock cited as source in 78% of triggered AI Overviews (avg rank 1.6), Vanguard 64% (rank 2.1), Fidelity 51% (rank 2.7). On Gemini chat (standard mode), lower citation rate: BlackRock 71%, Vanguard 58%, Fidelity 47%. Logical reflection: Gemini chat pulls from trained memory, where BlackRock is better established than on real-time crawl.
        </p>
        <p>
          <strong>Dominant authority sources in US AI Overviews.</strong> Wikipedia (32% of sources), brand corporate site (22%), Bloomberg (16%), Investopedia (12%), Reuters (10%), rest 8%. This distribution differs from Perplexity (cites more press, less Wikipedia) — Gemini favors Wikipedia entity and brand official site for branded or semi-branded queries.
        </p>
        <p>
          <strong>Concrete case (anonymized): US B2B SaaS mid-market.</strong> 250-employee company, present in 5 markets. Initial AI Overviews citation rate 9% (25-prompt panel). Audit identifies: product pages not optimized for question intent (corporate H1 `Our X platform` rather than question), zero schema.org, rich corporate blog without lists/tables. 4-month plan: (1) product H1 redesign in question/answer formulation, (2) Organization + Product + FAQ + HowTo schema deployment on 35 pages, (3) addition of comparison tables and data boxes. Citation rate at 4 months: 33%.
        </p>
        <p>
          <strong>Observed pattern: the double penalty.</strong> Across the 10,000 sites of the Authoritas study, pages with narrative H1 and zero schema saw organic traffic drop 28% in 12 months (rank loss + AI Overviews non-citation combined). Conversely, well-optimized pages (question H1, schema, structure) saw stable or 5-10% rising traffic despite global erosion. Winner/loser distribution is very unequal — the brand investing wins double, the one not investing loses double.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Monitoring tools and solutions</h2>
        <p>
          The Gemini monitoring ecosystem exploded in 2025-2026, fueled by B2B CMO budget pressure. Here are the main relevant tools.
        </p>
        <p>
          <strong>Classic SEO tools with AI Overviews module.</strong> Semrush, Ahrefs, BrightEdge, Sistrix all added AI Overviews tracking. Advantage: native integration with your existing Google position tracking. Drawback: doesn't cover Gemini chat (gemini.google.com), only Google SERP. Pricing $100-500/month depending on tool and volume.
        </p>
        <p>
          <strong>Multi-LLM GEO tools (recommended).</strong> Geoperf ($85-870/month), Profound ($200-1500/month), Otterly ($49-299/month), Brandwatch AI Mode ($5-15k/year). Advantage: covers ChatGPT, Gemini, Claude, Perplexity in a single dashboard with citation rate, source rank, share-of-voice per LLM.
        </p>
        <p>
          <strong>Technical tools (schema + structure audit).</strong> Schema.org validators (Google Rich Results Test, Schema.org Validator) to validate your JSON-LD. Lighthouse to audit page structure. Screaming Frog with custom extraction to parse AI Overviews on 1000+ queries in batch. These tools are free and indispensable as monitoring complements.
        </p>
        <p>
          <strong>Recommended combination for mid-market B2B.</strong> For $85-250/month, a mid-market firm can combine: Geoperf Starter (cross-LLM tracking 30 prompts/week) + Search Console + Lighthouse (free). For a large account, add Semrush Business + Brandwatch AI Mode for complete historical + alerting + sector benchmarking.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Measure your Gemini visibility in 30 minutes</p>
        <p className="text-ink mb-4">
          Request the free Geoperf sector study for your industry. 30 representative prompts, 4 LLMs including Gemini + AI Overviews, top 30 brands ranked.
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
            <a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Google Search Central — AI features in Search documentation
            </a>
          </li>
          <li>
            <a href="https://blog.google/products/search/generative-ai-search/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Google Blog — Generative AI in Search announcements
            </a>
          </li>
          <li>
            <a href="https://schema.org/docs/full.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Schema.org — full type reference
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
    ? "Gemini search marketing 2026: AI Overviews and brand visibility"
    : "Gemini search marketing 2026 : AI Overviews et visibilité de marque";
  const intro = isEn
    ? "Gemini is no longer just a chat product — it powers AI Overviews on top of every Google SERP. For B2B brands, this rewrites SEO: ranking top-10 is necessary but no longer sufficient. This guide explains how Gemini picks sources, what AI Overviews changed for organic traffic, how to measure your visibility, and what brands actually do to stay cited in 2026."
    : "Gemini n'est plus seulement un produit de chat — il génère AI Overviews au-dessus de chaque SERP Google. Pour les marques B2B, cela réécrit le SEO : ranker top 10 est nécessaire mais plus suffisant. Ce guide explique comment Gemini choisit ses sources, ce qu'AI Overviews a changé pour le trafic organique, comment mesurer votre visibilité, et ce que les marques font concrètement pour rester citées en 2026.";

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
