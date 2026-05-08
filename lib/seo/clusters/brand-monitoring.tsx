// S29 Session 3 — Clusters around pillar #7 llm-brand-monitoring.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyOutils() {
  return (
    <>
      <h2>Trois catégories d&apos;outils en 2026</h2>
      <p>L&apos;écosystème de monitoring LLM s&apos;est densifié rapidement entre 2024 et 2026. On distingue désormais trois catégories d&apos;outils&nbsp;: SaaS multi-LLM dédiés (Geoperf, Profound, Otterly), extensions de suites enterprise (Brandwatch AI Mode, Sprinklr), et solutions DIY scripts custom. Choisir la bonne catégorie dépend du profil de l&apos;entreprise et du niveau de maturité visé.</p>

      <h2>Catégorie 1 — SaaS multi-LLM dédiés</h2>
      <p><strong>Geoperf</strong> (79-799 €/mois) est l&apos;outil français de référence&nbsp;: panel 30-300 prompts, 4 LLM (ChatGPT, Gemini, Claude, Perplexity), source attribution, sentiment, share-of-voice. Couverture forte presse spécialisée FR. <strong>Profound</strong> (200-1500 $/mois) est le concurrent US-first avec UI plus visuelle. <strong>Otterly.ai</strong> (49-299 $/mois) propose le freemium le plus accessible. <strong>AthenaHQ</strong> (300-2000 $/mois) cible enterprise US.</p>

      <h2>Catégorie 2 — Extensions enterprise</h2>
      <p><strong>Brandwatch AI Mode</strong> (5-15 k€/an) intègre le monitoring LLM dans la suite Brandwatch existante. Avantage&nbsp;: si vous utilisez déjà Brandwatch pour social listening, intégration native. <strong>Sprinklr</strong> propose un module LLM analogous dans sa suite. <strong>Talkwalker</strong> entre sur le marché en 2026. Pour les ETI et grands comptes déjà équipés en suites enterprise, ces extensions ont un coût marginal acceptable.</p>

      <h2>Catégorie 3 — DIY scripts custom</h2>
      <p>Pour les équipes data internes, possibilité de coder via API OpenAI/Anthropic/Google + Python + dashboard Looker/Streamlit. Coût direct&nbsp;: 50-200 €/mois en API calls + 5-15 jours d&apos;engineering initial puis 1-2 jours/mois maintenance. Réservé aux équipes data matures avec besoins très spécifiques. Pour 95 % des marques, l&apos;option SaaS dédiée a un meilleur ROI.</p>

      <h2>Critères de sélection</h2>
      <p>Trois critères discriminent les outils sérieux des gadgets&nbsp;: <strong>(1) couverture des 4 LLM majeurs</strong> (pas seulement 1-2)&nbsp;: ChatGPT, Gemini, Claude, Perplexity sont indispensables. <strong>(2) Source attribution explicite</strong>&nbsp;: savoir d&apos;où vient chaque citation (Wikipedia, presse, votre site), pas juste un score agrégé. <strong>(3) Historique longitudinal</strong>&nbsp;: au-delà de 12 semaines pour comparer évolution vs baseline.</p>

      <h2>Comparaison rapide pour B2B FR mid-market</h2>
      <p>Geoperf Starter (79 €/mois) couvre 30 prompts hebdomadaires, 4 LLM, dashboard, alertes — suffisant pour démarrer. Pour aller plus loin&nbsp;: Geoperf Growth (199 €) avec 60 prompts + sentiment + source attribution. Pour ETI&nbsp;: Geoperf Pro (399 €) avec 150 prompts. Profound et AthenaHQ sont 2-3x plus chers à fonctionnalités équivalentes pour le marché FR (couverture presse spécialisée FR moindre).</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Stack recommandée par profil</p>
        <p className="text-sm text-ink mb-1"><strong>PME 50-200</strong>&nbsp;: Geoperf Starter (79 €) + Search Console gratuit. Total ~80 €/mois.</p>
        <p className="text-sm text-ink mb-1"><strong>ETI 200-2000</strong>&nbsp;: Geoperf Pro/Agency (399-799 €) + Cision pour RP. Total ~1000-1500 €/mois.</p>
        <p className="text-sm text-ink"><strong>Grand compte 2000+</strong>&nbsp;: Geoperf Agency + Brandwatch AI Mode. Total ~3-5 k€/mois.</p>
      </div>

      <h2>Pièges à l&apos;achat</h2>
      <p>Premier piège&nbsp;: choisir l&apos;outil le moins cher sans vérifier la couverture LLM (beaucoup d&apos;outils freemium ne couvrent que ChatGPT). Deuxième piège&nbsp;: oublier que le coût total inclut le temps interne d&apos;analyse (compter 0.1-0.2 ETP). Troisième piège&nbsp;: empiler outils SEO et GEO sans intégration. Privilégier des outils avec API ou exports CSV pour agrégation dans dashboard unique.</p>

      <h2>Roadmap d&apos;adoption 12 mois</h2>
      <p>Mois 1-3&nbsp;: démarrer avec un outil dédié à 79-200 €/mois, panel de 30 prompts, hebdomadaire. Mois 4-6&nbsp;: étendre à 50-80 prompts, ajouter source attribution. Mois 7-9&nbsp;: passer en plan supérieur si besoin (Pro/Agency), intégrer dashboard. Mois 10-12&nbsp;: brancher au reporting comex, configurer alertes 3 niveaux (jaune/rouge/critique).</p>
    </>
  );
}

function BodyAlertes() {
  return (
    <>
      <h2>Pourquoi alerter automatiquement</h2>
      <p>Sans alertes, le monitoring LLM devient un dashboard mort qu&apos;on ne consulte jamais. Avec des alertes bien calibrées, les équipes marketing/RP réagissent dans les 24-48h aux variations significatives, transformant le monitoring d&apos;outil de reporting en outil de risk management actif.</p>

      <h2>Trois niveaux d&apos;alerte standard</h2>
      <p><strong>Niveau jaune</strong> — variation -5 % à -15 % sur 2 semaines consécutives. Signal d&apos;investigation, pas de panique. Cause probable&nbsp;: nouveau concurrent dominant, contenu corporate obsolète, perte d&apos;autorité presse. Action&nbsp;: revue interne marketing dans la semaine.</p>
      <p><strong>Niveau rouge</strong> — variation &gt; -15 % sur 1-2 semaines. Escalation comm/marketing. Cause probable&nbsp;: événement extérieur (crise concurrence, mention presse négative virale), changement algorithmique LLM majeur. Action&nbsp;: investigation 48h, plan de réponse comex.</p>
      <p><strong>Niveau critique</strong> — variation &gt; -30 % en 1 semaine. Crise immédiate. Cause probable&nbsp;: déréférencement, hallucination factuelle hostile virale, blocage technique (robots.txt cassé, site down indexation). Action&nbsp;: comex en 24h, communication client si pertinent.</p>

      <h2>Calibrer les seuils sur votre baseline</h2>
      <p>Les seuils 5/15/30 % ci-dessus sont des médianes. Calibrer sur les 6-8 premières semaines de données&nbsp;: mesurer la variance hebdomadaire de votre baseline (souvent ±3-5 % en bruit pur), puis fixer le niveau jaune à 2x la variance, le rouge à 4x, le critique à 8x. Cette calibration empirique évite les alertes fantômes.</p>

      <h2>Alertes sentiment</h2>
      <p>En plus du citation rate, surveiller le sentiment&nbsp;: négatif &lt; 15 % = baseline saine, &gt; 25 % = signal jaune, &gt; 40 % = crise réputationnelle. Particulièrement surveiller les pics rapides&nbsp;: passage de 10 % à 30 % en 2 semaines même si toujours sous 40 % = alerte forte (tendance défavorable rapide).</p>

      <h2>Alertes share-of-voice</h2>
      <p>Plus contextuel par secteur. Règle générale&nbsp;: surveiller le passage en dessous d&apos;un palier (15 %, 10 %, 5 %) plus que la valeur absolue. Un passage de 18 % à 14 % chez un acteur secondaire est moins critique qu&apos;un passage de 25 % à 20 % chez le leader contesté.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Configuration alertes recommandée</p>
        <p className="text-sm text-ink">Email pour jaune (lecture asynchrone). Email + Slack pour rouge (réponse 48h). Email + Slack + SMS comm pour critique (réponse 24h). Configuration dans Geoperf et la plupart des outils SaaS dédiés.</p>
      </div>

      <h2>Cas concret — alerte qui a payé</h2>
      <p>ESN française mid-market, monitoring Geoperf depuis 12 mois. Décrochage citation rate de 35 % à 18 % en 4 semaines, déclenchement alerte rouge en semaine 2. Investigation post-alerte&nbsp;: ancien dirigeant avait publié un post LinkedIn viral négatif (700k vues) repris par presse spécialisée. Action engagée semaine 2 (publication corporate, RP correctrice, Wikipedia mis à jour). Citation rate remonte à 28 % en 8 semaines, 36 % en 16 semaines. Sans alerte, détection ~6 mois plus tard, dégâts réputationnels durables.</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: alerter sur le bruit (variations &lt; 5 %). Deuxième piège&nbsp;: ne pas affecter d&apos;owner clair par niveau (qui répond à l&apos;alerte&nbsp;? le marketing ? la comm ? le CMO ? le comex&nbsp;?). Troisième piège&nbsp;: ignorer les alertes répétées sans agir. Si alerte rouge active 2 semaines consécutives, escalation au niveau supérieur automatique.</p>

      <h2>Cadence de revue</h2>
      <p>Hebdomadaire&nbsp;: revue 30 min des dashboards par le owner désigné. Mensuelle&nbsp;: analyse plus profonde avec 1 page de synthèse comex. Trimestrielle&nbsp;: recalibrage des seuils + ajout/retrait de prompts au panel. Annuelle&nbsp;: audit complet (bench cross-secteur, comparaison outils, ROI).</p>
    </>
  );
}

function BodyConcurrents() {
  return (
    <>
      <h2>Pourquoi monitorer les concurrents sur les LLM</h2>
      <p>Le monitoring de votre marque seule ne suffit pas&nbsp;: la perception relative compte autant que la perception absolue. Une marque dont le citation rate est stable à 25 % alors que ses 3 concurrents passent de 30 % à 40 % perd objectivement du terrain, même si son chiffre absolu n&apos;a pas bougé. Le monitoring concurrentiel rend visible cette dynamique relative.</p>

      <h2>Sélection des concurrents à monitorer</h2>
      <p>Cinq à dix concurrents stratégiques. Inclure&nbsp;: (a) les 2-3 leaders sectoriels (référence haute), (b) les 2-3 challengers directs (votre niveau de marché), (c) 1-2 nouveaux entrants à surveiller (parfois sous-estimés mais montent rapidement sur les LLM), (d) éventuellement 1-2 acteurs adjacents (substitution potentielle). Plus de 10 concurrents devient ingérable opérationnellement.</p>

      <h2>KPI concurrentiels prioritaires</h2>
      <p><strong>Share-of-voice</strong>&nbsp;: votre poids dans les réponses LLM vs vos concurrents, en pourcentage. <strong>Average rank</strong>&nbsp;: quand listés ensemble, à quelle position chaque marque apparaît. <strong>Co-mention rate</strong>&nbsp;: combien de prompts mentionnent au moins 2 marques de votre catégorie ensemble. <strong>Sentiment relatif</strong>&nbsp;: votre sentiment vs sentiment moyen de vos concurrents.</p>

      <h2>Détection de mouvement concurrentiel</h2>
      <p>Si un concurrent passe de 15 % à 30 % de citation rate en 8 semaines, investiguer&nbsp;: ont-ils lancé une étude flagship ? Des mentions presse importantes ? Une refonte du site ? Une page Wikipedia ? Identifier la cause permet de comprendre les leviers qui marchent dans votre marché et d&apos;adapter votre stratégie ou de répondre.</p>

      <h2>Cartographie sources concurrentielles</h2>
      <p>Pour chaque concurrent, quelles sources les citent le plus ? Si concurrent X est massivement cité via AGEFI mais peu via Wikipedia, et concurrent Y via Wikipedia mais peu via AGEFI, ces signaux indiquent leurs stratégies respectives. Comparer avec votre propre source attribution révèle les axes où vous êtes sous-investi.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Tableau benchmark mensuel</p>
        <p className="text-sm text-ink">5 colonnes : nom marque, citation rate, share-of-voice, average rank, sentiment moyen. 1 ligne par concurrent + votre marque. À mettre à jour mensuellement et présenter en comex pour visualiser la dynamique.</p>
      </div>

      <h2>Outils qui font le monitoring concurrentiel</h2>
      <p>Geoperf, Profound, AthenaHQ permettent d&apos;ajouter explicitement les concurrents dans le panel et générer un benchmark automatique. Brandwatch AI Mode intègre le concurrentiel dans son dashboard suite. Pour le faire en DIY&nbsp;: passer chaque concurrent comme entité de recherche dans votre script Python + agrégation Looker. Coût direct minimal mais effort engineering 5-10 jours initial.</p>

      <h2>Cadence et action</h2>
      <p>Revue mensuelle des KPI concurrentiels&nbsp;: tableau benchmark à jour, identification des mouvements significatifs (variation &gt; 5 points). Pour les mouvements importants, investigation rapide (1-2h) sur la cause. Adaptation stratégique trimestrielle si plusieurs concurrents se renforcent simultanément.</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: copier la stratégie d&apos;un concurrent qui monte sans comprendre ses propres avantages distinctifs. Deuxième piège&nbsp;: focaliser uniquement sur les leaders sectoriels et ignorer les challengers ou nouveaux entrants. Troisième piège&nbsp;: déclencher une réaction défensive sur une variation isolée non confirmée (attendre la confirmation sur 2 semaines avant d&apos;agir).</p>
    </>
  );
}

function BodySentiment() {
  return (
    <>
      <h2>Le sentiment LLM est mesurable</h2>
      <p>Quand un LLM cite votre marque, le contexte de la mention porte une coloration émotionnelle&nbsp;: positif, neutre, négatif, ou mixte. Cette coloration est mesurable via un classifieur secondaire (Claude Haiku, GPT-4 mini, ou modèle équivalent) qui passe la réponse complète et retourne une catégorie + une raison. Sur un volume de 100-500 mentions/mois, le signal devient statistiquement significatif.</p>

      <h2>Méthode de classification</h2>
      <p>Pour chaque réponse LLM citant votre marque&nbsp;: prompt au classifieur du type «&nbsp;Cette réponse mentionne la marque X. Le contexte de cette mention est-il positif, neutre, négatif ou mixte ? Réponse en 1 mot + une raison principale en 10 mots&nbsp;». Avec Claude Haiku, coût ~0.0001 $/classification, total ~0.05 $ pour 500 mentions/mois.</p>

      <h2>Les quatre catégories</h2>
      <p><strong>Positif</strong>&nbsp;: la marque est recommandée, citée comme référence positive, ou décrite avec adjectifs favorables («&nbsp;leader&nbsp;», «&nbsp;innovant&nbsp;», «&nbsp;reconnu&nbsp;»). <strong>Neutre</strong>&nbsp;: la marque est mentionnée factuellement sans coloration («&nbsp;X est un acteur du secteur&nbsp;»). <strong>Négatif</strong>&nbsp;: la marque est évitée, citée avec critique, ou comparée défavorablement. <strong>Mixte</strong>&nbsp;: la mention contient à la fois positif et négatif ou nuances complexes.</p>

      <h2>Distribution baseline saine</h2>
      <p>Pour une marque B2B B2B FR mid-market en bonne santé&nbsp;: ~25-35 % positif, ~50-60 % neutre, &lt;15 % négatif, &lt;5 % mixte. Variations hors de ces fourchettes sont des signaux. Distribution &laquo;&nbsp;90 % neutre&nbsp;&raquo; suggère un manque de personnalité de marque (pas de critique mais pas d&apos;ambassadeur). Distribution &laquo;&nbsp;25 % négatif&nbsp;&raquo; signale une crise réputationnelle.</p>

      <h2>Diagnostic des mentions négatives</h2>
      <p>Sur les mentions classées négatives, faire une revue qualitative de l&apos;échantillon. Trois patterns fréquents&nbsp;: (1) hallucination factuelle hostile (LLM invente un fait négatif sans source réelle), (2) reprise de contenu négatif vrai (article presse négatif du passé sur-représenté), (3) coloration générale légèrement défavorable (pas de fait précis mais ton défavorable). Chaque pattern exige une réponse différente.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Exemple Q1 2026</p>
        <p className="text-sm text-ink">Marque B2B SaaS&nbsp;: 30 % positif, 55 % neutre, 12 % négatif, 3 % mixte. Sur les 12 % négatif, raison principale &laquo;&nbsp;prix élevé&nbsp;&raquo; (60 %), &laquo;&nbsp;UX confuse&nbsp;&raquo; (25 %), &laquo;&nbsp;support lent&nbsp;&raquo; (15 %). Action&nbsp;: page comparative prix transparente + revue UX, support proactif.</p>
      </div>

      <h2>Évolution temporelle</h2>
      <p>Sentiment moyen sur 12 semaines glissantes est plus utile qu&apos;une mesure isolée. Une amélioration progressive du positif (+5 points en 12 semaines) est le signal d&apos;une stratégie de marque qui prend. Une dégradation progressive du négatif (+5 points en 12 semaines) signale une crise naissante avant qu&apos;elle ne soit visible ailleurs.</p>

      <h2>Action sur les mentions négatives</h2>
      <p>Trois leviers&nbsp;: (1) corriger les erreurs factuelles à la source (publication corporate factuelle, mise à jour Wikipedia, RP correctrice si presse), (2) produire du contenu positif explicite pour rééquilibrer la distribution, (3) répondre aux critiques produit/service réelles plutôt que les nier. Délai d&apos;impact&nbsp;: 8-16 semaines pour voir un changement mesurable de la distribution.</p>

      <h2>Outils qui font la classification automatique</h2>
      <p>Geoperf, Profound, Brandwatch AI Mode classifient automatiquement chaque mention. Pour DIY&nbsp;: API Anthropic Claude Haiku, coût marginal négligeable, permet contrôle fin du prompt de classification. Vérifier régulièrement la qualité de la classification sur un échantillon manuel — les classifieurs ont 5-10 % d&apos;erreur sur cas ambigus.</p>
    </>
  );
}

function BodyDashboard() {
  return (
    <>
      <h2>Le dashboard LLM monitoring idéal</h2>
      <p>Un bon dashboard LLM monitoring tient en une page A4 lisible en 2 minutes par un comex non-expert. Trop d&apos;indicateurs noient le signal&nbsp;; trop peu cachent les nuances. Le dashboard de référence 2026 contient cinq sections, dix indicateurs principaux, présentés visuellement avec trends 12 semaines.</p>

      <h2>Section 1 — KPI socle (4 cards)</h2>
      <p>Quatre KPI en haut du dashboard&nbsp;: (a) citation rate moyen cross-LLM (4 LLM), (b) average source rank quand cité, (c) share-of-voice vs top-3 concurrents, (d) sentiment moyen (% positif). Chaque KPI affiché en chiffre principal + delta vs 7 jours + sparkline 12 semaines.</p>

      <h2>Section 2 — Breakdown par LLM (4 cards)</h2>
      <p>Quatre cards plus petites, une par LLM (ChatGPT, Gemini, Claude, Perplexity). Chaque card&nbsp;: citation rate spécifique + delta + indicateur visuel rouge/jaune/vert si seuil dépassé. Permet d&apos;identifier rapidement si un LLM particulier décroche pendant que les autres restent stables.</p>

      <h2>Section 3 — Source attribution (graph)</h2>
      <p>Pie chart ou bar chart horizontal montrant la distribution des sources qui citent votre marque dans les réponses LLM&nbsp;: Wikipedia X %, presse spécialisée X %, presse établie X %, votre site corporate X %, autres X %. Cette section diagnostique d&apos;un coup d&apos;œil les leviers d&apos;autorité tierce sur lesquels vous êtes investi ou sous-investi.</p>

      <h2>Section 4 — Concurrents benchmark (table)</h2>
      <p>Tableau de 5-7 lignes (votre marque + 4-6 concurrents). Colonnes&nbsp;: citation rate, share-of-voice, average rank, sentiment moyen, delta 30 jours. Tri par share-of-voice descendant. Permet de visualiser rapidement votre position relative et les mouvements concurrentiels significatifs du mois.</p>

      <h2>Section 5 — Alerts feed (liste)</h2>
      <p>Liste chronologique des 5-10 dernières alertes (jaune/rouge/critique) avec date, marque concernée, type d&apos;alerte, statut (open / investigated / closed). Permet le suivi opérationnel des incidents et la traçabilité des actions de réponse.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Outils pour build le dashboard</p>
        <p className="text-sm text-ink">Option 1&nbsp;: dashboard natif Geoperf (Starter à Agency couvre les 5 sections). Option 2&nbsp;: Looker / PowerBI / Metabase connecté via API à Geoperf ou Profound. Option 3&nbsp;: Notion + Embed Geoperf widget pour intégration documentation. Coût marginal&nbsp;: nul si Looker/Metabase déjà déployé.</p>
      </div>

      <h2>Cadence de revue</h2>
      <p>Hebdomadaire&nbsp;: revue 30 min par le owner (Head of SEO, Brand, ou CMO Adjoint). Lecture rapide des sections 1-2 + check des alertes section 5. Mensuelle&nbsp;: deep-dive sur sections 3-4, identification des actions à mener. Trimestrielle&nbsp;: présentation comex avec une page de synthèse + recommandations. Annuelle&nbsp;: audit complet du dashboard, ajout/retrait de KPI selon évolution besoin.</p>

      <h2>Pièges à éviter dans le design</h2>
      <p>Premier piège&nbsp;: ajouter trop d&apos;indicateurs (10 max). Deuxième piège&nbsp;: ne pas afficher les deltas (chiffre absolu sans tendance est pauvre en information). Troisième piège&nbsp;: ne pas montrer les sparklines 12 semaines (le bruit court terme cache souvent le signal moyen terme).</p>

      <h2>Template Geoperf</h2>
      <p>Le dashboard natif Geoperf reprend ces 5 sections par défaut, accessible aux abonnés Starter et au-dessus. Pour un template Looker / PowerBI custom, contactez l&apos;équipe Geoperf via le formulaire d&apos;audit GEO consulting — un template SQL standardisé est fourni en complément du SaaS pour les abonnés Pro et Agency.</p>
    </>
  );
}

export const BRAND_MONITORING_CLUSTERS: ClusterRegistry = {
  "monitoring-marque-ia-outils-2026": {
    parentPillar: "llm-brand-monitoring",
    fr: {
      title: "Monitoring de marque IA : top outils en 2026",
      metaDescription:
        "Trois catégories d'outils LLM monitoring 2026 : SaaS dédiés (Geoperf, Profound, Otterly), extensions enterprise (Brandwatch, Sprinklr), DIY scripts. Stack par profil.",
      intro:
        "L'écosystème de monitoring LLM s'est densifié rapidement entre 2024 et 2026. Trois catégories d'outils distincts — SaaS multi-LLM dédiés, extensions enterprise, solutions DIY — offrent des trade-offs distincts selon profil d'entreprise et niveau de maturité visé.",
      publishedAt: PUB,
      Body: BodyOutils,
    },
  },
  "alertes-llm-mention-marque": {
    parentPillar: "llm-brand-monitoring",
    fr: {
      title: "Alertes LLM mention de marque : seuils et configuration",
      metaDescription:
        "Trois niveaux d'alerte LLM standard : jaune (-5 à -15 %), rouge (>-15 %), critique (>-30 %). Calibrer sur baseline, action par niveau, cas concret.",
      intro:
        "Sans alertes calibrées, le monitoring LLM devient un dashboard mort. Trois niveaux standard — jaune, rouge, critique — avec seuils de variation et actions associées transforment le monitoring en outil de risk management actif. Calibration empirique sur 6-8 semaines de baseline.",
      publishedAt: PUB,
      Body: BodyAlertes,
    },
  },
  "concurrents-llm-monitoring": {
    parentPillar: "llm-brand-monitoring",
    fr: {
      title: "Monitoring LLM des concurrents : méthode et KPI",
      metaDescription:
        "Méthode de monitoring concurrentiel LLM : sélection 5-10 concurrents, KPI relatifs (share-of-voice, average rank, co-mention, sentiment relatif), tableau benchmark.",
      intro:
        "Monitorer votre marque seule ne suffit pas : la perception relative compte autant que la perception absolue. Méthode de monitoring concurrentiel — sélection de 5-10 concurrents stratégiques, KPI relatifs, cartographie sources, cadence et action — pour rendre la dynamique sectorielle visible.",
      publishedAt: PUB,
      Body: BodyConcurrents,
    },
  },
  "sentiment-marque-llm": {
    parentPillar: "llm-brand-monitoring",
    fr: {
      title: "Sentiment de marque dans les LLM : classifier et agir",
      metaDescription:
        "Classification automatique du sentiment LLM : positif, neutre, négatif, mixte. Distribution baseline saine, diagnostic mentions négatives, leviers d'action.",
      intro:
        "Le sentiment LLM est mesurable via un classifieur secondaire (Claude Haiku, GPT mini) qui retourne catégorie + raison pour chaque mention. Sur 100-500 mentions/mois, le signal devient significatif. Distribution baseline saine et trois leviers d'action pour les mentions négatives.",
      publishedAt: PUB,
      Body: BodySentiment,
    },
  },
  "dashboard-monitoring-llm-template": {
    parentPillar: "llm-brand-monitoring",
    fr: {
      title: "Dashboard LLM monitoring : template en 5 sections",
      metaDescription:
        "Template dashboard LLM monitoring : KPI socle, breakdown par LLM, source attribution, benchmark concurrents, alerts feed. Outils Looker / PowerBI / natif.",
      intro:
        "Un bon dashboard LLM monitoring tient en une page A4 lisible en 2 minutes par un comex non-expert. Cinq sections — KPI socle, breakdown par LLM, source attribution, benchmark concurrents, alerts feed — couvrent l'essentiel sans noyer le signal.",
      publishedAt: PUB,
      Body: BodyDashboard,
    },
  },
};
