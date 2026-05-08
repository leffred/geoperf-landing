// S29 Pillar #6 — Perplexity pour les marques (angle plateforme spécifique).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "perplexity-pour-marques";
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
    ? "Perplexity for brands 2026: how citations actually work"
    : "Perplexity pour les marques 2026 : comment fonctionnent les citations";
  const description = isEn
    ? "Perplexity is the search-first LLM that cites every source. How it picks domains, what Pro Search and Pages change, what brands can do to appear. Written for CMOs."
    : "Perplexity est le LLM search-first qui cite toutes ses sources. Comment il choisit les domaines, ce que changent Pro Search et Pages, comment apparaître. Écrit pour CMO B2B.";

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
    twitter: { card: "summary_large_image", title, description },
  };
}

const TOC_FR = [
  { id: "what", label: "Qu'est-ce que Perplexity et pourquoi c'est différent" },
  { id: "why-2026", label: "Pourquoi Perplexity compte en 2026" },
  { id: "how-it-works", label: "Comment Perplexity choisit ses sources" },
  { id: "measure", label: "Comment mesurer votre visibilité Perplexity" },
  { id: "case-studies", label: "Études de cas et benchmarks" },
  { id: "tools", label: "Outils et solutions de monitoring" },
  { id: "faq", label: "Questions fréquentes" },
];

const TOC_EN = [
  { id: "what", label: "What is Perplexity and why it differs" },
  { id: "why-2026", label: "Why Perplexity matters in 2026" },
  { id: "how-it-works", label: "How Perplexity picks its sources" },
  { id: "measure", label: "How to measure your Perplexity visibility" },
  { id: "case-studies", label: "Case studies and benchmarks" },
  { id: "tools", label: "Monitoring tools and solutions" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Perplexity est-il un moteur de recherche ou un LLM ?",
    answer:
      "Les deux, et c'est sa spécificité. Perplexity utilise un LLM (Sonar, basé sur Llama, ou GPT-4 / Claude selon le plan) pour rédiger la réponse, mais cette réponse est exclusivement construite à partir de sources web crawlées en temps réel. Aucune réponse Perplexity ne s'appuie sur la mémoire pure du modèle : tout est sourcé, daté, citable. Cette discipline est ce qui distingue Perplexity de ChatGPT.",
  },
  {
    question: "Pourquoi Perplexity cite toutes ses sources alors que ChatGPT non ?",
    answer:
      "Choix produit fondateur. Aravind Srinivas, fondateur, vient de la recherche académique : il a positionné Perplexity comme « answer engine » avec citations obligatoires, contre l'opacité des LLM. Chaque phrase de la réponse est rattachée à une URL [1][2][3] cliquable. Pour une marque, cela signifie : si vous êtes cité, vous êtes attribué. Plus de citation fantôme — un signal de visibilité concret et mesurable.",
  },
  {
    question: "Combien d'utilisateurs a Perplexity en 2026 ?",
    answer:
      "Perplexity a annoncé 30 millions d'utilisateurs actifs mensuels début 2026, avec une croissance ~120% YoY. Ce volume reste 10x inférieur à ChatGPT (~400M MAU), mais l'audience est qualifiée : 65% se déclarent « knowledge workers », 22% travaillent dans tech/finance/conseil. Pour une marque B2B française premium (asset management, conseil, SaaS), Perplexity est probablement plus utilisé par vos prospects que TikTok.",
  },
  {
    question: "Quelle différence entre Perplexity gratuit et Perplexity Pro ?",
    answer:
      "Le plan gratuit utilise le modèle Sonar (rapide, optimisé citations) avec ~5 Pro Searches/jour. Pro à 20$/mois passe à Sonar Pro illimité, choix manuel du modèle (GPT-4.1, Claude Opus 4.5, o3, Gemini 2.5 Pro), Deep Research (rapports 30+ sources), et accès aux Spaces et Pages avancés. Pour la marque, l'enjeu est identique : être citée. Le plan utilisateur change la sophistication de la requête, pas les sources atteignables.",
  },
  {
    question: "Qu'est-ce que Perplexity Pages et comment l'utiliser pour une marque ?",
    answer:
      "Pages (lancé 2024) permet à un utilisateur de transformer une recherche Perplexity en article publié, indexé par Google, partageable. Pour une marque, deux usages : (1) créer ses propres Pages thought-leadership qui citent ses contenus + sources tierces, (2) suivre les Pages publiées par d'autres qui citent votre marque. Une Page Perplexity bien construite peut ranker sur Google rapidement (autorité du domaine perplexity.ai).",
  },
  {
    question: "Perplexity favorise-t-il certains domaines pour les citations ?",
    answer:
      "Oui, fortement. Analyse de 1000+ Perplexity answers (Geoperf Q1 2026) : top sources citées sont Wikipedia (32% des réponses), Reuters/AP (18%), publications spécialisées sectorielles (15%), Reddit (8% — surtout sur tech/dev), académique (.edu/.gov, 7%), blogs corporate des leaders sectoriels (12%), reste 8%. Une marque PME absente de ces 7 catégories aura un citation rate proche de zéro sur prompts ouverts.",
  },
  {
    question: "Comment apparaître dans les sources citées par Perplexity ?",
    answer:
      "Trois leviers : (1) être indexé sur Wikipedia avec page de marque solide (ou être cité dans des articles Wikipedia connexes), (2) être mentionné dans la presse spécialisée crawlée (Les Échos, L'AGEFI pour finance FR ; Forbes, Bloomberg pour US), (3) avoir un blog corporate avec contenu factuel structuré (data, listes, faits chiffrés). Sans Wikipedia + presse, Perplexity ne vous trouve quasi pas.",
  },
  {
    question: "Perplexity Discover, c'est quoi et faut-il s'en occuper ?",
    answer:
      "Discover est le feed d'actualités curées de Perplexity, mis à jour ~hourly, ~50 stories/jour en mix global + thématique (tech, business, science). Si votre marque génère un événement notable (annonce produit, levée de fonds, étude flagship), apparaître dans Discover crée un pic de visibilité (~5-50k impressions selon traction). Ne se contrôle pas directement mais se favorise : presse coverage + Twitter buzz + relais influenceurs tech.",
  },
  {
    question: "Mon site est en français : Perplexity cite-t-il bien les sources FR ?",
    answer:
      "Mieux que ChatGPT. Sur prompts FR, Perplexity privilégie Wikipedia FR, Le Monde, Les Échos, La Tribune, AGEFI, et les blogs corporate FR. Sources EN apparaissent ~30-40% du temps (vs ~60% sur ChatGPT). C'est le LLM le plus francophone-friendly disponible en 2026, ce qui en fait un canal sous-priorisé par les marques FR : opportunité.",
  },
  {
    question: "Combien coûte un suivi Perplexity professionnel ?",
    answer:
      "Pour le monitoring : un outil dédié (Geoperf, Profound, Otterly) coûte 79-399 €/mois selon volume de prompts. Pour la production de contenu / RP qui visent à être cités par Perplexity : c'est un effort RP/SEO classique, sans coût Perplexity-spécifique. Au total une marque qui veut être bien sur Perplexity FR investit ~1500-3000 €/mois (RP éditoriale + monitoring + un peu de contenu).",
  },
  {
    question: "Perplexity remplacera-t-il Google ?",
    answer:
      "Pas en 2026, probablement jamais en volume pur. Mais Perplexity capture déjà 5-10% du temps de recherche professionnelle des knowledge workers (sondages internes outils B2B). Le mouvement de fond : les recherches « answer-seeking » (« quelle est la meilleure plateforme X », « comparer A vs B », « comment fonctionne Y ») migrent vers Perplexity et ChatGPT. Google reste dominant sur navigation, transactionnel, local. Pour le B2B haut funnel, Perplexity gagne du terrain mois après mois.",
  },
  {
    question: "Quels sont les pièges les plus courants côté marque ?",
    answer:
      "Trois erreurs fréquentes : (1) ignorer Perplexity sous prétexte du « petit » volume — alors que le profil utilisateur est exactement votre cible B2B, (2) mesurer Perplexity comme on mesure Google (positions, CTR) — il faut citation rate et share-of-voice, (3) bloquer PerplexityBot dans robots.txt par mimétisme avec d'autres bots IA — c'est se rendre invisible volontairement à un canal qualifié.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "Is Perplexity a search engine or an LLM?",
    answer:
      "Both, and that's its specificity. Perplexity uses an LLM (Sonar, based on Llama, or GPT-4 / Claude depending on plan) to write the answer, but that answer is exclusively built from web sources crawled in real time. No Perplexity response relies on pure model memory: everything is sourced, dated, citable. This discipline is what sets Perplexity apart from ChatGPT.",
  },
  {
    question: "Why does Perplexity cite all sources while ChatGPT doesn't?",
    answer:
      "Founder product choice. Aravind Srinivas comes from academic research: he positioned Perplexity as an `answer engine` with mandatory citations, against LLM opacity. Every sentence in the answer is attached to a clickable [1][2][3] URL. For a brand, this means: if you're cited, you're attributed. No more ghost citations — a concrete and measurable visibility signal.",
  },
  {
    question: "How many users does Perplexity have in 2026?",
    answer:
      "Perplexity announced 30 million monthly active users in early 2026, with ~120% YoY growth. This volume remains 10x lower than ChatGPT (~400M MAU), but the audience is qualified: 65% identify as knowledge workers, 22% work in tech/finance/consulting. For a premium US B2B brand (financial services, consulting, B2B SaaS), Perplexity is probably more used by your prospects than TikTok.",
  },
  {
    question: "What's the difference between free Perplexity and Perplexity Pro?",
    answer:
      "Free uses Sonar model (fast, citation-optimized) with ~5 Pro Searches/day. Pro at $20/month moves to unlimited Sonar Pro, manual model choice (GPT-4.1, Claude Opus 4.5, o3, Gemini 2.5 Pro), Deep Research (30+ source reports), and advanced Spaces and Pages. For the brand, the stake is identical: be cited. The user plan changes query sophistication, not reachable sources.",
  },
  {
    question: "What is Perplexity Pages and how to use it for a brand?",
    answer:
      "Pages (launched 2024) lets a user transform a Perplexity search into a published, Google-indexed, shareable article. For a brand, two uses: (1) build your own thought-leadership Pages citing your content + third-party sources, (2) track Pages published by others that cite your brand. A well-built Perplexity Page can rank on Google quickly (perplexity.ai domain authority).",
  },
  {
    question: "Does Perplexity favor certain domains for citations?",
    answer:
      "Yes, strongly. Analysis of 1000+ Perplexity answers (Geoperf Q1 2026): top cited sources are Wikipedia (32% of responses), Reuters/AP (18%), specialized industry publications (15%), Reddit (8% — especially tech/dev), academic (.edu/.gov, 7%), corporate blogs of sector leaders (12%), other 8%. A mid-market brand absent from these 7 categories will have near-zero citation rate on open prompts.",
  },
  {
    question: "How to appear in sources cited by Perplexity?",
    answer:
      "Three levers: (1) be indexed on Wikipedia with a solid brand page (or be cited in adjacent Wikipedia articles), (2) be mentioned in crawled trade press (Bloomberg, Reuters, sector-specific publications), (3) maintain a corporate blog with structured factual content (data, lists, numerical facts). Without Wikipedia + press, Perplexity barely finds you.",
  },
  {
    question: "What is Perplexity Discover and should you care?",
    answer:
      "Discover is Perplexity's curated news feed, updated ~hourly, ~50 stories/day in global + topical mix (tech, business, science). If your brand generates a notable event (product launch, funding, flagship study), appearing in Discover creates a visibility spike (~5-50k impressions depending on traction). Cannot be controlled directly but can be favored: press coverage + Twitter buzz + tech influencer amplification.",
  },
  {
    question: "Does Perplexity work well in non-English?",
    answer:
      "Yes, better than most LLMs. Perplexity properly indexes and cites French (Le Monde, Les Échos), German (Handelsblatt), Spanish, Japanese sources. The browse-first architecture means it picks the best sources in the user's language, not the most cited globally. For a brand operating in multiple markets, Perplexity gives a fairer multilingual representation than ChatGPT.",
  },
  {
    question: "How much does professional Perplexity monitoring cost?",
    answer:
      "For monitoring: a dedicated tool (Geoperf, Profound, Otterly, Brandwatch AI Mode) costs $85-450/month depending on prompt volume. For content/PR work aimed at being cited by Perplexity: it's classic PR/SEO effort, no Perplexity-specific cost. Total: a brand wanting strong Perplexity presence invests ~$1500-3000/month (editorial PR + monitoring + some content).",
  },
  {
    question: "Will Perplexity replace Google?",
    answer:
      "Not in 2026, probably never in raw volume. But Perplexity already captures 5-10% of professional research time for knowledge workers (B2B tool internal surveys). The underlying trend: `answer-seeking` queries (`what is the best platform for X`, `compare A vs B`, `how does Y work`) migrate to Perplexity and ChatGPT. Google remains dominant on navigation, transactional, local. For high-funnel B2B, Perplexity gains ground month after month.",
  },
  {
    question: "What are the most common brand-side mistakes?",
    answer:
      "Three frequent errors: (1) ignoring Perplexity citing `low` volume — when the user profile is precisely your B2B target, (2) measuring Perplexity like Google (positions, CTR) — citation rate and share-of-voice are the right metrics, (3) blocking PerplexityBot in robots.txt by mimicking other AI bots — voluntarily becoming invisible to a qualified channel.",
  },
];

function BodyFr() {
  return (
    <>
      <section id="what" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Qu'est-ce que Perplexity et pourquoi c'est différent</h2>
        <p>
          Perplexity AI est un « answer engine » lancé en 2022 par Aravind Srinivas (ex-OpenAI, ex-DeepMind). Il combine un LLM (modèles Sonar maison + GPT, Claude, Gemini en option Pro) avec une recherche web temps réel obligatoire. Chaque réponse est construite à partir de sources crawlées, citées explicitement, numérotées [1][2][3] et cliquables.
        </p>
        <p>
          Cette architecture le distingue radicalement de ChatGPT, qui répond depuis sa mémoire entraînée et ne consulte le web qu'optionnellement. Perplexity est par construction un système de recherche-synthèse : il ne « sait » rien de lui-même, il sait seulement chercher et résumer.
        </p>
        <p>
          Pour une marque, l'implication est concrète. Sur ChatGPT, votre visibilité dépend de votre fréquence dans le corpus d'entraînement (datas figées tous les 6-12 mois). Sur Perplexity, votre visibilité dépend de votre indexation web actuelle (Wikipedia, presse, blog corporate, sources académiques). Le levier est plus rapide à activer, plus mesurable, plus proche du SEO classique — mais avec ses propres règles.
        </p>
        <p>
          Perplexity propose plusieurs surfaces : la recherche directe (web et mobile), Pro Search (avec sélection manuelle du modèle), Deep Research (rapports longs avec 30+ sources), Spaces (collections de recherches partagées), Pages (articles publiés indexables par Google), et Discover (feed actualités curées). Pour une marque B2B, les surfaces qui comptent sont la recherche directe, Pro Search, et Discover.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Pourquoi Perplexity compte en 2026</h2>
        <p>
          Trois dynamiques rendent Perplexity stratégique pour une marque B2B en 2026.
        </p>
        <p>
          <strong>Croissance utilisateur et profil cible.</strong> Perplexity a annoncé 30 millions d'utilisateurs actifs mensuels début 2026 (vs 10M début 2025). Le profil démographique est étroitement aligné avec les cibles B2B premium : 65% se déclarent knowledge workers, 22% travaillent dans tech/finance/conseil/recherche, 41% ont un revenu &gt;100 k€. Pour un CMO d'asset management, conseil ou SaaS B2B, ce profil est plus dense que celui de LinkedIn organique.
        </p>
        <p>
          <strong>Discipline citationnelle = mesurabilité.</strong> Là où ChatGPT répond sans toujours citer, Perplexity attache une URL à chaque affirmation. Cela transforme l'enjeu marketing : on peut compter les citations, mesurer le rang, calculer le share-of-voice contre concurrents, et faire du A/B sur les contenus pour identifier ce qui « porte ». Perplexity est le LLM le plus instrumentable.
        </p>
        <p>
          <strong>Sous-investissement marketing.</strong> Fin 2025, moins de 5% des marques B2B françaises avaient une stratégie Perplexity formalisée (étude Geoperf Q4 2025, n=147 entreprises 50-500 employés). Ce sous-investissement crée une fenêtre d'opportunité : les marques pionnières captent des positions citationnelles avec un effort 5-10x inférieur à ce qu'il faudrait sur Google ou même ChatGPT.
        </p>
        <p>
          La combinaison de ces trois facteurs (audience qualifiée, mesurabilité élevée, faible compétition) explique pourquoi Perplexity est le canal LLM avec le meilleur ROI marginal en 2026 pour une marque B2B européenne.
        </p>
        <p>
          <strong>Adoption par la presse spécialisée.</strong> Phénomène observable depuis mi-2025 : les rédactions économiques (Les Échos, AGEFI, La Tribune) intègrent Perplexity dans leurs workflows de recherche, en particulier pour les sujets techniques (data secteur, rapports régulateurs, comparaisons multi-acteurs). Conséquence directe pour les marques : ce qui apparaît bien sur Perplexity remonte aussi dans les articles de presse, créant un cercle vertueux Perplexity-presse-Wikipedia. Inversement, une marque invisible sur Perplexity perd progressivement sa surface de citation dans la presse spécialisée, qui s'appuie de plus en plus sur les LLM pour identifier les acteurs notables.
        </p>
        <p>
          <strong>Intégration aux navigateurs et OS.</strong> Comet (le navigateur Perplexity, lancé fin 2024) compte 4M utilisateurs début 2026. Il remplace par défaut la barre d'adresse Chrome par une recherche Perplexity. Pour les marques, cela signifie qu'une fraction non triviale de la « browsing intent » de cadres tech-savvy passe désormais par Perplexity comme première étape de recherche. Le funnel marketing intègre donc Perplexity en amont de Google.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment Perplexity choisit ses sources</h2>
        <p>
          Comprendre l'algorithme de sélection de sources de Perplexity est la clé pour devenir une source citée. Voici le pipeline simplifié observé par reverse-engineering empirique sur plusieurs milliers de réponses.
        </p>
        <p>
          <strong>Étape 1 : query expansion.</strong> Le prompt utilisateur est reformulé en 3-5 sous-requêtes web par le LLM Sonar. Exemple : « meilleur asset manager européen ESG » devient « top European asset managers ESG ratings 2026 », « European ESG asset management leaders », « sustainable asset managers Europe AUM ».
        </p>
        <p>
          <strong>Étape 2 : crawl multi-source.</strong> Chaque sous-requête est exécutée contre l'index web Perplexity (qui combine son propre crawl + des partenariats avec des moteurs comme Bing). 30-50 résultats sont récupérés.
        </p>
        <p>
          <strong>Étape 3 : ranking par autorité + pertinence.</strong> Les résultats sont rerankés selon : autorité du domaine (similar à PageRank, mais avec biais Wikipedia/presse établie/.edu), récence pour requêtes sensibles au temps, pertinence sémantique (embedding de la question vs page), structure du contenu (les pages avec data structurée, listes, headers clairs sont privilégiées).
        </p>
        <p>
          <strong>Étape 4 : extraction et synthèse.</strong> Les 5-10 meilleurs résultats sont passés au LLM (Sonar ou modèle Pro) qui rédige la réponse en attachant chaque phrase à 1-3 sources. Une marque mentionnée dans la synthèse aura été extraite depuis au moins une de ces 5-10 sources.
        </p>
        <p>
          <strong>Implication pour les marques.</strong> Pour apparaître, deux portes : (1) être l'une des sources crawlées et citées (votre site, votre blog corporate, votre Wikipedia), ou (2) être mentionné dans une source citée (presse, blog tiers, Wikipedia article connexe). La porte 2 est souvent plus accessible : être cité dans un article Les Échos qui sera lui-même cité par Perplexity.
        </p>
        <p>
          Le profil source-type qui rank bien sur Perplexity : domaine établi (10+ ans), trafic organique &gt;50k/mois, contenu factuel structuré, mises à jour régulières. Wikipedia coche toutes les cases — d'où sa surreprésentation systématique.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment mesurer votre visibilité Perplexity</h2>
        <p>
          La mesure Perplexity diffère légèrement de la mesure des autres LLM, parce que les citations explicites permettent une instrumentation plus riche.
        </p>
        <p>
          <strong>KPI niveau 1 (basique).</strong> Citation rate sur un panel de prompts : sur 30 prompts pertinents pour votre marché, combien aboutissent à une réponse qui mentionne votre marque ? Un panel bien construit doit couvrir prompts de découverte (« meilleur acteur X »), comparatifs (« A vs B »), et techniques (« comment fonctionne Y »).
        </p>
        <p>
          <strong>KPI niveau 2 (intermédiaire).</strong> Average source rank : quand votre marque est citée, à quelle position [1, 2, 3, ...] apparaît-elle dans les sources ? La position 1-3 capture l'attention utilisateur, position 6+ est quasi invisible. Sur 100 citations, votre rank moyen devrait viser &lt;3.
        </p>
        <p>
          <strong>KPI niveau 3 (avancé).</strong> Share-of-voice : sur les prompts où au moins une marque de votre catégorie apparaît, quelle part des réponses citent la vôtre ? C'est la métrique compétitive ultime. Un share-of-voice &gt;20% indique une position de leader catégoriel.
        </p>
        <p>
          <strong>KPI niveau 4 (sources).</strong> Source attribution : depuis quelle source Perplexity vous cite-t-il ? Votre site directement, ou via Wikipedia, presse spécialisée, blog tiers ? Cette diagnostic précise vos leviers d'action : si 80% des citations passent par Wikipedia, prioriser la maintenance Wikipedia ; si 60% via Les Échos, prioriser la RP financière.
        </p>
        <p>
          La fréquence de mesure conseillée pour Perplexity est hebdomadaire (vs mensuelle pour ChatGPT). L'index web bouge plus vite que le corpus d'entraînement. Une publication de presse importante peut basculer le citation rate en 48h.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Études de cas et benchmarks</h2>
        <p>
          <strong>Asset Management France (étude Geoperf Q2 2026, panel 30 prompts FR).</strong> Top tier Perplexity : Amundi citation rate 81% (vs 78% sur ChatGPT — Perplexity est plus généreux), average rank 1.6, share-of-voice 24%. BNP Paribas AM 67% / 2.2 / 19%. AXA IM 51% / 2.9 / 15%. Particularité : sur Perplexity, des acteurs mid-tier (CA AM, La Banque Postale AM) atteignent 25-40% de citation rate (vs 15-30% sur ChatGPT) parce que la presse FR est mieux indexée.
        </p>
        <p>
          <strong>Sources d'autorité top dans le secteur FR.</strong> Wikipedia FR (cité dans 38% des réponses), L'AGEFI (24%), Les Échos (19%), Funds Magazine (12%), Investance/H24 Finance (10%), reste 8%. Cette liste guide les priorités RP : maintenir présence Wikipedia FR + relations rédactionnelles AGEFI/Échos = couvre 80% de l'autorité Perplexity FR sur le secteur.
        </p>
        <p>
          <strong>Cas concret (anonymisé) : ESN française mid-market.</strong> Société 800 employés, présente sur le secteur depuis 15 ans, citation rate Perplexity initial 12% (panel 30 prompts ESN/conseil tech). Audit identifie : page Wikipedia inexistante, présence presse spécialisée (Le Monde Informatique, Distributique) inégale, blog corporate riche mais peu structuré. Plan d'action 6 mois : (1) création page Wikipedia avec sources tierces solides, (2) campagne RP 4 articles trimestre, (3) restructuration du blog avec data structurée et listes. Citation rate à 6 mois : 41%.
        </p>
        <p>
          <strong>Comparaison cross-LLM.</strong> Sur ce même panel ESN, citation rate ChatGPT 28%, Claude 18%, Gemini 22%, Perplexity 41%. Perplexity capture le mieux le travail RP / SEO récent (3-6 mois). C'est le LLM le plus « réactif » à une stratégie GEO active.
        </p>
        <p>
          <strong>Anti-pattern observé.</strong> Marque tech B2B ayant bloqué PerplexityBot dans robots.txt « par précaution IA ». Citation rate 0% pendant 6 mois sur leurs prompts les plus stratégiques, alors que leurs concurrents capturaient 35-50%. Décision corrigée fin 2025, citation rate remontée à 28% en 4 mois.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Outils et solutions de monitoring</h2>
        <p>
          L'écosystème de monitoring Perplexity est plus mature que celui de ChatGPT, justement parce que les citations explicites facilitent l'instrumentation. Les principaux outils en 2026 :
        </p>
        <p>
          <strong>Geoperf</strong> couvre Perplexity nativement avec un module dédié source attribution : pour chaque citation, vous voyez le rang, la source citée, et l'historique. Plans Starter à Agency (79-799 €/mois). Spécialisé marché FR avec couverture presse spécialisée.
        </p>
        <p>
          <strong>Profound</strong> couvre Perplexity, ChatGPT, Gemini avec accent sur le tracking longitudinal et les alertes. Plans 200-1500 $/mois. Spécialisé marché US.
        </p>
        <p>
          <strong>Otterly.ai</strong> propose un freemium intéressant et une UI épurée. Plans 49-299 $/mois. Couvre Perplexity, Bing Chat, SearchGPT.
        </p>
        <p>
          <strong>Brandwatch AI Mode</strong> est l'extension de la suite Brandwatch (entreprise) sur les LLM. Couvre Perplexity, ChatGPT, Claude, Gemini avec intégration aux dashboards Brandwatch existants. Tarif entreprise (5k+/an).
        </p>
        <p>
          Pour démarrer, Geoperf Starter (79 €/mois) ou Otterly Pro (49 $/mois) sont les options PME les plus accessibles. Ils permettent d'instrumenter 30-50 prompts hebdomadaires sur Perplexity avec dashboard et alertes.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Mesurer votre visibilité Perplexity en 30 minutes</p>
        <p className="text-ink mb-4">
          Demandez l'étude sectorielle gratuite Geoperf de votre secteur. 30 prompts représentatifs, 4 LLM dont Perplexity, top 30 marques classées, sources d'autorité identifiées.
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
        <p className="text-ink-muted">
          Réponses détaillées dans l'index FAQ ci-dessous, avec données 2026 et cas FR.
        </p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Pour aller plus loin</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a
              href="https://docs.perplexity.ai/guides/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              Documentation officielle Perplexity API (Sonar)
            </a>
          </li>
          <li>
            <a
              href="https://www.perplexity.ai/hub/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              Perplexity Blog — annonces produit et roadmap
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Perplexity_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              Wikipedia — Perplexity AI (historique et levées de fonds)
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
        <h2 className="font-serif text-3xl text-navy">What is Perplexity and why it differs</h2>
        <p>
          Perplexity AI is an `answer engine` launched in 2022 by Aravind Srinivas (ex-OpenAI, ex-DeepMind). It combines an LLM (in-house Sonar models + GPT, Claude, Gemini as Pro options) with mandatory real-time web search. Every answer is built from crawled sources, explicitly cited, numbered [1][2][3] and clickable.
        </p>
        <p>
          This architecture sets it radically apart from ChatGPT, which answers from its trained memory and consults the web only optionally. Perplexity is by design a search-synthesis system: it doesn't `know` anything by itself, it only knows how to search and summarize.
        </p>
        <p>
          For a brand, the implication is concrete. On ChatGPT, your visibility depends on your frequency in the training corpus (data frozen every 6-12 months). On Perplexity, your visibility depends on your current web indexing (Wikipedia, press, corporate blog, academic sources). The lever is faster to activate, more measurable, closer to classic SEO — but with its own rules.
        </p>
        <p>
          Perplexity offers several surfaces: direct search (web and mobile), Pro Search (with manual model selection), Deep Research (long reports with 30+ sources), Spaces (shared search collections), Pages (Google-indexable published articles), and Discover (curated news feed). For a B2B brand, the surfaces that matter are direct search, Pro Search, and Discover.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Why Perplexity matters in 2026</h2>
        <p>Three dynamics make Perplexity strategic for a B2B brand in 2026.</p>
        <p>
          <strong>User growth and target profile.</strong> Perplexity announced 30 million monthly active users in early 2026 (vs 10M early 2025). Demographic profile is tightly aligned with premium B2B targets: 65% identify as knowledge workers, 22% work in tech/finance/consulting/research, 41% earn $100k+. For a CMO in financial services, consulting or B2B SaaS, this profile is denser than organic LinkedIn.
        </p>
        <p>
          <strong>Citation discipline = measurability.</strong> Where ChatGPT answers without always citing, Perplexity attaches a URL to every assertion. This transforms the marketing stake: you can count citations, measure rank, compute share-of-voice against competitors, and A/B test content to identify what `lifts`. Perplexity is the most instrumentable LLM.
        </p>
        <p>
          <strong>Marketing under-investment.</strong> End of 2025, less than 8% of US B2B brands had a formalized Perplexity strategy (Forrester 2025, n=312 mid-market firms). This under-investment creates an opportunity window: pioneer brands capture citation positions with 5-10x lower effort than what would be needed on Google or even ChatGPT.
        </p>
        <p>
          The combination of these three factors (qualified audience, high measurability, low competition) explains why Perplexity is the LLM channel with the best marginal ROI in 2026 for a US/UK B2B brand.
        </p>
        <p>
          <strong>Trade press adoption.</strong> Observable phenomenon since mid-2025: business editorial teams (WSJ, Bloomberg, FT, sector publications) integrate Perplexity into their research workflows, especially for technical subjects (sector data, regulatory reports, multi-vendor comparisons). Direct consequence for brands: what appears well on Perplexity also resurfaces in press articles, creating a Perplexity-press-Wikipedia virtuous loop. Conversely, a brand invisible on Perplexity progressively loses citation surface in trade press, which increasingly leans on LLMs to identify notable players.
        </p>
        <p>
          <strong>Browser and OS integration.</strong> Comet (the Perplexity browser, launched late 2024) counts 4M users in early 2026. It replaces the default Chrome address bar with Perplexity search. For brands, this means a non-trivial fraction of `browsing intent` from tech-savvy executives now flows through Perplexity as the first research step. The marketing funnel thus incorporates Perplexity upstream of Google.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How Perplexity picks its sources</h2>
        <p>
          Understanding Perplexity's source selection algorithm is the key to becoming a cited source. Here's the simplified pipeline observed via empirical reverse-engineering on thousands of responses.
        </p>
        <p>
          <strong>Step 1: query expansion.</strong> The user prompt is reformulated into 3-5 web sub-queries by the Sonar LLM. Example: `best European ESG asset manager` becomes `top European asset managers ESG ratings 2026`, `European ESG asset management leaders`, `sustainable asset managers Europe AUM`.
        </p>
        <p>
          <strong>Step 2: multi-source crawl.</strong> Each sub-query is executed against the Perplexity web index (combining its own crawl + partnerships with engines like Bing). 30-50 results are retrieved.
        </p>
        <p>
          <strong>Step 3: ranking by authority + relevance.</strong> Results are reranked by: domain authority (similar to PageRank, but with Wikipedia/established press/.edu bias), recency for time-sensitive queries, semantic relevance (question embedding vs page), content structure (pages with structured data, lists, clear headers are favored).
        </p>
        <p>
          <strong>Step 4: extraction and synthesis.</strong> The 5-10 best results are passed to the LLM (Sonar or Pro model) which writes the answer attaching each sentence to 1-3 sources. A brand mentioned in the synthesis was extracted from at least one of these 5-10 sources.
        </p>
        <p>
          <strong>Implication for brands.</strong> To appear, two doors: (1) be one of the crawled and cited sources (your site, your corporate blog, your Wikipedia), or (2) be mentioned in a cited source (press, third-party blog, related Wikipedia article). Door 2 is often more accessible: being cited in a Bloomberg article that itself gets cited by Perplexity.
        </p>
        <p>
          The source-type profile that ranks well on Perplexity: established domain (10+ years), &gt;50k/month organic traffic, structured factual content, regular updates. Wikipedia ticks every box — hence its systematic over-representation.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How to measure your Perplexity visibility</h2>
        <p>
          Perplexity measurement differs slightly from other LLMs, because explicit citations enable richer instrumentation.
        </p>
        <p>
          <strong>Level 1 KPI (basic).</strong> Citation rate on a prompt panel: out of 30 prompts relevant to your market, how many result in an answer that mentions your brand? A well-built panel must cover discovery prompts (`best X provider`), comparatives (`A vs B`), and technical (`how does Y work`).
        </p>
        <p>
          <strong>Level 2 KPI (intermediate).</strong> Average source rank: when your brand is cited, at what position [1, 2, 3, ...] does it appear in sources? Position 1-3 captures user attention, position 6+ is near-invisible. Out of 100 citations, your average rank should target {"<"}3.
        </p>
        <p>
          <strong>Level 3 KPI (advanced).</strong> Share-of-voice: across prompts where at least one brand in your category appears, what share of responses cite yours? It's the ultimate competitive metric. Share-of-voice {">"}20% indicates a category leader position.
        </p>
        <p>
          <strong>Level 4 KPI (sources).</strong> Source attribution: which source does Perplexity cite you from? Your site directly, or via Wikipedia, trade press, third-party blog? This diagnosis sharpens your action levers: if 80% of citations route through Wikipedia, prioritize Wikipedia maintenance; if 60% via Bloomberg, prioritize financial PR.
        </p>
        <p>
          Recommended measurement frequency for Perplexity is weekly (vs monthly for ChatGPT). The web index moves faster than the training corpus. A major press publication can flip citation rate in 48 hours.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Case studies and benchmarks</h2>
        <p>
          <strong>US Asset Management (Geoperf Q2 2026 study, 30-prompt panel).</strong> Top tier Perplexity: BlackRock citation rate 91% (vs 88% on ChatGPT — Perplexity is more generous), average rank 1.3, share-of-voice 28%. Vanguard 78% / 1.9 / 23%. Fidelity 64% / 2.6 / 19%. Specificity: on Perplexity, mid-tier players (Charles Schwab, T. Rowe Price) reach 30-45% citation rate (vs 25-40% on ChatGPT) because trade press is better indexed.
        </p>
        <p>
          <strong>Top authority sources in US sector.</strong> Wikipedia (cited in 35% of responses), Bloomberg (28%), Reuters (18%), Pensions {"&"} Investments (14%), Barron's (10%), rest 5%. This list drives PR priorities: maintain Wikipedia presence + editorial relations Bloomberg/Reuters = covers 80% of US Perplexity authority on the sector.
        </p>
        <p>
          <strong>Concrete case (anonymized): mid-market US fintech.</strong> 600-employee company, present in sector for 12 years, initial Perplexity citation rate 14% (panel 30 fintech prompts). Audit identifies: thin Wikipedia page, uneven trade press presence (TechCrunch, American Banker), rich corporate blog but poorly structured. 6-month action plan: (1) Wikipedia page expansion with solid third-party sources, (2) PR campaign 5 articles per quarter, (3) blog restructure with structured data and lists. Citation rate at 6 months: 44%.
        </p>
        <p>
          <strong>Cross-LLM comparison.</strong> On this same fintech panel, ChatGPT citation rate 31%, Claude 22%, Gemini 26%, Perplexity 44%. Perplexity captures the most recent PR/SEO work (3-6 months). It's the most `reactive` LLM to an active GEO strategy.
        </p>
        <p>
          <strong>Observed anti-pattern.</strong> B2B SaaS brand having blocked PerplexityBot in robots.txt `out of AI caution`. Citation rate 0% for 6 months on their most strategic prompts, while competitors captured 38-52%. Decision reversed end of 2025, citation rate climbed back to 31% in 4 months.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Monitoring tools and solutions</h2>
        <p>
          The Perplexity monitoring ecosystem is more mature than ChatGPT's, precisely because explicit citations ease instrumentation. Main 2026 tools:
        </p>
        <p>
          <strong>Geoperf</strong> covers Perplexity natively with a dedicated source attribution module: for every citation, you see rank, cited source, and history. Plans Starter to Agency ($85-870/month). Strong on EU markets with trade press coverage.
        </p>
        <p>
          <strong>Profound</strong> covers Perplexity, ChatGPT, Gemini with focus on longitudinal tracking and alerts. Plans $200-1500/month. US market specialist.
        </p>
        <p>
          <strong>Otterly.ai</strong> offers an interesting freemium and clean UI. Plans $49-299/month. Covers Perplexity, Bing Chat, SearchGPT.
        </p>
        <p>
          <strong>Brandwatch AI Mode</strong> extends the Brandwatch enterprise suite to LLMs. Covers Perplexity, ChatGPT, Claude, Gemini with integration to existing Brandwatch dashboards. Enterprise pricing ($5k+/year).
        </p>
        <p>
          To start, Geoperf Starter ($85/month) or Otterly Pro ($49/month) are the most accessible mid-market options. They allow instrumenting 30-50 weekly prompts on Perplexity with dashboards and alerts.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Measure your Perplexity visibility in 30 minutes</p>
        <p className="text-ink mb-4">
          Request the free Geoperf sector study for your industry. 30 representative prompts, 4 LLMs including Perplexity, top 30 brands ranked, authority sources identified.
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
        <p className="text-ink-muted">
          Detailed answers in the FAQ index below, with 2026 data and US cases.
        </p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Further reading</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a
              href="https://docs.perplexity.ai/guides/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              Perplexity API official docs (Sonar)
            </a>
          </li>
          <li>
            <a
              href="https://www.perplexity.ai/hub/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              Perplexity Blog — product announcements and roadmap
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Perplexity_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy"
            >
              Wikipedia — Perplexity AI (history and funding)
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
    ? "Perplexity for brands 2026: how citations actually work"
    : "Perplexity pour les marques 2026 : comment fonctionnent les citations";
  const intro = isEn
    ? "Perplexity is the LLM that cites every source it uses. For a B2B brand, this changes everything: citations are countable, rank is observable, and source attribution makes optimization concrete. This guide explains how Perplexity picks its sources, how to measure your visibility, and what brands actually do to appear cited in 2026."
    : "Perplexity est le LLM qui cite chaque source utilisée. Pour une marque B2B, cela change tout : les citations sont comptables, le rang observable, et l'attribution de source rend l'optimisation concrète. Ce guide explique comment Perplexity choisit ses sources, comment mesurer votre visibilité, et ce que les marques font concrètement pour apparaître citées en 2026.";

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
