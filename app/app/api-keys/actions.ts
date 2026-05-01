"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createHash, randomBytes } from "node:crypto";
import { loadSaasContext } from "@/lib/saas-auth";
import { getServiceClient } from "@/lib/supabase";
import { cookies } from "next/headers";

const ALLOWED_TIERS = new Set(["agency"]);

function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function generateKey(): { full: string; prefix: string; hash: string } {
  // Format : gp_live_<24 hex>
  const random = randomBytes(12).toString("hex"); // 24 chars
  const full = `gp_live_${random}`;
  const prefix = full.slice(0, 12); // gp_live_xxxx (12 chars dont 4 du hash)
  const hash = sha256Hex(full);
  return { full, prefix, hash };
}

export async function createApiKey(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ALLOWED_TIERS.has(ctx.tier)) redirect("/app/api-keys?error=tier_too_low");
  if (!ctx.is_owner) redirect("/app/api-keys?error=not_owner");

  const name = String(formData.get("name") || "").trim().slice(0, 100);
  const writeScope = String(formData.get("write") || "") === "on";
  if (!name) redirect("/app/api-keys?error=missing_name");

  const sb = getServiceClient();

  // Limite : 10 clés actives max par user
  const { count } = await sb.from("saas_api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", ctx.user.id).is("revoked_at", null);
  if ((count ?? 0) >= 10) redirect("/app/api-keys?error=max_keys");

  const { full, prefix, hash } = generateKey();
  const scopes = writeScope ? ["read", "write"] : ["read"];

  const { error } = await sb.from("saas_api_keys").insert({
    user_id: ctx.user.id,
    key_prefix: prefix,
    key_hash: hash,
    name,
    scopes,
  });
  if (error) {
    console.error("[createApiKey]", error.message);
    redirect("/app/api-keys?error=insert_failed");
  }

  // Stocker la clé full dans un cookie httpOnly de courte durée pour l'afficher 1 fois après redirect
  // (impossible de l'afficher après cette session, par design)
  const cookieStore = await cookies();
  cookieStore.set({
    name: "saas_api_key_just_created",
    value: full,
    httpOnly: true,
    sameSite: "strict",
    path: "/app/api-keys",
    maxAge: 300, // 5 min
  });

  revalidatePath("/app/api-keys");
  redirect("/app/api-keys?created=1");
}

export async function revokeApiKey(formData: FormData) {
  const ctx = await loadSaasContext();
  if (!ALLOWED_TIERS.has(ctx.tier)) redirect("/app/api-keys?error=tier_too_low");
  if (!ctx.is_owner) redirect("/app/api-keys?error=not_owner");

  const id = String(formData.get("id") || "");
  if (!id) redirect("/app/api-keys");

  const sb = getServiceClient();
  await sb.from("saas_api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id).eq("user_id", ctx.user.id);

  revalidatePath("/app/api-keys");
  redirect("/app/api-keys?revoked=1");
}
