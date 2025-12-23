import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Clock } from "lucide-react"
import type { HackathonData } from "./types"

interface SubmitDeliverablesCardProps {
  hackathon: HackathonData
}

export function SubmitDeliverablesCard({ hackathon }: SubmitDeliverablesCardProps) {
  return (
    <Card className="border-yellow-500/20 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          Submit Your Deliverables
        </CardTitle>
        <CardDescription>Upload your project deliverables before the deadline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Live Project Link</Label>
            <input
              type="url"
              placeholder="https://your-project-demo.com"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Codebase Link (GitHub)</Label>
            <input
              type="url"
              placeholder="https://github.com/username/repo"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
            />
          </div>
        </div>

        {hackathon.requireLinkedIn && hackathon.linkedInPostsRequired && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              LinkedIn Posts ({hackathon.linkedInPostsRequired} required)
            </Label>
            {Array.from({ length: hackathon.linkedInPostsRequired }).map((_, index) => (
              <input
                key={index}
                type="url"
                placeholder={`LinkedIn post ${index + 1}: https://linkedin.com/posts/...`}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
              />
            ))}
          </div>
        )}

        <Button className="w-full" size="lg">
          Submit Deliverables
        </Button>
      </CardContent>
    </Card>
  )
}

