import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "À propos — Geoperf",
  description: "Geoperf mesure et améliore le référencement de votre marque dans les LLM. Une méthode, quatre modèles, des chiffres incontestables.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <Section tone="navy" py="lg" eyebrow="À propos">
        <h1 className="font-serif text-5xl leading-tight mb-6">
          Mesurer ce que les IA disent de votre marque<span className="text-amber">.</span>
        </h1>
        <p className="text-xl opacity-85 max-w-2xl leading-relaxed font-serif">
          ChatGPT, Gemini, Claude et Perplexity sont devenus la nouvelle porte d'entrée des décisions B2B.
          Pourtant, aucun outil ne mesurait jusqu'ici comment ces modèles décrivent votre marque.
          Geoperf répond à ce vide.
        </p>
      </Section>

      <Section py="lg">
        <h2 className="font-serif text-3xl text-navy mb-6">Notre méthode</h2>
        <div className="space-y-4 text-ink leading-relaxed">
          <p>
            Pour chaque secteur étudié, Geoperf interroge en parallèle les quatre LLM majeurs avec un prompt
            structuré identique : "Quelles sont les sociétés majeures de ce secteur en 2026 ?"
          </p>
          <p>
            Les réponses sont consolidées, dédoublonnées et scorées : chaque société reçoit un <strong>score de
            visibilité IA</strong> de 0 à 4 — le nombre de modèles qui la citent spontanément. C'est ce score qui
            structure nos études.
          </p>
          <p>
            Le résultat : un benchmark inter-LLM honnête, reproductible, et qui révèle ce qu'aucun outil SEO
            classique ne mesure : la perception générative.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <Stat label="LLM analysés" value="4" variant="highlight" />
          <Stat label="Études publiées" value="1" />
          <Stat label="Sociétés benchmarkées" value="14" />
          <Stat label="Mises à jour / an" value="2" />
        </div>
      </Section>

      <Section tone="cream" py="lg">
        <h2 className="font-serif text-3xl text-navy mb-6">Qui est derrière Geoperf ?</h2>
        <p className="text-ink leading-relaxed mb-4">
          Geoperf est un produit de <strong>Jourdechance SAS</strong>, société française fondée en 2018 et basée à
          Boulogne-Billancourt. Jourdechance accompagne les marques B2B depuis huit ans sur leurs problématiques
          digitales et data.
        </p>
        <p className="text-ink leading-relaxed">
          Le projet Geoperf est né en 2026 du constat suivant : les directeurs marketing investissent massivement
          dans le SEO classique mais n'ont aucune visibilité sur leur référencement génératif, alors même que les
          LLM deviennent l'interface principale de la recherche d'information professionnelle.
        </p>
      </Section>

      <Section py="lg">
        <h2 className="font-serif text-3xl text-navy mb-6">Pour qui ?</h2>
        <ul className="space-y-3 text-ink leading-relaxed">
          <li>
            <strong>CMO et Directeurs Marketing</strong> qui veulent un benchmark concret de leur visibilité IA versus
            leurs concurrents.
          </li>
          <li>
            <strong>Heads of Brand et Heads of Communications</strong> qui mesurent le brand equity et veulent
            étendre leur lecture aux nouvelles surfaces.
          </li>
          <li>
            <strong>Heads of Digital Marketing</strong> qui voient le SEO classique perdre du poids et cherchent
            le prochain levier d'acquisition organique.
          </li>
        </ul>
      </Section>

      <Section tone="navy" py="lg">
        <h2 className="font-serif text-3xl mb-4 text-white">Demander une étude</h2>
        <p className="text-lg opacity-85 mb-8 max-w-xl">
          Vous voulez l'étude qui couvre votre secteur ? Ou un audit personnalisé de votre positionnement IA ?
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button href="/contact" variant="primary" size="lg">Nous écrire</Button>
          <Button
            href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/jourdechance/audit-geo"}
            variant="outline-light"
            size="lg"
          >
            Réserver 30 min
          </Button>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
