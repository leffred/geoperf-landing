// S29 Session 3 — Clusters around pillar #10 llm-citation-strategy.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyStrategie() {
  return (
    <>
      <h2>Une stratégie de citation est un programme 12-24 mois</h2>
      <p>Contrairement au SEO classique où des optimisations on-page produisent des effets en 2-6 semaines, une stratégie de citation LLM donne ses pleins résultats en 12-24 mois. C&apos;est la durée nécessaire pour construire l&apos;autorité tierce (Wikipedia, presse, partenariats), faire ingérer le contenu par les corpus LLM (cycles 6-12 mois), et stabiliser une position citationnelle robuste.</p>

      <h2>Six leviers d&apos;une stratégie complète</h2>
      <p><strong>Levier 1 — Wikipedia</strong>&nbsp;: page dédiée si éligible, ou mentions stratégiques dans articles connexes. Représente 32-38 % des citations cross-LLM. <strong>Levier 2 — Presse spécialisée sectorielle</strong>&nbsp;: 5-10 médias de référence ciblés. <strong>Levier 3 — Presse établie</strong>&nbsp;: Le Monde, Échos, La Tribune, Figaro pour FR ; FT, NYT, WSJ, Bloomberg pour US. <strong>Levier 4 — Études flagship</strong>&nbsp;: 1-2/an avec data propriétaire. <strong>Levier 5 — Contributions tierces</strong>&nbsp;: podcasts, conférences, tribunes. <strong>Levier 6 — Communautés qualifiées</strong>&nbsp;: Reddit, Stack Overflow, GitHub.</p>

      <h2>Allocation budget par levier</h2>
      <p>Pour PME B2B mid-market avec budget 30-50 k€/an dédié citation strategy&nbsp;: Wikipedia 5-8 k€ (one-shot ou éditeur certifié), presse spécialisée 18-24 k€/an (attaché de presse 1.5-2k€/mois), presse établie 6-10 k€/an (PR ponctuelle pour études), études flagship 8-15 k€/an (production + diffusion), contributions tierces 1-3 k€/an (déplacements, frais), communautés qualifiées ~0 € budget direct (temps interne).</p>

      <h2>Roadmap 12 mois</h2>
      <p>Mois 1-3&nbsp;: audit Wikipedia, démarrer attaché de presse, identifier les 5-10 médias prioritaires. Mois 4-6&nbsp;: première étude flagship en production, premières mentions presse spécialisée obtenues. Mois 7-9&nbsp;: étude flagship publiée + relayée, demande Wikipedia officialisée si éligible. Mois 10-12&nbsp;: 8-12 mentions presse cumulées, première mesure d&apos;impact GEO (citation rate cross-LLM).</p>

      <h2>Mesure d&apos;impact</h2>
      <p>Les KPI à tracker quarterly&nbsp;: <strong>(1) Mentions cumulées</strong> sur sources de référence (Wikipedia, presse top-tier) sur 12 mois glissants. <strong>(2) Citation rate cross-LLM</strong> mesuré via outil GEO (Geoperf, Profound). <strong>(3) Source attribution</strong>&nbsp;: distribution des sources qui citent votre marque. <strong>(4) Sentiment moyen</strong> sur les mentions LLM.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Cible 24 mois</p>
        <p className="text-sm text-ink">Pour PME B2B FR mid-market démarrant à 12 % de citation rate cross-LLM&nbsp;: cible 35-50 % à 24 mois. Distribution sources balanced (40 % Wikipedia + presse, 30 % corporate, 30 % autres). 15-25 mentions presse cumulées + 1-2 études flagship publiées.</p>
      </div>

      <h2>Erreurs stratégiques fréquentes</h2>
      <p>Premier piège&nbsp;: viser uniquement la presse établie sans construire la presse spécialisée d&apos;abord. La presse spécialisée FR (AGEFI, Échos, Le Monde Informatique) est plus accessible et tout aussi citée par les LLM. Deuxième piège&nbsp;: ignorer Wikipedia pendant 18 mois en pensant que &laquo;&nbsp;ça viendra plus tard&nbsp;&raquo;. Wikipedia est le levier #1 et démarre tôt. Troisième piège&nbsp;: ne pas mesurer l&apos;impact (citation rate cross-LLM) et donc ne pas pouvoir ajuster.</p>

      <h2>ROI long terme</h2>
      <p>Une stratégie de citation correctement exécutée produit&nbsp;: amélioration durable de citation rate (3-5 ans), trafic organique préservé (vs déclin lié à AI Overview), lift sur conversion sales (autorité perçue), backlinks SEO de qualité comme bénéfice secondaire. ROI total estimé&nbsp;: 5-10x sur l&apos;investissement à 24 mois, comparable au ROI du SEO 2010-2012 — c&apos;est-à-dire historiquement très favorable à condition d&apos;investir tôt.</p>

      <h2>Différence vs link building SEO classique</h2>
      <p>Link building SEO&nbsp;: backlinks domain authority &gt; X. Citation strategy LLM&nbsp;: mentions contextuelles dans paragraphes pertinents, sentiment positif, sources autoritaires. La frontière est floue mais réelle&nbsp;: une bonne citation LLM est aussi un bon backlink SEO ; l&apos;inverse n&apos;est pas vrai. Les link building bas de gamme (PBN, paid links) ont quasi aucun impact LLM.</p>
    </>
  );
}

function BodyDonneesStructurees() {
  return (
    <>
      <h2>Données structurées et citation LLM</h2>
      <p>Au-delà du contenu textuel, les données structurées (schema.org, JSON-LD, llms.txt, sitemap.xml) sont une couche d&apos;autorité technique qui amplifie la probabilité d&apos;être cité. Les LLM lisent ces données pour comprendre l&apos;entité d&apos;une page&nbsp;: qui est l&apos;auteur, à quoi se rapporte le contenu, quelle est la date, quelle est l&apos;organisation derrière. Sans ces signaux, l&apos;extraction est probabiliste et donc moins favorable.</p>

      <h2>Schema Organization avec sameAs</h2>
      <p>Le schema Organization avec un champ <code>sameAs</code> bien renseigné est le premier signal d&apos;autorité technique. <code>sameAs</code> liste les profils canoniques de votre marque (Wikipedia, LinkedIn, X, Crunchbase, GitHub si pertinent). Cette liste aide les LLM à désambiguïser votre marque (vs concurrents avec noms similaires) et à associer les sources tierces qui parlent de vous au reste de votre identité numérique.</p>

      <h2>Schema FAQPage et citation</h2>
      <p>Le schema FAQPage est fortement corrélé avec le citation rate AI Overview. Selon Authoritas Q1 2026, les pages avec FAQPage schema bien renseigné ont 3.1x plus de citations AI Overview que les pages équivalentes sans. La raison&nbsp;: les Q/R structurées correspondent au format optimal pour ingestion LLM. Déployer FAQPage sur les 30 pages stratégiques est l&apos;optimisation single-element à plus haut ROI.</p>

      <h2>Le fichier llms.txt</h2>
      <p>Standardisé en 2024 et progressivement adopté en 2025-2026, le fichier <code>llms.txt</code> à la racine du domaine liste les pages clés de votre site avec contexte sémantique en Markdown simple. Format&nbsp;: titre, description, sections avec liens et 1-2 phrases d&apos;explication. Anthropic et OpenAI ont confirmé l&apos;utiliser comme signal de qualité quand présent. Coût&nbsp;: 1-2 heures de production, mise à jour trimestrielle.</p>

      <h2>Sitemap.xml structuré</h2>
      <p>Au-delà du sitemap.xml standard, structurer en sous-sitemaps thématiques (sitemap-pillar.xml, sitemap-cluster.xml, sitemap-blog.xml) facilite la compréhension de votre architecture éditoriale par les bots LLM et Google. Soumettre les sous-sitemaps explicitement à Google Search Console et Bing Webmaster Tools.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Stack données structurées 2026</p>
        <p className="text-sm text-ink">Schema.org JSON-LD (Organization, Article, FAQPage, HowTo, Product) + sameAs renseigné + llms.txt à racine + sitemap structuré + robots.txt avec autorisation explicite GPTBot/ClaudeBot/PerplexityBot/Google-Extended. Coût total&nbsp;: 5-10 jours développeur + 1 day docs.</p>
      </div>

      <h2>Schema dateModified et fraîcheur</h2>
      <p>Le champ <code>dateModified</code> dans les schemas Article signale aux LLM la fraîcheur de votre contenu. Une page avec <code>datePublished: 2024</code> et pas de <code>dateModified</code> récent sera considérée datée. Mettre à jour <code>dateModified</code> à chaque rafraîchissement significatif (data updates, exemples actualisés, sections ajoutées). Cette maintenance signale aux LLM que la page est vivante.</p>

      <h2>Maintenance et cohérence</h2>
      <p>Schema.org doit être maintenu en synchronisation avec le contenu visible. Si votre schema dit &laquo;&nbsp;published 2024-01-01&nbsp;&raquo; mais l&apos;article est manifestement récent, ou si <code>aggregateRating</code> n&apos;est pas mis à jour, les LLM détectent ces incohérences et dévalorisent. Audit annuel obligatoire sur les 30 pages stratégiques.</p>

      <h2>Validation et tests</h2>
      <p>Trois validateurs gratuits indispensables&nbsp;: <strong>Google Rich Results Test</strong>, <strong>Schema.org Validator</strong>, <strong>JSON-LD Playground</strong>. Utiliser systématiquement avant déploiement. Une seule erreur dans le JSON-LD invalide tout le bloc — tester rigoureusement.</p>

      <h2>Pièges courants</h2>
      <p>Premier piège&nbsp;: schema vide ou minimal (juste <code>@type</code> + <code>name</code>). Les LLM ont besoin de richesse sémantique. Deuxième piège&nbsp;: schema dupliqué entre header et body créant conflits. Troisième piège&nbsp;: schema sur la page d&apos;accueil seulement, pas sur les pages stratégiques. Le schema doit être déployé sur toute page voulant être citée, pas juste home.</p>
    </>
  );
}

function BodySources() {
  return (
    <>
      <h2>Pourquoi connaître les sources préférées des LLM est stratégique</h2>
      <p>Investir aveuglément en RP, content, ou link building sans connaître les sources les plus citées par les LLM est inefficace. La distribution des sources est observable empiriquement, et concentrée&nbsp;: 5-10 sources couvrent 70-80 % des citations dans la majorité des secteurs. Cibler ces sources prioritairement est le levier d&apos;efficacité maximal.</p>

      <h2>Top 5 sources cross-LLM en B2B FR (Q1 2026)</h2>
      <p>Mesure Geoperf sur 5000 réponses LLM B2B FR&nbsp;: <strong>(1) Wikipedia FR</strong> 32 % des citations. <strong>(2) Presse spécialisée sectorielle</strong> 18 % (AGEFI, Échos, Le Monde Informatique selon secteur). <strong>(3) Presse établie générale</strong> 14 % (Le Monde, Les Échos, La Tribune). <strong>(4) Sites corporate des leaders sectoriels</strong> 12 %. <strong>(5) Académique et institutionnel</strong> 10 % (.edu, .gov, INSEE, Banque de France). Total top 5 = 86 % des citations.</p>

      <h2>Variations par LLM</h2>
      <p>ChatGPT&nbsp;: Wikipedia ~32 %, presse spécialisée ~18 %, sites corporate ~12 %. Plus &laquo;&nbsp;équilibré&nbsp;&raquo;. <strong>Perplexity</strong>&nbsp;: Wikipedia ~38 %, presse spécialisée plus élevée ~24 % (Perplexity favorise les sources sectorielles à jour). <strong>Gemini AI Overview</strong>&nbsp;: Wikipedia ~35 %, sites corporate plus élevés ~22 % (Gemini, lié à Google, favorise légèrement les sites officiels). <strong>Claude</strong>&nbsp;: distribution similaire à ChatGPT mais légèrement plus fort sur l&apos;académique.</p>

      <h2>Variations par secteur</h2>
      <p>Asset management FR&nbsp;: Wikipedia 38 %, AGEFI 24 %, Les Échos 19 %, Funds Magazine 12 %, Investance/H24 Finance 10 %. SaaS B2B FR&nbsp;: Wikipedia 28 %, Le Monde Informatique 22 %, JDN 18 %, sites corporate des leaders 16 %, blogs experts 10 %. Conseil en management&nbsp;: Wikipedia 30 %, Les Échos 25 %, HBR/Harvard articles 15 %, Insider 10 %, sites corporate 12 %.</p>

      <h2>Implication stratégique</h2>
      <p>Identifier les 5-10 sources qui dominent dans VOTRE secteur est la première action stratégique. Faites-le via votre outil GEO (source attribution module) ou en analysant manuellement 50 réponses LLM sur prompts secteur. Une fois identifiées, votre stratégie d&apos;autorité tierce devient ciblée&nbsp;: prioriser la présence sur ces 5-10 sources spécifiques plutôt que de disperser l&apos;effort sur 20-30 sources.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Méthode d&apos;identification</p>
        <p className="text-sm text-ink">Étape 1&nbsp;: lancer panel 30 prompts secteur. Étape 2&nbsp;: pour chaque réponse LLM, lister les sources citées. Étape 3&nbsp;: agréger sur 4 LLM × 30 prompts = 120 réponses, ~300-500 sources mentionnées. Étape 4&nbsp;: ranking des sources par fréquence. Top 10 = vos cibles RP prioritaires.</p>
      </div>

      <h2>Construire la présence sur ces sources</h2>
      <p>Pour Wikipedia&nbsp;: éditeur certifié ou demandeur expérimenté, 5-8 k€ one-shot. Pour presse spécialisée&nbsp;: attaché de presse spécialisé 1.5-3 k€/mois sur 12 mois (= 18-36 k€/an). Pour presse établie&nbsp;: PR ponctuelle sur études flagship, 6-10 k€/an. Pour académique&nbsp;: collaborations universitaires (étude commanditée, financement de thèse), 5-15 k€/an.</p>

      <h2>Sources émergentes en 2026</h2>
      <p>Reddit gagne du poids dans les citations LLM (4-8 % en 2026, projection 8-12 % en 2028). Stack Overflow reste fort sur tech/dev. Substack newsletters experts montent rapidement (3-5 % en 2026). YouTube transcrits (avec sous-titres) commencent à apparaître. Surveiller ces sources émergentes peut donner un avantage early-mover.</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: cibler des sources prestigieuses mais peu citées par les LLM (par exemple certains journaux financiers très lus mais peu indexés). Deuxième piège&nbsp;: oublier les sources spécialisées au profit des généralistes. Pour B2B niche, AGEFI/JDN cite plus que Le Monde. Troisième piège&nbsp;: changer de cibles tous les trimestres. La construction d&apos;autorité demande 12-24 mois minimum sur les sources choisies.</p>
    </>
  );
}

function BodyRelationsPresse() {
  return (
    <>
      <h2>La RP éditoriale earned est le levier #2 GEO</h2>
      <p>Après Wikipedia, la presse spécialisée et établie représente 32 % des citations cross-LLM. Construire une stratégie RP éditoriale earned (gagnée par mérite, pas sponsorisée) est le levier off-page à plus haut ROI durable. Voici comment structurer une stratégie RP qui paie sur 12-24 mois.</p>

      <h2>Différence earned vs paid</h2>
      <p>Le contenu sponsorisé / advertorial / publi-rédactionnel a peu d&apos;impact LLM&nbsp;: les modèles dévalorisent les pages marquées &laquo;&nbsp;sponsored&nbsp;&raquo;, &laquo;&nbsp;advertorial&nbsp;&raquo; ou &laquo;&nbsp;promotion&nbsp;&raquo;. La RP earned (mérité par angle éditorial fort, étude data, point de vue tribune) est très efficace. Investir 1500-3000 €/mois en attaché de presse spécialisé qualitatif rapporte plus que 5000 €/mois en contenu sponsorisé volumineux.</p>

      <h2>Quatre types de retombées RP</h2>
      <p><strong>1. Citations courtes</strong>&nbsp;: votre marque mentionnée dans un article sectoriel sans interview, juste comme exemple. Cible 8-15/an. <strong>2. Articles dédiés ou interviews</strong>&nbsp;: article complet sur votre marque ou interview du dirigeant. Cible 2-4/an. <strong>3. Tribunes signées</strong>&nbsp;: opinion piece de votre dirigeant publiée. Cible 3-5/an. <strong>4. Études flagship reprises</strong>&nbsp;: votre étude data citée par la presse. Cible 30-100 reprises sur une étude bien promue.</p>

      <h2>Identifier les médias prioritaires</h2>
      <p>5-10 médias spécialisés de votre secteur, 2-3 médias établis généralistes. Critères de sélection&nbsp;: lectorat décideur (votre cible), trafic web élevé (corrélé citation LLM), stabilité éditoriale (médias établis &gt; pure play récents), présence dans les sources LLM citées dans votre secteur (vérifier via outil GEO).</p>

      <h2>Stratégie d&apos;angles éditoriaux</h2>
      <p>Trois angles qui marchent en B2B 2026&nbsp;: <strong>(1) Data exclusive</strong> — étude flagship trimestrielle ou semestrielle avec data propriétaire. <strong>(2) Point de vue contrarian</strong> — opinion à contre-courant, argumentée, sur tendance secteur. <strong>(3) Étude de cas client</strong> — story client avec data ROI, anonymisée si sensible. Ces angles produisent du earned bien meilleur que les annonces produit ou levées de fonds standards.</p>

      <h2>Engagement attaché de presse</h2>
      <p>Pour PME B2B mid-market&nbsp;: attaché de presse spécialisé indépendant ou petite agence, budget 1.5-3 k€/mois sur 12 mois minimum. Pour ETI&nbsp;: agence RP de taille moyenne, 3-5 k€/mois + 1 ETP communication interne. Pour grand compte&nbsp;: agence RP top-tier (Edelman, FleishmanHillard), 8-15 k€/mois + équipe communication interne 2-3 ETP.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">ROI RP éditoriale</p>
        <p className="text-sm text-ink">Investissement annuel 18-36 k€/an (PME). Retombées typiques&nbsp;: 8-15 mentions/an (médias spécialisés) + 2-3 articles dédiés (incluant 1 grand média) + 30-100 reprises sur étude flagship. Impact LLM&nbsp;: +15-30 points de citation rate cross-LLM en 12 mois.</p>
      </div>

      <h2>Métriques de suivi RP</h2>
      <p>Output direct&nbsp;: nombre d&apos;articles, mentions, podcasts par mois. Ratio earned vs paid (cible &gt; 80 % earned). Qualité éditoriale&nbsp;: presse cible vs hors-cible. À tracker mensuellement avec votre attaché de presse via outil de media intelligence (Cision, Meltwater, Mynewsdesk).</p>

      <h2>Métriques de suivi GEO</h2>
      <p>Le KPI ultime&nbsp;: variation du citation rate cross-LLM. Mesurer baseline avant démarrage RP, puis variation à 6, 12, 18 mois. RP éditoriale bien menée produit +5-10 points de citation rate à 6 mois, +15-30 à 12 mois, +30-50 à 24 mois (effet cumulatif sur les corpus LLM).</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: chasser uniquement les top médias sans construire une base presse spécialisée. Top médias sans base = irrégularité des retombées. Deuxième piège&nbsp;: confondre &laquo;&nbsp;avoir un attaché de presse&nbsp;&raquo; et &laquo;&nbsp;avoir une stratégie RP&nbsp;&raquo;. Sans angles éditoriaux forts, l&apos;attaché de presse n&apos;a rien à pousser. Troisième piège&nbsp;: ignorer la patience nécessaire. La RP éditoriale paie à 12-18 mois, pas à 3 mois. Sortir avant cette échéance c&apos;est jeter l&apos;investissement.</p>
    </>
  );
}

function BodyCitationGraph() {
  return (
    <>
      <h2>Le citation graph est le link building 2026</h2>
      <p>Le link building SEO classique (backlinks par quantité et autorité de domaine) cède la place au &laquo;&nbsp;citation graph&nbsp;&raquo;&nbsp;: graph de mentions contextuelles de votre marque dans des sources autoritaires. Plus votre citation graph est dense et qualitatif, plus les LLM vous identifient comme une entité de référence. Construire ce graph est le grand chantier off-page 2026-2028.</p>

      <h2>Les 4 dimensions du citation graph</h2>
      <p><strong>(1) Densité</strong>&nbsp;: combien de sources autoritaires mentionnent votre marque sur 12 mois glissants. <strong>(2) Qualité</strong>&nbsp;: profil des sources (Wikipedia, presse établie, .edu/.gov &gt; blogs random, forums niches). <strong>(3) Diversité</strong>&nbsp;: équilibre entre catégories de sources (40 % Wikipedia/presse + 30 % corporate + 30 % autres = robuste). <strong>(4) Récence</strong>&nbsp;: fréquence des nouvelles mentions (en flux continu &gt; en bloc puis silence).</p>

      <h2>Building blocks du citation graph</h2>
      <p>Five blocs à construire en parallèle&nbsp;: <strong>1. Wikipedia</strong> page dédiée + mentions stratégiques articles connexes. <strong>2. Presse spécialisée + établie</strong> via stratégie RP éditoriale earned. <strong>3. Études flagship</strong> citées par tiers, alimentant nouvelles citations. <strong>4. Tribunes et contributions</strong> dans publications tierces. <strong>5. Communautés qualifiées</strong> (Reddit, Stack Overflow, Hacker News) avec présence authentique non-promotionnelle.</p>

      <h2>Mesurer la densité du graph</h2>
      <p>Outils de media intelligence (Cision, Meltwater, Muck Rack) tracking automatique des mentions. Compléter avec recherches manuelles trimestrielles sur Google site:wikipedia.org, site:lemonde.fr, etc. Pour le grand-public, rechercher mentions sur podcasts, YouTube, Twitter via outils dédiés (Listen Notes pour podcasts, Sprinklr pour social).</p>

      <h2>Cible de densité par profil</h2>
      <p>PME B2B mid-market 2026&nbsp;: 25-50 mentions sur 12 mois cumulés (toutes sources confondues). ETI&nbsp;: 80-200 mentions. Grand compte&nbsp;: 300-1000+ mentions. Sous ces seuils, votre citation graph est trop fragile pour produire un citation rate LLM significatif.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Hiérarchie qualité des mentions</p>
        <p className="text-sm text-ink">Tier 1 (poids 5x)&nbsp;: Wikipedia dédiée, NYT/Le Monde article dédié, étude académique citante. Tier 2 (poids 3x)&nbsp;: presse spécialisée article dédié, podcast majeur reprise. Tier 3 (poids 1x)&nbsp;: blogs experts, mentions courtes presse, podcasts niches. Tier 4 (poids 0.3x)&nbsp;: forums, sites confidentiels.</p>
      </div>

      <h2>Stratégie de croissance du graph</h2>
      <p>Année 1&nbsp;: poser les fondations — Wikipedia + 5-10 mentions presse spécialisée + 1 étude flagship. Année 2&nbsp;: densifier — 15-25 mentions presse + 1-2 études flagship + premières contributions tierces. Année 3&nbsp;: consolider — 30-50 mentions/an récurrentes, présence Wikipedia mature, place dans les classements et awards sectoriels.</p>

      <h2>Effet de réseau</h2>
      <p>Le citation graph présente un effet de réseau&nbsp;: une mention par source A facilite la mention par source B (les journalistes lisent leurs concurrents). Une fois le seuil de 25-50 mentions cumulées atteint, la croissance devient plus facile. Sortir de l&apos;invisibilité initiale est la phase la plus difficile et la plus longue.</p>

      <h2>Maintien long terme</h2>
      <p>Une fois le graph établi, la maintenance est moins coûteuse mais reste nécessaire. Sans nouveaux blocs publiés et nouvelles études, le graph se dégrade lentement (mentions vieillissent, perdent en pertinence). Cadence de maintien&nbsp;: 1-2 études flagship/an, 8-15 mentions presse, 2-3 contributions podcasts/conférences. Coût&nbsp;: ~50 % du coût de construction initial.</p>

      <h2>Le citation graph comme moat compétitif</h2>
      <p>Contrairement aux backlinks SEO qui peuvent être manipulés, le citation graph se construit par mérite réel sur 24-36 mois. Cette durée et cette difficulté en font un moat compétitif solide&nbsp;: les concurrents qui démarrent en 2026 ne rattraperont pas en 2028. Investir maintenant capture un avantage durable que les nouveaux entrants ne pourront pas répliquer rapidement.</p>
    </>
  );
}

export const CITATION_STRATEGY_CLUSTERS: ClusterRegistry = {
  "strategie-citation-llm-2026": {
    parentPillar: "llm-citation-strategy",
    fr: {
      title: "Stratégie de citation LLM 2026 : programme 12-24 mois",
      metaDescription:
        "Stratégie de citation LLM en six leviers : Wikipedia, presse spécialisée, presse établie, études flagship, contributions tierces, communautés. Roadmap 12-24 mois.",
      intro:
        "Une stratégie de citation LLM donne ses pleins résultats en 12-24 mois — durée nécessaire pour construire l'autorité tierce, faire ingérer le contenu par les corpus LLM, stabiliser la position citationnelle. Six leviers et roadmap 12 mois pour PME B2B avec budget 30-50 k€/an.",
      publishedAt: PUB,
      Body: BodyStrategie,
    },
  },
  "donnees-structurees-pour-citation": {
    parentPillar: "llm-citation-strategy",
    fr: {
      title: "Données structurées pour la citation LLM",
      metaDescription:
        "Schema.org, llms.txt, sitemap structuré, robots.txt : la couche d'autorité technique qui amplifie la probabilité d'être cité par les LLM. Validation et maintenance.",
      intro:
        "Au-delà du contenu, les données structurées (schema.org JSON-LD, llms.txt, sitemap structuré, robots.txt) sont une couche d'autorité technique qui amplifie la probabilité d'être cité. Sans ces signaux, l'extraction LLM est probabiliste et donc moins favorable.",
      publishedAt: PUB,
      Body: BodyDonneesStructurees,
    },
  },
  "sources-prefere-llm-citation": {
    parentPillar: "llm-citation-strategy",
    fr: {
      title: "Sources que les LLM citent : top 10 cross-LLM",
      metaDescription:
        "Top sources cross-LLM en B2B FR (Q1 2026) : Wikipedia 32 %, presse spécialisée 18 %, presse établie 14 %, sites corporate 12 %, académique 10 %. Méthode d'identification.",
      intro:
        "Investir aveuglément en RP sans connaître les sources les plus citées par les LLM est inefficace. Top 5 sources cross-LLM en B2B FR — Wikipedia, presse spécialisée, presse établie, sites corporate, académique — couvrent 86 % des citations. Méthode d'identification et stratégie de ciblage.",
      publishedAt: PUB,
      Body: BodySources,
    },
  },
  "relations-presse-pour-llm": {
    parentPillar: "llm-citation-strategy",
    fr: {
      title: "Relations presse pour les LLM : earned vs paid",
      metaDescription:
        "RP éditoriale earned = levier #2 GEO après Wikipedia. Quatre types de retombées, stratégie d'angles, engagement attaché de presse, métriques. ROI 12-24 mois.",
      intro:
        "Après Wikipedia, la presse représente 32 % des citations cross-LLM. La RP éditoriale earned (gagnée par mérite éditorial) est très efficace ; le contenu sponsorisé l'est peu. Stratégie RP en quatre types de retombées, angles éditoriaux qui marchent, et budget par profil.",
      publishedAt: PUB,
      Body: BodyRelationsPresse,
    },
  },
  "build-citation-graph": {
    parentPillar: "llm-citation-strategy",
    fr: {
      title: "Construire son citation graph en 24 mois",
      metaDescription:
        "Le citation graph est le link building 2026 : densité, qualité, diversité, récence. 5 building blocks, mesure, hiérarchie qualité. Moat compétitif sur 24-36 mois.",
      intro:
        "Le citation graph est le link building 2026 : graph de mentions contextuelles de votre marque dans des sources autoritaires. Quatre dimensions — densité, qualité, diversité, récence — et cinq building blocks pour construire un moat compétitif sur 24-36 mois.",
      publishedAt: PUB,
      Body: BodyCitationGraph,
    },
  },
};
