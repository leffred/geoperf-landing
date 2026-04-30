import Link from "next/link";

type Props = {
  showLegalLinks?: boolean;
  optOutLine?: React.ReactNode;
};

export function Footer({ showLegalLinks = true, optOutLine }: Props) {
  return (
    <footer className="px-6 md:px-8 py-10 border-t border-DEFAULT text-xs text-ink-muted bg-white">
      <div className="max-w-6xl mx-auto space-y-3">
        <div>
          Geoperf est un produit de Jourdechance SAS · SIREN 838 114 619 · RCS Nanterre · 31 rue Diaz, 92100 Boulogne-Billancourt
        </div>
        {optOutLine}
        {showLegalLinks && (
          <nav className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-DEFAULT">
            <Link href="/about" className="hover:text-ink hover:underline">À propos</Link>
            <Link href="/contact" className="hover:text-ink hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:text-ink hover:underline">Confidentialité</Link>
            <Link href="/terms" className="hover:text-ink hover:underline">CGU</Link>
            <a
              href="mailto:contact@geoperf.com?subject=STOP"
              className="hover:text-ink hover:underline ml-auto"
            >
              Désinscription
            </a>
          </nav>
        )}
      </div>
    </footer>
  );
}
