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
    const isRedirect = e && typeof e === 'object' && (
      ('message' in e && e.message === "NEXT_REDIRECT") || 
      ('digest' in e && typeof e.digest === 'string' && e.digest.includes("NEXT_REDIRECT"))
    );
    if (isRedirect) {
      throw e;
    }
    const error = e as Error;
    console.error("Layout Session Error:", error);
    return <AuthError message={error.message || "Internal Server Error"} />
  }
}
