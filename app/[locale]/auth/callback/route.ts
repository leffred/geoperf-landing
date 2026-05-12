// OAuth/magic-link callback. Exchanges the code in the URL for a session.
// Used by signup confirmation emails, magic links, and OAuth (Google + LinkedIn).
// S32 : applique les UTM first-touch depuis cookie au saas_profile après création (OAuth signup).

import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server-auth";
import { readUtmFromCookie } from "@/lib/utm";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=unknown", req.url));
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=unknown`, req.url));
  }

  // S32 : si UTM cookie présent ET user fraîchement créé, applique l'attribution
  // (RPC idempotente : ne touche pas si acquisition_source déjà set → first-touch préservé).
  const userId = data?.user?.id;
  if (userId) {
    const utm = await readUtmFromCookie();
    if (utm) {
      try {
        await supabase.rpc("apply_utm_attribution", { p_user_id: userId, p_utm: utm });
      } catch (e) {
        console.warn("[/auth/callback] apply_utm_attribution failed:", e);
      }
    }
  }

  // S32 Ticket 3 — signal "signup_complete" si user créé dans les 5 dernières minutes.
  // La page de destination monte un GtmPageEvent qui push l'event GA4 + nettoie l'URL.
  let finalNext = next;
  const createdAt = data?.user?.created_at;
  if (createdAt) {
    const ageMs = Date.now() - new Date(createdAt).getTime();
    if (ageMs < 5 * 60 * 1000) {
      const sep = next.includes("?") ? "&" : "?";
      finalNext = `${next}${sep}welcome=1`;
    }
  }

  return NextResponse.redirect(new URL(finalNext, req.url));
}
