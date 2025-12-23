export type HackathonStatus = "open" | "upcoming" | "in-progress" | "completed" | "closed"

export interface HackathonData {
  _id: string
  title: string
  description: string
  fullDescription: string
  registrationStart: string
  registrationEnd: string
  hackathonStart: string
  hackathonEnd: string
  location: "virtual" | "in-person" | "hybrid"
  maxParticipants: number
  prize: string
  prizeType: "cash" | "points"
  status: HackathonStatus
  requireLinkedIn: boolean
  linkedInPostsRequired?: number
  allowTeams: boolean
  rules?: string[]
  prizes?: Array<{ place: string; amount: string }>
  schedule?: Array<{ time: string; event: string }>
  participantCount?: number
  isRegistered?: boolean
}

