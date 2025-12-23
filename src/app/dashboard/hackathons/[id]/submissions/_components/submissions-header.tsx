"use client"

import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Trophy, Users, Loader2 } from "lucide-react"

interface SubmissionsHeaderProps {
  totalSubmissions: number
  assignedPositions: number
  resultsPublished: boolean
  isPublishing: boolean
  onPublishResults: () => void
}

export function SubmissionsHeader({
  totalSubmissions,
  assignedPositions,
  resultsPublished,
  isPublishing,
  onPublishResults,
}: SubmissionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-balance">Hackathon Submissions</h1>
        <p className="text-muted-foreground">Review and assign positions to participants</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-base px-4 py-2">
          <Users className="h-4 w-4 mr-2" />
          {totalSubmissions} Submissions
        </Badge>
        <Button
          size="lg"
          disabled={assignedPositions === 0 || resultsPublished || isPublishing}
          onClick={onPublishResults}
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Trophy className="h-4 w-4 mr-2" />
              {resultsPublished ? "Results Published" : "Publish Results"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

