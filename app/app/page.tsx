// /app → redirige vers /app/dashboard (le layout protège déjà via middleware)
import { redirect } from "next/navigation";

export default function AppRoot() {
  redirect("/app/dashboard");
}
