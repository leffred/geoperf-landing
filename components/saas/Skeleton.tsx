// Loading skeletons. Couleurs design system : surface-2 pulse.

import type { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  w?: string;
  h?: string;
  circle?: boolean;
};

const BASE = "inline-block bg-surface-2 animate-pulse rounded-sm";

export function Skeleton({ className = "", w, h, circle = false }: SkeletonProps) {
  const style: CSSProperties = {};
  if (w) style.width = w;
  if (h) style.height = h;
  return <span className={`${BASE} ${circle ? "rounded-full" : ""} ${className}`} style={style} aria-hidden="true" />;
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-lg border border-DEFAULT p-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 px-3 py-3 border-b border-DEFAULT last:border-b-0">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              h="14px"
              w={j === 0 ? "30%" : `${10 + (j * 5) % 25}%`}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-DEFAULT shadow-card p-5 ${className}`}>
      <Skeleton w="40%" h="14px" className="mb-3" />
      <Skeleton w="80%" h="32px" className="mb-2 block" />
      <Skeleton w="60%" h="12px" className="block" />
    </div>
  );
}

export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-DEFAULT shadow-card p-5 ${className}`}>
      <Skeleton w="30%" h="14px" className="mb-4" />
      <div className="h-48 flex items-end gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} h={`${30 + ((i * 17) % 60)}%`} className="flex-1" />
        ))}
      </div>
    </div>
  );
}
