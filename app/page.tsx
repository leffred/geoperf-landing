// Home — Geoperf landing par défaut.
// Si un visiteur arrive sans token, on affiche une présentation publique courte.

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-8 py-6 border-b border-navy/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="font-serif text-2xl text-navy">Ge<span className="text-amber">·</span>perf</div>
          <a href="mailto:contact@geoperf.com" className="text-sm text-navy hover:underline">contact@geoperf.com</a>
        </div>
      </header>
      <section className="flex-1 px-8 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-navy-light uppercase mb-6">LLM Visibility Research</p>
          <h1 className="font-serif text-5xl text-navy leading-tight mb-6">
            Mesurez la perception de votre marque par les LLM<span className="text-amber">.</span>
          </h1>
          <p className="text-lg text-ink-muted mb-10 leading-relaxed">
            Geoperf publie des études sectorielles sur la façon dont ChatGPT, Gemini, Claude et Perplexity
            décrivent et classent les acteurs de votre industrie. Recevez gratuitement l'étude qui couvre votre secteur.
          </p>
          <a href="mailto:contact@geoperf.com?subject=Demande%20d%27%C3%A9tude%20sectorielle"
            className="inline-block bg-navy text-white px-8 py-4 font-medium hover:bg-navy-light transition">
            Demander l'étude de mon secteur
          </a>
        </div>
      </section>
      <footer className="px-8 py-8 border-t border-navy/10 text-xs text-ink-muted">
        <div className="max-w-5xl mx-auto">
          Geoperf est un produit de Jourdechance SAS · SIREN 838 114 619 · Boulogne-Billancourt
        </div>
      </footer>
    </main>
  );
}
