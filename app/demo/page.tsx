// S20 §4.5 — Page /demo : auto-login utilisateur demo, redirect /app/dashboard.
// Server component qui appelle saas_demo_login (service-role mint JWT) puis pose le
// cookie via createServerClient, et redirect.
//
// SEO : indexable, priority 0.9 dans sitemap (cf S20 brief).
//
// Securite : bandeau readonly + middleware bloque mutations (cf middleware.ts).

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Démo Geoperf — Découvrez le SaaS sans inscription",
  description:
    "Explorez Geoperf en mode démo : 6 mois de données fictives sur Demo Corp, 4 LLM, 26 snapshots hebdomadaires. Aucune inscription requise.",
  alternates: { canonical: "https://geoperf.com/demo" },
};

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function fetchDemoSession(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/saas_demo_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // anon key suffit (la function est deployee --no-verify-jwt)
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: "{}",
      cache: "no-store",
    });
    if (!resp.ok) {
      console.error("[/demo] saas_demo_login failed:", resp.status, await resp.text());
      return null;
    }
    const json = await resp.json();
    if (!json.access_token || !json.refresh_token) return null;
    return { access_token: json.access_token, refresh_token: json.refresh_token };
  } catch (e) {
    console.error("[/demo] fetch err:", e);
    return null;
  }
}

export default async function DemoPage() {
  const cookieStore = await cookies();

  // Si deja une session, redirect direct
  const existing = cookieStore.get("sb-access-token") || cookieStore.get("supabase-auth-token");
  if (existing) {
    redirect("/app/dashboard?demo=1");
  }

  const session = await fetchDemoSession();
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-medium text-ink mb-3">Démo indisponible</h1>
          <p className="text-sm text-ink-muted mb-6">
            Le compte démo n&apos;est pas accessible pour le moment. Vous pouvez créer un
            compte gratuit pour tester Geoperf.
          </p>
          <a
            href="/signup"
            className="inline-block bg-ink text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-ink/90"
          >
            Créer un compte gratuit
          </a>
        </div>
      </main>
    );
  }

  // Pose le cookie de session via createServerClient (qui ecrit sb-{ref}-auth-token)
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, {
            ...(options ?? {}),
            sameSite: "lax",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
        });
      },
    },
  });

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  redirect("/app/dashboard?demo=1");
}
