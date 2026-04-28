// Server-only helper for Supabase Auth in Next.js App Router.
// Uses @supabase/ssr to read/write the auth cookie set by signInWithPassword.
// Import only from server components, route handlers, server actions, and middleware.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll() called from a Server Component is a no-op; that's fine
          // because middleware refreshes the session.
        }
      },
    },
  });
}

/**
 * Returns the current admin user (Supabase Auth user) or null if not logged in.
 * Use in server components and route handlers to gate access.
 */
export async function getAdminUser() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}
