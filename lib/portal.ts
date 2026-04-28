import { getServiceClient } from "./supabase";

export type PortalDashboard = {
  // Prospect
  prospect_id: string;
  tracking_token: string;
  first_name: string | null;
  full_name: string | null;
  email: string | null;
  title: string | null;
  status: string;
  download_at: string | null;
  last_engagement_at: string | null;
  // Company
  company_id: string;
  company_name: string;
  company_country: string | null;
  company_domain: string | null;
  company_description: string | null;
  // Report
  report_id: string;
  sous_categorie: string;
  html_url: string | null;
  pdf_url: string | null;
  // Ranking
  ranking_position: number;
  visibility_score: number;
  cited_by: Record<string, boolean>;
  avg_position_in_lists: number | null;
  source_count: number | null;
  market_rank_estimate: number | null;
  ai_saturation_gap: number | null;
  saturation_label: string;
  // Report stats
  report_total_companies: number;
  report_cited_by_4: number;
  report_cited_by_3: number;
};

export type CompanyActivity = {
  team_prospects_count: number;
  team_visits: number;
  team_downloads: number;
  team_engaged: number;
  team_last_activity: string | null;
};

export type Competitor = {
  competitor_name: string;
  competitor_country: string | null;
  competitor_rank: number;
  competitor_visibility: number;
  competitor_cited_by: Record<string, boolean>;
};

export type RecentEvent = {
  id: string;
  event_type: string;
  channel: string | null;
  created_at: string;
  metadata: any;
};

/** Loads everything the portal page needs in a few parallel queries. */
export async function loadPortalData(token: string): Promise<{
  dashboard: PortalDashboard;
  activity: CompanyActivity | null;
  competitors: Competitor[];
  events: RecentEvent[];
} | null> {
  if (!token || !/^[a-f0-9]{24}$/i.test(token)) return null;
  const sb = getServiceClient();

  const { data: dashboard, error: dErr } = await sb
    .from("v_portal_dashboard")
    .select("*")
    .eq("tracking_token", token)
    .maybeSingle();
  if (dErr || !dashboard) return null;
  const d = dashboard as PortalDashboard;

  const [activityRes, competitorsRes, eventsRes] = await Promise.all([
    sb.from("v_portal_company_activity").select("*").eq("company_id", d.company_id).maybeSingle(),
    sb
      .from("v_portal_competitors")
      .select("*")
      .eq("report_id", d.report_id)
      .eq("focus_company_id", d.company_id)
      .order("competitor_rank"),
    sb
      .from("prospect_events")
      .select("id, event_type, channel, created_at, metadata")
      .eq("prospect_id", d.prospect_id)
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  return {
    dashboard: d,
    activity: (activityRes.data as CompanyActivity) || null,
    competitors: (competitorsRes.data as Competitor[]) || [],
    events: (eventsRes.data as RecentEvent[]) || [],
  };
}

/** Recommendations actionnables basées sur le profil du prospect. */
export function buildRecommendations(d: PortalDashboard): Array<{
  priority: "high" | "medium" | "low";
  title: string;
  body: string;
}> {
  const recs: Array<{ priority: "high" | "medium" | "low"; title: string; body: string }> = [];

  // Recos sur les LLM qui ne citent pas
  const missingLLMs = Object.entries(d.cited_by || {})
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missingLLMs.length > 0) {
    const llmNames: Record<string, string> = {
      perplexity: "Perplexity",
      openai: "ChatGPT",
      google: "Gemini",
      anthropic: "Claude",
    };
    const labels = missingLLMs.map((k) => llmNames[k] || k).join(", ");
    recs.push({
      priority: "high",
      title: `${labels} ne vous cite pas`,
      body: `${d.company_name} est absent des résultats de ${labels} sur ce sujet. Cela représente une part importante du marché de la recherche IA. Action prioritaire : produire du contenu sur les sources que ${labels} indexe le plus (Wikipedia, FT, Bloomberg, Reuters, blogs sectoriels reconnus).`,
    });
  }

  // Reco sur saturation gap
  if (d.ai_saturation_gap != null && Number(d.ai_saturation_gap) >= 15) {
    recs.push({
      priority: "high",
      title: "Vous êtes sous-représenté par rapport à votre poids marché",
      body: `Votre rang IA est #${d.ranking_position} alors que votre rang marché estimé est #${d.market_rank_estimate}. C'est un gap de ${Number(d.ai_saturation_gap).toFixed(0)}%, qui indique que les LLM sous-estiment votre présence. Un audit GEO ciblé permet de fermer cet écart en 6-12 mois en travaillant les sources d'entraînement.`,
    });
  } else if (d.ai_saturation_gap != null && Number(d.ai_saturation_gap) <= -15) {
    recs.push({
      priority: "medium",
      title: "Vous êtes sur-représenté dans les LLM",
      body: `Bonne nouvelle : votre rang IA (#${d.ranking_position}) dépasse votre rang marché estimé (#${d.market_rank_estimate}). Le travail à mener est de défendre cette position face à la concurrence en surveillant les nouveaux entrants.`,
    });
  }

  // Reco sur sources
  if (d.source_count != null && Number(d.source_count) < 3) {
    recs.push({
      priority: "medium",
      title: "Peu de sources distinctes vous mentionnent",
      body: `Les LLM s'appuient sur ${d.source_count ?? 0} sources distinctes pour parler de ${d.company_name}. C'est faible — la diversification des sources améliore la stabilité de votre positionnement à travers les modèles. Cible : 8+ sources crédibles d'ici 6 mois.`,
    });
  }

  // Reco générique CTA audit
  recs.push({
    priority: "low",
    title: "Demander un audit personnalisé",
    body: `Geoperf propose un audit gratuit de 30 minutes pour identifier les 3 actions prioritaires spécifiques à ${d.company_name}. Le rapport d'audit (1 page) est livré sous 7 jours après le call.`,
  });

  return recs;
}
