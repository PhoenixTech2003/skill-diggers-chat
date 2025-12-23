import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface AdminActionsCardProps {
  hackathonId: string
}

export function AdminActionsCard({ hackathonId }: AdminActionsCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/hackathons/${hackathonId}/submissions`}>
          <Button className="w-full" size="lg">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Submissions
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

