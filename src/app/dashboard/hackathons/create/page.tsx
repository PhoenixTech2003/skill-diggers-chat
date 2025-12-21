import { Suspense } from "react"
import { CreateHackathonForm } from "./_components/create-hackathon-form"
import { CreateHackathonFormSkeleton } from "./_components/loading-skeleton"

export default function CreateHackathonPage() {
  return (
    <Suspense fallback={<CreateHackathonFormSkeleton />}>
      <CreateHackathonForm />
    </Suspense>
  )
}
