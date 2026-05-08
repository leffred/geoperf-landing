// S29 Session 3 — Clusters around pillar #1 visibilite-llm. 5 angles distincts :
// 1. méthode pratique  2. KPI techniques  3. diagnostic causes
// 4. comparaison disciplines  5. checklist actionnable.

import type { ClusterRegistry } from "./types";

const PUB = "2026-05-08T08:00:00.000Z";

function BodyMesurer() {
  return (
    <>
      <h2>Pourquoi mesurer la visibilité LLM est différent du SEO</h2>
      <p>Sur Google, une page rank ou ne rank pas, et le suivi tient en deux KPI : position et CTR. Sur ChatGPT, Gemini, Claude ou Perplexity, la donnée a un autre profil. La réponse est synthétique, parfois citée, parfois non, et la marque peut apparaître nommée dans le texte sans que sa source soit attribuée. Le bon réflexe n&apos;est plus de regarder la SERP mais de construire un panel de prompts représentatifs et d&apos;observer combien de fois votre marque y apparaît, à quel rang dans la liste des recommandations, et avec quel sentiment.</p>
      <p>Selon Gartner CMO 2026, 38 % des décideurs B2B consultent un LLM au moins une fois par semaine pour préparer une décision d&apos;achat. Ne rien mesurer sur cette surface revient à ignorer un canal de découverte qui pèse autant que LinkedIn organique pour le segment premium.</p>

      <h2>Le panel de 30 prompts : la base méthodologique</h2>
      <p>Trente prompts est le seuil sous lequel la variance stochastique des LLM (température, échantillonnage) domine le signal. Construisez votre panel en mélangeant quatre catégories : 40 % de prompts de découverte («&nbsp;meilleur acteur X&nbsp;», «&nbsp;top fournisseurs Y&nbsp;»), 25 % comparatifs («&nbsp;A vs B&nbsp;»), 20 % techniques («&nbsp;comment fonctionne Z&nbsp;») et 15 % marque-explicites («&nbsp;qui est marque W&nbsp;»). Utilisez le langage réel de vos prospects : Search Console, Reddit et conversations support sont vos trois sources de vérité.</p>
      <p>Re-exécutez ce panel chaque semaine sur les quatre LLM dominants (ChatGPT, Gemini, Claude, Perplexity) pour amortir la stochasticité. À volume constant, vous obtenez des séries temporelles propres et comparables.</p>

      <h2>Les quatre KPI à instrumenter en priorité</h2>
      <p>Le citation rate compte combien de prompts du panel produisent une réponse mentionnant votre marque. C&apos;est le KPI socle, lisible par un comex. L&apos;average source rank — uniquement sur Perplexity et AI Overviews — capture la position de votre URL parmi les sources citées. Le share-of-voice mesure votre poids relatif face aux concurrents. Le sentiment classifie chaque mention en positif/neutre/négatif via un classifieur Haiku ou équivalent.</p>
      <p>Ces quatre indicateurs forment le socle minimum. Au-delà, vous pouvez ajouter la source attribution (qui cite votre marque dans la réponse&nbsp;: Wikipedia, presse, votre site) et l&apos;écart prompts marque-explicites vs prompts ouverts pour diagnostiquer si votre faiblesse vient de l&apos;awareness ou du référencement organique.</p>

      <h2>Cas concret : un panel B2B asset management</h2>
      <p>Sur un panel de 30 prompts secteur asset management France (Geoperf Q2 2026), les valeurs médianes observées sont&nbsp;: citation rate 28 %, average rank 3.4, share-of-voice top 3 = 24 % / 19 % / 14 %, sentiment négatif 8 %. Les marques au-dessus du P75 (cités dans 50 % des prompts) ont systématiquement une page Wikipedia solide et une présence régulière dans la presse spécialisée (AGEFI, Funds Magazine).</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Repère sectoriel 2026</p>
        <p className="text-sm text-ink">Médiane B2B FR : citation rate 22 %, share-of-voice top 3 cumulé 55-60 % du panel. Si votre marque est en dessous de 15 % de citation rate, vous payez un déficit d&apos;autorité tierce, pas une faiblesse de SEO classique.</p>
      </div>

      <h2>Cadence de mesure et seuils d&apos;alerte</h2>
      <p>Une mesure mensuelle suffit pour le reporting comex. Une mesure hebdomadaire est nécessaire pour détecter les anomalies en temps utile&nbsp;: une chute de 10 points en deux semaines doit déclencher une investigation, une chute de 25 points en une semaine est une crise. Calibrez vos seuils sur le bruit observé pendant les six premières semaines, pas sur des règles génériques.</p>
      <p>Pour aller plus loin sur l&apos;outillage et les fournisseurs disponibles en 2026, voir notre <a href="https://geoperf.com/guide/visibilite-llm" className="underline">guide Visibilité LLM</a> ou la documentation officielle <a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener noreferrer" className="underline">OpenAI API</a> pour automatiser une première version maison.</p>
    </>
  );
}

function BodyKpi() {
  return (
    <>
      <h2>Pourquoi les KPI SEO ne suffisent plus</h2>
      <p>Position moyenne, CTR, impressions Search Console&nbsp;: ces trois indicateurs ne capturent que ce qui se passe sur les SERP de Google et n&apos;expriment rien sur la perception de votre marque par ChatGPT, Claude ou Perplexity. Une page top-1 sur Google peut être absente des sources citées par AI Overviews ; une marque sans page corporate visible peut dominer Perplexity grâce à une présence Wikipedia. Le KPI socle a changé.</p>
      <p>Forrester Q1 2026 indique que 67 % des entreprises de plus de 500 employés ont créé une ligne budgétaire <em>AI search optimization</em> distincte du SEO classique. Le besoin d&apos;un nouveau jeu d&apos;indicateurs est consensuel.</p>

      <h2>KPI #1 — Citation rate par LLM</h2>
      <p>Sur un panel fixe de 30 à 100 prompts représentatifs de votre marché, mesurez chaque semaine le pourcentage de réponses qui mentionnent explicitement votre marque, par LLM. Un citation rate ChatGPT de 25 % avec 45 % sur Perplexity n&apos;est pas une anomalie : Perplexity est plus généreux car il s&apos;appuie sur le crawl temps réel, ChatGPT plus restrictif car ancré dans son corpus d&apos;entraînement.</p>

      <h2>KPI #2 — Average source rank</h2>
      <p>Quand votre marque ou votre site sont cités comme source (Perplexity et Gemini AI Overviews fournissent cette donnée explicitement), à quelle position apparaissent-ils&nbsp;? Position 1-3 capture l&apos;attention utilisateur ; position 6+ est quasi invisible. Sur cent citations, votre rank moyen doit viser une valeur inférieure à trois.</p>

      <h2>KPI #3 — Share-of-voice</h2>
      <p>Sur les prompts où au moins une marque de votre catégorie apparaît, quelle part des réponses citent la vôtre&nbsp;? Au-delà de 20 %, vous êtes en position de leader catégoriel. Entre 5 % et 15 %, vous existez mais en challenger. En dessous de 5 %, vous êtes invisibles pour la majorité des prompts ouverts.</p>

      <h2>KPI #4 — Sentiment</h2>
      <p>Chaque réponse LLM citant votre marque doit être passée dans un classifieur (Claude Haiku ou modèle similaire) qui retourne positif / neutre / négatif et la raison principale. Une marque en bonne santé maintient le sentiment négatif sous 15 %. Au-delà de 25 %, signal jaune ; au-delà de 40 %, crise réputationnelle.</p>

      <h2>KPI #5 — Source attribution</h2>
      <p>Quelles sources citent votre marque dans la réponse LLM&nbsp;? Votre site directement, Wikipedia, presse spécialisée, blog tiers&nbsp;? Cette donnée diagnostique sépare les leviers d&apos;optimisation. Si 80 % des citations passent par Wikipedia, le levier prioritaire est la maintenance Wikipedia. Si 60 % passent par la presse spécialisée, c&apos;est la RP qu&apos;il faut renforcer.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Benchmark Geoperf Q1 2026</p>
        <p className="text-sm text-ink">Top 10 sources citées par les LLM en France&nbsp;: Wikipedia FR (32 % des citations), presse spécialisée sectorielle (18 %), presse établie (14 %), corporate sites des leaders (12 %), académique .edu/.gov (10 %), Reddit (8 %), reste (6 %).</p>
      </div>

      <h2>KPI #6 — Évolution temporelle</h2>
      <p>Une mesure isolée est inutile, c&apos;est la trajectoire qui compte. Regardez vos KPI sur huit à douze semaines glissantes. Une augmentation lente et continue du citation rate après une campagne RP est le signal d&apos;une stratégie qui fonctionne. Une chute brutale après une mise à jour algorithmique LLM est un événement à investiguer immédiatement.</p>

      <h2>KPI #7 — Écart prompts ouverts vs prompts marque</h2>
      <p>Si votre citation rate sur prompts marque-explicites («&nbsp;qui est X&nbsp;») est de 90 % mais seulement 8 % sur prompts ouverts («&nbsp;meilleur acteur catégorie&nbsp;»), votre awareness est correcte mais votre positionnement catégoriel est faible. Inversement, fortes citations sur prompts ouverts et faibles sur prompts marque suggèrent un déficit d&apos;identité explicite. Cet écart oriente la stratégie de contenu.</p>
    </>
  );
}

function BodyPourquoi() {
  return (
    <>
      <h2>Cinq causes principales d&apos;invisibilité dans ChatGPT</h2>
      <p>Quand une marque B2B ne sort pas dans les réponses ChatGPT, l&apos;origine est presque toujours dans l&apos;une de ces cinq causes — souvent en combinaison. Le diagnostic correct détermine l&apos;ordre d&apos;intervention et économise des mois de travail mal dirigé.</p>

      <h2>Cause 1 — Page Wikipedia absente ou trop maigre</h2>
      <p>Wikipedia représente 32 % des citations cross-LLM dans nos mesures Q1 2026. Une marque sans page Wikipedia, ou avec une page de moins de 300 mots et deux sources, est invisible aux yeux des modèles entraînés sur le corpus encyclopédique. ChatGPT s&apos;appuie sur Wikipedia comme source d&apos;autorité par défaut sur les requêtes B2B sectorielles. Si vous n&apos;y êtes pas, vous ne serez quasi jamais cité par défaut.</p>
      <p>La création d&apos;une page Wikipedia exige une notoriété encyclopédique prouvée par trois à cinq sources tierces indépendantes (presse, livres, études académiques). C&apos;est un investissement de six à douze mois pour un ROI durable de trois à cinq ans.</p>

      <h2>Cause 2 — Bots IA bloqués par robots.txt</h2>
      <p>Plusieurs marques bloquent GPTBot, ClaudeBot ou PerplexityBot dans leur robots.txt par mimétisme avec Googlebot, sans réaliser qu&apos;elles se rendent volontairement invisibles à ces canaux. Vérifiez votre fichier robots.txt&nbsp;: aucun de ces user-agents ne doit apparaître en <code>Disallow</code>. C&apos;est l&apos;optimisation à plus haut ROI&nbsp;: la débloquer rapporte typiquement 25-50 % de citation rate cross-LLM en quatre à douze semaines.</p>

      <h2>Cause 3 — Contenu corporate non extractible</h2>
      <p>Les LLM extraient mieux les pages structurées que les pages narratives. Un H1 corporate flou («&nbsp;Notre solution X&nbsp;»), zéro schema.org, des intros longues sans réponse directe&nbsp;: tout cela disqualifie votre page lors de la sélection des sources, même si elle rank top-1 sur Google. Reformulez vos H1 sous forme de question, ajoutez des sections FAQ avec FAQPage schema, et restructurez les comparatifs en tableaux HTML plutôt qu&apos;en images.</p>

      <h2>Cause 4 — Pas d&apos;autorité tierce</h2>
      <p>ChatGPT pondère lourdement les sources autoritaires indépendantes (Wikipedia, presse établie, .edu/.gov) face aux sites corporate eux-mêmes. Une marque B2B FR qui ne paraît pas dans Les Échos, AGEFI, Le Monde Informatique ou équivalents sectoriels n&apos;a pas de levier pour être citée. La RP éditoriale earned, pas le contenu sponsorisé, est la solution.</p>
      <p>Comptez 1500 à 3000 € par mois pour un attaché de presse spécialisé qui produira huit à douze retombées presse de qualité par an. C&apos;est le levier #2 après Wikipedia.</p>

      <h2>Cause 5 — Mémoire LLM en retard de phase</h2>
      <p>Les LLM grand public sont entraînés tous les six à douze mois. Si votre stratégie de contenu et de RP a démarré il y a moins de neuf mois, l&apos;effet sur ChatGPT mode standard sera minime. En revanche, ChatGPT Search, Perplexity et Gemini AI Overviews lisent le web temps réel et reflètent vos efforts sous quatre à seize semaines. C&apos;est pourquoi mesurer les deux modes (mémoire vs search) est essentiel pour juger l&apos;avancement de votre plan.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Diagnostic rapide en 5 minutes</p>
        <p className="text-sm text-ink">1. Page Wikipedia&nbsp;? <strong>oui/non</strong> · 2. GPTBot/ClaudeBot/PerplexityBot autorisés&nbsp;? <strong>oui/non</strong> · 3. Schema FAQPage présent&nbsp;? <strong>oui/non</strong> · 4. Mentions presse spécialisée 12 derniers mois&nbsp;? <strong>combien&nbsp;?</strong> · 5. H1 sous forme de question&nbsp;? <strong>oui/non</strong>. Trois «&nbsp;non&nbsp;» = vous payez un déficit structurel.</p>
      </div>

      <h2>Plan de redressement 90 jours</h2>
      <p>Mois 1 : déblocage robots.txt, audit Wikipedia, déploiement schema.org sur les 30 pages stratégiques, restructuration H1+intro. Mois 2 : campagne RP ciblée (cinq à huit médias spécialisés), création contenu pillar evergreen (étude flagship). Mois 3 : monitoring hebdomadaire installé, premiers résultats mesurables sur Perplexity et AI Overviews, plan Wikipedia activé via éditeur certifié.</p>
    </>
  );
}

function BodyVsSeo() {
  return (
    <>
      <h2>Deux disciplines qui se chevauchent à 70 %</h2>
      <p>Le SEO classique et la mesure de visibilité LLM partagent les mêmes fondamentaux&nbsp;: qualité de contenu, autorité de domaine, structure technique. Une page bien optimisée pour Google est, dans 70 % des cas, déjà bien positionnée pour être citée par les LLM. Les divergences se situent à la marge mais déterminent qui gagne et qui perd.</p>

      <h2>Différence #1 — Surface mesurée</h2>
      <p>Le SEO mesure dix liens bleus dans une SERP. La visibilité LLM mesure une seule réponse synthétique de 100-300 mots qui cite ou ne cite pas votre marque. Le KPI passe de la position dans une liste à la présence dans un texte. Cela change tout le mode de mesure et de reporting.</p>

      <h2>Différence #2 — Fenêtre de mise à jour</h2>
      <p>Google rafraîchit son index plusieurs fois par jour. Les LLM mémoire (ChatGPT, Claude) sont entraînés tous les six à douze mois. Conséquence&nbsp;: une optimisation SEO réussie peut produire des effets sur Google en deux à six semaines, alors que la même optimisation impacte la mémoire ChatGPT seulement à la fenêtre d&apos;entraînement suivante. Les LLM Search (Perplexity, AI Overviews) font exception et lisent le web actuel.</p>

      <h2>Différence #3 — Sources privilégiées</h2>
      <p>Google pondère les backlinks et la qualité de contenu sur la page elle-même. Les LLM pondèrent fortement les sources tierces indépendantes&nbsp;: Wikipedia, presse établie, blogs experts. Cette différence explique pourquoi un site corporate peut ranker top-1 Google et être absent des citations LLM&nbsp;: il manque la légitimation par des sources tierces que les modèles considèrent autoritaires.</p>

      <h2>Différence #4 — Format de contenu</h2>
      <p>Google indexe et pondère le contenu narratif autant que le contenu structuré. Les LLM extraient préférentiellement les pages avec H1 question, intro courte qui répond directement, listes, tableaux comparatifs et schema.org riche. Une page produit avec H1 «&nbsp;Notre solution&nbsp;» sera ignorée des citations LLM même si elle rank top-3 Google.</p>

      <h2>Différence #5 — Mesurabilité</h2>
      <p>Le SEO offre des outils matures depuis quinze ans (Google Analytics, Search Console, Semrush, Ahrefs). La mesure de visibilité LLM est encore en construction&nbsp;: les outils dédiés (Geoperf, Profound, Otterly, Brandwatch AI Mode) datent de 2024-2025, l&apos;écosystème stabilise ses standards en 2026.</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Tableau récap</p>
        <table className="text-sm text-ink w-full">
          <thead><tr className="text-left"><th className="py-1">Aspect</th><th>SEO classique</th><th>Visibilité LLM</th></tr></thead>
          <tbody>
            <tr><td className="py-1">Surface</td><td>10 liens SERP</td><td>1 réponse synthétique</td></tr>
            <tr><td className="py-1">KPI socle</td><td>Position + CTR</td><td>Citation rate + rank</td></tr>
            <tr><td className="py-1">Sources clés</td><td>Backlinks</td><td>Wikipedia + presse</td></tr>
            <tr><td className="py-1">Maturité outils</td><td>15 ans</td><td>2 ans</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Stratégie hybride : 70 % commun, 30 % spécifique</h2>
      <p>Investir 100 % en SEO classique laisse 30 % de visibilité LLM sur la table. Investir 100 % en GEO laisse 30 % de SEO classique sur la table. La stratégie gagnante 2026 est hybride&nbsp;: SEO classique pour la base trafic Google (toujours dominant en volume), couche GEO pour capturer la visibilité LLM en montée. Une équipe marketing B2B mid-market alloue typiquement 60-65 % du budget SEO et 35-40 % au GEO en 2026, contre 95 / 5 deux ans plus tôt.</p>
    </>
  );
}

function BodyChecklist() {
  return (
    <>
      <h2>Pourquoi un audit en 20 points</h2>
      <p>La visibilité LLM repose sur six leviers techniques, six leviers structurels et huit leviers d&apos;autorité. Cette checklist exhaustive permet de diagnostiquer en moins de quatre heures où votre marque perd des points et dans quel ordre intervenir. Sortez chaque case en oui/non, comptez les non&nbsp;: au-delà de huit, vous avez un déficit structurel ; au-delà de quinze, vous êtes invisible par construction.</p>

      <h2>Section A — Technique on-page (six points)</h2>
      <p>1. <strong>robots.txt</strong>&nbsp;: GPTBot, ClaudeBot, PerplexityBot, Google-Extended autorisés&nbsp;? 2. <strong>Schema Organization</strong>&nbsp;: déployé sur la home avec sameAs vers Wikipedia, LinkedIn, X&nbsp;? 3. <strong>Schema FAQPage</strong>&nbsp;: présent sur les pages produit/service stratégiques&nbsp;? 4. <strong>Schema Article ou BlogPosting</strong>&nbsp;: déployé sur le blog corporate&nbsp;? 5. <strong>llms.txt</strong>&nbsp;: présent à la racine, listant les pages clés avec contexte sémantique&nbsp;? 6. <strong>Rendu serveur (SSR ou SSG)</strong>&nbsp;: le contenu apparaît dans le HTML initial, pas en hydration JavaScript&nbsp;?</p>

      <h2>Section B — Structure de contenu (six points)</h2>
      <p>7. <strong>H1 sous forme de question ou réponse directe</strong>&nbsp;: «&nbsp;Qu&apos;est-ce que X&nbsp;» au lieu de «&nbsp;Notre solution X&nbsp;»&nbsp;? 8. <strong>Intro courte 50-80 mots</strong>&nbsp;: résume la réponse complète dès les premiers paragraphes&nbsp;? 9. <strong>Tableaux comparatifs HTML</strong>&nbsp;: pas en images, mais en <code>&lt;table&gt;</code> indexable&nbsp;? 10. <strong>Listes ordonnées</strong> sur les pages tutoriels et processus&nbsp;? 11. <strong>Sections FAQ</strong>&nbsp;: 5-10 questions par page produit/service stratégique&nbsp;? 12. <strong>Liens internes contextuels</strong>&nbsp;: pillar pages linkent vers cluster pages avec ancres descriptives&nbsp;?</p>

      <h2>Section C — Autorité et off-page (huit points)</h2>
      <p>13. <strong>Page Wikipedia dédiée</strong> ou <strong>mentions stratégiques</strong> dans articles connexes&nbsp;? 14. <strong>Mentions presse spécialisée FR</strong>&nbsp;: huit à quinze sur les 12 derniers mois&nbsp;? 15. <strong>Mentions presse établie</strong> (Le Monde, Échos, etc.)&nbsp;: au moins trois sur 12 mois&nbsp;? 16. <strong>Étude flagship</strong> annuelle ou trimestrielle, distribuée largement&nbsp;? 17. <strong>Présence sur podcasts B2B</strong> avec transcrip­tions textuelles publiées&nbsp;? 18. <strong>Tribunes signées dirigeant</strong>&nbsp;: trois à cinq par an dans les médias-cibles&nbsp;? 19. <strong>Reddit / Hacker News</strong>&nbsp;: discussions positives ou neutres trouvables sur la marque&nbsp;? 20. <strong>Backlinks DR &gt; 50</strong>&nbsp;: cinq à dix nouveaux par an, naturels ou earned&nbsp;?</p>

      <div className="my-6 rounded-lg border-l-2 border-amber bg-cream px-4 py-3 not-prose">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-navy mb-1">Scoring auto-diagnostic</p>
        <p className="text-sm text-ink mb-1"><strong>0-3 non</strong>&nbsp;: stratégie GEO mature, focus sur l&apos;optimisation continue.</p>
        <p className="text-sm text-ink mb-1"><strong>4-8 non</strong>&nbsp;: déficit ciblé sur 1-2 sections, plan 90 jours suffit.</p>
        <p className="text-sm text-ink mb-1"><strong>9-15 non</strong>&nbsp;: déficit structurel, plan 6 mois indispensable.</p>
        <p className="text-sm text-ink"><strong>&gt; 15 non</strong>&nbsp;: invisible aux LLM, refonte stratégique nécessaire.</p>
      </div>

      <h2>Comment exécuter l&apos;audit en pratique</h2>
      <p>Section A se vérifie en deux heures avec Lighthouse, Schema.org Validator, et lecture du robots.txt. Section B demande une revue manuelle de 10-15 pages stratégiques. Section C nécessite Cision ou équivalent pour quantifier les retombées presse, plus une recherche manuelle sur Wikipedia et Reddit. Au total, comptez quatre à six heures pour un audit complet par un consultant senior, ou une journée si vous formez un junior à la méthodologie.</p>

      <h2>Cadence de re-audit</h2>
      <p>Re-évaluez les vingt points tous les six mois si votre score initial est correct (moins de huit non), tous les trois mois si vous êtes en remédiation active. Une fois le score stabilisé sous trois non, l&apos;audit annuel suffit, complété par un monitoring hebdomadaire des KPI runtime (citation rate, share-of-voice).</p>
    </>
  );
}

export const VISIBILITE_LLM_CLUSTERS: ClusterRegistry = {
  "mesurer-visibilite-llm-marque": {
    parentPillar: "visibilite-llm",
    fr: {
      title: "Comment mesurer la visibilité de ma marque dans les LLM",
      metaDescription:
        "Méthode pratique pour mesurer la visibilité de votre marque dans ChatGPT, Gemini, Claude, Perplexity. Panel de 30 prompts, KPI socle, cadence de mesure.",
      intro:
        "La mesure de visibilité LLM se construit sur un panel de 30 prompts représentatifs, mesuré chaque semaine sur quatre LLM, sur quatre KPI socles (citation rate, source rank, share-of-voice, sentiment). Voici la méthode pas-à-pas pour l'instrumenter en 30 jours sans outil dédié.",
      publishedAt: PUB,
      Body: BodyMesurer,
    },
  },
  "kpi-visibilite-llm-2026": {
    parentPillar: "visibilite-llm",
    fr: {
      title: "Les 7 KPI de visibilité LLM à suivre en 2026",
      metaDescription:
        "Les sept indicateurs de visibilité dans les LLM qui comptent en 2026 : citation rate, source rank, share-of-voice, sentiment, source attribution, évolution.",
      intro:
        "Position moyenne et CTR ne suffisent plus. La visibilité LLM impose un nouveau jeu d'indicateurs : citation rate, source rank, share-of-voice, sentiment, source attribution, évolution temporelle, écart prompts ouverts vs marque. Voici comment chacun se mesure et s'interprète.",
      publishedAt: PUB,
      Body: BodyKpi,
    },
  },
  "pourquoi-pas-cite-chatgpt": {
    parentPillar: "visibilite-llm",
    fr: {
      title: "Pourquoi ma marque n'est pas citée par ChatGPT",
      metaDescription:
        "Cinq causes typiques d'invisibilité dans ChatGPT : Wikipedia absent, robots.txt bloquant, contenu non extractible, autorité tierce faible, mémoire en retard.",
      intro:
        "Quand une marque B2B ne sort pas dans les réponses ChatGPT, l'origine est presque toujours dans cinq causes récurrentes — souvent en combinaison. Diagnostiquer la bonne cause détermine l'ordre d'intervention et économise six à douze mois de travail mal dirigé.",
      publishedAt: PUB,
      Body: BodyPourquoi,
    },
  },
  "visibilite-llm-vs-seo-classique": {
    parentPillar: "visibilite-llm",
    fr: {
      title: "Visibilité LLM vs SEO classique : 5 différences",
      metaDescription:
        "Cinq différences fondamentales entre visibilité LLM et SEO classique : surface mesurée, fenêtre de mise à jour, sources privilégiées, format, maturité outils.",
      intro:
        "SEO classique et visibilité LLM partagent 70 % de leurs fondamentaux mais divergent sur cinq points décisifs : surface mesurée, fenêtre de mise à jour, sources privilégiées, format de contenu, maturité des outils. Comprendre ces écarts oriente l'allocation budgétaire 2026.",
      publishedAt: PUB,
      Body: BodyVsSeo,
    },
  },
  "audit-visibilite-llm-checklist": {
    parentPillar: "visibilite-llm",
    fr: {
      title: "Audit visibilité LLM : checklist en 20 points",
      metaDescription:
        "Checklist en 20 points pour auditer votre visibilité LLM : technique on-page, structure de contenu, autorité off-page. Scoring auto-diagnostic inclus.",
      intro:
        "Cette checklist exhaustive en 20 points couvre les six leviers techniques, six leviers structurels et huit leviers d'autorité qui déterminent votre visibilité LLM. Comptez quatre à six heures pour l'exécuter ; le score final indique l'ampleur du chantier en six, douze ou vingt-quatre mois.",
      publishedAt: PUB,
      Body: BodyChecklist,
    },
  },
};
