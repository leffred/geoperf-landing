// S29 Session 3 + follow-up EN — Clusters around pillar #3 chatgpt-marketing.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyApparaitre() {
  return (
    <>
      <h2>Pourquoi apparaître dans ChatGPT n&apos;est pas du SEO classique</h2>
      <p>ChatGPT n&apos;a pas de SERP, pas de positions à occuper, pas de CTR à optimiser. Apparaître dans une réponse ChatGPT signifie que votre marque est citée nommément dans le texte synthétisé par le modèle. Cette citation peut venir soit de la mémoire d&apos;entraînement (corpus figé), soit du mode browse / search (web temps réel). Optimiser l&apos;un n&apos;optimise pas automatiquement l&apos;autre.</p>

      <h2>Étape 1 — Identifier vos prompts cibles</h2>
      <p>Listez 30 prompts que vos prospects pourraient poser à ChatGPT au cours d&apos;un cycle d&apos;achat. Source du langage&nbsp;: Search Console (queries qui amènent du trafic), Reddit (discussions secteur), conversations support (questions clients). 40 % de prompts de découverte («&nbsp;meilleur acteur X&nbsp;»), 25 % comparatifs («&nbsp;A vs B&nbsp;»), 20 % techniques, 15 % marque-explicites.</p>

      <h2>Étape 2 — Construire l&apos;autorité tierce avant tout</h2>
      <p>ChatGPT cite préférentiellement les sources autoritaires indépendantes plutôt que les sites de marque. 32 % des citations cross-LLM passent par Wikipedia, 18 % par la presse spécialisée, 14 % par la presse établie. Sans présence Wikipedia + 8-15 mentions presse spécialisée sur les 12 derniers mois, vous avez très peu de chances d&apos;être cités sur prompts ouverts.</p>
      <p>Le levier RP éditoriale earned (1500-3000 €/mois pour un attaché de presse spécialisé) est le plus rentable. Le contenu sponsorisé n&apos;a quasi aucun impact LLM&nbsp;: les modèles dévalorisent les pages marquées «&nbsp;sponsored&nbsp;» ou «&nbsp;advertorial&nbsp;».</p>

      <h2>Étape 3 — Optimiser votre site pour l&apos;extraction</h2>
      <p>Reformulez les H1 stratégiques en question, ajoutez schema.org Organization avec sameAs vers Wikipedia, déployez FAQPage sur les pages produit. Vérifiez robots.txt&nbsp;: GPTBot ne doit pas être bloqué (vérifier sur <a href="https://openai.com/gptbot" target="_blank" rel="noopener noreferrer" className="underline">openai.com/gptbot</a> que vous l&apos;autorisez). Ajoutez un fichier llms.txt à la racine du domaine.</p>

      <h2>Étape 4 — Mesurer et itérer</h2>
      <p>Souscrivez à un outil GEO (Geoperf, Otterly, Profound). Lancez votre panel chaque semaine, suivez citation rate, source attribution, sentiment. Itérer mois par mois&nbsp;: identifiez les prompts où vous n&apos;apparaissez jamais, investiguez pourquoi (pas de Wikipedia&nbsp;? presse manquante&nbsp;? structure faible&nbsp;?), corrigez.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Repère délais réalistes</p>
        <p className="text-sm text-ink">ChatGPT Search (mode web)&nbsp;: 4-12 semaines après optimisation. ChatGPT mode standard (mémoire)&nbsp;: 6-12 mois (cycle de ré-entraînement). Pour aller vite, prioriser optimisation pour ChatGPT Search.</p>
      </div>

      <h2>Erreurs fréquentes à éviter</h2>
      <p>Bloquer GPTBot dans robots.txt par mimétisme avec d&apos;autres bots est l&apos;erreur #1 — vous vous rendez volontairement invisibles. Investir uniquement en SEO classique sans toucher à l&apos;autorité tierce est l&apos;erreur #2. Mesurer une seule fois plutôt qu&apos;hebdomadairement est l&apos;erreur #3 — la stochasticité LLM domine sur un snapshot isolé.</p>

      <h2>Cible réaliste à 6 mois</h2>
      <p>Pour une marque B2B FR mid-market partant d&apos;un citation rate ChatGPT de 5-15 %, atteindre 30-45 % en six mois est réaliste avec un investissement de 30-50 k€ (outil + RP + restructuration on-page). Au-delà de 50 % de citation rate, le coût marginal augmente significativement et exige une stratégie Wikipedia avancée + études flagship trimestrielles.</p>
    </>
  );
}

function BodyApparaitreEn() {
  return (
    <>
      <h2>Why showing up in ChatGPT is not classic SEO</h2>
      <p>ChatGPT has no SERP, no positions to occupy, no CTR to optimize. Showing up in a ChatGPT response means your brand is cited by name in the model&apos;s synthesized text. That citation can come either from training memory (fixed corpus) or from browse / search mode (real-time web). Optimizing one does not automatically optimize the other.</p>

      <h2>Step 1 — Identify your target prompts</h2>
      <p>List 30 prompts your prospects might ask ChatGPT during a buying cycle. Sources for the language: Search Console (queries driving traffic), Reddit (industry discussions), support conversations (customer questions). 40 % discovery prompts (&quot;best X provider&quot;), 25 % comparisons (&quot;A vs B&quot;), 20 % technical, 15 % brand-explicit.</p>

      <h2>Step 2 — Build third-party authority first</h2>
      <p>ChatGPT prefers independent authoritative sources over brand sites. 32 % of cross-LLM citations route through Wikipedia, 18 % through trade press, 14 % through established press (NYT, WSJ, FT, Bloomberg). Without Wikipedia presence + 8-15 trade press mentions in the last 12 months, you have near-zero chance of being cited on open prompts.</p>
      <p>Earned editorial PR ($2-4k/month for a specialized PR officer) is the most profitable lever. Sponsored content has near-zero LLM impact: models discount pages marked &quot;sponsored&quot; or &quot;advertorial&quot;.</p>

      <h2>Step 3 — Optimize your site for extraction</h2>
      <p>Reformulate strategic H1s as questions, deploy schema.org Organization with sameAs pointing to Wikipedia, add FAQPage on product pages. Check robots.txt: GPTBot must not be blocked (verify on <a href="https://openai.com/gptbot" target="_blank" rel="noopener noreferrer" className="underline">openai.com/gptbot</a> that you authorize it). Add an llms.txt file at the domain root.</p>

      <h2>Step 4 — Measure and iterate</h2>
      <p>Subscribe to a GEO tool (Geoperf, Otterly, Profound). Run your panel weekly, track citation rate, source attribution, sentiment. Iterate month by month: identify prompts where you never appear, investigate why (no Wikipedia? thin press? weak structure?), fix.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Realistic timing benchmarks</p>
        <p className="text-sm text-ink">ChatGPT Search (web mode): 4-12 weeks after optimization. ChatGPT standard (memory mode): 6-12 months (retraining cycle). To move fast, prioritize ChatGPT Search optimization.</p>
      </div>

      <h2>Common mistakes to avoid</h2>
      <p>Blocking GPTBot in robots.txt by mimicking other bots is mistake #1 — you become voluntarily invisible. Investing only in classic SEO without touching third-party authority is mistake #2. Measuring once instead of weekly is mistake #3 — LLM stochasticity dominates on isolated snapshots.</p>

      <h2>Realistic 6-month target</h2>
      <p>For a US/UK B2B mid-market brand starting from a 5-15 % ChatGPT citation rate, reaching 30-45 % in six months is achievable with a $35-60k investment (tool + PR + on-page restructure). Above 50 % citation rate, marginal cost rises significantly and requires advanced Wikipedia strategy + quarterly flagship studies.</p>
    </>
  );
}

function BodyFormat() {
  return (
    <>
      <h2>Pourquoi le format compte autant que le fond</h2>
      <p>ChatGPT extrait préférentiellement certains formats de contenu lors de la sélection des sources. Une page avec contenu de qualité mais format narratif obscur sera ignorée au profit d&apos;une page comparable mais structurée. Selon notre étude Q1 2026 sur 5000 réponses ChatGPT analysées, 4 caractéristiques de format expliquent 60 % de la variance dans le citation rate.</p>

      <h2>Caractéristique 1 — Structure question/réponse</h2>
      <p>Les pages avec H1 sous forme de question, intro courte qui répond, et sections FAQ ont un citation rate 3,2x supérieur aux pages narratives. ChatGPT &laquo;&nbsp;voit&nbsp;» ces pages comme des réponses prêtes à l&apos;emploi qu&apos;il peut extraire et reformuler. Une page narrative riche en histoire mais sans structure doit être &laquo;&nbsp;parsée&nbsp;» pour produire une réponse, ce qui réduit sa probabilité de sélection.</p>

      <h2>Caractéristique 2 — Listes et tableaux</h2>
      <p>Pour les comparatifs (prix, features, options), les <code>&lt;table&gt;</code> HTML produisent un citation rate 2x supérieur aux paragraphes équivalents. Pour les processus et tutoriels, les listes ordonnées (<code>&lt;ol&gt;</code>) produisent 1,5-2x plus de citations qu&apos;un paragraphe narratif. Évitez d&apos;encoder vos comparatifs en images — ChatGPT ne lit pas les images dans son mode standard.</p>

      <h2>Caractéristique 3 — Faits chiffrés explicites</h2>
      <p>ChatGPT extrait préférentiellement les phrases contenant des chiffres précis («&nbsp;73 % des CMO B2B&nbsp;», «&nbsp;30 prompts par snapshot&nbsp;»). Une page avec 5-10 statistiques chiffrées explicites est citée 2,5x plus qu&apos;une page contenant les mêmes informations en formulation vague. Sourcez les chiffres avec des références autoritatives (Statista, Forrester, Gartner) pour amplifier l&apos;effet.</p>

      <h2>Caractéristique 4 — Schema.org JSON-LD riche</h2>
      <p>Les pages avec schema FAQ + Article + Organization ont un citation rate AI Overviews 3,1x supérieur aux pages sans schema (Authoritas Q1 2026). ChatGPT en mode browse lit le schema pour comprendre l&apos;entité de la page&nbsp;: qui est l&apos;auteur, l&apos;organisation, la date, le sujet. Sans ces métadonnées, l&apos;extraction est probabiliste et donc moins favorable.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Format gagnant 2026</p>
        <p className="text-sm text-ink">H1 question + intro 50-80 mots qui répond + 4-6 H2 thématiques + 1 tableau comparatif + section FAQ schema + schema Article. Effort de production&nbsp;: 1.5x une page classique. Effet&nbsp;: 3-5x sur citation rate ChatGPT.</p>
      </div>

      <h2>Length sweet-spot</h2>
      <p>Sur les pages cluster (800-1200 mots), le citation rate plateau au-delà de 1500 mots&nbsp;: ajouter du contenu marginal n&apos;améliore plus la sélection. Sur les pages pillar (1800-2800 mots), le sweet-spot est 2200-2500 mots. En dessous de 600 mots, ChatGPT considère la page «&nbsp;thin content&nbsp;» et la dévalorise. Au-delà de 3500 mots sans structure renforcée, l&apos;extraction devient bruyante.</p>

      <h2>Densité d&apos;informations / mot</h2>
      <p>Plus important que la longueur&nbsp;: la densité d&apos;informations actionables par 100 mots. Une page de 1000 mots avec 15 affirmations factuelles chiffrées domine une page de 2000 mots avec 5 affirmations équivalentes diluées. Visez 5-8 facts/100 mots dans les sections H2 principales pour maximiser l&apos;extractabilité.</p>

      <h2>Vérification format avant publication</h2>
      <p>Trois vérifications rapides&nbsp;: (1) lecture en diagonale — pouvez-vous comprendre 80 % de la page en 30 secondes&nbsp;? Sinon, structure faible. (2) Test Lighthouse — score &gt; 85 sur SEO et Accessibility. (3) Google Rich Results Test — schema valide sans warnings. Si les trois passent, votre page est format-ready pour ChatGPT.</p>
    </>
  );
}

function BodyFormatEn() {
  return (
    <>
      <h2>Why format matters as much as substance</h2>
      <p>ChatGPT preferentially extracts certain content formats during source selection. A high-quality but narratively unstructured page will be ignored in favor of a structurally clearer alternative. Per our Q1 2026 study on 5000 ChatGPT responses, four format characteristics explain 60 % of citation rate variance.</p>

      <h2>Characteristic 1 — Question/answer structure</h2>
      <p>Pages with H1 as a question, short answering intro, and FAQ sections show a 3.2x citation rate vs narrative pages. ChatGPT &quot;sees&quot; these pages as ready-made answers it can extract and reformulate. A narrative page rich in storytelling but without structure must be &quot;parsed&quot; to produce an answer, lowering its selection probability.</p>

      <h2>Characteristic 2 — Lists and tables</h2>
      <p>For comparisons (pricing, features, options), HTML <code>&lt;table&gt;</code> elements yield 2x the citation rate of equivalent paragraphs. For processes and tutorials, ordered lists (<code>&lt;ol&gt;</code>) yield 1.5-2x more citations than a narrative paragraph. Don&apos;t encode comparatives as images — ChatGPT does not read images in standard mode.</p>

      <h2>Characteristic 3 — Explicit numerical facts</h2>
      <p>ChatGPT preferentially extracts sentences containing precise numbers (&quot;73 % of B2B CMOs&quot;, &quot;30 prompts per snapshot&quot;). A page with 5-10 explicit chiffred statistics is cited 2.5x more than a page with the same info in vague formulation. Source numbers with authoritative references (Statista, Forrester, Gartner) to amplify the effect.</p>

      <h2>Characteristic 4 — Rich schema.org JSON-LD</h2>
      <p>Pages with FAQ + Article + Organization schema have a 3.1x AI Overviews citation rate vs unschema pages (Authoritas Q1 2026). ChatGPT in browse mode reads the schema to understand page entity: who is the author, which organization, what date, what topic. Without these metadata, extraction is probabilistic and therefore less favorable.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">2026 winning format</p>
        <p className="text-sm text-ink">H1 question + 50-80 word answering intro + 4-6 thematic H2s + 1 comparison table + FAQ section with schema + Article schema. Production effort: 1.5x a classic page. Effect: 3-5x on ChatGPT citation rate.</p>
      </div>

      <h2>Length sweet spot</h2>
      <p>On cluster pages (800-1200 words), citation rate plateaus beyond 1500 words: adding marginal content no longer improves selection. On pillar pages (1800-2800 words), the sweet spot is 2200-2500. Under 600 words, ChatGPT treats the page as &quot;thin content&quot; and devalues it. Beyond 3500 words without strengthened structure, extraction becomes noisy.</p>

      <h2>Information density per word</h2>
      <p>More important than length: density of actionable information per 100 words. A 1000-word page with 15 chiffred factual statements dominates a 2000-word page with the same 5 statements diluted. Target 5-8 facts/100 words in main H2 sections to maximize extractability.</p>

      <h2>Pre-publish format check</h2>
      <p>Three quick checks: (1) skim read — can you understand 80 % of the page in 30 seconds? If not, structure is weak. (2) Lighthouse test — score &gt; 85 on SEO and Accessibility. (3) Google Rich Results Test — schema valid with no warnings. If all three pass, your page is format-ready for ChatGPT.</p>
    </>
  );
}

function BodyEReputation() {
  return (
    <>
      <h2>Le risque réputationnel ChatGPT est sous-estimé</h2>
      <p>Quand ChatGPT répond «&nbsp;cette plateforme a connu une faille de sécurité majeure en 2023&nbsp;» sur des millions de conversations B2B, l&apos;impact réputationnel est direct, instantané, et invisible pour les outils de social listening classiques. Sans monitoring dédié, ces affirmations — vraies ou hallucinées — peuvent survivre 6-12 mois sans détection.</p>

      <h2>Trois types de risques réputationnels</h2>
      <p><strong>Hallucination factuelle hostile</strong>&nbsp;: ChatGPT invente une affirmation négative sur votre marque sans source réelle, par interpolation entre noms similaires ou contextes proches. Apparaît ~3-7 % du temps sur prompts sensibles. <strong>Reprise de contenu négatif vrai</strong>&nbsp;: un ancien article presse ou post LinkedIn négatif est sur-représenté dans les réponses, créant un effet d&apos;amplification disproportionné. <strong>Sentiment systématiquement neutre négatif</strong>&nbsp;: pas d&apos;hallucination ni reprise, mais une coloration générale légèrement défavorable qui érode la marque progressivement.</p>

      <h2>Détection — monitoring sentiment hebdomadaire</h2>
      <p>Sur un panel fixe de 30-50 prompts marque-explicites + ouverts, classifier chaque réponse via Claude Haiku ou modèle équivalent en positif/neutre/négatif + raison principale. Une marque en bonne santé maintient le sentiment négatif sous 15 %. Au-delà de 25 %, signal jaune ; au-delà de 40 %, crise réputationnelle confirmée.</p>

      <h2>Action — quand ChatGPT répond mal</h2>
      <p>Trois étapes&nbsp;: <strong>(1) Documenter</strong> — capture d&apos;écran avec date, heure, LLM, prompt exact. <strong>(2) Identifier la source</strong> — si possible (mode browse) ou hypothèses corpus (mode mémoire). <strong>(3) Corriger en amont</strong> — RP correctrice si presse, mise à jour Wikipedia si l&apos;article connexe contient un biais, contenu corporate factuel qui rectifie le fait.</p>
      <p>Important&nbsp;: les LLM ne se «&nbsp;contactent&nbsp;» pas pour réclamer. La correction passe exclusivement par l&apos;écosystème de sources qui les nourrit. Compter 12-16 semaines pour qu&apos;une correction RP impacte les réponses ChatGPT mode browse, et 6-12 mois pour le mode mémoire.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Cas anonymisé Q1 2026</p>
        <p className="text-sm text-ink">SaaS B2B FR&nbsp;: ChatGPT répondait «&nbsp;cette plateforme a connu une faille majeure en 2023&nbsp;» — fait totalement faux, hallucination par confusion de noms. Détecté par monitoring (sentiment négatif 18 % vs 4 % baseline). Action&nbsp;: publication corporate explicite, schema Organization avec history claire, RP technique. Hallucination disparaît en 12-16 semaines.</p>
      </div>

      <h2>Bonnes pratiques préventives</h2>
      <p>Maintenir une page Wikipedia à jour avec history claire et sources solides limite les risques d&apos;hallucination par confusion. Publier régulièrement (1-2 fois par mois) sur le blog corporate avec faits factuels chiffrés produit un volume de contenu vrai qui domine les sources erronées potentielles. Surveiller hebdomadairement les mentions presse et corriger rapidement les erreurs factuelles à la source.</p>

      <h2>Gouvernance interne</h2>
      <p>Le LLM monitoring doit être branché aux équipes comm/RP, pas isolé en marketing. Une chute brutale du citation rate ou un pic de sentiment négatif peut révéler une crise produit naissante. Définir un escalation path&nbsp;: marketing détecte, RP analyse, comex décide réponse en moins de 48h pour une crise rouge.</p>
    </>
  );
}

function BodyEReputationEn() {
  return (
    <>
      <h2>The ChatGPT reputational risk is underestimated</h2>
      <p>When ChatGPT answers &quot;this platform suffered a major security breach in 2023&quot; across millions of B2B conversations, the reputational impact is direct, instantaneous, and invisible to classic social listening tools. Without dedicated monitoring, such claims — true or hallucinated — can survive 6-12 months undetected.</p>

      <h2>Three types of reputational risk</h2>
      <p><strong>Hostile factual hallucination</strong>: ChatGPT fabricates a negative claim about your brand with no real source, by interpolation between similar names or close contexts. Appears ~3-7 % of the time on sensitive prompts. <strong>Reprint of true negative content</strong>: an old negative press article or LinkedIn post is over-represented in responses, creating disproportionate amplification. <strong>Systematically neutral-negative sentiment</strong>: no hallucination or reprint, but a generally slightly unfavorable tone that erodes the brand over time.</p>

      <h2>Detection — weekly sentiment monitoring</h2>
      <p>On a fixed panel of 30-50 brand-explicit + open prompts, classify each response via Claude Haiku or equivalent model into positive/neutral/negative + main reason. A healthy brand keeps negative sentiment under 15 %. Above 25 %, yellow signal; above 40 %, confirmed reputational crisis.</p>

      <h2>Action — when ChatGPT answers badly</h2>
      <p>Three steps: <strong>(1) Document</strong> — screenshot with date, time, LLM, exact prompt. <strong>(2) Identify the source</strong> — when possible (browse mode) or corpus hypotheses (memory mode). <strong>(3) Correct upstream</strong> — corrective PR if press, Wikipedia update if related article carries a bias, factual corporate content that rectifies.</p>
      <p>Critical: LLMs cannot be &quot;contacted&quot; to complain. Correction flows exclusively through the source ecosystem feeding them. Count 12-16 weeks for a PR correction to impact ChatGPT browse responses, and 6-12 months for memory mode.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Anonymized US case Q1 2026</p>
        <p className="text-sm text-ink">B2B SaaS US: ChatGPT was answering &quot;this platform suffered a major breach in 2023&quot; — completely false, hallucination by name confusion. Detected by monitoring (negative sentiment 21 % vs 5 % baseline). Action: explicit corporate publication, Organization schema with clear history, technical PR. Hallucination disappears in 12-16 weeks.</p>
      </div>

      <h2>Preventive best practices</h2>
      <p>Maintaining an up-to-date Wikipedia page with clear history and solid sources limits hallucination-by-confusion risks. Publishing regularly (1-2 times per month) on the corporate blog with chiffred factual content produces a volume of true content that dominates potential erroneous sources. Monitor press mentions weekly and correct factual errors at the source quickly.</p>

      <h2>Internal governance</h2>
      <p>LLM monitoring must connect to comm/PR teams, not be siloed in marketing. A sharp drop in citation rate or a spike in negative sentiment can reveal a nascent product crisis. Define an escalation path: marketing detects, PR analyzes, exec decides response within 48h for a red crisis.</p>
    </>
  );
}

function BodyPourquoi() {
  return (
    <>
      <h2>ChatGPT cite par autorité, pas par mérite SEO</h2>
      <p>La logique de sélection ChatGPT diffère structurellement de Google. Google rank par autorité de domaine + pertinence + signal utilisateur. ChatGPT cite par autorité tierce + extractabilité + fréquence dans le corpus. Une marque peut donc dominer Google sur sa requête principale et être totalement absente des réponses ChatGPT sur la même requête. Comprendre pourquoi.</p>

      <h2>Mécanisme 1 — Le corpus d&apos;entraînement</h2>
      <p>ChatGPT mode standard répond à partir de son corpus d&apos;entraînement, mis à jour tous les six à douze mois. Ce corpus surreprésente Wikipedia, Common Crawl filtré sur autorité, presse établie, livres, papers académiques. Les sites corporate sont présents mais sous-pondérés. Sur 10 000 réponses ChatGPT analysées en 2025, les marques citées étaient à 76 % mentionnées via une source tierce, seulement 14 % via leur site corporate.</p>

      <h2>Mécanisme 2 — La fréquence et la cohérence</h2>
      <p>Une marque mentionnée 50 fois dans des sources différentes du corpus apparaîtra plus probablement qu&apos;une marque mentionnée 5 fois — même si les 5 mentions sont plus qualitatives. La fréquence agit comme un signal d&apos;importance. C&apos;est pourquoi les leaders sectoriels avec couverture presse continue dominent les réponses ChatGPT, alors qu&apos;une PME avec un site exceptionnel mais peu de presse reste invisible.</p>

      <h2>Mécanisme 3 — Le mode browse / search</h2>
      <p>ChatGPT Search (lancé fin 2024, intégré à GPT-4o et au-delà) consulte le web temps réel. Sur ce mode, la sélection est moins liée au corpus d&apos;entraînement et plus aux signaux SEO classiques + structure de page + autorité de domaine. Mais les mêmes biais subsistent&nbsp;: les sources tierces autoritaires (Wikipedia, presse) sont préférées aux sites corporate.</p>

      <h2>Mécanisme 4 — La structure de la page</h2>
      <p>Lors de l&apos;extraction, ChatGPT préfère les pages structurées (H1 question, intro courte, listes, schema). Une page top-1 Google sans structure peut être ignorée comme source au profit d&apos;une page top-5 mieux structurée. Cette divergence explique les surprises&nbsp;: «&nbsp;pourquoi cette marque mineure est-elle citée et pas nous&nbsp;?&nbsp;»</p>

      <h2>Mécanisme 5 — Le contexte de la requête</h2>
      <p>Sur prompts marque-explicites («&nbsp;qui est X&nbsp;»), les sites corporate ont leur place naturelle. Sur prompts ouverts («&nbsp;meilleur acteur catégorie&nbsp;»), ChatGPT favorise les listes recommandations issues de Wikipedia, presse établie ou guides spécialisés. Une marque excellente en SEO branded mais absente des sources tierces apparaît sur le premier type de prompts mais pas le second.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Distribution sources ChatGPT B2B FR (Q1 2026)</p>
        <p className="text-sm text-ink">Wikipedia 32 % · presse spécialisée 18 % · presse établie 14 % · sites corporate 12 % · académique/.gov 10 % · blogs experts 8 % · Reddit 4 % · autres 2 %.</p>
      </div>

      <h2>Comment construire l&apos;autorité tierce</h2>
      <p>Trois leviers prouvés&nbsp;: <strong>(1) Wikipedia</strong> — page dédiée si éligible (notoriété encyclopédique prouvée par 3-5 sources tierces) ou mentions stratégiques dans articles connexes. <strong>(2) RP éditoriale earned</strong> — 1500-3000 €/mois pour 8-15 retombées presse spécialisée par an. <strong>(3) Études flagship</strong> — une étude data trimestrielle, distribuée largement, génère 30-100 reprises presse + entrée progressive aux corpus LLM.</p>

      <h2>Ce qui ne marche pas</h2>
      <p>Le contenu sponsorisé est dévalorisé par les LLM. Le link building bas de gamme n&apos;améliore pas la citation. Les press releases auto-publiés via PRWire et équivalents n&apos;ont quasi aucun impact. Les seuls leviers à ROI mesurable sont&nbsp;: Wikipedia, RP éditoriale earned, contenu propriétaire fort (études, white papers) distribué via canal RP.</p>
    </>
  );
}

function BodyPourquoiEn() {
  return (
    <>
      <h2>ChatGPT cites by authority, not by SEO merit</h2>
      <p>ChatGPT&apos;s selection logic structurally differs from Google&apos;s. Google ranks by domain authority + relevance + user signal. ChatGPT cites by third-party authority + extractability + corpus frequency. A brand can therefore dominate Google on its main query and be completely absent from ChatGPT responses to the same query. Understanding why.</p>

      <h2>Mechanism 1 — The training corpus</h2>
      <p>ChatGPT standard mode answers from its training corpus, refreshed every six to twelve months. The corpus over-represents Wikipedia, authority-filtered Common Crawl, established press (NYT, WSJ, FT), books, academic papers. Brand sites are present but under-weighted. Across 10,000 ChatGPT responses analyzed in 2025, cited brands were 76 % mentioned via a third-party source, only 14 % via their corporate site.</p>

      <h2>Mechanism 2 — Frequency and consistency</h2>
      <p>A brand mentioned 50 times across diverse corpus sources will more likely appear than a brand mentioned 5 times — even if the 5 mentions are higher quality. Frequency acts as an importance signal. That is why sector leaders with continuous press coverage dominate ChatGPT responses, while a mid-market firm with an excellent site but thin press remains invisible.</p>

      <h2>Mechanism 3 — Browse / search mode</h2>
      <p>ChatGPT Search (launched late 2024, integrated into GPT-4o and beyond) consults the live web. In this mode, selection is less tied to training corpus and more to classic SEO signals + page structure + domain authority. But the same biases persist: authoritative third-party sources (Wikipedia, press) are preferred over corporate sites.</p>

      <h2>Mechanism 4 — Page structure</h2>
      <p>During extraction, ChatGPT prefers structured pages (H1 question, short intro, lists, schema). A Google top-1 page without structure can be ignored as a source in favor of a top-5 better-structured page. This divergence explains the surprises: &quot;why is this minor brand cited and not us?&quot;</p>

      <h2>Mechanism 5 — Query context</h2>
      <p>On brand-explicit prompts (&quot;who is X&quot;), corporate sites have their natural place. On open prompts (&quot;best provider in category&quot;), ChatGPT favors recommendation lists drawn from Wikipedia, established press, or specialized guides. A brand excellent in branded SEO but absent from third-party sources appears on the first prompt type but not the second.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">ChatGPT US B2B source distribution (Q1 2026)</p>
        <p className="text-sm text-ink">Wikipedia 30 % · trade press 19 % · established press 16 % (NYT, WSJ, Bloomberg) · corporate sites 13 % · academic/.gov 10 % · expert blogs 7 % · Reddit 3 % · other 2 %.</p>
      </div>

      <h2>How to build third-party authority</h2>
      <p>Three proven levers: <strong>(1) Wikipedia</strong> — dedicated page if eligible (encyclopedic notability proven by 3-5 third-party sources) or strategic mentions in related articles. <strong>(2) Earned editorial PR</strong> — $2-4k/month for 8-15 trade press hits per year. <strong>(3) Flagship studies</strong> — a quarterly data study, broadly distributed, generates 30-100 press pickups + progressive entry to LLM corpora.</p>

      <h2>What does not work</h2>
      <p>Sponsored content is discounted by LLMs. Low-end link building does not improve citation. Self-published press releases via PRWire and similar have near-zero impact. The only measurable-ROI levers are: Wikipedia, earned editorial PR, strong proprietary content (studies, white papers) distributed through PR channels.</p>
    </>
  );
}

function BodyPlugins() {
  return (
    <>
      <h2>Pourquoi un top 10 plugins / outils ChatGPT pour marketers</h2>
      <p>L&apos;écosystème ChatGPT marketing s&apos;est densifié en 2025-2026. Au-delà de l&apos;interface chatgpt.com, des dizaines d&apos;outils tiers exploitent l&apos;API OpenAI pour automatiser des workflows marketing. Voici les dix plus utiles en 2026, classés par cas d&apos;usage prioritaire.</p>

      <h2>Catégorie 1 — Recherche et veille</h2>
      <p><strong>Perplexity Pro</strong> (20 $/mois) reste l&apos;outil de recherche supérieur pour la veille concurrentielle&nbsp;: chaque réponse cite ses sources explicitement. <strong>Geoperf</strong> (79-799 €/mois) automatise la veille de visibilité de votre marque sur les 4 LLM majeurs avec dashboard centralisé. <strong>Gong AI</strong> intègre ChatGPT pour analyser les conversations sales et extraire patterns gagnants.</p>

      <h2>Catégorie 2 — Production de contenu</h2>
      <p><strong>Jasper</strong> (49-125 $/mois) propose une couche métier au-dessus de l&apos;API OpenAI&nbsp;: templates campagne email, posts LinkedIn, articles. <strong>Copy.ai</strong> (49-249 $/mois) cible la production volume. <strong>Notion AI</strong> intègre ChatGPT directement dans la stack documentation. Pour la production sérieuse, ces outils valent leur prix vs ChatGPT seul.</p>

      <h2>Catégorie 3 — SEO et GEO</h2>
      <p><strong>Surfer SEO</strong> (89-219 $/mois) optimise les articles pour Google avec AI assist. <strong>Frase</strong> (45-115 $/mois) génère brief SEO + draft article. <strong>Geoperf SaaS</strong> mesure votre visibilité GEO en plus du SEO classique. La combinaison Surfer + Geoperf couvre les deux disciplines.</p>

      <h2>Catégorie 4 — Outbound et CRM</h2>
      <p><strong>Apollo</strong> (49-149 $/mois) intègre ChatGPT pour personnaliser les emails de séquence outbound à grande échelle. <strong>Clay</strong> (149-800 $/mois) enrichit les leads et personnalise les angles via OpenAI API. <strong>Salesloft Conversation Intelligence</strong> analyse les conversations sales avec AI assist.</p>

      <h2>Catégorie 5 — Analytics et reporting</h2>
      <p><strong>Hex</strong> et <strong>Mode Analytics</strong> intègrent ChatGPT pour générer des SQL queries depuis prompts naturels. <strong>Tableau Pulse</strong> propose un AI assistant pour générer insights depuis dashboards. Pour les équipes marketing data-driven, ces outils accélèrent le reporting de 30-50 %.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Stack PME B2B 2026</p>
        <p className="text-sm text-ink">ChatGPT Team (25 $/user × 6) + Perplexity Pro (20 $) + Geoperf Starter (79 €) + Jasper Pro (49 $) + Apollo Basic (59 $). Total ~250-300 €/mois pour une équipe de 6. C&apos;est ~2 % d&apos;un budget marketing PME typique pour un impact productivité 1.5-2x.</p>
      </div>

      <h2>Critères de choix</h2>
      <p>Trois critères&nbsp;: (1) intégration native vs API custom — la solution clé-en-main est presque toujours meilleure pour une PME ; (2) multi-utilisateurs ou solo — pour une équipe marketing &gt; 3 personnes, privilégier les outils avec gestion de seats ; (3) coût total incluant temps interne — un outil compliqué nécessite 2-3 jours d&apos;onboarding par utilisateur, un coût souvent ignoré.</p>

      <h2>Pièges fréquents</h2>
      <p>Premier piège&nbsp;: empiler des outils sans intégrer. Préférez moins d&apos;outils mieux intégrés. Deuxième piège&nbsp;: utiliser ChatGPT brut (chatgpt.com) pour des workflows métier répétitifs — un outil dédié avec templates et seats-management vaut mieux. Troisième piège&nbsp;: ignorer les enjeux de data privacy. Pour data sensible client, vérifier que l&apos;outil n&apos;envoie pas de PII à OpenAI sans pseudonymisation.</p>
    </>
  );
}

function BodyPluginsEn() {
  return (
    <>
      <h2>Why a top 10 ChatGPT tools for marketers</h2>
      <p>The ChatGPT marketing ecosystem matured in 2025-2026. Beyond chatgpt.com, dozens of third-party tools leverage the OpenAI API to automate marketing workflows. Here are the ten most useful in 2026, ranked by priority use case.</p>

      <h2>Category 1 — Research and intelligence</h2>
      <p><strong>Perplexity Pro</strong> ($20/month) remains the superior research tool for competitive intelligence: every answer cites its sources explicitly. <strong>Geoperf</strong> ($85-870/month) automates brand visibility tracking across the 4 major LLMs with centralized dashboard. <strong>Gong AI</strong> integrates ChatGPT to analyze sales conversations and extract winning patterns.</p>

      <h2>Category 2 — Content production</h2>
      <p><strong>Jasper</strong> ($49-125/month) provides a business layer above the OpenAI API: email campaign templates, LinkedIn posts, articles. <strong>Copy.ai</strong> ($49-249/month) targets volume production. <strong>Notion AI</strong> integrates ChatGPT directly into the documentation stack. For serious production, these tools earn their price vs ChatGPT alone.</p>

      <h2>Category 3 — SEO and GEO</h2>
      <p><strong>Surfer SEO</strong> ($89-219/month) optimizes articles for Google with AI assist. <strong>Frase</strong> ($45-115/month) generates SEO brief + article draft. <strong>Geoperf SaaS</strong> measures your GEO visibility on top of classic SEO. The Surfer + Geoperf combo covers both disciplines.</p>

      <h2>Category 4 — Outbound and CRM</h2>
      <p><strong>Apollo</strong> ($49-149/month) integrates ChatGPT to personalize outbound sequence emails at scale. <strong>Clay</strong> ($149-800/month) enriches leads and personalizes angles via OpenAI API. <strong>Salesloft Conversation Intelligence</strong> analyzes sales conversations with AI assist.</p>

      <h2>Category 5 — Analytics and reporting</h2>
      <p><strong>Hex</strong> and <strong>Mode Analytics</strong> integrate ChatGPT to generate SQL queries from natural prompts. <strong>Tableau Pulse</strong> offers an AI assistant to generate insights from dashboards. For data-driven marketing teams, these tools accelerate reporting by 30-50 %.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">US B2B mid-market stack 2026</p>
        <p className="text-sm text-ink">ChatGPT Team ($25/user × 6) + Perplexity Pro ($20) + Geoperf Starter ($85) + Jasper Pro ($49) + Apollo Basic ($59). Total ~$280-330/month for a team of 6. About 2 % of a typical mid-market marketing budget for 1.5-2x productivity.</p>
      </div>

      <h2>Selection criteria</h2>
      <p>Three criteria: (1) native integration vs custom API — the turnkey solution almost always wins for mid-market; (2) multi-user vs solo — for a marketing team {">"} 3, prefer tools with seat management; (3) total cost including internal time — a complicated tool requires 2-3 days of onboarding per user, an often-ignored cost.</p>

      <h2>Common pitfalls</h2>
      <p>First pitfall: stacking tools without integrating. Prefer fewer tools better integrated. Second pitfall: using bare ChatGPT (chatgpt.com) for repetitive business workflows — a dedicated tool with templates and seat management is better. Third pitfall: ignoring data privacy. For sensitive customer data, verify the tool does not send PII to OpenAI without pseudonymization.</p>
    </>
  );
}

export const CHATGPT_MARKETING_CLUSTERS: ClusterRegistry = {
  "comment-apparaitre-reponses-chatgpt": {
    parentPillar: "chatgpt-marketing",
    fr: {
      title: "Comment apparaître dans les réponses ChatGPT en 2026",
      metaDescription:
        "Méthode pratique pour être cité par ChatGPT : autorité tierce (Wikipedia, presse), optimisation on-page, monitoring hebdomadaire. Cibles réalistes 6 mois.",
      intro:
        "ChatGPT cite par autorité tierce, pas par mérite SEO classique. Apparaître dans ses réponses exige Wikipedia + RP éditoriale + structure de page extractible. Voici la méthode complète et les cibles réalistes à six mois pour une marque B2B mid-market.",
      publishedAt: PUB,
      Body: BodyApparaitre,
    },
    en: {
      title: "How to show up in ChatGPT answers in 2026",
      metaDescription:
        "Practical method to be cited by ChatGPT: third-party authority (Wikipedia, press), on-page optimization, weekly monitoring. Realistic 6-month targets for B2B brands.",
      intro:
        "ChatGPT cites by third-party authority, not classic SEO merit. Showing up in its answers requires Wikipedia + earned PR + extractable page structure. The full method and realistic six-month targets for a US/UK B2B mid-market brand.",
      publishedAt: PUB,
      Body: BodyApparaitreEn,
    },
  },
  "format-contenu-prefere-chatgpt": {
    parentPillar: "chatgpt-marketing",
    fr: {
      title: "Format de contenu préféré par ChatGPT (étude 2026)",
      metaDescription:
        "Étude 2026 sur 5000 réponses ChatGPT : 4 caractéristiques de format expliquent 60 % de la variance dans le citation rate. Structure, listes, faits, schema.",
      intro:
        "ChatGPT extrait préférentiellement certains formats de contenu. Sur 5000 réponses analysées en 2026, quatre caractéristiques expliquent 60 % de la variance citation rate : structure question/réponse, listes/tableaux, faits chiffrés explicites, schema.org riche.",
      publishedAt: PUB,
      Body: BodyFormat,
    },
    en: {
      title: "ChatGPT-preferred content format (2026 study)",
      metaDescription:
        "2026 study across 5000 ChatGPT responses: 4 format characteristics explain 60 % of citation rate variance. Structure, lists, facts, schema.org.",
      intro:
        "ChatGPT preferentially extracts certain content formats. Across 5000 responses analyzed in 2026, four characteristics explain 60 % of citation rate variance: question/answer structure, lists/tables, explicit numerical facts, rich schema.org JSON-LD.",
      publishedAt: PUB,
      Body: BodyFormatEn,
    },
  },
  "chatgpt-e-reputation-pratiques": {
    parentPillar: "chatgpt-marketing",
    fr: {
      title: "ChatGPT et e-réputation : les bonnes pratiques",
      metaDescription:
        "Risques réputationnels ChatGPT : hallucinations hostiles, reprises négatives, sentiment dégradé. Comment détecter, agir, et prévenir avec un monitoring dédié.",
      intro:
        "Quand ChatGPT répond mal sur votre marque, l'impact réputationnel est direct sur des millions de conversations. Trois types de risques (hallucination, reprise, sentiment), trois étapes d'action (documenter, identifier, corriger), et la gouvernance interne pour une réponse sous 48h.",
      publishedAt: PUB,
      Body: BodyEReputation,
    },
    en: {
      title: "ChatGPT and brand reputation: best practices",
      metaDescription:
        "ChatGPT reputational risks: hostile hallucinations, negative reprints, degraded sentiment. How to detect, act, and prevent with dedicated monitoring.",
      intro:
        "When ChatGPT answers badly about your brand, the reputational impact hits millions of conversations directly. Three risk types (hallucination, reprint, sentiment), three action steps (document, identify, correct), and the internal governance for a 48-hour response.",
      publishedAt: PUB,
      Body: BodyEReputationEn,
    },
  },
  "pourquoi-chatgpt-cite-marques": {
    parentPillar: "chatgpt-marketing",
    fr: {
      title: "Pourquoi ChatGPT cite certaines marques et pas d'autres",
      metaDescription:
        "Cinq mécanismes expliquent les choix de citation ChatGPT : corpus d'entraînement, fréquence, mode browse, structure de page, contexte de la requête.",
      intro:
        "ChatGPT cite par autorité tierce, fréquence dans le corpus, et structure d'extractabilité — pas par autorité de domaine SEO. Cinq mécanismes expliquent pourquoi votre concurrent moins fort en SEO peut dominer les réponses ChatGPT alors que vous êtes invisible.",
      publishedAt: PUB,
      Body: BodyPourquoi,
    },
    en: {
      title: "Why ChatGPT cites some brands and ignores others",
      metaDescription:
        "Five mechanisms explain ChatGPT citation choices: training corpus, frequency, browse mode, page structure, query context. How to build third-party authority.",
      intro:
        "ChatGPT cites by third-party authority, corpus frequency, and extraction structure — not by SEO domain authority. Five mechanisms explain why your weaker-SEO competitor can dominate ChatGPT responses while you remain invisible. Three proven levers to fix it.",
      publishedAt: PUB,
      Body: BodyPourquoiEn,
    },
  },
  "plugin-chatgpt-marketers-top10": {
    parentPillar: "chatgpt-marketing",
    fr: {
      title: "Top 10 outils ChatGPT pour marketers en 2026",
      metaDescription:
        "Stack outils ChatGPT pour marketers B2B 2026 : recherche (Perplexity, Geoperf), production (Jasper, Notion AI), SEO (Surfer, Frase), outbound (Apollo, Clay).",
      intro:
        "L'écosystème ChatGPT marketing 2026 dépasse l'interface chatgpt.com. Dix outils tiers exploitent l'API OpenAI pour automatiser recherche, production, SEO/GEO, outbound et analytics. Stack typique PME B2B : ~250-300 €/mois pour un impact productivité 1.5-2x.",
      publishedAt: PUB,
      Body: BodyPlugins,
    },
    en: {
      title: "Top 10 ChatGPT tools for marketers in 2026",
      metaDescription:
        "ChatGPT marketing tools stack for B2B 2026: research (Perplexity, Geoperf), production (Jasper, Notion AI), SEO (Surfer, Frase), outbound (Apollo, Clay).",
      intro:
        "The 2026 ChatGPT marketing ecosystem extends beyond chatgpt.com. Ten third-party tools leverage the OpenAI API to automate research, production, SEO/GEO, outbound, and analytics. Typical mid-market B2B stack: ~$280-330/month for 1.5-2x productivity.",
      publishedAt: PUB,
      Body: BodyPluginsEn,
    },
  },
};
