import { Suspense } from "react"
import { HackathonsInterface } from "./_components/hackathons-interface"
import { LoadingSkeleton } from "./_components/loading-skeleton"

export default function HackathonsPage() {
  return (
      <Suspense fallback={<LoadingSkeleton />}>
        <HackathonsInterface />
      </Suspense>
  )
}
