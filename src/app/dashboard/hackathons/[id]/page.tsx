import { Suspense } from "react"
import { preloadQuery, fetchQuery } from "convex/nextjs"
import { api } from "../../../../../convex/_generated/api"
import { HackathonDetails } from "./_components/hackathon-details"
import { LoadingSkeleton } from "./_components/loading-skeleton"
import { getToken } from "~/lib/auth-server"
import { redirect } from "next/navigation"
import type { Id } from "../../../../../convex/_generated/dataModel"

export default async function HackathonDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Check authentication
  const token = await getToken()
  let isAdmin = false
  if (token) {
    const { sessionData } = await fetchQuery(api.users.getLoggedUserSession, {}, { token })
    if (sessionData?.user?.role === "admin") {
      isAdmin = true
    }
  }

  const preloadedHackathon = await preloadQuery(api.hackathon.getHackathonById, { hackathonId })

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HackathonDetails preloadedHackathon={preloadedHackathon} isAdmin={isAdmin} />
    </Suspense>
  )
}
