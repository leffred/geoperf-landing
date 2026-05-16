// app/app/settings/gsc/page.tsx
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { initGscOAuth, disconnectGsc, saveGscProperty } from "./actions";
import GscRefreshButton from "./GscRefreshButton";

export const metadata = { title: "Google Search Console — Geoperf" };

type GscSite = { siteUrl: string; permissionLevel: string };

export default async function GscSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const ctx = await loadSaasContext();
  const sb  = getServiceClient();
  const sp  = await searchParams;

  const { data: profile } = await sb
    .from("saas_profiles")
    .select("gsc_refresh_token, gsc_property_url, gsc_connected_at, gsc_sites")
    .eq("id", ctx.user.id)
    .maybeSingle();

  const isConnected = !!profile?.gsc_refresh_token;
  const connectedAt = profile?.gsc_connected_at
    ? new Date(profile.gsc_connected_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const sites: GscSite[] = Array.isArray(profile?.gsc_sites) ? profile.gsc_sites : [];

  const { data: topQueries } = await sb
    .from("client_gsc_data")
    .select("query, impressions, position, ctr")
    .eq("client_id", ctx.user.id)
    .gt("impressions", 10)
    .order("impressions", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Google Search Console</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Connectez votre GSC pour obtenir des suggestions de sujets basees sur vos donnees reelles.
        </p>
      </div>

      {sp.connected === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          Google Search Console connecte avec succes !
        </div>
      )}
      {sp.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Erreur : {sp.error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        {isConnected ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  <span className="text-green-600 mr-2">●</span>Connecte
                </p>
                {connectedAt && (
                  <p className="text-xs text-gray-400 mt-0.5">Depuis le {connectedAt}</p>
                )}
              </div>
              <form action={disconnectGsc}>
                <button type="submit" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                  Deconnecter
                </button>
              </form>
            </div>

            {/* Propriete active — statut visible */}
            {profile?.gsc_property_url && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                <span className="text-green-600 text-xs font-mono uppercase tracking-wide shrink-0">Actif</span>
                <span className="text-green-900 text-sm font-mono truncate">{profile.gsc_property_url}</span>
              </div>
            )}

            {/* Selecteur de propriete */}
            {sites.length > 0 ? (
              <form action={saveGscProperty} className="space-y-2">
                <label className="block text-xs font-mono uppercase text-gray-400 tracking-wide">
                  Changer de propriete
                </label>
                <div className="flex gap-2">
                  <select
                    name="property_url"
                    defaultValue={profile?.gsc_property_url ?? ""}
                    className="flex-1 bg-white px-3 py-2 rounded-md border border-gray-200 hover:border-gray-400 focus:border-blue-500 focus:outline-none text-sm text-gray-800 font-mono"
                  >
                    {sites.map((s) => (
                      <option key={s.siteUrl} value={s.siteUrl}>
                        {s.siteUrl}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm rounded-md transition-colors shrink-0"
                  >
                    Enregistrer
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  {sites.length} propriete{sites.length > 1 ? "s" : ""} disponible{sites.length > 1 ? "s" : ""} sur ce compte Google
                </p>
              </form>
            ) : (
              profile?.gsc_property_url && (
                <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
                  <span className="text-gray-500 text-xs uppercase tracking-wide">Propriete active</span>
                  <p className="font-mono text-gray-800 mt-1 truncate">{profile.gsc_property_url}</p>
                </div>
              )
            )}

            <GscRefreshButton />

            {topQueries && topQueries.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Top requetes importees</p>
                <div className="space-y-1">
                  {topQueries.map((q) => (
                    <div key={q.query} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700 truncate max-w-xs">{q.query}</span>
                      <span className="text-gray-400 text-xs ml-4 shrink-0">
                        {q.impressions} imp · pos {Number(q.position).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">G</div>
              <div>
                <p className="font-medium text-gray-900">Google Search Console</p>
                <p className="text-xs text-gray-400">Non connecte</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              En connectant GSC, Geoperf Content identifie automatiquement les requetes
              ou vous apparaissez en positions 5-20.
            </p>
            <form action={initGscOAuth}>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm">
                Connecter Google Search Console
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
