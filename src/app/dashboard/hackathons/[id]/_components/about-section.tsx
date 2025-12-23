import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { HackathonData } from "./types"

interface AboutSectionProps {
  hackathon: HackathonData
}

export function AboutSection({ hackathon }: AboutSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About This Hackathon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-line">{hackathon.fullDescription}</p>
      </CardContent>
    </Card>
  )
}

