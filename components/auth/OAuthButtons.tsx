// S31 — Boutons OAuth (Google + LinkedIn) pour /login et /signup.
// Server component : 2 forms POST vers les server actions signInWithGoogle / signInWithLinkedIn.
// Le provider Google et linkedin_oidc doivent être enabled côté Supabase Dashboard.

import { getTranslations } from "next-intl/server";
import { signInWithGoogle, signInWithLinkedIn } from "@/app/[locale]/login/actions";

type Props = {
  /** Path de redirect après auth réussie. Default: /app/dashboard. */
  next?: string;
};

export async function OAuthButtons({ next = "/app/dashboard" }: Props) {
  const t = await getTranslations("auth");
  return (
    <div className="space-y-2.5">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 bg-white border border-DEFAULT hover:border-strong text-ink text-sm font-medium px-4 py-2.5 rounded-md transition-colors duration-150 ease-out"
          aria-label={t("oauthGoogle")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{t("oauthGoogle")}</span>
        </button>
      </form>

      <form action={signInWithLinkedIn}>
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 bg-white border border-DEFAULT hover:border-strong text-ink text-sm font-medium px-4 py-2.5 rounded-md transition-colors duration-150 ease-out"
          aria-label={t("oauthLinkedin")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07s.93-2.06 2.06-2.06c1.14 0 2.07.93 2.07 2.06 0 1.14-.93 2.07-2.07 2.07zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
          </svg>
          <span>{t("oauthLinkedin")}</span>
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-DEFAULT" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-mono uppercase tracking-eyebrow text-ink-subtle">
            {t("oauthOrContinue")}
          </span>
        </div>
      </div>
    </div>
  );
}
