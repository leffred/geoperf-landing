// S29 Session 5 — Articles blog batch 2 (10 articles) : tactique part 2 + platforms + objection + showcase.

import type { BlogRegistry } from "./types";

const D0 = "2026-05-09T08:00:00.000Z";
const D7 = "2026-05-02T08:00:00.000Z";
const D14 = "2026-04-25T08:00:00.000Z";
const D21 = "2026-04-18T08:00:00.000Z";

// ============== TACTIQUE PART 2 (3) ==============

function BodyRoiBudget() {
  return (
    <>
      <h2>Le ROI GEO se mesure sur trois axes</h2>
      <p>Évaluer le retour sur investissement d&apos;une stratégie GEO exige de séparer trois flux de valeur distincts&nbsp;: le trafic organique préservé (que le SEO classique perdrait sans GEO), le trafic LLM-référent direct (visites depuis chatgpt.com et équivalents), et le lift réputationnel (sentiment + autorité tierce). Chacun se quantifie différemment.</p>

      <h2>Axe 1 — Trafic organique préservé</h2>
      <p>Avec AI Overview déclenché sur 73 % des requêtes B2B desktop US (Forrester 2026), une marque non citée comme source perd 18-32 % de clics organiques sur ces requêtes. À l&apos;inverse, une marque citée voit son CTR augmenter de 25 % en moyenne. Si votre trafic organique B2B est 50 000 visites/mois sur des requêtes informationnelles, l&apos;écart entre &laquo;&nbsp;cité&nbsp;&raquo; et &laquo;&nbsp;non cité&nbsp;&raquo; représente 9 000 à 16 000 visites/mois. À 50 € de valeur lead moyenne et 2 % de conversion, c&apos;est 108-192 k€/an de valeur préservée.</p>

      <h2>Axe 2 — Trafic LLM-référent direct</h2>
      <p>Depuis fin 2024, chatgpt.com, perplexity.ai et gemini.google.com apparaissent comme referrers dans Google Analytics. Le volume reste modeste (1-3 % du trafic total) mais croît rapidement (+200-400 % en 12 mois). Pour une PME B2B mid-market, c&apos;est 200-1500 visites/mois en 2026, projection 2000-10000 en 2027. Valeur projetée 2027&nbsp;: 50-250 k€/an.</p>

      <h2>Axe 3 — Lift réputationnel</h2>
      <p>Plus difficile à monétiser mais réel. Une marque citée fréquemment et positivement par les LLM bénéficie d&apos;un trust premium en pitches commerciaux et d&apos;un coût d&apos;acquisition lead réduit de 10-25 % via les channels SEO et paid. Estimation conservatrice&nbsp;: 5-10 % du CAC marketing total.</p>

      <h2>Modèle simple PME B2B mid-market</h2>
      <p><strong>Investissement annuel</strong>&nbsp;: 30-60 k€ (outil 1k + RP éditoriale 24k + temps interne 0.3 ETP × 65k). <strong>Retour année 1</strong>&nbsp;: 50-150 k€ (préservation organique + premiers visites LLM-réf). <strong>Retour année 2</strong>&nbsp;: 150-400 k€ (effet cumulé corpus LLM + autorité tierce stable).</p>

      <h2>Modèle ETI 200-2000 employés</h2>
      <p><strong>Investissement annuel</strong>&nbsp;: 100-250 k€ (outil 5k + RP 60k + 0.5-1 ETP × 80k + études flagship 30k). <strong>Retour année 1</strong>&nbsp;: 200-500 k€. <strong>Retour année 2</strong>&nbsp;: 500 k€ - 1.2 M€ (effet cumulé). ROI ratio typique 3-5x.</p>

      <h2>Modèle grand compte 2000+ employés</h2>
      <p><strong>Investissement annuel</strong>&nbsp;: 500 k€ - 1.5 M€ (outils enterprise + agence RP top-tier + équipe 2-3 ETP + études flagship + Wikipedia agency). <strong>Retour année 1</strong>&nbsp;: 800 k€ - 3 M€. <strong>Retour année 2</strong>&nbsp;: 2-6 M€. ROI ratio 3-5x.</p>

      <h2>Comparaison ROI vs autres canaux marketing B2B</h2>
      <p>Le ROI GEO en 2026, à investissement comparable, dépasse celui du paid social (LinkedIn Ads CPL en hausse continue) et du paid search (Google Ads en CPC croissant sur les requêtes B2B). Il est comparable au ROI du SEO classique en 2008-2012 — c&apos;est-à-dire historiquement très favorable, à condition d&apos;investir tôt.</p>

      <h2>Pourquoi le ROI baissera avec le temps</h2>
      <p>Le marché GEO n&apos;est pas saturé en 2026 (8 % des marques B2B FR ont une stratégie formalisée). À mesure que la pénétration monte vers 30-50 % en 2028-2029, le coût d&apos;entrée augmentera et les positions GEO deviendront plus disputées. Investir tôt capture une avance structurelle ; attendre 2028 paiera le rattrapage à 2-3x le prix.</p>

      <h2>Comment justifier le budget en interne</h2>
      <p>Trois angles testés en présentation comex&nbsp;: (1) defense — éviter la perte de trafic organique sur AI Overview, (2) acquisition — capturer le trafic LLM-référent émergent, (3) brand — sécuriser l&apos;autorité tierce avant qu&apos;elle ne devienne disputée. Le mix des trois angles produit la décision d&apos;investissement la plus solide.</p>

      <h2>Pour démarrer</h2>
      <p>Le plus difficile, c&apos;est le baseline. Pour évaluer votre citation rate cross-LLM actuel et chiffrer votre ROI potentiel&nbsp;: <a href="/etude-sectorielle" className="underline text-brand-500">demandez votre étude sectorielle gratuite Geoperf</a>.</p>
    </>
  );
}

function BodyHybrideSeoGeo() {
  return (
    <>
      <h2>Faire SEO + GEO ensemble&nbsp;: la stratégie hybride qui marche</h2>
      <p>SEO classique et GEO partagent 70 % de leurs fondamentaux mais divergent sur 30 % décisifs. La bonne nouvelle&nbsp;: investir une fois sur les 70 % communs paie sur les deux disciplines. Voici comment structurer une stratégie hybride sur 12 mois.</p>

      <h2>Les 70 % communs</h2>
      <p>Qualité de contenu, autorité de domaine, structure technique, performance Core Web Vitals, mobile-first, schema.org, contenu unique et factuel&nbsp;: ces fondamentaux sont identiques entre SEO et GEO. Une page bien optimisée SEO 2026 a 70 % du chemin fait pour GEO.</p>

      <h2>Les 30 % spécifiques GEO</h2>
      <p><strong>(1) Schema.org plus exigeant</strong>&nbsp;: FAQPage, HowTo, Organization avec sameAs sont quasi-obligatoires en GEO (vs nice-to-have en SEO). <strong>(2) Structure question/réponse</strong>&nbsp;: H1 question, intro 50-80 mots qui répond. <strong>(3) llms.txt</strong> à la racine du domaine. <strong>(4) Robots.txt avec autorisation explicite GPTBot/ClaudeBot/PerplexityBot/Google-Extended</strong>. <strong>(5) Autorité tierce massive</strong> (Wikipedia + presse spécialisée) plus déterminante en GEO qu&apos;en SEO.</p>

      <h2>Mois 1-3 — Audit unifié SEO + GEO</h2>
      <p>Audit conjoint sur les 30 pages stratégiques&nbsp;: positions Google (Search Console), citation rate cross-LLM (Geoperf), structure de page, schema.org, performance. Identifier les 10 pages avec le plus grand écart entre SEO performance et GEO performance — ce sont les opportunités prioritaires.</p>

      <h2>Mois 4-6 — Optimisation on-page hybride</h2>
      <p>Sur les 10 pages prioritaires&nbsp;: refonte H1 sous forme de question (gain SEO + GEO), intro 50-80 mots qui répond, ajout sections FAQ avec FAQPage schema, restructuration tableaux comparatifs en HTML (pas images), déploiement schema Article + Organization complet. Cet effort produit gains mesurables sur les deux disciplines simultanément.</p>

      <h2>Mois 7-9 — Off-page combiné</h2>
      <p>Une stratégie RP éditoriale earned (1.5-3 k€/mois) produit des backlinks SEO ET des mentions presse comptées comme sources GEO. Une étude flagship trimestrielle génère 30-100 reprises presse SEO + entrée progressive aux corpus LLM. Investir une fois off-page, gagner sur les deux canaux.</p>

      <h2>Mois 10-12 — Mesure et ajustement</h2>
      <p>Tableau de bord unifié&nbsp;: positions Google (Search Console), citation rate cross-LLM (Geoperf), source attribution, lift sur trafic organique. Identifier les déséquilibres&nbsp;: si SEO progresse mais GEO stagne, le levier manquant est probablement Wikipedia ou structure de page. Si GEO progresse mais SEO stagne, le levier est probablement performance ou backlinks.</p>

      <h2>Tableau de bord hybride 5 KPI</h2>
      <p>5 KPI à tracker hebdomadairement&nbsp;: (1) trafic organique total Google, (2) trafic LLM-référent (analytics referrer), (3) citation rate cross-LLM moyen, (4) AI Overview citation rate sur top 30 prompts, (5) sentiment LLM moyen.</p>

      <h2>Erreurs fréquentes hybride</h2>
      <p>Premier piège&nbsp;: créer deux équipes silotées (SEO et GEO). Mauvais choix — duplications de travail, conflits de priorités. Préférer une équipe unifiée &laquo;&nbsp;Search&nbsp;&raquo; avec compétences SEO + GEO. Deuxième piège&nbsp;: ignorer la composante off-page (RP, Wikipedia) car &laquo;&nbsp;ça relève de la comm&nbsp;&raquo;. La RP earned est le levier #2 GEO. Troisième piège&nbsp;: mesurer SEO et GEO sur des dashboards séparés, perdant la vision unifiée.</p>

      <h2>Budget total typique</h2>
      <p>PME B2B mid-market 50-200 employés&nbsp;: budget search annuel ~50-100 k€ (outil + RP + content + 0.3-0.5 ETP). Répartition&nbsp;: 60-65 % SEO + 35-40 % GEO. ETI 200-2000 employés&nbsp;: 150-400 k€/an, ratio 55/45.</p>

      <h2>Cible 12 mois</h2>
      <p>Pour une PME B2B partant d&apos;un baseline modeste (top 10 Google sur 30 % des mots-clés cibles, citation rate cross-LLM 12 %)&nbsp;: cibler top 10 Google sur 60 % des mots-clés ET citation rate cross-LLM 35 % à 12 mois. Ambitieux mais atteignable avec stratégie hybride bien exécutée.</p>
    </>
  );
}

function BodyCitationRateKpi() {
  return (
    <>
      <h2>Le citation rate&nbsp;: nouveau KPI socle 2026</h2>
      <p>Position moyenne, CTR, impressions Search Console&nbsp;: ces trois indicateurs ne capturent que ce qui se passe sur les SERP de Google. Ils ne mesurent rien sur la perception de votre marque par les LLM. Le KPI socle a changé en 2026&nbsp;: c&apos;est désormais le citation rate cross-LLM.</p>

      <h2>Définition&nbsp;: citation rate cross-LLM</h2>
      <p>Sur un panel fixe de 30-100 prompts représentatifs de votre marché, mesurez chaque semaine le pourcentage de réponses qui mentionnent explicitement votre marque, par LLM (ChatGPT, Gemini, Claude, Perplexity). Citation rate cross-LLM = moyenne sur les 4 LLM.</p>
      <p>Exemple&nbsp;: panel 30 prompts × 4 LLM = 120 réponses par snapshot. Si votre marque apparaît dans 36 réponses, votre citation rate = 30 %. Sur 12 snapshots hebdomadaires, vous avez une série temporelle propre.</p>

      <h2>Pourquoi 30 prompts minimum</h2>
      <p>Sous 30 prompts, la variance stochastique des LLM (température, échantillonnage) domine le signal. À 30 prompts, le citation rate est mesurable avec ±3-5 % de marge d&apos;erreur. À 100 prompts, ±1-2 %. Pour benchmarker contre des concurrents avec confiance, viser 50-100 prompts.</p>

      <h2>Construction d&apos;un panel</h2>
      <p>Mix recommandé&nbsp;: 40 % prompts de découverte (&laquo;&nbsp;meilleur acteur X&nbsp;&raquo;), 25 % comparatifs (&laquo;&nbsp;A vs B&nbsp;&raquo;), 20 % techniques (&laquo;&nbsp;comment fonctionne Y&nbsp;&raquo;), 15 % marque-explicites (&laquo;&nbsp;qui est X&nbsp;&raquo;). Utiliser le langage réel des prospects (Search Console, Reddit, conversations support).</p>

      <h2>Cadence de mesure</h2>
      <p>Hebdomadaire pour Perplexity et Gemini AI Overview (index web temps réel). Mensuelle pour ChatGPT mode standard et Claude (corpus mémoire mis à jour tous les 6-12 mois). Pour une PME, monitoring hebdomadaire global suffit.</p>

      <h2>Benchmarks 2026 par profil</h2>
      <p><strong>Marque B2B FR mid-market médiane</strong>&nbsp;: citation rate 22 %. <strong>Top quintile</strong>&nbsp;: 55 %. <strong>Bottom quintile</strong>&nbsp;: 6 %. <strong>Leaders sectoriels</strong>&nbsp;: 65-85 % (Sanofi 82 %, Airbus 88 %, Amundi 78 %).</p>
      <p>Si votre citation rate est en dessous du médian, vous avez un déficit structurel à corriger. Si vous êtes au top quintile, l&apos;enjeu est la maintenance et la défense.</p>

      <h2>KPI complémentaires</h2>
      <p><strong>Average source rank</strong>&nbsp;: position de votre URL parmi les sources citées (Perplexity, AI Overview affichent ce signal). Cible &lt;3.</p>
      <p><strong>Share-of-voice</strong>&nbsp;: votre poids vs concurrents top 3. Cible &gt;20 %.</p>
      <p><strong>Sentiment</strong>&nbsp;: positif/neutre/négatif des contextes de citation. Cible négatif &lt;15 %.</p>
      <p><strong>Source attribution</strong>&nbsp;: distribution des sources qui vous citent (Wikipedia, presse, corporate, etc.). Distribution balanced (40 % Wikipedia + presse, 30 % corporate, 30 % autres) = signature robuste.</p>

      <h2>Outils pour mesurer</h2>
      <p>Geoperf (79-799 €/mois) couvre nativement les 4 LLM majeurs avec dashboard et alertes. Profound, Otterly, Brandwatch AI Mode comme alternatives. Pour DIY, scripts Python avec API OpenAI/Anthropic/Google : 50-200 €/mois en API + 5-15 jours engineering initial.</p>

      <h2>Reporting comex</h2>
      <p>Présentation comex mensuelle d&apos;une page&nbsp;: citation rate moyen + delta vs 30 jours, share-of-voice vs top 3 concurrents, sentiment moyen, alerts ouvertes. Présentation trimestrielle plus profonde&nbsp;: source attribution, déconstruction par LLM, plan d&apos;action 90 jours.</p>

      <h2>Pour mesurer votre citation rate</h2>
      <p>Pour avoir un baseline cross-LLM sur votre marché en 7 jours&nbsp;: <a href="/etude-sectorielle" className="underline text-brand-500">demandez votre étude sectorielle gratuite Geoperf</a>. Vous recevrez le panel de 30 prompts personnalisé + le snapshot baseline + le positionnement vs leaders sectoriels.</p>
    </>
  );
}

// ============== PLATFORMS (3) ==============

function BodyAiOverviewUpdate() {
  return (
    <>
      <h2>Google AI Overview&nbsp;: l&apos;update 2026 en chiffres</h2>
      <p>Lancé fin 2024, déployé sur tous les marchés majeurs en 2025, AI Overview a connu en 2026 trois évolutions majeures&nbsp;: extension de la couverture, amélioration de la qualité des sources, et raffinement des règles de citation. Voici l&apos;état des lieux à mai 2026.</p>

      <h2>Évolution 1 — Couverture étendue</h2>
      <p>Avril 2026&nbsp;: AI Overview se déclenche sur 38 % des requêtes desktop globales (vs 28 % en oct 2025). Pour le B2B US, le chiffre atteint 73 %. Pour le B2B France, 58 %. Pour les requêtes santé YMYL, Google reste prudent (35 % seulement).</p>
      <p>Implication&nbsp;: la majorité des requêtes B2B FR informationnelles déclenchent désormais AI Overview. Une marque non citée dans ces overviews perd structurellement du trafic.</p>

      <h2>Évolution 2 — Qualité des sources améliorée</h2>
      <p>L&apos;update Q1 2026 a réduit le poids des contenus auto-générés et des fermes à backlinks. Les sources Wikipedia, presse établie, et sites .edu/.gov ont vu leur poids relatif augmenter de 12-18 % selon Authoritas.</p>
      <p>Pour les marques&nbsp;: l&apos;investissement en RP éditoriale earned a un ROI plus élevé qu&apos;en 2024. Le contenu sponsorisé et le link building bas de gamme produisent désormais 0 % d&apos;impact AI Overview.</p>

      <h2>Évolution 3 — Citation rules raffinées</h2>
      <p>Q2 2026&nbsp;: Google a publié de nouvelles guidelines internes sur la citation des sources dans AI Overview. Trois changements&nbsp;: (1) les pages avec schema FAQPage sont désormais 3.1x plus citées (vs 2.4x avant), (2) la position 1 des sources capture 60 % des clics utilisateurs (vs 52 % avant), (3) les dates dateModified sont prises en compte plus strictement (pages obsolètes dévalorisées).</p>

      <h2>Conséquences pour votre stratégie</h2>
      <p><strong>1. Schema FAQPage devient quasi-obligatoire</strong> sur les pages produit/service stratégiques. Effort de déploiement&nbsp;: 5-10 jours développeur sur 30 pages. ROI&nbsp;: +40-100 % de citation rate sur les prompts FAQ-matching.</p>
      <p><strong>2. La fraîcheur compte plus</strong>. Mettre à jour les pages stratégiques 2-4 fois par an avec dateModified renseigné. Effort marginal, gain mesurable.</p>
      <p><strong>3. Cibler la position 1 des sources</strong> devient le KPI central. Les pages avec H1 question + intro 50-80 mots qui répond directement ont le meilleur taux de position 1.</p>

      <h2>Distribution sources AI Overview FR (Q1 2026)</h2>
      <p>Sur 5 000 réponses AI Overview B2B FR analysées par Geoperf&nbsp;: Wikipedia FR (35 %), site corporate de la marque (22 %), Le Monde / Échos / Tribune (19 %), AGEFI / Funds Magazine pour finance (12 %), Investopedia FR ou autres encyclopédies (8 %), reste 4 %.</p>
      <p>Cette distribution diffère de Perplexity (qui cite plus la presse, moins Wikipedia) — Gemini privilégie l&apos;entité Wikipedia et le site officiel de la marque pour les requêtes branded ou semi-branded.</p>

      <h2>Anomalies à surveiller</h2>
      <p>Q2 2026 a vu plusieurs anomalies&nbsp;: certains AI Overviews citent des sources hallucinées (URLs inexistantes), d&apos;autres affichent des CTR proches de zéro (problème UX). Google itère rapidement, certains tests A/B affectent le citation rate sur 24-72h.</p>
      <p>Recommandation&nbsp;: monitoring quotidien sur 10-15 prompts les plus stratégiques en complément du panel hebdomadaire de 30 prompts.</p>

      <h2>Pour mesurer votre exposition AI Overview</h2>
      <p>Outils&nbsp;: Semrush AI Overviews Tracking, Authoritas, Geoperf module dédié. <a href="/etude-sectorielle" className="underline text-brand-500">Demandez votre étude sectorielle Geoperf</a> pour avoir un panorama de votre citation rate AI Overview FR sur votre secteur en 7 jours.</p>
    </>
  );
}

function BodyPerplexityPagesOpp() {
  return (
    <>
      <h2>Perplexity Pages&nbsp;: opportunité produit 2026</h2>
      <p>Lancé fin 2024, Perplexity Pages est devenu en 2026 un produit phare avec ~12 M d&apos;utilisateurs actifs. Pour les marques B2B FR, c&apos;est une opportunité de publication thought-leadership sous-exploitée. Voici comment l&apos;activer.</p>

      <h2>Qu&apos;est-ce que Perplexity Pages</h2>
      <p>Pages permet à un utilisateur Perplexity Pro de transformer une recherche Perplexity en article publié, indexé par Google, partageable, avec sources clairement attribuées. Format proche d&apos;un article Wikipedia mais centré sur un sujet précis.</p>
      <p>Pour une marque, deux usages&nbsp;: (1) créer ses propres Pages thought-leadership avec un domaine de référence (perplexity.ai, DR &gt; 80 selon Ahrefs), (2) suivre les Pages tierces qui citent la marque.</p>

      <h2>Opportunité 1 — Thought leadership accéléré</h2>
      <p>Une Page Perplexity sur un sujet technique peut ranker sur Google en quelques semaines (vs 6-12 mois pour un article blog corporate équivalent), grâce à l&apos;autorité de domaine perplexity.ai. Investissement&nbsp;: 4-8 heures de production par Page.</p>

      <h2>Opportunité 2 — Multiplication des touchpoints</h2>
      <p>Une Page Perplexity qui cite votre marque est&nbsp;: (1) visible sur Perplexity Discover si tendance, (2) indexée par Google, (3) partageable LinkedIn et X. Trois canaux pour le prix d&apos;un.</p>

      <h2>Opportunité 3 — Suivi des Pages tierces</h2>
      <p>Surveillez les Pages publiées par d&apos;autres qui citent votre marque. Ces Pages constituent des backlinks de qualité et des signaux d&apos;autorité tierce. Identifier les auteurs favorables permet d&apos;engager des relations qui produisent d&apos;autres citations futures.</p>

      <h2>Stratégie de production</h2>
      <p>Trois angles qui marchent en 2026&nbsp;: <strong>(1) Étude data sectorielle</strong> — Page basée sur votre étude flagship trimestrielle, citant les acteurs de référence du secteur. <strong>(2) Comparatif neutre</strong> — Page comparant les acteurs de votre catégorie (incluant vous-même), avec critères objectifs. <strong>(3) Guide tutoriel</strong> — Page step-by-step sur un sujet technique de votre expertise.</p>

      <h2>Ce qui rank vs ce qui flop</h2>
      <p><strong>Ce qui rank</strong>&nbsp;: Pages avec 8-15 sources citées, structure H2 claire, données chiffrées, point de vue argumenté. 4-8h de production minimum.</p>
      <p><strong>Ce qui flop</strong>&nbsp;: Pages produites en 5 minutes sans relecture, Pages purement promotionnelles (ton commercial), Pages citant uniquement vos propres sources.</p>

      <h2>Cadence recommandée pour B2B mid-market</h2>
      <p>1 Page par mois sur sujet sectoriel + 1 Page trimestrielle basée sur étude flagship. Total ~16 Pages/an. À 4-8h par Page, c&apos;est 0.05-0.1 ETP — coût marginal pour un canal d&apos;autorité distinct du blog corporate.</p>

      <h2>ROI mesurable</h2>
      <p>ROI typique sur une Page Perplexity bien construite&nbsp;: 500-3000 visites Google sur 12 mois + ~2-5 backlinks Perplexity Pages tiers + amplification LinkedIn (1k-10k impressions au partage). Comparable au ROI d&apos;un article blog corporate à 1/3 de l&apos;effort.</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: produire des Pages purement promotionnelles. Perplexity dévalorise. Privilégier le ton éditorial neutre. Deuxième piège&nbsp;: citer uniquement vos propres sources. Une bonne Page cite 5-10 sources tierces variées. Troisième piège&nbsp;: ignorer les Pages tierces qui citent votre marque. Surveiller hebdomadairement via votre outil de monitoring LLM.</p>

      <h2>Pour démarrer</h2>
      <p>Souscrire à Perplexity Pro (20 $/mois) pour 1 utilisateur de votre équipe marketing/comm. Commencer par 1 Page-test sur un sujet sectoriel maîtrisé. Mesurer les résultats à M+3, ajuster. Si ROI satisfaisant, scaler à 1 Page/mois.</p>
    </>
  );
}

function BodyChatGPTBrowse() {
  return (
    <>
      <h2>ChatGPT Browse&nbsp;: comment être indexé en 2026</h2>
      <p>ChatGPT Search (mode browse) est désormais activé par défaut dans GPT-4o et au-delà depuis Q1 2026. Quand l&apos;utilisateur pose une question time-sensitive ou ouvre une conversation incertaine, ChatGPT consulte le web en temps réel via Bing et son propre crawl. Pour les marques&nbsp;: comment être trouvé et cité dans ce mode.</p>

      <h2>Différence Search vs Memory mode</h2>
      <p>ChatGPT mode standard&nbsp;: répond depuis sa mémoire entraînée (corpus figé tous les 6-12 mois). ChatGPT Search&nbsp;: consulte le web en temps réel, cite les sources, cite les URLs cliquables.</p>
      <p>Implication marque&nbsp;: Search bénéficie aux marques avec contenu frais et bien crawlé. Memory bénéficie aux marques avec autorité historique cumulée.</p>

      <h2>Levier 1 — Crawlabilité GPTBot</h2>
      <p>Vérifier que GPTBot n&apos;est pas bloqué dans robots.txt. Tester sur <a href="https://openai.com/gptbot" target="_blank" rel="noopener noreferrer" className="underline text-brand-500">openai.com/gptbot</a>. C&apos;est l&apos;optimisation #1, à zéro coût.</p>

      <h2>Levier 2 — Index Bing</h2>
      <p>ChatGPT Search utilise Bing comme index principal. Soumettre votre site à Bing Webmaster Tools, vérifier que vos pages stratégiques sont indexées dans Bing (différent de Google). Les sites avec faible présence Bing sont sous-cités sur ChatGPT Search.</p>

      <h2>Levier 3 — Structure de page question/réponse</h2>
      <p>ChatGPT Search privilégie les pages avec H1 question, intro 50-80 mots qui répond directement, structure listée, schema.org riche. Mêmes critères que Perplexity et AI Overview.</p>

      <h2>Levier 4 — Fraîcheur du contenu</h2>
      <p>ChatGPT Search pondère la fraîcheur (plus que ChatGPT mode standard). Une page mise à jour récemment (dateModified &lt; 6 mois) est préférée à une page identique mais datée. Maintenance régulière des pages stratégiques.</p>

      <h2>Levier 5 — Schema.org Article + Organization</h2>
      <p>Schema Article avec datePublished + dateModified renseigné. Schema Organization avec sameAs vers Wikipedia / LinkedIn. Permet à ChatGPT Search de désambiguïser votre marque face à des concurrents avec noms similaires.</p>

      <h2>Mesurer l&apos;impact</h2>
      <p>Outils GEO (Geoperf, Profound, Otterly) couvrent ChatGPT Search natif. Le citation rate ChatGPT Search est généralement plus élevé que ChatGPT mode standard pour les marques avec contenu frais et bien crawlé (effet immédiat des optimisations on-page).</p>

      <h2>Pour démarrer</h2>
      <p>Auditer robots.txt + Bing Webmaster Tools en moins d&apos;une heure. Tester ChatGPT Search sur 5-10 prompts représentatifs de votre marché. Mesurer si votre marque apparaît et avec quelles sources.</p>
      <p>Pour un audit complet&nbsp;: <a href="/etude-sectorielle" className="underline text-brand-500">demandez votre étude sectorielle Geoperf</a> qui inclut le panel ChatGPT Search en plus du mode standard.</p>
    </>
  );
}

// ============== OBJECTION (1) ==============

function BodySeoMortGeo() {
  return (
    <>
      <h2>L&apos;objection&nbsp;: «&nbsp;Le SEO est mort, vive le GEO !&nbsp;»</h2>
      <p>Cette phrase fait flore en 2026 dans les conférences marketing et les LinkedIn posts. Elle est fausse et dangereuse. SEO et GEO ne sont pas en concurrence — ils sont complémentaires. Voici pourquoi cette objection est mal posée et comment y répondre en interne.</p>

      <h2>Pourquoi c&apos;est faux&nbsp;: 5 raisons</h2>
      <p><strong>1. Volume Google reste écrasant.</strong> 8.5 milliards de requêtes/jour sur Google vs ~500M-1B/jour sur tous les LLM cumulés. Sur la majorité des requêtes (navigationnelles, transactionnelles, locales), Google domine sans alternative crédible.</p>
      <p><strong>2. AI Overview tire ses sources des SERP.</strong> AI Overview affiche 3-5 liens-source qui viennent quasi systématiquement des top 10 résultats SERP Google. Sans top-10 Google, vous n&apos;êtes pas dans le pool de candidates pour AI Overview. Le SEO classique est donc un prérequis pour le GEO.</p>
      <p><strong>3. 70 % des fondamentaux sont communs.</strong> Qualité de contenu, autorité de domaine, structure technique, performance, mobile-first, schema.org. Une page bien optimisée SEO 2026 a 70 % du chemin fait pour GEO.</p>
      <p><strong>4. Mesurabilité supérieure.</strong> SEO offre Search Console, Analytics, GA4 avec attribution complète. GEO n&apos;a pas d&apos;équivalent natif. Le SEO classique reste le canal le plus pilotable.</p>
      <p><strong>5. Diversification de risque.</strong> Mettre 100 % du budget search sur LLM expose à des risques (pénalisation algorithmique, changement business model, volatilité). Le SEO classique sur Google offre une stabilité que les LLM n&apos;ont pas encore.</p>

      <h2>Pourquoi c&apos;est dangereux pour les CMO B2B</h2>
      <p>Un CMO qui pivote 100 % vers le GEO en 2026 produira&nbsp;: <strong>(1)</strong> régression mesurable du trafic organique en 2027 (les optimisations SEO classiques ne sont plus maintenues), <strong>(2)</strong> dégradation du citation rate AI Overview (qui dépend du top 10 Google), <strong>(3)</strong> perte de l&apos;outil de pilotage le plus mature (Search Console).</p>

      <h2>La bonne objection&nbsp;: «&nbsp;Le SEO change, il faut le faire évoluer&nbsp;»</h2>
      <p>Le SEO 2026 incorpore des spécificités GEO qui n&apos;existaient pas en 2022&nbsp;: schema.org plus exigeant, structure question/réponse, llms.txt, autorisation explicite des bots IA. Une équipe SEO qui n&apos;a pas intégré ces évolutions performe moins en 2026 qu&apos;en 2023.</p>
      <p>La bonne formulation n&apos;est pas &laquo;&nbsp;le SEO est mort&nbsp;&raquo; mais &laquo;&nbsp;le SEO 2010-2020 est dépassé, il faut faire le SEO 2026 + le GEO 2026&nbsp;&raquo;.</p>

      <h2>Comment répondre à cette objection en comex</h2>
      <p>Trois arguments&nbsp;: <strong>(1)</strong> 90 % de notre trafic organique vient toujours de Google ; pivoter le détruirait. <strong>(2)</strong> Les LLM citent ce qui rank Google ; pas de top 10 = pas d&apos;AI Overview. <strong>(3)</strong> Le mix gagnant 2026 est 60-65 % SEO + 35-40 % GEO. C&apos;est ce que font les leaders sectoriels.</p>

      <h2>L&apos;équipe idéale 2026</h2>
      <p>Pour une PME B2B mid-market&nbsp;: un consultant SEO senior (interne ou externe) qui pilote SEO + GEO en discipline unifiée, plutôt que deux silos séparés. Le profil &laquo;&nbsp;technical SEO + GEO awareness&nbsp;&raquo; est rare en 2026 mais en formation rapide.</p>

      <h2>Conclusion</h2>
      <p>Le SEO traditionnel reste l&apos;épine dorsale de l&apos;acquisition organique pour 70 % des marques B2B en 2026. Le GEO est une couche additionnelle indispensable mais qui ne remplace pas le SEO. Toute stratégie qui sacrifie le SEO pour pivoter 100 % GEO produira une régression mesurable de trafic en 2027.</p>
      <p>Pour évaluer comment équilibrer SEO + GEO sur votre marché&nbsp;: <a href="/etude-sectorielle" className="underline text-brand-500">demandez votre étude sectorielle Geoperf</a>.</p>
    </>
  );
}

// ============== SHOWCASE (3) ==============

function BodyCasGeoperf() {
  return (
    <>
      <h2>Geoperf surveille 1 500 marques chaque trimestre</h2>
      <p>Geoperf instrumente la visibilité de 1 500 marques B2B FR sur les 4 LLM majeurs (ChatGPT, Gemini, Claude, Perplexity) à cadence trimestrielle. Voici comment notre équipe de 4 personnes opère cette factory de surveillance, les défis techniques rencontrés, et les apprentissages tirés sur 24 mois.</p>

      <h2>Stack technique</h2>
      <p>Architecture&nbsp;: orchestrateur n8n + queue Supabase + workers Edge Functions + Storage S3. Pour chaque snapshot&nbsp;: 30 prompts × 4 LLM × 1 500 marques = 180 000 réponses générées par trimestre. Coût API typique&nbsp;: 8 000-12 000 $/trimestre selon mix de modèles.</p>
      <p>Stockage des réponses&nbsp;: Postgres pour les métadonnées + S3 pour les texts complets. Indexation full-text via pgvector pour la recherche sémantique sur les réponses historiques.</p>

      <h2>Workflow d&apos;exécution</h2>
      <p>Étape 1&nbsp;: dispatcher les prompts vers les 4 LLM en parallèle (concurrent rate-limited à 10 req/s par modèle). Étape 2&nbsp;: parsing des réponses pour extraire les mentions de marques (NER + dictionnaire de marques surveillées). Étape 3&nbsp;: classification du sentiment via Claude Haiku (coût marginal $0.0001 par classification). Étape 4&nbsp;: calcul des KPIs agrégés (citation rate, share-of-voice, source attribution). Étape 5&nbsp;: génération des rapports clients.</p>

      <h2>Défis techniques rencontrés</h2>
      <p><strong>Stochasticité LLM</strong>&nbsp;: même prompt re-exécuté donne des réponses légèrement différentes. Solution&nbsp;: 5 ré-exécutions par prompt et moyennage. <strong>Variation des LLM dans le temps</strong>&nbsp;: les modèles sont mis à jour silencieusement par les fournisseurs. Solution&nbsp;: monitoring des écarts d&apos;une semaine sur l&apos;autre, alerte si écart &gt;15 %. <strong>Évolution des prompts cibles</strong>&nbsp;: les requêtes utilisateurs évoluent. Solution&nbsp;: revue trimestrielle des panels avec les clients.</p>

      <h2>Apprentissages clés sur 24 mois</h2>
      <p><strong>1.</strong> La stochasticité des LLM impose un panel minimum de 30 prompts pour avoir un signal stable.</p>
      <p><strong>2.</strong> Les corpus LLM sont mis à jour plus rapidement qu&apos;annoncé&nbsp;: ChatGPT a vu 4 mises à jour majeures en 2025-2026 (vs 2 annoncées).</p>
      <p><strong>3.</strong> Les biais entre LLM divergent fortement&nbsp;: une marque peut avoir 60 % citation rate sur Perplexity et 20 % sur ChatGPT. Mesurer un seul LLM produit une vue biaisée.</p>
      <p><strong>4.</strong> Le coût marginal d&apos;ajouter un LLM au monitoring est faible (~10-15 % de coût total) mais l&apos;information ajoutée est élevée.</p>

      <h2>Open data&nbsp;: 26 snapshots téléchargeables</h2>
      <p>Geoperf publie en open data 26 snapshots LLM anonymisés&nbsp;: panel de 30 prompts B2B FR sur 10 secteurs, exécuté hebdomadairement de janvier à juin 2026. Format CSV + JSON, licence Creative Commons CC-BY 4.0.</p>
      <p>Cas d&apos;usage&nbsp;: équipes data internes pour entraîner leur propre modèle de prédiction citation rate, équipes recherche académique pour étudier les biais LLM, équipes journalisme pour analyses sectorielles.</p>

      <h2>Pour aller plus loin</h2>
      <p><a href="/blog/open-data-26-snapshots-llm" className="underline text-brand-500">Lire l&apos;article dédié au open data Geoperf</a> ou <a href="/etude-sectorielle" className="underline text-brand-500">demander votre étude sectorielle gratuite</a> pour avoir votre marque ajoutée au panel de 1 500 marques surveillées trimestriellement.</p>
    </>
  );
}

function BodyOpenData() {
  return (
    <>
      <h2>26 snapshots LLM B2B FR en open data</h2>
      <p>Geoperf publie en open data 26 snapshots de visibilité LLM exécutés hebdomadairement de janvier à juin 2026 sur un panel de 30 prompts B2B FR couvrant 10 secteurs. C&apos;est, à notre connaissance, le plus large dataset open de monitoring LLM publié en France.</p>
      <p>Licence&nbsp;: Creative Commons CC-BY 4.0 (utilisation libre avec attribution &laquo;&nbsp;Source&nbsp;: Geoperf 2026 LLM B2B FR Dataset&nbsp;&raquo;). Format&nbsp;: CSV (10 MB compressé) + JSON (40 MB).</p>

      <h2>Contenu du dataset</h2>
      <p>Pour chaque snapshot (26 snapshots × 30 prompts × 4 LLM = 3 120 réponses)&nbsp;: ID prompt, secteur, LLM utilisé, modèle exact (GPT-4o, Gemini 2.5 Pro, Claude Sonnet 4.6, Perplexity Sonar), texte de la réponse complète, marques mentionnées extraites, position des marques dans la réponse, sources citées, sentiment classifié, score de confidence.</p>
      <p>Les marques sont anonymisées dans la version publique (Marque_001 à Marque_148) — la version pleine avec noms de marques est disponible sur demande pour les utilisateurs académiques avec un accord d&apos;usage.</p>

      <h2>Cas d&apos;usage</h2>
      <p><strong>Équipes data internes</strong>&nbsp;: entraîner un modèle de prédiction citation rate, identifier les patterns sectoriels, benchmark votre propre dataset.</p>
      <p><strong>Recherche académique</strong>&nbsp;: étude des biais LLM, analyse de la stochasticité, comparaison cross-LLM.</p>
      <p><strong>Équipes journalisme</strong>&nbsp;: analyses sectorielles, articles tendances LLM marketing, vérification des claims des fournisseurs LLM.</p>
      <p><strong>Équipes consulting</strong>&nbsp;: benchmark client vs panel large, identifier les opportunités sectorielles.</p>

      <h2>Anomalies notables observées dans le dataset</h2>
      <p><strong>Variance ChatGPT-Perplexity sur SaaS B2B FR</strong>&nbsp;: PayFit a 38 % citation rate Perplexity et 14 % sur ChatGPT. Pattern observé&nbsp;: Perplexity favorise les acteurs French Tech avec couverture Maddyness/JDN, ChatGPT pondère plus la presse établie.</p>
      <p><strong>Stabilité de Sanofi</strong>&nbsp;: Sanofi a maintenu un citation rate &gt; 80 % sur tous les snapshots du dataset, démontrant la robustesse d&apos;une stratégie GEO mature (Wikipedia EN+FR + presse internationale).</p>
      <p><strong>Émergence de Mistral AI</strong>&nbsp;: la marque est passée de 32 % à 78 % de citation rate entre janvier et juin 2026, tirée par la couverture presse internationale.</p>

      <h2>Méthodologie</h2>
      <p>Panel de 30 prompts construit sur les 10 secteurs B2B les plus représentés en FR (banque, asset mgmt, SaaS, conseil, avocats, pharma, aéro, énergie, assurance, ESN). Mix par secteur&nbsp;: 12 prompts découverte + 8 comparatifs + 6 techniques + 4 marque-explicites.</p>
      <p>Exécution hebdomadaire chaque vendredi entre 10h-14h CET pour stabiliser les conditions. Modèles utilisés&nbsp;: GPT-4o (OpenAI), Gemini 2.5 Pro (Google), Claude Sonnet 4.6 (Anthropic), Perplexity Sonar Pro. Température 0.7 standard. Pas de fine-tuning, pas de few-shot prompting (zero-shot pur).</p>

      <h2>Téléchargement</h2>
      <p>Le dataset est téléchargeable depuis <a href="https://geoperf.com/open-data" className="underline text-brand-500">geoperf.com/open-data</a> (page à venir). Pour la version complète avec noms de marques et accès académique, contactez l&apos;équipe via <a href="/contact" className="underline text-brand-500">/contact</a>.</p>

      <h2>Crédits et remerciements</h2>
      <p>Le dataset est rendu possible par les abonnés Geoperf SaaS Pro et Agency dont les contributions financent l&apos;exécution des panels et l&apos;infrastructure. Merci à toute l&apos;équipe et aux clients early-adopters qui ont rendu cet open data possible.</p>
    </>
  );
}

function BodyWebinar() {
  return (
    <>
      <h2>Stratégie GEO en 60 minutes&nbsp;: webinar Geoperf replay</h2>
      <p>En avril 2026, Geoperf a animé un webinar de 60 minutes sur la mise en place d&apos;une stratégie GEO pour CMO B2B FR. 320 participants en live, 1 200 vues en replay sur 30 jours. Cet article résume les 7 takeaways principaux du webinar.</p>

      <h2>Takeaway 1 — Le baseline avant tout</h2>
      <p>«&nbsp;Sans baseline citation rate cross-LLM, vous pilotez à l&apos;aveugle&nbsp;». Avant toute stratégie, mesurer. Investissement minimal&nbsp;: 79-199 €/mois sur outil monitoring + 0.1 ETP analyse interne.</p>

      <h2>Takeaway 2 — 3 leviers, dans cet ordre</h2>
      <p>Levier #1&nbsp;: technique on-page (robots.txt, schema, llms.txt, structure question/réponse). Effet en 4-12 semaines, coût 5-15 k€ one-shot.</p>
      <p>Levier #2&nbsp;: autorité tierce (Wikipedia + RP éditoriale earned). Effet en 9-18 mois, coût 25-50 k€/an.</p>
      <p>Levier #3&nbsp;: contenu propriétaire (études flagship, tribunes, podcasts). Effet en 12-24 mois cumulatif, coût 20-50 k€/an.</p>

      <h2>Takeaway 3 — La règle des 60-65 % SEO + 35-40 % GEO</h2>
      <p>L&apos;allocation budget search 2026 optimale est 60-65 % SEO + 35-40 % GEO. Pas plus, pas moins. Au-delà&nbsp;: dégradation SEO classique. En deçà&nbsp;: sous-investissement GEO.</p>

      <h2>Takeaway 4 — Wikipedia est le levier #1</h2>
      <p>Wikipedia représente 32 % des citations cross-LLM. Sans page Wikipedia (ou avec page minimale), vous plafonnez à 25 % de citation rate. Investissement&nbsp;: 5-15 k€ one-shot pour une page solide construite par éditeur certifié, ROI 3-5 ans.</p>

      <h2>Takeaway 5 — La RP éditoriale earned est le levier #2</h2>
      <p>Le contenu sponsorisé est dévalorisé par les LLM. La RP éditoriale earned (gagnée par mérite éditorial) est très efficace. 1.5-3 k€/mois pour un attaché de presse spécialisé sectoriel = 8-15 mentions presse/an = +15-30 points de citation rate à 12 mois.</p>

      <h2>Takeaway 6 — Mesurer cross-LLM, pas un seul</h2>
      <p>Mesurer ChatGPT seul = vue biaisée. Une marque peut avoir 60 % sur Perplexity et 20 % sur ChatGPT. Outils Geoperf, Profound, Otterly couvrent les 4 LLM majeurs nativement.</p>

      <h2>Takeaway 7 — Patience et constance</h2>
      <p>La stratégie GEO paie sur 12-24 mois. Pas de résultats spectaculaires en 3 mois. Mais une fois la position acquise, elle est robuste (Wikipedia + presse établie survivent aux changements algo).</p>

      <h2>Q&amp;A live&nbsp;: les 5 questions les plus posées</h2>
      <p><strong>Q1&nbsp;: «&nbsp;On bloque GPTBot par sécurité, c&apos;est mal&nbsp;?&nbsp;»</strong> Oui, c&apos;est l&apos;erreur #1. À débloquer immédiatement sauf cas vraiment spécifique (data sensible RGPD).</p>
      <p><strong>Q2&nbsp;: «&nbsp;Notre Wikipedia FR n&apos;a que 200 mots, est-ce suffisant&nbsp;?&nbsp;»</strong> Non. Cible 500+ mots avec 5+ sources tierces. Travailler avec un éditeur certifié pour atteindre ce seuil.</p>
      <p><strong>Q3&nbsp;: «&nbsp;Nous ne sommes pas en B2B, le GEO concerne-t-il quand même&nbsp;?&nbsp;»</strong> Oui, mais ratio différent. B2C transactionnel&nbsp;: 80 % SEO + 20 % GEO. B2C luxury/aspirational&nbsp;: 50/50.</p>
      <p><strong>Q4&nbsp;: «&nbsp;Combien coûte minimum pour démarrer&nbsp;?&nbsp;»</strong> 79 €/mois Geoperf Starter + 0 € pour les optimisations on-page (juste du temps). Soit ~1 k€/an minimum.</p>
      <p><strong>Q5&nbsp;: «&nbsp;Nos concurrents ont déjà 50 % de citation rate, est-ce trop tard&nbsp;?&nbsp;»</strong> Non. La fenêtre est toujours ouverte mais se referme. Investir maintenant capture une avance ; attendre 2028 paie le rattrapage à coût supérieur.</p>

      <h2>Replay du webinar</h2>
      <p>Le replay complet (60 minutes) est disponible sur YouTube ainsi que les slides PDF. Lien&nbsp;: <a href="https://geoperf.com/webinars" className="underline text-brand-500">geoperf.com/webinars</a>. Prochain webinar prévu&nbsp;: «&nbsp;GEO en 90 jours&nbsp;: roadmap actionnable pour PME B2B&nbsp;» (juin 2026).</p>
      <p>Pour vous inscrire au prochain webinar et recevoir le replay&nbsp;: <a href="/etude-sectorielle" className="underline text-brand-500">demandez votre étude sectorielle Geoperf</a> et vous recevrez l&apos;invitation par email.</p>
    </>
  );
}

export const ARTICLES_BATCH_2: BlogRegistry = {
  "roi-strategie-geo-budget": {
    slug: "roi-strategie-geo-budget",
    title: "ROI d'une stratégie GEO : modèle, chiffres, justification comex",
    metaDescription: "Comment quantifier le ROI GEO en 2026 : trafic organique préservé, trafic LLM-référent direct, lift réputationnel. Modèles PME, ETI, grand compte.",
    intro: "Évaluer le retour sur investissement d'une stratégie GEO exige de séparer trois flux de valeur : trafic organique préservé, trafic LLM-référent direct, lift réputationnel. Modèles chiffrés par profil et arguments pour justifier le budget en comex.",
    publishedAt: D14,
    category: "tactique",
    readingTimeMin: 7,
    Body: BodyRoiBudget,
    similar: ["geo-vs-seo-faire-les-deux", "roadmap-geo-2026-cmo", "etat-geo-france-2026"],
  },
  "geo-vs-seo-faire-les-deux": {
    slug: "geo-vs-seo-faire-les-deux",
    title: "GEO vs SEO : peut-on faire les deux ? (oui, voici comment)",
    metaDescription: "Stratégie hybride SEO + GEO : 70 % de fondamentaux communs, 30 % spécifiques. Roadmap 12 mois, dashboard 5 KPI, budget par profil.",
    intro: "SEO classique et GEO partagent 70 % de leurs fondamentaux mais divergent sur 30 % décisifs. La bonne nouvelle : investir une fois sur les 70 % communs paie sur les deux disciplines. Voici comment structurer une stratégie hybride sur 12 mois.",
    publishedAt: D14,
    category: "tactique",
    readingTimeMin: 7,
    Body: BodyHybrideSeoGeo,
    similar: ["seo-mort-longue-vie-geo-objection", "roi-strategie-geo-budget", "roadmap-geo-2026-cmo"],
  },
  "citation-rate-kpi-2026": {
    slug: "citation-rate-kpi-2026",
    title: "Citation rate : le KPI absolu à suivre en 2026",
    metaDescription: "Le citation rate cross-LLM est le KPI socle 2026. Définition, méthodologie 30 prompts, benchmarks par profil, KPI complémentaires, outils.",
    intro: "Position moyenne, CTR, impressions Search Console : ces trois indicateurs ne capturent que ce qui se passe sur les SERP de Google. Ils ne mesurent rien sur la perception de votre marque par les LLM. Le KPI socle a changé en 2026.",
    publishedAt: D21,
    category: "tactique",
    readingTimeMin: 7,
    Body: BodyCitationRateKpi,
    similar: ["anatomie-reponse-chatgpt", "etat-geo-france-2026", "benchmarks-llm-secteurs-france-2026"],
  },
  "google-ai-overview-update-2026": {
    slug: "google-ai-overview-update-2026",
    title: "Google AI Overview : update 2026 et conséquences marques",
    metaDescription: "AI Overview en 2026 : couverture étendue à 73 % B2B US / 58 % FR, qualité sources améliorée, nouvelles règles citation. 3 actions pour les marques.",
    intro: "Lancé fin 2024, déployé sur tous les marchés majeurs en 2025, AI Overview a connu en 2026 trois évolutions majeures : extension de la couverture, amélioration de la qualité des sources, raffinement des règles de citation. État des lieux à mai 2026.",
    publishedAt: D7,
    category: "platforms",
    readingTimeMin: 7,
    Body: BodyAiOverviewUpdate,
    similar: ["llm-marketing-trends-q2-2026", "perplexity-pages-opportunite", "chatgpt-browse-comment-etre-indexe"],
  },
  "perplexity-pages-opportunite": {
    slug: "perplexity-pages-opportunite",
    title: "Perplexity Pages : la nouvelle opportunité marketing 2026",
    metaDescription: "Perplexity Pages : publier sur DR>80, indexé Google, partageable. Stratégie production, ROI mesurable, pièges. 1 Page/mois pour B2B mid-market.",
    intro: "Lancé fin 2024, Perplexity Pages est devenu en 2026 un produit phare avec ~12 M utilisateurs. Pour les marques B2B FR, c'est une opportunité de publication thought-leadership sous-exploitée. Voici comment l'activer.",
    publishedAt: D14,
    category: "platforms",
    readingTimeMin: 6,
    Body: BodyPerplexityPagesOpp,
    similar: ["google-ai-overview-update-2026", "chatgpt-browse-comment-etre-indexe", "citation-rate-kpi-2026"],
  },
  "chatgpt-browse-comment-etre-indexe": {
    slug: "chatgpt-browse-comment-etre-indexe",
    title: "ChatGPT Browse : comment être indexé en 2026",
    metaDescription: "ChatGPT Search consulte le web en temps réel via Bing. Cinq leviers : crawlabilité GPTBot, index Bing, structure question/réponse, fraîcheur, schema.",
    intro: "ChatGPT Search (mode browse) est désormais activé par défaut dans GPT-4o et au-delà depuis Q1 2026. Pour les marques : comment être trouvé et cité dans ce mode. Cinq leviers concrets, à commencer par la crawlabilité GPTBot.",
    publishedAt: D21,
    category: "platforms",
    readingTimeMin: 6,
    Body: BodyChatGPTBrowse,
    similar: ["google-ai-overview-update-2026", "perplexity-pages-opportunite", "anatomie-reponse-chatgpt"],
  },
  "seo-mort-longue-vie-geo-objection": {
    slug: "seo-mort-longue-vie-geo-objection",
    title: "« Le SEO est mort, vive le GEO ! » : réponse à l'objection",
    metaDescription: "Cette phrase est fausse et dangereuse. SEO et GEO sont complémentaires, pas en concurrence. 5 raisons et 3 arguments comex pour répondre.",
    intro: "Cette phrase fait flore en 2026 dans les conférences marketing et les LinkedIn posts. Elle est fausse et dangereuse. SEO et GEO ne sont pas en concurrence — ils sont complémentaires. Voici pourquoi cette objection est mal posée et comment y répondre en interne.",
    publishedAt: D14,
    category: "objection",
    readingTimeMin: 6,
    Body: BodySeoMortGeo,
    similar: ["geo-vs-seo-faire-les-deux", "roadmap-geo-2026-cmo", "etat-geo-france-2026"],
  },
  "cas-geoperf-1500-marques-trimestre": {
    slug: "cas-geoperf-1500-marques-trimestre",
    title: "Comment Geoperf surveille 1 500 marques chaque trimestre",
    metaDescription: "Cas d'étude technique Geoperf : 1 500 marques B2B FR surveillées trimestriellement, 4 LLM, 180 000 réponses/trimestre. Stack n8n + Supabase + Edge.",
    intro: "Geoperf instrumentent la visibilité de 1 500 marques B2B FR sur les 4 LLM majeurs à cadence trimestrielle. Comment notre équipe de 4 personnes opère cette factory de surveillance, les défis techniques rencontrés, et les apprentissages tirés sur 24 mois.",
    publishedAt: D21,
    category: "showcase",
    readingTimeMin: 7,
    Body: BodyCasGeoperf,
    similar: ["open-data-26-snapshots-llm", "webinar-strategie-geo-60-minutes", "etat-geo-france-2026"],
  },
  "open-data-26-snapshots-llm": {
    slug: "open-data-26-snapshots-llm",
    title: "Open data : 26 snapshots LLM B2B FR téléchargeables",
    metaDescription: "Geoperf publie en open data 26 snapshots LLM (3 120 réponses) sur 30 prompts B2B FR x 4 LLM. Licence CC-BY 4.0. Cas d'usage, anomalies, méthodologie.",
    intro: "Geoperf publie en open data 26 snapshots de visibilité LLM exécutés hebdomadairement de janvier à juin 2026. Le plus large dataset open de monitoring LLM publié en France. Licence Creative Commons CC-BY 4.0.",
    publishedAt: D21,
    category: "showcase",
    readingTimeMin: 6,
    Body: BodyOpenData,
    similar: ["cas-geoperf-1500-marques-trimestre", "etat-geo-france-2026", "benchmarks-llm-secteurs-france-2026"],
  },
  "webinar-strategie-geo-60-minutes": {
    slug: "webinar-strategie-geo-60-minutes",
    title: "Webinar replay : stratégie GEO en 60 minutes",
    metaDescription: "Replay webinar Geoperf avril 2026 : 7 takeaways stratégie GEO pour CMO B2B FR. 320 participants live, Q&A 5 questions les plus posées.",
    intro: "En avril 2026, Geoperf a animé un webinar de 60 minutes sur la mise en place d'une stratégie GEO pour CMO B2B FR. 320 participants en live, 1 200 vues en replay sur 30 jours. Cet article résume les 7 takeaways principaux.",
    publishedAt: D14,
    category: "showcase",
    readingTimeMin: 6,
    Body: BodyWebinar,
    similar: ["roadmap-geo-2026-cmo", "cas-geoperf-1500-marques-trimestre", "open-data-26-snapshots-llm"],
  },
};
