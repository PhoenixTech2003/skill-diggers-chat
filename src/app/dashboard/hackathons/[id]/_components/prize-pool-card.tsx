import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Trophy } from "lucide-react"
import type { HackathonData } from "./types"

interface PrizePoolCardProps {
  hackathon: HackathonData
}

export function PrizePoolCard({ hackathon }: PrizePoolCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle>Prize Pool</CardTitle>
        </div>
        <CardDescription className="text-2xl font-bold text-foreground">{hackathon.prize}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {hackathon.prizes?.map((prize: { place: string; amount: string }, index: number) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm font-medium">{prize.place}</span>
              <span className="text-sm text-primary font-semibold">{prize.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

