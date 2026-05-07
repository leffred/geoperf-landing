// S28 — i18n : Footer texte traduit + <Link> next-intl pour preserver la locale.

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  showLegalLinks?: boolean;
  optOutLine?: React.ReactNode;
};

export async function Footer({ showLegalLinks = true, optOutLine }: Props) {
  const t = await getTranslations("footer");
  return (
    <footer className="px-6 md:px-8 py-10 border-t border-DEFAULT text-xs text-ink-muted bg-white">
      <div className="max-w-6xl mx-auto space-y-3">
        <div>{t("company")}</div>
        {optOutLine}
        {showLegalLinks && (
          <nav className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-DEFAULT">
            <Link href="/about" className="hover:text-ink hover:underline">{t("about")}</Link>
            <Link href="/contact" className="hover:text-ink hover:underline">{t("contact")}</Link>
            <Link href="/privacy" className="hover:text-ink hover:underline">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-ink hover:underline">{t("terms")}</Link>
            <a
              href="mailto:contact@geoperf.com?subject=STOP"
              className="hover:text-ink hover:underline ml-auto"
            >
              {t("unsubscribe")}
            </a>
          </nav>
        )}
      </div>
    </footer>
  );
}
