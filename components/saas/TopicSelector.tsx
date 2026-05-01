// Sélecteur compact de topics. Style DS.

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
  isOwner: boolean;
  topicLimit: number;
};

export function TopicSelector({ brandId, topics, currentTopicId, isOwner, topicLimit }: Props) {
  const limitDisplay = topicLimit === 999 ? "∞" : String(topicLimit);
  return (
    <div className="bg-white rounded-lg border border-DEFAULT p-4 mb-6 flex items-center gap-3 flex-wrap">
      <span className="font-mono text-xs uppercase tracking-eyebrow text-brand-500 shrink-0">
        Topics ({topics.length}/{limitDisplay})
      </span>
      <div className="flex flex-wrap gap-1.5 items-center flex-1 min-w-0">
        {topics.map(t => {
          const isCurrent = currentTopicId === t.id;
          return (
            <Link
              key={t.id}
              href={`/app/brands/${brandId}/topics/${t.id}`}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors duration-150 ease-out ${
                isCurrent
                  ? "bg-ink text-white"
                  : "bg-surface text-ink hover:bg-surface-2"
              } ${t.is_default ? "border-l-2 border-brand-500" : ""}`}
            >
              {t.name}
            </Link>
          );
        })}
        <Link
          href={`/app/brands/${brandId}/topics`}
          className="text-xs px-2.5 py-1 text-ink-muted hover:text-ink underline"
        >
          Tout gérer
        </Link>
        {isOwner && topics.length < topicLimit && (
          <Link
            href={`/app/brands/${brandId}/topics/new`}
            className="text-xs px-2.5 py-1 rounded-md bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white transition-colors duration-150 ease-out"
          >
            + Topic
          </Link>
        )}
      </div>
    </div>
  );
}
