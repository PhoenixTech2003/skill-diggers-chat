import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Calendar, Clock, Users, MapPin } from "lucide-react"
import type { HackathonData } from "./types"

interface KeyInfoGridProps {
  hackathon: HackathonData
}

export function KeyInfoGrid({ hackathon }: KeyInfoGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Registration Period</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {new Date(hackathon.registrationStart).toLocaleDateString()} -{" "}
            {new Date(hackathon.registrationEnd).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Event Dates</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {new Date(hackathon.hackathonStart).toLocaleDateString()} -{" "}
            {new Date(hackathon.hackathonEnd).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {hackathon.participantCount ?? 0} / {hackathon.maxParticipants} registered
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Location</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{hackathon.location}</p>
        </CardContent>
      </Card>
    </div>
  )
}

