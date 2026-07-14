import { redirect } from "next/navigation";

/** Entry point → streaming home (no marketing landing). */
export default function RootPage() {
  redirect("/home");
}
