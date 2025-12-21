"use client"
import { Button } from "~/components/ui/button"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  CalendarPlus,
  Plus,
  X,
  Loader2,
} from "lucide-react"
import { CountdownClock } from "./countdown-clock"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

const addToGoogleCalendar = (hackathon: any) => {
  const startDate = new Date(hackathon.hackathonStart).toISOString().replace(/-|:|\.\d\d\d/g, "")
  const endDate = new Date(hackathon.hackathonEnd).toISOString().replace(/-|:|\.\d\d\d/g, "")
  const details = hackathon.fullDescription.slice(0, 200)
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(hackathon.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(hackathon.location)}`
  window.open(url, "_blank")
}

// Mock data
const hackathonsData = [
  {
    id: 1,
    title: "AI Innovation Challenge 2024",
    description: "Build the next generation of AI-powered applications using cutting-edge machine learning models.",
    fullDescription:
      "Join us for the AI Innovation Challenge 2024, where developers, data scientists, and AI enthusiasts come together to push the boundaries of artificial intelligence. This hackathon challenges you to create innovative AI-powered applications that solve real-world problems. Whether you're interested in natural language processing, computer vision, or predictive analytics, this is your opportunity to showcase your skills and creativity.\n\nParticipants will have access to cloud computing resources, pre-trained models, and mentorship from industry experts. Form teams or work solo to build something amazing!",
    registrationStart: "2024-02-01",
    registrationEnd: "2024-02-28",
    hackathonStart: "2024-03-01",
    hackathonEnd: "2024-03-03",
    participants: 245,
    maxParticipants: 500,
    status: "open",
    location: "Virtual",
    prize: "$10,000",
    rules: [
      "Teams of 1-4 members are allowed",
      "All code must be written during the hackathon period",
      "Open source libraries and frameworks are permitted",
      "Final submissions must include source code and a demo video",
      "Projects will be judged on innovation, technical complexity, and presentation",
    ],
    prizes: [
      { place: "1st Place", amount: "$5,000" },
      { place: "2nd Place", amount: "$3,000" },
      { place: "3rd Place", amount: "$2,000" },
    ],
    schedule: [
      { time: "March 1, 9:00 AM", event: "Opening Ceremony & Kickoff" },
      { time: "March 1, 10:00 AM", event: "Hacking Begins" },
      { time: "March 2, 2:00 PM", event: "Mentor Check-in Session" },
      { time: "March 3, 6:00 PM", event: "Submissions Due" },
      { time: "March 3, 7:00 PM", event: "Presentations & Judging" },
      { time: "March 3, 9:00 PM", event: "Winner Announcement" },
    ],
  },
  {
    id: 2,
    title: "Web3 Builders Summit",
    description: "Create decentralized applications and explore the future of the internet with blockchain technology.",
    fullDescription:
      "The Web3 Builders Summit brings together blockchain developers and crypto enthusiasts to build the decentralized future. Explore smart contracts, DeFi protocols, NFT platforms, and DAOs in this intensive hackathon experience.",
    registrationStart: "2024-01-15",
    registrationEnd: "2024-02-15",
    hackathonStart: "2024-02-20",
    hackathonEnd: "2024-02-22",
    participants: 180,
    maxParticipants: 300,
    status: "in-progress",
    location: "Hybrid",
    prize: "$5,000",
    requiresLinkedInPosts: true,
    linkedInPostsRequired: 3,
    rules: [
      "Must use blockchain technology",
      "Solo or team participation welcome",
      "Open source submission required",
      "Live demo required for final presentation",
      "Submit 3 LinkedIn posts about your progress",
    ],
    prizes: [
      { place: "1st Place", amount: "$3,000" },
      { place: "2nd Place", amount: "$2,000" },
    ],
    schedule: [
      { time: "Feb 20, 10:00 AM", event: "Opening & Team Formation" },
      { time: "Feb 20, 11:00 AM", event: "Start Building" },
      { time: "Feb 22, 5:00 PM", event: "Final Submissions" },
      { time: "Feb 22, 7:00 PM", event: "Awards Ceremony" },
    ],
  },
  {
    id: 3,
    title: "Game Dev Jam",
    description: "48 hours to create an amazing game from scratch. Show off your creativity and technical skills.",
    fullDescription:
      "The Game Dev Jam is an intensive 48-hour game development competition where creativity meets coding. Whether you're a seasoned game developer or just starting out, this is your chance to create something amazing from scratch. Participants can work solo or in teams to design, develop, and polish a complete game within the time limit.",
    registrationStart: "2024-01-01",
    registrationEnd: "2024-01-20",
    hackathonStart: "2024-01-25",
    hackathonEnd: "2024-01-27",
    participants: 150,
    maxParticipants: 150,
    status: "completed",
    location: "In-Person",
    prize: "5,000 points",
    prizeType: "points",
    rules: [
      "Games must be built during the 48-hour period",
      "All game assets must be original or properly licensed",
      "Any game engine or framework is allowed",
      "Teams of up to 4 members permitted",
      "Must include a playable demo",
    ],
    prizes: [
      { place: "1st Place", amount: "2,500 points" },
      { place: "2nd Place", amount: "1,500 points" },
      { place: "3rd Place", amount: "1,000 points" },
    ],
    schedule: [
      { time: "Jan 25, 9:00 AM", event: "Registration & Setup" },
      { time: "Jan 25, 10:00 AM", event: "Jam Begins" },
      { time: "Jan 26, 2:00 PM", event: "Midpoint Check-in" },
      { time: "Jan 27, 10:00 AM", event: "Submissions Close" },
      { time: "Jan 27, 11:00 AM", event: "Judging & Demos" },
      { time: "Jan 27, 4:00 PM", event: "Winners Announced" },
    ],
    winners: [
      {
        place: "1st Place",
        teamName: "Pixel Pioneers",
        members: ["Sarah Johnson", "Mike Chen", "Emily Davis"],
        prize: "2,500 points",
        projectName: "Quantum Quest",
      },
      {
        place: "2nd Place",
        teamName: "Code Crafters",
        members: ["Alex Thompson", "Jordan Lee"],
        prize: "1,500 points",
        projectName: "Shadow Realm",
      },
      {
        place: "3rd Place",
        teamName: "Bug Busters",
        members: ["Chris Martinez"],
        prize: "1,000 points",
        projectName: "Pixel Paradise",
      },
    ],
    allowTeams: true,
  },
]

interface HackathonDetailsProps {
  hackathonId: string
}

export function HackathonDetails({ hackathonId }: HackathonDetailsProps) {
  const hackathon = hackathonsData.find((h) => h.id === Number.parseInt(hackathonId))
  const currentUserId = "user123"
  const isWinner = false // Set to false to show participant certificate card
  const isAdmin = true // In real app, this would check user role

  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)
  const [registrationType, setRegistrationType] = useState<"individual" | "team">("individual")
  const [teamName, setTeamName] = useState("")
  const [teamMembers, setTeamMembers] = useState<string[]>([""])
  const [isRegistering, setIsRegistering] = useState(false)

  if (!hackathon) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Hackathon not found</h2>
          <p className="text-muted-foreground">The hackathon you're looking for doesn't exist</p>
        </div>
      </div>
    )
  }

  const isRegistrationOpen = hackathon.status === "open"
  const isInProgress = hackathon.status === "in-progress"
  const isCompleted = hackathon.status === "completed"
  const registrationEndDate = new Date(hackathon.registrationEnd)
  const hackathonEndDate = new Date(hackathon.hackathonEnd)

  const downloadCertificate = (type: "winner" | "participant", place?: string) => {
    console.log(`Downloading ${type} certificate${place ? ` for ${place}` : ""}`)
    // In real app, this would generate and download PDF
  }

  const shareCertificate = (type: "winner" | "participant", place?: string) => {
    const text =
      type === "winner" ? `I won ${place} at ${hackathon.title}! 🏆` : `I participated in ${hackathon.title}! 🎮`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const handleRegistration = async () => {
    setIsRegistering(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Registration data:", {
      hackathonId,
      type: registrationType,
      teamName: registrationType === "team" ? teamName : undefined,
      teamMembers: registrationType === "team" ? teamMembers.filter((m) => m.trim() !== "") : undefined,
    })

    setIsRegistering(false)
    setShowRegistrationDialog(false)
    // Reset form
    setRegistrationType("individual")
    setTeamName("")
    setTeamMembers([""])
  }

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ""])
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, value: string) => {
    const newMembers = [...teamMembers]
    newMembers[index] = value
    setTeamMembers(newMembers)
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header with Countdown */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-balance">{hackathon.title}</h1>
            <Badge
              className={
                hackathon.status === "open"
                  ? "bg-green-500/20 text-green-500"
                  : hackathon.status === "in-progress"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : hackathon.status === "completed"
                      ? "bg-purple-500/20 text-purple-500"
                      : hackathon.status === "upcoming"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-red-500/20 text-red-500"
              }
            >
              {hackathon.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">{hackathon.description}</p>
        </div>

        {isRegistrationOpen && <CountdownClock targetDate={registrationEndDate} label="Registration Ends In" />}
        {isInProgress && <CountdownClock targetDate={hackathonEndDate} label="Hackathon Ends In" />}
      </div>

      <Separator />

      {/* Key Information Grid */}
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
              {hackathon.participants} / {hackathon.maxParticipants} registered
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

      {isCompleted && hackathon.winners && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Winners
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {hackathon.winners.map((winner, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary">{winner.place}</Badge>
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{winner.teamName}</CardTitle>
                  <CardDescription className="font-semibold">{winner.projectName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Team Members:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {winner.members.map((member, idx) => (
                        <li key={idx}>• {member}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold">
                      Prize: <span className="text-primary">{winner.prize}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => downloadCertificate("winner", winner.place)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Certificate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => shareCertificate("winner", winner.place)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isWinner && (
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Your Participation Certificate
                </CardTitle>
                <CardDescription>Thank you for participating in {hackathon.title}!</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => downloadCertificate("participant")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => shareCertificate("participant")}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About This Hackathon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground whitespace-pre-line">{hackathon.fullDescription}</p>
            </CardContent>
          </Card>

          {/* Rules Section */}
          <Card>
            <CardHeader>
              <CardTitle>Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {hackathon.rules?.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Schedule Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Event Schedule</CardTitle>
                <Button variant="outline" size="sm" onClick={() => addToGoogleCalendar(hackathon)} className="gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hackathon.schedule?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {index < hackathon.schedule!.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-sm">{item.time}</p>
                      <p className="text-muted-foreground text-sm">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Prize Pool */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>Prize Pool</CardTitle>
              </div>
              <CardDescription className="text-2xl font-bold text-foreground">{hackathon.prize}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hackathon.prizes?.map((prize, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium">{prize.place}</span>
                    <span className="text-sm text-primary font-semibold">{prize.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registration CTA */}
          {!isCompleted && (
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
                  disabled={!isRegistrationOpen || hackathon.participants >= hackathon.maxParticipants}
                  onClick={() => setShowRegistrationDialog(true)}
                >
                  {hackathon.status === "closed"
                    ? "Registration Closed"
                    : hackathon.status === "upcoming"
                      ? "Coming Soon"
                      : hackathon.participants >= hackathon.maxParticipants
                        ? "Fully Booked"
                        : "Register Now"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Deliverables Section */}
          {isInProgress && (
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

                {hackathon.requiresLinkedInPosts && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      LinkedIn Posts ({hackathon.linkedInPostsRequired} required)
                    </Label>
                    {Array.from({ length: hackathon.linkedInPostsRequired! }).map((_, index) => (
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
          )}

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Have questions about this hackathon? Contact our support team for assistance.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/admin/hackathons/${hackathonId}/submissions`}>
                  <Button className="w-full" size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Submissions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for {hackathon.title}</DialogTitle>
            <DialogDescription>Complete your registration details to participate in this hackathon.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Registration Type */}
            {hackathon.allowTeams && (
              <div className="space-y-3">
                <Label>Registration Type</Label>
                <RadioGroup value={registrationType} onValueChange={(value: any) => setRegistrationType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-normal cursor-pointer">
                      Individual - Compete solo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="team" />
                    <Label htmlFor="team" className="font-normal cursor-pointer">
                      Team - Compete with a team
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Team Details */}
            {registrationType === "team" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    placeholder="Enter your team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Team Members (Email Addresses)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Member ${index + 1} email`}
                          type="email"
                          value={member}
                          onChange={(e) => updateTeamMember(index, e.target.value)}
                        />
                        {teamMembers.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeTeamMember(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Registration Summary */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h4 className="font-semibold text-sm">Registration Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Hackathon:</span> {hackathon.title}
                </p>
                <p>
                  <span className="font-medium text-foreground">Type:</span>{" "}
                  {registrationType === "team" ? `Team (${teamName || "Unnamed"})` : "Individual"}
                </p>
                <p>
                  <span className="font-medium text-foreground">Registration Period:</span>{" "}
                  {new Date(hackathon.registrationStart).toLocaleDateString()} -{" "}
                  {new Date(hackathon.registrationEnd).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-foreground">Event Dates:</span>{" "}
                  {new Date(hackathon.hackathonStart).toLocaleDateString()} -{" "}
                  {new Date(hackathon.hackathonEnd).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegistrationDialog(false)} disabled={isRegistering}>
              Cancel
            </Button>
            <Button onClick={handleRegistration} disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
