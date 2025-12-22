"use client"

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { HackathonCard } from "./hackathon-card"
import { Plus, Loader2 } from "lucide-react"
import { usePaginatedQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import Link from "next/link"
import { useQueryState } from "nuqs"

export function HackathonsInterface() {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  })
  const [activeTab, setActiveTab] = useQueryState("status", {
    defaultValue: "all",
    clearOnDefault: true,
  })

  // Prepare query arguments
  const queryArgs = {
    status: activeTab && activeTab !== "all" 
      ? (activeTab as "open" | "upcoming" | "in-progress" | "completed" | "closed")
      : undefined,
    search: searchQuery && searchQuery.trim() !== "" ? searchQuery.trim() : undefined,
  }

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.hackathon.getHackathons,
    queryArgs,
    { initialNumItems: 6 }
  )

  // Transform database results to match HackathonCard interface
  const transformedHackathons = (results ?? []).map((hackathon) => ({
    id: hackathon._id as string,
    title: hackathon.title,
    description: hackathon.description,
    registrationStart: hackathon.registrationStart,
    registrationEnd: hackathon.registrationEnd,
    hackathonStart: hackathon.hackathonStart,
    hackathonEnd: hackathon.hackathonEnd,
    participants: hackathon.participantCount ?? 0,
    maxParticipants: hackathon.maxParticipants,
    status: hackathon.status,
    location: hackathon.location,
    prize: hackathon.prize,
    requiresLinkedInPosts: hackathon.requireLinkedIn,
    linkedInPostsRequired: hackathon.linkedInPostsRequired,
  }))

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
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/dashboard/hackathons/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Hackathon
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search hackathons..."
          value={searchQuery ?? ""}
          onChange={(e) => setSearchQuery(e.target.value || null)}
          className="max-w-md"
        />

        <Tabs value={activeTab ?? "all"} onValueChange={(value) => setActiveTab(value === "all" ? null : value)}>
          <TabsList className="flex flex-wrap w-full h-auto min-h-9 sm:inline-flex sm:w-fit sm:flex-nowrap sm:h-9">
            <TabsTrigger value="all" className="sm:flex-1">All</TabsTrigger>
            <TabsTrigger value="open" className="sm:flex-1">Open</TabsTrigger>
            <TabsTrigger value="upcoming" className="sm:flex-1">Upcoming</TabsTrigger>
            <TabsTrigger value="closed" className="sm:flex-1">Closed</TabsTrigger>
            <TabsTrigger value="in-progress" className="sm:flex-1">In-Progress</TabsTrigger>
            <TabsTrigger value="completed" className="sm:flex-1">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && status === "LoadingFirstPage" ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading hackathons...</p>
                  </div>
                </CardContent>
              </Card>
            ) : transformedHackathons.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">No hackathons available</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || (activeTab && activeTab !== "all")
                        ? "Try adjusting your search or filter criteria"
                        : "There are no hackathons available at the moment. Check back later!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {transformedHackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} getStatusColor={getStatusColor} />
                  ))}
                </div>
                {(status === "CanLoadMore" || status === "LoadingMore") && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => loadMore(6)}
                      disabled={status === "LoadingMore"}
                      variant="outline"
                      className="min-w-[120px]"
                    >
                      {status === "LoadingMore" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
                {status === "Exhausted" && transformedHackathons.length > 0 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">No more hackathons to load</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
