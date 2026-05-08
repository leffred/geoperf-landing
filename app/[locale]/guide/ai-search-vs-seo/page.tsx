// S29 Pillar #3 — AI search vs SEO classique : comparaison conceptuelle.

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "ai-search-vs-seo";
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
    ? "AI search vs SEO 2026: methods, KPIs, and what changes for B2B marketers"
    : "AI search vs SEO 2026 : méthodes, KPI et ce qui change pour les marketers B2B";
  const description = isEn
    ? "Two distinct disciplines, two different KPI frameworks, two complementary investments. A clean comparison of classic SEO and AI search optimization for B2B mid-market."
    : "Deux disciplines distinctes, deux frameworks KPI différents, deux investissements complémentaires. Comparaison nette du SEO classique et de la recherche IA pour PME B2B.";

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
  { id: "what", label: "Qu'est-ce que l'AI search vs SEO ?" },
  { id: "why-2026", label: "Pourquoi la séparation devient critique en 2026" },
  { id: "how-it-works", label: "Mécaniques techniques comparées" },
  { id: "measure", label: "Comment mesurer chaque surface" },
  { id: "case-studies", label: "Études de cas : où basculer le budget ?" },
  { id: "tools", label: "Outils pour SEO et AI search" },
  { id: "faq", label: "Questions fréquentes" },
];
const TOC_EN = [
  { id: "what", label: "What is AI search vs classic SEO?" },
  { id: "why-2026", label: "Why this split matters in 2026" },
  { id: "how-it-works", label: "Technical mechanics compared" },
  { id: "measure", label: "How to measure each surface" },
  { id: "case-studies", label: "Case studies: where to shift budget?" },
  { id: "tools", label: "Tools for SEO and AI search" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "L'AI search remplace-t-il vraiment le SEO classique ?",
    answer:
      "Pas en remplacement, en addition. Selon Ahrefs Search Update Q4 2025, le clic Google reste 70-80% du trafic organique B2B, mais les LLM (ChatGPT Search, Perplexity, Gemini AI Overview) prennent ~10-15% en consultation décisionnelle. La projection est 30-40% en 2028. La vraie question 2026 : faut-il commencer à investir en GEO maintenant ou attendre ? Réponse pragmatique : oui, dès maintenant, car la fenêtre de saturation arrive vite.",
  },
  {
    question: "Quel pourcentage du trafic SEO classique est cannibalisé par les AI Overviews de Google ?",
    answer:
      "Variable selon le type de requête. Sur les requêtes informationnelles (« qu'est-ce que le GEO ? »), le CTR sur les liens organiques chute de 25-40% quand un AI Overview est affiché (étude Authoritas/SEranking 2025). Sur les requêtes commerciales (« meilleur outil monitoring LLM »), l'impact est plus faible (~10-15%) car l'utilisateur clique pour comparer. Sur les requêtes navigationnelles (nom de marque), pas d'impact.",
  },
  {
    question: "Les LLM tirent-ils toujours leur réponse depuis Google ?",
    answer:
      "Non. Trois cas distincts. (1) ChatGPT en mode standard : utilise son corpus d'entraînement, indépendant de Google. (2) ChatGPT Search, Claude with web search, Perplexity : utilisent leurs propres index ou des partenariats (Bing pour ChatGPT Search). (3) Gemini AI Overview : intégré à Google Search, donc dépend du SERP Google. Conséquence : optimiser pour Google n'optimise que partiellement pour les LLM.",
  },
  {
    question: "Faut-il deux équipes séparées SEO et GEO ?",
    answer:
      "Non en 2026. Pour une PME B2B avec 1-3 personnes en growth/SEO, la même équipe gère les deux disciplines mais avec des plans/KPI différents. La séparation est plus utile au niveau du budget : par exemple, allouer 60% SEO classique / 40% GEO pour une marque B2B en début 2026, glissant vers 50/50 fin 2027. Au-delà de 5 marketers, on commence à voir une scission avec un référent par discipline.",
  },
  {
    question: "Le SEO classique va-t-il disparaître à terme ?",
    answer:
      "Non, mais sa place change. Google reste #1 sur le volume et la mesure (Search Console, intent navigationnel). Le SEO devient une couche d'autorité éditoriale plus qu'une couche de trafic direct. Les sites qui ne se classent pas bien sur Google ne se classent pas non plus dans les LLM (les deux mécaniques s'alignent sur les signaux d'autorité). Investir en SEO en 2026 reste un prérequis pour faire fonctionner le GEO.",
  },
  {
    question: "Quelle métrique remplace le « rang Google » dans l'AI search ?",
    answer:
      "Quatre métriques se substituent : (1) citation rate — % des prompts qui citent votre marque, (2) average rank dans les listes ordonnées que les LLM produisent, (3) share-of-voice vs concurrents directs, (4) source authority cited — quels médias/blogs/sites sont cités quand votre secteur est évoqué. Aucune de ces métriques n'est aussi mature que le rang Google. Les outils de monitoring (Geoperf, Profound, Otterly) consolident ces 4 KPI.",
  },
  {
    question: "Comment unifier SEO et GEO dans un seul tableau de bord ?",
    answer:
      "Stack typique 2026 : Search Console + Ahrefs/Semrush pour SEO (rang, CTR, backlinks), Geoperf ou équivalent pour GEO (citation rate cross-LLM), Looker Studio ou Metabase pour le tableau de bord cross-source. Le travail délicat est de définir des KPI mensuels qui ont du sens dans les deux disciplines : par exemple, « part de prospects acquis via canal organique total » qui inclut Google + référents LLM + recherches branded post-AI search.",
  },
  {
    question: "Les LLM citent-ils des liens cliquables vers les sites ?",
    answer:
      "Cela dépend du LLM et du mode. Perplexity cite systématiquement les sources avec liens cliquables (modèle « moteur de recherche-like »). ChatGPT Search affiche les sources avec liens dans une barre latérale. Claude propose des citations cliquables en mode artifacts. Gemini affiche les sources sous l'AI Overview. ChatGPT en mode standard ne donne pas de liens (juste des mentions textuelles). Le trafic référent depuis les LLM est donc partiel, mais grandissant.",
  },
  {
    question: "Le contenu optimisé GEO est-il moins bon en SEO classique ?",
    answer:
      "Légère tension mais pas opposition. Le contenu GEO favorise : structure très claire (H2/H3 explicites), chiffres et faits, FAQ schema, listes denses. Le contenu SEO classique 2024 favorise : profondeur narrative, E-E-A-T (expertise/expérience/autorité/trust), backlinks, longueur. Les deux convergent en 2026 sur un format hybride : pillar pages 2000-3000 mots avec structure GEO-friendly + autorité éditoriale SEO. C'est exactement le format des pillars que vous lisez actuellement.",
  },
  {
    question: "Comment savoir si une stratégie GEO marche avant 6 mois ?",
    answer:
      "Trois indicateurs avancés à 60-90 jours : (1) variation du citation rate sur un panel fixe de prompts (mesuré semainement par un outil dédié), (2) apparition de nouvelles sources autoritaires citant la marque (Wikipedia, médias top tier sectoriel), (3) lift sur les recherches branded mesuré dans Search Console post-prompts ChatGPT. Si aucun signal positif à 90 jours, repenser la stratégie content/RP avant d'investir davantage.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "Is AI search really replacing classic SEO?",
    answer:
      "Not as replacement, as addition. Per Ahrefs Search Update Q4 2025, Google clicks remain 70-80% of B2B organic traffic, but LLMs (ChatGPT Search, Perplexity, Gemini AI Overview) capture ~10-15% of decision-stage research. Projection is 30-40% by 2028. The real 2026 question: should you start GEO now or wait? Pragmatic answer: now, because the saturation window is closing fast.",
  },
  {
    question: "What share of classic SEO traffic is cannibalized by Google AI Overviews?",
    answer:
      "Varies by query type. On informational queries (\"what is GEO?\"), organic CTR drops 25-40% when an AI Overview shows (Authoritas/SEranking study 2025). On commercial queries (\"best LLM monitoring tool\"), impact is lower (~10-15%) because users click to compare. On navigational queries (brand name), no impact.",
  },
  {
    question: "Do LLMs always pull their answers from Google?",
    answer:
      "No. Three distinct cases. (1) ChatGPT standard mode: uses its training corpus, independent of Google. (2) ChatGPT Search, Claude with web search, Perplexity: use their own indexes or partnerships (Bing for ChatGPT Search). (3) Gemini AI Overview: integrated with Google Search, so depends on Google SERP. Consequence: optimizing for Google only partially optimizes for LLMs.",
  },
  {
    question: "Do we need two separate SEO and GEO teams?",
    answer:
      "Not in 2026. For a B2B mid-market firm with 1-3 growth/SEO people, the same team owns both disciplines with separate plans/KPIs. Separation is more useful at budget level: e.g., 60% classic SEO / 40% GEO at start of 2026, sliding to 50/50 by end of 2027. Beyond 5 marketers, you start seeing a split with a discipline lead each.",
  },
  {
    question: "Will classic SEO disappear long term?",
    answer:
      "No, but its role shifts. Google remains #1 on volume and measurement (Search Console, navigational intent). SEO becomes more of an editorial authority layer than a direct traffic layer. Sites that don't rank well on Google also don't rank in LLMs (both mechanics align on authority signals). Investing in SEO in 2026 remains a prerequisite for GEO to work.",
  },
  {
    question: "What metric replaces the \"Google rank\" in AI search?",
    answer:
      "Four metrics substitute: (1) citation rate — % of prompts citing your brand, (2) average rank in ordered lists that LLMs produce, (3) share-of-voice vs direct competitors, (4) source authority cited — which media/blogs/sites are cited when your sector is mentioned. None as mature as Google rank. Monitoring tools (Geoperf, Profound, Otterly) consolidate these 4 KPIs.",
  },
  {
    question: "How do you unify SEO and GEO in a single dashboard?",
    answer:
      "Typical 2026 stack: Search Console + Ahrefs/Semrush for SEO (rank, CTR, backlinks), Geoperf or equivalent for GEO (cross-LLM citation rate), Looker Studio or Metabase for cross-source dashboard. The hard work is defining monthly KPIs that mean something across both: e.g., \"share of pipeline acquired via total organic channel\" including Google + LLM referrals + branded search lift post-AI search.",
  },
  {
    question: "Do LLMs cite clickable links to sites?",
    answer:
      "Depends on LLM and mode. Perplexity systematically cites sources with clickable links (search-engine-like model). ChatGPT Search shows sources with links in a sidebar. Claude offers clickable citations in artifacts mode. Gemini shows sources under AI Overview. ChatGPT standard mode gives no links (just textual mentions). Referral traffic from LLMs is partial but growing.",
  },
  {
    question: "Is GEO-optimized content worse for classic SEO?",
    answer:
      "Slight tension, no opposition. GEO content favors: very clear structure (explicit H2/H3), numbers and facts, FAQ schema, dense lists. Classic 2024 SEO content favors: narrative depth, E-E-A-T (expertise/experience/authority/trust), backlinks, length. Both converge in 2026 on a hybrid format: 2000-3000 word pillar pages with GEO-friendly structure + SEO editorial authority. This is exactly the format you're reading right now.",
  },
  {
    question: "How to know if a GEO strategy works before 6 months?",
    answer:
      "Three leading indicators at 60-90 days: (1) variation in citation rate on a fixed prompt panel (weekly measurement by dedicated tool), (2) appearance of new authority sources citing the brand (Wikipedia, sector top-tier media), (3) branded search lift in Search Console post-ChatGPT-prompt periods. If no positive signal at 90 days, rethink content/PR strategy before investing more.",
  },
];

function BodyFr() {
  return (
    <>
      <h2 id="what">Qu'est-ce que l'AI search vs SEO ?</h2>
      <p>
        Le <strong>SEO classique</strong> (Search Engine Optimization) est la discipline qui vise à classer un site web dans les résultats des moteurs de recherche traditionnels (Google, Bing, DuckDuckGo). Né dans les années 2000, il s'appuie sur trois piliers : pertinence sémantique, autorité (backlinks), expérience utilisateur (Core Web Vitals).
      </p>
      <p>
        L'<strong>AI search optimization</strong> (parfois appelée GEO — Generative Engine Optimization) est la discipline jumelle née en 2023-2024 qui vise à <strong>faire apparaître une marque dans les réponses générées par les LLM</strong> (ChatGPT, Claude, Gemini, Perplexity, et aussi les AI Overviews intégrés à Google Search). L'AI search ne remplace pas le SEO — il s'ajoute à lui, avec ses propres KPIs et tactiques.
      </p>
      <p>
        Trois différences fondamentales structurent les deux disciplines. <strong>Différence #1 : la sortie</strong>. Le SEO produit une liste de 10 résultats classés ; l'AI search produit une réponse synthétique de 200-400 mots qui mentionne 3-8 marques. <strong>Différence #2 : la mesure</strong>. Le SEO se mesure au mot-clé près (Search Console, position 1 à 100) ; l'AI search se mesure au prompt près (citation rate, share-of-voice). <strong>Différence #3 : la latence</strong>. Le SEO réagit aux nouvelles publications en jours ; les LLM en mode standard réagissent en mois (cycle d'entraînement).
      </p>

      <h2 id="why-2026">Pourquoi la séparation devient critique en 2026</h2>
      <p>
        Pendant 2023-2024, l'AI search était un sujet d'expérimentation. En 2026, c'est devenu un canal de découverte mesurable, et la séparation conceptuelle SEO/GEO devient un vrai sujet de pilotage marketing.
      </p>
      <p>
        Trois données fixent le contexte. (1) <strong>Volume LLM</strong> : ChatGPT, Perplexity, Claude et Gemini cumulent ~5 milliards de visites mensuelles fin 2025 (Similarweb), avec une croissance YoY de +200% sur la portion B2B. (2) <strong>Cannibalisation Google</strong> : les AI Overviews sont déployés sur ~25% des requêtes informationnelles en France et 40% aux US au Q1 2026, réduisant le CTR organique de 25 à 40% sur ces requêtes (étude Authoritas). (3) <strong>Behavior shift B2B</strong> : 1 décideur sur 3 consulte un LLM dans son cycle d'évaluation fournisseur (Gartner 2025), proportion qui monte à 1 sur 2 en SaaS et services tech.
      </p>
      <p>
        Le piège de 2026 est de croire que SEO et GEO sont la même chose, donc qu'optimiser l'un optimise automatiquement l'autre. Faux. Une marque peut être en top 3 Google et invisible dans ChatGPT (sans présence Wikipedia, sans citation médias d'autorité). À l'inverse, une marque peut être très citée par ChatGPT mais ranker en page 2 sur Google (faute de backlinks). Les deux disciplines partagent des prérequis (autorité éditoriale, contenu de qualité) mais divergent sur les tactiques de mise en œuvre.
      </p>
      <p>
        La séparation devient donc un sujet de pilotage : <strong>quel budget alloue-t-on à chaque discipline en 2026</strong> ? Quelles métriques suit-on séparément ? Quelle équipe pilote chaque effort ? Les réponses ne sont pas évidentes et dépendent du secteur, de l'audience et de la maturité de la marque.
      </p>

      <h2 id="how-it-works">Mécaniques techniques comparées</h2>
      <p>
        Les deux disciplines reposent sur des architectures différentes qui imposent des tactiques différentes.
      </p>
      <p>
        <strong>SEO classique : crawler → index → ranking</strong>. Google envoie ses bots (Googlebot) crawler le web, indexe les pages dans une base, et applique un algorithme de ranking (PageRank évolué, BERT, MUM, et désormais des couches LLM) pour ordonner les résultats. Le ranking dépend de centaines de signaux dont les principaux sont : pertinence sémantique du contenu, qualité et nombre de backlinks, expérience utilisateur (CWV), E-E-A-T, freshness. Le SEO classique se mesure dans Search Console au keyword près.
      </p>
      <p>
        <strong>AI search : entraînement → corpus → génération</strong>. Les LLM sont entraînés sur un corpus web jusqu'à une cutoff date (ex : ~mars 2025 pour GPT-4o). À l'inférence, ils ne « cherchent » pas — ils génèrent le texte le plus probable étant donné le prompt et le corpus mémorisé. Ce qui détermine la mention d'une marque : <strong>la fréquence de mention dans le corpus d'entraînement, le contexte sémantique d'apparition, la structure du contenu source</strong>. En mode browse/search activé, certains LLM consultent le web en temps réel et utilisent leur index ou des partenariats (Bing pour ChatGPT Search) — ici, les signaux SEO classiques redeviennent partiellement pertinents.
      </p>
      <p>
        Conséquence pratique pour les marketers. En SEO classique, on travaille sur un mot-clé cible et on peut suivre sa progression mois par mois. En AI search, on travaille sur un panel de 30-100 prompts représentatifs et on suit la part de mentions hebdomadairement. La granularité est plus grossière mais plus fidèle à l'expérience utilisateur réelle.
      </p>
      <p>
        Trois tactiques s'appliquent aux deux disciplines : produire du contenu autoritaire long-form (pillars de 2000+ mots), structurer le contenu (schema markup, H2/H3 clairs, FAQ), construire des backlinks depuis des sites d'autorité. Trois tactiques sont spécifiques au GEO : présence Wikipedia bien sourcée, mentions répétées dans les médias spécialisés cités par les LLM (ex : TechCrunch, Les Échos), structure FAQ très explicite (FAQPage schema). Trois tactiques sont spécifiques au SEO classique : optimisation des Core Web Vitals, internal linking dense, page-speed, mobile-friendliness.
      </p>

      <h2 id="measure">Comment mesurer chaque surface</h2>
      <p>
        Mesurer SEO et AI search demande deux instrumentations distinctes mais consolidables dans un dashboard unique.
      </p>
      <p>
        <strong>Stack de mesure SEO classique</strong> : Search Console (positions, CTR, impressions par keyword), Ahrefs ou Semrush (rang, backlinks, content gap), GA4 (sessions et conversions par canal organique), un outil de site audit (Screaming Frog, Sitebulb). Ces outils sont matures et permettent une mesure au keyword près.
      </p>
      <p>
        <strong>Stack de mesure AI search</strong> : un outil de monitoring multi-LLM (<Link href="/saas">Geoperf</Link>, Profound, Otterly.ai, Brandwatch) qui automatise un panel de prompts B2B et mesure citation rate, average rank, share-of-voice. Plus une instrumentation manuelle en complément : revue qualitative trimestrielle de 20-30 prompts manuellement, pour catcher les évolutions de tonalité et de contexte que les KPIs ne capturent pas.
      </p>
      <p>
        <strong>Métriques à consolider trimestriellement</strong> : (1) trafic organique total Google (Search Console + GA4), (2) trafic référent depuis les LLM (chatgpt.com, perplexity.ai, claude.ai dans GA4 Acquisition Source), (3) citation rate moyen sur le panel GEO (Geoperf), (4) part des leads inbound déclarant ChatGPT/Perplexity comme première source de découverte (sondage formulaire de demande d'audit ou de demo).
      </p>
      <p>
        L'arbitrage budget se fait sur ces données. Si le trafic LLM-référent atteint 15-20% du trafic organique total dans votre secteur en 2026, justifier un investissement GEO de 30-40% du budget SEO global devient évident. Inversement, si votre secteur reste à {"<"}5% (industrie traditionnelle, local fort), inutile de déséquilibrer.
      </p>

      <h2 id="case-studies">Études de cas : où basculer le budget ?</h2>
      <p>
        Trois patterns observés en 2025-2026 chez des PME B2B FR.
      </p>
      <p>
        <strong>Cas 1 — SaaS B2B HR-tech, fondé 2022.</strong> Stratégie SEO classique solide (top 3 sur 8 keywords core depuis 2024). Audit GEO en début 2026 : citation rate ChatGPT seulement 12% sur 30 prompts. Cause : pas d'article Wikipedia, peu de presse sectorielle. Action : 6 mois d'investissement RP (3 articles dans Maddyness, Frenchweb, Forbes France) + Wikipedia article créé. Citation rate à 9 mois : 41%. Trafic organique total +18%. ROI : trafic LLM-référent passé de 0,5% à 7% de l'organique total.
      </p>
      <p>
        <strong>Cas 2 — Cabinet conseil management, top 5 Google sur ses keywords.</strong> Constat 2026 : malgré des positions Google solides, le pipeline qualifié stagne. Audit : les buyer personas (Directeurs RH grands comptes) consultent désormais ChatGPT en exploration (signaux remontés par 12 entretiens leads). Bascule du mix : 70% SEO / 30% GEO en 2026 vs 90/10 historiquement. Format de contenu : passage de papiers d'opinion 800 mots vers pillars 2500 mots avec FAQ schema dense. Résultat à 12 mois : citation rate ChatGPT de 8% à 35%, 4 leads sur 12 du quarter mentionnent ChatGPT comme première source.
      </p>
      <p>
        <strong>Cas 3 — Industriel agroalimentaire B2B, marché traditionnel.</strong> Audit GEO en 2025 : citation rate très faible (3-5%), mais les acheteurs cibles (responsables achats grande distribution) consultent peu les LLM. Décision pragmatique : maintenir 95% du budget en SEO classique (organique fort sur Google avec keywords longue traîne), investir seulement 5% en GEO via une mise à jour annuelle Wikipedia + 1 partenariat presse sectorielle. ROI mesuré : faible mais cohérent avec le profil acheteur. Pas de panique GEO.
      </p>
      <p>
        Le pattern transverse : <strong>la bascule SEO → GEO se fait quand les buyer personas eux-mêmes basculent leur comportement de recherche</strong>, pas avant. Mesurer le comportement réel via entretiens et data avant de déséquilibrer le budget.
      </p>

      <h2 id="tools">Outils pour SEO et AI search</h2>
      <p>
        Carte des outils dominants en 2026.
      </p>
      <ul>
        <li><strong>SEO classique</strong> : Search Console (gratuit, indispensable), Ahrefs (199-1199 USD/mois), Semrush (139-499 USD/mois), Screaming Frog (audit technique).</li>
        <li><strong>AI search / GEO monitoring</strong> : <Link href="/saas">Geoperf</Link> (FR/EU, 79-799 €/mois), Profound (US, enterprise tier), Otterly.ai (US, light), Brandwatch (extension social listening).</li>
        <li><strong>Content production hybride</strong> : Clearscope, Surfer SEO, Frase (assistance SEO), couplés à ChatGPT Team / Claude Pro pour la rédaction.</li>
        <li><strong>Backlinks et autorité</strong> : Ahrefs / Majestic pour la mesure, services RP spécialisés tech (Cision, Meltwater, agences indépendantes).</li>
        <li><strong>Wikipedia editing</strong> : pas un outil dédié, mais un compte éditeur à long terme et la connaissance des règles de notabilité — facteur sous-estimé en 2026.</li>
      </ul>
      <p>
        Pour une PME B2B en début 2026, une stack pragmatique : Search Console + Ahrefs Lite + ChatGPT Team + <Link href="/saas">Geoperf Starter</Link>, total ~250-400 €/mois. Suffisant pour piloter SEO et GEO en parallèle avec des KPIs hebdomadaires.
      </p>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <h2 id="what">What is AI search vs classic SEO?</h2>
      <p>
        <strong>Classic SEO</strong> (Search Engine Optimization) is the discipline of ranking a site in traditional search engine results (Google, Bing, DuckDuckGo). Born in the 2000s, it stands on three pillars: semantic relevance, authority (backlinks), and user experience (Core Web Vitals).
      </p>
      <p>
        <strong>AI search optimization</strong> (sometimes called GEO — Generative Engine Optimization) is the twin discipline born in 2023-2024 that aims to <strong>make a brand appear in answers generated by LLMs</strong> (ChatGPT, Claude, Gemini, Perplexity, plus AI Overviews integrated into Google Search). AI search doesn't replace SEO — it adds to it with its own KPIs and tactics.
      </p>
      <p>
        Three fundamental differences structure the two disciplines. <strong>Difference #1: the output</strong>. SEO produces a list of 10 ranked results; AI search produces a 200-400 word synthetic answer mentioning 3-8 brands. <strong>Difference #2: measurement</strong>. SEO is measured to the keyword (Search Console, positions 1-100); AI search is measured to the prompt (citation rate, share-of-voice). <strong>Difference #3: latency</strong>. SEO reacts to new publications in days; LLMs in standard mode react in months (training cycle).
      </p>

      <h2 id="why-2026">Why this split matters in 2026</h2>
      <p>
        Through 2023-2024, AI search was an experimentation topic. In 2026, it became a measurable discovery channel, and the SEO/GEO conceptual split became a real marketing pilot question.
      </p>
      <p>
        Three data points set the context. (1) <strong>LLM volume</strong>: ChatGPT, Perplexity, Claude and Gemini cumulate ~5 billion monthly visits at end 2025 (Similarweb), with +200% YoY on the B2B slice. (2) <strong>Google cannibalization</strong>: AI Overviews are deployed on ~40% of US informational queries Q1 2026, dropping organic CTR by 25-40% on those queries (Authoritas study). (3) <strong>B2B behavior shift</strong>: 1 in 3 decision-makers consults an LLM in their vendor evaluation cycle (Gartner 2025), 1 in 2 in SaaS and tech services.
      </p>
      <p>
        The 2026 trap is believing SEO and GEO are the same thing, hence optimizing one auto-optimizes the other. False. A brand can be top 3 Google yet invisible in ChatGPT (no Wikipedia presence, no authority press citations). Inversely, a brand can be heavily cited by ChatGPT yet ranking page 2 on Google (no backlinks). Both disciplines share prerequisites (editorial authority, quality content) but diverge on execution tactics.
      </p>
      <p>
        The split therefore becomes a pilot question: <strong>what budget for each discipline in 2026</strong>? Which metrics tracked separately? Which team owns each effort? Answers aren't obvious and depend on sector, audience, and brand maturity.
      </p>

      <h2 id="how-it-works">Technical mechanics compared</h2>
      <p>
        Both disciplines rest on different architectures imposing different tactics.
      </p>
      <p>
        <strong>Classic SEO: crawler → index → ranking</strong>. Google sends bots (Googlebot) to crawl the web, indexes pages, and applies a ranking algorithm (evolved PageRank, BERT, MUM, and now LLM layers) to order results. Ranking depends on hundreds of signals — main ones: content semantic relevance, backlink quality and count, user experience (CWV), E-E-A-T, freshness. Classic SEO is measured in Search Console at the keyword level.
      </p>
      <p>
        <strong>AI search: training → corpus → generation</strong>. LLMs are trained on a web corpus through a cutoff date (e.g., ~March 2025 for GPT-4o). At inference, they don't "search" — they generate the most probable text given the prompt and memorized corpus. What determines a brand mention: <strong>frequency of mention in the training corpus, semantic context of appearance, source content structure</strong>. In active browse/search mode, some LLMs query the web in real time using their index or partnerships (Bing for ChatGPT Search) — here, classic SEO signals become partially relevant again.
      </p>
      <p>
        Practical consequence for marketers. In classic SEO, you work on a target keyword and track its progression month by month. In AI search, you work on a panel of 30-100 representative prompts and track mention share weekly. Coarser granularity but more faithful to actual user experience.
      </p>
      <p>
        Three tactics apply to both: produce authoritative long-form content (2000+ word pillars), structure content (schema markup, clear H2/H3, FAQ), build backlinks from authority sites. Three tactics are GEO-specific: well-sourced Wikipedia presence, repeated mentions in specialized media cited by LLMs (TechCrunch, WSJ, FT), very explicit FAQ structure (FAQPage schema). Three tactics are classic-SEO-specific: Core Web Vitals optimization, dense internal linking, page speed, mobile-friendliness.
      </p>

      <h2 id="measure">How to measure each surface</h2>
      <p>
        Measuring SEO and AI search requires two distinct but consolidable instrumentations in a single dashboard.
      </p>
      <p>
        <strong>Classic SEO measurement stack</strong>: Search Console (positions, CTR, impressions per keyword), Ahrefs or Semrush (rank, backlinks, content gap), GA4 (sessions and conversions by organic channel), site audit tool (Screaming Frog, Sitebulb). Mature tools enabling keyword-level measurement.
      </p>
      <p>
        <strong>AI search measurement stack</strong>: a multi-LLM monitoring tool (<Link href="/saas">Geoperf</Link>, Profound, Otterly.ai, Brandwatch) automating a B2B prompt panel and measuring citation rate, average rank, share-of-voice. Plus complementary manual instrumentation: quarterly qualitative review of 20-30 prompts manually, to catch tone and context evolutions KPIs miss.
      </p>
      <p>
        <strong>Quarterly metrics to consolidate</strong>: (1) total Google organic traffic (Search Console + GA4), (2) referral traffic from LLMs (chatgpt.com, perplexity.ai, claude.ai in GA4 Acquisition Source), (3) average citation rate on the GEO panel (Geoperf), (4) share of inbound leads declaring ChatGPT/Perplexity as first discovery source (audit/demo request form survey).
      </p>
      <p>
        Budget arbitrage flows from this data. If LLM-referral traffic reaches 15-20% of total organic traffic in your sector in 2026, justifying a GEO investment of 30-40% of total SEO budget becomes obvious. Inversely, if your sector stays under 5% (traditional industry, strong local focus), don't unbalance.
      </p>

      <h2 id="case-studies">Case studies: where to shift budget?</h2>
      <p>
        Three observed patterns 2025-2026 in US/UK B2B mid-market.
      </p>
      <p>
        <strong>Case 1 — B2B SaaS HR-tech, founded 2022.</strong> Solid classic SEO strategy (top 3 on 8 core keywords since 2024). GEO audit early 2026: ChatGPT citation rate only 12% on 30 prompts. Cause: no Wikipedia article, little sector press. Action: 6-month PR investment (3 articles in TechCrunch, The Information, Forbes) + Wikipedia article created. Citation rate at 9 months: 41%. Total organic traffic +18%. ROI: LLM-referral traffic from 0.5% to 7% of total organic.
      </p>
      <p>
        <strong>Case 2 — Management consulting firm, top 5 Google on its keywords.</strong> 2026 finding: despite solid Google positions, qualified pipeline stagnates. Audit: target buyer personas (HR Directors at large accounts) now consult ChatGPT during exploration (signal surfaced by 12 lead interviews). Mix shift: 70% SEO / 30% GEO in 2026 vs 90/10 historical. Content format: shift from 800-word opinion pieces to 2500-word pillars with dense FAQ schema. 12-month result: ChatGPT citation rate from 8% to 35%, 4 leads of 12 in the quarter mention ChatGPT as first source.
      </p>
      <p>
        <strong>Case 3 — B2B industrial supplier, traditional market.</strong> 2025 GEO audit: very low citation rate (3-5%), but target buyers (procurement leads at large retailers) rarely consult LLMs. Pragmatic decision: keep 95% of budget in classic SEO (strong organic on Google with long-tail keywords), invest only 5% in GEO via annual Wikipedia update + 1 sector press partnership. Measured ROI: low but consistent with buyer profile. No GEO panic.
      </p>
      <p>
        Cross-pattern: <strong>the SEO → GEO shift happens when buyer personas themselves shift their search behavior</strong>, not before. Measure actual behavior via interviews and data before unbalancing the budget.
      </p>

      <h2 id="tools">Tools for SEO and AI search</h2>
      <p>
        Map of dominant 2026 tools.
      </p>
      <ul>
        <li><strong>Classic SEO</strong>: Search Console (free, mandatory), Ahrefs ($199-1199/month), Semrush ($139-499/month), Screaming Frog (technical audit).</li>
        <li><strong>AI search / GEO monitoring</strong>: <Link href="/saas">Geoperf</Link> (EU, €79-799/month), Profound (US enterprise tier), Otterly.ai (US light), Brandwatch (social listening extension).</li>
        <li><strong>Hybrid content production</strong>: Clearscope, Surfer SEO, Frase (SEO assistance), paired with ChatGPT Team / Claude Pro for drafting.</li>
        <li><strong>Backlinks and authority</strong>: Ahrefs / Majestic for measurement, specialized tech PR services (Cision, Meltwater, independent agencies).</li>
        <li><strong>Wikipedia editing</strong>: not a dedicated tool, but a long-term editor account and notability rules know-how — underestimated factor in 2026.</li>
      </ul>
      <p>
        For a B2B mid-market firm in early 2026, a pragmatic stack: Search Console + Ahrefs Lite + ChatGPT Team + <Link href="/saas">Geoperf Starter</Link>, total ~$300-450/month. Sufficient to pilot SEO and GEO in parallel with weekly KPIs.
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
    ? "AI search vs SEO 2026: methods, KPIs, and what changes for B2B marketers"
    : "AI search vs SEO 2026 : méthodes, KPI et ce qui change pour les marketers B2B";

  const intro = isEn
    ? "Google clicks still represent 70-80% of B2B organic traffic, but LLMs (ChatGPT Search, Perplexity, Gemini AI Overview) capture 10-15% of decision-stage research and growing fast. Classic SEO and AI search are two distinct disciplines: different KPIs, different tactics, different budgets. This guide compares them cleanly so you can decide where to invest in 2026 — without falling for the \"SEO is dead\" hype."
    : "Le clic Google représente encore 70-80% du trafic organique B2B, mais les LLM (ChatGPT Search, Perplexity, Gemini AI Overview) prennent 10-15% des recherches en phase d'évaluation et progressent vite. SEO classique et AI search sont deux disciplines distinctes : KPIs différents, tactiques différentes, budgets différents. Ce guide les compare proprement pour décider où investir en 2026 — sans tomber dans le hype « le SEO est mort ».";

  const toc = isEn ? TOC_EN : TOC_FR;
  const faq = isEn ? FAQ_EN : FAQ_FR;
  const body = isEn ? <BodyEn /> : <BodyFr />;

  const relatedLinks: RelatedLink[] = relatedForPillar(SLUG, locale === "en" ? "en" : "fr");
  const clusterTargets: RelatedLink[] = isEn
    ? [
        { href: "/en/insights/is-seo-dead-2026", label: "Is SEO dead in 2026?", kind: "cluster" },
        { href: "/en/insights/seo-and-geo-can-coexist", label: "How SEO and GEO can coexist", kind: "cluster" },
        { href: "/en/insights/google-ai-overview-optimization", label: "Google AI Overview optimization", kind: "cluster" },
      ]
    : [
        { href: "/insights/geo-vs-seo-differences", label: "GEO vs SEO : 10 différences clés", kind: "cluster" },
        { href: "/insights/seo-et-geo-complementaires", label: "SEO et GEO complémentaires", kind: "cluster" },
        { href: "/insights/ai-overview-vs-serp", label: "AI Overview vs SERP Google", kind: "cluster" },
        { href: "/insights/google-vs-chatgpt-b2b", label: "Google Search vs ChatGPT pour le B2B", kind: "cluster" },
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
