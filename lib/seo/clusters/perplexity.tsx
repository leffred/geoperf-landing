// S29 Session 3 + follow-up EN — Clusters around pillar #4 perplexity-pour-marques.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyEtreCite() {
  return (
    <>
      <h2>Pourquoi Perplexity est plus mesurable que ChatGPT</h2>
      <p>Perplexity cite chaque source utilisée, numérotée [1][2][3] et cliquable. Cette discipline citationnelle transforme l&apos;enjeu marketing&nbsp;: on peut compter exactement les citations, mesurer le rang de votre URL parmi les sources, et identifier précisément quelles pages tierces vous attribuent. C&apos;est le LLM le plus instrumentable — et donc le plus stratégique pour démarrer une stratégie GEO.</p>

      <h2>Étape 1 — Construire un panel Perplexity-spécifique</h2>
      <p>30 prompts représentatifs de votre marché, exécutés chaque semaine sur Perplexity Sonar et Sonar Pro. Mix&nbsp;: 40 % découverte («&nbsp;meilleur fournisseur X France&nbsp;»), 25 % comparatifs, 20 % techniques, 15 % marque-explicites. Important sur Perplexity&nbsp;: privilégier les prompts intent commercial (achat, comparaison, recommandation), surface où Perplexity est le plus utilisé.</p>

      <h2>Étape 2 — Diagnostiquer votre source attribution</h2>
      <p>Pour chaque citation Perplexity, l&apos;outil de monitoring (Geoperf, Otterly, Profound) affiche la source. Étudiez la distribution&nbsp;: si 70 % de vos citations passent par Wikipedia, votre levier prioritaire est Wikipedia. Si 60 % passent par presse spécialisée FR (AGEFI, Échos), prioriser la RP. Si 80 % passent par votre site corporate, vous êtes vulnérable au prochain changement d&apos;algo.</p>

      <h2>Étape 3 — Renforcer les sources sous-représentées</h2>
      <p>Une distribution équilibrée (40 % Wikipedia + 30 % presse + 20 % corporate + 10 % autres) est la signature d&apos;une marque robuste. Si votre distribution est concentrée à plus de 60 % sur une seule catégorie, investissez sur les autres. Diversification = robustesse face aux fluctuations algorithmiques.</p>

      <h2>Étape 4 — Optimiser pour le crawl Perplexity</h2>
      <p>Perplexity utilise PerplexityBot pour son crawl propriétaire + des partenariats avec d&apos;autres index web. Vérifiez que PerplexityBot n&apos;est pas bloqué dans robots.txt (erreur fréquente par mimétisme avec d&apos;autres bots IA). Ajoutez un fichier llms.txt à la racine du domaine pour aider la compréhension globale de votre site.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Délai d&apos;impact Perplexity</p>
        <p className="text-sm text-ink">4-12 semaines après optimisation pour Perplexity Search (mode crawl temps réel). C&apos;est le LLM le plus &laquo;&nbsp;réactif&nbsp;&raquo; à une stratégie GEO active. Un nouveau contenu autoritaire peut basculer le citation rate en 2-4 semaines.</p>
      </div>

      <h2>Cibles réalistes par profil de marque</h2>
      <p><strong>PME B2B FR partant de 10 % citation rate</strong>&nbsp;: cible 30-45 % en 6 mois avec investissement 30-50 k€. <strong>ETI avec présence presse établie</strong>&nbsp;: cible 50-65 % en 6 mois avec investissement 60-100 k€. <strong>Leader sectoriel déjà fort</strong>&nbsp;: cible 70-80 % de citation rate maintien avec investissement de défense ~60 k€/an.</p>

      <h2>Erreur typique — bloquer PerplexityBot</h2>
      <p>Une marque B2B FR avait bloqué PerplexityBot dans robots.txt &laquo;&nbsp;par précaution IA&nbsp;&raquo;. Citation rate Perplexity 0 % pendant 6 mois pendant que ses concurrents capturaient 35-50 %. Décision corrigée fin 2025, citation rate remontée à 28 % en 4 mois. Cas réel anonymisé observé Geoperf.</p>
    </>
  );
}

function BodyEtreCiteEn() {
  return (
    <>
      <h2>Why Perplexity is more measurable than ChatGPT</h2>
      <p>Perplexity cites every source used, numbered [1][2][3] and clickable. This citation discipline transforms the marketing stake: you can count citations exactly, measure your URL&apos;s rank among sources, and identify precisely which third-party pages attribute you. It&apos;s the most instrumentable LLM — and therefore the most strategic to start a GEO program.</p>

      <h2>Step 1 — Build a Perplexity-specific panel</h2>
      <p>30 prompts representative of your market, run weekly on Perplexity Sonar and Sonar Pro. Mix: 40 % discovery (&quot;best US X provider&quot;), 25 % comparisons, 20 % technical, 15 % brand-explicit. Important on Perplexity: favor commercial-intent prompts (buying, comparison, recommendation), the surface where Perplexity is most used.</p>

      <h2>Step 2 — Diagnose your source attribution</h2>
      <p>For each Perplexity citation, the monitoring tool (Geoperf, Otterly, Profound) shows the source. Study the distribution: if 70 % of citations route through Wikipedia, your priority lever is Wikipedia. If 60 % go through US trade press (Bloomberg, P&I, Pensions{"&"}Investments), prioritize PR. If 80 % go through your corporate site, you&apos;re vulnerable to the next algo change.</p>

      <h2>Step 3 — Reinforce under-represented sources</h2>
      <p>A balanced distribution (40 % Wikipedia + 30 % press + 20 % corporate + 10 % other) is the signature of a robust brand. If your distribution concentrates above 60 % on a single category, invest in the others. Diversification = robustness against algorithmic fluctuations.</p>

      <h2>Step 4 — Optimize for the Perplexity crawl</h2>
      <p>Perplexity uses PerplexityBot for its proprietary crawl + partnerships with other web indexes. Verify that PerplexityBot is not blocked in robots.txt (frequent mistake from mimicking other AI bots). Add an llms.txt file at the root to support global site understanding.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Perplexity impact timeline</p>
        <p className="text-sm text-ink">4-12 weeks after optimization for Perplexity Search (real-time crawl mode). It&apos;s the most &quot;reactive&quot; LLM to an active GEO strategy. A new authoritative content piece can flip citation rate in 2-4 weeks.</p>
      </div>

      <h2>Realistic targets by brand profile</h2>
      <p><strong>US mid-market B2B starting from 10 % citation rate</strong>: target 30-45 % in 6 months with $35-60k investment. <strong>Mid-large with established press presence</strong>: target 50-65 % in 6 months with $70-120k investment. <strong>Sector leader already strong</strong>: target 70-80 % maintenance citation rate with ~$70k/year defensive investment.</p>

      <h2>Typical mistake — blocking PerplexityBot</h2>
      <p>A US B2B SaaS blocked PerplexityBot in robots.txt &quot;as an AI precaution&quot;. Perplexity citation rate 0 % for 6 months while competitors captured 38-52 %. Decision reversed end of 2025, citation rate climbed back to 31 % in 4 months. Real anonymized case observed by Geoperf.</p>
    </>
  );
}

function BodyVsGoogle() {
  return (
    <>
      <h2>Perplexity n&apos;est pas Google avec un LLM</h2>
      <p>Confondre Perplexity avec une version conversationnelle de Google est l&apos;erreur stratégique la plus fréquente. Les deux moteurs servent des intents différents, sont utilisés par des audiences différentes, et exigent des stratégies marketing distinctes. Voici les cinq différences qui changent l&apos;allocation budgétaire.</p>

      <h2>Différence 1 — Profil utilisateur</h2>
      <p>Google&nbsp;: ~4 milliards utilisateurs/mois, profil ultra-large. Perplexity&nbsp;: 30 M utilisateurs/mois, profil étroit&nbsp;: 65 % knowledge workers, 22 % tech/finance/conseil, 41 % revenu &gt;100 k$. Pour une marque B2B premium, Perplexity capture une audience plus dense que Google sur le segment cible.</p>

      <h2>Différence 2 — Type de requête</h2>
      <p>Google reste dominant sur navigation, transactionnel, local. Perplexity capture les requêtes &laquo;&nbsp;answer-seeking&nbsp;&raquo;&nbsp;: «&nbsp;quelle est la meilleure plateforme X&nbsp;», «&nbsp;comparer A vs B&nbsp;», «&nbsp;comment fonctionne Y&nbsp;». Pour le B2B haut funnel (découverte, comparaison), Perplexity capture déjà 5-10 % du temps de recherche professionnelle (sondages B2B internes outils).</p>

      <h2>Différence 3 — Nature de la réponse</h2>
      <p>Google produit 10 liens bleus, l&apos;utilisateur clique. Perplexity produit une synthèse de 100-300 mots avec sources [1][2][3] cliquables. La synthèse répond directement&nbsp;: 60 % des utilisateurs ne descendent plus jusqu&apos;aux sources si l&apos;overview répond à leur intent. Le KPI passe de la position au citation rate.</p>

      <h2>Différence 4 — Mode de mesure</h2>
      <p>Google offre Search Console, Analytics avec referrers, GA4 avec attribution. Perplexity n&apos;envoie pas de referrer pour les visites issues de citations sources, l&apos;attribution est limitée. La mesure passe par citation rate et lift sur recherches branded post-conversation Perplexity.</p>

      <h2>Différence 5 — Volatilité</h2>
      <p>Google rank peut basculer en 24h sur Core Update. Les sources Perplexity, surtout via Wikipedia et presse établie, sont plus stables — une mention Wikipedia survit 5-10 ans. Perplexity favorise structurellement les sources tierces autoritaires, créant des positions plus durables que les rankings Google.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Allocation budget recommandée</p>
        <p className="text-sm text-ink">Pour une marque B2B mid-market 2026&nbsp;: Google SEO 60-65 % du budget search, Perplexity (et autres LLM Search) 35-40 %. Le ratio bascule progressivement vers 50/50 d&apos;ici 2027-2028 selon la croissance Perplexity.</p>
      </div>

      <h2>Quand prioriser Perplexity sur Google</h2>
      <p>Trois cas&nbsp;: (1) cible B2B premium (knowledge workers, finance, tech, conseil) — Perplexity sur-pénètre votre audience ; (2) intent answer-seeking dominant (questions fréquentes secteur) ; (3) marché peu saturé en GEO (moins de 10 % de marques avec stratégie formalisée). Si les trois conditions sont réunies, allouer 50-60 % du budget search à Perplexity en 2026.</p>

      <h2>Mythes à déboulonner</h2>
      <p>Mythe 1&nbsp;: «&nbsp;Perplexity ne capte que les requêtes tech&nbsp;». Faux&nbsp;: 22 % tech/finance/conseil, mais 78 % autre. Mythe 2&nbsp;: «&nbsp;Le volume Perplexity est trop petit pour investir&nbsp;». Faux pour B2B premium où la densité d&apos;audience compte plus que le volume brut. Mythe 3&nbsp;: «&nbsp;Perplexity utilise les mêmes signaux que Google&nbsp;». Partiellement vrai pour le crawl, mais la sélection de sources finale privilégie autorité tierce et structure d&apos;extractabilité.</p>
    </>
  );
}

function BodyVsGoogleEn() {
  return (
    <>
      <h2>Perplexity is not Google with an LLM</h2>
      <p>Confusing Perplexity with a conversational version of Google is the most frequent strategic mistake. The two engines serve different intents, are used by different audiences, and require distinct marketing strategies. Five differences that change budget allocation.</p>

      <h2>Difference 1 — User profile</h2>
      <p>Google: ~4 billion monthly users, ultra-broad profile. Perplexity: 30M monthly users, narrow profile: 65 % knowledge workers, 22 % tech/finance/consulting, 41 % income {">"} $100k. For a premium B2B brand, Perplexity captures a denser audience than Google on the target segment.</p>

      <h2>Difference 2 — Query type</h2>
      <p>Google remains dominant on navigational, transactional, local. Perplexity captures &quot;answer-seeking&quot; queries: &quot;what is the best platform for X&quot;, &quot;compare A vs B&quot;, &quot;how does Y work&quot;. For B2B high-funnel (discovery, comparison), Perplexity already captures 5-10 % of professional research time (B2B tool internal surveys).</p>

      <h2>Difference 3 — Answer nature</h2>
      <p>Google produces 10 blue links, the user clicks. Perplexity produces a 100-300 word synthesis with clickable [1][2][3] sources. The synthesis answers directly: 60 % of users don&apos;t scroll to sources when the overview answers their intent. The KPI shifts from position to citation rate.</p>

      <h2>Difference 4 — Measurement mode</h2>
      <p>Google offers Search Console, Analytics with referrers, GA4 with attribution. Perplexity does not send a referrer for visits from source citations; attribution is limited. Measurement passes through citation rate and lift on branded searches post-Perplexity conversation.</p>

      <h2>Difference 5 — Volatility</h2>
      <p>Google rank can flip in 24h on a Core Update. Perplexity sources, especially via Wikipedia and established press, are more stable — a Wikipedia mention survives 5-10 years. Perplexity structurally favors authoritative third-party sources, creating positions more durable than Google rankings.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Recommended budget allocation</p>
        <p className="text-sm text-ink">For a 2026 mid-market B2B brand: Google SEO 60-65 % of search budget, Perplexity (and other Search LLMs) 35-40 %. The ratio progressively shifts to 50/50 by 2027-2028 as Perplexity grows.</p>
      </div>

      <h2>When to prioritize Perplexity over Google</h2>
      <p>Three cases: (1) premium B2B target (knowledge workers, finance, tech, consulting) — Perplexity over-penetrates your audience; (2) dominant answer-seeking intent (frequent industry questions); (3) market under-saturated on GEO (under 10 % of brands with formalized strategy). When all three are met, allocate 50-60 % of search budget to Perplexity in 2026.</p>

      <h2>Myths to debunk</h2>
      <p>Myth 1: &quot;Perplexity only captures tech queries.&quot; False: 22 % tech/finance/consulting, but 78 % other. Myth 2: &quot;Perplexity volume is too small to invest.&quot; False for premium B2B where audience density matters more than raw volume. Myth 3: &quot;Perplexity uses the same signals as Google.&quot; Partly true for crawl, but final source selection favors third-party authority and extraction structure.</p>
    </>
  );
}

function BodyPages() {
  return (
    <>
      <h2>Qu&apos;est-ce que Perplexity Pages</h2>
      <p>Lancé en 2024, Perplexity Pages permet à un utilisateur de transformer une recherche Perplexity en article publié, indexé par Google, partageable, avec sources clairement attribuées. Pour une marque, Pages représente une opportunité produit&nbsp;: créer ses propres articles thought-leadership avec un domaine de référence (perplexity.ai) qui rank bien sur Google nativement.</p>

      <h2>Opportunité 1 — Thought leadership accéléré</h2>
      <p>Créer une Page Perplexity sur un sujet technique de votre expertise vous permet de capitaliser sur l&apos;autorité de domaine de perplexity.ai (DR &gt; 80 selon Ahrefs début 2026). Une Page bien construite, citant vos contenus + sources tierces autoritatives, peut ranker sur Google en quelques semaines, alors qu&apos;un article équivalent sur votre blog corporate peut prendre 6-12 mois.</p>

      <h2>Opportunité 2 — Multiplication des points de contact</h2>
      <p>Une Page Perplexity qui cite votre marque est&nbsp;: (1) visible sur Perplexity Discover quand le sujet est en tendance, (2) indexée par Google, (3) partageable sur LinkedIn et X. C&apos;est trois canaux pour le prix d&apos;un. La Page agit comme une amplification cross-channel d&apos;un contenu marque qui aurait moins de portée publié seul.</p>

      <h2>Opportunité 3 — Suivi des Pages tierces qui vous citent</h2>
      <p>Au-delà de créer vos propres Pages, surveillez les Pages publiées par d&apos;autres qui citent votre marque. Ces Pages constituent des backlinks de qualité (DR perplexity.ai élevé) et des signaux d&apos;autorité tierce. Identifier les auteurs de Pages favorables et engager une relation peut produire d&apos;autres citations futures.</p>

      <h2>Stratégie de production de Pages</h2>
      <p>Trois angles qui fonctionnent en 2026&nbsp;: <strong>(1) Étude data sectorielle</strong> — Page basée sur votre étude flagship trimestrielle, citant les acteurs de référence du secteur. <strong>(2) Comparatif neutre</strong> — Page comparant les acteurs de votre catégorie (incluant vous-même), avec critères objectifs. <strong>(3) Guide tutoriel</strong> — Page step-by-step sur un sujet technique de votre expertise.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Effort vs ROI</p>
        <p className="text-sm text-ink">Production d&apos;une Page Perplexity de qualité&nbsp;: 4-8 heures (recherche + écriture). ROI mesurable&nbsp;: 500-3000 visites Google sur 12 mois + ~2-5 backlinks Perplexity Pages tiers. Comparable au ROI d&apos;un article blog corporate à 1/3 de l&apos;effort.</p>
      </div>

      <h2>Qualité de la Page importe</h2>
      <p>Une Page produite à la va-vite (5 minutes sans relecture) ne rank pas. Les meilleures Pages 2026 ont&nbsp;: 8-15 sources citées, structure H2 claire, données chiffrées, point de vue argumenté. Perplexity modère les Pages spam et déclasse les contenus thin. Investir 4-8 heures sur une Page produit un asset durable ; investir 30 minutes produit un déchet.</p>

      <h2>Cadence recommandée</h2>
      <p>Pour une marque B2B mid-market&nbsp;: 1 Page par mois sur sujet sectoriel + 1 Page trimestrielle basée sur étude flagship. Total ~16 Pages/an. À 4-8h par Page, c&apos;est 0.05-0.1 ETP — coût marginal pour un canal d&apos;autorité distinct du blog corporate.</p>

      <h2>Pièges fréquents</h2>
      <p>Premier piège&nbsp;: produire des Pages purement promotionnelles. Perplexity dévalorise. Privilégier le ton éditorial neutre. Deuxième piège&nbsp;: citer uniquement vos propres sources. Une bonne Page cite 5-10 sources tierces variées. Troisième piège&nbsp;: ignorer les Pages tierces qui citent votre marque. Surveiller hebdomadairement via votre outil de monitoring LLM.</p>
    </>
  );
}

function BodyPagesEn() {
  return (
    <>
      <h2>What Perplexity Pages is</h2>
      <p>Launched in 2024, Perplexity Pages lets a user transform a Perplexity search into a published, Google-indexed, shareable article with clearly attributed sources. For a brand, Pages represents a product opportunity: build your own thought-leadership articles on a reference domain (perplexity.ai) that ranks natively well on Google.</p>

      <h2>Opportunity 1 — Accelerated thought leadership</h2>
      <p>Creating a Perplexity Page on a technical topic in your expertise area lets you capitalize on perplexity.ai&apos;s domain authority (DR {">"} 80 per Ahrefs early 2026). A well-built Page, citing your content + third-party authoritative sources, can rank on Google in a few weeks, whereas an equivalent article on your corporate blog can take 6-12 months.</p>

      <h2>Opportunity 2 — Multiplied touchpoints</h2>
      <p>A Perplexity Page citing your brand is: (1) visible on Perplexity Discover when the topic trends, (2) indexed by Google, (3) shareable on LinkedIn and X. Three channels for the price of one. The Page acts as a cross-channel amplification of brand content that would have less reach published alone.</p>

      <h2>Opportunity 3 — Tracking third-party Pages citing you</h2>
      <p>Beyond creating your own Pages, monitor Pages published by others that cite your brand. These Pages constitute quality backlinks (perplexity.ai DR is high) and third-party authority signals. Identifying authors of favorable Pages and engaging can produce future citations.</p>

      <h2>Production strategy for Pages</h2>
      <p>Three angles that work in 2026: <strong>(1) Sector data study</strong> — Page based on your quarterly flagship study, citing reference industry players. <strong>(2) Neutral comparison</strong> — Page comparing players in your category (including yourself), with objective criteria. <strong>(3) Tutorial guide</strong> — step-by-step Page on a technical topic in your expertise.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Effort vs ROI</p>
        <p className="text-sm text-ink">Producing a quality Perplexity Page: 4-8 hours (research + writing). Measurable ROI: 500-3000 Google visits over 12 months + ~2-5 third-party Perplexity Pages backlinks. Comparable ROI to a corporate blog article at 1/3 the effort.</p>
      </div>

      <h2>Page quality matters</h2>
      <p>A Page rushed in 5 minutes without review doesn&apos;t rank. The best 2026 Pages have: 8-15 cited sources, clear H2 structure, chiffred data, argued viewpoint. Perplexity moderates spam Pages and demotes thin content. Investing 4-8 hours on a Page produces a durable asset; investing 30 minutes produces waste.</p>

      <h2>Recommended cadence</h2>
      <p>For a US B2B mid-market brand: 1 Page per month on a sector topic + 1 quarterly Page based on flagship study. Total ~16 Pages/year. At 4-8h per Page, that&apos;s 0.05-0.1 FTE — marginal cost for an authority channel distinct from the corporate blog.</p>

      <h2>Common pitfalls</h2>
      <p>First pitfall: producing purely promotional Pages. Perplexity demotes. Favor neutral editorial tone. Second pitfall: citing only your own sources. A good Page cites 5-10 varied third-party sources. Third pitfall: ignoring third-party Pages that cite your brand. Monitor weekly via your LLM monitoring tool.</p>
    </>
  );
}

function BodySources() {
  return (
    <>
      <h2>Comment Perplexity choisit ses sources</h2>
      <p>L&apos;algorithme de sélection de sources Perplexity n&apos;est pas public, mais l&apos;observation empirique sur 5000+ réponses analysées révèle une logique cohérente en quatre étapes. Comprendre cette logique transforme une stratégie GEO d&apos;intuitive à dirigée — vous savez exactement ce qu&apos;il faut faire pour que votre source soit retenue.</p>

      <h2>Étape 1 — Query expansion</h2>
      <p>Le prompt utilisateur est reformulé en 3-5 sous-requêtes web par le LLM Sonar. Exemple&nbsp;: «&nbsp;meilleur asset manager européen ESG&nbsp;» devient «&nbsp;top European asset managers ESG ratings 2026&nbsp;», «&nbsp;European ESG asset management leaders&nbsp;», «&nbsp;sustainable asset managers Europe AUM&nbsp;». Implication marque&nbsp;: votre contenu doit ranker sur des variations sémantiques, pas seulement le mot-clé exact.</p>

      <h2>Étape 2 — Crawl multi-source</h2>
      <p>Chaque sous-requête est exécutée contre l&apos;index web Perplexity (combinant son propre crawl + partenariats avec moteurs comme Bing). 30-50 résultats sont récupérés. Implication&nbsp;: votre site doit être crawlable par PerplexityBot ET par Bingbot (souvent oublié). Vérifier robots.txt et soumettre votre site à Bing Webmaster Tools.</p>

      <h2>Étape 3 — Ranking par autorité + pertinence</h2>
      <p>Les 30-50 résultats sont rerankés selon&nbsp;: autorité de domaine (similar à PageRank, biais Wikipedia/.edu/presse établie), récence pour requêtes time-sensitive, pertinence sémantique (embedding question vs page), structure du contenu (data structurée, listes, headers clairs préférés). Les 5-10 finalistes alimentent le contexte LLM.</p>

      <h2>Étape 4 — Extraction et synthèse</h2>
      <p>Les 5-10 meilleures sources sont passées au LLM (Sonar ou Pro) qui rédige la réponse en attachant chaque phrase à 1-3 sources. Une marque mentionnée dans la synthèse aura été extraite depuis au moins une de ces 5-10 sources. Implication&nbsp;: pour apparaître mentionnée, deux portes — être l&apos;une des sources OU être mentionnée dans une source.</p>

      <h2>Profil source-type qui rank bien</h2>
      <p>Domaine établi (10+ ans), trafic organique &gt;50k/mois, contenu factuel structuré, mises à jour régulières. Wikipedia coche toutes les cases — d&apos;où sa surreprésentation systématique (32 % des citations cross-LLM). Les sites corporate récents avec contenu narratif et faible trafic organique sont écartés au ranking.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Distribution sources Perplexity B2B FR (Q1 2026)</p>
        <p className="text-sm text-ink">Wikipedia FR 38 % · L&apos;AGEFI 24 % · Les Échos 19 % · Funds Magazine 12 % · H24 Finance 10 % · reste 8 %. Pour le secteur asset management FR, ces 5 sources couvrent 80 % de l&apos;autorité Perplexity.</p>
      </div>

      <h2>Implication pour votre stratégie</h2>
      <p>Identifier les 5-10 sources les plus citées dans votre secteur est la première action stratégique. Faites-le via votre outil GEO ou en analysant manuellement 50 réponses Perplexity sur prompts secteur. Une fois identifiées, votre stratégie d&apos;autorité tierce devient ciblée&nbsp;: prioriser la présence sur ces 5-10 sources spécifiques plutôt que de disperser l&apos;effort.</p>

      <h2>Différence avec Google</h2>
      <p>Google ranke 10 résultats. Perplexity rank 30-50, retient 5-10, en cite 3-5 dans la réponse finale. Cette double réduction explique pourquoi le citation rate Perplexity est plus binaire&nbsp;: vous êtes soit dans le top 5-10 retenu, soit invisibles. Pas de position 8-15 qui rapporte un peu de trafic comme sur Google.</p>
    </>
  );
}

function BodySourcesEn() {
  return (
    <>
      <h2>How Perplexity picks its sources</h2>
      <p>The Perplexity source selection algorithm is not public, but empirical observation on 5000+ analyzed responses reveals a consistent four-step logic. Understanding this logic transforms a GEO strategy from intuitive to directed — you know exactly what to do for your source to be retained.</p>

      <h2>Step 1 — Query expansion</h2>
      <p>The user prompt is reformulated into 3-5 web sub-queries by the Sonar LLM. Example: &quot;best US ESG asset manager&quot; becomes &quot;top US asset managers ESG ratings 2026&quot;, &quot;US ESG asset management leaders&quot;, &quot;sustainable asset managers US AUM&quot;. Brand implication: your content must rank on semantic variations, not just the exact keyword.</p>

      <h2>Step 2 — Multi-source crawl</h2>
      <p>Each sub-query is executed against the Perplexity web index (combining its own crawl + partnerships with engines like Bing). 30-50 results are retrieved. Implication: your site must be crawlable by PerplexityBot AND Bingbot (often forgotten). Check robots.txt and submit your site to Bing Webmaster Tools.</p>

      <h2>Step 3 — Ranking by authority + relevance</h2>
      <p>The 30-50 results are reranked by: domain authority (PageRank-like, Wikipedia/.edu/established-press bias), recency for time-sensitive queries, semantic relevance (question embedding vs page), content structure (structured data, lists, clear headers preferred). The 5-10 finalists feed the LLM context.</p>

      <h2>Step 4 — Extraction and synthesis</h2>
      <p>The 5-10 best sources are passed to the LLM (Sonar or Pro) which writes the answer attaching each sentence to 1-3 sources. A brand mentioned in the synthesis was extracted from at least one of these 5-10 sources. Implication: to appear mentioned, two doors — be one of the sources OR be mentioned within a source.</p>

      <h2>Source profile that ranks well</h2>
      <p>Established domain (10+ years), {">"}50k monthly organic traffic, factual structured content, regular updates. Wikipedia ticks every box — hence its systematic over-representation (32 % of cross-LLM citations). Recent corporate sites with narrative content and weak organic traffic are excluded at ranking.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Perplexity US B2B source distribution (Q1 2026)</p>
        <p className="text-sm text-ink">Wikipedia 35 % · Bloomberg 22 % · Reuters 16 % · Pensions{"&"}Investments 13 % · Barron&apos;s 9 % · rest 5 %. For US asset management, these 5 sources cover 80 % of Perplexity authority.</p>
      </div>

      <h2>Implication for your strategy</h2>
      <p>Identifying the 5-10 most-cited sources in YOUR industry is the first strategic action. Do it via your GEO tool or by manually analyzing 50 Perplexity responses on industry prompts. Once identified, your third-party authority strategy becomes targeted: prioritize presence on these 5-10 specific sources rather than spreading effort.</p>

      <h2>Difference with Google</h2>
      <p>Google ranks 10 results. Perplexity ranks 30-50, retains 5-10, cites 3-5 in the final answer. This double reduction explains why Perplexity citation rate is more binary: you&apos;re either in the retained top 5-10 or invisible. No position 8-15 that drives some traffic like Google.</p>
    </>
  );
}

function BodyOptimiser() {
  return (
    <>
      <h2>Pourquoi optimiser spécifiquement pour Perplexity</h2>
      <p>Optimiser une page Perplexity signifie maximiser sa probabilité d&apos;être&nbsp;: (1) crawlée par PerplexityBot, (2) sélectionnée parmi les 30-50 résultats par sous-requête, (3) retenue dans le top 5-10 finalistes, (4) explicitement citée dans la réponse synthétique. Ces quatre étapes ont chacune leurs leviers d&apos;optimisation.</p>

      <h2>Levier 1 — Crawlabilité PerplexityBot</h2>
      <p>Vérifier que PerplexityBot, GPTBot, ClaudeBot, Google-Extended ne sont pas bloqués dans robots.txt. Soumettre le sitemap.xml à Bing Webmaster Tools (Perplexity utilise l&apos;index Bing en complément). Si le site est en Next.js / React, vérifier le rendu serveur via <code>view-source:</code> — le contenu doit apparaître dans le HTML initial, pas après hydration JavaScript.</p>

      <h2>Levier 2 — Autorité de domaine</h2>
      <p>Perplexity favorise les domaines avec DR &gt; 50 (Ahrefs equivalent), trafic organique mensuel &gt; 50k, et historique solide. Les sites neufs sans backlinks ont peu de chances d&apos;être sélectionnés au ranking, même avec contenu de qualité. Levier d&apos;action&nbsp;: link building qualitatif (RP earned, partenariats éditoriaux), pas low-quality backlinks.</p>

      <h2>Levier 3 — Structure de page</h2>
      <p>H1 sous forme de question, intro courte 50-80 mots qui répond, 4-6 H2 thématiques, listes/tableaux pour data structurée, schema.org Article + FAQPage + Organization. Le format gagnant Perplexity est identique au format gagnant ChatGPT et Gemini AI Overviews — investir une fois rapporte sur les trois LLM.</p>

      <h2>Levier 4 — Présence Wikipedia</h2>
      <p>Wikipedia représente 32-38 % des citations cross-LLM, encore plus sur Perplexity (qui privilégie les sources encyclopédiques). Une marque sans page Wikipedia, ou sans mention dans articles connexes, perd un canal d&apos;autorité majeur. Investir 5-15 k€ sur 6-12 mois pour construire une présence Wikipedia est l&apos;optimisation off-page à plus haut ROI.</p>

      <h2>Levier 5 — Mentions presse spécialisée</h2>
      <p>Perplexity cite régulièrement la presse spécialisée sectorielle (AGEFI, Échos, Le Monde Informatique pour la France). Sans 8-15 mentions presse spécialisée sur 12 mois, votre couverture autorité tierce est insuffisante. Engager un attaché de presse spécialisé (1500-3000 €/mois) est le levier #2 après Wikipedia.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Cas concret B2B FR mid-market</p>
        <p className="text-sm text-ink">SaaS B2B FR 200 employés. Citation rate Perplexity initial 21 %. Plan 4 mois&nbsp;: déblocage robots.txt, schema sur 30 pages, FAQ sections, demande Wikipedia + 4 articles AGEFI + 2 podcasts B2B. Citation rate à 4 mois&nbsp;: 44 %. Investissement&nbsp;: ~22 k€ sur 4 mois.</p>
      </div>

      <h2>Cadence et mesure</h2>
      <p>Sur Perplexity, une cadence hebdomadaire est nécessaire (vs mensuelle pour ChatGPT). L&apos;index web bouge plus vite que le corpus d&apos;entraînement&nbsp;: une publication de presse importante peut basculer le citation rate en 48h, et vos snapshots doivent capturer ce signal. Sans monitoring hebdomadaire, vous découvrez les changements avec des semaines de retard.</p>

      <h2>Pièges fréquents</h2>
      <p>Premier piège&nbsp;: investir uniquement on-page sans toucher l&apos;autorité tierce. Une page parfaitement optimisée sans Wikipedia ni presse plafonne à 25-30 % de citation rate. Deuxième piège&nbsp;: ignorer Bing Webmaster Tools — Perplexity utilise massivement l&apos;index Bing. Troisième piège&nbsp;: bloquer PerplexityBot par mimétisme avec d&apos;autres bots IA. Vérifier votre robots.txt aujourd&apos;hui.</p>
    </>
  );
}

function BodyOptimiserEn() {
  return (
    <>
      <h2>Why optimize specifically for Perplexity</h2>
      <p>Optimizing a page for Perplexity means maximizing its probability of being: (1) crawled by PerplexityBot, (2) selected among the 30-50 results per sub-query, (3) retained in the top 5-10 finalists, (4) explicitly cited in the synthetic response. Each of these four steps has its own optimization levers.</p>

      <h2>Lever 1 — PerplexityBot crawlability</h2>
      <p>Verify that PerplexityBot, GPTBot, ClaudeBot, Google-Extended are not blocked in robots.txt. Submit sitemap.xml to Bing Webmaster Tools (Perplexity uses the Bing index as complement). If the site is in Next.js / React, verify server rendering via <code>view-source:</code> — content must appear in initial HTML, not after JavaScript hydration.</p>

      <h2>Lever 2 — Domain authority</h2>
      <p>Perplexity favors domains with DR {">"} 50 (Ahrefs equivalent), {">"}50k monthly organic traffic, and solid history. New sites without backlinks rarely reach selection at ranking, even with quality content. Action lever: qualitative link building (earned PR, editorial partnerships), not low-quality backlinks.</p>

      <h2>Lever 3 — Page structure</h2>
      <p>H1 as a question, short 50-80 word answering intro, 4-6 thematic H2s, lists/tables for structured data, schema.org Article + FAQPage + Organization. The Perplexity-winning format is identical to the ChatGPT- and Gemini AI Overviews-winning format — investing once pays across three LLMs.</p>

      <h2>Lever 4 — Wikipedia presence</h2>
      <p>Wikipedia accounts for 32-38 % of cross-LLM citations, even more on Perplexity (which favors encyclopedic sources). A brand without a Wikipedia page or mentions in related articles loses a major authority channel. Investing $7-20k over 6-12 months to build Wikipedia presence is the highest-ROI off-page optimization.</p>

      <h2>Lever 5 — Trade press mentions</h2>
      <p>Perplexity regularly cites sector trade press (Bloomberg, P{"&"}I, American Banker for finance; TechCrunch, American Banker for tech). Without 8-15 trade press mentions over 12 months, your third-party authority coverage is insufficient. Engaging a specialized PR officer ($2-4k/month) is lever #2 after Wikipedia.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Concrete US mid-market case</p>
        <p className="text-sm text-ink">US B2B SaaS, 250 employees. Initial Perplexity citation rate 21 %. 4-month plan: robots.txt unblock, schema on 35 pages, FAQ sections, Wikipedia request + 4 American Banker articles + 2 B2B podcasts. Citation rate at 4 months: 44 %. Investment: ~$25k over 4 months.</p>
      </div>

      <h2>Cadence and measurement</h2>
      <p>On Perplexity, weekly cadence is necessary (vs monthly for ChatGPT). The web index moves faster than training corpus: a major press publication can flip citation rate in 48 hours, and your snapshots must capture this signal. Without weekly monitoring, you discover changes weeks late.</p>

      <h2>Common pitfalls</h2>
      <p>First pitfall: investing only on-page without touching third-party authority. A perfectly optimized page without Wikipedia or press plateaus at 25-30 % citation rate. Second pitfall: ignoring Bing Webmaster Tools — Perplexity uses the Bing index heavily. Third pitfall: blocking PerplexityBot by mimicking other AI bots. Check your robots.txt today.</p>
    </>
  );
}

export const PERPLEXITY_CLUSTERS: ClusterRegistry = {
  "etre-cite-perplexity-2026": {
    parentPillar: "perplexity-pour-marques",
    fr: {
      title: "Comment être cité par Perplexity en 2026",
      metaDescription:
        "Méthode pratique pour être cité par Perplexity : panel de prompts, source attribution, optimisation crawl PerplexityBot. Cibles 6 mois pour B2B FR.",
      intro:
        "Perplexity cite chaque source explicitement, ce qui en fait le LLM le plus mesurable. Apparaître dans ses réponses exige une stratégie source-aware : panel de prompts hebdomadaire, diagnostic de votre source attribution, et renforcement ciblé des canaux sous-représentés.",
      publishedAt: PUB,
      Body: BodyEtreCite,
    },
    en: {
      title: "How to get cited by Perplexity in 2026",
      metaDescription:
        "Practical method to be cited by Perplexity: prompt panel, source attribution, PerplexityBot crawl optimization. Realistic 6-month targets for US B2B brands.",
      intro:
        "Perplexity cites every source explicitly, making it the most measurable LLM. Showing up in its answers requires a source-aware strategy: weekly prompt panel, source attribution diagnosis, and targeted reinforcement of under-represented channels.",
      publishedAt: PUB,
      Body: BodyEtreCiteEn,
    },
  },
  "perplexity-vs-google-marketing": {
    parentPillar: "perplexity-pour-marques",
    fr: {
      title: "Perplexity vs Google : 5 différences pour le marketing",
      metaDescription:
        "Cinq différences stratégiques entre Perplexity et Google : profil utilisateur, type de requête, nature de la réponse, mesurabilité, volatilité. Allocation budget.",
      intro:
        "Confondre Perplexity avec un Google conversationnel est l'erreur stratégique #1. Cinq différences — profil utilisateur, type de requête, nature de la réponse, mesurabilité, volatilité — exigent une allocation budgétaire distincte. Pour le B2B premium, Perplexity capture une audience dense.",
      publishedAt: PUB,
      Body: BodyVsGoogle,
    },
    en: {
      title: "Perplexity vs Google: 5 differences for marketers",
      metaDescription:
        "Five strategic differences between Perplexity and Google: user profile, query type, answer nature, measurability, volatility. Budget allocation 2026.",
      intro:
        "Confusing Perplexity with conversational Google is the #1 strategic mistake. Five differences — user profile, query type, answer nature, measurability, volatility — require distinct budget allocation. For premium B2B, Perplexity captures a dense audience.",
      publishedAt: PUB,
      Body: BodyVsGoogleEn,
    },
  },
  "perplexity-pages-opportunite": {
    parentPillar: "perplexity-pour-marques",
    fr: {
      title: "Perplexity Pages : la nouvelle opportunité marketing",
      metaDescription:
        "Perplexity Pages permet de publier sur un domaine DR>80, indexé Google, partageable. Stratégie de production, ROI, pièges à éviter pour B2B 2026.",
      intro:
        "Perplexity Pages est une opportunité produit 2026 : publier sur un domaine DR>80, indexé Google, partageable, avec sources attribuées. Trois angles qui fonctionnent — étude data, comparatif neutre, guide tutoriel — pour ~16 Pages/an et 0.05-0.1 ETP.",
      publishedAt: PUB,
      Body: BodyPages,
    },
    en: {
      title: "Perplexity Pages: the new marketing opportunity",
      metaDescription:
        "Perplexity Pages let you publish on a DR>80 domain, Google-indexed, shareable, with attributed sources. Production strategy, ROI, pitfalls for B2B 2026.",
      intro:
        "Perplexity Pages is a 2026 product opportunity: publish on a DR>80 domain, Google-indexed, shareable, with attributed sources. Three angles that work — data study, neutral comparison, tutorial guide — for ~16 Pages/year and 0.05-0.1 FTE.",
      publishedAt: PUB,
      Body: BodyPagesEn,
    },
  },
  "sources-perplexity-priorise": {
    parentPillar: "perplexity-pour-marques",
    fr: {
      title: "Quelles sources Perplexity priorise (et pourquoi)",
      metaDescription:
        "Algorithme de sélection de sources Perplexity en 4 étapes : query expansion, crawl, ranking, extraction. Distribution observée et implications stratégiques.",
      intro:
        "L'algorithme Perplexity sélectionne ses sources en quatre étapes — query expansion, crawl multi-source, ranking par autorité, extraction. Comprendre cette logique transforme votre stratégie GEO d'intuitive à dirigée. Distribution sources observée et profil-type qui rank bien.",
      publishedAt: PUB,
      Body: BodySources,
    },
    en: {
      title: "Which sources Perplexity prioritizes (and why)",
      metaDescription:
        "Perplexity source selection algorithm in 4 steps: query expansion, multi-source crawl, ranking by authority, extraction. Observed distribution and strategic implications.",
      intro:
        "The Perplexity algorithm selects sources in four steps — query expansion, multi-source crawl, ranking by authority, extraction. Understanding this logic shifts your GEO strategy from intuitive to directed. Observed source distribution and the profile that ranks well.",
      publishedAt: PUB,
      Body: BodySourcesEn,
    },
  },
  "optimiser-marque-perplexity": {
    parentPillar: "perplexity-pour-marques",
    fr: {
      title: "Optimiser sa marque pour Perplexity : 5 leviers",
      metaDescription:
        "Cinq leviers pour optimiser une marque pour Perplexity : crawlabilité, autorité de domaine, structure de page, présence Wikipedia, mentions presse spécialisée.",
      intro:
        "Optimiser pour Perplexity exige cinq leviers complémentaires : crawlabilité PerplexityBot, autorité de domaine, structure de page, présence Wikipedia, mentions presse spécialisée. Cas concret : passer de 21 % à 44 % de citation rate en 4 mois pour ~22 k€ d'investissement.",
      publishedAt: PUB,
      Body: BodyOptimiser,
    },
    en: {
      title: "Optimize your brand for Perplexity: 5 levers",
      metaDescription:
        "Five complementary levers to optimize a brand for Perplexity: crawlability, domain authority, page structure, Wikipedia presence, trade press mentions.",
      intro:
        "Optimizing for Perplexity requires five complementary levers: PerplexityBot crawlability, domain authority, page structure, Wikipedia presence, trade press mentions. Concrete case: going from 21 % to 44 % citation rate in 4 months for ~$25k investment.",
      publishedAt: PUB,
      Body: BodyOptimiserEn,
    },
  },
};
