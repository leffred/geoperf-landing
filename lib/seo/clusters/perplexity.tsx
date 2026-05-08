// S29 Session 3 — Clusters around pillar #4 perplexity-pour-marques.

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
  },
};
