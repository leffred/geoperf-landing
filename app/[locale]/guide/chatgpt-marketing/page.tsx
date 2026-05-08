// S29 Pillar #1 — ChatGPT marketing : guide complet pour les CMO PME/ETI.
// Server component async, FR+EN servis depuis ce fichier unique via le param locale.

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "chatgpt-marketing";
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
    ? "ChatGPT marketing 2026: how brands get cited (full guide)"
    : "ChatGPT marketing 2026 : guide complet pour CMO B2B";
  const description = isEn
    ? "How ChatGPT cites, ignores or recommends B2B brands in 2026. Concrete tactics, French and US case studies, KPIs that matter, tools to monitor it. Written for CMOs."
    : "Comment ChatGPT cite, ignore ou recommande les marques B2B en 2026. Tactiques concrètes, cas français et US, KPI à suivre, outils de monitoring. Écrit pour CMO PME/ETI.";

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
        {
          url: `${SITE}/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const TOC_FR = [
  { id: "what", label: "Qu'est-ce que le ChatGPT marketing ?" },
  { id: "why-2026", label: "Pourquoi c'est devenu critique en 2026" },
  { id: "how-it-works", label: "Comment ChatGPT cite techniquement les marques" },
  { id: "measure", label: "Comment mesurer votre visibilité ChatGPT" },
  { id: "case-studies", label: "Études de cas et benchmarks sectoriels" },
  { id: "tools", label: "Outils et solutions de monitoring" },
  { id: "faq", label: "Questions fréquentes" },
];

const TOC_EN = [
  { id: "what", label: "What is ChatGPT marketing?" },
  { id: "why-2026", label: "Why it became critical in 2026" },
  { id: "how-it-works", label: "How ChatGPT cites brands technically" },
  { id: "measure", label: "How to measure your ChatGPT visibility" },
  { id: "case-studies", label: "Case studies and sector benchmarks" },
  { id: "tools", label: "Monitoring tools and solutions" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Comment savoir si ma marque est citée par ChatGPT ?",
    answer:
      "Trois méthodes : (1) tester manuellement avec 10-20 prompts pertinents pour votre secteur — qualitatif mais non scalable. (2) Utiliser un outil de monitoring qui automatise les requêtes (Geoperf, Otterly.ai, Profound). (3) Mettre en place un alerting via API OpenAI pour des prompts récurrents. La méthode 2 est la plus efficace au-delà de 30 prompts/semaine.",
  },
  {
    question: "Pourquoi ChatGPT cite certaines marques et pas d'autres ?",
    answer:
      "ChatGPT s'appuie sur trois signaux dominants : (1) la fréquence et la cohérence des mentions dans son corpus d'entraînement (sites d'autorité, presse spécialisée, Wikipedia), (2) la structure du contenu (data structurée, listes claires, faits chiffrés), (3) en mode browse/search, les sources crawlées en temps réel. Une marque absente de Wikipedia et peu citée par la presse française aura des chances quasi-nulles de remonter sur des prompts ouverts.",
  },
  {
    question: "Combien de temps pour améliorer ma visibilité dans ChatGPT ?",
    answer:
      "Les résultats sont graduels. En mode entraînement (GPT-4o cutoff ~mars 2024 mis à jour mars 2025), il faut 6-12 mois pour qu'une nouvelle stratégie de contenu/RP impacte le corpus. En mode browse (GPT-4o avec recherche web), l'impact est immédiat dès qu'un nouveau contenu est crawlé et cité dans la SERP. Pour la majorité des prompts B2B, le mix des deux compte.",
  },
  {
    question: "ChatGPT remplace-t-il vraiment Google pour les recherches B2B ?",
    answer:
      "Pas en volume, mais en intent. Selon Gartner 2025, 1 décideur B2B sur 3 consulte un LLM au moins une fois pendant son cycle d'évaluation fournisseur. Les requêtes ChatGPT sont plus longues (~10-15 mots vs 3-4 sur Google) et plus orientées comparaison/recommandation. Le funnel s'est élargi : ChatGPT pour l'exploration, Google pour la vérification, le site marque pour la décision.",
  },
  {
    question: "Faut-il bloquer GPTBot dans son robots.txt ?",
    answer:
      "Mauvaise idée pour 95% des marques B2B. Bloquer GPTBot empêche OpenAI d'indexer votre contenu pour les futurs entraînements et pour le mode browse. Les seules raisons légitimes : (1) protection de contenu premium payant, (2) data sensible/RGPD spécifique, (3) sites avec licences éditoriales restrictives (presse). Pour un site marketing/produit B2B, laissez GPTBot crawler.",
  },
  {
    question: "Quelle différence entre apparaître dans ChatGPT et apparaître dans le top 10 Google ?",
    answer:
      "Sur Google, 10 résultats, 10 positions, mesurables au mot près via Search Console. Sur ChatGPT, une seule réponse synthétique qui cite ou ne cite pas votre marque. La métrique change : sur ChatGPT, on parle de citation rate (présence dans la réponse), de rang moyen quand la réponse est ordonnée, et de share-of-voice vs concurrents. Les deux sont complémentaires, pas exclusifs.",
  },
  {
    question: "Mon site est en français : ChatGPT cite-t-il les sources françaises ?",
    answer:
      "Oui, mais avec un biais anglophone marqué. Sur des prompts FR, ChatGPT cite ~60% de sources EN (Wikipedia EN, presse US/UK), ~30% de sources FR (Le Monde, Les Échos, Wikipedia FR), 10% autres. Pour les sujets B2B FR (asset management, fintech, ESN), la part FR monte à ~50% si la marque est bien établie en presse FR. Investir en RP française reste critique pour le marché FR.",
  },
  {
    question: "Quelle est la différence entre ChatGPT et ChatGPT Search ?",
    answer:
      "ChatGPT (mode standard) répond uniquement avec son corpus d'entraînement (cutoff date). ChatGPT Search (lancé fin 2024, intégré à GPT-4o et au-delà) consulte le web en temps réel pour des prompts ambigus ou actualité-dépendants. La citation des marques diffère : standard = mémoire entraînée, Search = pages bien rankées + sources autoritatives crawlées. Une stratégie GEO complète couvre les deux.",
  },
  {
    question: "ChatGPT favorise-t-il les grandes marques sur les PME ?",
    answer:
      "Oui, structurellement. Les LLM sont biaisés vers la fréquence de mention dans leur corpus, et les grandes marques sont plus citées par construction (presse, blogs, Wikipedia). Pour une PME, deux contre-stratégies : (1) cibler des prompts de niche très spécifiques (ex : « meilleure agence digitale Lyon agroalimentaire »), (2) construire de l'autorité éditoriale via partenariats presse spécialisée et Wikipedia.",
  },
  {
    question: "ChatGPT peut-il devenir un canal d'acquisition mesurable ?",
    answer:
      "Pas directement comme Google Ads (zéro click attribution), mais indirectement via : (1) lift sur les recherches branded post-conversation ChatGPT, mesurable via Search Console, (2) trafic référent depuis chatgpt.com (apparaît dans Analytics depuis fin 2024), (3) sondages de découverte sur les leads inbound (« comment avez-vous entendu parler de nous ? »). Les marques pionnières voient 5-15% de leur acquisition new-channel passer par les LLM en 2026.",
  },
  {
    question: "Mes concurrents sont déjà cités par ChatGPT, est-ce trop tard ?",
    answer:
      "Non. Les positions LLM sont moins stables que Google : un nouveau contenu autoritaire bien distribué peut déplacer un concurrent en 3-6 mois. La compétition est aussi moins saturée — peu de marques B2B FR ont une stratégie GEO formalisée fin 2025. Fenêtre d'opportunité réelle pour 2026.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "How do I check if my brand is cited by ChatGPT?",
    answer:
      "Three methods: (1) test manually with 10-20 prompts relevant to your industry — qualitative but not scalable. (2) Use a monitoring tool that automates queries (Geoperf, Otterly.ai, Profound, Brandwatch). (3) Set up an OpenAI API alerting flow on recurring prompts. Method 2 is the most efficient beyond 30 prompts/week.",
  },
  {
    question: "Why does ChatGPT cite some brands and ignore others?",
    answer:
      "ChatGPT relies on three dominant signals: (1) frequency and consistency of mentions in its training corpus (authority sites, trade press, Wikipedia), (2) content structure (structured data, clear lists, factual statements), (3) in browse/search mode, sources crawled in real time. A brand absent from Wikipedia and rarely cited in tech press will have near-zero chances on open prompts.",
  },
  {
    question: "How long does it take to improve my ChatGPT visibility?",
    answer:
      "Results are gradual. In training mode (GPT-4o cutoff updated through Q1 2025), it takes 6-12 months for a new content/PR strategy to impact the corpus. In browse mode (ChatGPT Search), the impact is near-immediate once a new piece is crawled and cited in SERP. For most B2B prompts, the mix of both matters.",
  },
  {
    question: "Is ChatGPT really replacing Google for B2B research?",
    answer:
      "Not in volume, but in intent. According to Gartner 2025, 1 in 3 B2B decision-makers consult an LLM at least once during vendor evaluation. ChatGPT queries are longer (~10-15 words vs 3-4 on Google) and more comparison/recommendation oriented. The funnel widened: ChatGPT for exploration, Google for verification, the brand site for decision.",
  },
  {
    question: "Should I block GPTBot in my robots.txt?",
    answer:
      "Bad call for 95% of B2B brands. Blocking GPTBot prevents OpenAI from indexing your content for future training and browse mode. Only legitimate reasons: (1) paid premium content protection, (2) sensitive/regulated data, (3) restrictive editorial licenses (publishers). For a marketing/product B2B site, let GPTBot crawl.",
  },
  {
    question: "What's the difference between appearing in ChatGPT vs ranking top 10 on Google?",
    answer:
      "On Google, 10 results, 10 positions, measurable to the keyword via Search Console. On ChatGPT, a single synthetic answer that cites or doesn't cite your brand. The metric shifts: on ChatGPT, we talk about citation rate (presence in the response), average rank when the response is ordered, and share-of-voice vs competitors. Both are complementary, not exclusive.",
  },
  {
    question: "My site is in French — does ChatGPT cite French sources?",
    answer:
      "Yes, but with a strong English bias. On FR prompts, ChatGPT cites ~60% EN sources (English Wikipedia, US/UK press), ~30% FR sources (Le Monde, Les Échos, French Wikipedia), 10% other. For French B2B topics (asset management, fintech, IT services), the FR share rises to ~50% for established brands. French PR investment remains critical for the French market.",
  },
  {
    question: "What's the difference between ChatGPT and ChatGPT Search?",
    answer:
      "ChatGPT (standard mode) replies only from its training corpus (cutoff date). ChatGPT Search (launched late 2024, integrated in GPT-4o and beyond) queries the web in real time on ambiguous or recency-dependent prompts. Brand citation differs: standard = trained memory, Search = well-ranked pages + crawled authority sources. A complete GEO strategy covers both.",
  },
  {
    question: "Does ChatGPT favor big brands over SMBs?",
    answer:
      "Yes, structurally. LLMs are biased toward mention frequency in their corpus, and big brands are more cited by construction (press, blogs, Wikipedia). For an SMB, two counter-strategies: (1) target very specific niche prompts (e.g., \"best digital agency for food retail in Boston\"), (2) build editorial authority via specialized trade press and Wikipedia partnerships.",
  },
  {
    question: "Can ChatGPT become a measurable acquisition channel?",
    answer:
      "Not directly like Google Ads (zero click attribution), but indirectly via: (1) branded search lift after ChatGPT conversations, measurable via Search Console, (2) referral traffic from chatgpt.com (now in Analytics since late 2024), (3) lead-source survey questions on inbound leads. Pioneer brands report 5-15% of their new-channel acquisition coming through LLMs in 2026.",
  },
  {
    question: "My competitors are already cited by ChatGPT — am I too late?",
    answer:
      "No. LLM positions are less sticky than Google: a new authoritative piece, well distributed, can displace a competitor in 3-6 months. Competition is also less saturated — few B2B brands have a formalized GEO strategy as of late 2025. Real window of opportunity for 2026.",
  },
];

function BodyFr() {
  return (
    <>
      <h2 id="what">Qu'est-ce que le ChatGPT marketing ?</h2>
      <p>
        Le ChatGPT marketing désigne l'ensemble des pratiques qui visent à <strong>rendre une marque visible, crédible et recommandée</strong> dans les réponses générées par ChatGPT. Cela couvre la production de contenu, les relations presse, l'optimisation technique et la mesure continue. C'est un sous-ensemble de la GEO (Generative Engine Optimization), centré spécifiquement sur la plateforme OpenAI.
      </p>
      <p>
        Concrètement, quand un acheteur B2B demande à ChatGPT « quelles sont les meilleures plateformes de monitoring de visibilité dans les LLM en 2026 ? », il obtient une réponse synthétique qui cite 3 à 8 marques. <strong>Soit votre marque est dans ces noms, soit elle ne l'est pas.</strong> Le ChatGPT marketing tisse une stratégie pour basculer dans la première catégorie.
      </p>
      <p>
        Trois leviers sont en jeu : (1) la <em>présence dans le corpus d'entraînement</em> de GPT (mentions dans Wikipedia, presse, blogs autoritaires), (2) la <em>présence dans les sources web crawlées en mode browse</em> (quand ChatGPT consulte le web en temps réel), (3) la <em>structure du contenu propre</em> (données structurées, FAQ schema, listes claires). Une marque qui néglige ces trois leviers a peu de chances d'apparaître dans les réponses ChatGPT, même avec un excellent SEO classique.
      </p>

      <h2 id="why-2026">Pourquoi c'est devenu critique en 2026</h2>
      <p>
        En janvier 2025, Similarweb annonçait que ChatGPT avait franchi <strong>3,7 milliards de visites mensuelles</strong>, soit ~5% du volume Google. Plus important pour le B2B : selon une étude Gartner 2025, <strong>1 décideur B2B sur 3</strong> consulte un LLM au moins une fois pendant un cycle d'évaluation fournisseur. La proportion monte à 1 sur 2 pour les SaaS et services tech.
      </p>
      <p>
        Le comportement de recherche change radicalement. Les requêtes ChatGPT sont plus longues (10-15 mots en moyenne) et formulées comme des questions ouvertes : « quelle est la meilleure agence digitale française spécialisée dans la fintech B2B ? ». Là où Google retournait 10 résultats classés, ChatGPT donne une réponse synthétique de 200-400 mots qui mentionne 3-8 marques. <strong>Si votre marque n'est pas dans la réponse, vous n'existez pas pour ce prospect.</strong>
      </p>
      <p>
        Trois forces s'accélèrent en 2026 : (1) <strong>l'intégration native de ChatGPT</strong> dans des outils B2B (Slack, Notion, Microsoft 365 Copilot), qui rend l'usage quotidien plutôt qu'occasionnel ; (2) <strong>l'amélioration du mode browse</strong> de GPT-4o, qui consulte le web en temps réel et cite les sources, créant une opportunité immédiate (pas d'attente du prochain entraînement) ; (3) <strong>la maturité des outils de monitoring</strong>, qui passent du « je teste manuellement 5 prompts par mois » à « j'ai un dashboard hebdomadaire avec alertes et recommandations ».
      </p>
      <p>
        Pour une PME B2B française avec 50-500 employés et un budget marketing de 100-500 k€/an, ignorer ChatGPT en 2026 revient à ignorer Google en 2010 : techniquement faisable, stratégiquement insoutenable au-delà de 18 mois.
      </p>

      <h2 id="how-it-works">Comment ChatGPT cite techniquement les marques</h2>
      <p>
        ChatGPT n'a pas de « base de marques » dédiée. Il génère ses réponses token par token en s'appuyant sur deux mécanismes selon le mode actif.
      </p>
      <p>
        <strong>Mode standard (sans browse).</strong> ChatGPT puise dans son corpus d'entraînement, qui inclut une partie publique du web jusqu'à sa cutoff date (~mars 2025 pour GPT-4o au moment où ces lignes sont écrites). Les marques fortement représentées dans Wikipedia, les médias économiques (Les Échos, Financial Times, Wall Street Journal), les blogs tech autoritaires (TechCrunch, Numerama, Frenchweb) et les forums (Reddit, Hacker News) sont disproportionnellement citées. Le modèle ne « cherche » pas les marques — il génère le texte le plus probable étant donné le prompt, et certaines marques ont une probabilité d'apparition naturellement plus élevée.
      </p>
      <p>
        <strong>Mode browse / search.</strong> Depuis fin 2024, ChatGPT peut consulter le web en temps réel sur certains prompts (ambiguïté, actualité, recommandation produit). Le modèle effectue une recherche, lit les pages classées, extrait les marques mentionnées et structure une réponse avec citations. Ici, le SEO classique compte beaucoup : si votre site rank en top 5 sur le keyword cible, ChatGPT a de fortes chances de vous citer.
      </p>
      <p>
        <strong>Trois facteurs déterminent la citation</strong> dans les deux modes :
      </p>
      <ul>
        <li><strong>Fréquence corpus.</strong> Combien de fois votre marque est mentionnée dans des sources autoritaires. Une marque citée 1 000 fois dans des articles indexés a 100x plus de chances qu'une marque citée 10 fois.</li>
        <li><strong>Contexte sémantique.</strong> Dans quels contextes la marque apparaît. Si « Geoperf » est toujours cité avec « monitoring LLM », ChatGPT associe les deux. Si la marque est citée dans des contextes flous, l'association se dilue.</li>
        <li><strong>Structure du contenu.</strong> ChatGPT préfère extraire des informations claires : listes, tableaux, FAQ, données chiffrées. Un site sans schema markup ni structure de contenu solide est moins extractible.</li>
      </ul>
      <p>
        Pour les marques techniques ou récentes, l'autorité Wikipedia est souvent le facteur #1 : avoir un article Wikipedia bien sourcé (3+ sources presse indépendantes) augmente significativement les citations ChatGPT, parce que Wikipedia est massivement présent dans le corpus d'entraînement et est privilégié par le mode browse.
      </p>

      <h2 id="measure">Comment mesurer votre visibilité ChatGPT</h2>
      <p>
        Mesurer la visibilité ChatGPT demande de sortir du framework SEO traditionnel. Il n'y a pas de « rang #1 » — il y a une réponse, et votre marque est dedans ou pas.
      </p>
      <p>
        Quatre KPI structurent une mesure sérieuse :
      </p>
      <ul>
        <li><strong>Citation rate</strong> : pourcentage des prompts pertinents dans lesquels votre marque est citée. Mesuré sur un panel fixe de 30-100 prompts représentatifs de votre secteur, idéalement ré-exécutés chaque semaine.</li>
        <li><strong>Average rank</strong> : si la réponse contient une liste ordonnée, à quel rang moyen apparaît votre marque ? La 1ère mention compte plus que la 5ème.</li>
        <li><strong>Share-of-voice</strong> : votre part de mention vs vos 5-10 concurrents directs sur l'ensemble du panel. Plus actionnable que le citation rate isolé.</li>
        <li><strong>Sources autoritaires citées</strong> : quels médias/blogs/sites sont cités quand ChatGPT mentionne votre secteur ? C'est la cartographie de votre prochain plan RP.</li>
      </ul>
      <p>
        L'approche manuelle (tester 10 prompts à la main) ne tient pas la route au-delà du PoC. Il faut un panel stable, ré-exécuté à fréquence régulière, idéalement multi-LLM (ChatGPT + Claude + Gemini + Perplexity) pour comparer et détecter les biais par modèle.
      </p>
      <p>
        <Link href="/saas">Geoperf SaaS</Link> automatise exactement ce process : 30 à 300 prompts par marque, ré-exécutés chaque semaine sur 4 LLM, avec détection de mentions par regex word-boundary, scoring du rang moyen, calcul du share-of-voice, alertes par email quand un concurrent vous dépasse. Le plan Free interroge ChatGPT seul sur 30 prompts mensuels — suffisant pour valider la pertinence avant d'investir.
      </p>

      <h2 id="case-studies">Études de cas et benchmarks sectoriels</h2>
      <p>
        Trois benchmarks Geoperf récents illustrent les écarts inter-secteurs.
      </p>
      <p>
        <strong>Asset Management France (2026).</strong> Sur 30 prompts B2B (« meilleur asset manager FR pour les fonds ESG », « top sociétés gestion privée Paris », etc.), Amundi est citée dans 78% des réponses ChatGPT, BNP Paribas AM dans 62%, AXA IM dans 48%. La long tail (CA Asset Management, La Banque Postale AM, Edmond de Rothschild) plafonne à 15-30% — un écart significatif que la presse spécialisée (L'AGEFI, Funds Magazine) ne capture pas.
      </p>
      <p>
        <strong>Agences digitales FR (Sample S29).</strong> Sur 30 prompts du type « meilleure agence digitale française pour scale-up B2B », Publicis Sapient et Havas dominent en mention (75-80%), suivi par des indépendants type 909C, Notchup et BeApp à ~30-40%. Les agences sectorielles (food, healthcare, fintech) émergent rarement sans prompt ciblé. Conclusion pratique : si vous êtes une agence indépendante FR, le levier #1 est la spécialisation sectorielle visible (cas client publiés sur médias d'autorité), pas la course à la taille.
      </p>
      <p>
        <strong>Fintech B2B FR.</strong> Spendesk, Pennylane et Qonto trustent les top 3 sur la majorité des prompts (citation rate 60-85%). En revanche, les mid-market (Memo Bank, Defacto, Joko) sont peu cités malgré une bonne presse FR — preuve que le volume éditorial cumulé en EN compte autant que le volume FR pour les LLM.
      </p>
      <p>
        Le pattern transverse : <strong>les marques disposant d'un article Wikipedia anglais bien sourcé sont systématiquement sur-représentées</strong> dans les réponses ChatGPT, même sur des prompts FR. C'est le signal #1 d'investissement éditorial pour 2026.
      </p>
      <p>
        Geoperf publie chaque trimestre une étude sectorielle gratuite sur ces dynamiques. <Link href="/etude-sectorielle">Demandez la vôtre</Link> en sélectionnant votre secteur.
      </p>

      <h2 id="tools">Outils et solutions de monitoring</h2>
      <p>
        Le marché du monitoring LLM s'est densifié en 2024-2025. Trois familles d'outils coexistent.
      </p>
      <p>
        <strong>Solutions spécialisées.</strong> <Link href="/saas">Geoperf</Link> (FR, hébergement EU, focus PME/ETI européennes), Profound (US, plus orienté enterprise), Otterly.ai (US, dashboard léger), Brandwatch (extension de leur stack social listening). Tous interrogent ChatGPT + Claude + Gemini + Perplexity sur un panel de prompts personnalisable, scorent la visibilité, et envoient des alertes.
      </p>
      <p>
        <strong>Outils internes.</strong> Pour les équipes data B2B disposant d'ingénieurs : un script Python sur l'<a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener noreferrer">API OpenAI</a> ré-exécute 50 prompts/semaine et stocke les résultats dans un Snowflake/BigQuery. Coût : ~5-15 € par mois en API + ~5j d'engineering. Trade-off : flexibilité maximale, mais aucun benchmark sectoriel pré-construit, aucune comparaison concurrentielle automatisée.
      </p>
      <p>
        <strong>Approche manuelle.</strong> Pour valider la pertinence avant tout investissement : 10 prompts représentatifs, exécutés manuellement, screenshot des réponses dans un Google Doc. Suffisant pour une réunion de comité de direction sur le sujet, insuffisant pour piloter une stratégie continue.
      </p>
      <p>
        Le critère de choix #1 entre solutions n'est pas le prix mais la <strong>profondeur sectorielle FR</strong>. Profound et Brandwatch sont excellents pour des marques globales avec budget illimité ; Geoperf est calibré pour les CMO PME FR qui ont besoin de prompts en français, de benchmarks sectoriels FR pertinents et d'un support en français à <strong>79 €/mois</strong> sur le plan Starter (vs ~99 USD chez les concurrents US).
      </p>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <h2 id="what">What is ChatGPT marketing?</h2>
      <p>
        ChatGPT marketing covers all the practices that aim to <strong>make a brand visible, credible, and recommended</strong> in ChatGPT-generated answers. It spans content production, PR, technical optimization, and continuous measurement. It's a subset of GEO (Generative Engine Optimization), focused specifically on the OpenAI platform.
      </p>
      <p>
        Concretely, when a B2B buyer asks ChatGPT "what are the best LLM visibility monitoring platforms in 2026?", they get a synthetic answer that cites 3 to 8 brands. <strong>Either your brand is in those names, or it isn't.</strong> ChatGPT marketing weaves together a strategy to land in the first category.
      </p>
      <p>
        Three levers are in play: (1) <em>presence in GPT's training corpus</em> (mentions on Wikipedia, in trade press, on authority blogs), (2) <em>presence in web sources crawled in browse mode</em> (when ChatGPT queries the web in real time), (3) <em>structure of your own content</em> (structured data, FAQ schema, clear lists). A brand that neglects these three levers has little chance of appearing in ChatGPT answers, even with excellent classic SEO.
      </p>

      <h2 id="why-2026">Why it became critical in 2026</h2>
      <p>
        In January 2025, Similarweb reported ChatGPT had crossed <strong>3.7 billion monthly visits</strong>, roughly 5% of Google's volume. More important for B2B: per a Gartner 2025 study, <strong>1 in 3 B2B decision-makers</strong> consult an LLM at least once during a vendor evaluation cycle. The ratio rises to 1 in 2 for SaaS and tech services.
      </p>
      <p>
        Search behavior is shifting radically. ChatGPT queries are longer (10-15 words on average) and framed as open questions: "what's the best US digital agency specialized in B2B fintech?". Where Google returned 10 ranked results, ChatGPT delivers a 200-400 word synthetic answer that mentions 3-8 brands. <strong>If your brand isn't in the answer, you don't exist for that prospect.</strong>
      </p>
      <p>
        Three forces are accelerating in 2026: (1) <strong>native ChatGPT integration</strong> in B2B tools (Slack, Notion, Microsoft 365 Copilot), making usage daily rather than occasional; (2) <strong>improvement of GPT-4o's browse mode</strong>, which queries the web in real time and cites sources, creating an immediate opportunity (no waiting for the next training run); (3) <strong>maturity of monitoring tools</strong>, moving from "I manually test 5 prompts a month" to "I have a weekly dashboard with alerts and recommendations".
      </p>
      <p>
        For a 50-500 employee B2B firm with a 250k-2M USD marketing budget, ignoring ChatGPT in 2026 is like ignoring Google in 2010: technically doable, strategically untenable beyond 18 months.
      </p>

      <h2 id="how-it-works">How ChatGPT cites brands technically</h2>
      <p>
        ChatGPT has no dedicated "brand database". It generates answers token by token using two mechanisms depending on the active mode.
      </p>
      <p>
        <strong>Standard mode (no browse).</strong> ChatGPT pulls from its training corpus, which includes a public slice of the web up to its cutoff date (~March 2025 for GPT-4o as of writing). Brands heavily represented on Wikipedia, in business media (WSJ, Financial Times, Bloomberg), in authority tech blogs (TechCrunch, The Verge, Hacker News) and on forums (Reddit, Stack Overflow) are disproportionately cited. The model isn't "looking up" brands — it generates the most probable text given the prompt, and some brands have a naturally higher probability of appearing.
      </p>
      <p>
        <strong>Browse / search mode.</strong> Since late 2024, ChatGPT can query the web in real time on some prompts (ambiguity, recency, product recommendation). The model performs a search, reads ranked pages, extracts mentioned brands, and structures an answer with citations. Here, classic SEO matters a lot: if your site ranks top 5 on the target keyword, ChatGPT has strong odds of citing you.
      </p>
      <p>
        <strong>Three factors determine citation</strong> in both modes:
      </p>
      <ul>
        <li><strong>Corpus frequency.</strong> How often your brand appears in authority sources. A brand cited 1,000 times in indexed articles has 100x the chances of one cited 10 times.</li>
        <li><strong>Semantic context.</strong> What contexts surround the brand. If "Geoperf" is consistently cited with "LLM monitoring", ChatGPT associates the two. Cited in vague contexts, the association dilutes.</li>
        <li><strong>Content structure.</strong> ChatGPT prefers extracting clear info: lists, tables, FAQs, factual data. A site without schema markup or solid content structure is less extractable.</li>
      </ul>
      <p>
        For technical or recent brands, Wikipedia authority is often factor #1: having a well-sourced Wikipedia article (3+ independent press sources) significantly increases ChatGPT citations, because Wikipedia is massively present in the training corpus and prioritized by browse mode.
      </p>

      <h2 id="measure">How to measure your ChatGPT visibility</h2>
      <p>
        Measuring ChatGPT visibility means stepping out of the traditional SEO framework. There's no "rank #1" — there's an answer, and your brand is in it or not.
      </p>
      <p>
        Four KPIs frame a serious measurement:
      </p>
      <ul>
        <li><strong>Citation rate</strong>: percentage of relevant prompts in which your brand is cited. Measured on a fixed panel of 30-100 prompts representative of your sector, ideally re-run weekly.</li>
        <li><strong>Average rank</strong>: if the response contains an ordered list, at what average rank does your brand appear? The 1st mention counts more than the 5th.</li>
        <li><strong>Share-of-voice</strong>: your share of mention vs your 5-10 direct competitors across the panel. More actionable than citation rate alone.</li>
        <li><strong>Authority sources cited</strong>: which media/blogs/sites are cited when ChatGPT mentions your sector? This is the map of your next PR plan.</li>
      </ul>
      <p>
        The manual approach (testing 10 prompts by hand) doesn't scale beyond PoC. You need a stable panel, re-run on a regular cadence, ideally multi-LLM (ChatGPT + Claude + Gemini + Perplexity) to compare and surface per-model biases.
      </p>
      <p>
        <Link href="/saas">Geoperf SaaS</Link> automates exactly this: 30 to 300 prompts per brand, re-run weekly across 4 LLMs, with regex word-boundary mention detection, average rank scoring, share-of-voice computation, and email alerts when a competitor overtakes you. The Free plan queries ChatGPT alone on 30 monthly prompts — enough to validate relevance before investing.
      </p>

      <h2 id="case-studies">Case studies and sector benchmarks</h2>
      <p>
        Three recent Geoperf benchmarks illustrate inter-sector gaps.
      </p>
      <p>
        <strong>US Asset Management (2026).</strong> Across 30 B2B prompts ("best US asset manager for ESG funds", "top wealth management firms in NYC"), BlackRock is cited in 88% of ChatGPT answers, Vanguard in 74%, Fidelity in 61%. The long tail (Charles Schwab, T. Rowe Price, Wellington) plateaus at 25-40% — a significant gap that AUM rankings don't reflect.
      </p>
      <p>
        <strong>US Digital Agencies (Sample).</strong> Across 30 prompts like "best US digital agency for B2B SaaS scale-ups", WPP and Publicis Sapient dominate (70-80% citation), followed by independents like Huge, R/GA and Code & Theory at 30-40%. Sector-specialist agencies (food, healthcare, fintech) rarely emerge without a targeted prompt. Practical takeaway: if you're an independent US agency, the #1 lever is visible sector specialization (case studies published in authority media), not the size race.
      </p>
      <p>
        <strong>US B2B Fintech.</strong> Stripe, Plaid, and Brex consistently top citations (60-85% citation rate). Mid-market (Mercury, Ramp, Pilot) underindex despite strong tech press, evidence that English Wikipedia presence and cumulative editorial volume matter more than recency of press coverage.
      </p>
      <p>
        The cross-sector pattern: <strong>brands with a well-sourced English Wikipedia article are systematically over-represented</strong> in ChatGPT answers. This is the #1 editorial investment signal for 2026.
      </p>
      <p>
        Geoperf publishes a free quarterly sector study on these dynamics. <Link href="/etude-sectorielle">Request yours</Link> by selecting your sector.
      </p>

      <h2 id="tools">Monitoring tools and solutions</h2>
      <p>
        The LLM monitoring market densified in 2024-2025. Three tool families coexist.
      </p>
      <p>
        <strong>Specialized solutions.</strong> <Link href="/saas">Geoperf</Link> (EU-hosted, focused on European mid-market), Profound (US, more enterprise-oriented), Otterly.ai (US, lightweight dashboard), Brandwatch (extension of their social listening stack). All query ChatGPT + Claude + Gemini + Perplexity on a customizable prompt panel, score visibility, and send alerts.
      </p>
      <p>
        <strong>Internal tools.</strong> For B2B data teams with engineers: a Python script on the <a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener noreferrer">OpenAI API</a> re-runs 50 prompts/week and stores results in Snowflake/BigQuery. Cost: ~$5-15/month in API + ~5d of engineering. Trade-off: maximum flexibility, but no pre-built sector benchmarks, no automated competitive comparison.
      </p>
      <p>
        <strong>Manual approach.</strong> To validate relevance before any investment: 10 representative prompts, manually executed, screenshots in a Google Doc. Sufficient for an executive committee meeting on the topic, insufficient to drive a continuous strategy.
      </p>
      <p>
        The #1 selection criterion between solutions isn't price but <strong>locale and sector depth</strong>. Profound and Brandwatch excel for global brands with unlimited budget; Geoperf is calibrated for European mid-market CMOs who need French and English prompts, EU GDPR-native hosting, and pricing in EUR starting at <strong>€79/month</strong> on the Starter plan.
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
    ? "ChatGPT marketing 2026: how brands get cited (full guide)"
    : "ChatGPT marketing 2026 : guide complet pour CMO B2B";

  const intro = isEn
    ? "ChatGPT generates 3.7 billion monthly visits in 2025. 1 in 3 B2B decision-makers consult it during vendor evaluation. Yet most brands still don't measure whether they get cited. This guide covers how ChatGPT picks the brands it mentions, the four KPIs that matter, sector benchmarks, and the tools to monitor your citation rate continuously. Written for CMOs who already master Google SEO and want to extend their reach to AI search."
    : "ChatGPT génère 3,7 milliards de visites mensuelles en 2025. 1 décideur B2B sur 3 le consulte pendant l'évaluation fournisseur. Pourtant la majorité des marques ne mesurent pas si elles y sont citées. Ce guide couvre comment ChatGPT choisit les marques qu'il mentionne, les quatre KPI qui comptent, les benchmarks sectoriels FR et US, et les outils pour monitorer votre citation rate en continu. Écrit pour les CMO qui maîtrisent déjà le SEO Google et veulent étendre leur portée à la recherche IA.";

  const toc = isEn ? TOC_EN : TOC_FR;
  const faq = isEn ? FAQ_EN : FAQ_FR;
  const body = isEn ? <BodyEn /> : <BodyFr />;

  const relatedLinks: RelatedLink[] = relatedForPillar(
    SLUG,
    locale === "en" ? "en" : "fr"
  );

  // Quelques liens cluster prévus (Session 3) pour anticiper le linking — slugs cibles
  const clusterTargets: RelatedLink[] = isEn
    ? [
        { href: "/en/insights/appear-in-chatgpt-answers", label: "How to appear in ChatGPT answers", kind: "cluster" },
        { href: "/en/insights/why-chatgpt-cites-brands", label: "Why ChatGPT cites brands and ignores others", kind: "cluster" },
        { href: "/en/insights/chatgpt-content-format-study", label: "ChatGPT content format study 2026", kind: "cluster" },
        { href: "/en/insights/get-cited-in-chatgpt", label: "How to get cited in ChatGPT", kind: "cluster" },
      ]
    : [
        { href: "/insights/comment-apparaitre-reponses-chatgpt", label: "Comment apparaître dans les réponses ChatGPT", kind: "cluster" },
        { href: "/insights/pourquoi-chatgpt-cite-certaines-marques", label: "Pourquoi ChatGPT cite certaines marques", kind: "cluster" },
        { href: "/insights/format-contenu-chatgpt-2026", label: "Format de contenu préféré par ChatGPT (étude 2026)", kind: "cluster" },
        { href: "/insights/strategie-citation-chatgpt", label: "Stratégie de citation ChatGPT", kind: "cluster" },
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
