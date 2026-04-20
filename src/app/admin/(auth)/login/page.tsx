import { redirect } from "next/navigation";

/** Old URL; sign-in lives at `/admin`. */
export default function AdminLoginLegacyPage() {
  redirect("/admin");
}
