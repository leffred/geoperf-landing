// Pill réutilisable affichant un nom de marque avec sa couleur attribuée.
// Spec : SPRINTS_S8_S9_S10_PLAN.md S8.5
//
// Usage : <BrandPill name="AXA" /> ou <BrandPill name="AXA" domain="axa.fr" />.
// Si domain fourni, hash sur le domain (plus stable). Sinon hash sur le nom.

import { assignBrandColor } from "@/lib/brand-colors";

type Props = {
  name: string;
  /** Optional : si fourni, sert d'input au hash (plus stable que le nom seul) */
  domain?: string;
  size?: "xs" | "sm" | "md";
  /** Force "owner" → toujours navy (utiliser pour la marque principale de l'user) */
  asOwner?: boolean;
  className?: string;
  /** Si true : juste un dot coloré + texte au lieu d'un pill plein */
  dotOnly?: boolean;
};

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function BrandPill({ name, domain, size = "sm", asOwner = false, className = "", dotOnly = false }: Props) {
  const color = asOwner
    ? { hex: "#0A0E1A", bg: "bg-ink", text: "text-white", label: "ink" as const }
    : assignBrandColor(domain || name);

  if (dotOnly) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`} title={domain ? `${name} · ${domain}` : name}>
        <span
          className="inline-block w-2.5 h-2.5 rounded-sm"
          style={{ background: color.hex }}
          aria-hidden
        />
        <span className="text-xs font-medium">{name}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-block font-mono uppercase tracking-widest ${SIZE_CLASS[size]} ${color.bg} ${color.text} ${className}`}
      title={domain ? `${name} · ${domain}` : name}
    >
      {name}
    </span>
  );
}
