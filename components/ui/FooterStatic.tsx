// S28 hotfix — FooterStatic FR-only pour les routes hors [locale] (admin/*, app/*).
// Pas de hooks next-intl pour eviter le crash 500 hors RequestLocale provider.

import Link from "next/link";

type Props = {
  showLegalLinks?: boolean;
  optOutLine?: React.ReactNode;
};

export function Footer({ showLegalLinks = true, optOutLine }: Props) {
  return (
    <footer className="px-6 md:px-8 py-10 border-t border-DEFAULT text-xs text-ink-muted bg-white">
      <div className="max-w-6xl mx-auto space-y-3">
        <div>Geoperf est une marque de Jourdechance SAS, RCS Paris.</div>
        {optOutLine}
        {showLegalLinks && (
          <nav className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-DEFAULT">
            <Link href="/about" className="hover:text-ink hover:underline">A propos</Link>
            <Link href="/contact" className="hover:text-ink hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:text-ink hover:underline">Confidentialite</Link>
            <Link href="/terms" className="hover:text-ink hover:underline">Mentions legales</Link>
            <a
              href="mailto:contact@geoperf.com?subject=STOP"
              className="hover:text-ink hover:underline ml-auto"
            >
              Se desinscrire
            </a>
          </nav>
        )}
      </div>
    </footer>
  );
}
