"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Étape 1 — génère l'URL OAuth Google et redirige
export async function initGscOAuth() {
  const ctx = await loadSaasContext();

  const session = await (await getSupabaseServerClient()).auth.getSession();
  const jwt = session.data.session?.access_token;
  if (!jwt) redirect("/auth/login");

  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/saas_gsc_oauth_init`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!res.ok) {
    redirect("/app/settings/gsc?error=init_failed");
  }

  const { url } = await res.json() as { url: string };
  redirect(url);
}

// Sélectionner une propriété GSC
export async function saveGscProperty(formData: FormData) {
  const propertyUrl = String(formData.get("property_url") ?? "").trim();
  if (!propertyUrl) return;

  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  await sb
    .from("saas_profiles")
    .update({ gsc_property_url: propertyUrl })
    .eq("id", ctx.user.id);

  revalidatePath("/app/settings/gsc");
  revalidatePath("/app/content/new");
}

// Déconnecter GSC
export async function disconnectGsc() {
  const ctx = await loadSaasContext();
  const sb = getServiceClient();

  await sb
    .from("saas_profiles")
    .update({
      gsc_refresh_token: null,
      gsc_property_url:  null,
      gsc_connected_at:  null,
    })
    .eq("id", ctx.user.id);

  revalidatePath("/app/settings/gsc");
  revalidatePath("/app/content/new");
  redirect("/app/settings/gsc");
}

// Rafraîchir les données GSC (fetch depuis l'API Google)
export type RefreshGscState = { ok: boolean; inserted?: number; error?: string };

export async function refreshGscData(
  _prev: RefreshGscState | undefined,
  _formData: FormData
): Promise<RefreshGscState> {
  const session = await (await getSupabaseServerClient()).auth.getSession();
  const jwt = session.data.session?.access_token;
  if (!jwt) return { ok: false, error: "not_authenticated" };

  try {
    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/saas_gsc_fetch_queries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(30_000),
      }
    );

    const data = await res.json() as { ok?: boolean; inserted?: number; error?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error ?? "fetch_failed" };
    }

    revalidatePath("/app/content/new");
    return { ok: true, inserted: data.inserted };
  } catch (e) {
    console.error("[refreshGscData]", e);
    return { ok: false, error: "network" };
  }
}
