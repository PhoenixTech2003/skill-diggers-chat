import { Suspense } from "react"
import { HackathonDetails } from "./_components/hackathon-details"
import { LoadingSkeleton } from "./_components/loading-skeleton"

export default async function HackathonDetailsPage({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HackathonDetails hackathonId={id} />
    </Suspense>
  )
}
