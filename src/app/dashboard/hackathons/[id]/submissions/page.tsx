import { Suspense } from "react"
import { SubmissionsInterface } from "./_components/submissions-interface"
import { SubmissionsLoadingSkeleton } from "./_components/loading-skeleton"

export default async function HackathonSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <Suspense fallback={<SubmissionsLoadingSkeleton />}>
      <SubmissionsInterface hackathonId={id} />
    </Suspense>
  )
}
