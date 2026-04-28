// Page /merci servie après un download_completed.
// Le DownloadButton redirige vers /merci?p=prospect_id&format=pdf après le clic.

import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getServiceClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Merci — Geoperf",
  description: "Votre étude sectorielle a bien été téléchargée. Voici les prochaines étapes.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ p?: string; format?: string }> };

async function getProspectContext(prospectId: string | undefined) {
  if (!prospectId || !/^[0-9a-f-]{36}$/i.test(prospectId)) return null;
  const sb = getServiceClient();
  const { data } = await sb
    .from("prospects")
    .select("first_name, full_name, companies(nom), reports(sous_categorie)")
    .eq("id", prospectId)
    .maybeSingle();
  if (!data) return null;
  return {
    first_name: (data as any).first_name as string | null,
    full_name: (data as any).full_name as string | null,
    company_name: (data as any).companies?.nom || null,
    sous_categorie: (data as any).reports?.sous_categorie || null,
  };
}

export default async function MerciPage({ searchParams }: Props) {
  const { p, format } = await searchParams;
  const ctx = await getProspectContext(p);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo";

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <Section tone="navy" py="lg">
        <p className="font-mono text-xs tracking-widest text-amber uppercase mb-6">
          Téléchargement {format === "pdf" ? "PDF" : "HTML"} en cours
        </p>
        <h1 className="font-serif text-5xl leading-tight mb-6">
          Merci{ctx?.first_name ? ` ${ctx.first_name}` : ""}<span className="text-amber">.</span>
        </h1>
        <p className="text-xl opacity-85 max-w-2xl leading-relaxed font-serif">
          Votre étude{ctx?.sous_categorie ? ` ${ctx.sous_categorie}` : ""} est en cours de téléchargement.
          Si elle ne démarre pas, vérifiez votre dossier Téléchargements ou retournez sur la page précédente.
        </p>
      </Section>

      <Section py="lg">
        <h2 className="font-serif text-3xl text-navy mb-8">Et maintenant ?</h2>

        <div className="space-y-6">
          <div className="grid md:grid-cols-[60px_1fr] gap-6 items-start">
            <div className="font-serif text-4xl text-amber font-medium">01</div>
            <div>
              <h3 className="font-serif text-xl text-navy mb-2">Lisez la section "Top sociétés"</h3>
              <p className="text-ink-muted leading-relaxed">
                C'est là que vous verrez{ctx?.company_name ? ` exactement comment ${ctx.company_name} se positionne par rapport à vos concurrents directs` : " la pyramide complète des acteurs cités par les LLM"}.
                Notez les écarts entre les modèles : ils révèlent des opportunités de positionnement.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-[60px_1fr] gap-6 items-start">
            <div className="font-serif text-4xl text-amber font-medium">02</div>
            <div>
              <h3 className="font-serif text-xl text-navy mb-2">Réservez 30 min d'audit gratuit</h3>
              <p className="text-ink-muted leading-relaxed mb-4">
                On regarde ensemble les 3 actions concrètes prioritaires pour améliorer votre score IA dans les 6 prochains mois. Aucun engagement, aucun pitch déguisé.
              </p>
              <Button href={calendlyUrl} variant="secondary" size="md">
                Voir les créneaux
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-[60px_1fr] gap-6 items-start">
            <div className="font-serif text-4xl text-amber font-medium">03</div>
            <div>
              <h3 className="font-serif text-xl text-navy mb-2">Partagez l'étude</h3>
              <p className="text-ink-muted leading-relaxed mb-4">
                L'étude vous a éclairé ? Elle peut aussi intéresser votre équipe ou un pair sur LinkedIn.
                (Toutes les données sont libres de partage non-commercial.)
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://geoperf.com/sample")}`}
                  variant="ghost"
                  size="sm"
                >
                  Partager sur LinkedIn
                </Button>
                <Button
                  href="mailto:?subject=Étude%20Geoperf%20—%20perception%20LLM&body=Cette%20étude%20de%20Geoperf%20benchmark%20la%20perception%20des%20marques%20par%20ChatGPT%2C%20Gemini%2C%20Claude%20et%20Perplexity.%20https%3A//geoperf.com/sample"
                  variant="ghost"
                  size="sm"
                >
                  Partager par email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cream" py="md">
        <h2 className="font-serif text-2xl text-navy mb-3">Une question ?</h2>
        <p className="text-ink-muted leading-relaxed">
          Sur la méthodologie, les chiffres, les sources : <a href="mailto:contact@geoperf.com" className="text-navy-light underline">contact@geoperf.com</a>.
          Vous pouvez aussi répondre directement à l'email qui vous a amené ici.
        </p>
      </Section>

      <Footer />
    </main>
  );
}
