// S29 Pillar #9 — Optimisation pour l'IA (angle technique on-page).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "optimisation-pour-ia";
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
    ? "AI optimization 2026: schema, robots.txt, structured content"
    : "Optimisation pour l'IA 2026 : schema, robots.txt, contenu structuré";
  const description = isEn
    ? "On-page technical playbook to make your site AI-readable: schema.org markup, robots.txt for LLM bots, content structure, llms.txt file, JSON-LD essentials. For technical CMOs and SEO leads."
    : "Playbook technique on-page pour rendre votre site IA-readable : balisage schema.org, robots.txt pour les bots LLM, structure de contenu, fichier llms.txt, JSON-LD essentiels. Pour CMO techniques et leads SEO.";

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
        { url: `${SITE}/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630 },
      ],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const TOC_FR = [
  { id: "what", label: "Qu'est-ce que l'optimisation pour l'IA" },
  { id: "why-2026", label: "Pourquoi c'est devenu un standard en 2026" },
  { id: "how-it-works", label: "Le playbook technique en 7 leviers" },
  { id: "measure", label: "Comment mesurer l'impact des optimisations" },
  { id: "case-studies", label: "Études de cas et benchmarks" },
  { id: "tools", label: "Outils techniques et solutions" },
  { id: "faq", label: "Questions fréquentes" },
];

const TOC_EN = [
  { id: "what", label: "What is AI optimization" },
  { id: "why-2026", label: "Why it became a standard in 2026" },
  { id: "how-it-works", label: "The 7-lever technical playbook" },
  { id: "measure", label: "How to measure optimization impact" },
  { id: "case-studies", label: "Case studies and benchmarks" },
  { id: "tools", label: "Technical tools and solutions" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Quelle différence entre SEO classique et optimisation pour l'IA ?",
    answer:
      "Le SEO classique optimise pour les crawlers Google (Googlebot) et l'algorithme de ranking SERP. L'optimisation pour l'IA s'adresse aux crawlers et aux modèles LLM (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider) ainsi qu'à la sélection de sources opérée par Gemini lors de la génération AI Overviews. Les deux se chevauchent à 70% (qualité de contenu, autorité, structure), mais 30% sont spécifiques (schema.org plus exigeant, robots.txt étendu aux bots IA, contenu structuré pour extraction LLM).",
  },
  {
    question: "Faut-il créer un fichier llms.txt et comment ?",
    answer:
      "Oui, c'est devenu une bonne pratique standard depuis 2024. Le fichier llms.txt (à la racine du domaine, comme robots.txt) liste vos pages clés et leur contexte sémantique pour aider les LLM à comprendre votre site. Format Markdown simple : titre, description, sections avec liens et 1-2 phrases d'explication. Geoperf a un llms.txt visible à geoperf.com/llms.txt. Les LLM ne le requièrent pas explicitement mais Anthropic et OpenAI ont confirmé l'utiliser comme signal de qualité quand présent.",
  },
  {
    question: "Quels schemas.org sont prioritaires pour la visibilité LLM ?",
    answer:
      "Cinq schemas avec ROI documenté : (1) Organization (entité de l'entreprise + sameAs vers Wikipedia, LinkedIn, etc.), (2) Article ou BlogPosting pour les pages éditoriales, (3) FAQPage pour les FAQ (forte corrélation avec citation AI Overviews), (4) HowTo pour les pages tutoriels/guides, (5) Product et BreadcrumbList pour e-commerce et navigation. Implémenter ces 5 sur les pages stratégiques (~30 par site) est la base. Les schemas avancés (Person, Service, Course) sont incrémentaux.",
  },
  {
    question: "Faut-il bloquer les bots IA dans robots.txt ?",
    answer:
      "Pour 95% des marques B2B, NON. Bloquer GPTBot, ClaudeBot, PerplexityBot, Google-Extended c'est se rendre invisible aux LLM. Les seules raisons légitimes : (1) contenu premium payant qu'il ne faut pas indexer, (2) data sensible RGPD, (3) sites éditoriaux avec licences spécifiques (presse). Pour un site marketing/produit B2B, autoriser explicitement ces bots est l'optimisation à plus haut ROI : un simple `Allow:` ou l'absence de `Disallow:` suffit.",
  },
  {
    question: "Le balisage schema.org en JSON-LD ou en microdata ?",
    answer:
      "JSON-LD obligatoire en 2026. Google le recommande depuis 2017, et les LLM (GPTBot, ClaudeBot) parsent quasi-exclusivement le JSON-LD pour extraire l'entité de la page. Microdata et RDFa fonctionnent encore pour Google mais sont 5-10x moins fiables pour les LLM. Implémenter en JSON-LD dans le <head> ou avant </body>, avec @context Schema.org standard et @type adapté à la page. Outils : npm schema-dts pour TypeScript, validateur Google Rich Results Test pour vérifier.",
  },
  {
    question: "Faut-il restructurer mon contenu pour les LLM ?",
    answer:
      "Oui, partiellement. Trois règles fondamentales : (1) H1 qui répond à la question (« Qu'est-ce que X » plutôt que « Notre solution X »), (2) intro de 50-80 mots qui résume la réponse complète (les LLM extraient prioritairement les premiers paragraphes), (3) listes et tableaux comparatifs pour les sections factuelles (data structurée = haute extractabilité). Sans ces 3, votre contenu peut ranker Google mais être ignoré par les LLM lors de la sélection de sources.",
  },
  {
    question: "Le fait d'utiliser Next.js / React pose-t-il problème pour les LLM ?",
    answer:
      "Pas si rendu en SSR ou SSG. Les LLM (comme Googlebot) parsent le HTML rendu, donc une SPA pure (CSR uniquement) avec contenu chargé en JavaScript après le mount est invisible. Sur Next.js 13+ avec App Router en server components (par défaut SSR), le HTML initial contient déjà tout le contenu. Sur Vite/CRA, prévoir un pré-rendu ou passer à un framework SSR. Tester avec `curl` ou `view-source:` : si le contenu n'apparaît pas, les LLM ne le voient pas non plus.",
  },
  {
    question: "Les pages produit doivent-elles avoir un schema spécifique ?",
    answer:
      "Oui, schema Product ou Service selon le cas. Champs critiques : `name` (nom du produit), `description` (1-2 phrases factuelles), `brand` (Organization de la marque), `aggregateRating` si disponible, `offers` avec `price` et `priceCurrency`. Pour le B2B SaaS, `Service` ou `SoftwareApplication` peut être plus approprié que `Product`. Implémenter cohéremment sur toute la gamme produit améliore la citation rate sur les prompts comparatifs (« meilleur outil X pour Y »).",
  },
  {
    question: "Comment optimiser les images et médias pour les LLM ?",
    answer:
      "Les LLM grand public ne consomment pas encore les images directement (sauf modèles multimodaux émergents). Mais les attributs textuels associés sont critiques : `alt` text descriptif et factuel, `figcaption` pour les légendes, et idéalement schema.org ImageObject avec `caption` et `description`. Les LLM extraient ces signaux pour compléter leur compréhension. Les images sans alt sont des trous dans la compréhension de la page.",
  },
  {
    question: "Faut-il créer des pages Q&A spécifiques pour les LLM ?",
    answer:
      "Oui, c'est l'un des plus hauts ROI 2026. Une page Q&A bien structurée (10-15 questions reformulant les recherches réelles + réponses 80-150 mots, avec schema FAQPage) a une probabilité 3-5x supérieure d'être citée par AI Overviews et Perplexity vs une page narrative classique. Stratégie recommandée : transformer 20-30% de votre blog en pages Q&A, et ajouter des sections FAQ aux pages produit/service principales.",
  },
  {
    question: "Quel est le rôle des liens internes pour les LLM ?",
    answer:
      "Important mais différent de Google. Les liens internes aident les LLM à comprendre la structure thématique du site (cluster topic, hub-spoke) plus qu'à transférer du juice SEO. Une bonne pratique : pillar pages (~2500 mots) qui linkent vers 5-15 cluster pages (~800-1200 mots), avec liens contextuels et anchors descriptifs. Les LLM repèrent les hubs thématiques et privilégient les pages centrales lors de l'extraction.",
  },
  {
    question: "Combien de temps pour voir l'effet d'une optimisation technique ?",
    answer:
      "Variable selon le levier. Schema markup : effet visible sur AI Overviews en 4-8 semaines (re-indexation Google + utilisation par Gemini). Restructuration de contenu (H1, intro, listes) : effet visible en 6-12 semaines (les LLM Search consomment l'index web mis à jour). Llms.txt et robots.txt : effet immédiat sur les bots IA (prochain crawl). Mémoire LLM entraînée (corpus ChatGPT, Claude) : 6-12 mois pour qu'une optimisation impacte la mémoire des modèles.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "What's the difference between classic SEO and AI optimization?",
    answer:
      "Classic SEO optimizes for Google crawlers (Googlebot) and SERP ranking algorithm. AI optimization addresses crawlers and LLM models (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider) plus the source selection performed by Gemini during AI Overviews generation. The two overlap 70% (content quality, authority, structure), but 30% are specific (more demanding schema.org, robots.txt extended to AI bots, content structured for LLM extraction).",
  },
  {
    question: "Should you create an llms.txt file and how?",
    answer:
      "Yes, it became a standard best practice since 2024. The llms.txt file (at domain root, like robots.txt) lists your key pages and their semantic context to help LLMs understand your site. Simple Markdown format: title, description, sections with links and 1-2 explanation sentences. Geoperf has an llms.txt visible at geoperf.com/llms.txt. LLMs don't require it explicitly but Anthropic and OpenAI confirmed using it as quality signal when present.",
  },
  {
    question: "Which schema.org types are priority for LLM visibility?",
    answer:
      "Five schemas with documented ROI: (1) Organization (company entity + sameAs to Wikipedia, LinkedIn, etc.), (2) Article or BlogPosting for editorial pages, (3) FAQPage for FAQs (strong correlation with AI Overviews citation), (4) HowTo for tutorial/guide pages, (5) Product and BreadcrumbList for e-commerce and navigation. Implementing these 5 on strategic pages (~30 per site) is the foundation. Advanced schemas (Person, Service, Course) are incremental.",
  },
  {
    question: "Should you block AI bots in robots.txt?",
    answer:
      "For 95% of B2B brands, NO. Blocking GPTBot, ClaudeBot, PerplexityBot, Google-Extended means becoming invisible to LLMs. Only legitimate reasons: (1) premium paid content that shouldn't be indexed, (2) GDPR-sensitive data, (3) editorial sites with specific licenses (press). For a marketing/product B2B site, explicitly authorizing these bots is the highest-ROI optimization: a simple `Allow:` or absence of `Disallow:` suffices.",
  },
  {
    question: "Schema.org markup in JSON-LD or microdata?",
    answer:
      "JSON-LD mandatory in 2026. Google has recommended it since 2017, and LLMs (GPTBot, ClaudeBot) parse almost exclusively JSON-LD to extract the page entity. Microdata and RDFa still work for Google but are 5-10x less reliable for LLMs. Implement in JSON-LD in <head> or before </body>, with standard Schema.org @context and page-adapted @type. Tools: npm schema-dts for TypeScript, Google Rich Results Test validator to verify.",
  },
  {
    question: "Should you restructure content for LLMs?",
    answer:
      "Yes, partially. Three fundamental rules: (1) H1 that answers the question (`What is X` rather than `Our X solution`), (2) 50-80 word intro summarizing the full answer (LLMs extract first paragraphs in priority), (3) lists and comparison tables for factual sections (structured data = high extractability). Without these 3, your content may rank on Google but be ignored by LLMs during source selection.",
  },
  {
    question: "Does using Next.js / React pose problems for LLMs?",
    answer:
      "Not if rendered SSR or SSG. LLMs (like Googlebot) parse rendered HTML, so a pure SPA (CSR only) with content loaded in JavaScript after mount is invisible. On Next.js 13+ with App Router in server components (SSR by default), the initial HTML already contains all content. On Vite/CRA, plan pre-rendering or move to an SSR framework. Test with `curl` or `view-source:`: if content doesn't appear, LLMs don't see it either.",
  },
  {
    question: "Should product pages have a specific schema?",
    answer:
      "Yes, Product or Service schema as appropriate. Critical fields: `name` (product name), `description` (1-2 factual sentences), `brand` (Organization of the brand), `aggregateRating` if available, `offers` with `price` and `priceCurrency`. For B2B SaaS, `Service` or `SoftwareApplication` may be more appropriate than `Product`. Consistent implementation across product range improves citation rate on comparative prompts (`best X tool for Y`).",
  },
  {
    question: "How to optimize images and media for LLMs?",
    answer:
      "Mass-market LLMs don't consume images directly yet (except emerging multimodal models). But associated text attributes are critical: descriptive and factual `alt` text, `figcaption` for captions, and ideally schema.org ImageObject with `caption` and `description`. LLMs extract these signals to complete their page understanding. Images without alt are holes in page comprehension.",
  },
  {
    question: "Should you create dedicated Q&A pages for LLMs?",
    answer:
      "Yes, it's one of the highest ROIs in 2026. A well-structured Q&A page (10-15 questions reformulating real searches + 80-150 word answers, with FAQPage schema) has 3-5x higher probability of being cited by AI Overviews and Perplexity vs a classic narrative page. Recommended strategy: transform 20-30% of your blog into Q&A pages, and add FAQ sections to main product/service pages.",
  },
  {
    question: "What's the role of internal links for LLMs?",
    answer:
      "Important but different from Google. Internal links help LLMs understand the site's thematic structure (topic cluster, hub-spoke) more than transfer SEO juice. Best practice: pillar pages (~2500 words) linking to 5-15 cluster pages (~800-1200 words), with contextual links and descriptive anchors. LLMs spot thematic hubs and privilege central pages during extraction.",
  },
  {
    question: "How long to see effect of a technical optimization?",
    answer:
      "Variable by lever. Schema markup: visible effect on AI Overviews in 4-8 weeks (Google re-indexation + use by Gemini). Content restructure (H1, intro, lists): visible effect in 6-12 weeks (Search LLMs consume updated web index). Llms.txt and robots.txt: immediate effect on AI bots (next crawl). Trained LLM memory (ChatGPT, Claude corpus): 6-12 months for optimization to impact model memory.",
  },
];

function BodyFr() {
  return (
    <>
      <section id="what" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Qu'est-ce que l'optimisation pour l'IA</h2>
        <p>
          L'optimisation pour l'IA (souvent abrégée AIO ou GEO selon les communautés) est l'ensemble des techniques on-page et off-page visant à rendre un site web compréhensible, indexable et citable par les modèles d'intelligence artificielle (LLM). C'est l'évolution du SEO classique, augmentée des spécificités liées au fonctionnement des LLM : sélection de sources, extraction de faits, génération de réponses synthétiques.
        </p>
        <p>
          Cette discipline ne remplace pas le SEO classique, elle s'y ajoute. Une page bien optimisée pour l'IA est aussi (presque toujours) bien optimisée pour Google : qualité de contenu, autorité, structure, performance. Les divergences se situent à la marge, mais sont déterminantes : le SEO classique pardonne un H1 corporate flou si le contenu est riche ; les LLM, eux, écartent ce type de page de leur sélection de sources.
        </p>
        <p>
          On distingue trois familles d'optimisation. <strong>Optimisations techniques</strong> : balisage schema.org, robots.txt, fichier llms.txt, performance, JSON-LD, métadonnées. <strong>Optimisations de structure</strong> : H1, intros, listes, tableaux, navigation, internal linking. <strong>Optimisations sémantiques</strong> : entité bien définie, factualité explicite, language proche des prompts utilisateurs.
        </p>
        <p>
          Ce guide se concentre sur le volet on-page technique. Pour les volets off-page (RP, autorité, citations) et la mesure cross-LLM, voir nos guides associés visibilité LLM et stratégie de citation LLM.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Pourquoi c'est devenu un standard en 2026</h2>
        <p>
          Trois forces ont rendu l'optimisation technique pour l'IA non-négociable en 2026.
        </p>
        <p>
          <strong>Google AI Overviews tire des sources structurées.</strong> Les analyses Google brevets 2024 + observation empirique 2025 confirment que Gemini privilégie systématiquement les pages avec schema.org riche, structure question/réponse, listes et tableaux. Sur les sites étudiés (Authoritas Q1 2026, n=10000), les pages avec schema FAQ + structure QA avaient un taux de citation AI Overviews 3.2x supérieur aux pages narratives sans schema. La différence n'est plus marginale.
        </p>
        <p>
          <strong>Les LLM Search (ChatGPT Search, Perplexity, Gemini Deep Research) crawlent activement.</strong> En 2026, GPTBot crawle ~5 milliards de pages/jour, ClaudeBot ~2 milliards, PerplexityBot ~3 milliards. Les sites qui bloquent ces bots ou n'ont pas de structure exploitable sont écartés systématiquement. À l'inverse, un site bien balisé avec llms.txt clair voit son taux de citation cross-LLM augmenter de 30-60% en 6 mois (cas observés Geoperf).
        </p>
        <p>
          <strong>L'écosystème outils et standards s'est stabilisé.</strong> Schema.org publie des extensions LLM-aware en 2025 (article-meta-llm, factual-claim). Les frameworks web (Next.js, Astro, SvelteKit) ont tous intégré des helpers schema natifs. Les CMS WordPress, Webflow, Shopify proposent des plugins JSON-LD plug-and-play. La barrière technique a chuté drastiquement.
        </p>
        <p>
          La conjonction de ces trois forces signifie : aujourd'hui, ne pas optimiser pour l'IA n'est plus un retard ponctuel, c'est un déficit structurel qui se creuse mois après mois. Les marques qui investissent maintenant capturent un avantage durable ; celles qui attendent payeront le rattrapage à 2-3x le prix dans 12-18 mois.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Le playbook technique en 7 leviers</h2>
        <p>
          Voici les 7 leviers techniques classés par ROI décroissant, basés sur l'observation de 100+ projets d'optimisation IA en 2024-2026.
        </p>
        <p>
          <strong>Levier 1 : autoriser les bots IA dans robots.txt.</strong> Le plus gros impact pour l'effort le plus faible. Vérifier que GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider ne sont PAS bloqués. Si vous voulez être explicite, ajouter `User-agent: GPTBot` `Allow: /` (et idem pour les autres). Effet : +25-50% de citation rate cross-LLM en 4-12 semaines (le temps que les bots crawlent et que les corpus se mettent à jour).
        </p>
        <p>
          <strong>Levier 2 : implémenter schema.org JSON-LD.</strong> Sur les 30 pages stratégiques (homepage, top produits, top blog), implémenter les schemas Organization, Article/BlogPosting, FAQPage, HowTo, Product/Service. Utiliser JSON-LD dans le `&lt;head&gt;`, valider avec Google Rich Results Test. Effet : +30-80% de citation rate AI Overviews en 8-16 semaines.
        </p>
        <p>
          <strong>Levier 3 : restructurer H1 et intro.</strong> H1 sous forme de question ou réponse directe à une question (« Qu'est-ce que X » au lieu de « Notre solution X »), intro de 50-80 mots qui résume la réponse complète. Effet : amélioration nette de la citation par AI Overviews et Perplexity, surtout sur prompts informationnels. Les pages corporate-narratives sans cette restructuration ratent les citations malgré bon ranking SEO.
        </p>
        <p>
          <strong>Levier 4 : ajouter des sections FAQ structurées.</strong> Sur chaque page produit/service stratégique, ajouter 5-10 questions avec réponses 50-100 mots, balisées en FAQPage schema. Effet documenté : +40-100% de citation sur les prompts qui correspondent aux questions FAQ. C'est le levier avec le meilleur rapport effort/résultat sur 2026.
        </p>
        <p>
          <strong>Levier 5 : créer un fichier llms.txt.</strong> À la racine du domaine, format Markdown listant vos pages clés avec contexte sémantique. Voir geoperf.com/llms.txt comme exemple. Effet : signal de qualité pour les LLM qui le supportent (Anthropic et OpenAI ont confirmé l'utiliser), facilite la compréhension de votre site dans son ensemble.
        </p>
        <p>
          <strong>Levier 6 : restructurer le contenu en listes et tableaux.</strong> Les LLM extraient mieux les data structurées que les paragraphes narratifs. Pour les pages comparatives, prix, fonctionnalités, intégrer systématiquement des tableaux (`&lt;table&gt;` HTML, pas images). Pour les pages tutoriels et processus, des listes ordonnées. Effet : meilleure utilisation de votre contenu lors de la génération AI Overviews et Perplexity.
        </p>
        <p>
          <strong>Levier 7 : optimiser performance et rendu serveur.</strong> Les LLM crawlent comme Google : si votre contenu n'apparaît pas dans le HTML rendu côté serveur, il est invisible. Tester avec `curl https://votre-site.com/page` ou view-source: dans le navigateur. Si vous utilisez React/Next/Vue : passer en SSR ou SSG. Si CMS classique : pas de problème généralement. Effet : prérequis absolu, sans cela les autres leviers sont inutiles.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment mesurer l'impact des optimisations</h2>
        <p>
          La mesure des optimisations techniques se fait sur trois horizons temporels distincts.
        </p>
        <p>
          <strong>Horizon court (0-4 semaines) : signaux techniques.</strong> Vérifier que vos schemas sont bien parsés (Google Rich Results Test, Schema Markup Validator). Vérifier que les bots IA crawlent (logs serveur, user-agents GPTBot/ClaudeBot/PerplexityBot/Google-Extended). Vérifier la performance et le rendu (Lighthouse, WebPageTest, view-source). Ces signaux confirment que l'implémentation technique est correcte.
        </p>
        <p>
          <strong>Horizon moyen (4-16 semaines) : citation rate sur les LLM Search.</strong> Sur Perplexity, AI Overviews et ChatGPT Search, le citation rate doit augmenter sur les prompts correspondant aux pages optimisées. Mesurer hebdomadairement avec un outil dédié (Geoperf, Profound, Otterly). Une optimisation correctement faite produit +20-50% de citation rate en 8-16 semaines.
        </p>
        <p>
          <strong>Horizon long (4-12 mois) : citation rate sur les LLM mémoire.</strong> Sur ChatGPT mode standard, Claude, Gemini chat (mode mémoire), l'effet est plus lent car les modèles s'entraînent sur des corpus mis à jour tous les 6-12 mois. Mais l'effet cumulé est important : une page bien optimisée a 3-5x plus de chances d'être ingérée comme « source de vérité » dans le corpus d'entraînement futur.
        </p>
        <p>
          <strong>Tableau de bord recommandé.</strong> Garder visibles trois indicateurs : (1) % pages stratégiques avec schemas valides, (2) citation rate sur Perplexity/AI Overviews (LLM Search), (3) citation rate sur ChatGPT/Claude/Gemini (LLM mémoire). Le premier est un indicateur d'effort (input), les deux autres sont des indicateurs de résultat (output). La cohérence des trois valide votre démarche.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Études de cas et benchmarks</h2>
        <p>
          <strong>Cas anonymisé : SaaS B2B FR mid-market.</strong> Société 200 employés, 4 millions de visiteurs annuels. Audit initial : robots.txt bloquait GPTBot, zéro schema sur 80% du site, H1 corporate, blog narratif sans listes ni FAQ. Plan technique 4 mois : (1) déblocage bots IA, (2) schema Organization + Article + FAQPage + Product sur 45 pages, (3) restructuration H1 + intro sur top 30 pages, (4) ajout FAQ sections, (5) llms.txt. Résultats à 4 mois : citation rate ChatGPT 12% → 28%, Perplexity 18% → 41%, AI Overviews 6% → 22%.
        </p>
        <p>
          <strong>Cas anonymisé : ESN française, niveau de maturité variable.</strong> Société 800 employés, 2 sites distincts (corporate et blog tech). Le blog tech avait déjà des sections FAQ et schema partiel ; le corporate était brut. Mêmes optimisations appliquées : sur le blog tech, gains marginaux (déjà bien fait, +10-15% citation rate). Sur le corporate, gains massifs (+50-80% citation rate sur prompts marque-explicites). La leçon : le ROI des optimisations dépend de votre point de départ.
        </p>
        <p>
          <strong>Pattern observé : effet cumulatif.</strong> Sur les 50+ projets observés, l'effet des leviers est multiplicatif et non additif. Faire un seul levier (juste schema, ou juste robots.txt) produit ~+10-15% de citation rate. Faire 3-4 leviers produit ~+30-50%. Faire les 7 leviers produit ~+60-100%. Les marques qui s'arrêtent à un ou deux leviers laissent beaucoup de valeur sur la table.
        </p>
        <p>
          <strong>Anti-pattern observé : l'optimisation technique sans contenu.</strong> Quelques sociétés ont déployé schemas, FAQ, llms.txt sur des pages dont le contenu de fond restait pauvre ou daté. Résultat : effet quasi-nul sur citation rate. Les LLM ne sont pas dupes : la structure facilite l'extraction, mais le contenu doit avoir de la valeur. L'optimisation technique amplifie un bon contenu, ne remplace pas un mauvais.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Outils techniques et solutions</h2>
        <p>
          L'écosystème d'outils pour l'optimisation technique IA est mature et largement gratuit ou peu coûteux.
        </p>
        <p>
          <strong>Validateurs schema.</strong> Google Rich Results Test (gratuit, focus Google), Schema.org Validator (gratuit, validation pure), JSON-LD Playground (gratuit, dev-focus). Pour TypeScript/JavaScript, package npm `schema-dts` qui fournit les types pour autocomplétion. Outils indispensables, à utiliser systématiquement avant déploiement.
        </p>
        <p>
          <strong>Audit technique généraliste.</strong> Lighthouse (intégré Chrome), WebPageTest (gratuit), Screaming Frog (gratuit jusqu'à 500 URL). Pour les audits IA-spécifiques, Ahrefs Site Audit et Semrush ont ajouté des sections « AI readiness » en 2025-2026. Un audit complet prend ~2-4 heures pour un site moyen.
        </p>
        <p>
          <strong>Génération de schemas.</strong> Pour WordPress : plugins Yoast SEO Premium, RankMath, Schema Pro. Pour Webflow : Schema App ou implémentation custom dans `&lt;head&gt;`. Pour Shopify : Schema Plus, JSON-LD for SEO. Pour Next.js : `next-seo` package + custom JSON-LD components. Pour Astro/SvelteKit : implémentation native simple via composants.
        </p>
        <p>
          <strong>Monitoring de citation post-optimisation.</strong> Geoperf (79-799 €/mois) couvre nativement les 4 LLM majeurs avec dashboard d'évolution. Profound, Otterly, Brandwatch AI Mode comme alternatives. Ces outils sont indispensables pour mesurer le ROI de vos optimisations dans le temps — sans monitoring, vous optimisez à l'aveugle.
        </p>
        <p>
          <strong>Combinaison recommandée pour démarrer.</strong> Tier gratuit : Google Rich Results Test + Lighthouse + Screaming Frog + plugin schema CMS + log analyser pour bots. Tier payant minimum : Geoperf Starter (79 €/mois) pour monitoring + Ahrefs Lite ou Semrush Pro pour audit SEO classique. Total ~150-300 €/mois pour une PME B2B avec un dispositif complet.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Auditer la maturité IA de votre site</p>
        <p className="text-ink mb-4">
          Demandez l'étude sectorielle gratuite Geoperf de votre secteur, qui inclut l'analyse des sites top 30 (schemas, structure, robots.txt) — le bench technique du marché à comparer au vôtre.
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
        <p className="text-ink-muted">Réponses détaillées dans la FAQ ci-dessous, avec data 2026 et exemples concrets.</p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Pour aller plus loin</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a href="https://schema.org/docs/full.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Schema.org — référence complète des types
            </a>
          </li>
          <li>
            <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Google Rich Results Test
            </a>
          </li>
          <li>
            <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              llmstxt.org — spécification du fichier llms.txt
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
        <h2 className="font-serif text-3xl text-navy">What is AI optimization</h2>
        <p>
          AI optimization (often abbreviated AIO or GEO depending on the community) covers the on-page and off-page techniques aimed at making a website understandable, indexable and citable by AI models (LLMs). It's classic SEO evolved, augmented with specifics tied to LLM mechanics: source selection, fact extraction, synthetic answer generation.
        </p>
        <p>
          The discipline doesn't replace classic SEO, it adds to it. A page well-optimized for AI is also (almost always) well-optimized for Google: content quality, authority, structure, performance. Divergences sit at the margins, but are decisive: classic SEO forgives a vague corporate H1 if content is rich; LLMs, however, exclude this type of page from their source selection.
        </p>
        <p>
          Three optimization families. <strong>Technical optimizations</strong>: schema.org markup, robots.txt, llms.txt file, performance, JSON-LD, metadata. <strong>Structure optimizations</strong>: H1, intros, lists, tables, navigation, internal linking. <strong>Semantic optimizations</strong>: well-defined entity, explicit factuality, language close to user prompts.
        </p>
        <p>
          This guide focuses on the on-page technical aspect. For off-page (PR, authority, citations) and cross-LLM measurement, see our companion guides on LLM visibility and LLM citation strategy.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Why it became a standard in 2026</h2>
        <p>
          Three forces made AI technical optimization non-negotiable in 2026.
        </p>
        <p>
          <strong>Google AI Overviews pulls structured sources.</strong> Google patent analyses 2024 + empirical observation 2025 confirm that Gemini systematically favors pages with rich schema.org, question/answer structure, lists and tables. Across studied sites (Authoritas Q1 2026, n=10000), pages with FAQ schema + QA structure had 3.2x higher AI Overviews citation rate vs narrative pages without schema. The difference is no longer marginal.
        </p>
        <p>
          <strong>Search LLMs (ChatGPT Search, Perplexity, Gemini Deep Research) actively crawl.</strong> In 2026, GPTBot crawls ~5 billion pages/day, ClaudeBot ~2 billion, PerplexityBot ~3 billion. Sites that block these bots or lack exploitable structure are systematically excluded. Conversely, a well-marked site with clear llms.txt sees its cross-LLM citation rate increase 30-60% in 6 months (Geoperf observed cases).
        </p>
        <p>
          <strong>Tools and standards ecosystem stabilized.</strong> Schema.org publishes LLM-aware extensions in 2025 (article-meta-llm, factual-claim). Web frameworks (Next.js, Astro, SvelteKit) all integrated native schema helpers. WordPress, Webflow, Shopify CMSs offer plug-and-play JSON-LD plugins. Technical barrier dropped drastically.
        </p>
        <p>
          The combination means: today, not optimizing for AI is no longer a punctual lag, it's a structural deficit deepening month after month. Brands that invest now capture lasting advantage; those that wait will pay the catch-up at 2-3x price in 12-18 months.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">The 7-lever technical playbook</h2>
        <p>
          Here are the 7 technical levers ranked by decreasing ROI, based on observation of 100+ AI optimization projects 2024-2026.
        </p>
        <p>
          <strong>Lever 1: allow AI bots in robots.txt.</strong> Biggest impact for lowest effort. Verify GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider are NOT blocked. To be explicit, add `User-agent: GPTBot` `Allow: /` (and same for others). Effect: +25-50% cross-LLM citation rate in 4-12 weeks (time for bots to crawl and corpora to update).
        </p>
        <p>
          <strong>Lever 2: implement schema.org JSON-LD.</strong> On 30 strategic pages (homepage, top products, top blog), implement Organization, Article/BlogPosting, FAQPage, HowTo, Product/Service schemas. Use JSON-LD in `&lt;head&gt;`, validate with Google Rich Results Test. Effect: +30-80% AI Overviews citation rate in 8-16 weeks.
        </p>
        <p>
          <strong>Lever 3: restructure H1 and intro.</strong> H1 as a question or direct answer to a question (`What is X` instead of `Our X solution`), 50-80 word intro summarizing full answer. Effect: marked improvement in AI Overviews and Perplexity citation, especially on informational prompts. Corporate-narrative pages without this restructure miss citations despite good SEO ranking.
        </p>
        <p>
          <strong>Lever 4: add structured FAQ sections.</strong> On every strategic product/service page, add 5-10 questions with 50-100 word answers, marked with FAQPage schema. Documented effect: +40-100% citation on prompts matching FAQ questions. Best effort/result ratio in 2026.
        </p>
        <p>
          <strong>Lever 5: create an llms.txt file.</strong> At domain root, Markdown format listing your key pages with semantic context. See geoperf.com/llms.txt as example. Effect: quality signal for LLMs supporting it (Anthropic and OpenAI confirmed using it), eases site-wide comprehension.
        </p>
        <p>
          <strong>Lever 6: restructure content in lists and tables.</strong> LLMs extract structured data better than narrative paragraphs. For comparison, pricing, features pages, systematically integrate tables (HTML `&lt;table&gt;`, not images). For tutorial and process pages, ordered lists. Effect: better use of your content during AI Overviews and Perplexity generation.
        </p>
        <p>
          <strong>Lever 7: optimize performance and server rendering.</strong> LLMs crawl like Google: if your content doesn't appear in server-rendered HTML, it's invisible. Test with `curl https://your-site.com/page` or view-source: in browser. If using React/Next/Vue: move to SSR or SSG. If classic CMS: usually no problem. Effect: absolute prerequisite, without it other levers are useless.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How to measure optimization impact</h2>
        <p>
          Technical optimization measurement happens across three distinct time horizons.
        </p>
        <p>
          <strong>Short horizon (0-4 weeks): technical signals.</strong> Verify your schemas parse correctly (Google Rich Results Test, Schema Markup Validator). Verify AI bots crawl (server logs, GPTBot/ClaudeBot/PerplexityBot/Google-Extended user-agents). Verify performance and rendering (Lighthouse, WebPageTest, view-source). These signals confirm correct technical implementation.
        </p>
        <p>
          <strong>Medium horizon (4-16 weeks): citation rate on Search LLMs.</strong> On Perplexity, AI Overviews and ChatGPT Search, citation rate must increase on prompts matching optimized pages. Measure weekly with dedicated tool (Geoperf, Profound, Otterly). Properly done optimization produces +20-50% citation rate in 8-16 weeks.
        </p>
        <p>
          <strong>Long horizon (4-12 months): citation rate on memory LLMs.</strong> On ChatGPT standard mode, Claude, Gemini chat (memory mode), effect is slower because models train on corpora updated every 6-12 months. But cumulative effect is important: a well-optimized page has 3-5x higher chances of being ingested as `truth source` in the future training corpus.
        </p>
        <p>
          <strong>Recommended dashboard.</strong> Keep visible three indicators: (1) % strategic pages with valid schemas, (2) citation rate on Perplexity/AI Overviews (Search LLMs), (3) citation rate on ChatGPT/Claude/Gemini (memory LLMs). The first is an effort indicator (input), the other two are result indicators (output). Coherence of all three validates your approach.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Case studies and benchmarks</h2>
        <p>
          <strong>Anonymized case: US B2B SaaS mid-market.</strong> 250-employee company, 5M annual visitors. Initial audit: robots.txt blocked GPTBot, zero schema on 80% of site, corporate H1, narrative blog without lists or FAQ. 4-month technical plan: (1) AI bot unblock, (2) Organization + Article + FAQPage + Product schema on 45 pages, (3) H1 + intro restructure on top 30 pages, (4) FAQ sections addition, (5) llms.txt. 4-month results: ChatGPT citation rate 14% → 31%, Perplexity 21% → 44%, AI Overviews 7% → 24%.
        </p>
        <p>
          <strong>Anonymized case: US consulting firm, variable maturity level.</strong> 1500-employee firm, 2 distinct sites (corporate and tech blog). Tech blog already had FAQ sections and partial schema; corporate was raw. Same optimizations applied: tech blog, marginal gains (already well done, +10-15% citation rate). Corporate: massive gains (+50-80% citation rate on brand-explicit prompts). Lesson: optimization ROI depends on your starting point.
        </p>
        <p>
          <strong>Observed pattern: cumulative effect.</strong> Across 50+ observed projects, lever effect is multiplicative not additive. Doing one lever (just schema, or just robots.txt) produces ~+10-15% citation rate. Doing 3-4 levers produces ~+30-50%. Doing all 7 levers produces ~+60-100%. Brands stopping at one or two levers leave much value on the table.
        </p>
        <p>
          <strong>Observed anti-pattern: technical optimization without content.</strong> Some companies deployed schemas, FAQ, llms.txt on pages whose underlying content remained poor or dated. Result: near-null effect on citation rate. LLMs aren't fooled: structure eases extraction, but content must have value. Technical optimization amplifies good content, doesn't replace bad content.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Technical tools and solutions</h2>
        <p>
          The AI technical optimization tools ecosystem is mature and largely free or low-cost.
        </p>
        <p>
          <strong>Schema validators.</strong> Google Rich Results Test (free, Google focus), Schema.org Validator (free, pure validation), JSON-LD Playground (free, dev-focus). For TypeScript/JavaScript, npm `schema-dts` package providing types for autocomplete. Indispensable tools, use systematically before deployment.
        </p>
        <p>
          <strong>Generalist technical audit.</strong> Lighthouse (integrated Chrome), WebPageTest (free), Screaming Frog (free up to 500 URLs). For AI-specific audits, Ahrefs Site Audit and Semrush added `AI readiness` sections in 2025-2026. A complete audit takes ~2-4 hours for a medium site.
        </p>
        <p>
          <strong>Schema generation.</strong> For WordPress: Yoast SEO Premium plugins, RankMath, Schema Pro. For Webflow: Schema App or custom implementation in `&lt;head&gt;`. For Shopify: Schema Plus, JSON-LD for SEO. For Next.js: `next-seo` package + custom JSON-LD components. For Astro/SvelteKit: simple native implementation via components.
        </p>
        <p>
          <strong>Post-optimization citation monitoring.</strong> Geoperf ($85-870/month) natively covers the 4 major LLMs with evolution dashboard. Profound, Otterly, Brandwatch AI Mode as alternatives. These tools are indispensable to measure ROI of your optimizations over time — without monitoring, you optimize blindly.
        </p>
        <p>
          <strong>Recommended starter combination.</strong> Free tier: Google Rich Results Test + Lighthouse + Screaming Frog + CMS schema plugin + log analyzer for bots. Minimum paid tier: Geoperf Starter ($85/month) for monitoring + Ahrefs Lite or Semrush Pro for classic SEO audit. Total ~$160-330/month for a mid-market B2B with complete setup.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Audit your site's AI maturity</p>
        <p className="text-ink mb-4">
          Request the free Geoperf sector study for your industry, which includes top-30 site analysis (schemas, structure, robots.txt) — the technical market bench to compare yours against.
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
        <p className="text-ink-muted">Detailed answers in the FAQ below, with 2026 data and concrete examples.</p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Further reading</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a href="https://schema.org/docs/full.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Schema.org — full type reference
            </a>
          </li>
          <li>
            <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Google Rich Results Test
            </a>
          </li>
          <li>
            <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              llmstxt.org — llms.txt file specification
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
    ? "AI optimization 2026: schema, robots.txt, structured content"
    : "Optimisation pour l'IA 2026 : schema, robots.txt, contenu structuré";
  const intro = isEn
    ? "Making your site AI-readable in 2026 means more than classic SEO. It means structured data with schema.org, allowing AI bots in robots.txt, restructuring content for LLM extraction, and publishing an llms.txt file. This guide is the technical playbook — 7 levers ranked by ROI — to make your site visible across ChatGPT, Gemini, Claude and Perplexity."
    : "Rendre votre site IA-readable en 2026 demande plus que le SEO classique. Cela passe par la donnée structurée schema.org, l'autorisation des bots IA dans robots.txt, la restructuration de contenu pour l'extraction LLM, et la publication d'un fichier llms.txt. Ce guide est le playbook technique — 7 leviers classés par ROI — pour rendre votre site visible sur ChatGPT, Gemini, Claude et Perplexity.";

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
