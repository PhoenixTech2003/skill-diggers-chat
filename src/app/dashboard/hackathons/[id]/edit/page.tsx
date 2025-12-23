import { Suspense } from "react"
import { preloadQuery, fetchQuery } from "convex/nextjs"
import { api } from "../../../../../../convex/_generated/api"
import { getToken } from "~/lib/auth-server"
import { redirect } from "next/navigation"
import type { Id } from "../../../../../../convex/_generated/dataModel"
import { EditHackathonForm } from "./_components/edit-hackathon-form"
import { CreateHackathonFormSkeleton } from "../../create/_components/loading-skeleton"

export default async function EditHackathonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Validate the ID format
  let hackathonId: Id<"hackathons">
  try {
    hackathonId = id as Id<"hackathons">
  } catch {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Invalid Hackathon ID</h2>
          <p className="text-muted-foreground">The hackathon ID is invalid</p>
        </div>
      </div>
    )
  }

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

  const preloadedHackathon = await preloadQuery(api.hackathon.getHackathonById, { hackathonId })

  return (
    <Suspense fallback={<CreateHackathonFormSkeleton />}>
      <EditHackathonForm preloadedHackathon={preloadedHackathon} hackathonId={hackathonId} />
    </Suspense>
  )
}

