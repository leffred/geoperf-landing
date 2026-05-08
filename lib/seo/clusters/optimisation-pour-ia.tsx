// S29 Session 3 — Clusters around pillar #8 optimisation-pour-ia.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyStructurer() {
  return (
    <>
      <h2>La structure compte plus que le SEO classique</h2>
      <p>Pour un LLM, l&apos;extraction d&apos;une page se fait phrase par phrase, parfois mot par mot. Une page narrative riche mais mal structurée est extraite avec moins de précision et donc moins citée. Inversement, une page structurée — H2 thématiques nets, listes, tableaux, sections FAQ — est extraite proprement et préférée comme source. Une étude Authoritas Q1 2026 sur 10 000 sites confirme&nbsp;: les pages structurées ont 3.2x plus de citations cross-LLM que les pages narratives équivalentes.</p>

      <h2>Règle 1 — H1 sous forme de question</h2>
      <p>Le H1 d&apos;une page corporate est souvent un slogan ou une marque («&nbsp;Notre solution X&nbsp;», «&nbsp;Le leader européen&nbsp;»). Pour les LLM, le H1 idéal est une question que pose l&apos;utilisateur («&nbsp;Qu&apos;est-ce que X&nbsp;», «&nbsp;Comment fonctionne X&nbsp;», «&nbsp;Pourquoi choisir X&nbsp;»). Cette correspondance H1-question augmente significativement la probabilité que la page soit retenue lors de la sélection de sources.</p>

      <h2>Règle 2 — Intro 50-80 mots qui répond</h2>
      <p>Les premiers paragraphes sont sur-extraits. Une intro de 50-80 mots qui résume la réponse complète maximise la probabilité d&apos;extraction. Les intros narratives ou story-telling sont écartées. Réservez le contexte et l&apos;histoire pour les sections H2 ultérieures.</p>

      <h2>Règle 3 — Sections H2 distinctes</h2>
      <p>Quatre à six H2, chacun couvrant un sous-aspect distinct du sujet. Évitez les H2 décoratifs ou qui répètent le H1 — chaque H2 doit avoir un mot-clé sémantique différent et apporter une information distincte. Les H3 ne sont nécessaires que si une section dépasse 400 mots.</p>

      <h2>Règle 4 — Listes ordonnées et tableaux</h2>
      <p>Les LLM extraient mieux les listes ordonnées (<code>&lt;ol&gt;</code>) et les tableaux HTML (<code>&lt;table&gt;</code>) que les paragraphes équivalents. Pour les comparatifs (prix, fonctionnalités, options), utilisez systématiquement des tableaux. Pour les processus et tutoriels, des listes ordonnées avec étapes numérotées. Évitez d&apos;encoder vos data en images — invisibles aux LLM en mode texte.</p>

      <h2>Règle 5 — Faits chiffrés explicites</h2>
      <p>Les LLM extraient préférentiellement les phrases contenant des chiffres précis («&nbsp;73 % des CMO B2B&nbsp;», «&nbsp;30 prompts par snapshot&nbsp;»). Une page avec 5-10 statistiques chiffrées explicites est citée 2.5x plus qu&apos;une page contenant les mêmes informations en formulation vague. Sourcez les chiffres avec des références autoritatives (Statista, Forrester, Gartner) pour amplifier l&apos;effet.</p>

      <h2>Règle 6 — Section FAQ structurée</h2>
      <p>5-10 questions reformulant les recherches réelles, chaque réponse en 80-150 mots, avec FAQPage schema. Cette section augmente le citation rate de 40 à 100 % sur les prompts qui correspondent aux questions FAQ (mesure Geoperf 2026). C&apos;est l&apos;ajout single-element à plus haut ROI.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Effort vs ROI</p>
        <p className="text-sm text-ink">Restructurer une page selon ces 6 règles&nbsp;: 2-4 heures par page bien faite. Effet documenté&nbsp;: passage moyen de 13 % à 41 % de citation rate cross-LLM en 8-16 semaines (Authoritas Q1 2026, 10 000 sites). C&apos;est multiplicatif, pas marginal.</p>
      </div>

      <h2>Règle 7 — Sweet-spot longueur</h2>
      <p>Pages cluster (article spécifique)&nbsp;: 800-1200 mots optimal, plateau au-delà de 1500 mots. Pages pillar (long-form)&nbsp;: 2200-2500 mots optimal, plateau au-delà de 3500. En dessous de 600 mots, les LLM considèrent &laquo;&nbsp;thin content&nbsp;&raquo; et dévalorisent.</p>

      <h2>Validation finale</h2>
      <p>Avant publication, trois checks&nbsp;: (1) Lighthouse score &gt; 85 sur SEO + Accessibility + Best Practices. (2) Lecture en diagonale&nbsp;: pouvez-vous comprendre 80 % de la page en 30 secondes ? (3) Test manuel&nbsp;: posez une question correspondant au H1 à ChatGPT et regardez si votre page apparaît dans la réponse (peut prendre 4-12 semaines après publication pour se stabiliser).</p>
    </>
  );
}

function BodySchemaIa() {
  return (
    <>
      <h2>Schema.org est le langage des LLM</h2>
      <p>Schema.org en JSON-LD est devenu le standard de facto pour communiquer aux LLM la structure sémantique d&apos;une page. Google le recommande depuis 2017 ; les LLM (GPTBot, ClaudeBot, PerplexityBot) parsent quasi-exclusivement le JSON-LD pour extraire l&apos;entité, l&apos;auteur, la date, le sujet. Microdata et RDFa fonctionnent encore pour Google mais sont 5-10x moins fiables pour les LLM.</p>

      <h2>Cinq schemas prioritaires pour le GEO</h2>
      <p><strong>Organization</strong>&nbsp;: déployé sur la home, identifie l&apos;entité de l&apos;entreprise. Champs critiques&nbsp;: name, url, logo, sameAs (liens vers Wikipedia, LinkedIn, X). <strong>Article ou BlogPosting</strong>&nbsp;: pour les pages éditoriales. Champs&nbsp;: headline, description, datePublished, dateModified, author (Person ou Organization), image. <strong>FAQPage</strong>&nbsp;: pour les sections FAQ, fortement corrélé avec citation AI Overview. <strong>HowTo</strong>&nbsp;: pour les pages tutoriels/guides avec étapes. <strong>Product ou Service</strong>&nbsp;: pour pages produit avec name, description, brand, aggregateRating, offers.</p>

      <h2>Implémentation JSON-LD vs microdata</h2>
      <p>JSON-LD obligatoire en 2026. Implémenter dans le <code>&lt;head&gt;</code> ou avant <code>&lt;/body&gt;</code>, avec <code>@context</code> Schema.org standard et <code>@type</code> adapté. Pour TypeScript, package npm <code>schema-dts</code> fournit les types pour autocomplétion. Microdata avec attributs HTML inline est moins fiable pour les LLM.</p>

      <h2>Validation et tests</h2>
      <p>Trois validateurs gratuits indispensables&nbsp;: <strong>Google Rich Results Test</strong> (focus Google), <strong>Schema.org Validator</strong> (validation pure), <strong>JSON-LD Playground</strong> (dev-focus). Utiliser systématiquement avant déploiement de toute nouvelle page. Une seule erreur dans le JSON-LD invalide tout le bloc.</p>

      <h2>Erreurs fréquentes</h2>
      <p>Premier piège&nbsp;: schema vide ou minimal (juste <code>@type</code> + <code>name</code>). Les LLM ont besoin de richesse sémantique pour bénéficier du schema. Deuxième piège&nbsp;: schema déclaré mais non synchronisé avec le contenu visible (ex&nbsp;: schema dit &laquo;&nbsp;published 2024-01-01&nbsp;&raquo; mais l&apos;article est récent). Les LLM détectent ces incohérences et dévalorisent. Troisième piège&nbsp;: schema dupliqué entre header et body, créant des conflits.</p>

      <h2>Schema sameAs pour Organization</h2>
      <p>Le champ <code>sameAs</code> de Organization est un signal important pour les LLM&nbsp;: il liste les profils canoniques de votre marque sur le web (Wikipedia, LinkedIn, X, Crunchbase, GitHub si pertinent, profils sectoriels). Cette liste aide les LLM à désambiguïser votre marque (vs concurrents avec noms similaires) et à associer les sources tierces qui parlent de vous.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Exemple sameAs solide</p>
        <p className="text-sm text-ink">[&quot;https://en.wikipedia.org/wiki/MyBrand&quot;, &quot;https://www.linkedin.com/company/mybrand&quot;, &quot;https://twitter.com/mybrand&quot;, &quot;https://www.crunchbase.com/organization/mybrand&quot;, &quot;https://github.com/mybrand&quot;]. 5 entrées canoniques bien renseignées valent mieux que 10 entrées approximatives.</p>
      </div>

      <h2>Cadence de mise à jour</h2>
      <p>Le schema doit être maintenu en synchronisation avec le contenu&nbsp;: dateModified renseigné à chaque update significatif, aggregateRating mis à jour si vos avis évoluent, offers actualisés si vos prix changent. Schema obsolète = signal négatif pour les LLM.</p>

      <h2>Stratégie de déploiement progressif</h2>
      <p>Mois 1&nbsp;: Organization sur home + Article sur 10 articles blog les plus visités. Mois 2&nbsp;: FAQPage sur top 5 pages produit. Mois 3&nbsp;: HowTo sur pages tutoriels. Mois 4-6&nbsp;: Product/Service sur catalogue. Mois 7-12&nbsp;: enrichissement progressif des champs (sameAs complet, aggregateRating, etc.). Effort total ~10-20 jours développeur sur 12 mois.</p>
    </>
  );
}

function BodyLongueTraine() {
  return (
    <>
      <h2>La longue traîne IA est une opportunité 2026</h2>
      <p>Sur Google, la longue traîne (requêtes peu volumineuses mais nombreuses) génère traditionnellement 50-70 % du trafic organique. Sur les LLM, la dynamique est similaire mais avec des spécificités. Les LLM répondent mieux aux requêtes longues et conversationnelles que Google, ce qui ouvre une opportunité de capter des intents précis sous-exploités par le SEO classique.</p>

      <h2>Profil des requêtes LLM long-tail</h2>
      <p>Les requêtes LLM sont en moyenne 2-3x plus longues que les requêtes Google&nbsp;: 10-15 mots vs 3-4 mots. Plus conversationnelles («&nbsp;quelle est la meilleure solution pour optimiser X dans le contexte Y avec contrainte Z&nbsp;»). Plus comparatives («&nbsp;A vs B vs C pour mon cas spécifique&nbsp;»). Plus orientées recommandation que documentation pure.</p>

      <h2>Stratégie #1 — Pages de cas d&apos;usage spécifiques</h2>
      <p>Plutôt que de viser «&nbsp;outil X&nbsp;» (high-volume, high-competition), créez 10-30 pages cibles cas d&apos;usage spécifiques&nbsp;: «&nbsp;outil X pour [secteur précis]&nbsp;», «&nbsp;outil X pour [taille entreprise]&nbsp;», «&nbsp;outil X pour [contrainte spécifique]&nbsp;». Chaque page longue traîne capture un volume modeste mais cumulé représente 50-70 % du potentiel LLM.</p>

      <h2>Stratégie #2 — Pages comparatives détaillées</h2>
      <p>Les LLM citent fréquemment les pages comparatives objectives de type «&nbsp;A vs B&nbsp;» ou «&nbsp;A vs B vs C&nbsp;». Créez 5-10 pages comparatives détaillées (vous vs concurrents directs, vous vs alternatives sectorielles), avec tableau comparatif HTML, faits chiffrés, et conclusion nuancée. Ces pages capturent les requêtes commerciales fortes du funnel.</p>

      <h2>Stratégie #3 — Pages question/réponse Q/R</h2>
      <p>10-30 pages chacune dédiée à une question spécifique de votre marché&nbsp;: «&nbsp;Comment résoudre [problème spécifique] ?&nbsp;», «&nbsp;Pourquoi [phénomène observé] ?&nbsp;». Format article long-form (800-1500 mots) avec FAQPage schema, structure question/réponse explicite, sources autoritatives. Ces pages dominent les requêtes LLM informationnelles.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Volume cible</p>
        <p className="text-sm text-ink">Pour une marque B2B mid-market visant 5-15k visites organic/mois en année 2&nbsp;: 30-50 pages longue traîne sur 12 mois. Effort de production&nbsp;: 4-8 heures par page de qualité, soit 0.2-0.5 ETP content sur 12 mois. ROI observé&nbsp;: ~80-150 visites organic/mois par page bien indexée à 6 mois.</p>
      </div>

      <h2>Sourcing des sujets longue traîne</h2>
      <p>Quatre sources de vérité&nbsp;: <strong>(1) Search Console</strong> — queries longues qui amènent peu de trafic mais existent (signal d&apos;opportunité). <strong>(2) Reddit / Quora</strong> — questions fréquentes posées dans votre niche. <strong>(3) Conversations support / sales</strong> — questions des prospects et clients. <strong>(4) Outils SEO type Ahrefs / Semrush</strong> — long-tail keyword research avec volumes 10-100/mois.</p>

      <h2>Cadence de production</h2>
      <p>Une page longue traîne par semaine est ambitieux mais soutenable pour une équipe content avec un rédacteur dédié. Un rédacteur senior produit 2-3 pages bien faites par semaine (10-15 par mois). Pour 30-50 pages par an, prévoir 2-3 mois de production concentrée + ajustements continus.</p>

      <h2>Structure idéale d&apos;une page longue traîne</h2>
      <p>H1 = la question exacte de l&apos;utilisateur. Intro 50-80 mots qui répond. 4-6 H2 thématiques. Au moins 1 tableau ou liste structurée. 1-2 stats sourcées. Section FAQ avec 5-8 sous-questions. Schema Article + FAQPage. Liens internes vers 2-3 cousins thématiques. Total 800-1200 mots.</p>

      <h2>Mesure de l&apos;impact</h2>
      <p>À 6 mois, mesurer&nbsp;: trafic Google par page longue traîne (Search Console), citation rate LLM par page (outil GEO), conversion rate vers /etude-sectorielle ou autre CTA. Les pages qui underperform (&lt; 50 visites/mois ET &lt; 5 % citation rate) après 9 mois doivent être consolidées ou retirées. Les pages qui surperforment doivent être enrichies (étude flagship dédiée, vidéo, etc.).</p>
    </>
  );
}

function BodyOnPage() {
  return (
    <>
      <h2>Optimisation on-page IA — checklist complète</h2>
      <p>L&apos;optimisation on-page pour l&apos;IA combine techniques SEO classiques (mobile-first, performance, schema.org) et spécificités LLM (structure question/réponse, llms.txt, autorisation bots IA). Voici la checklist exhaustive en 12 points qu&apos;un consultant senior peut auditer en 4-6 heures sur une page stratégique.</p>

      <h2>Section A — Technique infrastructure</h2>
      <p><strong>1. robots.txt</strong>&nbsp;: GPTBot, ClaudeBot, PerplexityBot, Google-Extended autorisés (pas en Disallow). <strong>2. llms.txt</strong>&nbsp;: présent à la racine du domaine, listant les pages clés avec contexte sémantique en Markdown simple. <strong>3. sitemap.xml</strong>&nbsp;: à jour, soumis à Google Search Console + Bing Webmaster Tools (Perplexity utilise Bing). <strong>4. SSR ou SSG</strong>&nbsp;: contenu présent dans le HTML initial (vérifier avec view-source: ou curl).</p>

      <h2>Section B — Performance</h2>
      <p><strong>5. Core Web Vitals</strong>&nbsp;: LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1. Lighthouse score &gt; 85 sur Performance + Accessibility + SEO + Best Practices. <strong>6. Mobile-first</strong>&nbsp;: page mobile n&apos;a pas de contenu manquant vs desktop. <strong>7. Compression et caching</strong>&nbsp;: HTTP/2, Brotli ou Gzip, cache-control headers appropriés.</p>

      <h2>Section C — Structure de contenu</h2>
      <p><strong>8. H1 question</strong>&nbsp;: sous forme de question ou réponse directe. <strong>9. Intro 50-80 mots</strong>&nbsp;: résume la réponse complète dès les premiers paragraphes. <strong>10. H2 thématiques</strong>&nbsp;: 4-6 H2 distincts, chacun apporte info nouvelle. <strong>11. Listes/tableaux</strong>&nbsp;: data structurée pour comparatifs et processus.</p>

      <h2>Section D — Schema et balisage</h2>
      <p><strong>12. Schema.org JSON-LD</strong>&nbsp;: Article + Organization (sameAs renseigné) + FAQPage (si section FAQ) + HowTo (si tutoriel) + Product/Service (si page produit). Validé par Google Rich Results Test sans warnings.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Scoring</p>
        <p className="text-sm text-ink">12/12 = optimisation on-page complète. 9-11 = quelques manques mineurs. 7-8 = optimisation partielle, gains rapides accessibles. 5-6 = déficit structurel, plan 30 jours nécessaire. &lt; 5 = page non-prête pour GEO, refonte recommandée.</p>
      </div>

      <h2>Cas concret — passage 5/12 à 11/12</h2>
      <p>Page produit B2B SaaS, audit initial 5/12 (manques&nbsp;: robots.txt bloquant GPTBot, pas de llms.txt, pas de schema FAQ, H1 corporate, pas de tableau comparatif, intro narrative longue, performance 60/100). Plan 30 jours&nbsp;: déblocage robots.txt, création llms.txt, refonte H1, rewrite intro, déploiement schema FAQ, ajout tableau comparatif, optimisation performance. Score final 11/12 à J30. Citation rate cross-LLM&nbsp;: 8 % → 28 % à 4 mois.</p>

      <h2>Cadence d&apos;audit</h2>
      <p>Pour les 30 pages stratégiques&nbsp;: audit complet annuel + check rapide trimestriel (vérifier que rien n&apos;a régressé). Pour les nouvelles pages&nbsp;: audit obligatoire avant publication. Pour les anciennes pages avec performance déclinante&nbsp;: audit à la demande, prioriser les pages avec trafic top-20.</p>

      <h2>Outils pour exécuter l&apos;audit</h2>
      <p>Lighthouse intégré Chrome (gratuit). Google Rich Results Test (gratuit). Schema.org Validator (gratuit). Screaming Frog (gratuit jusqu&apos;à 500 URL). Pour le check robots.txt et user-agents&nbsp;: <a href="https://platform.openai.com/docs/gptbot" target="_blank" rel="noopener noreferrer" className="underline">OpenAI GPTBot doc</a>. L&apos;audit complet d&apos;une page prend 30-45 minutes pour un consultant senior, 1-2h pour un junior formé.</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: faire l&apos;audit sans plan d&apos;action priorisé. Audit = inventaire, pas amélioration en soi. Deuxième piège&nbsp;: sur-investir dans les sections D (schema) en négligeant A (technique infra). Sans crawlabilité ni SSR, le schema ne sert à rien. Troisième piège&nbsp;: optimiser une page parfaitement et oublier les liens internes vers elle. Une page top 12/12 sans liens internes est sous-utilisée.</p>
    </>
  );
}

function BodyEvergreen() {
  return (
    <>
      <h2>Pourquoi le contenu evergreen domine pour les LLM</h2>
      <p>Le contenu evergreen — pertinent et factuel sur 12-36 mois sans nécessiter de mise à jour majeure — est sur-représenté dans les corpus LLM. Les modèles ré-entraînés tous les 6-12 mois capturent préférentiellement ces pages stables. Inversement, le contenu d&apos;actualité ou daté tend à être daté à l&apos;ingestion et donc dévalorisé.</p>

      <h2>Caractéristiques du contenu evergreen</h2>
      <p><strong>Sujet stable</strong>&nbsp;: pertinent dans 2-3 ans (pas dépendant d&apos;un événement, d&apos;une release produit récente, ou d&apos;une statistique éphémère). <strong>Données pérennes</strong>&nbsp;: référence à des concepts fondamentaux, méthodologies, principes — pas à des chiffres trimestriels. <strong>Format intemporel</strong>&nbsp;: explication, méthode, comparaison plutôt qu&apos;actu, news, événement.</p>

      <h2>Les pages evergreen qui marchent</h2>
      <p>Quatre formats produisent du contenu evergreen avec succès&nbsp;: <strong>(1) Guides définitifs</strong> ou pillar pages 2000-3000 mots sur sujet de cœur. <strong>(2) Comparatifs catégoriels</strong> («&nbsp;A vs B vs C&nbsp;» avec critères objectifs). <strong>(3) Glossaires sectoriels</strong> avec définitions précises. <strong>(4) Tutoriels HowTo</strong> step-by-step sur problèmes récurrents.</p>

      <h2>Les pages NON-evergreen à éviter pour LLM</h2>
      <p>Articles d&apos;actualité, news produits, communiqués de presse, comptes-rendus d&apos;événements&nbsp;: ces formats ont leur place dans le mix éditorial mais leur contribution au GEO est marginale. Investir 80 % du budget content sur evergreen + 20 % sur actu produit la majorité du ROI GEO.</p>

      <h2>Maintenance des pages evergreen</h2>
      <p>Evergreen ≠ &laquo;&nbsp;publier et oublier&nbsp;&raquo;. Les meilleures pages evergreen sont mises à jour 1-2 fois par an avec&nbsp;: data chiffrées rafraîchies (référence Statista, Forrester, Gartner mises à jour), exemples remplacés par cas plus récents, dateModified renseigné dans le schema. Cette maintenance signale aux LLM que la page est vivante et autoritaire.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">ROI evergreen vs actu</p>
        <p className="text-sm text-ink">Une page evergreen génère 50-200 visites organiques/mois sur 24 mois minimum, citation rate cross-LLM 25-50 %. Une actualité génère un pic 500-2000 visites le mois de publication, ~10 visites/mois après 3 mois, citation rate &lt; 5 %. ROI long terme&nbsp;: evergreen 5-10x supérieur.</p>
      </div>

      <h2>Stratégie de production evergreen</h2>
      <p>Pour une PME B2B mid-market&nbsp;: produire 12 pages evergreen par an (1 par mois), chacune 800-2500 mots selon catégorie (cluster vs pillar). Mix typique&nbsp;: 8 clusters 1000 mots + 2 pillars 2500 mots + 2 comparatifs catégoriels 1500 mots. Effort total&nbsp;: 0.3-0.5 ETP rédacteur senior + budget RP/edition occasionnelle.</p>

      <h2>Cadence de mise à jour</h2>
      <p>Pages evergreen majeures (pillars, comparatifs)&nbsp;: revue + maintenance 2x/an (avril-octobre standards). Pages cluster (longue traîne)&nbsp;: revue 1x/an. Pages glossaire ou tutoriel&nbsp;: à la demande quand un changement majeur du sujet le justifie. Toute mise à jour&nbsp;: <code>dateModified</code> dans schema, mention &laquo;&nbsp;mis à jour le X&nbsp;&raquo; visible en haut de la page.</p>

      <h2>Mesure de la performance evergreen</h2>
      <p>Trois KPI à 12 mois post-publication&nbsp;: trafic organique mensuel cumulé (cible 50-200/mois), citation rate cross-LLM (cible 25-50 %), conversion rate vers CTA (cible 1-3 % selon CTA). Pages qui ne tiennent pas ces seuils après 12 mois doivent être consolidées (fusion avec page voisine), enrichies (étude flagship dédiée), ou retirées (consommation de budget crawl pour rien).</p>

      <h2>Pièges à éviter</h2>
      <p>Premier piège&nbsp;: confondre evergreen et &laquo;&nbsp;généraliste&nbsp;&raquo;. Une page evergreen peut être très spécifique tant que le sujet est durable. Deuxième piège&nbsp;: jamais mettre à jour. Sans dateModified et sans rafraîchissement, le contenu evergreen vieillit et perd citation rate. Troisième piège&nbsp;: produire 50 pages evergreen mediocre plutôt que 12 excellentes. La qualité prime sur la quantité.</p>
    </>
  );
}

export const OPTIMISATION_POUR_IA_CLUSTERS: ClusterRegistry = {
  "structurer-contenu-pour-llm": {
    parentPillar: "optimisation-pour-ia",
    fr: {
      title: "Structurer son contenu pour les LLM : 7 règles",
      metaDescription:
        "Sept règles de structuration de contenu pour LLM : H1 question, intro courte, H2 distincts, listes/tableaux, faits chiffrés, FAQ, longueur. Effet 3.2x.",
      intro:
        "Pour un LLM, l'extraction se fait phrase par phrase. Une page narrative riche mais mal structurée est citée moins qu'une page bien structurée équivalente. Sept règles — H1 question, intro courte, H2 distincts, listes, faits, FAQ, longueur — produisent un effet multiplicatif 3.2x sur le citation rate.",
      publishedAt: PUB,
      Body: BodyStructurer,
    },
  },
  "markup-schema-pour-ia": {
    parentPillar: "optimisation-pour-ia",
    fr: {
      title: "Schema.org pour l'IA : 5 schemas prioritaires",
      metaDescription:
        "Schema.org JSON-LD pour LLM : Organization, Article, FAQPage, HowTo, Product/Service. Implémentation, validation, sameAs, stratégie de déploiement progressif.",
      intro:
        "Schema.org en JSON-LD est le langage des LLM. Cinq schemas prioritaires pour le GEO — Organization, Article, FAQPage, HowTo, Product/Service. Implémentation rigoureuse, validation systématique, et stratégie de déploiement progressif sur 12 mois pour 30 pages stratégiques.",
      publishedAt: PUB,
      Body: BodySchemaIa,
    },
  },
  "longue-traine-ia": {
    parentPillar: "optimisation-pour-ia",
    fr: {
      title: "Longue traîne IA : capter les requêtes conversationnelles",
      metaDescription:
        "Stratégie longue traîne pour LLM : pages cas d'usage spécifiques, comparatifs détaillés, Q/R. Volume cible 30-50 pages/an, 80-150 visites/mois par page.",
      intro:
        "Les requêtes LLM sont 2-3x plus longues et conversationnelles que Google. Trois stratégies — pages cas d'usage spécifiques, comparatifs détaillés, Q/R — capturent ce volume long-tail sous-exploité. 30-50 pages/an pour 5-15k visites organic mensuelles en année 2.",
      publishedAt: PUB,
      Body: BodyLongueTraine,
    },
  },
  "optimisation-on-page-ia": {
    parentPillar: "optimisation-pour-ia",
    fr: {
      title: "Optimisation on-page IA : checklist en 12 points",
      metaDescription:
        "Checklist on-page IA en 12 points : technique infra, performance, structure de contenu, schema. Audit 4-6h. Cas concret 5/12 à 11/12 en 30 jours.",
      intro:
        "Optimisation on-page pour l'IA combine SEO classique et spécificités LLM. Checklist en 12 points — infrastructure technique, performance, structure de contenu, schema — qu'un consultant audite en 4-6h. Cas concret : passer de 5/12 à 11/12 en 30 jours, citation rate cross-LLM 8 % → 28 %.",
      publishedAt: PUB,
      Body: BodyOnPage,
    },
  },
  "contenu-evergreen-ia": {
    parentPillar: "optimisation-pour-ia",
    fr: {
      title: "Contenu evergreen pour l'IA : pourquoi et comment",
      metaDescription:
        "Le contenu evergreen domine dans les corpus LLM. Quatre formats qui marchent : guides, comparatifs, glossaires, tutoriels. Maintenance, ROI 5-10x vs actu.",
      intro:
        "Le contenu evergreen est sur-représenté dans les corpus LLM. Quatre formats qui marchent — guides, comparatifs catégoriels, glossaires, tutoriels — produisent un ROI 5-10x supérieur à l'actualité sur 24 mois. Stratégie de production 12 pages/an et maintenance 2x/an.",
      publishedAt: PUB,
      Body: BodyEvergreen,
    },
  },
};
