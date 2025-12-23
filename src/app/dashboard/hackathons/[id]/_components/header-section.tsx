import { Badge } from "~/components/ui/badge"
import { CountdownClock } from "./countdown-clock"
import { getStatusColor } from "./utils"
import type { HackathonData } from "./types"

interface HeaderSectionProps {
  hackathon: HackathonData
  showRegistrationCountdown: boolean
  showHackathonCountdown: boolean
  registrationEndDate: Date
  hackathonEndDate: Date
}

export function HeaderSection({
  hackathon,
  showRegistrationCountdown,
  showHackathonCountdown,
  registrationEndDate,
  hackathonEndDate,
}: HeaderSectionProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-balance">{hackathon.title}</h1>
          <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
        </div>
        <p className="text-muted-foreground text-lg">{hackathon.description}</p>
      </div>

      {showRegistrationCountdown && (
        <CountdownClock targetDate={registrationEndDate} label="Registration Ends In" />
      )}
      {showHackathonCountdown && (
        <CountdownClock targetDate={hackathonEndDate} label="Hackathon Ends In" />
      )}
    </div>
  )
}

