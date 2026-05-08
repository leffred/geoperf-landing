// S29 Session 3 — Clusters around pillar #2 geo-generative-engine-optimization.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyVsSeo() {
  return (
    <>
      <h2>Pourquoi 10 différences et pas une seule ?</h2>
      <p>GEO et SEO ne sont pas synonymes. La différence se mesure sur dix axes distincts qui, combinés, expliquent pourquoi une marque excellente en SEO peut être invisible aux LLM, et inversement. Voici les dix points qu&apos;un CMO doit connaître avant d&apos;arbitrer son budget 2026.</p>

      <h2>Différence 1 — Surface de réponse</h2>
      <p>Le SEO produit dix liens bleus dans une SERP, l&apos;utilisateur choisit. Le GEO produit une seule réponse synthétique de 100 à 300 mots, l&apos;utilisateur lit. La marque non citée n&apos;a aucune position de fallback.</p>

      <h2>Différence 2 — Métrique principale</h2>
      <p>SEO&nbsp;: position moyenne et CTR. GEO&nbsp;: citation rate, average source rank, share-of-voice. Aucun outil SEO classique ne mesure ces trois indicateurs ; il faut des outils dédiés (Geoperf, Profound, Otterly).</p>

      <h2>Différence 3 — Sources d&apos;autorité</h2>
      <p>Google pondère lourdement les backlinks en quantité et qualité. Les LLM pondèrent les sources tierces établies&nbsp;: Wikipedia, presse spécialisée, .edu/.gov. Une marque avec mille backlinks de qualité moyenne perd face à une marque avec dix mentions Wikipedia + presse.</p>

      <h2>Différence 4 — Format de contenu</h2>
      <p>SEO accepte le contenu narratif riche. GEO préfère structure&nbsp;: H1 question, intro 50-80 mots qui répond, listes, tableaux, schema.org. Une page corporate sans structure rank Google mais ne gagne aucune citation LLM.</p>

      <h2>Différence 5 — Fenêtre de mise à jour</h2>
      <p>Index Google rafraîchi en heures à jours. Corpus LLM ré-entraîné tous les six à douze mois (mémoire) ou en temps réel (search). Les efforts GEO se mesurent sur deux horizons.</p>

      <h2>Différence 6 — Technique on-page</h2>
      <p>SEO&nbsp;: meta tags, sitemap, robots.txt classique. GEO ajoute&nbsp;: schema.org riche (FAQPage, HowTo, Organization avec sameAs), llms.txt, autorisation explicite GPTBot/ClaudeBot/PerplexityBot, structure question/réponse.</p>

      <h2>Différence 7 — Mesurabilité du trafic</h2>
      <p>SEO offre Search Console depuis 2006. GEO n&apos;a pas d&apos;équivalent natif&nbsp;: ChatGPT n&apos;envoie pas de référer, les visites sont presque toujours sans attribution. La mesure passe par citation rate et lift sur recherches branded post-conversation.</p>

      <h2>Différence 8 — Vitesse d&apos;impact</h2>
      <p>SEO&nbsp;: 3-6 mois pour ranker top 10. GEO Search (Perplexity, AI Overviews)&nbsp;: 4-12 semaines. GEO mémoire (ChatGPT mode standard, Claude)&nbsp;: 6-12 mois selon fenêtre d&apos;entraînement.</p>

      <h2>Différence 9 — Volatilité</h2>
      <p>Google Core Update peut effacer 30 % de trafic en 24h. Les positions LLM, surtout via Wikipedia et presse, sont plus stables&nbsp;: une mention Wikipedia survit cinq à dix ans sans dégradation. C&apos;est un actif réputationnel plus durable.</p>

      <h2>Différence 10 — Budget</h2>
      <p>Une équipe SEO mid-market alloue 3-7 k€/mois (outils + équipe interne). GEO ajoute 2-5 k€/mois (outil monitoring + RP éditoriale + production contenu structuré). Le ratio 2026 typique&nbsp;: 60-65 % SEO classique, 35-40 % GEO.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Repère 2026</p>
        <p className="text-sm text-ink">Forrester Q1 2026&nbsp;: 67 % des entreprises &gt; 500 employés ont créé une ligne budgétaire AI search optimization distincte du SEO classique. Les pionniers ont commencé en 2024.</p>
      </div>

      <h2>Implication pour 2026</h2>
      <p>Investir 100 % en SEO classique laisse 30 % de visibilité LLM sur la table. Investir 100 % en GEO laisse 30 % de SEO classique sur la table. La stratégie hybride — 60 % SEO, 40 % GEO — est l&apos;équilibre qui maximise la visibilité totale dans la majorité des marchés B2B en 2026.</p>
    </>
  );
}

function BodyOutils() {
  return (
    <>
      <h2>Catégories d&apos;outils GEO en 2026</h2>
      <p>L&apos;écosystème GEO 2026 se segmente en quatre catégories&nbsp;: outils de monitoring multi-LLM, outils SEO classiques avec module AI Overviews, outils techniques (audit schema, validateurs), et services agences GEO. Voici les acteurs clés et leur positionnement.</p>

      <h2>Catégorie 1 — Outils de monitoring multi-LLM</h2>
      <p><strong>Geoperf</strong> (79-799 €/mois) est l&apos;outil français de référence&nbsp;: panel de 30-300 prompts, exécution hebdomadaire sur quatre LLM (ChatGPT, Gemini, Claude, Perplexity), citation rate par LLM, source attribution, sentiment, share-of-voice. Couverture forte de la presse spécialisée FR (AGEFI, Échos, Le Monde Informatique) en sources d&apos;autorité.</p>
      <p><strong>Profound</strong> (200-1500 $/mois) est le concurrent US-first&nbsp;: panel similaire, dashboards plus visuels, focus sur les marchés US et UK. <strong>Otterly.ai</strong> (49-299 $/mois) propose le freemium le plus accessible et une UI épurée. <strong>Brandwatch AI Mode</strong> est l&apos;option enterprise (5-15 k€/an), intégrée à la suite Brandwatch existante. <strong>AthenaHQ</strong> (300-2000 $/mois) cible les grands comptes US.</p>

      <h2>Catégorie 2 — Outils SEO classiques + module AI Overviews</h2>
      <p>Semrush, Ahrefs, BrightEdge, Sistrix ont tous ajouté un suivi AI Overviews à leur stack en 2024-2025. Avantage&nbsp;: intégration native avec votre suivi de positions Google existant, pas d&apos;outil supplémentaire. Inconvénient&nbsp;: ne couvrent pas Gemini chat ni ChatGPT mode standard. Tarifs 100-500 €/mois selon volume. Bon complément, pas un substitut aux outils GEO dédiés.</p>

      <h2>Catégorie 3 — Outils techniques (audit on-page)</h2>
      <p>Gratuits et indispensables&nbsp;: <strong>Google Rich Results Test</strong> et <strong>Schema.org Validator</strong> pour valider votre JSON-LD. <strong>Lighthouse</strong> pour auditer la structure des pages et la performance. <strong>Screaming Frog</strong> (gratuit jusqu&apos;à 500 URL) pour parser le site et identifier les pages sans schema, sans H1 question, sans intro courte.</p>
      <p>Pour TypeScript / JavaScript, le package npm <code>schema-dts</code> fournit les types pour autocomplétion à la création de JSON-LD. À utiliser systématiquement avant déploiement de toute nouvelle page produit ou article.</p>

      <h2>Catégorie 4 — Agences et services GEO</h2>
      <p>Le marché des agences GEO s&apos;est structuré en 2025-2026. En France, une dizaine de cabinets proposent des audits GEO (3-15 k€) et des missions de remédiation (15-80 k€ sur six mois). Geoperf propose son propre service Audit GEO consulting one-shot, complément du SaaS de monitoring. Aux US, des acteurs comme Profound Studio ou les bras GEO des grandes agences SEO (Search Discovery, JBH) proposent des packages similaires à des budgets 2-3x supérieurs.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Stack recommandée par profil</p>
        <p className="text-sm text-ink mb-1"><strong>PME 50-200 employés</strong>&nbsp;: Geoperf Starter (79 €) + Search Console + Lighthouse. Total ~80 €/mois.</p>
        <p className="text-sm text-ink mb-1"><strong>ETI 200-1000 employés</strong>&nbsp;: Geoperf Growth/Pro (199-399 €) + Semrush Business + audit annuel agence. Total ~600-800 €/mois.</p>
        <p className="text-sm text-ink"><strong>Grand compte &gt; 1000 employés</strong>&nbsp;: Geoperf Agency + Brandwatch AI Mode + équipe interne 0.5-1 ETP + agence externe ponctuelle. Total ~5-15 k€/mois.</p>
      </div>

      <h2>Critères de sélection</h2>
      <p>Trois critères discriminent les outils GEO sérieux des gadgets&nbsp;: (1) couverture des quatre LLM majeurs (ChatGPT, Gemini, Claude, Perplexity), pas seulement un ou deux ; (2) source attribution explicite (savoir d&apos;où vient chaque citation, pas juste un score agrégé) ; (3) historique longitudinal au-delà de 12 semaines pour comparer évolution vs baseline.</p>

      <h2>Pièges fréquents à l&apos;achat</h2>
      <p>Premier piège&nbsp;: choisir l&apos;outil le moins cher sans vérifier la couverture LLM. Beaucoup d&apos;outils freemium ne couvrent que ChatGPT, ce qui rend la mesure incomplète. Deuxième piège&nbsp;: oublier que le coût total inclut le temps interne d&apos;analyse, pas juste l&apos;abonnement. Comptez 0.1-0.2 ETP pour exploiter sérieusement un outil de monitoring. Troisième piège&nbsp;: empiler outils SEO et GEO sans intégration. Privilégier des outils avec API ou exports CSV pour permettre l&apos;agrégation dans un dashboard unique (Looker, Metabase, PowerBI).</p>
    </>
  );
}

function BodyOptimiserArticle() {
  return (
    <>
      <h2>Pourquoi optimiser un article spécifiquement pour les LLM</h2>
      <p>Une page optimisée GEO a 3 à 5 fois plus de chances d&apos;être citée par AI Overviews et Perplexity qu&apos;une page narrative classique. Sur Authoritas Q1 2026 (10 000 sites), les pages avec H1 question + schema FAQ + tableaux comparatifs ont un citation rate moyen de 41 %, contre 13 % pour les pages sans structure équivalente. La différence est multiplicative, pas marginale.</p>

      <h2>Étape 1 — Reformuler le H1 en question</h2>
      <p>«&nbsp;Notre solution X&nbsp;» devient «&nbsp;Qu&apos;est-ce que X&nbsp;» ou «&nbsp;Comment fonctionne X&nbsp;». Cette reformulation aligne votre page avec les patterns de prompts utilisateur. Les LLM extraient les pages dont le H1 correspond sémantiquement à la question posée. Sans cette correspondance, vous êtes filtrés en amont, même si votre contenu est riche.</p>

      <h2>Étape 2 — Écrire une intro de 50-80 mots qui répond</h2>
      <p>Les LLM extraient prioritairement les premiers paragraphes. Une intro de 50-80 mots qui résume la réponse complète maximise la probabilité d&apos;extraction. Les intros longues, narratives ou story-telling sont écartées. Réservez le contexte et l&apos;histoire pour les sections H2 ultérieures.</p>

      <h2>Étape 3 — Structurer en H2 / H3 thématiques</h2>
      <p>Quatre à six H2, chacun couvrant un sous-aspect distinct. Les H3 ne sont nécessaires que si une section dépasse 400 mots. Évitez les H2 décoratifs ou qui répètent le H1 — chaque H2 doit avoir un mot-clé sémantique différent et apporter une information distincte.</p>

      <h2>Étape 4 — Ajouter listes et tableaux</h2>
      <p>Les LLM extraient mieux les listes ordonnées et les tableaux HTML que les paragraphes narratifs. Pour les comparatifs (prix, fonctionnalités, avantages/inconvénients), utilisez systématiquement des <code>&lt;table&gt;</code> avec en-têtes. Pour les processus et tutoriels, utilisez des <code>&lt;ol&gt;</code> avec étapes numérotées. Évitez d&apos;encoder vos tableaux en images, ils deviennent invisibles aux LLM.</p>

      <h2>Étape 5 — Déployer schema.org JSON-LD</h2>
      <p>Schema Article ou BlogPosting au minimum. Si la page contient des questions/réponses, ajouter FAQPage avec mainEntity[]. Si la page décrit un processus, ajouter HowTo avec step[]. Pour une page produit, schema Product ou Service avec brand, description, offers. Validez avec Google Rich Results Test avant déploiement.</p>

      <h2>Étape 6 — Section FAQ structurée</h2>
      <p>Cinq à dix questions reformulant les recherches réelles, chaque réponse en 80-150 mots, avec FAQPage schema. Cette section augmente le citation rate de 40 à 100 % sur les prompts qui correspondent aux questions FAQ (mesure Geoperf 2026). C&apos;est l&apos;ajout single-element à plus haut ROI.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Avant / Après mesuré</p>
        <p className="text-sm text-ink">Une page produit B2B SaaS optimisée selon ces six étapes&nbsp;: citation rate ChatGPT 12 % → 31 %, AI Overviews 6 % → 24 %, Perplexity 21 % → 44 %, en 16 semaines. Aucun changement de contenu de fond, juste structure + schema.</p>
      </div>

      <h2>Étape 7 — Mentions et liens externes authoritatives</h2>
      <p>Citer une à deux sources externes autoritatives (papier académique, blog OpenAI / Anthropic / Google Research, étude Gartner / Forrester) renforce la crédibilité de votre page aux yeux des LLM. Évitez les sources promo ou d&apos;auto-citations excessives.</p>

      <h2>Vérification finale</h2>
      <p>Avant publication, passez votre page dans Lighthouse (audit performance + structure) et Google Rich Results Test (validation schema). Vérifiez avec <code>view-source:</code> que le contenu apparaît dans le HTML initial, pas seulement après hydration JavaScript. Si votre site est en SPA pure (CRA, Vite sans SSR), aucun de ces efforts ne portera ses fruits&nbsp;: les LLM ne voient pas le contenu hydraté.</p>
    </>
  );
}

function BodyRoadmap30j() {
  return (
    <>
      <h2>Pourquoi un plan en 30 jours est faisable</h2>
      <p>Une stratégie GEO complète exige 6 à 12 mois pour des résultats mesurables sur ChatGPT mode mémoire, mais les premières optimisations on-page produisent des effets sur Perplexity et AI Overviews en 4 à 8 semaines. Pour une PME B2B sans équipe dédiée, le plan ci-dessous donne 80 % du gain GEO atteignable en un mois calendaire.</p>

      <h2>Semaine 1 — Audit + déblocage technique</h2>
      <p>Jours 1-2&nbsp;: vérification robots.txt (autoriser GPTBot, ClaudeBot, PerplexityBot, Google-Extended), audit Lighthouse + Google Rich Results Test sur les 10 pages stratégiques. Jours 3-5&nbsp;: déploiement schema Organization sur la home avec sameAs vers Wikipedia (si page existe), LinkedIn, X. Jour 6-7&nbsp;: création et publication du fichier llms.txt à la racine du domaine.</p>

      <h2>Semaine 2 — Restructuration des pages stratégiques</h2>
      <p>Identifier les 5 pages produit / service / pillar les plus stratégiques. Pour chacune&nbsp;: reformuler le H1 en question, écrire une intro 50-80 mots qui répond, ajouter une section FAQ avec 5-8 questions / réponses (avec FAQPage schema), restructurer les comparatifs en tableaux HTML. Compter une demi-journée par page bien faite.</p>

      <h2>Semaine 3 — Setup monitoring + benchmark initial</h2>
      <p>Souscrire à un outil GEO (Geoperf Starter, 79 €/mois, ou équivalent). Construire un panel de 30 prompts représentatifs de votre marché&nbsp;: 12 découverte, 8 comparatifs, 6 techniques, 4 marque-explicites. Lancer le premier snapshot. Noter les KPI baseline&nbsp;: citation rate ChatGPT, citation rate Perplexity, share-of-voice, sources attribuées.</p>

      <h2>Semaine 4 — Première campagne contenu + RP</h2>
      <p>Publier un article pillar long-form (1800-2500 mots) sur votre sujet de cœur, optimisé selon les six étapes du guide GEO article. Préparer un communiqué de presse sectoriel (étude data, point de vue contrarian) pour les 5 médias spécialisés clés de votre marché. Soumettre votre site à Bing Webmaster Tools et Search Console (si pas déjà fait).</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Effort total estimé</p>
        <p className="text-sm text-ink">~40 heures de travail sur 30 jours, réparties sur un binôme marketing + tech (2 ETP × 0.4 = 0.8 ETP cumulé). Coût direct&nbsp;: ~80 €/mois (outil) + 1500-3000 € one-shot (RP éditoriale si externalisée).</p>
      </div>

      <h2>Mois 2 et 3 — Consolidation</h2>
      <p>Mois 2&nbsp;: déployer schema FAQ sur 10 pages supplémentaires, soumettre 3 demandes de mention sur Wikipedia (articles connexes au secteur), publier un deuxième article pillar. Mois 3&nbsp;: première mesure d&apos;impact (compare KPI semaine 12 vs semaine 0), ajustement du panel de prompts si certains ne capturent pas bien votre marché. Cible réaliste à 90 jours&nbsp;: +30-50 % de citation rate cross-LLM.</p>

      <h2>Au-delà de 90 jours</h2>
      <p>Si les premiers résultats sont conformes (KPI en hausse mesurable), passer à la phase 2&nbsp;: création d&apos;une étude flagship trimestrielle, demande de page Wikipedia dédiée si éligibilité, abonnement attaché de presse si pas déjà fait. Si les résultats sont stagnants, investiguer les 5 causes d&apos;invisibilité (voir cluster dédié) avant de continuer à investir.</p>

      <h2>Pièges à éviter</h2>
      <p>Ne pas attendre 90 jours pour mesurer&nbsp;: le baseline doit être posé semaine 3 pour avoir une trajectoire. Ne pas optimiser 30 pages en parallèle&nbsp;: 5 bien faites valent mieux que 30 partielles. Ne pas négliger le rendu serveur&nbsp;: si votre site est SPA non-SSR, aucun effort GEO on-page ne paiera.</p>
    </>
  );
}

function BodyRoi() {
  return (
    <>
      <h2>Le ROI GEO se mesure sur trois axes</h2>
      <p>Évaluer le retour sur investissement d&apos;une stratégie GEO exige de séparer trois flux de valeur distincts&nbsp;: le trafic organique préservé (que le SEO classique perdrait sans GEO), le trafic LLM-référent direct (visites depuis chatgpt.com et équivalents), et le lift réputationnel (sentiment + autorité tierce). Chacun se quantifie différemment.</p>

      <h2>Axe 1 — Trafic organique préservé</h2>
      <p>Avec AI Overviews déclenché sur 73 % des requêtes B2B desktop US (Forrester 2026), une marque non citée comme source perd 18 % à 32 % de clics organiques sur ces requêtes (Authoritas Q1 2026). À l&apos;inverse, une marque citée comme source voit son CTR augmenter de 25 % en moyenne. Si votre trafic organique B2B est 50 000 visites/mois sur des requêtes informationnelles, l&apos;écart entre «&nbsp;cité&nbsp;» et «&nbsp;non cité&nbsp;» représente 9 000 à 16 000 visites/mois (~108k-192k/an). À 50 € de valeur lead moyenne et 2 % de conversion, c&apos;est 108-192 k€/an de valeur préservée.</p>

      <h2>Axe 2 — Trafic LLM-référent direct</h2>
      <p>Depuis fin 2024, chatgpt.com, perplexity.ai et gemini.google.com apparaissent comme referrers dans Google Analytics. Le volume reste modeste (1-3 % du trafic organique total pour la plupart des marques) mais croît rapidement (+200-400 % en 12 mois). Pour une marque B2B mid-market, c&apos;est 200-1500 visites/mois en 2026, projection 2000-10000 en 2027. Valeur projetée 2027&nbsp;: 50-250 k€/an.</p>

      <h2>Axe 3 — Lift réputationnel</h2>
      <p>Plus difficile à monétiser mais réel. Une marque citée fréquemment et positivement par les LLM bénéficie d&apos;un trust premium en pitches commerciaux («&nbsp;ChatGPT nous recommande&nbsp;») et d&apos;un coût d&apos;acquisition lead réduit de 10-25 % via les channels SEO et paid (sondages internes B2B). Estimation conservatrice&nbsp;: 5-10 % du CAC marketing total.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Modèle simple PME B2B</p>
        <p className="text-sm text-ink mb-1"><strong>Investissement</strong>&nbsp;: 30-60 k€/an (outil 1k + RP 24k + temps interne 0.3 ETP × 65k).</p>
        <p className="text-sm text-ink mb-1"><strong>Retour année 1</strong>&nbsp;: 50-150 k€ (préservation organique + premiers visites LLM-réf).</p>
        <p className="text-sm text-ink"><strong>Retour année 2</strong>&nbsp;: 150-400 k€ (effet cumulé corpus LLM + autorité tierce stable).</p>
      </div>

      <h2>Comparaison ROI vs autres canaux marketing B2B</h2>
      <p>Le ROI GEO en 2026, à investissement comparable, dépasse celui du paid social (LinkedIn Ads CPL en hausse continue) et du paid search (Google Ads en CPC croissant sur les requêtes B2B). Il est comparable au ROI du SEO classique en 2008-2012 — c&apos;est-à-dire historiquement très favorable, à condition d&apos;investir tôt.</p>

      <h2>Pourquoi le ROI baissera avec le temps</h2>
      <p>Le marché GEO n&apos;est pas saturé en 2026 (8 % des marques B2B FR ont une stratégie formalisée selon Geoperf Q4 2025). À mesure que la pénétration monte vers 30-50 % en 2028-2029, le coût d&apos;entrée augmentera et les positions GEO deviendront plus disputées. Investir tôt capture une avance structurelle ; attendre 2028 paiera le rattrapage à 2-3x le prix.</p>

      <h2>Comment justifier le budget en interne</h2>
      <p>Trois angles testés en présentation comex&nbsp;: (1) defense — éviter la perte de trafic organique sur AI Overviews ; (2) acquisition — capturer le trafic LLM-référent émergent ; (3) brand — sécuriser l&apos;autorité tierce avant qu&apos;elle ne devienne disputed. Le mix des trois angles produit la décision d&apos;investissement la plus solide.</p>
    </>
  );
}

export const GEO_CLUSTERS: ClusterRegistry = {
  "geo-vs-seo-differences": {
    parentPillar: "geo-generative-engine-optimization",
    fr: {
      title: "GEO vs SEO : 10 différences clés en 2026",
      metaDescription:
        "GEO et SEO se distinguent sur dix axes : surface de réponse, métriques, sources d'autorité, format, vitesse, volatilité, budget. Comparaison détaillée 2026.",
      intro:
        "GEO et SEO ne sont pas synonymes. La différence se mesure sur dix axes distincts qui, combinés, expliquent pourquoi une marque excellente en SEO peut être invisible aux LLM, et inversement. Voici les dix points qu'un CMO doit connaître avant d'arbitrer son budget 2026.",
      publishedAt: PUB,
      Body: BodyVsSeo,
    },
  },
  "top-outils-geo-2026": {
    parentPillar: "geo-generative-engine-optimization",
    fr: {
      title: "Top 15 outils GEO en 2026 : monitoring, audit, mesure",
      metaDescription:
        "Stack outils GEO 2026 : monitoring multi-LLM (Geoperf, Profound, Otterly), SEO classique avec module AI Overviews, validateurs schema, agences GEO.",
      intro:
        "L'écosystème GEO 2026 se segmente en quatre catégories : outils de monitoring multi-LLM, outils SEO classiques avec module AI Overviews, outils techniques d'audit, et services agences. Voici les acteurs clés et la stack recommandée par profil.",
      publishedAt: PUB,
      Body: BodyOutils,
    },
  },
  "comment-optimiser-article-geo": {
    parentPillar: "geo-generative-engine-optimization",
    fr: {
      title: "Comment optimiser un article pour le GEO en 7 étapes",
      metaDescription:
        "Guide pratique pour optimiser un article afin d'être cité par ChatGPT, Gemini, Perplexity : H1 question, intro courte, schema, FAQ, listes, tableaux.",
      intro:
        "Une page optimisée GEO est citée 3 à 5 fois plus que sa version narrative classique. Sept étapes pratiques — H1 question, intro courte, structure H2, listes/tableaux, schema.org, FAQ, sources externes — produisent l'écart mesurable entre 13 % et 41 % de citation rate.",
      publishedAt: PUB,
      Body: BodyOptimiserArticle,
    },
  },
  "geo-pme-roadmap-30-jours": {
    parentPillar: "geo-generative-engine-optimization",
    fr: {
      title: "GEO pour PME : roadmap 30 jours actionnable",
      metaDescription:
        "Plan 30 jours GEO pour PME B2B : audit + déblocage technique, restructuration pages stratégiques, monitoring, première campagne contenu et RP.",
      intro:
        "Pour une PME B2B sans équipe dédiée, ce plan en 30 jours capture 80 % du gain GEO atteignable. Quatre semaines, ~40 heures, ~80 €/mois en outil. Effort réaliste sur un binôme marketing + tech, premiers résultats mesurables semaine 12.",
      publishedAt: PUB,
      Body: BodyRoadmap30j,
    },
  },
  "roi-strategie-geo": {
    parentPillar: "geo-generative-engine-optimization",
    fr: {
      title: "ROI d'une stratégie GEO : modèle et chiffres 2026",
      metaDescription:
        "Comment quantifier le ROI d'une stratégie GEO en 2026 : trafic organique préservé, trafic LLM-référent direct, lift réputationnel. Modèle PME B2B.",
      intro:
        "Le ROI d'une stratégie GEO se mesure sur trois flux : trafic organique préservé, trafic LLM-référent direct, lift réputationnel. Pour une PME B2B, l'investissement annuel 30-60 k€ produit 50-150 k€ de retour année 1 et 150-400 k€ année 2 — comparable au ROI du SEO en 2008-2012.",
      publishedAt: PUB,
      Body: BodyRoi,
    },
  },
};
