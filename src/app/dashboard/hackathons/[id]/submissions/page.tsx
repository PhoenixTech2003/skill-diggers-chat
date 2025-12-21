import { Suspense } from "react"
import { SubmissionsInterface } from "./_components/submissions-interface"
import { SubmissionsLoadingSkeleton } from "./_components/loading-skeleton"

export default function HackathonSubmissionsPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<SubmissionsLoadingSkeleton />}>
      <SubmissionsInterface hackathonId={params.id} />
    </Suspense>
  )
}
