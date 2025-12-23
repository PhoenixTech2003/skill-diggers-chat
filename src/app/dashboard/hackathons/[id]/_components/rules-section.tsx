import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import type { HackathonData } from "./types"

interface RulesSectionProps {
  hackathon: HackathonData
}

export function RulesSection({ hackathon }: RulesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules & Guidelines</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {hackathon.rules?.map((rule: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{rule}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

