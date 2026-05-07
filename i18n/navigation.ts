// S28 — next-intl Link/redirect/router/usePathname locale-aware.
// A consommer en Phase 2 pour remplacer les `<Link>`/`redirect` de next-vanilla
// dans les pages publiques. Phase 1 ne les utilise pas encore.

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, useRouter, usePathname, getPathname } =
  createNavigation(routing);
