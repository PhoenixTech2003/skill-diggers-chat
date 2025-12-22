"use client"

import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { HackathonCard } from "./hackathon-card"
import { Plus } from "lucide-react"
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";

export function HackathonsInterface() {
  const {results, status, loadMore} = usePaginatedQuery(api.hackathon.getHackathons,{},{initialNumItems:5})
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Transform database results to match HackathonCard interface
  const transformedHackathons = (results ?? []).map((hackathon) => ({
    id: hackathon._id as string,
    title: hackathon.title,
    description: hackathon.description,
    registrationStart: hackathon.registrationStart,
    registrationEnd: hackathon.registrationEnd,
    hackathonStart: hackathon.hackathonStart,
    hackathonEnd: hackathon.hackathonEnd,
    participants: 0, // TODO: Calculate from registrations
    maxParticipants: hackathon.maxParticipants,
    status: hackathon.status,
    location: hackathon.location,
    prize: hackathon.prize,
    requiresLinkedInPosts: hackathon.requireLinkedIn,
    linkedInPostsRequired: hackathon.linkedInPostsRequired,
  }))

  const filteredHackathons = transformedHackathons.filter((hackathon) => {
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
            {filteredHackathons.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">No hackathons available</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || activeTab !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "There are no hackathons available at the moment. Check back later!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} getStatusColor={getStatusColor} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
