"use client"

import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { HackathonCard } from "./hackathon-card"
import { Plus } from "lucide-react"

// Mock data for hackathons
const hackathons = [
  {
    id: 1,
    title: "AI Innovation Challenge 2024",
    description: "Build the next generation of AI-powered applications using cutting-edge machine learning models.",
    registrationStart: "2024-02-01",
    registrationEnd: "2024-02-28",
    hackathonStart: "2024-03-01",
    hackathonEnd: "2024-03-03",
    participants: 245,
    maxParticipants: 500,
    status: "open",
    location: "Virtual",
    prize: "$10,000",
  },
  {
    id: 2,
    title: "Web3 Builders Summit",
    description: "Create decentralized applications and explore the future of the internet with blockchain technology.",
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
  },
  {
    id: 3,
    title: "Game Dev Jam",
    description: "48 hours to create an amazing game from scratch. Show off your creativity and technical skills.",
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
  },
  {
    id: 4,
    title: "Mobile App Marathon",
    description: "Design and develop innovative mobile applications that solve real-world problems.",
    registrationStart: "2024-03-01",
    registrationEnd: "2024-03-20",
    hackathonStart: "2024-03-25",
    hackathonEnd: "2024-03-27",
    participants: 0,
    maxParticipants: 400,
    status: "upcoming",
    location: "Virtual",
    prize: "$8,000",
  },
]

export function HackathonsInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch =
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && hackathon.status === activeTab
  })

  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Hackathons</h1>
          <p className="text-muted-foreground">Discover and join exciting coding competitions</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Hackathon
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search hackathons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap w-full h-auto min-h-9 sm:inline-flex sm:w-fit sm:flex-nowrap sm:h-9">
            <TabsTrigger value="all" className="sm:flex-1">All</TabsTrigger>
            <TabsTrigger value="open" className="sm:flex-1">Open</TabsTrigger>
            <TabsTrigger value="upcoming" className="sm:flex-1">Upcoming</TabsTrigger>
            <TabsTrigger value="closed" className="sm:flex-1">Closed</TabsTrigger>
            <TabsTrigger value="in-progress" className="sm:flex-1">In-Progress</TabsTrigger>
            <TabsTrigger value="completed" className="sm:flex-1">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} getStatusColor={getStatusColor} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
