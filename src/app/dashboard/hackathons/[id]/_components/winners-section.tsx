import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Trophy, Download, Share2, CheckCircle2 } from "lucide-react"
import type { HackathonData } from "./types"

interface WinnersSectionProps {
  hackathon: HackathonData
  isWinner: boolean
  onDownloadCertificate: (type: "winner" | "participant", place?: string) => void
  onShareCertificate: (type: "winner" | "participant", place?: string) => void
}

export function WinnersSection({
  hackathon,
  isWinner,
  onDownloadCertificate,
  onShareCertificate,
}: WinnersSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        Winners
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {/* TODO: Fetch winners from submissions when implemented */}
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Winners will be announced soon</p>
          </CardContent>
        </Card>
      </div>

      {!isWinner && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Your Participation Certificate
            </CardTitle>
            <CardDescription>Thank you for participating in {hackathon.title}!</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onDownloadCertificate("participant")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onShareCertificate("participant")}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Achievement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

