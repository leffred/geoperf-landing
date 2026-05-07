"use client";

// S27 — Combobox réutilisable avec autocomplete client-side.
// Filtre par contains (case-insensitive, accent-insensitive).
// Affiche les options par groupe (parent category).
// Output : input hidden compatible form submit (name + value = option.value).
//
// Usage :
//   <Combobox
//     name="sous_categorie_slug"
//     options={[{value:'computer-software', label:'Computer Software', group:'Technology & Software'}, ...]}
//     placeholder="Rechercher une activite..."
//     defaultValue="computer-software"
//     required
//   />

import { useState, useMemo, useRef, useEffect } from "react";

export type ComboboxOption = {
  value: string;
  label: string;
  group?: string;
};

type Props = {
  name: string;
  options: ComboboxOption[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
};

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function Combobox({ name, options, placeholder = "Rechercher...", defaultValue, required, className = "", onChange }: Props) {
  const initialOption = options.find(o => o.value === defaultValue);
  const [query, setQuery] = useState(initialOption?.label ?? "");
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter + group options based on query
  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return options.slice(0, 30); // Show top 30 if empty
    return options.filter(o =>
      normalize(o.label).includes(q) ||
      (o.group && normalize(o.group).includes(q))
    ).slice(0, 30);
  }, [query, options]);

  // Group filtered options by their group
  const grouped = useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const o of filtered) {
      const g = o.group ?? "—";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(o);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Reset highlight when filter changes
  useEffect(() => { setHighlightIdx(0); }, [query]);

  function selectOption(o: ComboboxOption) {
    setSelectedValue(o.value);
    setQuery(o.label);
    setIsOpen(false);
    onChange?.(o.value);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIdx]) selectOption(filtered[highlightIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input type="hidden" name={name} value={selectedValue} required={required} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        className="w-full text-sm bg-white px-3 py-2 rounded-md border border-DEFAULT focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none transition-colors"
      />
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-md border border-DEFAULT bg-white shadow-modal py-1"
          role="listbox"
        >
          {grouped.map(([groupName, items]) => (
            <li key={groupName} className="not-last:mb-1">
              {groupName !== "—" && (
                <div className="px-3 py-1 text-xs font-mono uppercase tracking-eyebrow text-ink-subtle bg-surface">
                  {groupName}
                </div>
              )}
              <ul>
                {items.map((o) => {
                  const globalIdx = filtered.indexOf(o);
                  const isHighlighted = globalIdx === highlightIdx;
                  return (
                    <li
                      key={o.value}
                      role="option"
                      aria-selected={selectedValue === o.value}
                      onMouseDown={(e) => { e.preventDefault(); selectOption(o); }}
                      onMouseEnter={() => setHighlightIdx(globalIdx)}
                      className={`px-3 py-1.5 text-sm cursor-pointer ${
                        isHighlighted ? "bg-brand-50 text-brand-600" : "text-ink hover:bg-surface"
                      } ${selectedValue === o.value ? "font-medium" : ""}`}
                    >
                      {o.label}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {isOpen && filtered.length === 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-md border border-DEFAULT bg-white shadow-modal px-3 py-2 text-sm text-ink-muted">
          Aucun resultat
        </div>
      )}
    </div>
  );
}
