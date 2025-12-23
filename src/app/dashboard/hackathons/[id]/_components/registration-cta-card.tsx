import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import type { HackathonData } from "./types"

interface RegistrationCTACardProps {
  hackathon: HackathonData
  isRegistrationOpen: boolean
  isRegistered: boolean
  onRegisterClick: () => void
}

export function RegistrationCTACard({
  hackathon,
  isRegistrationOpen,
  isRegistered,
  onRegisterClick,
}: RegistrationCTACardProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Ready to Participate?</CardTitle>
        <CardDescription>
          {isRegistrationOpen ? "Register now and secure your spot!" : "Registration is currently closed"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          size="lg"
          disabled={
            !isRegistrationOpen ||
            (hackathon.participantCount ?? 0) >= hackathon.maxParticipants ||
            isRegistered
          }
          onClick={onRegisterClick}
        >
          {isRegistered
            ? "Already Registered"
            : hackathon.status === "closed"
              ? "Registration Closed"
              : hackathon.status === "upcoming"
                ? "Coming Soon"
                : (hackathon.participantCount ?? 0) >= hackathon.maxParticipants
                  ? "Fully Booked"
                  : "Register Now"}
        </Button>
      </CardContent>
    </Card>
  )
}

