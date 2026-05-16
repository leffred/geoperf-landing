// app/app/settings/gsc/page.tsx — Connexion Google Search Console
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { initGscOAuth, disconnectGsc } from "./actions";
import GscRefreshButton from "./GscRefreshButton";

export const metadata = { title: "Google Search Console — Geoperf" };

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
    .select("gsc_refresh_token, gsc_property_url, gsc_connected_at")
    .eq("id", ctx.user.id)
    .maybeSingle();

  const isConnected = !!profile?.gsc_refresh_token;
  const connectedAt = profile?.gsc_connected_at
    ? new Date(profile.gsc_connected_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  // Données GSC dispos pour aperçu
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
          Connectez votre GSC pour obtenir des suggestions de sujets basées sur vos données réelles.
        </p>
      </div>

      {/* Banners */}
      {sp.connected === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          ✅ Google Search Console connecté avec succès !
        </div>
      )}
      {sp.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          ❌ Erreur : {sp.error}. Réessayez ou contactez le support.
        </div>
      )}

      {/* Carte statut */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  <span className="text-green-600 mr-2">●</span>Connecté
                </p>
                {connectedAt && (
                  <p className="text-xs text-gray-400 mt-0.5">Depuis le {connectedAt}</p>
                )}
              </div>
              <form action={disconnectGsc}>
                <button
                  type="submit"
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Déconnecter
                </button>
              </form>
            </div>

            {profile?.gsc_property_url && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span className="text-gray-500 text-xs uppercase tracking-wide">Propriété active</span>
                <p className="font-mono text-gray-800 mt-1 truncate">{profile.gsc_property_url}</p>
              </div>
            )}

            {/* Bouton refresh */}
            <GscRefreshButton />

            {/* Aperçu top queries */}
            {topQueries && topQueries.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Top requêtes importées
                </p>
                <div className="space-y-1">
                  {topQueries.map((q) => (
                    <div
                      key={q.query}
                      className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0"
                    >
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
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                G
              </div>
              <div>
                <p className="font-medium text-gray-900">Google Search Console</p>
                <p className="text-xs text-gray-400">Non connecté</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              En connectant GSC, Geoperf Content identifie automatiquement les requêtes où vous
              apparaissez en positions 5–20 — des opportunités idéales pour créer du contenu GEO optimisé.
            </p>
            <form action={initGscOAuth}>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                Connecter Google Search Console
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
