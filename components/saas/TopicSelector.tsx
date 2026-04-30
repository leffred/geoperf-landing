// Liste compacte des topics d'une brand. Lien vers chaque topic + lien admin.
// Affichée en haut de /app/brands/[id] et sur les vues additionnelles (sources, by-model, by-prompt).

import Link from "next/link";

type Topic = {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
};

type Props = {
  brandId: string;
  topics: Topic[];
  currentTopicId?: string | null;
  /** Si owner, affiche le bouton "+ Topic" */
  isOwner: boolean;
  /** Limite topics du tier ; affiche le compteur N/N */
  topicLimit: number;
};

export function TopicSelector({ brandId, topics, currentTopicId, isOwner, topicLimit }: Props) {
  const limitDisplay = topicLimit === 999 ? "∞" : String(topicLimit);
  return (
    <div className="bg-white p-4 mb-4 flex items-center gap-3 flex-wrap">
      <span className="font-mono text-xs uppercase tracking-widest text-navy-light shrink-0">Topics ({topics.length}/{limitDisplay})</span>
      <div className="flex flex-wrap gap-1.5 items-center flex-1 min-w-0">
        {topics.map(t => {
          const isCurrent = currentTopicId === t.id;
          return (
            <Link
              key={t.id}
              href={`/app/brands/${brandId}/topics/${t.id}`}
              className={`text-xs px-2.5 py-1 ${isCurrent ? "bg-navy text-white" : "bg-cream hover:bg-navy/5 text-navy"} ${t.is_default ? "border-l-2 border-amber" : ""}`}
            >
              {t.name}
            </Link>
          );
        })}
        <Link
          href={`/app/brands/${brandId}/topics`}
          className="text-xs px-2.5 py-1 text-ink-muted hover:text-navy underline"
        >
          Tout gérer
        </Link>
        {isOwner && topics.length < topicLimit && (
          <Link
            href={`/app/brands/${brandId}/topics/new`}
            className="text-xs px-2.5 py-1 bg-amber/30 hover:bg-amber/50 text-navy"
          >
            + Topic
          </Link>
        )}
      </div>
    </div>
  );
}
