"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Trophy, Clock, ExternalLink } from "lucide-react"
import type { Id } from "../../../../../../../convex/_generated/dataModel"

interface Submission {
  _id: Id<"hackathonSubmissions">
  teamName: string
  type: "team" | "individual"
  members: string[]
  submittedAt: number
  liveLink: string
  githubLink: string
  linkedInPosts: string[]
  position: "1st Place" | "2nd Place" | "3rd Place" | "Honorable Mention" | null
  resultsPublished?: boolean
}

interface SubmissionCardProps {
  submission: Submission
  resultsPublished: boolean
  onPositionChange: (submissionId: Id<"hackathonSubmissions">, position: string) => void
}

export function SubmissionCard({ submission, resultsPublished, onPositionChange }: SubmissionCardProps) {
  return (
    <Card key={submission._id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle>{submission.teamName}</CardTitle>
              <Badge variant={submission.type === "team" ? "default" : "secondary"}>{submission.type}</Badge>
              {submission.position && (
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Trophy className="h-3 w-3 mr-1" />
                  {submission.position}
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </CardDescription>
          </div>

          {/* Position Assignment */}
          <Select
            value={submission.position || "none"}
            onValueChange={(value) => onPositionChange(submission._id, value)}
            disabled={resultsPublished}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assign Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Position</SelectItem>
              <SelectItem value="1st Place">🥇 1st Place</SelectItem>
              <SelectItem value="2nd Place">🥈 2nd Place</SelectItem>
              <SelectItem value="3rd Place">🥉 3rd Place</SelectItem>
              <SelectItem value="Honorable Mention">⭐ Honorable Mention</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team Members */}
        <div>
          <p className="text-sm font-medium mb-2">Team Members</p>
          <div className="flex flex-wrap gap-2">
            {submission.members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${member}`} />
                  <AvatarFallback>
                    {member
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || member[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{member}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Deliverables</p>
          <div className="grid gap-3 md:grid-cols-2">
            <a
              href={submission.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Live Project</p>
                <p className="text-xs text-muted-foreground truncate">{submission.liveLink}</p>
              </div>
            </a>

            <a
              href={submission.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">GitHub Repository</p>
                <p className="text-xs text-muted-foreground truncate">{submission.githubLink}</p>
              </div>
            </a>
          </div>

          {/* LinkedIn Posts */}
          {submission.linkedInPosts.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">LinkedIn Posts ({submission.linkedInPosts.length})</p>
              <div className="flex flex-wrap gap-2">
                {submission.linkedInPosts.map((post, idx) => (
                  <a
                    key={idx}
                    href={post}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-card hover:bg-accent transition-colors text-sm"
                  >
                    Post {idx + 1}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

