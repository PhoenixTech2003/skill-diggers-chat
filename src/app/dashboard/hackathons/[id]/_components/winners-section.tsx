"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Trophy, Download, Share2, CheckCircle2, ExternalLink, Loader2 } from "lucide-react"
import type { HackathonData } from "./types"
import type { Id } from "../../../../../../convex/_generated/dataModel"

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
  const winners = useQuery(api.hackathon.getHackathonWinners, {
    hackathonId: hackathon._id as Id<"hackathons">,
  })

  // Check if user is a winner
  const userIsWinner = winners?.some((winner) => {
    // Check if current user is in the winner's members list
    // This is a simplified check - in a real app, you'd compare with actual user ID
    return false // TODO: Implement proper user winner check
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        Winners
      </h2>
      
      {winners === undefined ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ) : winners.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Winners will be announced soon</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {winners.map((winner) => (
            <Card key={winner._id} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary">{winner.position}</Badge>
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{winner.teamName}</CardTitle>
                <CardDescription className="font-semibold">
                  {winner.projectName || "Project"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Team Members:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {winner.members.map((member: string, idx: number) => (
                      <li key={idx}>• {member}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t space-y-2">
                  <a
                    href={winner.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Live Project
                  </a>
                  <a
                    href={winner.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View GitHub Repository
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onDownloadCertificate("winner", winner.position || undefined)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Certificate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onShareCertificate("winner", winner.position || undefined)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isWinner && !userIsWinner && (
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

