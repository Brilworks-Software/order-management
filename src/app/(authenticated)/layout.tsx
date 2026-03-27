import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AuthLayoutClient } from "./layout-client"

import { AuthError } from "@/components/auth-error"

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await auth()
    if (!session?.user) redirect("/login")
    return <AuthLayoutClient>{children}</AuthLayoutClient>
  } catch (e) {
    if ((e as any)?.message === "NEXT_REDIRECT" || (e as any)?.digest?.includes("NEXT_REDIRECT")) {
      throw e;
    }
    const error = e as Error;
    console.error("Layout Session Error:", error);
    return <AuthError message={error.message || "Internal Server Error"} />
  }
}
