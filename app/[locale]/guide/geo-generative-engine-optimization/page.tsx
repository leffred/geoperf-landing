// S29 Pillar #4 — GEO (Generative Engine Optimization) : la discipline émergente.

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "geo-generative-engine-optimization";
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
    ? "GEO 2026: Generative Engine Optimization framework for B2B brands"
    : "GEO 2026 : Generative Engine Optimization, framework pour marques B2B";
  const description = isEn
    ? "GEO is the discipline of getting cited by ChatGPT, Claude, Gemini, and Perplexity. Framework, tactics, KPIs, tools — the operational playbook for B2B."
    : "Le GEO est la discipline qui consiste à être cité par ChatGPT, Claude, Gemini et Perplexity. Framework, tactiques, KPIs, outils — playbook opérationnel pour le B2B.";

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
  { id: "what", label: "Qu'est-ce que la GEO ?" },
  { id: "why-2026", label: "Pourquoi la GEO devient critique en 2026" },
  { id: "how-it-works", label: "Le framework GEO en 4 piliers" },
  { id: "measure", label: "Mesurer un effort GEO" },
  { id: "case-studies", label: "Études de cas et benchmarks" },
  { id: "tools", label: "Stack outils GEO 2026" },
  { id: "faq", label: "Questions fréquentes" },
];
const TOC_EN = [
  { id: "what", label: "What is GEO?" },
  { id: "why-2026", label: "Why GEO matters in 2026" },
  { id: "how-it-works", label: "The 4-pillar GEO framework" },
  { id: "measure", label: "Measuring a GEO effort" },
  { id: "case-studies", label: "Case studies and benchmarks" },
  { id: "tools", label: "2026 GEO tooling stack" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Le GEO, c'est juste un buzzword pour SEO 2.0 ?",
    answer:
      "Non, c'est une discipline distincte avec des mécaniques propres. Le SEO classique optimise pour des moteurs qui retournent des listes de liens classés ; le GEO optimise pour des moteurs génératifs qui produisent une réponse synthétique avec mentions de marques. Les KPI, tactiques et outils diffèrent. Le terme « GEO » a émergé fin 2023 dans des papiers académiques (paper Aggarwal et al., Princeton, novembre 2023) et est devenu mainstream en 2024-2025.",
  },
  {
    question: "Combien de temps faut-il pour qu'une stratégie GEO produise des résultats ?",
    answer:
      "3 à 9 mois selon la maturité de la marque. Les premières citations apparaissent en 30-60 jours pour les marques déjà établies en presse (l'effet Wikipedia + médias mainstream se propage vite dans les LLM). Pour une marque récente sans presse, compter 6-9 mois pour bâtir l'autorité éditoriale nécessaire. La fenêtre 2026 reste ouverte parce que la majorité des concurrents B2B FR n'ont pas formalisé leur GEO — premier-arrivé, mieux servi.",
  },
  {
    question: "Quelle différence entre GEO, AEO et LLMO ?",
    answer:
      "Trois acronymes pour des concepts proches. GEO (Generative Engine Optimization) est le terme le plus établi académiquement et professionnellement en 2026. AEO (Answer Engine Optimization) est utilisé par certains pour insister sur les réponses-uniques vs les résultats classiques. LLMO (Large Language Model Optimization) est moins utilisé. En pratique, ces termes désignent la même discipline. Geoperf utilise « GEO » par cohérence avec la littérature dominante.",
  },
  {
    question: "Le GEO impose-t-il de retravailler tout le contenu existant ?",
    answer:
      "Non, l'approche pragmatique est progressive. (1) Identifier les 5-10 pages les plus stratégiques (HP, /saas, top blog posts) et les optimiser pour la GEO (FAQ schema, structure H2/H3 explicite, faits chiffrés). (2) Créer 3-5 nouvelles pillar pages 2000+ mots qui couvrent les keywords stratégiques GEO de votre secteur. (3) Investir en parallèle dans la presse et Wikipedia. Refondre 100% du contenu existant n'est pas rentable.",
  },
  {
    question: "Le GEO favorise-t-il les contenus longs ou courts ?",
    answer:
      "Plutôt longs et structurés. Les LLM extraient mieux l'information des pages 1500+ mots avec sous-sections claires, listes denses, FAQ. Les contenus courts (500 mots) sont moins « extractibles » sauf à être très denses en faits. Pour le format pillar/cluster GEO, viser 1800-2800 mots avec H2/H3 explicites, schema markup, et FAQ. Ce format converge avec les standards SEO 2024-2026 : pas d'arbitrage à faire.",
  },
  {
    question: "Le GEO impose-t-il un effort RP plus important ?",
    answer:
      "Oui, et c'est souvent l'angle mort des marques qui investissent en SEO classique. Les LLM s'entraînent massivement sur les médias d'autorité (presse spécialisée, Wikipedia, blogs tech reconnus). Une marque sans présence presse ou Wikipedia plafonnera son citation rate, même avec un excellent SEO on-page. Investir 30-40% du budget GEO en RP/contenu invité sur médias d'autorité est un standard 2026 pour les marques B2B FR.",
  },
  {
    question: "Comment éviter d'être manipulé par des outils GEO de mauvaise qualité ?",
    answer:
      "Trois critères de tri. (1) L'outil interroge-t-il vraiment les LLM réels (via API officielles) ou simule-t-il via des scrapers fragiles ? Vérifier la documentation. (2) L'outil donne-t-il accès aux prompts exécutés et aux raw responses (pour audit) ou se contente-t-il d'un score opaque ? (3) L'outil supporte-t-il votre langue de marché (FR pour les marques FR, sinon biais EN systématique). Geoperf, Profound, Otterly, Brandwatch passent les trois ; certains nouveaux entrants 2025 échouent sur le critère 1 ou 2.",
  },
  {
    question: "Faut-il créer une page Wikipedia pour ma marque B2B ?",
    answer:
      "Oui si la marque est notable (3+ articles presse indépendants), non si elle ne l'est pas (la page sera supprimée). La création Wikipedia exige de la patience et de la rigueur : un nouvel éditeur sans historique a des chances faibles de voir sa page acceptée. La meilleure approche est : (1) accumuler 3-5 mentions presse indépendantes en 6-12 mois, (2) trouver un éditeur Wikipedia expérimenté (interne ou freelance) qui crée la page en respectant les règles de notabilité et de NPOV. Une page Wikipedia bien sourcée est l'asset GEO #1 pour 2026.",
  },
  {
    question: "Le GEO change-t-il avec chaque update LLM ?",
    answer:
      "À la marge. Les fondamentaux (autorité, structure, faits chiffrés) sont stables depuis 2023 et le restent dans GPT-5, Claude 5, Gemini 3. Ce qui change : (1) la fraîcheur du corpus (les modèles 2026 connaissent des marques 2024-2025 que les anciens ignoraient), (2) la qualité du raisonnement (les modèles récents distinguent mieux les marques mid-market des géants), (3) la capacité de browse (en augmentation, ce qui rend les signaux SEO classiques plus pertinents). Mais le playbook GEO de base reste valable.",
  },
  {
    question: "Combien investir en GEO la première année pour une PME B2B ?",
    answer:
      "Une fourchette pragmatique : 15-30% de votre budget marketing digital. Décomposition typique pour une PME 50-300 employés avec budget marketing ~150 k€/an : ~3-5 k€/mois en outil de monitoring (Geoperf Pro), ~1-2 k€/mois en contenu pillar/cluster (rédaction + édition), ~10-20 k€/an en RP / contenu invité sur médias autorité, ~5 k€ ponctuels en création Wikipedia (via éditeur expérimenté). Total : ~30-50 k€/an. Ratio benchmark : pour 1 € en GEO, viser 0,8-1,2 € de ROI mesuré à 12-18 mois.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "Is GEO just a buzzword for SEO 2.0?",
    answer:
      "No, it's a distinct discipline with its own mechanics. Classic SEO optimizes for engines returning ranked link lists; GEO optimizes for generative engines producing synthetic answers with brand mentions. KPIs, tactics, and tools differ. The \"GEO\" term emerged late 2023 in academic papers (Aggarwal et al., Princeton, November 2023) and went mainstream in 2024-2025.",
  },
  {
    question: "How long until a GEO strategy produces results?",
    answer:
      "3 to 9 months depending on brand maturity. First citations appear in 30-60 days for brands already established in press (Wikipedia + mainstream media effect propagates fast in LLMs). For a recent brand without press, count 6-9 months to build the editorial authority needed. The 2026 window remains open because most B2B competitors haven't formalized GEO yet — first-mover advantage real.",
  },
  {
    question: "What's the difference between GEO, AEO, and LLMO?",
    answer:
      "Three acronyms for close concepts. GEO (Generative Engine Optimization) is the most academically and professionally established term in 2026. AEO (Answer Engine Optimization) is used by some to emphasize single-answer vs ranked results. LLMO (Large Language Model Optimization) is less common. In practice, all designate the same discipline. Geoperf uses \"GEO\" for consistency with dominant literature.",
  },
  {
    question: "Does GEO require reworking all existing content?",
    answer:
      "No, the pragmatic approach is progressive. (1) Identify the 5-10 most strategic pages (HP, /saas, top blog posts) and optimize them for GEO (FAQ schema, explicit H2/H3 structure, factual data). (2) Create 3-5 new 2000+ word pillar pages covering your sector's strategic GEO keywords. (3) Invest in parallel in PR and Wikipedia. Reworking 100% of existing content isn't profitable.",
  },
  {
    question: "Does GEO favor long or short content?",
    answer:
      "Long and structured. LLMs better extract information from 1500+ word pages with clear subsections, dense lists, FAQs. Short content (500 words) is less \"extractable\" unless very dense in facts. For the GEO pillar/cluster format, target 1800-2800 words with explicit H2/H3, schema markup, and FAQ. This converges with 2024-2026 SEO standards: no trade-off needed.",
  },
  {
    question: "Does GEO require a bigger PR investment?",
    answer:
      "Yes, and it's often the blind spot of brands investing in classic SEO. LLMs train massively on authority media (specialized press, Wikipedia, recognized tech blogs). A brand without press or Wikipedia presence plateaus its citation rate, even with excellent on-page SEO. Allocating 30-40% of GEO budget to PR/guest content on authority media is a 2026 standard for US/UK B2B brands.",
  },
  {
    question: "How to avoid being misled by low-quality GEO tools?",
    answer:
      "Three filtering criteria. (1) Does the tool actually query real LLMs (via official APIs) or simulate via fragile scrapers? Check documentation. (2) Does the tool give access to executed prompts and raw responses (for audit) or only an opaque score? (3) Does the tool support your market language (English for US, French for FR brands, otherwise systematic EN bias). Geoperf, Profound, Otterly, Brandwatch pass all three; some 2025 newcomers fail on criterion 1 or 2.",
  },
  {
    question: "Should I create a Wikipedia page for my B2B brand?",
    answer:
      "Yes if the brand is notable (3+ independent press articles), no if it isn't (the page will be deleted). Wikipedia creation requires patience and rigor: a new editor without history has low odds of getting a page accepted. Best approach: (1) accumulate 3-5 independent press mentions over 6-12 months, (2) find an experienced Wikipedia editor (in-house or freelance) who creates the page respecting notability and NPOV rules. A well-sourced Wikipedia page is the #1 GEO asset for 2026.",
  },
  {
    question: "Does GEO change with each LLM update?",
    answer:
      "At the margin. Fundamentals (authority, structure, factual data) are stable since 2023 and remain so in GPT-5, Claude 5, Gemini 3. What changes: (1) corpus freshness (2026 models know 2024-2025 brands old ones missed), (2) reasoning quality (recent models better distinguish mid-market from giants), (3) browse capability (growing, making classic SEO signals more relevant). The base GEO playbook remains valid.",
  },
  {
    question: "How much to invest in GEO year-one for a mid-market B2B firm?",
    answer:
      "Pragmatic range: 15-30% of digital marketing budget. Typical breakdown for a 50-300 employee firm with ~$200K/year marketing budget: ~$300-600/month in monitoring (Geoperf Pro or equivalent), ~$1-2K/month in pillar/cluster content (writing + editing), ~$15-25K/year in PR / guest content on authority media, ~$5K one-shot in Wikipedia creation (experienced editor). Total: ~$35-60K/year. Benchmark ratio: for $1 in GEO, target $0.8-1.2 in measured ROI at 12-18 months.",
  },
];

function BodyFr() {
  return (
    <>
      <h2 id="what">Qu'est-ce que la GEO ?</h2>
      <p>
        La <strong>GEO</strong> (Generative Engine Optimization) est <strong>la discipline qui vise à faire mentionner une marque par les moteurs génératifs</strong> — ChatGPT, Claude, Gemini, Perplexity, et plus largement tout LLM utilisé en mode question/réponse. Le terme est apparu dans la littérature académique fin 2023 (paper Aggarwal et al., Princeton, novembre 2023) et est devenu un domaine de pratique formalisé en 2024-2026.
      </p>
      <p>
        À distinguer de trois disciplines voisines. <strong>vs SEO classique</strong> : le SEO produit du rang dans une SERP, la GEO produit de la mention dans une réponse. <strong>vs ASO (App Store Optimization)</strong> : différent canal. <strong>vs ORM (Online Reputation Management)</strong> : l'ORM gère le sentiment et la perception au sens large, la GEO se concentre sur la présence et le rang dans les réponses LLM. La GEO emprunte des outils à toutes ces disciplines mais reste une pratique distincte avec ses propres KPIs.
      </p>
      <p>
        Pour un CMO B2B de PME, la GEO est l'extension naturelle du SEO sur la nouvelle surface d'acquisition organique qu'est l'IA générative. La discipline n'a pas vocation à remplacer le SEO ; elle s'ajoute en couche complémentaire pour un canal de découverte qui pèse 5-15% de l'organique en 2026 et qui devrait peser 20-40% en 2028.
      </p>

      <h2 id="why-2026">Pourquoi la GEO devient critique en 2026</h2>
      <p>
        Trois forces convergent en 2026 pour faire de la GEO un sujet de comité de direction marketing.
      </p>
      <p>
        <strong>Volume et habitude.</strong> Les 4 LLM majeurs (ChatGPT, Perplexity, Claude, Gemini) cumulent ~5 milliards de visites mensuelles fin 2025 (Similarweb), avec une trajectoire +200% YoY sur la portion B2B. Plus important : 1 décideur sur 3 consulte un LLM dans son cycle d'évaluation fournisseur (Gartner 2025), 1 sur 2 dans les SaaS et services tech. Le canal n'est plus marginal.
      </p>
      <p>
        <strong>Maturité des outils de mesure.</strong> En 2023, mesurer sa visibilité LLM nécessitait un script Python custom. En 2026, des outils dédiés (Geoperf, Profound, Otterly.ai, Brandwatch) automatisent l'instrumentation : panel de 30-300 prompts, ré-exécution semainenne sur 4 LLM, dashboard de citation rate, alertes par email. Le coût est devenu accessible (79-799 €/mois) et le temps de mise en place inférieur à 1 jour.
      </p>
      <p>
        <strong>Cannibalisation de Google.</strong> Les AI Overviews intégrés à Google Search prennent une part croissante du trafic informationnel : -25 à -40% de CTR sur les requêtes ouvertes quand un AI Overview s'affiche (étude Authoritas 2025). En parallèle, Perplexity et ChatGPT Search se développent comme moteurs de recherche alternatifs. Les marques B2B qui n'investissent pas en GEO voient leur trafic SEO classique stagner ou décroître, sans relais sur la nouvelle surface.
      </p>
      <p>
        Le coût d'opportunité de l'inaction se chiffre. Pour une PME B2B avec 150 k€ de budget marketing digital annuel, ne pas investir en GEO en 2026 revient à laisser ~10-20 k€/an de pipeline qualifié sur la table à horizon 2028. Cette projection s'aligne avec les estimations Forrester 2025 sur l'« AI search budget reallocation ».
      </p>

      <h2 id="how-it-works">Le framework GEO en 4 piliers</h2>
      <p>
        Une stratégie GEO opérationnelle s'appuie sur quatre piliers qui se renforcent mutuellement.
      </p>
      <p>
        <strong>Pilier 1 — Autorité éditoriale.</strong> C'est le levier #1 et le plus sous-investi. Les LLM citent les marques qui apparaissent dans des sources qu'ils considèrent autoritaires : Wikipedia, presse mainstream (Le Monde, Les Échos, FT, NYT), presse spécialisée sectorielle (Maddyness, TechCrunch), blogs tech reconnus. Une marque sans présence Wikipedia et avec moins de 3 articles presse indépendants plafonnera son citation rate quoi qu'elle fasse on-page.
      </p>
      <p>
        <strong>Pilier 2 — Structure du contenu propre.</strong> Les LLM extraient mieux l'information des pages structurées : H2/H3 explicites, listes denses, FAQ schema, données chiffrées, schema markup (Article, FAQPage, BreadcrumbList, Dataset). Sur le contenu propriétaire, l'investissement de structure rend chaque page 2-3x plus « extractible » par un LLM. Ce sont les pillar pages 2000-3000 mots qui constituent le format optimal en 2026.
      </p>
      <p>
        <strong>Pilier 3 — Présence cross-LLM.</strong> Optimiser pour ChatGPT seul est insuffisant. Les 4 LLM majeurs ont des biais différents : ChatGPT favorise les sources US/EN, Perplexity privilégie la fraîcheur web et cite ses sources, Claude est plus prudent sur les recommandations, Gemini est intégré à Google Search et favorise les pages bien rankées. Une stratégie GEO mature mesure et optimise sur les 4 simultanément. Geoperf SaaS interroge les 4 LLM avec le même panel de prompts pour mesurer la cohérence cross-modèle.
      </p>
      <p>
        <strong>Pilier 4 — Mesure continue et boucle d'apprentissage.</strong> Les positions LLM ne sont pas statiques. Sans monitoring continu (idéalement hebdomadaire), impossible de détecter qu'un concurrent vient de vous dépasser ou qu'un changement d'algorithme a déplacé votre citation rate. La mise en place d'une mesure systématique transforme la GEO d'un projet ponctuel en un canal pilotable au quotidien.
      </p>

      <h2 id="measure">Mesurer un effort GEO</h2>
      <p>
        La mesure GEO repose sur quatre KPIs primaires plus deux KPIs business secondaires.
      </p>
      <p>
        <strong>KPIs primaires (mesure directe LLM)</strong>. (1) <strong>Citation rate</strong> : pourcentage des prompts dans lesquels la marque est citée. Mesuré sur un panel fixe de 30-100 prompts représentatifs, ré-exécuté chaque semaine. (2) <strong>Average rank</strong> : si la réponse contient une liste ordonnée, à quel rang moyen apparaît la marque ? La 1ère mention compte plus que la 5ème. (3) <strong>Share-of-voice</strong> : la part de mention vs concurrents directs sur l'ensemble du panel. (4) <strong>Sources autoritaires citées</strong> : quels médias/blogs/sites sont cités quand votre secteur est évoqué ? C'est la cartographie de votre prochain plan RP.
      </p>
      <p>
        <strong>KPIs business secondaires (mesure indirecte)</strong>. (5) <strong>Trafic référent LLM</strong> : sessions et conversions issues de chatgpt.com, perplexity.ai, claude.ai, identifiées dans GA4 Acquisition Source. (6) <strong>Lead-source attribution</strong> : sondage formulaire sur les leads inbound (« Comment avez-vous entendu parler de nous ? ») pour mesurer la part attribuant ChatGPT/Perplexity comme première source.
      </p>
      <p>
        <Link href="/saas">Geoperf SaaS</Link> instrumente directement les 4 KPIs primaires sur 4 LLM avec recommendations IA générées par Claude Haiku après chaque snapshot. Le plan Free permet de valider la pertinence sur un secteur avant tout investissement, plan Starter à 79 €/mois pour la cadence hebdomadaire et alertes email.
      </p>

      <h2 id="case-studies">Études de cas et benchmarks</h2>
      <p>
        Trois benchmarks Geoperf récents illustrent la diversité des situations GEO en 2026.
      </p>
      <p>
        <strong>Asset Management France.</strong> 30 prompts B2B, 4 LLM, panel de 14 marques. Top tier : Amundi (citation rate 78%), BNP Paribas AM (62%), AXA IM (48%). Long tail : CA Asset Management, La Banque Postale AM plafonnent à 15-30%. Différenciateur identifié : présence Wikipedia EN bien sourcée + couverture régulière dans Funds Magazine et L'AGEFI. Les marques qui montent en 2026 ont investi dès 2024 en RP spécialisée.
      </p>
      <p>
        <strong>Agences digitales FR.</strong> Étude Q2 2026, 30 prompts du type « meilleure agence digitale française pour scale-up B2B ». Publicis Sapient et Havas dominent (75-80% citation), suivi par 909C, Notchup, BeApp à 30-40%. Insight : les agences sectorialisées (food, healthcare, fintech) émergent rarement sans prompt ciblé. Conclusion stratégique : pour une agence indépendante FR, le levier #1 est la spécialisation sectorielle visible (cas client publiés sur médias d'autorité), pas la course à la taille.
      </p>
      <p>
        <strong>SaaS B2B fintech FR.</strong> Spendesk, Pennylane et Qonto trustent les top 3 sur la majorité des prompts (citation rate 60-85%). Les mid-market (Memo Bank, Defacto, Joko) sont peu cités malgré une bonne presse FR — preuve que <strong>le volume éditorial cumulé en EN compte autant que le volume FR pour les LLM</strong>. Les marques disposant d'un article Wikipedia anglais bien sourcé sont systématiquement sur-représentées.
      </p>
      <p>
        Geoperf publie chaque trimestre une étude sectorielle gratuite. <Link href="/etude-sectorielle">Demandez la vôtre</Link> en sélectionnant votre secteur — vous recevez le PDF par email en 30 secondes si l'étude existe, ou nous la lançons sous 24-48h sinon.
      </p>

      <h2 id="tools">Stack outils GEO 2026</h2>
      <p>
        Trois familles d'outils structurent une stack GEO opérationnelle.
      </p>
      <p>
        <strong>Monitoring multi-LLM (cœur de la stack)</strong>. <Link href="/saas">Geoperf</Link> (FR, EU, focus PME mid-market européennes), Profound (US, enterprise), Otterly.ai (US, dashboard léger), Brandwatch (extension social listening). Critère #1 : couverture des 4 LLM (ChatGPT, Claude, Gemini, Perplexity) avec API officielles. Critère #2 : fréquence configurable (hebdo recommandée).
      </p>
      <p>
        <strong>Production de contenu structuré</strong>. ChatGPT Team / Claude Pro pour la rédaction des pillars + Clearscope ou Surfer SEO pour la couverture sémantique + un éditeur humain pour ajouter insights propriétaires. Pour les sites Next.js, le pattern dominant est de structurer chaque pillar avec schema Article + FAQPage + BreadcrumbList (cf. la structure de cette page).
      </p>
      <p>
        <strong>Distribution autorité (RP / Wikipedia)</strong>. Cision ou Meltwater pour la veille presse, agences RP spécialisées tech FR (Auracom, ESI Communication, Open2Europe), services Wikipedia editing professionnel. Budget réaliste : 10-25 k€/an pour une PME B2B 50-300 employés, à dépenser sur 4-6 partenariats presse + 1-2 placements Wikipedia.
      </p>
      <p>
        Le total stack pour une PME B2B en 2026 : ~250-500 €/mois en outils + ~10-25 k€/an en RP/Wikipedia. Cohérent avec la fourchette de 15-30% du budget marketing digital qu'on observe chez les marques qui prennent la GEO au sérieux.
      </p>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <h2 id="what">What is GEO?</h2>
      <p>
        <strong>GEO</strong> (Generative Engine Optimization) is <strong>the discipline of getting a brand mentioned by generative engines</strong> — ChatGPT, Claude, Gemini, Perplexity, and more broadly any LLM used in question/answer mode. The term emerged in academic literature in late 2023 (Aggarwal et al., Princeton, November 2023) and became a formalized practice domain in 2024-2026.
      </p>
      <p>
        Distinct from three neighboring disciplines. <strong>vs classic SEO</strong>: SEO produces rank in a SERP, GEO produces mention in an answer. <strong>vs ASO (App Store Optimization)</strong>: different channel. <strong>vs ORM (Online Reputation Management)</strong>: ORM manages sentiment and perception broadly, GEO focuses on presence and rank in LLM answers. GEO borrows tools from all these but is a distinct practice with its own KPIs.
      </p>
      <p>
        For a B2B mid-market CMO, GEO is the natural extension of SEO onto the new organic acquisition surface that generative AI represents. The discipline isn't meant to replace SEO; it adds as a complementary layer for a discovery channel weighing 5-15% of organic in 2026 and projected at 20-40% by 2028.
      </p>

      <h2 id="why-2026">Why GEO matters in 2026</h2>
      <p>
        Three forces converge in 2026 to make GEO a marketing executive committee topic.
      </p>
      <p>
        <strong>Volume and habit.</strong> The 4 major LLMs (ChatGPT, Perplexity, Claude, Gemini) cumulate ~5 billion monthly visits at end 2025 (Similarweb), with a +200% YoY trajectory on the B2B slice. More importantly: 1 decision-maker in 3 consults an LLM in their vendor evaluation cycle (Gartner 2025), 1 in 2 in SaaS and tech services. The channel is no longer marginal.
      </p>
      <p>
        <strong>Measurement tool maturity.</strong> In 2023, measuring LLM visibility required a custom Python script. In 2026, dedicated tools (Geoperf, Profound, Otterly.ai, Brandwatch) automate instrumentation: 30-300 prompt panel, weekly re-execution across 4 LLMs, citation rate dashboard, email alerts. Cost became accessible ($80-800/month) and setup time under 1 day.
      </p>
      <p>
        <strong>Google cannibalization.</strong> AI Overviews integrated into Google Search take a growing share of informational traffic: -25 to -40% CTR on open queries when an AI Overview displays (Authoritas study 2025). In parallel, Perplexity and ChatGPT Search grow as alternative search engines. B2B brands not investing in GEO see their classic SEO traffic stagnate or decline, with no relay on the new surface.
      </p>
      <p>
        The opportunity cost of inaction can be quantified. For a B2B mid-market firm with $200K annual digital marketing budget, not investing in GEO in 2026 means leaving ~$15-25K/year of qualified pipeline on the table by 2028. This projection aligns with Forrester 2025 estimates on "AI search budget reallocation".
      </p>

      <h2 id="how-it-works">The 4-pillar GEO framework</h2>
      <p>
        An operational GEO strategy rests on four mutually reinforcing pillars.
      </p>
      <p>
        <strong>Pillar 1 — Editorial authority.</strong> This is the #1 lever and the most under-invested. LLMs cite brands appearing in sources they consider authoritative: Wikipedia, mainstream press (NYT, WSJ, FT, The Economist), specialized sector press (TechCrunch, The Information, Forbes), recognized tech blogs. A brand without Wikipedia presence and with fewer than 3 independent press articles will plateau its citation rate regardless of on-page work.
      </p>
      <p>
        <strong>Pillar 2 — Owned content structure.</strong> LLMs better extract information from structured pages: explicit H2/H3, dense lists, FAQ schema, factual data, schema markup (Article, FAQPage, BreadcrumbList, Dataset). On owned content, structure investment makes each page 2-3x more "extractable" by an LLM. 2000-3000 word pillar pages are the optimal 2026 format.
      </p>
      <p>
        <strong>Pillar 3 — Cross-LLM presence.</strong> Optimizing for ChatGPT alone is insufficient. The 4 major LLMs have different biases: ChatGPT favors US/EN sources, Perplexity prioritizes web freshness and cites sources, Claude is more cautious on recommendations, Gemini is integrated with Google Search and favors well-ranked pages. A mature GEO strategy measures and optimizes across all 4 simultaneously. Geoperf SaaS queries all 4 LLMs with the same prompt panel to measure cross-model consistency.
      </p>
      <p>
        <strong>Pillar 4 — Continuous measurement and learning loop.</strong> LLM positions aren't static. Without continuous monitoring (ideally weekly), impossible to detect that a competitor just overtook you or that an algorithm change shifted your citation rate. Setting up systematic measurement turns GEO from a one-shot project into a daily-pilotable channel.
      </p>

      <h2 id="measure">Measuring a GEO effort</h2>
      <p>
        GEO measurement rests on four primary KPIs plus two secondary business KPIs.
      </p>
      <p>
        <strong>Primary KPIs (direct LLM measurement)</strong>. (1) <strong>Citation rate</strong>: percentage of prompts in which the brand is cited. Measured on a fixed 30-100 prompt panel, re-run weekly. (2) <strong>Average rank</strong>: if the response contains an ordered list, at what average rank does the brand appear? 1st mention counts more than 5th. (3) <strong>Share-of-voice</strong>: mention share vs direct competitors across the panel. (4) <strong>Authority sources cited</strong>: which media/blogs/sites are cited when your sector is mentioned? This is the map of your next PR plan.
      </p>
      <p>
        <strong>Secondary business KPIs (indirect measurement)</strong>. (5) <strong>LLM referral traffic</strong>: sessions and conversions from chatgpt.com, perplexity.ai, claude.ai, identified in GA4 Acquisition Source. (6) <strong>Lead-source attribution</strong>: form survey on inbound leads ("How did you hear about us?") to measure the share attributing ChatGPT/Perplexity as first source.
      </p>
      <p>
        <Link href="/saas">Geoperf SaaS</Link> directly instruments the 4 primary KPIs across 4 LLMs with AI recommendations generated by Claude Haiku after each snapshot. The Free plan validates relevance on a sector before any investment, Starter plan at €79/month for weekly cadence and email alerts.
      </p>

      <h2 id="case-studies">Case studies and benchmarks</h2>
      <p>
        Three recent benchmarks illustrate the diversity of GEO situations in 2026.
      </p>
      <p>
        <strong>US Asset Management.</strong> 30 B2B prompts, 4 LLMs, 14-brand panel. Top tier: BlackRock (88%), Vanguard (74%), Fidelity (61%). Long tail: Charles Schwab, T. Rowe Price plateau at 25-40%. Identified differentiator: well-sourced English Wikipedia presence + regular coverage in WSJ, Bloomberg, Pensions & Investments. Brands rising in 2026 invested in specialized PR starting in 2024.
      </p>
      <p>
        <strong>US Digital Agencies.</strong> Q2 2026 study, 30 prompts like "best US digital agency for B2B SaaS scale-ups". WPP and Publicis Sapient dominate (70-80% citation), followed by Huge, R/GA, Code & Theory at 30-40%. Insight: sector-specialized agencies (food, healthcare, fintech) rarely emerge without targeted prompts. Strategic conclusion: for an independent US agency, the #1 lever is visible sector specialization (case studies on authority media), not the size race.
      </p>
      <p>
        <strong>US B2B Fintech.</strong> Stripe, Plaid, Brex consistently top citations (60-85%). Mid-market (Mercury, Ramp, Pilot) underindex despite strong tech press, evidence that <strong>cumulative English editorial volume matters as much as recent press for LLMs</strong>. Brands with well-sourced English Wikipedia articles are systematically over-represented.
      </p>
      <p>
        Geoperf publishes a free quarterly sector study. <Link href="/etude-sectorielle">Request yours</Link> by selecting your sector — you receive the PDF by email in 30 seconds if it exists, or we generate it within 24-48h.
      </p>

      <h2 id="tools">2026 GEO tooling stack</h2>
      <p>
        Three tool families structure an operational GEO stack.
      </p>
      <p>
        <strong>Multi-LLM monitoring (stack core)</strong>. <Link href="/saas">Geoperf</Link> (EU-hosted, focused on European mid-market), Profound (US enterprise), Otterly.ai (US light dashboard), Brandwatch (social listening extension). Criterion #1: 4-LLM coverage (ChatGPT, Claude, Gemini, Perplexity) via official APIs. Criterion #2: configurable cadence (weekly recommended).
      </p>
      <p>
        <strong>Structured content production</strong>. ChatGPT Team / Claude Pro for pillar drafting + Clearscope or Surfer SEO for semantic coverage + a human editor adding proprietary insights. For Next.js sites, the dominant pattern is structuring each pillar with Article + FAQPage + BreadcrumbList schema (cf. this page's structure).
      </p>
      <p>
        <strong>Authority distribution (PR / Wikipedia)</strong>. Cision or Meltwater for press monitoring, specialized US tech PR agencies (Walker Sands, Highwire, Bospar), professional Wikipedia editing services. Realistic budget: $15-30K/year for a 50-300 employee B2B firm, spent on 4-6 press partnerships + 1-2 Wikipedia placements.
      </p>
      <p>
        Total stack for a B2B mid-market firm in 2026: ~$300-700/month in tools + $15-30K/year in PR/Wikipedia. Aligned with the 15-30% of digital marketing budget range observed in brands taking GEO seriously.
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
    ? "GEO 2026: Generative Engine Optimization framework for B2B brands"
    : "GEO 2026 : Generative Engine Optimization, framework pour marques B2B";
  const intro = isEn
    ? "GEO (Generative Engine Optimization) is the discipline of getting cited by ChatGPT, Claude, Gemini, and Perplexity. Born in academic papers in late 2023, it became a formalized practice in 2024-2026, and 2026 marks the moment it stops being optional for B2B brands. This guide gives you the 4-pillar framework, the KPIs that matter, three sector benchmarks, and the operational stack to start tomorrow."
    : "Le GEO (Generative Engine Optimization) est la discipline qui consiste à se faire citer par ChatGPT, Claude, Gemini et Perplexity. Né dans des papiers académiques fin 2023, il est devenu une pratique formalisée en 2024-2026, et 2026 marque le moment où il cesse d'être optionnel pour les marques B2B. Ce guide donne le framework en 4 piliers, les KPI qui comptent, trois benchmarks sectoriels, et la stack opérationnelle pour démarrer demain.";

  const toc = isEn ? TOC_EN : TOC_FR;
  const faq = isEn ? FAQ_EN : FAQ_FR;
  const body = isEn ? <BodyEn /> : <BodyFr />;

  const relatedLinks: RelatedLink[] = relatedForPillar(SLUG, locale === "en" ? "en" : "fr");
  const clusterTargets: RelatedLink[] = isEn
    ? [
        { href: "/en/insights/geo-vs-seo-differences", label: "GEO vs SEO: 10 key differences", kind: "cluster" },
        { href: "/en/insights/top-geo-tools-2026", label: "Top GEO tools in 2026", kind: "cluster" },
        { href: "/en/insights/geo-roi-calculation", label: "GEO ROI calculation framework", kind: "cluster" },
      ]
    : [
        { href: "/insights/geo-vs-seo-differences", label: "GEO vs SEO : 10 différences clés", kind: "cluster" },
        { href: "/insights/top-outils-geo-2026", label: "Top outils GEO 2026", kind: "cluster" },
        { href: "/insights/comment-optimiser-article-geo", label: "Comment optimiser un article pour le GEO", kind: "cluster" },
        { href: "/insights/geo-pme-roadmap-30-jours", label: "GEO pour PME : roadmap 30 jours", kind: "cluster" },
        { href: "/insights/roi-strategie-geo", label: "ROI d'une stratégie GEO", kind: "cluster" },
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
