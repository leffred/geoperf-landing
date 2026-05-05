// S20 §4.5 — Bandeau permanent affiché en haut de /app/* en mode demo.
// Server component utilisable dans le layout /app.

import Link from "next/link";

export function DemoBanner() {
  return (
    <div className="bg-amber/15 border-b border-amber/40 px-4 py-2 text-center text-xs text-ink">
      <span className="font-mono uppercase tracking-eyebrow text-brand-500 mr-2">Démo</span>
      <span>
        Vous explorez Geoperf en mode lecture seule avec des données fictives.{" "}
      </span>
      <Link
        href="/signup"
        className="font-medium text-brand-500 hover:underline"
      >
        Créer mon compte gratuit →
      </Link>
    </div>
  );
}
