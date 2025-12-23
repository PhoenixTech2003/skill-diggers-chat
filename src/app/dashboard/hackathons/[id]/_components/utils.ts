import type { HackathonData } from "./types"

export const addToGoogleCalendar = (hackathon: {
  title: string
  hackathonStart: string
  hackathonEnd: string
  fullDescription: string
  location: string
}) => {
  const startDate = new Date(hackathon.hackathonStart).toISOString().replace(/-|:|\.\d\d\d/g, "")
  const endDate = new Date(hackathon.hackathonEnd).toISOString().replace(/-|:|\.\d\d\d/g, "")
  const details = hackathon.fullDescription.slice(0, 200)
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(hackathon.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(hackathon.location)}`
  window.open(url, "_blank")
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-green-500/20 text-green-500"
    case "in-progress":
      return "bg-yellow-500/20 text-yellow-500"
    case "completed":
      return "bg-purple-500/20 text-purple-500"
    case "closed":
      return "bg-red-500/20 text-red-500"
    case "upcoming":
      return "bg-blue-500/20 text-blue-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

