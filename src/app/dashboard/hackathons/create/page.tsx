import { Suspense } from "react"
import { fetchQuery } from "convex/nextjs"
import { api } from "../../../../../convex/_generated/api"
import { getToken } from "~/lib/auth-server"
import { redirect } from "next/navigation"
import { CreateHackathonForm } from "./_components/create-hackathon-form"
import { CreateHackathonFormSkeleton } from "./_components/loading-skeleton"

export default async function CreateHackathonPage() {
  // Check authentication and admin access
  const token = await getToken()
  if (!token) {
    redirect("/auth/login")
  }

  const { sessionData, sessionDataError } = await fetchQuery(
    api.users.getLoggedUserSession,
    {},
    { token },
  )

  if (sessionDataError) {
    throw new Error(sessionDataError)
  }

  if (!sessionData?.session) {
    redirect("/auth/login")
  }

  if (sessionData?.user.role !== "admin") {
    redirect("/dashboard/hackathons")
  }

  return (
    <Suspense fallback={<CreateHackathonFormSkeleton />}>
      <CreateHackathonForm />
    </Suspense>
  )
}
