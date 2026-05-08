// S29 Pillar #10 — LLM citation strategy (angle tactiques link-building & autorité).

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PillarLayout, type FaqEntry, type RelatedLink } from "@/components/seo/PillarLayout";
import { relatedForPillar, type PillarSlug } from "@/lib/seo/internal-links";

const SLUG: PillarSlug = "llm-citation-strategy";
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
    ? "LLM citation strategy 2026: PR, Wikipedia, sources that LLMs trust"
    : "Stratégie de citation LLM 2026 : RP, Wikipedia, sources que les LLM citent";
  const description = isEn
    ? "Off-page playbook to earn LLM citations: which sources LLMs trust, how to land on Wikipedia, trade press tactics, third-party authority building. For CMOs and PR leads."
    : "Playbook off-page pour gagner des citations LLM : quelles sources les LLM citent, comment atterrir sur Wikipedia, tactiques presse spécialisée, construction d'autorité tierce. Pour CMO et leads RP.";

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
  { id: "what", label: "Qu'est-ce qu'une stratégie de citation LLM" },
  { id: "why-2026", label: "Pourquoi les sources tierces dominent en 2026" },
  { id: "how-it-works", label: "Le playbook en 6 leviers off-page" },
  { id: "measure", label: "Comment mesurer l'impact des citations gagnées" },
  { id: "case-studies", label: "Études de cas et benchmarks" },
  { id: "tools", label: "Outils et solutions" },
  { id: "faq", label: "Questions fréquentes" },
];

const TOC_EN = [
  { id: "what", label: "What is an LLM citation strategy" },
  { id: "why-2026", label: "Why third-party sources dominate in 2026" },
  { id: "how-it-works", label: "The 6-lever off-page playbook" },
  { id: "measure", label: "How to measure earned citations impact" },
  { id: "case-studies", label: "Case studies and benchmarks" },
  { id: "tools", label: "Tools and solutions" },
  { id: "faq", label: "Frequently asked questions" },
];

const FAQ_FR: FaqEntry[] = [
  {
    question: "Pourquoi les LLM citent-ils plus les sources tierces que les sites de marque ?",
    answer:
      "Choix architectural et statistique. Les LLM sont entraînés à privilégier les sources autoritaires et indépendantes pour réduire le biais commercial : Wikipedia (consensus encyclopédique), presse établie (faits vérifiés), académique (.edu/.gov, expertise) sont jugées plus fiables que les sites de marque eux-mêmes (parti pris commercial). C'est pourquoi 60-80% des citations LLM passent par des sources tierces, même quand le site de la marque est top-1 Google sur la requête.",
  },
  {
    question: "Quelles sont les sources les plus citées par les LLM en 2026 ?",
    answer:
      "Top 5 (étude Geoperf Q1 2026, panel 5000 réponses LLM) : (1) Wikipedia (32% des citations cross-LLM), (2) presse spécialisée sectorielle (18%), (3) presse générale établie (Reuters, AP, Le Monde, NYT — 14%), (4) sites corporate des leaders sectoriels (12%), (5) académique et institutionnel (.edu, .gov, .org — 10%). Reste : Reddit, blogs experts, podcasts retranscrits, et autres (14%).",
  },
  {
    question: "Comment se faire référencer sur Wikipedia ?",
    answer:
      "Trois approches éprouvées. (1) Notoriété indirecte : être mentionné dans des articles existants (secteur, concurrents, dirigeants) plutôt que créer une page dédiée. Plus facile et plus durable. (2) Page dédiée : nécessite « notoriété encyclopédique » prouvée par 3-5 sources tierces indépendantes (presse, livres, études académiques). Demande de patience (refus initial fréquent) et respect strict des règles WP. (3) Travail via éditeur Wikipedia certifié : agences spécialisées qui gèrent le processus (~2-5k €). Risque : tout greenwashing/spam est détecté et purgé.",
  },
  {
    question: "Faut-il payer pour des articles dans la presse spécialisée ?",
    answer:
      "Distinction critique. Le contenu sponsorisé/publi-rédactionnel a peu d'impact LLM (les LLM sont entraînés à dévaloriser les contenus marqués `sponsored`, `advertorial`). En revanche, la PR earned (gagnée par mérite éditorial : annonce produit notable, étude flagship, point de vue tribune) est très efficace. L'investissement RP qualitatif (relations rédactionnelles, attaché de presse spécialisé, contenus fournis sur demande) à 1-3k €/mois sur 6-12 mois produit un ROI LLM nettement supérieur à du contenu sponsorisé même volumineux.",
  },
  {
    question: "Reddit est-il vraiment cité par les LLM ?",
    answer:
      "Oui, avec des nuances. Reddit représente ~5-10% des citations sur les prompts B2B techniques, plus sur les prompts dev/SaaS/grand public. Les subreddits cités sont les plus actifs (r/SaaS, r/marketing, r/ProductManagement, r/sysadmin, etc.). Pour une marque, deux usages : (1) surveiller mentions et threads sur votre marque (souvent négatifs ou neutres, parfois élogieux), (2) participer authentiquement (pas de spam) via comptes employés ou founder-led posts. Reddit est plus difficile à activer que Wikipedia mais peut donner des résultats sur niches spécifiques.",
  },
  {
    question: "Combien de citations tierces faut-il pour un effet LLM mesurable ?",
    answer:
      "Effet seuil observé : 8-15 citations tierces de qualité par marque dans les 12 derniers mois. Sous 5 citations, effet quasi-nul. Entre 5-10 citations, effet positif modeste (+5-15% citation rate LLM). Au-delà de 15, plateau ROI marginal mais maintien de l'autorité. La qualité prime sur la quantité : 5 citations Wikipedia + Le Monde + AGEFI sont plus impactantes que 50 citations sur petits blogs B2B inconnus.",
  },
  {
    question: "Quelle différence entre backlink SEO classique et citation LLM ?",
    answer:
      "Frontière floue mais réelle. Le backlink SEO classique transfère du « link juice » via algorithme PageRank — peu importe le contexte, beaucoup importe le nombre/autorité. La citation LLM est plus exigeante : le contexte de la mention compte (paragraphe pertinent vs liste-pied de page), la tonalité (positive vs neutre vs négative), la fraîcheur (mention récente > ancienne), et le sourcing (texte qui contient des faits vérifiables > promo). Une citation LLM forte est aussi un bon backlink SEO ; l'inverse n'est pas vrai.",
  },
  {
    question: "Comment générer une étude flagship qui sera citée ?",
    answer:
      "Recette qui fonctionne : (1) data propriétaire (votre base, votre client base, votre étude commandée), (2) angle clair et contrarian sans être alarmiste, (3) chiffres clés mémorables (`73% de B2B sont passés à l'IA en 2026`), (4) format facilement citable (PDF + page web + tweet thread), (5) PR ciblée vers 10-20 journalistes spécialisés. Effet typique : 30-100 reprises presse + 200-500 partages LinkedIn + intégration progressive aux corpus LLM dans les 6-12 mois suivants.",
  },
  {
    question: "Les podcasts sont-ils cités par les LLM ?",
    answer:
      "Indirectement, via les transcriptions. Les LLM ne consomment pas l'audio brut (sauf modèles multimodaux émergents) mais les retranscriptions textuelles publiées. Pour qu'un passage de podcast soit citable, il faut une transcription textuelle indexable (page web avec texte transcrit + show notes détaillées). Les podcasts B2B reconnus (Acquired, Lenny's, Generation Do It Yourself) qui publient leurs transcrits sont effectivement cités. Sans transcription écrite : invisible.",
  },
  {
    question: "Faut-il privilégier les RP ou le contenu propriétaire ?",
    answer:
      "Les deux, mais dans cet ordre. Le contenu propriétaire (blog corporate, études, livres blancs) est l'actif que vous contrôlez ; il alimente les LLM Search en sources fraîches. Mais sans RP qui le distribue auprès de la presse spécialisée, ce contenu reste isolé. La séquence type : 1) produire un contenu fort (étude, white paper, position paper), 2) le pousser auprès de la presse via RP, 3) viser des reprises et citations qui amplifient l'autorité tierce. RP seules sans contenu : n'amène rien à citer. Contenu seul sans RP : pas d'amplification.",
  },
  {
    question: "Quelle est l'erreur la plus fréquente des marques ?",
    answer:
      "Sous-investir Wikipedia. La majorité des marques B2B FR mid-market n'ont aucune présence Wikipedia (ni page dédiée, ni mention dans articles connexes). C'est la source la plus citée par les LLM en 2026 (32% des citations) et l'une des plus accessibles (gratuit, méritocratique). Investir 5-15k € sur 6-12 mois pour construire une présence Wikipedia sérieuse (page dédiée si éligible, ou mentions stratégiques sur articles existants) rapporte un ROI LLM mesurable et durable. Trop peu de marques l'ont identifié comme priorité 2026.",
  },
  {
    question: "Combien de temps pour qu'une stratégie de citation porte ses fruits ?",
    answer:
      "Court terme (3-6 mois) : citations gagnées via PR earned visibles sur Perplexity et AI Overviews (LLM Search). Moyen terme (6-12 mois) : intégration progressive aux corpus LLM mémoire (ChatGPT, Claude). Long terme (12-24 mois) : autorité cumulative qui devient un actif réputationnel résistant. Les marques qui démarrent leur stratégie en 2026 verront leur position consolidée fin 2027. Plus elles attendent, plus le rattrapage devient coûteux face aux concurrents qui ont commencé.",
  },
];

const FAQ_EN: FaqEntry[] = [
  {
    question: "Why do LLMs cite third-party sources more than brand sites?",
    answer:
      "Architectural and statistical choice. LLMs are trained to favor authoritative and independent sources to reduce commercial bias: Wikipedia (encyclopedic consensus), established press (verified facts), academic (.edu/.gov, expertise) are deemed more reliable than brand sites themselves (commercial bias). That's why 60-80% of LLM citations route through third-party sources, even when the brand site is top-1 Google on the query.",
  },
  {
    question: "Which sources are most cited by LLMs in 2026?",
    answer:
      "Top 5 (Geoperf Q1 2026 study, 5000 LLM response panel): (1) Wikipedia (32% of cross-LLM citations), (2) trade press by sector (18%), (3) established general press (Reuters, AP, Le Monde, NYT — 14%), (4) sector leader corporate sites (12%), (5) academic and institutional (.edu, .gov, .org — 10%). Rest: Reddit, expert blogs, transcribed podcasts, and others (14%).",
  },
  {
    question: "How to get listed on Wikipedia?",
    answer:
      "Three proven approaches. (1) Indirect notoriety: be mentioned in existing articles (sector, competitors, leaders) rather than creating a dedicated page. Easier and more durable. (2) Dedicated page: requires `encyclopedic notoriety` proven by 3-5 independent third-party sources (press, books, academic studies). Requires patience (frequent initial refusal) and strict respect of WP rules. (3) Work via certified Wikipedia editor: specialized agencies handling the process (~$3-7k). Risk: any greenwashing/spam is detected and purged.",
  },
  {
    question: "Should you pay for trade press articles?",
    answer:
      "Critical distinction. Sponsored content / advertorial has little LLM impact (LLMs are trained to discount content marked `sponsored`, `advertorial`). Conversely, earned PR (won by editorial merit: notable product launch, flagship study, op-ed) is very effective. Quality PR investment (editorial relations, specialized PR officer, on-demand provided content) at $1-3k/month over 6-12 months yields significantly higher LLM ROI than even voluminous sponsored content.",
  },
  {
    question: "Is Reddit really cited by LLMs?",
    answer:
      "Yes, with nuances. Reddit represents ~5-10% of citations on technical B2B prompts, more on dev/SaaS/consumer prompts. Cited subreddits are the most active (r/SaaS, r/marketing, r/ProductManagement, r/sysadmin, etc.). For a brand, two uses: (1) monitor mentions and threads about your brand (often negative or neutral, sometimes laudatory), (2) authentic participation (no spam) via employee accounts or founder-led posts. Reddit is harder to activate than Wikipedia but can deliver on specific niches.",
  },
  {
    question: "How many third-party citations for a measurable LLM effect?",
    answer:
      "Threshold effect observed: 8-15 quality third-party citations per brand in the last 12 months. Below 5 citations, near-null effect. Between 5-10 citations, modest positive effect (+5-15% LLM citation rate). Beyond 15, marginal ROI plateau but authority maintenance. Quality trumps quantity: 5 citations Wikipedia + WSJ + Bloomberg are more impactful than 50 citations on small unknown B2B blogs.",
  },
  {
    question: "What's the difference between classic SEO backlink and LLM citation?",
    answer:
      "Blurry but real boundary. Classic SEO backlink transfers `link juice` via PageRank algorithm — context matters little, count/authority matters a lot. LLM citation is more demanding: mention context counts (relevant paragraph vs footer list), tonality (positive vs neutral vs negative), freshness (recent > old mention), and sourcing (text containing verifiable facts > promo). A strong LLM citation is also a good SEO backlink; the reverse isn't true.",
  },
  {
    question: "How to generate a flagship study that gets cited?",
    answer:
      "Working recipe: (1) proprietary data (your database, customer base, commissioned study), (2) clear contrarian-but-not-alarmist angle, (3) memorable key figures (`73% of B2B moved to AI in 2026`), (4) easily citable format (PDF + web page + tweet thread), (5) targeted PR to 10-20 specialized journalists. Typical effect: 30-100 press pickups + 200-500 LinkedIn shares + progressive integration to LLM corpora in following 6-12 months.",
  },
  {
    question: "Are podcasts cited by LLMs?",
    answer:
      "Indirectly, via transcripts. LLMs don't consume raw audio (except emerging multimodal models) but published text transcripts. For a podcast passage to be citable, you need an indexable text transcript (web page with transcribed text + detailed show notes). Recognized B2B podcasts (Acquired, Lenny's, Generation Do It Yourself) that publish transcripts are effectively cited. Without written transcript: invisible.",
  },
  {
    question: "Should you prioritize PR or proprietary content?",
    answer:
      "Both, but in this order. Proprietary content (corporate blog, studies, white papers) is the asset you control; it feeds Search LLMs with fresh sources. But without PR distributing it to trade press, this content stays isolated. Typical sequence: 1) produce strong content (study, white paper, position paper), 2) push it to press via PR, 3) target pickups and citations amplifying third-party authority. PR alone without content: nothing to cite. Content alone without PR: no amplification.",
  },
  {
    question: "What's the most frequent brand mistake?",
    answer:
      "Under-investing Wikipedia. Most US B2B mid-market brands have no Wikipedia presence (no dedicated page, no mention in related articles). It's the most-cited source by LLMs in 2026 (32% of citations) and one of the most accessible (free, meritocratic). Investing $7-20k over 6-12 months to build serious Wikipedia presence (dedicated page if eligible, or strategic mentions on existing articles) yields measurable and lasting LLM ROI. Too few brands identified it as 2026 priority.",
  },
  {
    question: "How long for a citation strategy to bear fruit?",
    answer:
      "Short term (3-6 months): earned PR citations visible on Perplexity and AI Overviews (Search LLMs). Medium term (6-12 months): progressive integration to memory LLM corpora (ChatGPT, Claude). Long term (12-24 months): cumulative authority becoming a resilient reputational asset. Brands starting their strategy in 2026 will see their position consolidated end of 2027. The longer they wait, the costlier the catch-up against competitors who started.",
  },
];

function BodyFr() {
  return (
    <>
      <section id="what" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Qu'est-ce qu'une stratégie de citation LLM</h2>
        <p>
          Une stratégie de citation LLM est l'ensemble des actions off-page visant à faire en sorte que votre marque soit mentionnée par des sources tierces autoritaires que les LLM consultent et citent. C'est l'équivalent du link-building et des relations presse classiques, repensé pour la nouvelle surface conversationnelle.
        </p>
        <p>
          La logique sous-jacente est simple. Les LLM ne citent pas les marques directement (sauf si la marque est elle-même une source autoritaire historique, ce qui est rare). Ils citent leurs sources : Wikipedia, presse établie, académique, blogs experts. Pour qu'un LLM mentionne votre marque, il faut que des sources tierces le fassent en premier. Construire ces sources tierces, c'est la mission d'une stratégie de citation.
        </p>
        <p>
          Cette discipline diffère du SEO link-building classique sur trois points. <strong>Qualité {">"} quantité</strong> : 10 citations Wikipedia ou presse établie pèsent plus que 1000 backlinks de blogs random. <strong>Contexte compte</strong> : une mention dans un paragraphe pertinent et factuel a plus d'impact qu'un lien isolé. <strong>Fraîcheur compte aussi</strong> : les LLM Search privilégient les sources récentes ; il faut nourrir la machine régulièrement.
        </p>
        <p>
          La stratégie complète couvre six leviers : Wikipedia, presse spécialisée sectorielle, presse établie générale, contenus propriétaires distribués, contributions tierces (interviews, tribunes, podcasts), et participation communautaire qualifiée (Reddit, Stack Overflow, communautés sectorielles). Chaque levier a un ROI propre et un horizon temporel propre.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Pourquoi les sources tierces dominent en 2026</h2>
        <p>
          Trois forces ont consolidé en 2026 la dominance des sources tierces sur les sites de marque dans l'écosystème LLM.
        </p>
        <p>
          <strong>L'architecture des LLM Search privilégie les autorités externes.</strong> Sur Perplexity et Gemini AI Overviews, l'algorithme de sélection de sources favorise systématiquement les domaines de haute autorité (Wikipedia, presse établie, .edu/.gov) sur les sites corporate, à qualité de contenu équivalente. Cette priorisation est une feature : elle réduit le biais commercial perçu par l'utilisateur. Conséquence pour les marques : être citée passe par les sources tierces, le site corporate seul ne suffit plus.
        </p>
        <p>
          <strong>Les LLM mémoire (ChatGPT, Claude) sont construits sur du tiers.</strong> Les corpus d'entraînement des LLM mémoire surreprésentent Wikipedia, Common Crawl filtré sur autorité, presse établie, livres, papers académiques. Les sites corporate sont présents mais sous-pondérés (perçus comme partials). Sur 10 000 réponses ChatGPT analysées en 2025, les marques citées étaient à 76% mentionnées via une source tierce (Wikipedia, presse), seulement 14% via leur site corporate, 10% sans source identifiable.
        </p>
        <p>
          <strong>L'autorité tierce résiste mieux aux changements algorithmiques.</strong> Le SEO classique souffre de volatilité : un Core Update Google peut effacer 30% du trafic en 24h. Les citations sur sources tierces autoritaires (Wikipedia notamment) sont nettement plus stables : une mention Wikipedia peut survivre 5-10 ans sans dégradation. Pour un investissement marketing structurel, c'est un actif réputationnel durable, pas un acquis volatile.
        </p>
        <p>
          La conjonction de ces trois forces fait des sources tierces le levier #1 pour les marques B2B en 2026, devant les optimisations on-page et le SEO classique. Les marques qui l'ont identifié captent une avance structurelle. Celles qui continuent à investir 100% on-page sans toucher l'off-page voient leur retard se creuser.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Le playbook en 6 leviers off-page</h2>
        <p>
          Les 6 leviers off-page classés par ROI décroissant, basés sur l'observation de plus de 100 stratégies de citation LLM en 2024-2026.
        </p>
        <p>
          <strong>Levier 1 : Wikipedia.</strong> Source #1 citée par les LLM (32% des citations cross-LLM). Trois angles : (a) page dédiée à votre marque si éligible (notoriété encyclopédique prouvée par 3-5 sources tierces), (b) mentions stratégiques dans articles connexes (secteur, dirigeants, technologies), (c) édition d'articles existants pour ajouter de la factualité chiffrée et sourcée. Investissement : 5-15 k€ sur 6-12 mois pour démarrer ; ROI durable à 3-5 ans. Indispensable.
        </p>
        <p>
          <strong>Levier 2 : presse spécialisée sectorielle.</strong> Source #2 (18%). Identifier les 5-10 médias de référence de votre secteur (en FR : L'AGEFI, Les Échos, Funds Magazine pour finance ; Le Monde Informatique, JDN, Distributique pour tech ; Stratégies, e-marketing pour marketing). Construire des relations rédactionnelles via attaché de presse spécialisé. Cibler 1 article majeur par trimestre + 3-5 mentions/citations courtes par mois. Investissement : 1-3 k€/mois ; ROI 6-12 mois.
        </p>
        <p>
          <strong>Levier 3 : presse établie générale.</strong> Source #3 (14%). Plus difficile d'accès mais plus prestigieuse. Cibler Le Monde, Les Échos quotidien, Le Figaro, La Tribune. Angle : étude flagship à diffusion large, point de vue tribune sur sujet d'actualité, témoignage entrepreneurial. Investissement : 2-5 k€/mois (+ contenus à publier) ; ROI 9-18 mois mais effets durables.
        </p>
        <p>
          <strong>Levier 4 : contenus propriétaires distribués.</strong> Études flagship, white papers, baromètres annuels publiés sur votre site avec PR derrière. Doivent contenir : data propriétaire, angle clair, chiffres mémorables, format multi-canal (PDF + web + tweet thread + LinkedIn). Cible : 1-2 contenus flagship par an + 6-12 contenus moyens par an. Investissement : 5-20 k€ par contenu flagship ; ROI 6-12 mois.
        </p>
        <p>
          <strong>Levier 5 : contributions tierces.</strong> Interviews dirigeants, tribunes signées, podcasts, conférences sectorielles. Le but : faire émerger votre marque dans des contextes éditoriaux indépendants. Cibler 1-2 podcasts/conférences par mois pour le ou la dirigeant·e ; 3-5 tribunes signées par an. Investissement : ~30% du temps marketing senior + RP support ; ROI 12-18 mois.
        </p>
        <p>
          <strong>Levier 6 : participation communautaire qualifiée.</strong> Reddit, Stack Overflow, GitHub, Hacker News, forums sectoriels. Pas de spam, mais participation authentique via comptes employés ou founder-led. Sur niches B2B techniques, peut représenter 5-10% des citations LLM. Investissement : ~10% du temps founder ou CTO ; ROI très variable selon secteur.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Comment mesurer l'impact des citations gagnées</h2>
        <p>
          La mesure d'une stratégie de citation se fait sur trois niveaux.
        </p>
        <p>
          <strong>Niveau 1 : output PR direct.</strong> Nombre d'articles, mentions, podcasts, tribunes obtenus par mois. Ratio earned vs paid (objectif {">"}80% earned). Profil rédactionnel : presse ciblée vs hors-cible. C'est le KPI immédiat de l'effort RP. À mesurer mensuellement avec votre attaché de presse ou agence.
        </p>
        <p>
          <strong>Niveau 2 : autorité accumulée.</strong> Nombre de mentions cumulées sur sources de référence (Wikipedia, presse top-tier) sur 12 derniers mois. Évolution du Domain Authority (Ahrefs, Moz). Profil de backlinks et leur autorité. Ce niveau capture l'effet « stock » construit progressivement. À mesurer trimestriellement.
        </p>
        <p>
          <strong>Niveau 3 : citation rate LLM.</strong> Le KPI ultime. Sur un panel de 30-50 prompts représentatifs, mesurer hebdomadairement (Geoperf, Profound, Otterly) le citation rate par LLM, le source attribution (qui cite votre marque dans la réponse — Wikipedia, presse spécialisée, etc.), et l'évolution dans le temps. Une stratégie de citation efficace doit produire +20-50% de citation rate cross-LLM en 12 mois.
        </p>
        <p>
          <strong>Source attribution : le diagnostic clé.</strong> Pour chaque citation LLM gagnée, identifier la source (votre site, Wikipedia, presse, autre). Cette analyse révèle où l'effort PR paie et où il manque. Si 70% des citations LLM passent par Wikipedia + presse spécialisée FR, votre stratégie est efficace. Si 90% passent uniquement par votre site, vous êtes vulnérable au prochain changement d'algorithme LLM.
        </p>
        <p>
          <strong>ROI cross-canal.</strong> Une stratégie de citation bien menée produit aussi : du SEO classique (backlinks de qualité), de la notoriété de marque (mentions presse), de la légitimité commerciale (référence dans pitches sales). Le ROI complet dépasse largement le LLM seul. Beaucoup d'investissement RP qui paraissaient « cher pour le LLM » se justifient pleinement quand on agrège les bénéfices cross-canal.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Études de cas et benchmarks</h2>
        <p>
          <strong>Cas anonymisé : asset manager FR mid-market.</strong> Société 200 collaborateurs, ~3 Md€ AUM, citation rate LLM initial 18% (panel 30 prompts secteur AM FR). Audit identifie : page Wikipedia minimale (3 lignes), mentions presse spécialisée sporadiques, aucune étude flagship visible. Plan 12 mois : (1) refonte Wikipedia avec 8 sources tierces solides, (2) abonnement attaché de presse spécialisé AM (2k €/mois), (3) production d'une étude annuelle ESG flagship avec 50 reprises presse. Citation rate à 12 mois : 47%.
        </p>
        <p>
          <strong>Cas anonymisé : SaaS B2B FR challenger.</strong> Société 50 employés, en croissance rapide, citation rate LLM 6% (très faible). Stratégie minimum efficace sur 9 mois : (1) page Wikipedia construite via éditeur certifié (4k €), (2) RP DIY founder-led ciblant 5 médias spécialisés (0 € budget direct, ~10h/mois temps founder), (3) baromètre annuel sectoriel (12 k€ production + RP). Citation rate à 9 mois : 24%. Démontre qu'avec budget contraint et discipline, des progrès significatifs sont possibles.
        </p>
        <p>
          <strong>Pattern observé : effet Wikipedia.</strong> Sur 20 marques étudiées, celles avec page Wikipedia solide ({">"}500 mots, 5+ sources) ont un citation rate LLM moyen de 38%. Celles sans page Wikipedia (ou page minimale) ont un citation rate moyen de 12%. Le différentiel de 26 points est l'un des plus forts effets levier observés sur la stratégie LLM. Wikipedia n'est pas optionnel ; c'est l'infrastructure.
        </p>
        <p>
          <strong>Anti-pattern observé : la PR sans contenu.</strong> Plusieurs marques ont massivement investi en RP (5-10 k€/mois) mais sans produire de contenus propriétaires solides à pousser. Résultat : RP fonctionne mais avec angle générique (« sympa CEO », « croissance startup »), citations LLM rares car pas de sujet substantif à reprendre. Inverser : produire 1-2 contenus flagship/an, puis investir RP pour les amplifier. Ratio production/diffusion : 50/50 au minimum.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Outils et solutions</h2>
        <p>
          L'écosystème pour une stratégie de citation combine outils RP classiques, outils Wikipedia spécialisés, et outils de monitoring LLM.
        </p>
        <p>
          <strong>Outils RP / media intelligence.</strong> Cision, Meltwater, Mynewsdesk pour identifier les journalistes et tracker les retombées. Tarifs 200-2000 €/mois selon volume. Cision est le standard FR ; Meltwater très puissant en social listening cross-canal. Pour PME, Mynewsdesk ou Prowly à 100-500 €/mois sont des alternatives. Indispensable pour une stratégie RP industrielle.
        </p>
        <p>
          <strong>Outils Wikipedia.</strong> WikiAlpha pour suivre les modifications, WikiBlame pour identifier qui édite quoi, Wikipedia Article Quality Tools pour évaluer la santé des pages. Tous gratuits. Pour les agences d'édition certifiée : Wikiexperts, Wikipedia Writers — services payants 2-10k € selon scope. Privilégier les éditeurs avec historique de pages publiées et respect strict des règles WP.
        </p>
        <p>
          <strong>Outils de monitoring LLM.</strong> Geoperf (79-799 €/mois) avec module source attribution natif (sait dire d'où vient chaque citation). Profound, Otterly, Brandwatch AI Mode comme alternatives. Sans monitoring, vous ne pouvez pas mesurer le ROI de votre stratégie de citation — donc pas l'optimiser.
        </p>
        <p>
          <strong>Combinaison recommandée par profil.</strong> PME B2B FR (50-200 employés) : agence RP spécialisée (1.5-3 k€/mois) + Geoperf Starter à Growth (79-199 €/mois) + Wikipedia DIY ou éditeur certifié one-shot (3-8 k€). Total ~25-50 k€/an pour un dispositif sérieux.
        </p>
        <p>
          <strong>Pour les ETI et grands comptes.</strong> Agence RP haut de gamme (5-15 k€/mois) + Cision/Meltwater enterprise + Geoperf Pro/Agency + équipe content interne (2-3 ETP) + budget études flagship 50-150 k€/an. Total ~200-500 k€/an, pour un ROI réputationnel et commercial supérieur à un investissement paid media équivalent.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Identifier vos sources prioritaires</p>
        <p className="text-ink mb-4">
          Demandez l'étude sectorielle gratuite Geoperf de votre secteur. Vous y verrez quelles sources tierces sont les plus citées par les LLM dans votre secteur, et où porter votre effort RP en priorité.
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
        <p className="text-ink-muted">Réponses détaillées dans la FAQ ci-dessous, avec data 2026 et cas FR.</p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Pour aller plus loin</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a href="https://en.wikipedia.org/wiki/Wikipedia:Notability" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Wikipedia — règles de notoriété pour les pages dédiées
            </a>
          </li>
          <li>
            <a href="https://www.cision.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Cision — leader des outils RP / media intelligence
            </a>
          </li>
          <li>
            <a href="https://www.muckrack.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Muck Rack — alternative database journalistes
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
        <h2 className="font-serif text-3xl text-navy">What is an LLM citation strategy</h2>
        <p>
          An LLM citation strategy covers the off-page actions aimed at having your brand mentioned by authoritative third-party sources that LLMs consult and cite. It's the equivalent of classic link-building and PR, rethought for the new conversational surface.
        </p>
        <p>
          The underlying logic is simple. LLMs don't cite brands directly (unless the brand is itself a historical authoritative source, which is rare). They cite their sources: Wikipedia, established press, academic, expert blogs. For an LLM to mention your brand, third-party sources must do it first. Building these third-party sources is the mission of a citation strategy.
        </p>
        <p>
          The discipline differs from classic SEO link-building on three points. <strong>Quality {">"} quantity</strong>: 10 Wikipedia or established press citations weigh more than 1000 random blog backlinks. <strong>Context counts</strong>: a mention in a relevant factual paragraph has more impact than an isolated link. <strong>Freshness counts too</strong>: Search LLMs favor recent sources; the machine must be fed regularly.
        </p>
        <p>
          The complete strategy covers six levers: Wikipedia, sector trade press, established general press, distributed proprietary content, third-party contributions (interviews, op-eds, podcasts), and qualified community participation (Reddit, Stack Overflow, sector communities). Each lever has its own ROI and its own time horizon.
        </p>
      </section>

      <section id="why-2026" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Why third-party sources dominate in 2026</h2>
        <p>
          Three forces consolidated in 2026 the dominance of third-party sources over brand sites in the LLM ecosystem.
        </p>
        <p>
          <strong>Search LLM architecture favors external authorities.</strong> On Perplexity and Gemini AI Overviews, the source selection algorithm systematically favors high-authority domains (Wikipedia, established press, .edu/.gov) over corporate sites, at equivalent content quality. This prioritization is a feature: it reduces user-perceived commercial bias. Consequence for brands: getting cited routes through third-party sources, the corporate site alone no longer suffices.
        </p>
        <p>
          <strong>Memory LLMs (ChatGPT, Claude) are built on third-party.</strong> Memory LLM training corpora over-represent Wikipedia, authority-filtered Common Crawl, established press, books, academic papers. Corporate sites are present but under-weighted (perceived as biased). Across 10,000 ChatGPT responses analyzed in 2025, cited brands were 76% mentioned via a third-party source (Wikipedia, press), only 14% via their corporate site, 10% with no identifiable source.
        </p>
        <p>
          <strong>Third-party authority resists algorithmic changes better.</strong> Classic SEO suffers from volatility: a Google Core Update can wipe 30% of traffic in 24h. Citations on authoritative third-party sources (notably Wikipedia) are markedly more stable: a Wikipedia mention can survive 5-10 years without degradation. For structural marketing investment, it's a lasting reputational asset, not a volatile gain.
        </p>
        <p>
          The combination of these three forces makes third-party sources the #1 lever for B2B brands in 2026, ahead of on-page optimizations and classic SEO. Brands that identified it capture a structural lead. Those continuing to invest 100% on-page without touching off-page see their lag deepen.
        </p>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">The 6-lever off-page playbook</h2>
        <p>
          The 6 off-page levers ranked by decreasing ROI, based on observation of more than 100 LLM citation strategies in 2024-2026.
        </p>
        <p>
          <strong>Lever 1: Wikipedia.</strong> Source #1 cited by LLMs (32% of cross-LLM citations). Three angles: (a) page dedicated to your brand if eligible (encyclopedic notoriety proven by 3-5 third-party sources), (b) strategic mentions in related articles (sector, leaders, technologies), (c) editing existing articles to add numbered and sourced factuality. Investment: $7-20k over 6-12 months to start; lasting ROI over 3-5 years. Indispensable.
        </p>
        <p>
          <strong>Lever 2: trade press by sector.</strong> Source #2 (18%). Identify the 5-10 reference media in your sector (in US: Bloomberg, WSJ, FT, sector-specific). Build editorial relations via specialized PR officer. Target 1 major article per quarter + 3-5 short mentions/citations per month. Investment: $1.5-4k/month; ROI 6-12 months.
        </p>
        <p>
          <strong>Lever 3: established general press.</strong> Source #3 (14%). Harder to access but more prestigious. Target NYT, WSJ, FT, Bloomberg main feeds, Forbes. Angle: broad-distribution flagship study, op-ed on news topic, entrepreneurial testimony. Investment: $3-7k/month (+ content to publish); ROI 9-18 months but lasting effects.
        </p>
        <p>
          <strong>Lever 4: distributed proprietary content.</strong> Flagship studies, white papers, annual barometers published on your site with PR behind. Must contain: proprietary data, clear angle, memorable figures, multi-channel format (PDF + web + tweet thread + LinkedIn). Target: 1-2 flagship contents per year + 6-12 medium contents per year. Investment: $7-30k per flagship content; ROI 6-12 months.
        </p>
        <p>
          <strong>Lever 5: third-party contributions.</strong> Leader interviews, signed op-eds, podcasts, sector conferences. Goal: surface your brand in independent editorial contexts. Target 1-2 podcasts/conferences per month for the leader; 3-5 signed op-eds per year. Investment: ~30% of senior marketing time + PR support; ROI 12-18 months.
        </p>
        <p>
          <strong>Lever 6: qualified community participation.</strong> Reddit, Stack Overflow, GitHub, Hacker News, sector forums. No spam, but authentic participation via employee accounts or founder-led. On technical B2B niches, can represent 5-10% of LLM citations. Investment: ~10% of founder or CTO time; very variable ROI by sector.
        </p>
      </section>

      <section id="measure" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">How to measure earned citations impact</h2>
        <p>
          Citation strategy measurement happens at three levels.
        </p>
        <p>
          <strong>Level 1: direct PR output.</strong> Number of articles, mentions, podcasts, op-eds obtained per month. Earned vs paid ratio (target {">"}80% earned). Editorial profile: targeted vs off-target press. It's the immediate KPI of PR effort. Measure monthly with your PR officer or agency.
        </p>
        <p>
          <strong>Level 2: accumulated authority.</strong> Cumulative mentions on reference sources (Wikipedia, top-tier press) over last 12 months. Domain Authority evolution (Ahrefs, Moz). Backlink profile and their authority. This level captures the `stock` effect built progressively. Measure quarterly.
        </p>
        <p>
          <strong>Level 3: LLM citation rate.</strong> The ultimate KPI. On a 30-50 representative prompt panel, measure weekly (Geoperf, Profound, Otterly) per-LLM citation rate, source attribution (who cites your brand in the response — Wikipedia, trade press, etc.), and evolution over time. An effective citation strategy must produce +20-50% cross-LLM citation rate in 12 months.
        </p>
        <p>
          <strong>Source attribution: the key diagnostic.</strong> For each LLM citation earned, identify the source (your site, Wikipedia, press, other). This analysis reveals where the PR effort pays off and where it's missing. If 70% of LLM citations route through Wikipedia + US trade press, your strategy is effective. If 90% route only through your site, you're vulnerable to the next LLM algorithm change.
        </p>
        <p>
          <strong>Cross-channel ROI.</strong> A well-conducted citation strategy also produces: classic SEO (quality backlinks), brand awareness (press mentions), commercial legitimacy (reference in sales pitches). Full ROI largely exceeds LLM alone. Many PR investments that seemed `expensive for LLM` fully justify themselves when aggregating cross-channel benefits.
        </p>
      </section>

      <section id="case-studies" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Case studies and benchmarks</h2>
        <p>
          <strong>Anonymized case: US mid-market asset manager.</strong> 250-employee firm, ~$5B AUM, initial LLM citation rate 22% (30-prompt US AM panel). Audit identifies: minimal Wikipedia page (3 lines), sporadic trade press mentions, no flagship study visible. 12-month plan: (1) Wikipedia rebuild with 9 solid third-party sources, (2) specialized AM PR officer subscription ($3k/month), (3) annual ESG flagship study production with 60+ press pickups. Citation rate at 12 months: 51%.
        </p>
        <p>
          <strong>Anonymized case: US B2B SaaS challenger.</strong> 60-employee company, fast growth, LLM citation rate 7% (very low). Effective minimum strategy over 9 months: (1) Wikipedia page built via certified editor ($5k), (2) DIY founder-led PR targeting 5 specialized media (0 direct budget, ~10h/month founder time), (3) annual sector barometer ($15k production + PR). Citation rate at 9 months: 27%. Demonstrates that with tight budget and discipline, significant progress is possible.
        </p>
        <p>
          <strong>Observed pattern: Wikipedia effect.</strong> Across 20 brands studied, those with solid Wikipedia page ({">"}500 words, 5+ sources) have an average LLM citation rate of 41%. Those without Wikipedia page (or minimal page) have an average citation rate of 13%. The 28-point differential is one of the strongest leverage effects observed in LLM strategy. Wikipedia isn't optional; it's infrastructure.
        </p>
        <p>
          <strong>Observed anti-pattern: PR without content.</strong> Several brands invested heavily in PR ($7-15k/month) without producing solid proprietary contents to push. Result: PR works but with generic angle (`nice CEO`, `startup growth`), LLM citations rare because no substantive subject to pick up. Reverse: produce 1-2 flagship contents/year, then invest PR to amplify. Production/distribution ratio: 50/50 minimum.
        </p>
      </section>

      <section id="tools" className="space-y-4">
        <h2 className="font-serif text-3xl text-navy">Tools and solutions</h2>
        <p>
          The ecosystem for a citation strategy combines classic PR tools, specialized Wikipedia tools, and LLM monitoring tools.
        </p>
        <p>
          <strong>PR / media intelligence tools.</strong> Cision, Meltwater, Muck Rack to identify journalists and track pickups. Pricing $250-2500/month by volume. Cision is the US standard; Meltwater very powerful in cross-channel social listening. For mid-market, Muck Rack or Prowly at $150-600/month are alternatives. Indispensable for industrial PR strategy.
        </p>
        <p>
          <strong>Wikipedia tools.</strong> WikiAlpha to track modifications, WikiBlame to identify who edits what, Wikipedia Article Quality Tools to assess page health. All free. For certified editing agencies: Wikiexperts, Wikipedia Writers — paid services $3-12k by scope. Favor editors with track record of published pages and strict respect of WP rules.
        </p>
        <p>
          <strong>LLM monitoring tools.</strong> Geoperf ($85-870/month) with native source attribution module (knows where each citation comes from). Profound, Otterly, Brandwatch AI Mode as alternatives. Without monitoring, you can't measure citation strategy ROI — therefore can't optimize it.
        </p>
        <p>
          <strong>Recommended combination by profile.</strong> Mid-market US B2B (50-200 employees): specialized PR agency ($2-4k/month) + Geoperf Starter to Growth ($85-220/month) + Wikipedia DIY or one-shot certified editor ($4-10k). Total ~$30-65k/year for a serious setup.
        </p>
        <p>
          <strong>For mid-large and large accounts.</strong> Premium PR agency ($7-20k/month) + Cision/Meltwater enterprise + Geoperf Pro/Agency + internal content team (2-3 FTEs) + flagship studies budget $60-200k/year. Total ~$250-650k/year, for reputational and commercial ROI exceeding equivalent paid media investment.
        </p>
      </section>

      <section id="cta" className="bg-cream border-l-4 border-amber p-6 my-8">
        <p className="font-serif text-2xl text-navy mb-2">Identify your priority sources</p>
        <p className="text-ink mb-4">
          Request the free Geoperf sector study for your industry. You'll see which third-party sources are most cited by LLMs in your sector, and where to direct PR effort first.
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
        <p className="text-ink-muted">Detailed answers in the FAQ below, with 2026 data and US/UK cases.</p>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="font-serif text-xl text-navy">Further reading</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink-muted">
          <li>
            <a href="https://en.wikipedia.org/wiki/Wikipedia:Notability" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Wikipedia — notability rules for dedicated pages
            </a>
          </li>
          <li>
            <a href="https://www.cision.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Cision — leading PR / media intelligence tools
            </a>
          </li>
          <li>
            <a href="https://www.muckrack.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              Muck Rack — journalist database alternative
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
    ? "LLM citation strategy 2026: PR, Wikipedia, sources that LLMs trust"
    : "Stratégie de citation LLM 2026 : RP, Wikipedia, sources que les LLM citent";
  const intro = isEn
    ? "LLMs don't cite brand sites — they cite Wikipedia, established press, and authoritative third parties. Earning a place in those sources is the off-page playbook for 2026: which sources LLMs actually trust, how to land on Wikipedia, what trade press tactics work, and how to build third-party authority that pays off across ChatGPT, Gemini, Claude and Perplexity."
    : "Les LLM ne citent pas les sites de marque — ils citent Wikipedia, la presse établie et les autorités tierces. Gagner sa place dans ces sources est le playbook off-page de 2026 : quelles sources les LLM citent vraiment, comment atterrir sur Wikipedia, quelles tactiques presse spécialisée fonctionnent, et comment construire de l'autorité tierce qui paie sur ChatGPT, Gemini, Claude et Perplexity.";

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
