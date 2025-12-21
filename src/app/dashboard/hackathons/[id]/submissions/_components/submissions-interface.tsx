"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { Search, ExternalLink, Trophy, CheckCircle, Clock, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

interface SubmissionsInterfaceProps {
  hackathonId: string
}

interface Submission {
  id: number
  teamName: string
  type: "team" | "individual"
  members: string[]
  submittedAt: string
  deliverables: {
    liveLink: string
    githubLink: string
    linkedInPosts: string[]
  }
  position: string | null
}

// Mock submissions data
const submissionsData: Submission[] = [
  {
    id: 1,
    teamName: "Code Warriors",
    type: "team",
    members: ["Alice Johnson", "Bob Smith", "Carol Davis"],
    submittedAt: "2024-01-15T10:30:00",
    deliverables: {
      liveLink: "https://demo.codewarriors.com",
      githubLink: "https://github.com/codewarriors/hackathon-project",
      linkedInPosts: [
        "https://linkedin.com/posts/alice-hackathon-1",
        "https://linkedin.com/posts/alice-hackathon-2",
        "https://linkedin.com/posts/alice-hackathon-3",
      ],
    },
    position: null,
  },
  {
    id: 2,
    teamName: "Solo Developer",
    type: "individual",
    members: ["David Wilson"],
    submittedAt: "2024-01-15T14:20:00",
    deliverables: {
      liveLink: "https://my-awesome-project.vercel.app",
      githubLink: "https://github.com/david/hackathon-solo",
      linkedInPosts: [
        "https://linkedin.com/posts/david-hackathon-1",
        "https://linkedin.com/posts/david-hackathon-2",
        "https://linkedin.com/posts/david-hackathon-3",
      ],
    },
    position: null,
  },
  {
    id: 3,
    teamName: "Tech Innovators",
    type: "team",
    members: ["Emma Brown", "Frank Miller"],
    submittedAt: "2024-01-15T16:45:00",
    deliverables: {
      liveLink: "https://techinnovators.app",
      githubLink: "https://github.com/techinnovators/project",
      linkedInPosts: [
        "https://linkedin.com/posts/emma-hackathon-1",
        "https://linkedin.com/posts/emma-hackathon-2",
        "https://linkedin.com/posts/emma-hackathon-3",
      ],
    },
    position: null,
  },
]

export function SubmissionsInterface({ hackathonId }: SubmissionsInterfaceProps) {
  const [submissions, setSubmissions] = useState(submissionsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [resultsPublished, setResultsPublished] = useState(false)

  const filteredSubmissions = submissions.filter((submission) =>
    submission.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePositionChange = (submissionId: number, position: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, position: position === "none" ? null : position } : sub)),
    )
  }

  const handlePublishResults = () => {
    setResultsPublished(true)
    console.log(
      "Publishing results:",
      submissions.filter((s) => s.position),
    )
  }

  const assignedPositions = submissions.filter((s) => s.position).length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Hackathon Submissions</h1>
          <p className="text-muted-foreground">Review and assign positions to participants</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-base px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            {submissions.length} Submissions
          </Badge>
          <Button size="lg" disabled={assignedPositions === 0 || resultsPublished} onClick={handlePublishResults}>
            <Trophy className="h-4 w-4 mr-2" />
            {resultsPublished ? "Results Published" : "Publish Results"}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by team or participant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Banner */}
      {resultsPublished && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Results Published Successfully</p>
                <p className="text-sm text-muted-foreground">
                  Winners have been notified and certificates are available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="overflow-hidden">
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
                  onValueChange={(value) => handlePositionChange(submission.id, value)}
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
                            .join("")}
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
                    href={submission.deliverables.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Live Project</p>
                      <p className="text-xs text-muted-foreground truncate">{submission.deliverables.liveLink}</p>
                    </div>
                  </a>

                  <a
                    href={submission.deliverables.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">GitHub Repository</p>
                      <p className="text-xs text-muted-foreground truncate">{submission.deliverables.githubLink}</p>
                    </div>
                  </a>
                </div>

                {/* LinkedIn Posts */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    LinkedIn Posts ({submission.deliverables.linkedInPosts.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submission.deliverables.linkedInPosts.map((post, idx) => (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">No submissions found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "No participants have submitted yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
